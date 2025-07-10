import axios from 'axios';
import { API_CONFIG } from '../config/api';

const CARS_API_BASE_URL = 'https://sky-scrapper.p.rapidapi.com/api/v1/cars';

// Configure axios for car API calls
const carsApiClient = axios.create({
  baseURL: CARS_API_BASE_URL,
  headers: {
    'X-RapidAPI-Key': API_CONFIG.RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com',
  },
});

export interface CarLocation {
  entityId: string;
  name: string;
  cityName: string;
  countryName: string;
  type: string;
}

export interface CarSearchParams {
  pickUpEntityId: string;
  pickUpDate: string;
  pickUpTime: string;
  currency?: string;
  countryCode?: string;
  market?: string;
}

export interface CarRental {
  id: string;
  company: string;
  carModel: string;
  carType: string;
  price: number;
  currency: string;
  location: string;
  pickupDate: string;
  returnDate: string;
  features: string[];
  imageUrl?: string;
  rating?: number;
  reviews?: number;
}

// Fallback car locations for when API is unavailable
const fallbackCarLocations: CarLocation[] = [
  {
    entityId: '27537542',
    name: 'Los Angeles International Airport',
    cityName: 'Los Angeles',
    countryName: 'United States',
    type: 'airport',
  },
  {
    entityId: '27537543',
    name: 'John F. Kennedy International Airport',
    cityName: 'New York',
    countryName: 'United States',
    type: 'airport',
  },
  {
    entityId: '27537544',
    name: 'O\'Hare International Airport',
    cityName: 'Chicago',
    countryName: 'United States',
    type: 'airport',
  },
  {
    entityId: '27537545',
    name: 'Miami International Airport',
    cityName: 'Miami',
    countryName: 'United States',
    type: 'airport',
  },
  {
    entityId: '27537546',
    name: 'Dallas/Fort Worth International Airport',
    cityName: 'Dallas',
    countryName: 'United States',
    type: 'airport',
  },
];

// Fallback car rentals for when API is unavailable
const fallbackCarRentals: CarRental[] = [
  {
    id: '1',
    company: 'Hertz',
    carModel: 'Toyota Corolla',
    carType: 'economy',
    price: 45,
    currency: 'USD',
    location: 'Airport Location',
    pickupDate: '2023-08-10',
    returnDate: '2023-08-15',
    features: ['Automatic', 'Air Conditioning', 'Bluetooth'],
    rating: 4.2,
    reviews: 1250,
  },
  {
    id: '2',
    company: 'Enterprise',
    carModel: 'Honda Civic',
    carType: 'economy',
    price: 42,
    currency: 'USD',
    location: 'Airport Location',
    pickupDate: '2023-08-10',
    returnDate: '2023-08-15',
    features: ['Automatic', 'Air Conditioning', 'USB Charging'],
    rating: 4.1,
    reviews: 980,
  },
  {
    id: '3',
    company: 'Avis',
    carModel: 'Ford Escape',
    carType: 'suv',
    price: 65,
    currency: 'USD',
    location: 'Airport Location',
    pickupDate: '2023-08-10',
    returnDate: '2023-08-15',
    features: ['Automatic', 'Air Conditioning', 'GPS', 'All-Wheel Drive'],
    rating: 4.3,
    reviews: 750,
  },
  {
    id: '4',
    company: 'Budget',
    carModel: 'Nissan Altima',
    carType: 'midsize',
    price: 55,
    currency: 'USD',
    location: 'Airport Location',
    pickupDate: '2023-08-10',
    returnDate: '2023-08-15',
    features: ['Automatic', 'Air Conditioning', 'Backup Camera'],
    rating: 4.0,
    reviews: 620,
  },
];

/**
 * Search for car rental locations (airports, cities, etc.)
 * @param query - Search query for location
 * @returns Promise<CarLocation[]> - Array of car rental locations
 */
export const searchCarLocations = async (query: string): Promise<CarLocation[]> => {
  if (query.length < 2) {
    return [];
  }

  try {
    console.log('Searching car locations for:', query);
    
    const response = await carsApiClient.get('/searchLocation', {
      params: { query },
    });

    console.log('Car locations API response:', response.data);

    if (response.data && response.data.data) {
      return response.data.data.map((item: any) => ({
        entityId: item.entityId,
        name: item.name,
        cityName: item.cityName,
        countryName: item.countryName,
        type: item.type || 'location',
      }));
    }

    return [];
  } catch (error: any) {
    console.error('Car location search error:', error);
    
    // Return fallback data for common queries
    if (error.response?.status === 429 || error.response?.status === 404) {
      console.log('Using fallback car location data');
      return fallbackCarLocations.filter(location =>
        location.name.toLowerCase().includes(query.toLowerCase()) ||
        location.cityName.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    throw error;
  }
};

/**
 * Search for available cars at a specific location
 * @param params - Car search parameters
 * @returns Promise<CarRental[]> - Array of available car rentals
 */
export const searchCars = async (params: CarSearchParams): Promise<CarRental[]> => {
  try {
    console.log('Searching cars with params:', params);
    
    const response = await carsApiClient.get('/searchCars', {
      params: {
        pickUpEntityId: params.pickUpEntityId,
        pickUpDate: params.pickUpDate,
        pickUpTime: params.pickUpTime,
        currency: params.currency || 'USD',
        countryCode: params.countryCode || 'US',
        market: params.market || 'en-US',
      },
    });

    console.log('Car search API response:', response.data);

    if (response.data && response.data.data) {
      return response.data.data.map((item: any) => ({
        id: item.id || Math.random().toString(),
        company: item.company || 'Unknown',
        carModel: item.carModel || item.model || 'Unknown Model',
        carType: item.carType || 'standard',
        price: item.price || 0,
        currency: item.currency || 'USD',
        location: item.location || 'Airport Location',
        pickupDate: params.pickUpDate,
        returnDate: params.pickUpDate, // You might want to calculate this based on duration
        features: item.features || ['Automatic', 'Air Conditioning'],
        imageUrl: item.imageUrl,
        rating: item.rating,
        reviews: item.reviews,
      }));
    }

    return [];
  } catch (error: any) {
    console.error('Car search error:', error);
    
    // Return fallback data for API errors
    if (error.response?.status === 429 || error.response?.status === 404) {
      console.log('Using fallback car rental data');
      return fallbackCarRentals;
    }
    
    throw error;
  }
};

/**
 * Get car location by entity ID
 * @param entityId - Location entity ID
 * @returns Promise<CarLocation | null> - Car location details
 */
export const getCarLocationById = async (entityId: string): Promise<CarLocation | null> => {
  try {
    // For now, we'll search through our fallback data
    // In a real implementation, you might have a separate API endpoint for this
    const location = fallbackCarLocations.find(loc => loc.entityId === entityId);
    return location || null;
  } catch (error) {
    console.error('Error getting car location by ID:', error);
    return null;
  }
}; 