'use client';

import { useState } from 'react';
import { FlightIcon, CarIcon, HotelIcon } from '../../assets/icons/index';

const SearchSection = () => {
  const [searchData, setSearchData] = useState({
    location: 'Pattaya',
    checkIn: 'Thu 28 Jan-2021',
    checkOut: 'Fri 29 Jan-2021',
    guests: '2 adult 1 children - 1 room'
  });

  const recentSearches = [
    {
      id: 1,
      name: 'Hotel JW Marriott',
      rating: 4.8,
      reviews: '10K Reviews',
      price: '1000/night',
      image: '/hotel-1.jpg'
    },
    {
      id: 2,
      name: 'Hotel JW Marriott',
      rating: 4.8,
      reviews: '10K Reviews',
      price: '1000/night',
      image: '/hotel-2.jpg'
    }
  ];

  return (
    <div className="w-full md:w-[800px] bg-gray-50 p-8">
      {/* Search Header */}
      <div className="mb-6">
        <div className="relative mb-6">
          <input
            type="text"
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
            value={searchData.location}
            onChange={(e) => setSearchData({...searchData, location: e.target.value})}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              value={searchData.checkIn}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              readOnly
            />
          </div>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              value={searchData.checkOut}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              readOnly
            />
          </div>
        </div>

        {/* Guests */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchData.guests}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly
          />
        </div>
      </div>

      {/* Search Button */}
      <div className="flex justify-center mb-8">
        <button className="w-full md:w-64 bg-blue-600 text-white py-3 md:h-[58px] md:py-0 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex-shrink-0">
          Search
        </button>
      </div>

      {/* Recent Searches */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Searches</h3>
        <div className="space-y-4">
          {recentSearches.map((hotel) => (
            <div key={hotel.id} className="flex gap-3 p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏨</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{hotel.name}</h4>
                <div className="flex items-center gap-2 my-1">
                  <div className="flex items-center">
                    <span className="text-yellow-500 text-sm">★</span>
                    <span className="text-sm font-medium ml-1">{hotel.rating}</span>
                  </div>
                  <span className="text-xs text-gray-500">{hotel.reviews}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-600 font-semibold text-sm">{hotel.price}</span>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
