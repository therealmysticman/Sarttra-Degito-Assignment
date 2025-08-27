'use client';

import { useState, useEffect } from 'react';
import {HomeIcon, AppIcon, SearchIcon, TripsIcon, ProfileIcon} from '../../assets/icons/index';

const SideNavbar = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (isMobile) {
    // Mobile layout - bottom navigation bar
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div 
          className="w-full h-[100px] flex-shrink-0 rounded-t-[32px]"
          style={{ background: '#2D3DDF' }}
        >
          {/* Mobile navigation content */}
          <div className="flex items-center justify-around h-full px-6">
            <div className="text-white text-center">
              <div className="flex justify-center mb-1">
                <HomeIcon className="w-6 h-6" />
              </div>
              <div className="text-xs">Home</div>
            </div>
            <div className="text-white text-center">
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-white rounded-full flex flex-col items-center justify-center">
                  <SearchIcon className="w-5 h-5" color="#2D3DDF" />
                  <div className="text-xs font-medium text-blue-600" style={{ fontSize: '8px', lineHeight: '10px' }}>Explore</div>
                </div>
              </div>
            </div>
            <div className="text-white text-center">
              <div className="flex justify-center mb-1">
                <TripsIcon className="w-6 h-6" />
              </div>
              <div className="text-xs">Trips</div>
            </div>
            <div className="text-white text-center">
              <div className="flex justify-center mb-1">
                <ProfileIcon className="w-6 h-6" />
              </div>
              <div className="text-xs">Profile</div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Desktop layout - left side navigation bar
  return (
    <nav className="fixed left-0 top-0 h-screen z-50">
      <div 
        className="w-[157px] h-full flex-shrink-0 rounded-tr-[35px] rounded-br-[35px]"
        style={{ background: '#2D3DDF' }}
      >
        {/* Desktop navigation content */}
        <div className="flex flex-col items-center h-full py-12 px-4">
          {/* Logo/Brand at top */}
          <div className="text-white text-center mb-24">
              <div className="flex justify-center mb-24">
                <AppIcon className="w-8 h-8" />
              </div>
          </div>

          {/* Navigation Items - vertically spaced */}
          <div className="flex flex-col justify-start flex-1 space-y-12">
            {/* Home */}
            <div className="text-white text-center">
              <div className="flex justify-center mb-2">
                <HomeIcon className="w-6 h-6" />
              </div>
              <div className="text-xs font-medium">Home</div>
            </div>
            
                         {/* Explore - with white background circle */}
             <div className="text-white text-center cursor-pointer">
               <div className="flex justify-center">
                 <div className="w-16 h-16 bg-white rounded-full flex flex-col items-center justify-center">
                   <SearchIcon className="w-6 h-6" color="#2D3DDF" />
                   <div className="text-xs font-medium text-blue-600 mt-1">Explore</div>
                 </div>
               </div>
             </div>
            
            {/* Trips */}
            <div className="text-white text-center">
              <div className="flex justify-center mb-2">
                <TripsIcon className="w-6 h-6" />
              </div>
              <div className="text-xs font-medium">Trips</div>
            </div>
            
            {/* Profile */}
            <div className="text-white text-center">
              <div className="flex justify-center mb-2">
                <ProfileIcon className="w-6 h-6" />
              </div>
              <div className="text-xs font-medium">Profile</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SideNavbar;
