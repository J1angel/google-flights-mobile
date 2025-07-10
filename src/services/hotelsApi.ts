import axios from 'axios';
import { API_CONFIG } from '../config/api';

const HOTELS_API_BASE_URL = 'https://sky-scrapper.p.rapidapi.com/api/v1/hotels';

// Configure axios for hotel API calls
const hotelsApiClient = axios.create({
  baseURL: HOTELS_API_BASE_URL,
  headers: {
    'X-RapidAPI-Key': API_CONFIG.RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com',
  },
});

export interface HotelDestination {
  entityId: string;
  name: string;
  cityName: string;
  countryName: string;
  type: string;
  latitude?: number;
  longitude?: number;
}

export interface HotelSearchParams {
  entityId: string;
  checkinDate: string;
  checkoutDate: string;
  adults: number;
  children?: number;
  rooms?: number;
  currency?: string;
  countryCode?: string;
  market?: string;
}

export interface Hotel {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  price: number;
  currency: string;
  location: string;
  checkinDate: string;
  checkoutDate: string;
  amenities: string[];
  imageUrl?: string;
  description?: string;
  starRating?: number;
  distanceFromCenter?: string;
}

// Fallback hotel destinations for when API is unavailable
const fallbackHotelDestinations: HotelDestination[] = [
  {
    entityId: '27537542',
    name: 'New York',
    cityName: 'New York',
    countryName: 'United States',
    type: 'city',
    latitude: 40.7128,
    longitude: -74.0060,
  },
  {
    entityId: '27537543',
    name: 'Los Angeles',
    cityName: 'Los Angeles',
    countryName: 'United States',
    type: 'city',
    latitude: 34.0522,
    longitude: -118.2437,
  },
  {
    entityId: '27537544',
    name: 'Chicago',
    cityName: 'Chicago',
    countryName: 'United States',
    type: 'city',
    latitude: 41.8781,
    longitude: -87.6298,
  },
  {
    entityId: '27537545',
    name: 'Miami',
    cityName: 'Miami',
    countryName: 'United States',
    type: 'city',
    latitude: 25.7617,
    longitude: -80.1918,
  },
  {
    entityId: '27537546',
    name: 'Las Vegas',
    cityName: 'Las Vegas',
    countryName: 'United States',
    type: 'city',
    latitude: 36.1699,
    longitude: -115.1398,
  },
  {
    entityId: '27537547',
    name: 'Marriott Hotel',
    cityName: 'New York',
    countryName: 'United States',
    type: 'hotel',
    latitude: 40.7589,
    longitude: -73.9851,
  },
  {
    entityId: '27537548',
    name: 'Hilton Hotel',
    cityName: 'Los Angeles',
    countryName: 'United States',
    type: 'hotel',
    latitude: 34.0522,
    longitude: -118.2437,
  },
];

// Fallback hotels for when API is unavailable
const fallbackHotels: Hotel[] = [
  {
    id: '1',
    name: 'Marriott Downtown',
    rating: 4.5,
    reviews: 1250,
    price: 180,
    currency: 'USD',
    location: 'Downtown',
    checkinDate: '2023-08-10',
    checkoutDate: '2023-08-15',
    amenities: ['Free WiFi', 'Pool', 'Gym', 'Restaurant', 'Spa'],
    starRating: 4,
    distanceFromCenter: '0.5 km',
  },
  {
    id: '2',
    name: 'Hilton Garden Inn',
    rating: 4.2,
    reviews: 980,
    price: 140,
    currency: 'USD',
    location: 'City Center',
    checkinDate: '2023-08-10',
    checkoutDate: '2023-08-15',
    amenities: ['Free WiFi', 'Breakfast', 'Business Center', 'Parking'],
    starRating: 3,
    distanceFromCenter: '1.2 km',
  },
  {
    id: '3',
    name: 'Hyatt Regency',
    rating: 4.7,
    reviews: 1500,
    price: 220,
    currency: 'USD',
    location: 'Waterfront',
    checkinDate: '2023-08-10',
    checkoutDate: '2023-08-15',
    amenities: ['Free WiFi', 'Pool', 'Gym', 'Restaurant', 'Bar', 'Spa', 'Room Service'],
    starRating: 5,
    distanceFromCenter: '2.1 km',
  },
  {
    id: '4',
    name: 'Holiday Inn Express',
    rating: 4.0,
    reviews: 750,
    price: 110,
    currency: 'USD',
    location: 'Airport Area',
    checkinDate: '2023-08-10',
    checkoutDate: '2023-08-15',
    amenities: ['Free WiFi', 'Breakfast', 'Shuttle Service', 'Parking'],
    starRating: 3,
    distanceFromCenter: '8.5 km',
  },
  {
    id: '5',
    name: 'Sheraton Grand',
    rating: 4.6,
    reviews: 1100,
    price: 200,
    currency: 'USD',
    location: 'Business District',
    checkinDate: '2023-08-10',
    checkoutDate: '2023-08-15',
    amenities: ['Free WiFi', 'Pool', 'Gym', 'Restaurant', 'Conference Rooms', 'Valet Parking'],
    starRating: 4,
    distanceFromCenter: '1.8 km',
  },
];

