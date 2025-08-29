import React from 'react';

const OtherIcon = ({ className = "w-6 h-6", color = "#2D3DDF", strokeWidth = 2 }) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke={color}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Three dots representing "more" or "other" options */}
      <circle cx="5" cy="12" r="2" fill={color} />
      <circle cx="12" cy="12" r="2" fill={color} />
      <circle cx="19" cy="12" r="2" fill={color} />
    </svg>
  );
};

export default OtherIcon;
