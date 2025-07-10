import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert, TextInput, ScrollView } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { useAppDispatch, useAppSelector } from './src/store';
import { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  signUpStart, 
  signUpSuccess, 
  signUpFailure,
  setSignUpMode 
} from './src/features/auth/authSlice';
import { fetchFlights, selectFlight } from './src/features/flights/flightsSlice';
import { useState } from 'react';

function ReduxDemo() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const flights = useAppSelector((state) => state.flights);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSignUp = () => {
    if (!formData.name || !formData.email || !formData.password) {
      dispatch(signUpFailure('Please fill in all fields'));
      return;
    }

    if (formData.password.length < 6) {
      dispatch(signUpFailure('Password must be at least 6 characters'));
      return;
    }

    dispatch(signUpStart());
    setTimeout(() => {
      dispatch(signUpSuccess({
        id: '1',
        email: formData.email,
        name: formData.name
      }));
      setFormData({ name: '', email: '', password: '' });
    }, 1000);
  };

  const handleLogin = () => {
    if (!formData.email || !formData.password) {
      dispatch(loginFailure('Please fill in email and password'));
      return;
    }

    dispatch(loginStart());
    setTimeout(() => {
      dispatch(loginSuccess({
        id: '1',
        email: formData.email,
        name: 'John Doe'
      }));
      setFormData({ name: '', email: '', password: '' });
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

  const toggleMode = () => {
    dispatch(setSignUpMode(!auth.isSignUpMode));
    setFormData({ name: '', email: '', password: '' });
  };

  if (!auth.isAuthenticated) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>
          {auth.isSignUpMode ? 'Create Account' : 'Welcome Back'}
        </Text>
        
        <View style={styles.authContainer}>
          {auth.isSignUpMode && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              secureTextEntry
            />
          </View>

          <Button 
            title={auth.isLoading 
              ? (auth.isSignUpMode ? "Creating Account..." : "Signing In...") 
              : (auth.isSignUpMode ? "Sign Up" : "Sign In")
            } 
            onPress={auth.isSignUpMode ? handleSignUp : handleLogin}
            disabled={auth.isLoading}
          />

          {auth.error && <Text style={styles.error}>Error: {auth.error}</Text>}

          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>
              {auth.isSignUpMode ? "Already have an account?" : "Don't have an account?"}
            </Text>
            <Button 
              title={auth.isSignUpMode ? "Sign In" : "Sign Up"} 
              onPress={toggleMode}
            />
          </View>
        </View>

        <StatusBar style="auto" />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome, {auth.user?.name}!</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Text style={styles.text}>Email: {auth.user?.email}</Text>
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
  authContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 15,
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
  toggleContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
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
