const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for tracking room availability
const roomAvailabilitySchema = new Schema({
  room: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  totalRooms: {
    type: Number,
    required: true
  },
  bookedRooms: {
    type: Number,
    default: 0
  },
  availableRooms: {
    type: Number,
    required: true
  },
  // Track individual bookings for this date
  bookings: [{
    type: Schema.Types.ObjectId,
    ref: 'Booking'
  }]
});

// Compound index for quick lookups
roomAvailabilitySchema.index({ room: 1, date: 1 }, { unique: true });

const RoomAvailability = mongoose.model('RoomAvailability', roomAvailabilitySchema);

// Helper function to generate date range
const getDatesInRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);
  
  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

// Utility functions for availability management
const availabilityUtils = {
  // Initialize availability records for a room
  async initializeAvailability(roomId, capacity, startDate, endDate) {
    const dates = getDatesInRange(startDate, endDate);
    const operations = dates.map(date => ({
      updateOne: {
        filter: { room: roomId, date },
        update: {
          $setOnInsert: {
            totalRooms: capacity,
            bookedRooms: 0,
            availableRooms: capacity
          }
        },
        upsert: true
      }
    }));

    await RoomAvailability.bulkWrite(operations);
  },

  // Check availability for a date range
  async checkAvailability(roomId, checkIn, checkOut, requestedRooms = 1) {
    const dates = getDatesInRange(checkIn, checkOut);
    
    // Get availability records for all dates
    const availabilityRecords = await RoomAvailability.find({
      room: roomId,
      date: { $gte: checkIn, $lte: checkOut }
    });

    // Get room details to handle dates without records
    const room = await mongoose.model('Room').findById(roomId);
    if (!room) throw new Error('Room not found');

    // Check availability for each date
    const availability = dates.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      const record = availabilityRecords.find(r => 
        r.date.toISOString().split('T')[0] === dateStr
      );
      
      return record ? record.availableRooms : room.capacity;
    });

    const minimumAvailable = Math.min(...availability);
    return {
      available: minimumAvailable >= requestedRooms,
      availableRooms: minimumAvailable,
      requestedRooms
    };
  },

  // Reserve rooms for a booking
  async reserveRooms(bookingId, roomId, checkIn, checkOut, numberOfRooms) {
    const dates = getDatesInRange(checkIn, checkOut);
    const operations = [];

    // Check current availability first
    const availability = await this.checkAvailability(roomId, checkIn, checkOut, numberOfRooms);
    if (!availability.available) {
      throw new Error('Insufficient room availability for the selected dates');
    }

    // Create update operations for each date
    for (const date of dates) {
      operations.push({
        updateOne: {
          filter: { room: roomId, date },
          update: {
            $inc: { 
              bookedRooms: numberOfRooms,
              availableRooms: -numberOfRooms 
            },
            $push: { bookings: bookingId }
          },
          upsert: true
        }
      });
    }

    await RoomAvailability.bulkWrite(operations);
  },

  // Release rooms when booking is cancelled
  async releaseRooms(bookingId, roomId, checkIn, checkOut, numberOfRooms) {
    const dates = getDatesInRange(checkIn, checkOut);
    const operations = dates.map(date => ({
      updateOne: {
        filter: { 
          room: roomId, 
          date,
          bookings: bookingId // Only update if booking exists
        },
        update: {
          $inc: { 
            bookedRooms: -numberOfRooms,
            availableRooms: numberOfRooms 
          },
          $pull: { bookings: bookingId }
        }
      }
    }));

    await RoomAvailability.bulkWrite(operations);
  },

  // Get detailed availability for a date range
  async getAvailabilityDetails(roomId, startDate, endDate) {
    const dates = getDatesInRange(startDate, endDate);
    const records = await RoomAvailability.find({
      room: roomId,
      date: { $gte: startDate, $lte: endDate }
    }).populate('bookings', 'checkIn checkOut numberOfRooms');

    const room = await mongoose.model('Room').findById(roomId);
    if (!room) throw new Error('Room not found');

    return dates.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      const record = records.find(r => 
        r.date.toISOString().split('T')[0] === dateStr
      );

      return {
        date: dateStr,
        totalRooms: room.capacity,
        bookedRooms: record ? record.bookedRooms : 0,
        availableRooms: record ? record.availableRooms : room.capacity,
        bookings: record ? record.bookings : []
      };
    });
  }
};

module.exports = {
  RoomAvailability,
  availabilityUtils
};