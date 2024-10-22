// API route example
router.get('/api/rooms/:roomId/availability', async (req, res) => {
    try {
      const { roomId } = req.params;
      const { checkIn, checkOut } = req.query;
      
      const available = await availabilityUtils.getAvailability(
        roomId,
        new Date(checkIn),
        new Date(checkOut)
      );
      
      res.json({ availableRooms: available });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });