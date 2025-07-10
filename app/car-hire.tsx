import { StatusBar } from 'expo-status-bar';
import { Text, View, Alert, ScrollView, TextInput, TouchableOpacity } from 'react-native';
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
      <Text className="text-xs text-yellow-500 mt-0.5">
        {stars} {rating.toFixed(1)}
      </Text>
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-5">
      <View className="bg-white p-5 rounded-xl mb-5 shadow-lg">
        <Text className="text-xl font-bold mb-2.5 text-gray-800">Search Car Rentals</Text>
        <Text className="text-base text-gray-600 mb-5 text-center">Find the perfect car for your trip</Text>
        
        <View className="mb-4 relative">
          <Text className="text-base font-semibold mb-1 text-gray-800">Airport</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 text-base bg-white"
            placeholder="Enter airport or city"
            value={searchForm.airport}
            onChangeText={handleAirportChange}
            onFocus={() => setShowLocations(true)}
          />
          {showLocations && carLocations.length > 0 && (
            <View className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg z-50 max-h-48">
              {carLocations.slice(0, 5).map((location) => (
                <TouchableOpacity
                  key={location.entityId}
                  className="p-3 border-b border-gray-200"
                  onPress={() => selectLocation(location)}
                >
                  <Text className="text-base font-semibold text-gray-800">{location.name}</Text>
                  <Text className="text-sm text-gray-600 mt-0.5">
                    {location.cityName}, {location.countryName}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-0.5 capitalize">{location.type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View className="mb-4">
          <Text className="text-base font-semibold mb-1 text-gray-800">Pickup Date</Text>
          <CalendarPicker
            value={searchForm.pickupDate}
            onChange={(date: string) => setSearchForm({ ...searchForm, pickupDate: date })}
            placeholder="Select pickup date"
          />
        </View>

        <View className="mb-4">
          <Text className="text-base font-semibold mb-1 text-gray-800">Return Date</Text>
          <CalendarPicker
            value={searchForm.returnDate}
            onChange={(date: string) => setSearchForm({ ...searchForm, returnDate: date })}
            placeholder="Select return date"
          />
        </View>

        <View className="mb-4">
          <Text className="text-base font-semibold mb-1 text-gray-800">Car Type</Text>
          <View className="flex-row flex-wrap justify-between">
            {carTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                className={`w-5/12 p-4 rounded-lg border items-center mb-2.5 ${
                  searchForm.carType === type.value 
                    ? 'bg-green-600 border-green-600' 
                    : 'bg-white border-gray-300'
                }`}
                onPress={() => setSearchForm({ ...searchForm, carType: type.value })}
              >
                <Text className="text-2xl mb-1">{type.icon}</Text>
                <Text className={`text-sm font-semibold ${
                  searchForm.carType === type.value ? 'text-white' : 'text-gray-800'
                }`}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          className={`p-4 rounded-lg items-center mt-2.5 ${isLoading ? 'bg-gray-400' : 'bg-green-600'}`}
          onPress={handleSearchCars}
          disabled={isLoading}
        >
          <Text className="text-white text-base font-semibold">
            {isLoading ? "Searching..." : "Search Cars"}
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View className="bg-white p-5 rounded-xl mb-5 shadow-lg">
          <LoadingSpinner message="Searching for car rentals..." />
        </View>
      )}

      {carRentals.length > 0 && !isLoading && (
        <View className="bg-white p-5 rounded-xl mb-5 shadow-lg">
          <Text className="text-xl font-bold mb-2.5 text-gray-800">Available Cars</Text>
          <Text className="text-gray-800 mb-2.5 text-base">Found {carRentals.length} cars at {searchForm.airport}:</Text>
          
          {carRentals.map((car) => (
            <TouchableOpacity
              key={car.id}
              className="bg-gray-50 p-4 rounded-lg mb-2.5 border border-gray-200"
              onPress={() => handleSelectCar(car)}
            >
              <View className="flex-row justify-between items-start mb-2.5">
                <View className="flex-1">
                  <Text className="text-base font-bold text-gray-800">{car.company}</Text>
                  <Text className="text-sm text-gray-600 mt-0.5">{car.carModel}</Text>
                  {renderStarRating(car.rating)}
                </View>
                <Text className="text-lg font-bold text-green-600">{car.currency} {car.price}/day</Text>
              </View>
              
              <View className="mb-2.5">
                <View className="flex-row mb-1">
                  <Text className="text-sm font-semibold text-gray-800 w-15">Location:</Text>
                  <Text className="text-sm text-gray-600 flex-1">{car.location}</Text>
                </View>
                <View className="flex-row mb-1">
                  <Text className="text-sm font-semibold text-gray-800 w-15">Pickup:</Text>
                  <Text className="text-sm text-gray-600 flex-1">{formatDate(car.pickupDate)}</Text>
                </View>
                <View className="flex-row mb-1">
                  <Text className="text-sm font-semibold text-gray-800 w-15">Return:</Text>
                  <Text className="text-sm text-gray-600 flex-1">{formatDate(car.returnDate)}</Text>
                </View>
              </View>
              
              <View className="flex-row flex-wrap">
                {car.features.map((feature, index) => (
                  <View key={index} className="bg-blue-50 px-2 py-1 rounded-xl mr-2 mb-1">
                    <Text className="text-xs text-blue-800 font-medium">{feature}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {error && (
        <View className="bg-white p-5 rounded-xl mb-5 shadow-lg">
          <Text className="text-red-600 mt-2.5 text-center text-base">Error: {error}</Text>
        </View>
      )}

      <StatusBar style="auto" />
    </ScrollView>
  );
} 