import { NextResponse } from 'next/server';
import hotelsData from '../../../../data/hotels.json';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const hotelId = parseInt(id);
    const hotel = hotelsData.hotels.find(h => h.id === hotelId);
    
    if (!hotel) {
      return NextResponse.json(
        { error: 'Hotel not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(hotel);
  } catch (error) {
    console.error('Error loading hotel details:', error);
    return NextResponse.json(
      { error: 'Failed to load hotel details' },
      { status: 500 }
    );
  }
}
