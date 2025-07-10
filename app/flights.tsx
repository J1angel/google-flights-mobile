import { StatusBar } from 'expo-status-bar';
import { Text, View, Alert, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../src/store';
import { fetchFlights, selectFlight, clearFlights } from '../src/features/flights/flightsSlice';
import { useState } from 'react';
import { getAirports } from '../src/services/flightsApi';
import CalendarPicker from '../src/components/CalendarPicker';
import LoadingSpinner from '../src/components/LoadingSpinner';

interface Airport {
  entityId: string;
  name: string;
  cityName: string;
  countryName: string;
}

export default function Flights() {
  const dispatch = useAppDispatch();
  const flights = useAppSelector((state) => state.flights);

  const [searchForm, setSearchForm] = useState({
    origin: '',
    destination: '',
    date: '',
    adults: '1',
  });

  const [airports, setAirports] = useState<Airport[]>([]);
  const [showOriginAirports, setShowOriginAirports] = useState(false);
  const [showDestinationAirports, setShowDestinationAirports] = useState(false);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const searchAirports = async (query: string) => {
    if (query.length < 2) return;
    
    try {
      const results = await getAirports(query);
      setAirports(results);
      // Check if we're using fallback data
      if (results.length > 0 && results[0].entityId?.includes('-sky')) {
        setIsUsingFallback(true);
      }
    } catch (error) {
      console.error('Error searching airports:', error);
    }
  };

  const handleOriginChange = (text: string) => {
    setSearchForm({ ...searchForm, origin: text });
    setShowOriginAirports(true);
    searchAirports(text);
  };

  const handleDestinationChange = (text: string) => {
    setSearchForm({ ...searchForm, destination: text });
    setShowDestinationAirports(true);
    searchAirports(text);
  };

  const selectAirport = (airport: Airport, type: 'origin' | 'destination') => {
    setSearchForm({ 
      ...searchForm, 
      [type]: `${airport.cityName} (${airport.name})` 
    });
    setShowOriginAirports(false);
    setShowDestinationAirports(false);
  };

  const handleSearchFlights = () => {
    if (!searchForm.origin || !searchForm.destination || !searchForm.date) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Extract airport codes from the selected airports
    const originAirport = airports.find(a => 
      searchForm.origin.includes(a.cityName) && searchForm.origin.includes(a.name)
    );
    const destinationAirport = airports.find(a => 
      searchForm.destination.includes(a.cityName) && searchForm.destination.includes(a.name)
    );

    if (!originAirport || !destinationAirport) {
      Alert.alert('Error', 'Please select valid airports from the suggestions');
      return;
    }

    dispatch(fetchFlights({
      originSkyId: originAirport.entityId,
      destinationSkyId: destinationAirport.entityId,
      date: searchForm.date,
      adults: parseInt(searchForm.adults),
    }));
  };

  const handleSelectFlight = (flight: any) => {
    dispatch(selectFlight(flight));
    Alert.alert(
      'Flight Selected', 
      `Selected ${flight.airline} flight ${flight.flightNumber}\nFrom ${flight.origin} to ${flight.destination}\nPrice: ${flight.currency} ${flight.price}`
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-5">
      <View className="bg-white p-5 rounded-xl mb-5 shadow-lg">
        <Text className="text-xl font-bold mb-2.5 text-gray-800">Search Flights</Text>
        <Text className="text-base text-gray-600 mb-5 text-center">Find the best flight deals for your trip</Text>
        
        <View className="mb-4 relative">
          <Text className="text-base font-semibold mb-1 text-gray-800">From</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 text-base bg-white"
            placeholder="Enter origin city or airport"
            value={searchForm.origin}
            onChangeText={handleOriginChange}
            onFocus={() => setShowOriginAirports(true)}
          />
          {showOriginAirports && airports.length > 0 && (
            <View className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg z-50 max-h-48">
              {airports.slice(0, 5).map((airport) => (
                <TouchableOpacity
                  key={airport.entityId}
                  className="p-3 border-b border-gray-200"
                  onPress={() => selectAirport(airport, 'origin')}
                >
                  <Text className="text-base font-semibold text-gray-800">{airport.name}</Text>
                  <Text className="text-sm text-gray-600 mt-0.5">
                    {airport.cityName}, {airport.countryName}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View className="mb-4 relative">
          <Text className="text-base font-semibold mb-1 text-gray-800">To</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 text-base bg-white"
            placeholder="Enter destination city or airport"
            value={searchForm.destination}
            onChangeText={handleDestinationChange}
            onFocus={() => setShowDestinationAirports(true)}
          />
          {showDestinationAirports && airports.length > 0 && (
            <View className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg z-50 max-h-48">
              {airports.slice(0, 5).map((airport) => (
                <TouchableOpacity
                  key={airport.entityId}
                  className="p-3 border-b border-gray-200"
                  onPress={() => selectAirport(airport, 'destination')}
                >
                  <Text className="text-base font-semibold text-gray-800">{airport.name}</Text>
                  <Text className="text-sm text-gray-600 mt-0.5">
                    {airport.cityName}, {airport.countryName}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View className="mb-4">
          <Text className="text-base font-semibold mb-1 text-gray-800">Date</Text>
          <CalendarPicker
            value={searchForm.date}
            onChange={(date: string) => setSearchForm({ ...searchForm, date })}
            placeholder="Select travel date"
          />
        </View>

        <View className="mb-4">
          <Text className="text-base font-semibold mb-1 text-gray-800">Passengers</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 text-base bg-white"
            placeholder="Number of adults"
            value={searchForm.adults}
            onChangeText={(text) => setSearchForm({ ...searchForm, adults: text })}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity 
          className={`p-4 rounded-lg items-center mt-2.5 ${flights.isLoading ? 'bg-gray-400' : 'bg-blue-600'}`}
          onPress={handleSearchFlights}
          disabled={flights.isLoading}
        >
          <Text className="text-white text-base font-semibold">
            {flights.isLoading ? "Searching..." : "Search Flights"}
          </Text>
        </TouchableOpacity>
      </View>

      {flights.isLoading && (
        <View className="bg-white p-5 rounded-xl mb-5 shadow-lg">
          <LoadingSpinner message="Searching for flights..." />
        </View>
      )}

      {flights.flights.length > 0 && !flights.isLoading && (
        <View className="bg-white p-5 rounded-xl mb-5 shadow-lg">
          <Text className="text-xl font-bold mb-2.5 text-gray-800">Search Results</Text>
          <Text className="text-gray-800 mb-2.5 text-base">Found {flights.flights.length} flights:</Text>
          
          {flights.flights.map((flight) => (
            <TouchableOpacity
              key={flight.id}
              className="bg-gray-50 p-4 rounded-lg mb-2.5 border border-gray-200"
              onPress={() => handleSelectFlight(flight)}
            >
              <View className="flex-row justify-between items-center mb-2.5">
                <Text className="text-base font-bold text-gray-800">{flight.airline}</Text>
                <Text className="text-lg font-bold text-blue-600">{flight.currency} {flight.price}</Text>
              </View>
              
              <View className="flex-row justify-between items-center mb-2.5">
                <View className="items-center flex-1">
                  <Text className="text-base font-semibold text-gray-800">{flight.departureTime}</Text>
                  <Text className="text-sm text-gray-600 mt-0.5">{flight.origin}</Text>
                </View>
                
                <View className="items-center flex-1">
                  <Text className="text-sm text-gray-600">{flight.duration}</Text>
                  <Text className="text-xs text-gray-500 mt-0.5">
                    {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                  </Text>
                </View>
                
                <View className="items-center flex-1">
                  <Text className="text-base font-semibold text-gray-800">{flight.arrivalTime}</Text>
                  <Text className="text-sm text-gray-600 mt-0.5">{flight.destination}</Text>
                </View>
              </View>
              
              <Text className="text-xs text-gray-600 text-center">Flight {flight.flightNumber}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {flights.error && (
        <View className="bg-white p-5 rounded-xl mb-5 shadow-lg">
          <Text className="text-red-600 mt-2.5 text-center text-base">Error: {flights.error}</Text>
          <TouchableOpacity 
            className="bg-red-600 p-3 rounded-lg items-center mt-2.5"
            onPress={() => dispatch(clearFlights())}
          >
            <Text className="text-white text-base font-semibold">Clear Error</Text>
          </TouchableOpacity>
        </View>
      )}

      <StatusBar style="auto" />
    </ScrollView>
  );
} 