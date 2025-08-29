'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  // Helper functions for default dates
  const getDefaultCheckIn = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getDefaultCheckOut = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Search state
  const [searchState, setSearchState] = useState({
    location: '',
    checkIn: getDefaultCheckIn(),
    checkOut: getDefaultCheckOut(),
    guests: 'All Guests',
    roomType: 'Standard Room',
    searchQuery: ''
  });

  // Helper function to format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Helper function to calculate nights
  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 1;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  };

  // Update search state
  const updateSearchState = (updates) => {
    setSearchState(prev => ({
      ...prev,
      ...updates
    }));
  };

  // Update individual fields
  const setLocation = (location) => updateSearchState({ location });
  const setCheckIn = (checkIn) => {
    // Auto-adjust checkout if needed
    if (searchState.checkOut && new Date(checkIn) >= new Date(searchState.checkOut)) {
      const nextDay = new Date(checkIn);
      nextDay.setDate(nextDay.getDate() + 1);
      updateSearchState({ 
        checkIn, 
        checkOut: nextDay.toISOString().split('T')[0] 
      });
    } else {
      updateSearchState({ checkIn });
    }
  };
  const setCheckOut = (checkOut) => updateSearchState({ checkOut });
  const setGuests = (guests) => updateSearchState({ guests });
  const setRoomType = (roomType) => updateSearchState({ roomType });
  const setSearchQuery = (searchQuery) => updateSearchState({ searchQuery });

  // Generate search params for URL
  const getSearchParams = () => {
    // If guests is 'All Guests', don't include it in search params
    const searchParams = {
      q: searchState.searchQuery || searchState.location || '',
      location: searchState.location || '',
      checkIn: searchState.checkIn,
      checkOut: searchState.checkOut,
      roomType: searchState.roomType
    };
    
    // Only add guests if it's not 'All Guests'
    if (searchState.guests !== 'All Guests') {
      searchParams.guests = searchState.guests;
    }
    
    return new URLSearchParams(searchParams);
  };

  const value = {
    // State
    searchState,
    
    // Setters
    updateSearchState,
    setLocation,
    setCheckIn,
    setCheckOut,
    setGuests,
    setRoomType,
    setSearchQuery,
    
    // Helpers
    formatDateForDisplay,
    calculateNights,
    getSearchParams,
    
    // Computed values
    nights: calculateNights(searchState.checkIn, searchState.checkOut)
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};
