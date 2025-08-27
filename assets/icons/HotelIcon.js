const HotelIcon = ({ className = "w-6 h-6", color = "white" }) => {
    return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className={className}
        >
          {/* hotel */}
          <rect x="3" y="7" width="18" height="14" rx="2" ry="2" stroke={color} strokeWidth="1.5" fill="transparent" />
          
    
          {/* windows */}
          <rect x="7" y="11" width="2" height="2" fill="white" />
          <rect x="11" y="11" width="2" height="2" fill="white" />
          <rect x="15" y="11" width="2" height="2" fill="white" />
          
          <rect x="7" y="15" width="2" height="2" fill="white" />
          <rect x="11" y="15" width="2" height="2" fill="white" />
          <rect x="15" y="15" width="2" height="2" fill="white" />
    
          {/* door */}
          <rect x="11" y="17" width="2" height="4" fill="white" />
        </svg>
      );
    };
    export default HotelIcon;