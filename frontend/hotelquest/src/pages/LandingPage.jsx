import React, { useState } from 'react';
import { Sun, Moon, Coffee, Wifi, Car } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import PoolIcon from '@mui/icons-material/Pool';
import { useAuth } from '../features/auth/AuthContext';
import { useNavigate } from 'react-router-dom';

// SVG Component for wavy decoration
const WaveDecoration = () => (
  <svg viewBox="0 0 1440 120" className="w-full">
    <path
      d="M0 64.5L48 69.5C96 75 192 85 288 85.8C384 86.7 480 78.3 576 75.2C672 72 768 74 864 77.3C960 80.7 1056 85.3 1152 83.5C1248 81.7 1344 73.3 1392 69.2L1440 64.5V121H1392C1344 121 1248 121 1152 121C1056 121 960 121 864 121C768 121 672 121 576 121C480 121 384 121 288 121C192 121 96 121 48 121H0V64.5Z"
      fill="currentColor"
      className="text-blue-50"
    />
  </svg>
);

// SVG Component for hotel building
const HotelBuilding = () => (
  <svg viewBox="0 0 200 300" className="w-64 h-96">
    <rect x="40" y="100" width="120" height="200" fill="#2563EB" />
    <rect x="30" y="80" width="140" height="20" fill="#1D4ED8" />
    {/* Windows */}
    {[0, 1, 2, 3, 4].map((row) => (
      <g key={row}>
        {[0, 1, 2].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={60 + col * 30}
            y={120 + row * 40}
            width="20"
            height="30"
            fill={Math.random() > 0.3 ? "#FBBF24" : "#1E3A8A"}
          />
        ))}
      </g>
    ))}
    {/* Entrance */}
    <rect x="85" y="260" width="30" height="40" fill="#1E3A8A" />
    <circle cx="100" cy="280" r="2" fill="#FBBF24" />
  </svg>
);

const CreativeHotelLanding = () => {
  const [isNight, setIsNight] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAuth();
console.log(isAuthenticated)
  const handleNavigationClick = () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    if (userRole === 'hotel') {
      console.log('Redirecting to /edit-room');
      navigate('/edit-room');
    } else if (userRole === 'customer') {
      console.log('Redirecting to /hotels');
      navigate('/hotels');
    } else {
      console.log('No role matched');
    }
  };

  const getButtonText = () => {
    if (!isAuthenticated) return 'Take a Tour';
    return userRole === 'hotel' ? 'Add Hotel' : 'Take a Tour';
  };
  return (
    <div className={`min-h-screen transition-colors duration-1000 ${isNight ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          {/* Time Toggle */}
          <div className="absolute top-8 right-8">
            <button
              onClick={() => setIsNight(!isNight)}
              className={`p-3 rounded-full transition-colors duration-300 ${
                isNight ? 'bg-gray-800 text-yellow-400' : 'bg-blue-100 text-blue-600'
              }`}
            >
              {isNight ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
            </button>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeIn">
              <h1 className={`text-5xl font-bold mb-6 ${isNight ? 'text-white' : 'text-gray-900'}`}>
                Welcome to Our
                <span className="block text-blue-600">Creative Hotel</span>
              </h1>
              <p className={`text-xl mb-8 ${isNight ? 'text-gray-300' : 'text-gray-600'}`}>
                Where imagination meets comfort. Experience a stay like no other.
              </p>
              <div className="flex space-x-4">
                <button   onClick={handleNavigationClick} // Ensure this is correct
className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300">
                {getButtonText()}
                </button>
                <button className={`px-6 py-3 rounded-full border-2 transition-colors duration-300 ${
                  isNight 
                    ? 'border-gray-700 text-gray-300 hover:bg-gray-800' 
                    : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                }`}>
                  Learn More
                </button>
              </div>
            </div>

            <div className="relative animate-slideIn">
              <HotelBuilding />
              {/* Decorative elements */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-64 h-64 bg-blue-400 rounded-full opacity-10 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
        <WaveDecoration />
      </div>

      {/* Features Section */}
      <div className={`py-20 transition-colors duration-1000 ${isNight ? 'bg-gray-800' : 'bg-blue-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Coffee, title: 'Café & Bar' },
              { icon: Wifi, title: 'Fast WiFi' },
              { icon: Car, title: 'Free Parking' },
              { icon: PoolIcon, title: 'Indoor Pool' }
            ].map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl transform hover:scale-105 transition-all duration-300 ${
                  isNight 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-white text-gray-900'
                } shadow-lg animate-fadeIn`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <feature.icon className="w-8 h-8 mb-4 text-blue-600" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className={isNight ? 'text-gray-300' : 'text-gray-600'}>
                  Experience world-class amenities designed for your comfort.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Elements */}
     

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-slideIn {
          animation: slideIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CreativeHotelLanding;