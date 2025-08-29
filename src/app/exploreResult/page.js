'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import SideNavbar from '../../components/SideNavbar';
import HotelCard from '../../components/HotelCard';
import SearchHeader from '../../components/SearchHeader';

const MOCK_RECOMMENDATIONS = [
  {
    id: 1,
    title: "Trip to Thailand & Get 30% off on flight booking",
    image: "/trip-to-thai.png"
  },
  {
    id: 2,
    title: "Get additional 25% off on Bhutan tour fare",
    image: "/bhutan-tour.png"
  },
  {
    id: 3,
    title: "Trip to Thailand & Get 30% off on flight booking",
    image: "/trip-to-thai-2.png"
  },
  {
    id: 4,
    title: "Flat 40% off on hotel bookings in Agra",
    image: "/agra.png"
  }
];

export default function ExploreResult() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('Search city, Country, Place for Travel advisory');
  const [hotels, setHotels] = useState([]);
  const [allHotels, setAllHotels] = useState([]);
  const [originalFilteredHotels, setOriginalFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('default');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const desktopDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const mobileFilterDropdownRef = useRef(null);
  const desktopFilterDropdownRef = useRef(null);

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

  // Filter hotels based on search query and guests
  useEffect(() => {
    if (allHotels.length > 0) {
      const query = searchParams.get('q') || searchParams.get('location') || '';
      const guests = searchParams.get('guests');
      
      let filteredHotels = allHotels;
      
      // Filter by search query
      if (query && query !== 'Search city, Country, Place for Travel advisory') {
        filteredHotels = filteredHotels.filter(hotel => 
          hotel.name.toLowerCase().includes(query.toLowerCase()) ||
          hotel.location.toLowerCase().includes(query.toLowerCase()) ||
          hotel.description?.toLowerCase().includes(query.toLowerCase()) ||
          hotel.amenities?.some(amenity => amenity.toLowerCase().includes(query.toLowerCase()))
        );
      }
      
      // Filter by guest capacity
      if (guests) {
        filteredHotels = filteredHotels.filter(hotel =>
          hotel.guests && hotel.guests.includes(guests)
        );
      }
      
      setHotels(filteredHotels);
      setOriginalFilteredHotels(filteredHotels);
      setSortBy('default'); // Reset sort when filters change
    }
  }, [allHotels, searchParams]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (desktopDropdownRef.current && !desktopDropdownRef.current.contains(event.target)) &&
        (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target)) &&
        (mobileFilterDropdownRef.current && !mobileFilterDropdownRef.current.contains(event.target)) &&
        (desktopFilterDropdownRef.current && !desktopFilterDropdownRef.current.contains(event.target))
      ) {
        setShowSortDropdown(false);
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Apply sorting when sortBy changes
  useEffect(() => {
    if (originalFilteredHotels.length > 0) {
      let sortedHotels;
      
      if (sortBy === 'default') {
        // Restore original filtered order
        sortedHotels = [...originalFilteredHotels];
      } else {
        // Apply sorting to original filtered hotels
        sortedHotels = [...originalFilteredHotels].sort((a, b) => {
          switch (sortBy) {
            case 'name-asc':
              return a.name.localeCompare(b.name);
            case 'name-desc':
              return b.name.localeCompare(a.name);
            case 'price-asc':
              return a.priceNumeric - b.priceNumeric;
            case 'price-desc':
              return b.priceNumeric - a.priceNumeric;
            case 'rating-desc':
              return b.rating - a.rating;
            default:
              return 0;
          }
        });
      }
      
      // Only update if the order actually changed
      if (JSON.stringify(sortedHotels.map(h => h.id)) !== JSON.stringify(hotels.map(h => h.id))) {
        setHotels(sortedHotels);
      }
    }
  }, [sortBy, originalFilteredHotels]); // Include originalFilteredHotels in dependencies

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setShowSortDropdown(false);
  };

  const getSortLabel = (sortType) => {
    switch (sortType) {
      case 'name-asc':
        return 'Name: A-Z';
      case 'name-desc':
        return 'Name: Z-A';
      case 'price-asc':
        return 'Price: Low to High';
      case 'price-desc':
        return 'Price: High to Low';
      case 'rating-desc':
        return 'Rating: High to Low';
      default:
        return 'Sort By';
    }
  };

  const handleGuestFilterChange = (guestOption) => {
    const currentParams = new URLSearchParams(searchParams);
    if (guestOption === 'all') {
      currentParams.delete('guests');
    } else {
      currentParams.set('guests', guestOption);
    }
    router.push(`?${currentParams.toString()}`);
    setShowFilterDropdown(false);
  };

  const getGuestFilterLabel = (guestOption) => {
    if (!guestOption) return 'All Guests';
    
    return guestOption
      .replace(/(\d+) adult/g, (match, num) => `${num} Adult${num > 1 ? 's' : ''}`)
      .replace(/(\d+) children/g, (match, num) => `${num} Child${num > 1 ? 'ren' : ''}`)
      .replace(/, 0 children/g, '')
      .replace(/ - (\d+) room/g, (match, num) => ` - ${num} Room${num > 1 ? 's' : ''}`);
  };

  const handleGoBack = () => {
    router.push('/');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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
        <SearchHeader 
          title="Hotels"
          showMobileTitle={true}
          showSearchInput={true}
          searchValue={searchQuery}
          onSearchChange={handleSearchChange}
        />

        {/* Content Area */}
        <div className="p-4 md:p-6">
          {/* Mobile Recommendations Section */}
          <div className="lg:hidden mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recommended</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {MOCK_RECOMMENDATIONS.map((rec) => (
                <div key={rec.id} className="relative rounded-lg overflow-hidden flex-shrink-0 w-48">
                  {/* Recommendation Image */}
                  <div className="relative h-24">
                    <Image
                      src={rec.image}
                      alt={rec.title}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        console.log('Image failed to load:', rec.image);
                      }}
                    />
                  </div>
                  
                  {/* Recommendation Text */}
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <p className="text-white text-xs font-medium leading-tight" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>
                      {rec.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex gap-8">
            {/* Main Content - Hotel Results */}
            <div className="flex-1">
              {/* Header with Sort/Filter */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">Best places to enjoy your stay</h1>
                  {hotels.length > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      {hotels.length} hotel{hotels.length !== 1 ? 's' : ''} found
                      {searchParams.get('guests') && ` for ${searchParams.get('guests')}`}
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <div className="relative" ref={desktopDropdownRef}>
                    <button 
                      onClick={() => setShowSortDropdown(!showSortDropdown)}
                      className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
                    >
                      {getSortLabel(sortBy)}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showSortDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <button
                          onClick={() => handleSortChange('default')}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg text-gray-700"
                        >
                          Default
                        </button>
                        <button
                          onClick={() => handleSortChange('name-asc')}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                        >
                          Name: A-Z
                        </button>
                        <button
                          onClick={() => handleSortChange('name-desc')}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                        >
                          Name: Z-A
                        </button>
                        <button
                          onClick={() => handleSortChange('price-asc')}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                        >
                          Price: Low to High
                        </button>
                        <button
                          onClick={() => handleSortChange('price-desc')}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                        >
                          Price: High to Low
                        </button>
                        <button
                          onClick={() => handleSortChange('rating-desc')}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 last:rounded-b-lg text-gray-700"
                        >
                          Rating: High to Low
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="relative" ref={desktopFilterDropdownRef}>
                    <button 
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                      className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
                    >
                      {searchParams.get('guests') ? getGuestFilterLabel(searchParams.get('guests')) : 'Filter'}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showFilterDropdown && (
                      <div className="absolute top-full right-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <div className="px-3 py-2 border-b border-gray-100">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Guest Capacity</p>
                        </div>
                        <button
                          onClick={() => handleGuestFilterChange('all')}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg text-gray-700"
                        >
                          All Guests
                        </button>
                        <button
                          onClick={() => handleGuestFilterChange('1 adult, 0 children - 1 room')}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                        >
                          1 Adult - 1 Room
                        </button>
                        <button
                          onClick={() => handleGuestFilterChange('2 adult, 0 children - 1 room')}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                        >
                          2 Adults - 1 Room
                        </button>
                        <button
                          onClick={() => handleGuestFilterChange('2 adult, 1 children - 1 room')}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                        >
                          2 Adults, 1 Child - 1 Room
                        </button>
                        <button
                          onClick={() => handleGuestFilterChange('2 adult, 2 children - 1 room')}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                        >
                          2 Adults, 2 Children - 1 Room
                        </button>
                        <button
                          onClick={() => handleGuestFilterChange('3 adult, 0 children - 1 room')}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                        >
                          3 Adults - 1 Room
                        </button>
                        <button
                          onClick={() => handleGuestFilterChange('4 adult, 0 children - 1 room')}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                        >
                          4 Adults - 1 Room
                        </button>
                        <button
                          onClick={() => handleGuestFilterChange('2 adult, 0 children - 2 room')}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 last:rounded-b-lg text-gray-700"
                        >
                          2 Adults - 2 Rooms
                        </button>
                      </div>
                    )}
                  </div>
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


            </div>

            {/* Right Sidebar - Recommendations */}
            <div className="w-80">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Recommended</h2>
                
                <div className="space-y-4">
                  {MOCK_RECOMMENDATIONS.map((rec) => (
                    <div key={rec.id} className="relative rounded-lg overflow-hidden">
                      {/* Recommendation Image */}
                      <div className="relative h-32">
                        <Image
                          src={rec.image}
                          alt={rec.title}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            console.log('Image failed to load:', rec.image);
                          }}
                        />
                        {/* Overlay - reduced opacity to see image better */}
                      </div>
                      
                      {/* Recommendation Text */}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white text-sm font-medium leading-tight" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>
                          {rec.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Main Content */}
          <div className="lg:hidden">
            {/* Header with Sort/Filter */}
            <div className="mb-4">
              <h1 className="text-lg font-semibold text-gray-800 mb-3">Best places to enjoy your stay</h1>
              {hotels.length > 0 && (
                <p className="text-sm text-gray-600 mb-3">
                  {hotels.length} hotel{hotels.length !== 1 ? 's' : ''} found
                  {searchParams.get('guests') && ` for ${searchParams.get('guests')}`}
                </p>
              )}
              <div className="flex gap-3">
                <div className="relative flex-1" ref={mobileDropdownRef}>
                  <button 
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="w-full px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors text-sm flex items-center justify-between"
                  >
                    <span>{getSortLabel(sortBy)}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showSortDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <button
                        onClick={() => handleSortChange('default')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg text-sm text-gray-700"
                      >
                        Default
                      </button>
                      <button
                        onClick={() => handleSortChange('name-asc')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                      >
                        Name: A-Z
                      </button>
                      <button
                        onClick={() => handleSortChange('name-desc')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                      >
                        Name: Z-A
                      </button>
                      <button
                        onClick={() => handleSortChange('price-asc')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                      >
                        Price: Low to High
                      </button>
                      <button
                        onClick={() => handleSortChange('price-desc')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                      >
                        Price: High to Low
                      </button>
                      <button
                        onClick={() => handleSortChange('rating-desc')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 last:rounded-b-lg text-sm text-gray-700"
                      >
                        Rating: High to Low
                      </button>
                    </div>
                  )}
                </div>
                <div className="relative flex-1" ref={mobileFilterDropdownRef}>
                  <button 
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="w-full px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors text-sm flex items-center justify-between"
                  >
                    <span>{searchParams.get('guests') ? getGuestFilterLabel(searchParams.get('guests')) : 'Filter'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showFilterDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <div className="px-3 py-2 border-b border-gray-100">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Guest Capacity</p>
                      </div>
                      <button
                        onClick={() => handleGuestFilterChange('all')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg text-sm text-gray-700"
                      >
                        All Guests
                      </button>
                      <button
                        onClick={() => handleGuestFilterChange('1 adult, 0 children - 1 room')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                      >
                        1 Adult - 1 Room
                      </button>
                      <button
                        onClick={() => handleGuestFilterChange('2 adult, 0 children - 1 room')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                      >
                        2 Adults - 1 Room
                      </button>
                      <button
                        onClick={() => handleGuestFilterChange('2 adult, 1 children - 1 room')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                      >
                        2 Adults, 1 Child - 1 Room
                      </button>
                      <button
                        onClick={() => handleGuestFilterChange('2 adult, 2 children - 1 room')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                      >
                        2 Adults, 2 Children - 1 Room
                      </button>
                      <button
                        onClick={() => handleGuestFilterChange('3 adult, 0 children - 1 room')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                      >
                        3 Adults - 1 Room
                      </button>
                      <button
                        onClick={() => handleGuestFilterChange('4 adult, 0 children - 1 room')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                      >
                        4 Adults - 1 Room
                      </button>
                      <button
                        onClick={() => handleGuestFilterChange('2 adult, 0 children - 2 room')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 last:rounded-b-lg text-sm text-gray-700"
                      >
                        2 Adults - 2 Rooms
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Hotel Cards - Mobile Stack */}
            <div className="space-y-4">
              {loading ? (
                // Loading state
                <div className="text-center py-8">
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
                <div className="text-center py-8">
                  <div className="text-gray-500">No hotels found</div>
                </div>
              )}
            </div>



          </div>
        </div>
      </div>
    </div>
  );
}
