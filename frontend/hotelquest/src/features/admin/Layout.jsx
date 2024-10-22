import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Hotel, BedDouble, LogOut, Settings, User } from 'lucide-react';
import Cookies from 'js-cookie';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    Cookies.remove('jwt_token');
    navigate('/auth');
  };

  const navItems = [
    { path: '/Edit-details', label: 'Hotel Profile', icon: Hotel },
    { path: '/Edit-Room', label: 'Rooms', icon: BedDouble },
    
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-blue-600">HotelManager</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {navItems.map(({ path, label, icon: Icon }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium
                  ${location.pathname === path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-gray-50 border-t">
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">HotelManager</h3>
          <p className="text-gray-500 text-sm">
            Streamline your hotel operations with our comprehensive management system.
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="/help" className="text-gray-500 hover:text-blue-600 text-sm">Help Center</a>
            </li>
            <li>
              <a href="/terms" className="text-gray-500 hover:text-blue-600 text-sm">Terms of Service</a>
            </li>
            <li>
              <a href="/privacy" className="text-gray-500 hover:text-blue-600 text-sm">Privacy Policy</a>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Contact</h3>
          <ul className="space-y-2">
            <li className="text-gray-500 text-sm">Email: support@hotelmanager.com</li>
            <li className="text-gray-500 text-sm">Phone: +1 (555) 123-4567</li>
          </ul>
        </div>
      </div>
      
      <div className="border-t mt-8 pt-6 text-center">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} HotelManager. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navigation />
    <main className="flex-1 bg-gray-50">
      {children}
    </main>
    <Footer />
  </div>
);

export default Layout;