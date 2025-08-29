'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SideNavbar from '../../components/SideNavbar';
import HotelCard from '../../components/HotelCard';

const MOCK_RECOMMENDATIONS = [
  {
    id: 1,
    title: "Trip to Thailand & Get 30% off on flight booking",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    title: "Get additional 25% off on Bhutan tour fare",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 3,
    title: "Trip to Thailand & Get 30% off on flight booking",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 4,
    title: "Flat 40% off on hotel bookings in Agra",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  }
];

export default function ExploreResult() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('Search city, Country, Place for Travel advisory');
  const [hotels, setHotels] = useState([]);
  const [allHotels, setAllHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Update search query from URL parameters
  useEffect(() => {
    const query = searchParams.get('q') || searchParams.get('location') || '';
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  // Load hotel data from JSON
  useEffect(() => {
    const loadHotels = async () => {
      try {
        const response = await fetch('/api/hotels');
        if (!response.ok) {
          // Fallback: import JSON directly if API route doesn't exist
          const hotelData = await import('../../data/hotels.json');
          setAllHotels(hotelData.hotels || []);
        } else {
          const data = await response.json();
          setAllHotels(data.hotels || []);
        }
      } catch (error) {
        console.error('Error loading hotels:', error);
        // Fallback: import JSON directly
        try {
          const hotelData = await import('../../data/hotels.json');
          setAllHotels(hotelData.hotels || []);
        } catch (fallbackError) {
          console.error('Error loading fallback data:', fallbackError);
          setAllHotels([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadHotels();
  }, []);

  // Filter hotels based on search query
  useEffect(() => {
    if (allHotels.length > 0) {
      const query = searchParams.get('q') || searchParams.get('location') || '';
      if (query && query !== 'Search city, Country, Place for Travel advisory') {
        const filteredHotels = allHotels.filter(hotel => 
          hotel.name.toLowerCase().includes(query.toLowerCase()) ||
          hotel.location.toLowerCase().includes(query.toLowerCase()) ||
          hotel.description?.toLowerCase().includes(query.toLowerCase()) ||
          hotel.amenities?.some(amenity => amenity.toLowerCase().includes(query.toLowerCase()))
        );
        setHotels(filteredHotels);
      } else {
        setHotels(allHotels);
      }
    }
  }, [allHotels, searchParams]);

  const handleGoBack = () => {
    router.push('/');
  };

  const handleViewDetails = (hotel) => {
    console.log('View details for:', hotel.name);
    // Navigate to hotel details page with hotel ID
    router.push(`/exploreHotel?id=${hotel.id}`);
  };

  // Transform hotel data for display
  const formatHotelForDisplay = (hotel) => ({
    id: hotel.id,
    name: hotel.name,
    price: `Price starts from ${hotel.priceNumeric}/${hotel.currency === 'USD' ? 'night' : hotel.currency}`,
    image: hotel.image
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SideNavbar />
      
      {/* Main Content */}
      <div className="md:ml-[157px] pb-[100px] md:pb-0">
        {/* Mobile Header - Hotels */}
        <div className="bg-white p-4 shadow-sm md:hidden">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleGoBack}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M12 19L5 12L12 5" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-800">Hotels</h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 md:p-6 shadow-sm">
          {/* Desktop: Back arrow + Search input */}
          <div className="hidden md:flex items-center gap-4 max-w-4xl">
            <button 
              onClick={handleGoBack}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M12 19L5 12L12 5" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg border-none outline-none text-gray-600"
                placeholder="Search city, Country, Place for Travel advisory"
              />
            </div>
          </div>

          {/* Mobile: Search input only */}
          <div className="md:hidden">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 rounded-lg border-none outline-none text-gray-600"
              placeholder="Search city, Country, Place for Travel advisory"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex gap-8 p-6">
          {/* Main Content - Hotel Results */}
          <div className="flex-1">
            {/* Header with Sort/Filter */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-semibold text-gray-800">Best places to enjoy your stay</h1>
              <div className="flex gap-3">
                <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors">
                  Sort By
                </button>
                <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors">
                  Filter
                </button>
              </div>
            </div>

            {/* Hotel Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                // Loading state
                <div className="col-span-full text-center py-8">
                  <div className="text-gray-500">Loading hotels...</div>
                </div>
              ) : hotels.length > 0 ? (
                hotels.map((hotel) => (
                  <HotelCard 
                    key={hotel.id} 
                    hotel={formatHotelForDisplay(hotel)} 
                    onViewDetails={handleViewDetails}
                  />
                ))
              ) : (
                // No hotels found
                <div className="col-span-full text-center py-8">
                  <div className="text-gray-500">No hotels found</div>
                </div>
              )}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-8">
              <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Load More Hotels
              </button>
            </div>
          </div>

          {/* Right Sidebar - Recommendations */}
          <div className="w-80 hidden lg:block">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Recommended</h2>
              
              <div className="space-y-4">
                {MOCK_RECOMMENDATIONS.map((rec) => (
                  <div key={rec.id} className="relative rounded-lg overflow-hidden">
                    {/* Recommendation Image */}
                    <div className="relative h-32">
                      <img
                        src={rec.image}
                        alt={rec.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                    </div>
                    
                    {/* Recommendation Text */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-sm font-medium leading-tight">
                        {rec.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
