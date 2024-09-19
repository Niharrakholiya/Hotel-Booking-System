import React from 'react';
import { Input } from "@/components/ui/input";
import { Search, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SearchBar = () => {
  return (
    <div className="bg-gradient-to-b from-gray-100 to-white py-8 w-full">
      <div className="w-full px-4">
        <h1 className="text-3xl font-bold text-center mb-2">
          Save up to 35% on your next hotel stay
        </h1>
        <p className="text-center text-gray-600 mb-6">
          We compare hotel prices from 100s of sites
        </p>

        <div className="bg-white rounded-lg shadow-lg p-2 flex flex-wrap md:flex-nowrap w-full">
          <div className="w-full md:w-1/4 mb-2 md:mb-0 md:mr-2">
            <label className="block text-xs text-gray-500 mb-1">Landmark</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-600" />
              <Input 
                type="text" 
                placeholder="Where to?" 
                className="pl-10 w-full h-10 border-none" 
              />
            </div>
          </div>

          <div className="w-full md:w-1/5 mb-2 md:mb-0 md:mr-2">
            <label className="block text-xs text-gray-500 mb-1">Check in</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-600" />
              <Input 
                type="text" 
                placeholder="-- / -- / --" 
                className="pl-10 w-full h-10 border-none" 
                onFocus={(e) => e.target.type = 'date'}
                onBlur={(e) => e.target.type = 'text'}
              />
            </div>
          </div>

          <div className="w-full md:w-1/5 mb-2 md:mb-0 md:mr-2">
            <label className="block text-xs text-gray-500 mb-1">Check out</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-600" />
              <Input 
                type="text" 
                placeholder="-- / -- / --" 
                className="pl-10 w-full h-10 border-none" 
                onFocus={(e) => e.target.type = 'date'}
                onBlur={(e) => e.target.type = 'text'}
              />
            </div>
          </div>

          <div className="w-full md:w-1/5 mb-2 md:mb-0 md:mr-2">
            <label className="block text-xs text-gray-500 mb-1">Guests and rooms</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-600" />
              <Input 
                type="text" 
                placeholder="2 Guests, 1 Room" 
                className="pl-10 w-full h-10 border-none" 
              />
            </div>
          </div>

          <div className="w-full md:w-auto flex items-end">
            <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white h-10 px-8">
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
