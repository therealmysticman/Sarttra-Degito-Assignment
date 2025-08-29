'use client';

export default function RoomCard({ room, onBookNow, className = '' }) {
  if (!room) {
    return null;
  }

  return (
    <div className={`relative flex items-stretch bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      {/* Room Image */}
      <img
        src={room.image}
        alt={room.type}
        className="w-24 h-20 sm:w-32 sm:h-24 md:w-44 md:h-28 lg:w-56 lg:h-32 object-cover flex-shrink-0"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'block';
        }}
      />
      {/* Fallback if image fails to load */}
      <div 
        className="w-24 h-20 sm:w-32 sm:h-24 md:w-44 md:h-28 lg:w-56 lg:h-32 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0"
        style={{display: 'none'}}
      >
        <span className="text-lg sm:text-xl md:text-2xl">🏨</span>
      </div>
      
      {/* Room Details */}
      <div className="flex-1 p-2 sm:p-3">
        <div className="font-semibold text-sm sm:text-base truncate text-gray-600">{room.type}</div>
        <div className="mt-1 sm:mt-2 font-semibold text-indigo-600 text-sm sm:text-base">{room.price}</div>
      </div>

      {/* Vertical Book Now Button */}
      <button
        className="w-10 sm:w-12 text-white flex items-center justify-center rounded-r-xl hover:bg-indigo-700 transition-colors"
        style={{backgroundColor: '#2D3DDF'}}
        aria-label="Book Now"
        onClick={(e) => {
          e.stopPropagation();
          onBookNow && onBookNow(room);
        }}
      >
        <span className="rotate-90 select-none tracking-wide text-xs sm:text-sm whitespace-nowrap transform translate-y-0.5">Book Now</span>
      </button>
    </div>
  );
}
