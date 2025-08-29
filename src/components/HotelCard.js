export default function HotelCard({ hotel, onViewDetails }) {
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(hotel);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow relative"
      style={{
        width: '449px',
        height: '347px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      {/* Hotel Image */}
      <div className="relative w-full" style={{ height: '240px' }}>
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Hotel Info Container */}
      <div 
        className="w-full px-4 pt-3 pb-4" 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '12px',
          flex: 1
        }}
      >
        {/* Hotel Name */}
        <h3 
          className="font-semibold text-lg leading-tight"
          style={{ color: '#221F3C', margin: 0 }}
        >
          {hotel.name}
        </h3>
        
        {/* Price and Button Row */}
        <div 
          className="w-full"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {/* Hotel Price */}
          <p 
            className="text-sm"
            style={{ color: '#221F3C', margin: 0 }}
          >
            {hotel.price}
          </p>
          
          {/* View Details Button */}
          <button 
            onClick={handleViewDetails}
            className="py-2 px-4 rounded-lg transition-colors text-sm font-medium"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#2D3DDF',
              border: '1px solid #2D3DDF'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#2D3DDF';
              e.target.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#FFFFFF';
              e.target.style.color = '#2D3DDF';
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
