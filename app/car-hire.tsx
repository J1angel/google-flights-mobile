import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { searchCarLocations, searchCars, CarLocation, CarRental } from '../src/services/carsApi';
import CalendarPicker from '../src/components/CalendarPicker';
import LoadingSpinner from '../src/components/LoadingSpinner';

export default function CarHire() {
  const [searchForm, setSearchForm] = useState({
    airport: '',
    pickupDate: '',
    returnDate: '',
    carType: 'economy',
  });

  const [carLocations, setCarLocations] = useState<CarLocation[]>([]);
  const [showLocations, setShowLocations] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [carRentals, setCarRentals] = useState<CarRental[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<CarLocation | null>(null);

  const carTypes = [
    { value: 'economy', label: 'Economy', icon: '🚗' },
    { value: 'compact', label: 'Compact', icon: '🚙' },
    { value: 'midsize', label: 'Midsize', icon: '🚘' },
    { value: 'fullsize', label: 'Full Size', icon: '🚙' },
    { value: 'suv', label: 'SUV', icon: '🚐' },
    { value: 'luxury', label: 'Luxury', icon: '🏎️' },
  ];

  const searchLocations = async (query: string) => {
    if (query.length < 2) return;
    
    try {
      const results = await searchCarLocations(query);
      setCarLocations(results);
    } catch (error) {
      console.error('Error searching car locations:', error);
    }
  };

  const handleAirportChange = (text: string) => {
    setSearchForm({ ...searchForm, airport: text });
    setShowLocations(true);
    searchLocations(text);
  };

  const selectLocation = (location: CarLocation) => {
    setSearchForm({ 
      ...searchForm, 
      airport: `${location.cityName} (${location.name})` 
    });
    setSelectedLocation(location);
    setShowLocations(false);
  };

  const handleSearchCars = async () => {
    if (!searchForm.airport || !searchForm.pickupDate || !searchForm.returnDate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!selectedLocation) {
      Alert.alert('Error', 'Please select a valid location from the suggestions');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Calculate return date (assuming 5 days rental for demo)
      const pickupDate = new Date(searchForm.pickupDate);
      const returnDate = new Date(pickupDate);
      returnDate.setDate(pickupDate.getDate() + 5);

      const carSearchParams = {
        pickUpEntityId: selectedLocation.entityId,
        pickUpDate: searchForm.pickupDate,
        pickUpTime: '10:00', // Default pickup time
        currency: 'USD',
        countryCode: 'US',
        market: 'en-US',
      };

      const results = await searchCars(carSearchParams);
      
      // Filter by car type if specified
      const filteredResults = searchForm.carType !== 'all' 
        ? results.filter(car => car.carType === searchForm.carType)
        : results;

      setCarRentals(filteredResults);
    } catch (error: any) {
      console.error('Error searching cars:', error);
      setError(error.message || 'Failed to search for cars');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCar = (car: CarRental) => {
    Alert.alert(
      'Car Selected', 
      `Selected ${car.company} - ${car.carModel}\nLocation: ${car.location}\nPrice: ${car.currency} ${car.price}/day\nPickup: ${car.pickupDate}\nReturn: ${car.returnDate}${car.rating ? `\nRating: ${car.rating}/5 (${car.reviews} reviews)` : ''}`
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderStarRating = (rating?: number) => {
    if (!rating) return null;
    
    const stars = '⭐'.repeat(Math.floor(rating));
    return (
      <Text style={styles.ratingText}>
        {stars} {rating.toFixed(1)}
      </Text>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Search Car Rentals</Text>
        <Text style={styles.subtitle}>Find the perfect car for your trip</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Airport</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter airport or city"
            value={searchForm.airport}
            onChangeText={handleAirportChange}
            onFocus={() => setShowLocations(true)}
          />
          {showLocations && carLocations.length > 0 && (
            <View style={styles.locationList}>
              {carLocations.slice(0, 5).map((location) => (
                <TouchableOpacity
                  key={location.entityId}
                  style={styles.locationItem}
                  onPress={() => selectLocation(location)}
                >
                  <Text style={styles.locationName}>{location.name}</Text>
                  <Text style={styles.locationDetails}>
                    {location.cityName}, {location.countryName}
                  </Text>
                  <Text style={styles.locationType}>{location.type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pickup Date</Text>
          <CalendarPicker
            value={searchForm.pickupDate}
            onChange={(date: string) => setSearchForm({ ...searchForm, pickupDate: date })}
            placeholder="Select pickup date"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Return Date</Text>
          <CalendarPicker
            value={searchForm.returnDate}
            onChange={(date: string) => setSearchForm({ ...searchForm, returnDate: date })}
            placeholder="Select return date"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Car Type</Text>
          <View style={styles.carTypeGrid}>
            {carTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.carTypeButton,
                  searchForm.carType === type.value && styles.selectedCarType
                ]}
                onPress={() => setSearchForm({ ...searchForm, carType: type.value })}
              >
                <Text style={styles.carTypeIcon}>{type.icon}</Text>
                <Text style={[
                  styles.carTypeLabel,
                  searchForm.carType === type.value && styles.selectedCarTypeText
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.searchButton, isLoading && styles.disabledButton]}
          onPress={handleSearchCars}
          disabled={isLoading}
        >
          <Text style={styles.searchButtonText}>
            {isLoading ? "Searching..." : "Search Cars"}
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={styles.section}>
          <LoadingSpinner message="Searching for car rentals..." />
        </View>
      )}

      {carRentals.length > 0 && !isLoading && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Cars</Text>
          <Text style={styles.text}>Found {carRentals.length} cars at {searchForm.airport}:</Text>
          
          {carRentals.map((car) => (
            <TouchableOpacity
              key={car.id}
              style={styles.carCard}
              onPress={() => handleSelectCar(car)}
            >
              <View style={styles.carHeader}>
                <View style={styles.carInfo}>
                  <Text style={styles.carCompany}>{car.company}</Text>
                  <Text style={styles.carModel}>{car.carModel}</Text>
                  {renderStarRating(car.rating)}
                </View>
                <Text style={styles.carPrice}>{car.currency} {car.price}/day</Text>
              </View>
              
              <View style={styles.carDetails}>
                <View style={styles.carDetail}>
                  <Text style={styles.detailLabel}>Location:</Text>
                  <Text style={styles.detailValue}>{car.location}</Text>
                </View>
                <View style={styles.carDetail}>
                  <Text style={styles.detailLabel}>Pickup:</Text>
                  <Text style={styles.detailValue}>{formatDate(car.pickupDate)}</Text>
                </View>
                <View style={styles.carDetail}>
                  <Text style={styles.detailLabel}>Return:</Text>
                  <Text style={styles.detailValue}>{formatDate(car.returnDate)}</Text>
                </View>
              </View>
              
              <View style={styles.featuresContainer}>
                {car.features.map((feature, index) => (
                  <View key={index} style={styles.featureTag}>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {error && (
        <View style={styles.section}>
          <Text style={styles.error}>Error: {error}</Text>
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
    marginBottom: 10,
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
  locationList: {
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
  locationItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  locationDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  locationType: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  carTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  carTypeButton: {
    width: '48%',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedCarType: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  carTypeIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  carTypeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  selectedCarTypeText: {
    color: '#fff',
  },
  searchButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  carCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  carHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  carInfo: {
    flex: 1,
  },
  carCompany: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  carModel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#ffc107',
    marginTop: 2,
  },
  carPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
  },
  carDetails: {
    marginBottom: 10,
  },
  carDetail: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    width: 60,
  },
  detailValue: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
    fontSize: 16,
  },
}); 