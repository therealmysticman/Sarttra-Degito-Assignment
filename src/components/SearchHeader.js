'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSearch } from '../contexts/SearchContext';
import { HotelIcon } from '../../assets/icons/index';

export default function SearchHeader({ 
  title = '', 
  showMobileTitle = false,
  showSearchInput = true,
  showFilters = false,
  searchValue,
  onSearchChange = () => {},
  className = ''
}) {
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

  // Helper function to get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleSearch = () => {
    // Use the context's search params
    const searchParams = getSearchParams();
    router.push(`/exploreResult?${searchParams.toString()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearchChange(e); // Call the original onChange handler if provided
  };

  return (
    <>
      {/* Mobile Header - Only show if title is provided and showMobileTitle is true */}
      {showMobileTitle && title && (
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
            <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className={`p-4 md:p-6 shadow-sm ${className}`}>
        {showSearchInput && (
          <>
            {/* Desktop: Back arrow + Search input */}
            <div className="hidden md:flex items-center gap-4 mb-4">
                             <button 
                 onClick={handleGoBack}
                 className="p-2 rounded-full flex-shrink-0"
                 style={{ backgroundColor: '#EBEDFF' }}
               >
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M19 12H5M12 19L5 12L12 5" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
               </button>
                                           <input
                type="text"
                value={searchState.searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="flex-1 px-4 py-3 rounded-lg border-none outline-none text-gray-600 text-sm"
                style={{ backgroundColor: '#EBEDFF' }}
                placeholder="Search city, Country, Place for Travel advisory"
              />
            </div>

            {/* Mobile: Show title header if not shown above, then search input */}
            <div className="md:hidden">
              {/* Mobile header with back button and title - only if not already shown above */}
              {!showMobileTitle && title && (
                                 <div className="flex items-center gap-4 mb-4">
                   <button 
                     onClick={handleGoBack} 
                     className="p-2 hover:bg-gray-100 rounded-full"
                   >
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M19 12H5M12 19L5 12L12 5" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                   </button>
                   <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                 </div>
              )}

              {/* Search Input */}
              <div className={showFilters ? "mb-4" : ""}>
                                                                 <input
                  type="text"
                  value={searchState.searchQuery}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="w-full px-4 py-3 rounded-lg border-none outline-none text-gray-600 text-sm"
                  style={{ backgroundColor: '#EBEDFF' }}
                  placeholder="Search city, Country, Place for Travel advisory"
                />
              </div>
              
                            {/* Search Filters - Mobile Stacked (only if showFilters is true) */}
              {showFilters && (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Where are you going?"
                    value={searchState.location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700"
                  />
                  <div className="space-y-1">
                    <input
                      type="date"
                      value={searchState.checkIn}
                      min={getMinDate()}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700"
                    />
                    <div className="text-xs text-gray-500 ml-1">
                      Check-in: {searchState.checkIn ? formatDateForDisplay(searchState.checkIn) : 'Select date'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <input
                      type="date"
                      value={searchState.checkOut}
                      min={searchState.checkIn ? (() => {
                        const nextDay = new Date(searchState.checkIn);
                        nextDay.setDate(nextDay.getDate() + 1);
                        return nextDay.toISOString().split('T')[0];
                      })() : getMinDate()}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700"
                    />
                    <div className="text-xs text-gray-500 ml-1">
                      Check-out: {searchState.checkOut ? formatDateForDisplay(searchState.checkOut) : 'Select date'}
                    </div>
                  </div>
                  <select
                    value={searchState.guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 appearance-none bg-white"
                  >
                    <option value="1 adult, 0 children - 1 room">1 Adult - 1 Room</option>
                    <option value="2 adult, 0 children - 1 room">2 Adults - 1 Room</option>
                    <option value="2 adult, 1 children - 1 room">2 Adults, 1 Child - 1 Room</option>
                    <option value="2 adult, 2 children - 1 room">2 Adults, 2 Children - 1 Room</option>
                    <option value="3 adult, 0 children - 1 room">3 Adults - 1 Room</option>
                    <option value="4 adult, 0 children - 1 room">4 Adults - 1 Room</option>
                    <option value="2 adult, 0 children - 2 room">2 Adults - 2 Rooms</option>
                  </select>
                 <button 
                   onClick={handleSearch}
                   className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
                 >
                   Search
                 </button>
                </div>
              )}
            </div>
          </>
        )}

                {/* Desktop Filter inputs row (only if showFilters is true) */}
        {showFilters && showSearchInput && (
          <div className="hidden md:flex gap-3">
            <input
              type="text"
              placeholder="Where are you going?"
              value={searchState.location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700"
            />
            <input
              type="date"
              value={searchState.checkIn}
              min={getMinDate()}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-36 px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700"
            />
            <input
              type="date"
              value={searchState.checkOut}
              min={searchState.checkIn ? (() => {
                const nextDay = new Date(searchState.checkIn);
                nextDay.setDate(nextDay.getDate() + 1);
                return nextDay.toISOString().split('T')[0];
              })() : getMinDate()}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-36 px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700"
            />
            <select
              value={searchState.guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-56 px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 appearance-none bg-white"
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
           <button 
             onClick={handleSearch}
             style={{ backgroundColor: '#2D3DDF' }}
             className="px-8 py-3text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
           >
             Search
           </button>
          </div>
        )}

                {/* Simple filter layout for review page (only if showFilters is true and showSearchInput is true, but no mobile title) */}
        {showFilters && showSearchInput && !title && (
          <div className="flex gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Where are you going?"
              value={searchState.location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 min-w-48 px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700"
            />
            <input
              type="date"
              value={searchState.checkIn}
              min={getMinDate()}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-32 px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700"
            />
            <input
              type="date"
              value={searchState.checkOut}
              min={searchState.checkIn ? (() => {
                const nextDay = new Date(searchState.checkIn);
                nextDay.setDate(nextDay.getDate() + 1);
                return nextDay.toISOString().split('T')[0];
              })() : getMinDate()}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-32 px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700"
            />
            <select
              value={searchState.guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-48 px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 appearance-none bg-white"
            >
              <option value="1 adult, 0 children - 1 room">1 Adult - 1 Room</option>
              <option value="2 adult, 0 children - 1 room">2 Adults - 1 Room</option>
              <option value="2 adult, 1 children - 1 room">2 Adults, 1 Child - 1 Room</option>
              <option value="2 adult, 2 children - 1 room">2 Adults, 2 Children - 1 Room</option>
              <option value="3 adult, 0 children - 1 room">3 Adults - 1 Room</option>
              <option value="4 adult, 0 children - 1 room">4 Adults - 1 Room</option>
              <option value="2 adult, 0 children - 2 room">2 Adults - 2 Rooms</option>
            </select>
           <button 
             onClick={handleSearch}
             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
           >
             Search
           </button>
          </div>
        )}

        {/* Simple back button only layout for payment page */}
        {!showSearchInput && title && (
                   <div className="flex items-center gap-4">
             {/* Mobile button without circle */}
             <button 
               onClick={handleGoBack} 
               className="p-2 hover:bg-gray-100 rounded-full md:hidden"
             >
               <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
               </svg>
             </button>
             {/* Desktop button with circle */}
             <button 
               onClick={handleGoBack} 
               className="p-2 rounded-full hidden md:block"
               style={{ backgroundColor: '#EBEDFF' }}
             >
               <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
               </svg>
             </button>
             <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
           </div>
        )}
      </div>
    </>
  );
}
