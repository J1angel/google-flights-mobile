import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { useAppDispatch, useAppSelector } from './src/store';
import { loginStart, loginSuccess, loginFailure, logout } from './src/features/auth/authSlice';
import { fetchFlights, selectFlight } from './src/features/flights/flightsSlice';

// Sample component that uses Redux
function ReduxDemo() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const flights = useAppSelector((state) => state.flights);

  const handleLogin = () => {
    dispatch(loginStart());
    // Simulate login
    setTimeout(() => {
      dispatch(loginSuccess({
        id: '1',
        email: 'user@example.com',
        name: 'John Doe'
      }));
    }, 1000);
  };

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
    <View style={styles.container}>
      <Text style={styles.title}>Redux Demo</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Authentication</Text>
        {auth.isAuthenticated ? (
          <View>
            <Text>Welcome, {auth.user?.name}!</Text>
            <Button title="Logout" onPress={handleLogout} />
          </View>
        ) : (
          <View>
            <Text>Not logged in</Text>
            <Button 
              title={auth.isLoading ? "Logging in..." : "Login"} 
              onPress={handleLogin}
              disabled={auth.isLoading}
            />
          </View>
        )}
        {auth.error && <Text style={styles.error}>Error: {auth.error}</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Flights</Text>
        <Button 
          title={flights.isLoading ? "Loading..." : "Fetch Flights"} 
          onPress={handleFetchFlights}
          disabled={flights.isLoading}
        />
        {flights.flights.length > 0 && (
          <View>
            <Text>Found {flights.flights.length} flights:</Text>
            {flights.flights.map((flight) => (
              <Text key={flight.id}>
                {flight.origin} → {flight.destination} - ${flight.price}
              </Text>
            ))}
            <Button title="Select First Flight" onPress={handleSelectFlight} />
          </View>
        )}
        {flights.error && <Text style={styles.error}>Error: {flights.error}</Text>}
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ReduxDemo />
    </Provider>
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
  error: {
    color: 'red',
    marginTop: 5,
  },
});
