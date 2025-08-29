'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SideNavbar from '../../components/SideNavbar';

export default function ExploreHotel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hotelData, setHotelData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHotelDetails = async () => {
      try {
        const hotelId = searchParams.get('id') || '1';
        
        // Try to fetch from API first
        try {
          const response = await fetch(`/api/hotels/${hotelId}`);
          if (response.ok) {
            const hotel = await response.json();
            setHotelData(transformHotelData(hotel));
            return;
          }
        } catch (apiError) {
          console.log('API not available, using fallback');
        }
        
        // Fallback: load from JSON directly
        const hotelsData = await import('../../data/hotels.json');
        const hotel = hotelsData.hotels.find(h => h.id === parseInt(hotelId));
        
        if (hotel) {
          setHotelData(transformHotelData(hotel));
        } else {
          console.error('Hotel not found');
        }
      } catch (error) {
        console.error('Error loading hotel details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHotelDetails();
  }, [searchParams]);

  // Transform API data to match component expectations
  const transformHotelData = (hotel) => {
    return {
      name: hotel.name,
      location: hotel.location,
      rating: hotel.rating,
      ratingText: getRatingText(hotel.rating),
      reviews: hotel.reviews,
      price: `${hotel.priceNumeric} ${hotel.currency}`,
      description: hotel.description,
      images: [
        hotel.image,
        hotel.image, // Using same image for demo
        hotel.image,
        hotel.image
      ],
      ratings: {
        housekeeping: Math.min(hotel.rating, 5),
        food: Math.min(hotel.rating + 0.2, 5),
        service: Math.min(hotel.rating + 0.1, 5),
        staff: Math.min(hotel.rating - 0.1, 5)
      },
      amenities: hotel.amenities || [],
      rooms: [
        {
          type: "Deluxe Room",
          price: `${Math.round(hotel.priceNumeric * 1.2)} ${hotel.currency}/night`,
          image: hotel.image
        },
        {
          type: "Standard Room",
          price: `${hotel.priceNumeric} ${hotel.currency}/night`,
          image: hotel.image
        }
      ]
    };
  };

  const getRatingText = (rating) => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 4.0) return "Very Good";
    if (rating >= 3.5) return "Good";
    if (rating >= 3.0) return "Fair";
    return "Poor";
  };

  const handleGoBack = () => {
    router.push('/exploreResult');
  };

  const handleBookNow = () => {
    const hotelId = searchParams.get('id') || '1';
    router.push(`/review?id=${hotelId}`);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<span key={i} className="text-gray-300">★</span>);
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading hotel details...</div>
      </div>
    );
  }

  if (!hotelData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Hotel not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SideNavbar />
      
      <div className="md:ml-[157px] pb-[100px] md:pb-0">
        {/* Search Bar */}
        <div className="bg-white p-4 md:p-6 shadow-sm">
          {/* Mobile Layout */}
          <div className="md:hidden">
            {/* Header with back button and title - Mobile Only */}
            <div className="flex items-center gap-4 mb-4">
              <button onClick={handleGoBack} className="p-2 hover:bg-gray-100 rounded-full">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5M12 19L5 12L12 5" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <h2 className="text-lg font-semibold text-gray-800">Hotel details</h2>
            </div>

            {/* Search Input */}
            <div className="mb-4">
              <input
                type="text"
                defaultValue="Search city, Country, Place for Travel advisory"
                className="w-full px-4 py-3 bg-gray-100 rounded-lg border-none outline-none text-gray-600 text-sm"
              />
            </div>
            
            {/* Search Filters - Mobile Stacked */}
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Where are you going?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="text"
                defaultValue="20 Dec,2020"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="text"
                defaultValue="21 Dec,2020"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="text"
                defaultValue="2 adult, 0 children - 1 room"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
              />
              <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                Search
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:block">
            {/* Back button and search input row */}
            <div className="flex items-center gap-4 mb-4">
              <button onClick={handleGoBack} className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5M12 19L5 12L12 5" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <input
                type="text"
                defaultValue="Search city, Country, Place for Travel advisory"
                className="flex-1 px-4 py-3 bg-gray-100 rounded-lg border-none outline-none text-gray-600 text-sm"
              />
            </div>
            
            {/* Filter inputs row */}
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Where are you going?"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="text"
                defaultValue="20 Dec,2020"
                className="w-36 px-4 py-3 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="text"
                defaultValue="21 Dec,2020"
                className="w-36 px-4 py-3 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="text"
                defaultValue="2 adult, 0 children - 1 room"
                className="w-56 px-4 py-3 border border-gray-300 rounded-lg text-sm"
              />
              <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-6">
          {/* Mobile: Single Column Layout */}
          <div className="md:flex md:gap-8">
            {/* Left Content */}
            <div className="flex-1">
              {/* Hotel Images */}
              <div className="mb-6">
                {/* Mobile: Single main image */}
                <div className="block md:hidden mb-4">
                  <img
                    src={hotelData.images[0]}
                    alt={hotelData.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                
                {/* Desktop: Grid layout */}
                <div className="hidden md:grid md:grid-cols-2 gap-2">
                  <div className="relative">
                    <img
                      src={hotelData.images[0]}
                      alt={hotelData.name}
                      className="w-full h-80 object-cover rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {hotelData.images.slice(1, 4).map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`${hotelData.name} view ${index + 2}`}
                          className="w-full h-39 object-cover rounded-lg"
                        />
                        {index === 2 && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                            <span className="text-white font-semibold">See all</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hotel Info */}
              <div className="bg-white rounded-lg p-4 md:p-6 mb-6">
                <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-2">{hotelData.name}</h1>
                <p className="text-gray-600 mb-4">{hotelData.location}</p>
                
                {/* Mobile: Compact rating display */}
                <div className="flex items-center justify-between mb-4 md:justify-start md:gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold text-lg">
                      {hotelData.rating}
                    </div>
                    <div>
                      <div className="font-semibold">{hotelData.ratingText}</div>
                      <div className="text-sm text-gray-600">{hotelData.reviews}</div>
                    </div>
                  </div>
                  
                  {/* Mobile: Price on same row */}
                  <div className="text-right md:hidden">
                    <div className="text-lg font-bold text-blue-600">
                      Price Starting from {hotelData.price}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-red-500 mb-4">
                  <span>🔥</span>
                  <span className="text-sm">{hotelData.description}</span>
                </div>
                
                {/* Desktop: Price display */}
                <div className="hidden md:block text-right">
                  <div className="text-2xl font-bold text-blue-600">Price Starting from {hotelData.price}</div>
                </div>
              </div>

              {/* Mobile: Ratings Section */}
              <div className="bg-white rounded-lg p-4 mb-6 md:hidden">
                <h3 className="font-bold mb-4">Ratings</h3>
                
                {/* Individual Ratings */}
                <div className="space-y-3 mb-6">
                  {Object.entries(hotelData.ratings).map(([category, rating]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="capitalize">{category}</span>
                      <div className="flex">{renderStars(rating)}</div>
                    </div>
                  ))}
                </div>

                <h3 className="font-bold mb-4">Services</h3>
                <div className="flex gap-3 mb-6">
                  {hotelData.amenities.slice(0, 5).map((amenity, index) => (
                    <div key={index} className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600">🏨</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Room Options */}
              <div className="bg-white rounded-lg p-4 md:p-6">
                <h2 className="text-xl font-bold mb-4">Room Options</h2>
                
                {/* Mobile: Stacked layout */}
                <div className="space-y-4 md:hidden">
                  {hotelData.rooms.map((room, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <img
                        src={room.image}
                        alt={room.type}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold mb-2">{room.type}</h3>
                        <div className="text-blue-600 font-bold mb-3">{room.price}</div>
                        <button 
                          onClick={handleBookNow}
                          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Desktop: Side by side layout */}
                <div className="hidden md:flex md:gap-4">
                  {hotelData.rooms.map((room, index) => (
                    <div key={index} className="flex-1 border rounded-lg overflow-hidden">
                      <img
                        src={room.image}
                        alt={room.type}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold mb-2">{room.type}</h3>
                        <div className="text-blue-600 font-bold mb-3">{room.price}</div>
                        <button 
                          onClick={handleBookNow}
                          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Desktop Only */}
            <div className="hidden md:block w-80">
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-bold mb-4">Ratings</h3>
                
                {/* Individual Ratings */}
                <div className="space-y-3 mb-6">
                  {Object.entries(hotelData.ratings).map(([category, rating]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="capitalize">{category}</span>
                      <div className="flex">{renderStars(rating)}</div>
                    </div>
                  ))}
                </div>

                <h3 className="font-bold mb-4">Services</h3>
                <div className="flex gap-3 mb-6">
                  {hotelData.amenities.map((amenity, index) => (
                    <div key={index} className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600">🏨</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
