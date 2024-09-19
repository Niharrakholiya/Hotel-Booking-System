import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import HotelCard from '../cards/ExploreCard';
import styled from 'styled-components';

// Styled component for the scroll container with hidden scrollbar
const ScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer and Edge */
  gap: 59px; /* Space between cards */
  padding: 0 8px; /* Padding to prevent the last card from being cut off */
  
  &::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
`;

// Styled button for navigation
const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: white;
  border: none;
  border-radius: 50%;
  padding: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  z-index: 10;

  &:focus {
    outline: none;
  }
`;

// Sample hotels array
const hotels = [
  { id: 1, name: "Sunset Beach Resort", location: "Goa" },
  { id: 2, name: "Mountain View Hotel", location: "Ooty" },
  { id: 3, name: "Taj Mahal Palace", location: "Mumbai" },
  { id: 4, name: "The Imperial", location: "New Delhi" },
  { id: 5, name: "The Leela Palace", location: "Bangalore" },
  { id: 6, name: "Windflower Resort & Spa", location: "Munnar" },
  { id: 7, name: "The Machan", location: "Lonavala" },
];

const ExploreIndia = () => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scrollOneCard = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const cardWidth = container.querySelector('.hotel-card').offsetWidth;
      const gapWidth = 59; // Adjust this to match your gap value
      const scrollAmount = cardWidth + gapWidth; // Card width + gap between cards

      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.offsetWidth;
      const scrollableWidth = container.scrollWidth;
      const tolerance = 5; // Increased tolerance to account for small misalignments

      setCanScrollLeft(scrollLeft > 0);
      // Adjusting tolerance here to avoid showing the right button when the last card is fully visible
      setCanScrollRight(scrollLeft + containerWidth < scrollableWidth - tolerance);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold mb-2">Explore India</h2>
      <p className="text-gray-600 mb-6">These popular destinations have a lot to offer</p>
      
      <div className="relative">
        <ScrollContainer
          ref={scrollContainerRef}
          onScroll={checkScroll}
        >
          {hotels.map((hotel) => (
            <div key={hotel.id} className="flex-none hotel-card">
              {/* Wrapper div for card and name */}
              <div className="card-wrapper">
                <HotelCard {...hotel} />
                {/* Hotel name below the card */}
                <p className="text-center mt-2 text-lg font-semibold">{hotel.name}</p>
              </div>
            </div>
          ))}
        </ScrollContainer>
        
        {canScrollLeft && (
          <NavigationButton 
            onClick={() => scrollOneCard('left')} 
            style={{ left: 0 }}
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </NavigationButton>
        )}
        
        {canScrollRight && (
          <NavigationButton 
            onClick={() => scrollOneCard('right')} 
            style={{ right: 0 }}
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </NavigationButton>
        )}
      </div>
    </div>
  );
};

export default ExploreIndia;
