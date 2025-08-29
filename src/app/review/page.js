'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SideNavbar from '../../components/SideNavbar';
import SearchHeader from '../../components/SearchHeader';

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
  const [validationErrors, setValidationErrors] = useState({});
  const [costCalculation, setCostCalculation] = useState(null);
  
  // Get booking parameters from URL
  const bookingDetails = {
    roomType: searchParams.get('roomType') || 'Standard Room',
    checkIn: searchParams.get('checkIn') || '2024-01-20',
    checkOut: searchParams.get('checkOut') || '2024-01-21',
    guests: searchParams.get('guests') || '2 adult, 0 children - 1 room',
    days: parseInt(searchParams.get('days')) || 1
  };

  // Cost calculation function
  const calculateCost = (roomType, days, basePrice = 1000) => {
    // Room type pricing (base price per night)
    const roomPricing = {
      'Standard Room': basePrice,
      'Deluxe Room': basePrice * 1.3,
      'Superior Room': basePrice * 1.5,
      'Suite Room': basePrice * 2.0,
      'Presidential Suite': basePrice * 3.0
    };

    const roomPricePerNight = roomPricing[roomType] || basePrice;
    const subtotal = roomPricePerNight * days;
    const discount = 0; // No discount as specified
    const discountAmount = subtotal * (discount / 100);
    const afterDiscount = subtotal - discountAmount;
    const vatRate = 7; // VAT 7%
    const vatAmount = afterDiscount * (vatRate / 100);
    const total = afterDiscount + vatAmount;

    return {
      roomType: roomType,
      days: days,
      pricePerNight: roomPricePerNight,
      subtotal: subtotal,
      discount: discount,
      discountAmount: discountAmount,
      afterDiscount: afterDiscount,
      vatRate: vatRate,
      vatAmount: vatAmount,
      total: total,
      currency: 'BAHT'
    };
  };

  useEffect(() => {
    const loadHotelDetails = async () => {
      try {
        
        // Load hotel data (fallback to JSON)
        const hotelsData = await import('../../data/hotels.json');
        const hotel = hotelsData.hotels.find(h => h.id === parseInt(hotelId));
        
        if (hotel) {
          setHotelData(hotel);
          
          // Calculate cost based on hotel base price
          const basePrice = hotel.priceNumeric || 1000;
          const cost = calculateCost(bookingDetails.roomType, bookingDetails.days, basePrice);
          setCostCalculation(cost);
          
          console.log('Cost Calculation JSON:', JSON.stringify(cost, null, 2));
        }
      } catch (error) {
        console.error('Error loading hotel details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHotelDetails();
  }, [hotelId, bookingDetails.roomType, bookingDetails.days]);

  const handleGoBack = () => {
    router.back();
  };

  const handleInputChange = (field, value) => {
    setGuestDetails(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateGuestDetails = () => {
    const errors = {};
    
    if (!guestDetails.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!guestDetails.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!guestDetails.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(guestDetails.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!guestDetails.mobile.trim()) {
      errors.mobile = 'Mobile number is required';
    }
    
    return errors;
  };

  const handleContinue = async () => {
    // Validate guest details
    const errors = validateGuestDetails();
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      alert('Please fill in all required fields correctly');
      return;
    }

    try {
      // Send booking data to API
      const bookingData = {
        hotelId: hotelId,
        roomType: bookingDetails.roomType,
        days: bookingDetails.days,
        checkIn: bookingDetails.checkIn,
        checkOut: bookingDetails.checkOut,
        guests: bookingDetails.guests,
        guestDetails: guestDetails,
        costCalculation: costCalculation
      };

      console.log('Sending booking data to API:', bookingData);
      console.log('Cost Calculation JSON for API:', JSON.stringify(costCalculation, null, 2));
      
      // Here you would make the API call
      // const response = await fetch('/api/booking', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(bookingData)
      // });

      // Navigate to payment page with all parameters including cost calculation
      const params = new URLSearchParams({
        id: hotelId,
        roomType: bookingDetails.roomType,
        days: bookingDetails.days.toString(),
        checkIn: bookingDetails.checkIn,
        checkOut: bookingDetails.checkOut,
        guests: bookingDetails.guests,
        subtotal: costCalculation.subtotal.toString(),
        vatAmount: costCalculation.vatAmount.toString(),
        total: costCalculation.total.toString(),
        currency: costCalculation.currency
      });
      
      router.push(`/payment?${params.toString()}`);
    } catch (error) {
      console.error('Error processing booking:', error);
      alert('An error occurred. Please try again.');
    }
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
        <SearchHeader 
          title="Review hotel"
          showMobileTitle={true}
          showSearchInput={true}
          showFilters={true}
        />

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
                      <h3 className="font-bold text-lg text-gray-800">{hotelData.name}</h3>
                      <div className="flex">{renderStars(hotelData.rating)}</div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{hotelData.location}</p>
                    <p className="text-gray-600 text-sm">This hotel is reviewed by global firm</p>
                  </div>
                </div>

                {/* Booking Details - Responsive Layout */}
                <div className="hidden lg:flex items-center justify-between mb-6">
                  <div className="flex items-center gap-8">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Check-in</div>
                      <div className="font-semibold text-gray-800">{new Date(bookingDetails.checkIn).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })}</div>
                      <div className="text-sm text-gray-600">10am</div>
                    </div>
                    <div>
                      <div style={{ backgroundColor: '#EDF1FF' }} className="text-blue-600 px-3 py-1 rounded-full text-sm font-medium inline-block">
                        {bookingDetails.days} night{bookingDetails.days > 1 ? 's' : ''}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Check-out</div>
                      <div className="font-semibold text-gray-800">{new Date(bookingDetails.checkOut).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })}</div>
                      <div className="text-sm text-gray-600">10am</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-800">{bookingDetails.guests}</div>
                  </div>
                </div>

                {/* Mobile 2x2 Grid Layout */}
                <div className="lg:hidden grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Check-in</div>
                    <div className="font-semibold text-gray-800">{new Date(bookingDetails.checkIn).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })}</div>
                    <div className="text-sm text-gray-600">10am</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Check-out</div>
                    <div className="font-semibold text-gray-800">{new Date(bookingDetails.checkOut).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })}</div>
                    <div className="text-sm text-gray-600">10am</div>
                  </div>
                  <div>
                    <div>
                      <div style={{ backgroundColor: '#EDF1FF' }} className="text-blue-600 px-3 py-1 rounded-full text-sm font-medium inline-block">
                        {bookingDetails.days} night{bookingDetails.days > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Guests</div>
                    <div className="font-semibold text-gray-800">{bookingDetails.guests}</div>
                  </div>
                </div>


              </div>



              {/* Desktop Guest Details */}
              <div className="hidden lg:block bg-white rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Guest Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      value={guestDetails.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 ${validationErrors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter first name"
                    />
                    {validationErrors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      value={guestDetails.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 ${validationErrors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter last name"
                    />
                    {validationErrors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-mail address *</label>
                    <input
                      type="email"
                      value={guestDetails.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 ${validationErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter email address"
                    />
                    {validationErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile number *</label>
                    <input
                      type="tel"
                      value={guestDetails.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 ${validationErrors.mobile ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter mobile number"
                    />
                    {validationErrors.mobile && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.mobile}</p>
                    )}
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none placeholder-gray-400"
                    placeholder="Any special requests..."
                  />
                </div>

                <button
                  onClick={handleContinue}
                  className="w-full text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
                  style={{ backgroundColor: '#2D3DDF' }}
                >
                  Continue
                </button>
              </div>
            </div>

            {/* Right Sidebar - Booking Summary */}
            <div className="w-full lg:w-80">
              <div className="bg-white rounded-lg p-6 sticky top-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Booking Summary</h3>
                
                {costCalculation ? (
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Room Type</span>
                      <span className="font-medium">{costCalculation.roomType}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Price per night</span>
                      <span>{costCalculation.pricePerNight.toLocaleString()} {costCalculation.currency}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>1 room X {costCalculation.days} night{costCalculation.days > 1 ? 's' : ''}</span>
                      <span>{costCalculation.subtotal.toLocaleString()} {costCalculation.currency}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Total discount ({costCalculation.discount}%)</span>
                      <span>-{costCalculation.discountAmount.toLocaleString()} {costCalculation.currency}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Price after discount</span>
                      <span>{costCalculation.afterDiscount.toLocaleString()} {costCalculation.currency}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>VAT ({costCalculation.vatRate}%)</span>
                      <span>{costCalculation.vatAmount.toLocaleString()} {costCalculation.currency}</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between font-bold text-lg text-gray-800">
                        <span>Total Amount</span>
                        <span className="text-blue-600">{costCalculation.total.toLocaleString()} {costCalculation.currency}</span>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <div className="font-semibold text-sm text-gray-600">{bookingDetails.guests}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Calculating cost...</p>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-2 text-gray-400">Cancellation Charges</h4>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  value={guestDetails.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 ${validationErrors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter first name"
                />
                {validationErrors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  value={guestDetails.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 ${validationErrors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter last name"
                />
                {validationErrors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-mail address *</label>
                <input
                  type="email"
                  value={guestDetails.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 ${validationErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter email address"
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile number *</label>
                <input
                  type="tel"
                  value={guestDetails.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 ${validationErrors.mobile ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter mobile number"
                />
                {validationErrors.mobile && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.mobile}</p>
                )}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none placeholder-gray-400"
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
