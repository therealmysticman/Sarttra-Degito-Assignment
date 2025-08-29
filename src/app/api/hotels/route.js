import { NextResponse } from 'next/server';
import hotelsData from '../../../data/hotels.json';

export async function GET() {
  try {
    return NextResponse.json(hotelsData);
  } catch (error) {
    console.error('Error loading hotels data:', error);
    return NextResponse.json(
      { error: 'Failed to load hotels data' },
      { status: 500 }
    );
  }
}

// Optional: Add POST method for filtering/searching hotels
export async function POST(request) {
  try {
    const body = await request.json();
    const { location, minPrice, maxPrice, category, guests } = body;
    
    let filteredHotels = hotelsData.hotels;
    
    // Apply filters
    if (location) {
      filteredHotels = filteredHotels.filter(hotel =>
        hotel.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    if (minPrice) {
      filteredHotels = filteredHotels.filter(hotel =>
        hotel.priceNumeric >= minPrice
      );
    }
    
    if (maxPrice) {
      filteredHotels = filteredHotels.filter(hotel =>
        hotel.priceNumeric <= maxPrice
      );
    }
    
    if (category) {
      filteredHotels = filteredHotels.filter(hotel =>
        hotel.category === category
      );
    }
    
    // Filter by guest capacity
    if (guests) {
      filteredHotels = filteredHotels.filter(hotel =>
        hotel.guests && hotel.guests.includes(guests)
      );
    }
    
    return NextResponse.json({
      ...hotelsData,
      hotels: filteredHotels
    });
  } catch (error) {
    console.error('Error filtering hotels:', error);
    return NextResponse.json(
      { error: 'Failed to filter hotels' },
      { status: 500 }
    );
  }
}
