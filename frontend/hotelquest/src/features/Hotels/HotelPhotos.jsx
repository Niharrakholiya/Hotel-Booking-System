import React from 'react';

const HotelPhotos = ({ hotel }) => {
  if (!hotel) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Photos</h2>
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-600">No hotel information available</p>
        </div>
      </section>
    );
  }

  const photos = hotel.photos || [];
  const hasPhotos = photos.length > 0;

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Photos</h2>
      {!hasPhotos ? (
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-600">No photos available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative aspect-video">
              <img
                  src={`http://localhost:5000/${photo.replace(/\\/g, '/')}`}
                  alt={`Room preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded"
                />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default HotelPhotos;