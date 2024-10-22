import React, { useState, useEffect } from 'react';
import { Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const LocationMarker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);

  const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const map = useMapEvents({
    click(e) {
      const newPosition = e.latlng;
      setPosition(newPosition);
      onLocationSelect(newPosition);
      map.flyTo(newPosition, map.getZoom());
    },
  });

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position} icon={customIcon} />
  );
};

export default LocationMarker;