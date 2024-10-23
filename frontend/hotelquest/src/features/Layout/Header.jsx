import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPinIcon, MenuIcon, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, userRole,logout } = useAuth(); // Assume `user` contains user data and roles

  const handleLogout = () => {
    logout();
    // Additional logout logic if needed
  };

  // Assuming user contains a boolean `isHotel` field to identify hotel users
  const isHotel = userRole === 'hotel'; // Check if the user role is 'hotel'


console.log(isHotel);
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link to="/" className="flex items-center">
              <MapPinIcon className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">HotelQuest</span>
            </Link>
          </div>
          <div className="-mr-2 -my-2 md:hidden">
            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open menu</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </Button>
          </div>
          <nav className="hidden md:flex space-x-10">
            {isHotel ? (
              <>
                <Link to="/edit-details" className="text-base font-medium text-gray-500 hover:text-gray-900">
                  Edit Hotel
                </Link>
                <Link to="/edit-room" className="text-base font-medium text-gray-500 hover:text-gray-900">
                  Edit Rooms
                </Link>
              </>
            ) : (
              <>
                <Link to="/" className="text-base font-medium text-gray-500 hover:text-gray-900">
                  Home
                </Link>
                <Link to="/hotels" className="text-base font-medium text-gray-500 hover:text-gray-900">
                  Hotels
                </Link>
                <Link to="/deals" className="text-base font-medium text-gray-500 hover:text-gray-900">
                  Deals
                </Link>
                <Link to="/about" className="text-base font-medium text-gray-500 hover:text-gray-900">
                  About
                </Link>
              </>
            )}
          </nav>
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 space-x-4">
            {isAuthenticated ? (
              <Button
                onClick={handleLogout}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            ) : (
              <Link to="/auth">
                <Button
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <User className="mr-2 h-5 w-5" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <div>
                  <MapPinIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="-mr-2">
                  <Button
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  >
                    <span className="sr-only">Close menu</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </Button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid gap-y-8">
                  {isHotel ? (
                    <>
                      <Link to="/edit-hotel" className="text-base font-medium text-gray-900 hover:text-gray-700">
                        Edit Hotel
                      </Link>
                      <Link to="/edit-rooms" className="text-base font-medium text-gray-900 hover:text-gray-700">
                        Edit Rooms
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/" className="text-base font-medium text-gray-900 hover:text-gray-700">
                        Home
                      </Link>
                      <Link to="/hotels" className="text-base font-medium text-gray-900 hover:text-gray-700">
                        Hotels
                      </Link>
                      <Link to="/deals" className="text-base font-medium text-gray-900 hover:text-gray-700">
                        Deals
                      </Link>
                      <Link to="/about" className="text-base font-medium text-gray-900 hover:text-gray-700">
                        About
                      </Link>
                    </>
                  )}
                </nav>
              </div>
            </div>
            <div className="py-6 px-5 space-y-6">
              {isAuthenticated ? (
                <Button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Logout
                </Button>
              ) : (
                <Button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200">
                  <User className="mr-2 h-5 w-5" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
