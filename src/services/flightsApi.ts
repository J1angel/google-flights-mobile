import axios from 'axios';
import { API_CONFIG } from '../config/api';

const flightsApi = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'X-RapidAPI-Key': API_CONFIG.RAPIDAPI_KEY,
    'X-RapidAPI-Host': API_CONFIG.RAPIDAPI_HOST,
  },
});

export interface FlightSearchParams {
  originSkyId: string;
  destinationSkyId: string;
  date: string;
  adults?: number;
  children?: number;
  infants?: number;
  cabinClass?: string;
  currency?: string;
  locale?: string;
}

export interface Flight {
  id: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
  airline: string;
  flightNumber: string;
  stops: number;
  cabinClass: string;
}

export interface FlightSearchResponse {
  success: boolean;
  data: Flight[];
  error?: string;
}

export const searchFlights = async (params: FlightSearchParams): Promise<FlightSearchResponse> => {
  try {
    console.log('Searching flights with params:', params);
    
    const response = await flightsApi.get('/flights/v2/quote', {
      params: {
        originSkyId: params.originSkyId,
        destinationSkyId: params.destinationSkyId,
        date: params.date,
        adults: params.adults || 1,
        children: params.children || 0,
        infants: params.infants || 0,
        cabinClass: params.cabinClass || 'economy',
        currency: params.currency || 'USD',
        locale: params.locale || 'en-US',
      },
    });

    console.log('API Response:', response.data);

    if (response.data && response.data.data) {
      const flights = response.data.data.itineraries?.map((itinerary: any, index: number) => ({
        id: `flight-${index}`,
        origin: params.originSkyId,
        destination: params.destinationSkyId,
        departureTime: itinerary.legs?.[0]?.departure || 'N/A',
        arrivalTime: itinerary.legs?.[0]?.arrival || 'N/A',
        duration: itinerary.legs?.[0]?.duration || 'N/A',
        price: itinerary.pricingOptions?.[0]?.price?.amount || 0,
        currency: itinerary.pricingOptions?.[0]?.price?.currency || 'USD',
        airline: itinerary.legs?.[0]?.carriers?.marketing?.[0]?.name || 'Unknown',
        flightNumber: itinerary.legs?.[0]?.carriers?.marketing?.[0]?.flightNumber || 'N/A',
        stops: (itinerary.legs?.length || 1) - 1,
        cabinClass: params.cabinClass || 'economy',
      })) || [];

      return {
        success: true,
        data: flights,
      };
    }

    return {
      success: false,
      data: [],
      error: 'No flight data received',
    };
  } catch (error: any) {
    console.error('Flight search error:', error);
    return {
      success: false,
      data: [],
      error: error.response?.data?.message || error.message || 'Failed to search flights',
    };
  }
};

export const getAirports = async (query: string) => {
  try {
    const response = await flightsApi.get('/flights/v2/autocomplete', {
      params: {
        query,
        locale: 'en-US',
      },
    });

    return response.data.data || [];
  } catch (error: any) {
    console.error('Airport search error:', error);
    return [];
  }
};

export default flightsApi; 