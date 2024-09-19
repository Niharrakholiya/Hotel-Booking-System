import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchIcon } from 'lucide-react';

const HeroSection = () => {
  return (
<section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
              Find Your Perfect Stay
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
              Discover and book the best hotels worldwide. Your dream vacation is just a click away.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <form className="flex space-x-2">
            <Input className="flex-1 bg-white/90 placeholder-gray-500" placeholder="Where are you going?" type="text" />
                <Button type="submit" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                <SearchIcon className="mr-2 h-4 w-4" />
                Search
                </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;