'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSearch } from '../../contexts/SearchContext';
import SideNavbar from '../../components/SideNavbar';
import SearchHeader from '../../components/SearchHeader';
import RoomCard from '../../components/RoomCard';
import { CarIcon2, WifiIcon, GymIcon, BathIcon, DrinkIcon, HotelIcon } from '../../../assets/icons/index';

export default function ExploreHotel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { 
    searchState, 
    setLocation, 
    setCheckIn, 
    setCheckOut, 
    setGuests, 
    setRoomType,
    formatDateForDisplay,
    calculateNights 
  } = useSearch();
  
  const [hotelData, setHotelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasInitialized = useRef(false);

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

  // Sync URL params with search context only once on initial load
  useEffect(() => {
    if (hasInitialized.current) return;
    
    const urlCheckIn = searchParams.get('checkIn');
    const urlCheckOut = searchParams.get('checkOut');
    const urlGuests = searchParams.get('guests');
    const urlRoomType = searchParams.get('roomType');
    const urlLocation = searchParams.get('location');
    
    // Update context if URL params exist and are different
    if (urlCheckIn && urlCheckIn !== searchState.checkIn) {
      setCheckIn(urlCheckIn);
    }
    if (urlCheckOut && urlCheckOut !== searchState.checkOut) {
      setCheckOut(urlCheckOut);
    }
    if (urlGuests && urlGuests !== searchState.guests) {
      setGuests(urlGuests);
    } else if (!urlGuests && searchState.guests === 'All Guests') {
      // If no guests in URL and current state is 'All Guests', keep it
      // This means user selected "All Guests" in search
    } else if (!urlGuests) {
      // If no guests in URL, set default
      setGuests('2 adult, 0 children - 1 room');
    }
    if (urlRoomType && urlRoomType !== searchState.roomType) {
      setRoomType(urlRoomType);
    }
    if (urlLocation && urlLocation !== searchState.location) {
      setLocation(urlLocation);
    }
    
    hasInitialized.current = true;
  }, [searchParams, setCheckIn, setCheckOut, setGuests, setRoomType, setLocation]);

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
      guests: hotel.guests || [],
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

  const handleBookNow = (room) => {
    const hotelId = searchParams.get('id') || '1';
    
    // Use search context values for booking
    const checkIn = searchState.checkIn;
    const checkOut = searchState.checkOut;
    const guestsValue = searchState.guests;
    const nights = calculateNights(checkIn, checkOut);
    
    // Create URL with all parameters
    const params = new URLSearchParams({
      id: hotelId,
      roomType: room.type,
      checkIn: checkIn,
      checkOut: checkOut,
      guests: guestsValue,
      days: nights.toString()
    });
    
    router.push(`/review?${params.toString()}`);
  };



  // Helper function to get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Helper function to get appropriate icon for amenity
  const getAmenityIcon = (amenity, index) => {
    const amenityIcons = [
      { component: CarIcon2, label: "Car Service" },
      { component: BathIcon, label: "Bath" },
      { component: DrinkIcon, label: "Restaurant" },
      { component: WifiIcon, label: "WiFi" },
      { component: GymIcon, label: "Gym" }
    ];
    
    // Use modulo to cycle through icons if more amenities than icons
    const iconData = amenityIcons[index % amenityIcons.length];
    return iconData;
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
        <SearchHeader 
          title="Hotel details"
          showMobileTitle={false}
          showSearchInput={true}
          showFilters={true}
        />

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

              {/* Hotel Info - Compact Layout */}
              <div className="bg-white rounded-lg p-4 md:p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">{hotelData.name}</h1>
                    <p className="text-gray-500 text-sm md:text-base">{hotelData.location}</p>
                  </div>
                  
                  <div className="text-right">
                    <div style={{ borderColor: '#2D3DDF', color: '#2D3DDF' }} className="border px-3 py-2 rounded-lg text-sm font-medium">
                      Price Starting from {hotelData.price}
                    </div>
                  </div>
                </div>
              </div>

              {/* Date Selection Section */}
              <div className="bg-white rounded-lg p-4 md:p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Select Your Dates</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Check-in Date */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Check-in</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={searchState.checkIn}
                        min={getMinDate()}
                        onChange={(e) => setCheckIn(e.target.value)}
                        style={{color: 'gray'}}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="mt-1 text-xs text-gray-500">
                        {searchState.checkIn ? formatDateForDisplay(searchState.checkIn) : 'Select date'}
                      </div>
                    </div>
                  </div>

                  {/* Check-out Date */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Check-out</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={searchState.checkOut}
                        min={searchState.checkIn ? (() => {
                          const nextDay = new Date(searchState.checkIn);
                          nextDay.setDate(nextDay.getDate() + 1);
                          return nextDay.toISOString().split('T')[0];
                        })() : getMinDate()}
                        onChange={(e) => setCheckOut(e.target.value)}
                        style={{color: 'gray'}}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="mt-1 text-xs text-gray-500">
                        {searchState.checkOut ? formatDateForDisplay(searchState.checkOut) : 'Select date'}
                      </div>
                    </div>
                  </div>

                  {/* Guests */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Guests</label>
                    <div className="relative">
                      <select
                        value={searchState.guests === 'All Guests' ? '2 adult, 0 children - 1 room' : searchState.guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                        style={{color: 'gray'}}
                      >
                        {hotelData?.guests?.filter(option => option !== 'All Guests').map((guestOption, index) => {
                          // Format the display text for better readability
                          const formatGuestOption = (option) => {
                            return option
                              .replace(/(\d+) adult/g, (match, num) => `${num} Adult${num > 1 ? 's' : ''}`)
                              .replace(/(\d+) children/g, (match, num) => `${num} Child${num > 1 ? 'ren' : ''}`)
                              .replace(/, 0 children/g, '')
                              .replace(/ - (\d+) room/g, (match, num) => ` - ${num} Room${num > 1 ? 's' : ''}`);
                          };
                          
                          return (
                            <option key={index} value={guestOption}>
                              {formatGuestOption(guestOption)}
                            </option>
                          );
                        }) || (
                          // Fallback options if hotel data not loaded yet
                          <>
                            <option value="1 adult, 0 children - 1 room">1 Adult - 1 Room</option>
                            <option value="2 adult, 0 children - 1 room">2 Adults - 1 Room</option>
                            <option value="2 adult, 1 children - 1 room">2 Adults, 1 Child - 1 Room</option>
                            <option value="2 adult, 2 children - 1 room">2 Adults, 2 Children - 1 Room</option>
                            <option value="3 adult, 0 children - 1 room">3 Adults - 1 Room</option>
                            <option value="4 adult, 0 children - 1 room">4 Adults - 1 Room</option>
                            <option value="2 adult, 0 children - 2 room">2 Adults - 2 Rooms</option>
                          </>
                        )}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Display selected dates summary */}
                {searchState.checkIn && searchState.checkOut && (
                  <div style={{ backgroundColor: '#EDF1FF' }} className="mt-4 p-3 rounded-lg">
                    <div className="flex flex-wrap items-center justify-between text-sm">
                      <div className="flex items-center gap-4 mb-2 md:mb-0">
                        <span className="text-gray-600">
                          <span className="font-medium">{formatDateForDisplay(searchState.checkIn)}</span> to <span className="font-medium">{formatDateForDisplay(searchState.checkOut)}</span>
                        </span>
                        <span style={{ backgroundColor: '#2D3DDF' }} className="text-white px-2 py-1 rounded text-xs">
                          {calculateNights(searchState.checkIn, searchState.checkOut)} night{calculateNights(searchState.checkIn, searchState.checkOut) > 1 ? 's' : ''}
                        </span>
                      </div>
                      <span className="text-gray-600 text-xs">
                        {searchState.guests === 'All Guests' ? '2 Adults - 1 Room' : searchState.guests}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile: Ratings Section */}
              <div className="bg-white rounded-lg p-4 mb-6 md:hidden">
                <h3 className="font-bold mb-4">Ratings</h3>
                
                {/* Individual Ratings */}
                <div className="space-y-3 mb-6">
                  {Object.entries(hotelData.ratings).map(([category, rating]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="capitalize text-gray-600">{category}</span>
                      <div className="flex">{renderStars(rating)}</div>
                    </div>
                  ))}
                </div>

                <h3 className="font-bold mb-4 text-gray-600">Services</h3>
                <div className="flex gap-3 mb-6">
                  {hotelData.amenities.slice(0, 5).map((amenity, index) => {
                    const iconData = getAmenityIcon(amenity, index);
                    const IconComponent = iconData.component;
                    return (
                      <div key={index} className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center" title={iconData.label}>
                        <IconComponent className="w-5 h-5 text-blue-600" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Room Options */}
              <div className="bg-white rounded-lg p-4 md:p-6">
                <h2 className="text-xl font-bold mb-4">Room Options</h2>
                
                {/* Room Cards in horizontal row layout */}
                <div className="flex flex-col md:flex-row gap-4">
                  {hotelData.rooms.map((room, index) => (
                    <RoomCard 
                      key={index} 
                      room={room} 
                      onBookNow={handleBookNow}
                      className="flex-1"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Desktop Only */}
            <div className="hidden md:block w-80">
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-bold mb-4 text-gray-600">Ratings</h3>
                
                {/* Individual Ratings */}
                <div className="space-y-3 mb-6">
                  {Object.entries(hotelData.ratings).map(([category, rating]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="capitalize text-gray-600">{category}</span>
                      <div className="flex">{renderStars(rating)}</div>
                    </div>
                  ))}
                </div>

                <h3 className="font-bold mb-4 text-gray-600">Services</h3>
                <div className="flex gap-3 mb-6">
                  {hotelData.amenities.map((amenity, index) => {
                    const iconData = getAmenityIcon(amenity, index);
                    const IconComponent = iconData.component;
                    return (
                      <div key={index} className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center" title={iconData.label}>
                        <IconComponent className="w-5 h-5 text-blue-600" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
