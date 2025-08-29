'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SideNavbar from '../../components/SideNavbar';

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hotelId = searchParams.get('id');
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('debit-card');
  const [hotelData, setHotelData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotelData = async () => {
      if (hotelId) {
        try {
          const response = await fetch(`/api/hotels/${hotelId}`);
          if (response.ok) {
            const data = await response.json();
            setHotelData(data.hotel);
          }
        } catch (error) {
          console.error('Error fetching hotel data:', error);
        }
      }
      setLoading(false);
    };

    fetchHotelData();
  }, [hotelId]);

  const handleGoBack = () => {
    router.back();
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const paymentMethods = [
    {
      id: 'debit-card',
      name: 'Debit Card',
      icon: '💳',
      color: '#4F46E5'
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: '📱',
      color: '#059669'
    },
    {
      id: 'phonepe',
      name: 'PhonePay',
      icon: '📞',
      color: '#7C3AED'
    },
    {
      id: 'net-banking',
      name: 'Net Banking',
      icon: '🏦',
      color: '#F59E0B'
    },
    {
      id: 'credit-card',
      name: 'Credit Card',
      icon: '💳',
      color: '#1F2937'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SideNavbar />
      
      <div className="md:ml-[157px] pb-[100px] md:pb-0">
        {/* Header */}
        <div className="bg-white p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={handleGoBack} className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-800">Payments</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Content - Payment Methods */}
            <div className="flex-1">
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Details</h2>
                
                {/* Payment Methods */}
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => handlePaymentMethodSelect(method.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedPaymentMethod === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                            style={{ backgroundColor: method.color }}
                          >
                            {method.icon}
                          </div>
                          <span className="font-medium text-gray-800">{method.name}</span>
                        </div>
                        {method.id === 'upi' && (
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </div>
                      
                      {/* UPI Special Layout */}
                      {method.id === 'upi' && selectedPaymentMethod === 'upi' && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-bold">GP</span>
                            </div>
                            <span className="font-medium">UPI</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Continue Button */}
                <button 
                  onClick={() => router.push('/success')}
                  className="w-full mt-8 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            </div>

            {/* Right Sidebar - Price Summary */}
            <div className="w-full lg:w-80">
              <div className="bg-white rounded-lg p-6 sticky top-4">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base fare</span>
                    <span className="text-gray-800">1,000.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total discount</span>
                    <span className="text-gray-800">0.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Price after discount</span>
                    <span className="text-gray-800">1,000.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes & service fees</span>
                    <span className="text-gray-800">140.00</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span className="text-blue-600">Total Amount</span>
                      <span className="text-blue-600">1,140.00</span>
                    </div>
                  </div>
                </div>

                {/* Hotel Info */}
                {hotelData && (
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex gap-3">
                      <img
                        src={hotelData.image}
                        alt={hotelData.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{hotelData.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{hotelData.location}</p>
                        <div className="flex items-center mt-1">
                          <div className="flex text-yellow-400 text-xs">
                            {'★'.repeat(Math.floor(hotelData.rating))}
                          </div>
                          <span className="text-xs text-gray-600 ml-1">{hotelData.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
