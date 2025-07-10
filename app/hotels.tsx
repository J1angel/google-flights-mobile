import { StatusBar } from 'expo-status-bar';
import { Text, View, Alert, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { searchHotelDestinations, searchHotels, HotelDestination, Hotel } from '../src/services/hotelsApi';
import CalendarPicker from '../src/components/CalendarPicker';
import LoadingSpinner from '../src/components/LoadingSpinner';

export default function Hotels() {
  const [searchForm, setSearchForm] = useState({
    destination: '',
    checkinDate: '',
    checkoutDate: '',
    adults: '2',
    children: '0',
    rooms: '1',
  });

  const [destinations, setDestinations] = useState<HotelDestination[]>([]);
  const [showDestinations, setShowDestinations] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<HotelDestination | null>(null);

  const searchLocations = async (query: string) => {
    if (query.length < 2) return;
    
    try {
      const results = await searchHotelDestinations(query);
      setDestinations(results);
    } catch (error) {
      console.error('Error searching hotel destinations:', error);
    }
  };

  const handleDestinationChange = (text: string) => {
    setSearchForm({ ...searchForm, destination: text });
    setShowDestinations(true);
    searchLocations(text);
  };

  const selectDestination = (destination: HotelDestination) => {
    setSearchForm({ 
      ...searchForm, 
      destination: `${destination.cityName} (${destination.name})` 
    });
    setSelectedDestination(destination);
    setShowDestinations(false);
  };

  const handleSearchHotels = async () => {
    if (!searchForm.destination || !searchForm.checkinDate || !searchForm.checkoutDate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!selectedDestination) {
      Alert.alert('Error', 'Please select a valid destination from the suggestions');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const hotelSearchParams = {
        entityId: selectedDestination.entityId,
        checkinDate: searchForm.checkinDate,
        checkoutDate: searchForm.checkoutDate,
        adults: parseInt(searchForm.adults),
        children: parseInt(searchForm.children),
        rooms: parseInt(searchForm.rooms),
        currency: 'USD',
        countryCode: 'US',
        market: 'en-US',
      };

      const results = await searchHotels(hotelSearchParams);
      setHotels(results);
    } catch (error: any) {
      console.error('Error searching hotels:', error);
      setError(error.message || 'Failed to search for hotels');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHotel = (hotel: Hotel) => {
    Alert.alert(
      'Hotel Selected', 
      `Selected ${hotel.name}\nLocation: ${hotel.location}\nPrice: ${hotel.currency} ${hotel.price}/night\nRating: ${hotel.rating}/5 (${hotel.reviews} reviews)\nCheck-in: ${hotel.checkinDate}\nCheck-out: ${hotel.checkoutDate}`
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

  const renderStarRating = (rating: number) => {
    const stars = '⭐'.repeat(Math.floor(rating));
    return (
      <Text className="text-xs text-yellow-500 mr-1">
        {stars} {rating.toFixed(1)}
      </Text>
    );
  };

  const renderHotelStars = (starRating?: number) => {
    if (!starRating) return null;
    const stars = '★'.repeat(starRating);
    return (
      <Text className="text-sm text-yellow-500 mt-0.5">
        {stars}
      </Text>
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-5">
      <View className="bg-white p-5 rounded-xl mb-5 shadow-lg">
        <Text className="text-xl font-bold mb-2.5 text-gray-800">Search Hotels</Text>
        <Text className="text-base text-gray-600 mb-5 text-center">Find the perfect place to stay</Text>
        
        <View className="mb-4 relative">
          <Text className="text-base font-semibold mb-1 text-gray-800">Destination</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 text-base bg-white"
            placeholder="Enter city or hotel name"
            value={searchForm.destination}
            onChangeText={handleDestinationChange}
            onFocus={() => setShowDestinations(true)}
          />
          {showDestinations && destinations.length > 0 && (
            <View className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg z-50 max-h-48">
              {destinations.slice(0, 5).map((destination) => (
                <TouchableOpacity
                  key={destination.entityId}
                  className="p-3 border-b border-gray-200"
                  onPress={() => selectDestination(destination)}
                >
                  <Text className="text-base font-semibold text-gray-800">{destination.name}</Text>
                  <Text className="text-sm text-gray-600 mt-0.5">
                    {destination.cityName}, {destination.countryName}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-0.5 capitalize">{destination.type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View className="mb-4">
          <Text className="text-base font-semibold mb-1 text-gray-800">Check-in Date</Text>
          <CalendarPicker
            value={searchForm.checkinDate}
            onChange={(date: string) => setSearchForm({ ...searchForm, checkinDate: date })}
            placeholder="Select check-in date"
          />
        </View>

        <View className="mb-4">
          <Text className="text-base font-semibold mb-1 text-gray-800">Check-out Date</Text>
          <CalendarPicker
            value={searchForm.checkoutDate}
            onChange={(date: string) => setSearchForm({ ...searchForm, checkoutDate: date })}
            placeholder="Select check-out date"
          />
        </View>

        <View className="flex-row justify-between">
          <View className="mb-4 flex-1 mr-2">
            <Text className="text-base font-semibold mb-1 text-gray-800">Adults</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-base bg-white text-center"
              placeholder="2"
              value={searchForm.adults}
              onChangeText={(text) => setSearchForm({ ...searchForm, adults: text })}
              keyboardType="numeric"
            />
          </View>

          <View className="mb-4 flex-1 mx-1">
            <Text className="text-base font-semibold mb-1 text-gray-800">Children</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-base bg-white text-center"
              placeholder="0"
              value={searchForm.children}
              onChangeText={(text) => setSearchForm({ ...searchForm, children: text })}
              keyboardType="numeric"
            />
          </View>

          <View className="mb-4 flex-1 ml-2">
            <Text className="text-base font-semibold mb-1 text-gray-800">Rooms</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-base bg-white text-center"
              placeholder="1"
              value={searchForm.rooms}
              onChangeText={(text) => setSearchForm({ ...searchForm, rooms: text })}
              keyboardType="numeric"
            />
          </View>
        </View>

        <TouchableOpacity 
          className={`p-4 rounded-lg items-center mt-2.5 ${isLoading ? 'bg-gray-400' : 'bg-orange-500'}`}
          onPress={handleSearchHotels}
          disabled={isLoading}
        >
          <Text className="text-white text-base font-semibold">
            {isLoading ? "Searching..." : "Search Hotels"}
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View className="bg-white p-5 rounded-xl mb-5 shadow-lg">
          <LoadingSpinner message="Searching for hotels..." />
        </View>
      )}

      {hotels.length > 0 && !isLoading && (
        <View className="bg-white p-5 rounded-xl mb-5 shadow-lg">
          <Text className="text-xl font-bold mb-2.5 text-gray-800">Available Hotels</Text>
          <Text className="text-gray-800 mb-2.5 text-base">Found {hotels.length} hotels in {searchForm.destination}:</Text>
          
          {hotels.map((hotel) => (
            <TouchableOpacity
              key={hotel.id}
              className="bg-gray-50 p-4 rounded-lg mb-2.5 border border-gray-200"
              onPress={() => handleSelectHotel(hotel)}
            >
              <View className="flex-row justify-between items-start mb-2.5">
                <View className="flex-1">
                  <Text className="text-base font-bold text-gray-800">{hotel.name}</Text>
                  {renderHotelStars(hotel.starRating)}
                  <Text className="text-sm text-gray-600 mt-0.5">{hotel.location}</Text>
                  {hotel.distanceFromCenter && (
                    <Text className="text-xs text-gray-500 mt-0.5">{hotel.distanceFromCenter} from center</Text>
                  )}
                </View>
                <View className="items-end">
                  <Text className="text-lg font-bold text-orange-500">{hotel.currency} {hotel.price}</Text>
                  <Text className="text-xs text-gray-600">per night</Text>
                </View>
              </View>
              
              <View className="flex-row items-center mb-2.5">
                {renderStarRating(hotel.rating)}
                <Text className="text-xs text-gray-600">({hotel.reviews} reviews)</Text>
              </View>
              
              <View className="flex-row justify-between mb-2.5">
                <View className="flex-1">
                  <Text className="text-xs font-semibold text-gray-800">Check-in:</Text>
                  <Text className="text-xs text-gray-600 mt-0.5">{formatDate(hotel.checkinDate)}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-semibold text-gray-800">Check-out:</Text>
                  <Text className="text-xs text-gray-600 mt-0.5">{formatDate(hotel.checkoutDate)}</Text>
                </View>
              </View>
              
              <View className="flex-row flex-wrap">
                {hotel.amenities.slice(0, 4).map((amenity, index) => (
                  <View key={index} className="bg-blue-50 px-2 py-1 rounded-xl mr-2 mb-1">
                    <Text className="text-xs text-blue-800 font-medium">{amenity}</Text>
                  </View>
                ))}
                {hotel.amenities.length > 4 && (
                  <View className="bg-blue-50 px-2 py-1 rounded-xl mr-2 mb-1">
                    <Text className="text-xs text-blue-800 font-medium">+{hotel.amenities.length - 4} more</Text>
                  </View>
                )}
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