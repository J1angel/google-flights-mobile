import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface Flight {
  id: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  airline: string;
}

interface FlightsState {
  flights: Flight[];
  selectedFlight: Flight | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: FlightsState = {
  flights: [],
  selectedFlight: null,
  isLoading: false,
  error: null,
};

// Async thunk for fetching flights
export const fetchFlights = createAsyncThunk(
  'flights/fetchFlights',
  async (searchParams: { origin: string; destination: string; date: string }) => {
    // Simulate API call
    const response = await new Promise<Flight[]>((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            origin: searchParams.origin,
            destination: searchParams.destination,
            departureTime: '10:00 AM',
            arrivalTime: '12:00 PM',
            price: 299,
            airline: 'Sample Airlines',
          },
          {
            id: '2',
            origin: searchParams.origin,
            destination: searchParams.destination,
            departureTime: '2:00 PM',
            arrivalTime: '4:00 PM',
            price: 349,
            airline: 'Another Airlines',
          },
        ]);
      }, 1000);
    });
    return response;
  }
);

const flightsSlice = createSlice({
  name: 'flights',
  initialState,
  reducers: {
    selectFlight: (state, action: PayloadAction<Flight>) => {
      state.selectedFlight = action.payload;
    },
    clearSelectedFlight: (state) => {
      state.selectedFlight = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlights.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFlights.fulfilled, (state, action) => {
        state.isLoading = false;
        state.flights = action.payload;
      })
      .addCase(fetchFlights.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch flights';
      });
  },
});

export const { selectFlight, clearSelectedFlight, clearError } = flightsSlice.actions;
export default flightsSlice.reducer; 