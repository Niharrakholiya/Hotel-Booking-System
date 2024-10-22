import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Search, Loader2, Hotel, MapPin, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  // Debounce search function
  const debouncedSearch = debounce(async (term) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:5000/api/hotels/search`, {
        params: { searchTerm: term }
      });

      if (response.data.success) {
        setResults(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error searching hotels');
    } finally {
      setIsLoading(false);
    }
  }, 300);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsSearchOpen(true);
    debouncedSearch(value);
  };

  const handleHotelSelect = (hotelId) => {
    setIsSearchOpen(false);
    setSearchTerm('');
    navigate(`/hotels/${hotelId}`);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
    setIsSearchOpen(false);
  };
  console.log('Hotel data:', results[0]); // Add this inside your component to see the data structure
  return (
    <div className="relative bg-gradient-to-b from-gray-100 to-white py-8 w-full">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-2">
          Save up to 35% on your next hotel stay
        </h1>
        <p className="text-center text-gray-600 mb-6">
          We compare hotel prices from 100s of sites
        </p>
        <div className="relative bg-white rounded-2xl shadow-xl p-6 flex flex-col md:flex-row items-center gap-8">
          {/* Creative Illustration */}
          <div className="hidden md:block md:w-1/2 lg:w-2/3 p-4">
            <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              {/* Background shapes */}
              <rect x="0" y="0" width="400" height="300" fill="#f8fafc"/>
              <path d="M0 250 Q200 200 400 250 L400 300 L0 300 Z" fill="#e2e8f0"/>
              
              {/* Hotel building */}
              <rect x="100" y="50" width="200" height="200" fill="#3b82f6" rx="8"/>
              <rect x="110" y="60" width="180" height="180" fill="#60a5fa" rx="4"/>
              
              {/* Windows */}
              <g fill="#e0f2fe">
                <rect x="130" y="80" width="30" height="30" rx="2"/>
                <rect x="170" y="80" width="30" height="30" rx="2"/>
                <rect x="210" y="80" width="30" height="30" rx="2"/>
                <rect x="130" y="120" width="30" height="30" rx="2"/>
                <rect x="170" y="120" width="30" height="30" rx="2"/>
                <rect x="210" y="120" width="30" height="30" rx="2"/>
                <rect x="130" y="160" width="30" height="30" rx="2"/>
                <rect x="170" y="160" width="30" height="30" rx="2"/>
                <rect x="210" y="160" width="30" height="30" rx="2"/>
              </g>
              
              {/* Entrance */}
              <rect x="170" y="200" width="60" height="50" fill="#1d4ed8"/>
              <rect x="180" y="210" width="40" height="40" fill="#bfdbfe"/>
              
              {/* Decorative elements */}
              <circle cx="50" cy="100" r="20" fill="#93c5fd" opacity="0.5"/>
              <circle cx="350" cy="150" r="25" fill="#93c5fd" opacity="0.5"/>
              <path d="M300 50 Q320 30 340 50 T380 50" stroke="#60a5fa" fill="none" strokeWidth="3"/>
              <path d="M20 200 Q40 180 60 200 T100 200" stroke="#60a5fa" fill="none" strokeWidth="3"/>
            </svg>
          </div>

          {/* Search Form */}
          <div className="w-full md:w-1/2 lg:w-1/3 space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Find Your Perfect Stay</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Enter location or hotel name"
                  className="pl-10 pr-10 w-full h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {isSearchOpen && (searchTerm || isLoading || error) && (
                <div className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-96 overflow-y-auto">
                  {isLoading && (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="animate-spin text-blue-500" />
                      <span className="ml-2 text-sm text-gray-600">Searching hotels...</span>
                    </div>
                  )}

                  {error && (
                    <div className="p-4 text-red-500 text-sm text-center">
                      {error}
                    </div>
                  )}

                  {!isLoading && !error && results.length === 0 && searchTerm && (
                    <div className="p-4 text-sm text-gray-500 text-center">
                      No hotels found 
                    </div>
                  )}

                  {!isLoading && !error && results.map((hotel) => (
                    <button
                      key={hotel._id}
                      onClick={() => handleHotelSelect(hotel._id)}
                      className="w-full text-left p-4 hover:bg-gray-50 flex items-start gap-4 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex-shrink-0">
                        <Hotel className="text-blue-500" size={24} />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {hotel.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-500 truncate">
  {hotel.location.address || hotel.location.city || hotel.formattedAddress}
</span>
                        </div>
                        {hotel.rating && (
                          <div className="flex items-center gap-1 mt-1">
                            <Star size={14} className="text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{hotel.rating}</span>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <Button 
              onClick={() => navigate('/hotels')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Search Hotels
            </Button>
            
            <p className="text-xs text-gray-500 text-center">
              Best prices guaranteed • No booking fees • Real guest reviews
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;