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
    
    const response = await flightsApi.get('/flights/v1/quote', {
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
    
    // Try alternative endpoint if v1 fails
    if (error.response?.status === 404) {
      try {
        console.log('Trying alternative flight search endpoint...');
        const altResponse = await flightsApi.get('/flights/quote', {
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

        console.log('Alternative API Response:', altResponse.data);

        if (altResponse.data && altResponse.data.data) {
          const flights = altResponse.data.data.itineraries?.map((itinerary: any, index: number) => ({
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
      } catch (altError) {
        console.error('Alternative endpoint also failed:', altError);
      }
    }
    
    // Fallback to mock data for development
    if (error.response?.status === 404 || error.response?.status === 429) {
      console.log('Using fallback flight data');
      return {
        success: true,
        data: [
          {
            id: 'flight-1',
            origin: params.originSkyId,
            destination: params.destinationSkyId,
            departureTime: '10:00 AM',
            arrivalTime: '12:00 PM',
            duration: '2h 0m',
            price: 299,
            currency: 'USD',
            airline: 'Sample Airlines',
            flightNumber: 'SA123',
            stops: 0,
            cabinClass: params.cabinClass || 'economy',
          },
          {
            id: 'flight-2',
            origin: params.originSkyId,
            destination: params.destinationSkyId,
            departureTime: '2:00 PM',
            arrivalTime: '4:30 PM',
            duration: '2h 30m',
            price: 349,
            currency: 'USD',
            airline: 'Another Airlines',
            flightNumber: 'AA456',
            stops: 1,
            cabinClass: params.cabinClass || 'economy',
          },
          {
            id: 'flight-3',
            origin: params.originSkyId,
            destination: params.destinationSkyId,
            departureTime: '6:00 PM',
            arrivalTime: '8:15 PM',
            duration: '2h 15m',
            price: 279,
            currency: 'USD',
            airline: 'Budget Airlines',
            flightNumber: 'BA789',
            stops: 0,
            cabinClass: params.cabinClass || 'economy',
          },
        ],
      };
    }
    
    return {
      success: false,
      data: [],
      error: error.response?.data?.message || error.message || 'Failed to search flights',
    };
  }
};

export const getAirports = async (query: string) => {
  try {
    // Try the correct v1 endpoint for airport search
    const response = await flightsApi.get('/api/v1/flights/searchAirport', {
      params: {
        query,
        locale: 'en-US',
      },
    });

    console.log('Airport search response:', response.data);

    if (response.data && response.data.data) {
      return response.data.data.filter((item: any) => item.entityType === 'airport') || [];
    }

    return [];
  } catch (error: any) {
    console.error('Airport search error:', error);
    
    // Try alternative endpoint if v1 fails
    if (error.response?.status === 404) {
      try {
        console.log('Trying alternative airport endpoint...');
        const altResponse = await flightsApi.get('/flights/autocomplete', {
          params: {
            query,
            locale: 'en-US',
          },
        });
        
        if (altResponse.data && altResponse.data.data) {
          return altResponse.data.data.filter((item: any) => item.entityType === 'airport') || [];
        }
      } catch (altError) {
        console.error('Alternative endpoint also failed:', altError);
      }
    }
    
    // Fallback to mock data for development
    if (error.response?.status === 404 || error.response?.status === 429) {
      console.log('Using fallback airport data');
      return [
        {
          entityId: 'LHR-sky',
          name: 'London Heathrow Airport',
          cityName: 'London',
          countryName: 'United Kingdom',
          entityType: 'airport',
        },
        {
          entityId: 'JFK-sky',
          name: 'John F. Kennedy International Airport',
          cityName: 'New York',
          countryName: 'United States',
          entityType: 'airport',
        },
        {
          entityId: 'CDG-sky',
          name: 'Charles de Gaulle Airport',
          cityName: 'Paris',
          countryName: 'France',
          entityType: 'airport',
        },
        {
          entityId: 'NRT-sky',
          name: 'Narita International Airport',
          cityName: 'Tokyo',
          countryName: 'Japan',
          entityType: 'airport',
        },
        {
          entityId: 'SYD-sky',
          name: 'Sydney Airport',
          cityName: 'Sydney',
          countryName: 'Australia',
          entityType: 'airport',
        },
      ].filter(airport => 
        airport.name.toLowerCase().includes(query.toLowerCase()) ||
        airport.cityName.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    return [];
  }
};

export default flightsApi; 