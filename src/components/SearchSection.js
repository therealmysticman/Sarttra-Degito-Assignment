'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearch } from '../contexts/SearchContext';
import { FlightIcon, CarIcon, CarIcon2, HotelIcon, WifiIcon, GymIcon, BathIcon, DrinkIcon, OtherIcon } from '../../assets/icons/index';

const SearchSection = () => {
  const router = useRouter();
  const { 
    searchState, 
    setLocation, 
    setCheckIn, 
    setCheckOut, 
    setGuests, 
    setSearchQuery,
    formatDateForDisplay,
    getSearchParams 
  } = useSearch();
  
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper function to get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const hotelsData = await import('../data/hotels.json');
      // Get first 3 featured hotels as recent searches
      const recentHotels = hotelsData.hotels
        .filter(hotel => hotel.featured)
        .slice(0, 3)
        .map(hotel => ({
          id: hotel.id,
          name: hotel.name,
          rating: hotel.rating,
          reviews: hotel.reviews,
          price: `${hotel.currency === 'USD' ? '$' : ''}${hotel.priceNumeric}/night`,
          image: hotel.image,
          location: hotel.location
        }));
      setRecentSearches(recentHotels);
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    // Use the context's search params
    const searchParams = getSearchParams();
    
    // Navigate to explore result page with search parameters
    router.push(`/exploreResult?${searchParams.toString()}`);
  };

  const handleRecentSearchClick = (hotel) => {
    // Set the location from the recent search and perform search
    setLocation(hotel.location);
    setSearchQuery(hotel.location);
    
    setTimeout(() => {
      const searchParams = getSearchParams();
      router.push(`/exploreResult?${searchParams.toString()}`);
    }, 100);
  };

  const handleBookNowClick = (hotel) => {
    // Navigate directly to the hotel details page
    router.push(`/exploreHotel?id=${hotel.id}`);
  };



  return (
    <div className="w-full md:w-[800px] bg-gray-50 p-8">
      {/* Search Header */}
      <div className="mb-6">
        <div className="relative mb-6">
          <input
            type="text"
            value={searchState.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search city, Country, Place for Travel advisory"
            className="flex-shrink-0 border-none outline-none text-sm rounded-lg"
            style={{
              width: '700px',
              height: '56px',
              color: 'gray',
              backgroundColor: '#EBEDFF',
              paddingLeft: '16px',
              paddingRight: '48px'
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
        </div>
      </div>

      {/* What Are You Looking For */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">What Are You Looking For?</h2>
        <div className="flex gap-4 justify-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: '#2D3DDF' }}>
              <HotelIcon className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-gray-500">Hotel</span>
          </div>
                    <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
              <FlightIcon className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-gray-500">Flight</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
              <CarIcon className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-gray-500">Car</span>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="space-y-4 mb-6">
        {/* Location */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            value={searchState.location}
            placeholder="Where are you going?"
            style={{color: '#6E6C7C'}}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600 ml-1">Check-in</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="date"
                value={searchState.checkIn}
                min={getMinDate()}
                onChange={(e) => setCheckIn(e.target.value)}
                style={{color: '#6E6C7C'}}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="text-xs text-gray-500 ml-1">
              {searchState.checkIn ? formatDateForDisplay(searchState.checkIn) : 'Select date'}
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600 ml-1">Check-out</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="date"
                value={searchState.checkOut}
                min={searchState.checkIn ? (() => {
                  const nextDay = new Date(searchState.checkIn);
                  nextDay.setDate(nextDay.getDate() + 1);
                  return nextDay.toISOString().split('T')[0];
                })() : getMinDate()}
                onChange={(e) => setCheckOut(e.target.value)}
                style={{color: '#6E6C7C'}}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="text-xs text-gray-500 ml-1">
              {searchState.checkOut ? formatDateForDisplay(searchState.checkOut) : 'Select date'}
            </div>
          </div>
        </div>

        {/* Guests */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
            </svg>
          </div>
          <select
            value={searchState.guests}
            onChange={(e) => setGuests(e.target.value)}
            style={{color: '#6E6C7C'}}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
          >
            <option value="All Guests">All Guests</option>
            <option value="1 adult, 0 children - 1 room">1 Adult - 1 Room</option>
            <option value="2 adult, 0 children - 1 room">2 Adults - 1 Room</option>
            <option value="2 adult, 1 children - 1 room">2 Adults, 1 Child - 1 Room</option>
            <option value="2 adult, 2 children - 1 room">2 Adults, 2 Children - 1 Room</option>
            <option value="3 adult, 0 children - 1 room">3 Adults - 1 Room</option>
            <option value="4 adult, 0 children - 1 room">4 Adults - 1 Room</option>
            <option value="2 adult, 0 children - 2 room">2 Adults - 2 Rooms</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Search Button */}
      <div className="flex justify-center mb-8">
        <button 
          onClick={handleSearch}
          disabled={loading}
          style={{backgroundColor: '#2D3DDF'}}
          className="w-full md:w-64 text-white py-3 md:h-[58px] md:py-0 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex-shrink-0 disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Recent Searches */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-600">Recent Searches</h3>
        <div className="space-y-4">
          {recentSearches.length > 0 ? (
            recentSearches.map((hotel) => (
              <div 
                key={hotel.id} 
                className="relative flex items-stretch bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleRecentSearchClick(hotel)}
              >
                {/* Hotel Image */}
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-24 h-20 sm:w-32 sm:h-24 md:w-44 md:h-28 lg:w-56 lg:h-32 object-cover flex-shrink-0"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div 
                  className="w-24 h-20 sm:w-32 sm:h-24 md:w-44 md:h-28 lg:w-56 lg:h-32 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0" 
                  style={{display: 'none'}}
                >
                  <span className="text-lg sm:text-xl md:text-2xl">🏨</span>
                </div>

                {/* Hotel Details */}
                <div className="flex-1 p-2 sm:p-3">
                  <div className="font-semibold text-sm sm:text-base truncate text-gray-600">{hotel.name}</div>
                  <div className="flex items-center gap-1 text-amber-400 text-xs sm:text-sm">
                    {"★★★★★".slice(0, Math.floor(hotel.rating))}
                    <span className="text-gray-400">{"★".repeat(5 - Math.floor(hotel.rating))}</span>
                    <span className="ml-1 sm:ml-2 text-gray-500 text-xs">{hotel.reviews}</span>
                  </div>

                  <div className="mt-1 text-xs text-gray-500 hidden sm:block">Amenities</div>
                  <div className="mt-1 flex gap-1 sm:gap-2">
                    {[
                      { component: CarIcon2, label: "Car Service" },
                      { component: BathIcon, label: "Bath" },
                      { component: DrinkIcon, label: "Restaurant" },
                      { component: WifiIcon, label: "WiFi" },
                      { component: GymIcon, label: "Gym" },
                      { component: OtherIcon, label: "Other" }
                    ].map((iconData, index) => {
                      const IconComponent = iconData.component;
                      return (
                        <span 
                          key={index} 
                          className="inline-flex items-center justify-center w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-gray-100 shadow-sm"
                          title={iconData.label}
                        >
                          <IconComponent 
                            style={{ 
                              width: '6px', 
                              height: '6px',
                              color: '#6B7280'
                            }} 
                          />
                        </span>
                      );
                    })}
                  </div>

                  <div className="mt-1 sm:mt-2 font-semibold text-indigo-600 text-sm sm:text-base">{hotel.price}</div>
                </div>

                {/* Vertical Book Now Button */}
                <button
                  className="w-10 sm:w-12 text-white flex items-center justify-center rounded-r-xl hover:bg-indigo-700 transition-colors"
                  style={{backgroundColor: '#2D3DDF'}}
                  aria-label="Book Now"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookNowClick(hotel);
                  }}
                >
                  <span className="rotate-90 select-none tracking-wide text-xs sm:text-sm whitespace-nowrap transform translate-y-0.5">Book Now</span>
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Loading recent searches...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