/**
 * Search for hotel destinations or specific hotels
 * @param query - Search query for destination or hotel
 * @returns Promise<HotelDestination[]> - Array of hotel destinations
 */
export const searchHotelDestinations = async (query: string): Promise<HotelDestination[]> => {
  if (query.length < 2) {
    return [];
  }

  try {
    console.log('Searching hotel destinations for:', query);
    
    const response = await hotelsApiClient.get('/searchDestinationOrHotel', {
      params: { query },
    });

    console.log('Hotel destinations API response:', response.data);

    if (response.data && response.data.data) {
      return response.data.data.map((item: any) => ({
        entityId: item.entityId,
        name: item.name,
        cityName: item.cityName,
        countryName: item.countryName,
        type: item.type || 'destination',
        latitude: item.latitude,
        longitude: item.longitude,
      }));
    }

    return [];
  } catch (error: any) {
    console.error('Hotel destination search error:', error);
    
    // Return fallback data for common queries
    if (error.response?.status === 429 || error.response?.status === 404) {
      console.log('Using fallback hotel destination data');
      return fallbackHotelDestinations.filter(destination =>
        destination.name.toLowerCase().includes(query.toLowerCase()) ||
        destination.cityName.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    throw error;
  }
};

/**
 * Search for available hotels at a specific destination
 * @param params - Hotel search parameters
 * @returns Promise<Hotel[]> - Array of available hotels
 */
export const searchHotels = async (params: HotelSearchParams): Promise<Hotel[]> => {
  try {
    console.log('Searching hotels with params:', params);
    
    // For now, we'll return fallback data since the search API endpoint wasn't provided
    // In a real implementation, you would call the hotel search API here
    console.log('Using fallback hotel data for search');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return fallbackHotels.map(hotel => ({
      ...hotel,
      checkinDate: params.checkinDate,
      checkoutDate: params.checkoutDate,
    }));
  } catch (error: any) {
    console.error('Hotel search error:', error);
    
    // Return fallback data for API errors
    if (error.response?.status === 429 || error.response?.status === 404) {
      console.log('Using fallback hotel data');
      return fallbackHotels.map(hotel => ({
        ...hotel,
        checkinDate: params.checkinDate,
        checkoutDate: params.checkoutDate,
      }));
    }
    
    throw error;
  }
};

/**
 * Get hotel destination by entity ID
 * @param entityId - Destination entity ID
 * @returns Promise<HotelDestination | null> - Hotel destination details
 */
export const getHotelDestinationById = async (entityId: string): Promise<HotelDestination | null> => {
  try {
    // For now, we'll search through our fallback data
    // In a real implementation, you might have a separate API endpoint for this
    const destination = fallbackHotelDestinations.find(dest => dest.entityId === entityId);
    return destination || null;
  } catch (error) {
    console.error('Error getting hotel destination by ID:', error);
    return null;
  }
}; 