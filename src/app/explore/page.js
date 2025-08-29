'use client';

import SideNavbar from '../../components/SideNavbar';
import SearchSection from '../../components/SearchSection';
import { ArrowIcon, AppIcon } from '../../../assets/icons/index';

const ExplorePage = () => {

  return (
    <div className="min-h-screen bg-gray-50">
      <SideNavbar />
      
      {/* Main content area */}
      <div className="md:ml-[157px] pb-[100px] md:pb-0 flex flex-col md:flex-row">
        {/* Mobile Hero Section */}
        <div className="md:hidden w-full h-96 relative">
          <div 
            className="w-full h-full bg-cover relative rounded-bl-[32px] rounded-br-[32px] overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(45deg, rgba(45, 61, 223, 0.8), rgba(45, 61, 223, 0.6)), url('/tajmahal.png')`,
              backgroundPosition: 'center 1%'
            }}
          >
            {/* App Icon - Top Left */}
            <div className="absolute top-6 left-6">
              <AppIcon className="w-8 h-8" color="white" />
            </div>
            
            {/* Mobile Content Overlay - Positioned at bottom */}
            <div className="absolute bottom-8 left-6 right-6 text-center text-white">
              <h1 className="text-3xl font-bold mb-3">Incredible India</h1>
              <p className="text-sm mb-4 leading-relaxed">
                &ldquo;For where thy treasure is, here also will thy heart be.&rdquo;
              </p>
              <button 
                className="text-white px-5 py-2 rounded-lg font-semibold transition-all border border-white border-opacity-30 backdrop-blur-sm hover:bg-white hover:bg-opacity-30"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                Take Tour
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar Component */}
        <SearchSection />

                {/* Right Hero Section - Desktop Only */}
        <div className="hidden md:flex flex-1 relative justify-end rounded-bl-[40px] rounded-tl-[40px] overflow-hidden">
          {/* Background Image */}
          <div 
            className="w-[983px] h-[1080px] bg-cover bg-center relative ml-auto"
                         style={{
               backgroundImage: `linear-gradient(45deg, rgba(45, 61, 223, 0.8), rgba(45, 61, 223, 0.6)), url('/tajmahal.png')`,
               backgroundSize: '983px 1080px'
             }}
          >
            {/* Arrow Icon */}
            <div className="absolute top-1/2 right-12 transform -translate-y-1/2 z-30">
              <ArrowIcon />
            </div>
            
            {/* Content Overlay - Positioned in lower-left */}
            <div className="absolute bottom-20 left-12 text-left text-white max-w-md">
              <h1 className="text-5xl font-bold mb-4">Incredible India</h1>
              <p className="text-lg mb-6 leading-relaxed">
                &ldquo;For where thy treasure is, here also will thy heart be.&rdquo;
              </p>
              <button 
                className="text-white px-6 py-3 rounded-lg font-semibold transition-all border border-white border-opacity-30 backdrop-blur-sm hover:bg-white hover:bg-opacity-30"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                Take Tour
              </button>
            </div>

            {/* Heart Icon */}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
