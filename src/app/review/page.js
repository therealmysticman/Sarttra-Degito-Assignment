'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SideNavbar from '../../components/SideNavbar';

export default function ReviewHotel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hotelId = searchParams.get('id') || '1';
  const [hotelData, setHotelData] = useState(null);
  const [guestDetails, setGuestDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    specialRequest: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHotelDetails = async () => {
      try {
        
        // Load hotel data (fallback to JSON)
        const hotelsData = await import('../../data/hotels.json');
        const hotel = hotelsData.hotels.find(h => h.id === parseInt(hotelId));
        
        if (hotel) {
          setHotelData(hotel);
        }
      } catch (error) {
        console.error('Error loading hotel details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHotelDetails();
  }, [hotelId]);

  const handleGoBack = () => {
    router.back();
  };

  const handleInputChange = (field, value) => {
    setGuestDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContinue = () => {
    console.log('Booking details:', { hotelData, guestDetails });
    // Navigate to payment page with hotel ID
    router.push(`/payment?id=${hotelId}`);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }
    for (let i = fullStars; i < 5; i++) {
      stars.push(<span key={i} className="text-gray-300">★</span>);
    }
    return stars;
  };

  if (!hotelData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SideNavbar />
      
      <div className="md:ml-[157px] pb-[100px] md:pb-0">
        {/* Mobile Header */}
        <div className="bg-white p-4 shadow-sm md:hidden">
          <div className="flex items-center gap-4">
            <button onClick={handleGoBack} className="p-2 hover:bg-gray-100 rounded-full">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M12 19L5 12L12 5" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-800">Review hotel</h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 md:p-6 shadow-sm">
          {/* Desktop: Back arrow + Search input */}
          <div className="hidden md:flex items-center gap-4 mb-4">
            <button onClick={handleGoBack} className="p-2 hover:bg-gray-100 rounded-full">
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
          
          {/* Search Filters */}
          <div className="flex gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Where are you going?"
              className="flex-1 min-w-48 px-4 py-3 border border-gray-300 rounded-lg text-sm"
            />
            <input
              type="text"
              defaultValue="20 Dec,2020"
              className="w-32 px-4 py-3 border border-gray-300 rounded-lg text-sm"
            />
            <input
              type="text"
              defaultValue="21 Dec,2020"
              className="w-32 px-4 py-3 border border-gray-300 rounded-lg text-sm"
            />
            <input
              type="text"
              defaultValue="2 adult, 0 children - 1 room"
              className="flex-1 min-w-48 px-4 py-3 border border-gray-300 rounded-lg text-sm"
            />
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
              Search
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Content */}
            <div className="flex-1">
              {/* Review your booking */}
              <div className="bg-white rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Review your booking</h2>
                
                <div className="flex gap-4 mb-6">
                  {/* Hotel Image */}
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={hotelData.image}
                      alt={hotelData.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  
                  {/* Hotel Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{hotelData.name}</h3>
                      <div className="flex">{renderStars(hotelData.rating)}</div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{hotelData.location}</p>
                    <p className="text-gray-600 text-sm">This hotel is reviewed by global firm</p>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Check-in</div>
                    <div className="font-semibold">Sunday 21, Dec</div>
                    <div className="text-sm text-gray-600">10am</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm inline-block">
                      1 night
                    </div>
                  </div>
                  <div className="text-right md:text-left">
                    <div className="text-sm text-gray-600 mb-1">Check-out</div>
                    <div className="font-semibold">Monday 22,Dec</div>
                    <div className="text-sm text-gray-600">10am</div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="font-semibold">2 Adult - 1 room</div>
                </div>
              </div>

              {/* Desktop Guest Details */}
              <div className="hidden lg:block bg-white rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Guest Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={guestDetails.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={guestDetails.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-mail address</label>
                    <input
                      type="email"
                      value={guestDetails.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile number</label>
                    <input
                      type="tel"
                      value={guestDetails.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter mobile number"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <button className="text-blue-600 font-medium">Add Guest +</button>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Request (optional)</label>
                  <textarea
                    value={guestDetails.specialRequest}
                    onChange={(e) => handleInputChange('specialRequest', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                    placeholder="Any special requests..."
                  />
                </div>

                <button
                  onClick={handleContinue}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Continue
                </button>
              </div>
            </div>

            {/* Right Sidebar - Booking Summary */}
            <div className="w-full lg:w-80">
              <div className="bg-white rounded-lg p-6 sticky top-4">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>1 room X 1 night</span>
                    <span>1,000.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total discount</span>
                    <span>0.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Price after discount</span>
                    <span>1,000.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxes & service fees</span>
                    <span>140.00</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Amount</span>
                      <span>1,140.00</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-2">Cancellation Charges</h4>
                  <p className="text-sm text-gray-600 mb-2">Non Refundable</p>
                  <p className="text-xs text-gray-500">
                    Penalty may be charged by the airline & by MMT based on how close to departure date you cancel.
                    View fare rules to know more.
                  </p>
                  <button className="text-blue-600 text-sm mt-2">VIEW POLICY</button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Guest Details - Below Price Summary */}
          <div className="lg:hidden bg-white rounded-lg p-6 mt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Guest Details</h3>
            
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={guestDetails.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={guestDetails.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-mail address</label>
                <input
                  type="email"
                  value={guestDetails.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile number</label>
                <input
                  type="tel"
                  value={guestDetails.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter mobile number"
                />
              </div>
            </div>

            <div className="mb-4">
              <button className="text-blue-600 font-medium">Add Guest +</button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Special Request (optional)</label>
              <textarea
                value={guestDetails.specialRequest}
                onChange={(e) => handleInputChange('specialRequest', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                placeholder="Any special requests..."
              />
            </div>

            <button
              onClick={handleContinue}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
