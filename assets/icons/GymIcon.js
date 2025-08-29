const GymIcon = ({ className = "w-6 h-6", color = "white" }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none"
    >
      {/* Weight plates on ends */}
      <rect 
        x="2" 
        y="10" 
        width="3" 
        height="4" 
        rx="0.5" 
        fill="#2D3DDF"
      />
      <rect 
        x="19" 
        y="10" 
        width="3" 
        height="4" 
        rx="0.5" 
        fill="#2D3DDF"
      />
      {/* Barbell bar */}
      <rect 
        x="5" 
        y="11" 
        width="14" 
        height="2" 
        fill="#2D3DDF"
      />
      {/* Grip sections */}
      <rect 
        x="8" 
        y="11.2" 
        width="1" 
        height="1.6" 
        fill="white"
      />
      <rect 
        x="10" 
        y="11.2" 
        width="1" 
        height="1.6" 
        fill="white"
      />
      <rect 
        x="13" 
        y="11.2" 
        width="1" 
        height="1.6" 
        fill="white"
      />
      <rect 
        x="15" 
        y="11.2" 
        width="1" 
        height="1.6" 
        fill="white"
      />
    </svg>
  );
};
export default GymIcon;
