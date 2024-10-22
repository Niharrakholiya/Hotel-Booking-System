import React, { useState, useEffect } from 'react';
import { Map as MapLibreMap, NavigationControl, Marker, Popup } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import axios from 'axios';
import { MapPin } from 'lucide-react';

const apiKey = 'Ekab6xJdKU9YhawzXPNXxkUQtx02CdfDTAqDY3em';
// const location = '21.2049, 72.8411'; // Example location (latitude,longitude)

const Overview = ({ hotel }) => {
  const [mapReady, setMapReady] = useState(false);
  const [places, setPlaces] = useState([]);
  const [map, setMap] = useState(null);
  const [error, setError] = useState(null);
 // Extract coordinates from hotel data
 const latitude = hotel.location.coordinates[0];
 const longitude = hotel.location.coordinates[1];
 const location = `${latitude}, ${longitude}`;

  useEffect(() => {
    if (!mapReady) return;

    const newMap = new MapLibreMap({
      container: 'map-container',
      center: [latitude, longitude],
      zoom: 15,
      style: 'https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json',
      transformRequest: (url, resourceType) => {
        if (url.includes("?")) {
          url = url + "&api_key=" + apiKey;
        } else {
          url = url + "?api_key=" + apiKey;
        }
        return { url, resourceType };
      },
    });

    const nav = new NavigationControl({
      visualizePitch: true,
    });
    newMap.addControl(nav, 'top-left');

    // Add hotel marker
    new Marker({ color: '#FF0000' })
      .setLngLat([longitude, latitude])
      .setPopup(new Popup().setText("Hotel Location"))
      .addTo(newMap);

    setMap(newMap);

    return () => newMap.remove();
  }, [mapReady, latitude, longitude, hotel.name]);

  useEffect(() => {
    if (!map) return;

    const fetchNearbyPlaces = async () => {
      try {
        const response = await axios.get('https://api.olamaps.io/places/v1/nearbysearch', {
          params: {
            layers: 'venue',
            types: 'atm', // Search for both airports and restaurants
            location: location,
            radius: 50, // 50km radius
            api_key: apiKey
          },
          headers: {
            'X-Request-Id': 'your-request-id'
          }
        });

        console.log('API Response:', response.data); // Log the entire response

        if (response.data && response.data.results) {
          setPlaces(response.data.results);
          response.data.results.forEach(place => {
            if (place.geometry && place.geometry.location) {
              new Marker({ color: place.types.includes('airport') ? '#0000FF' : '#00FF00' })
                .setLngLat([place.geometry.location.lng, place.geometry.location.lat])
                .setPopup(new Popup().setText(place.name))
                .addTo(map);
            } else {
              console.error('Invalid place data:', place);
            }
          });
        } else {
          setError('No results found in the API response');
        }
      } catch (error) {
        console.error('Error fetching nearby places:', error);
        setError('Failed to fetch nearby places');
      }
    };

    fetchNearbyPlaces();
  }, [map,location]);

  return (
    <>
    <h1 className="text-xl font-semibold mb-4">Location</h1>
    <section className="mb-8 flex flex-col md:flex-row">
      {/* Location Text */}

      {/* Map Container */}
      <div className="w-full md:w-1/3 h-[40vh] md:h-[30vh] bg-gray-200 rounded-lg" id="map-container" ref={() => setMapReady(true)} />
      {/* Nearby Places */}
      <div className="w-full md:w-1/3 mt-4 md:mt-0 md:pl-8">
        <h2 className="text-2xl font-bold mb-4">Nearby Places</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Airports and Restaurants</h3>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : places.length > 0 ? (
          <ul className="space-y-2">
            {places.map((place, index) => (
              <li key={index} className="flex items-center">
                <MapPin className="mr-2" size={16} color={place.types.includes('airport') ? '#0000FF' : '#00FF00'} />
                {place.name} ({place.types.includes('airport') ? 'Airport' : 'railway station'})
              </li>
            ))}
          </ul>
        ) : (
          <p>No nearby places found.</p>
        )}
        </div>
      </div>
    </section>
    </>
  );
};

export default Overview;
