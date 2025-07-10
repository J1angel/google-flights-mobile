import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useAppDispatch, useAppSelector } from '../src/store';
import { logout } from '../src/features/auth/authSlice';
import { useRouter } from 'expo-router';
import ApiStatus from '../src/components/ApiStatus';
import { API_CONFIG } from '../src/config/api';

export default function Home() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const auth = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const navigateToFlights = () => {
    router.push('/flights');
  };

  const navigateToCarHire = () => {
    router.push('/car-hire');
  };

  const navigateToHotels = () => {
    router.push('/hotels');
  };
  return (
    <ScrollView style={styles.container}>
    
      <ApiStatus 
        isUsingFallback={false} 
        apiKeyConfigured={API_CONFIG.RAPIDAPI_KEY !== 'YOUR_RAPIDAPI_KEY'} 
      />
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Text style={styles.text}>Username: {auth.user?.username || 'Not set'}</Text>
        <Text style={styles.text}>User ID: {auth.user?.id || 'Not set'}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose Your Service</Text>
        <Text style={styles.subtitle}>What would you like to book today?</Text>
        
        <TouchableOpacity style={styles.serviceCard} onPress={navigateToFlights}>
          <View style={styles.serviceIcon}>
            <Text style={styles.iconText}>✈️</Text>
          </View>
          <View style={styles.serviceContent}>
            <Text style={styles.serviceTitle}>Search Flights</Text>
            <Text style={styles.serviceDescription}>
              Find the best flight deals with real-time pricing and availability
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.serviceCard} onPress={navigateToCarHire}>
          <View style={styles.serviceIcon}>
            <Text style={styles.iconText}>🚗</Text>
          </View>
          <View style={styles.serviceContent}>
            <Text style={styles.serviceTitle}>Car Hire</Text>
            <Text style={styles.serviceDescription}>
              Rent a car for your trip with competitive rates and flexible options
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.serviceCard} onPress={navigateToHotels}>
          <View style={styles.serviceIcon}>
            <Text style={styles.iconText}>🏨</Text>
          </View>
          <View style={styles.serviceContent}>
            <Text style={styles.serviceTitle}>Hotels</Text>
            <Text style={styles.serviceDescription}>
              Book comfortable accommodations with great rates and amenities
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

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
    padding: 20,
    borderRadius: 12,
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    color: '#333',
    marginBottom: 10,
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  serviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconText: {
    fontSize: 24,
  },
  serviceContent: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  arrow: {
    fontSize: 24,
    color: '#007bff',
    fontWeight: 'bold',
  },
  tipCard: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 5,
  },
  tipText: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
  },
}); 