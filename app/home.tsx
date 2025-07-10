import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert, ScrollView } from 'react-native';
import { useAppDispatch, useAppSelector } from '../src/store';
import { logout } from '../src/features/auth/authSlice';
import { fetchFlights, selectFlight } from '../src/features/flights/flightsSlice';

export default function Home() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const flights = useAppSelector((state) => state.flights);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleFetchFlights = () => {
    dispatch(fetchFlights({
      origin: 'NYC',
      destination: 'LAX',
      date: '2024-01-15'
    }));
  };

  const handleSelectFlight = () => {
    if (flights.flights.length > 0) {
      dispatch(selectFlight(flights.flights[0]));
      Alert.alert('Flight Selected', `Selected flight from ${flights.flights[0].origin} to ${flights.flights[0].destination}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome, {auth.user?.name}!</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Text style={styles.text}>Username: {auth.user?.username || 'Not set'}</Text>
        <Text style={styles.text}>User ID: {auth.user?.id || 'Not set'}</Text>
        <Button title="Logout" onPress={handleLogout} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Flights</Text>
        <Button 
          title={flights.isLoading ? "Loading..." : "Fetch Flights"} 
          onPress={handleFetchFlights}
          disabled={flights.isLoading}
        />
        {flights.flights.length > 0 && (
          <View style={styles.flightsContainer}>
            <Text style={styles.text}>Found {flights.flights.length} flights:</Text>
            {flights.flights.map((flight) => (
              <Text key={flight.id} style={styles.flightText}>
                {flight.origin} → {flight.destination} - ${flight.price}
              </Text>
            ))}
            <Button title="Select First Flight" onPress={handleSelectFlight} />
          </View>
        )}
        {flights.error && <Text style={styles.error}>Error: {flights.error}</Text>}
      </View>

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
  flightsContainer: {
    marginTop: 15,
  },
  flightText: {
    color: '#666',
    marginBottom: 5,
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
}); 