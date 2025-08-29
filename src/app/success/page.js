'use client';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Header */}
       
        {/* Success Illustration */}
        <div className="mb-8 flex justify-center">
          <div className="w-100 h-100 flex items-center justify-center">
            <img
              src="/success_logo.png"
              alt="Booking Success"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Success Message */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-blue-600 mb-2">
            Booking Successfully completed
          </h1>
          <p className="text-gray-600 text-sm">
            Your trip schedule is ready, please check under profile.
          </p>
        </div>

        {/* Home Button */}
        <button
          onClick={handleGoHome}
          className="w-32 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          Home
        </button>
      </div>
    </div>
  );
}
