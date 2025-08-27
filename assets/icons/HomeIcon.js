const HomeIcon = ({ className = "w-6 h-6", color = "white" }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="19" 
      height="21" 
      viewBox="0 0 19 21" 
      fill="none"
      className={className}
    >
      <path 
        d="M0.951172 7.64705L9.50017 0.998047L18.0512 7.64705V18.098C18.0512 18.602 17.851 19.0852 17.4947 19.4415C17.1384 19.7979 16.6551 19.998 16.1512 19.998H2.85117C2.34726 19.998 1.86399 19.7979 1.50767 19.4415C1.15135 19.0852 0.951172 18.602 0.951172 18.098V7.64705Z" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M6.50012 19.9961V9.99609H12.5001V19.9961" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default HomeIcon;
