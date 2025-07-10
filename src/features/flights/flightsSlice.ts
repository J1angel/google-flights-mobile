import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { searchFlights, Flight, FlightSearchParams } from '../../services/flightsApi';

interface FlightsState {
  flights: Flight[];
  selectedFlight: Flight | null;
  isLoading: boolean;
  error: string | null;
  searchParams: FlightSearchParams | null;
}

const initialState: FlightsState = {
  flights: [],
  selectedFlight: null,
  isLoading: false,
  error: null,
  searchParams: null,
};

export const fetchFlights = createAsyncThunk(
  'flights/fetchFlights',
  async (searchParams: FlightSearchParams) => {
    console.log('Fetching flights with params:', searchParams);
    const response = await searchFlights(searchParams);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch flights');
    }
    
    return {
      flights: response.data,
      searchParams,
    };
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
    clearFlights: (state) => {
      state.flights = [];
      state.selectedFlight = null;
      state.error = null;
      state.searchParams = null;
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
        state.flights = action.payload.flights;
        state.searchParams = action.payload.searchParams;
        state.error = null;
      })
      .addCase(fetchFlights.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch flights';
      });
  },
});

export const { selectFlight, clearSelectedFlight, clearError, clearFlights } = flightsSlice.actions;
export default flightsSlice.reducer; 