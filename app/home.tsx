import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../src/store';
import { logout } from '../src/features/auth/authSlice';
import { fetchFlights, selectFlight, clearFlights } from '../src/features/flights/flightsSlice';
import { useState } from 'react';
import { getAirports } from '../src/services/flightsApi';
import CalendarPicker from '../src/components/CalendarPicker';
import LoadingSpinner from '../src/components/LoadingSpinner';
import ApiStatus from '../src/components/ApiStatus';
import { API_CONFIG } from '../src/config/api';

interface Airport {
  entityId: string;
  name: string;
  cityName: string;
  countryName: string;
}

export default function Home() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
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

  const handleLogout = () => {
    dispatch(logout());
  };

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome, {auth.user?.name}!</Text>
      
      <ApiStatus 
        isUsingFallback={isUsingFallback} 
        apiKeyConfigured={API_CONFIG.RAPIDAPI_KEY !== 'YOUR_RAPIDAPI_KEY'} 
      />
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Text style={styles.text}>Username: {auth.user?.username || 'Not set'}</Text>
        <Text style={styles.text}>User ID: {auth.user?.id || 'Not set'}</Text>
        <Button title="Logout" onPress={handleLogout} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Search Flights</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>From</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter origin city or airport"
            value={searchForm.origin}
            onChangeText={handleOriginChange}
            onFocus={() => setShowOriginAirports(true)}
          />
          {showOriginAirports && airports.length > 0 && (
            <View style={styles.airportList}>
              {airports.slice(0, 5).map((airport) => (
                <TouchableOpacity
                  key={airport.entityId}
                  style={styles.airportItem}
                  onPress={() => selectAirport(airport, 'origin')}
                >
                  <Text style={styles.airportName}>{airport.name}</Text>
                  <Text style={styles.airportLocation}>
                    {airport.cityName}, {airport.countryName}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>To</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter destination city or airport"
            value={searchForm.destination}
            onChangeText={handleDestinationChange}
            onFocus={() => setShowDestinationAirports(true)}
          />
          {showDestinationAirports && airports.length > 0 && (
            <View style={styles.airportList}>
              {airports.slice(0, 5).map((airport) => (
                <TouchableOpacity
                  key={airport.entityId}
                  style={styles.airportItem}
                  onPress={() => selectAirport(airport, 'destination')}
                >
                  <Text style={styles.airportName}>{airport.name}</Text>
                  <Text style={styles.airportLocation}>
                    {airport.cityName}, {airport.countryName}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date</Text>
          <CalendarPicker
            value={searchForm.date}
            onChange={(date: string) => setSearchForm({ ...searchForm, date })}
            placeholder="Select travel date"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Passengers</Text>
          <TextInput
            style={styles.input}
            placeholder="Number of adults"
            value={searchForm.adults}
            onChangeText={(text) => setSearchForm({ ...searchForm, adults: text })}
            keyboardType="numeric"
          />
        </View>

        <Button 
          title={flights.isLoading ? "Searching..." : "Search Flights"} 
          onPress={handleSearchFlights}
          disabled={flights.isLoading}
        />
      </View>

      {flights.isLoading && (
        <View style={styles.section}>
          <LoadingSpinner message="Searching for flights..." />
        </View>
      )}

      {flights.flights.length > 0 && !flights.isLoading && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Search Results</Text>
          <Text style={styles.text}>Found {flights.flights.length} flights:</Text>
          
          {flights.flights.map((flight) => (
            <TouchableOpacity
              key={flight.id}
              style={styles.flightCard}
              onPress={() => handleSelectFlight(flight)}
            >
              <View style={styles.flightHeader}>
                <Text style={styles.airline}>{flight.airline}</Text>
                <Text style={styles.price}>{flight.currency} {flight.price}</Text>
              </View>
              
              <View style={styles.flightDetails}>
                <View style={styles.timeInfo}>
                  <Text style={styles.time}>{flight.departureTime}</Text>
                  <Text style={styles.airport}>{flight.origin}</Text>
                </View>
                
                <View style={styles.durationInfo}>
                  <Text style={styles.duration}>{flight.duration}</Text>
                  <Text style={styles.stops}>
                    {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                  </Text>
                </View>
                
                <View style={styles.timeInfo}>
                  <Text style={styles.time}>{flight.arrivalTime}</Text>
                  <Text style={styles.airport}>{flight.destination}</Text>
                </View>
              </View>
              
              <Text style={styles.flightNumber}>Flight {flight.flightNumber}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {flights.error && (
        <View style={styles.section}>
          <Text style={styles.error}>Error: {flights.error}</Text>
          <Button title="Clear Error" onPress={() => dispatch(clearFlights())} />
        </View>
      )}

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  text: {
    color: '#333',
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 15,
    position: 'relative',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  airportList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    zIndex: 1000,
    maxHeight: 200,
  },
  airportItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  airportName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  airportLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  flightCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  flightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  airline: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  flightDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeInfo: {
    alignItems: 'center',
    flex: 1,
  },
  time: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  airport: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  durationInfo: {
    alignItems: 'center',
    flex: 1,
  },
  duration: {
    fontSize: 14,
    color: '#666',
  },
  stops: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  flightNumber: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
}); 