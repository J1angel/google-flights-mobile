import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, ScrollView, TextInput, TouchableOpacity } from 'react-native';
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
      <Text style={styles.ratingText}>
        {stars} {rating.toFixed(1)}
      </Text>
    );
  };

  const renderHotelStars = (starRating?: number) => {
    if (!starRating) return null;
    const stars = '★'.repeat(starRating);
    return (
      <Text style={styles.hotelStars}>
        {stars}
      </Text>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Search Hotels</Text>
        <Text style={styles.subtitle}>Find the perfect place to stay</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Destination</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter city or hotel name"
            value={searchForm.destination}
            onChangeText={handleDestinationChange}
            onFocus={() => setShowDestinations(true)}
          />
          {showDestinations && destinations.length > 0 && (
            <View style={styles.destinationList}>
              {destinations.slice(0, 5).map((destination) => (
                <TouchableOpacity
                  key={destination.entityId}
                  style={styles.destinationItem}
                  onPress={() => selectDestination(destination)}
                >
                  <Text style={styles.destinationName}>{destination.name}</Text>
                  <Text style={styles.destinationDetails}>
                    {destination.cityName}, {destination.countryName}
                  </Text>
                  <Text style={styles.destinationType}>{destination.type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Check-in Date</Text>
          <CalendarPicker
            value={searchForm.checkinDate}
            onChange={(date: string) => setSearchForm({ ...searchForm, checkinDate: date })}
            placeholder="Select check-in date"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Check-out Date</Text>
          <CalendarPicker
            value={searchForm.checkoutDate}
            onChange={(date: string) => setSearchForm({ ...searchForm, checkoutDate: date })}
            placeholder="Select check-out date"
          />
        </View>

        <View style={styles.guestInfo}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Adults</Text>
            <TextInput
              style={styles.numberInput}
              placeholder="2"
              value={searchForm.adults}
              onChangeText={(text) => setSearchForm({ ...searchForm, adults: text })}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Children</Text>
            <TextInput
              style={styles.numberInput}
              placeholder="0"
              value={searchForm.children}
              onChangeText={(text) => setSearchForm({ ...searchForm, children: text })}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Rooms</Text>
            <TextInput
              style={styles.numberInput}
              placeholder="1"
              value={searchForm.rooms}
              onChangeText={(text) => setSearchForm({ ...searchForm, rooms: text })}
              keyboardType="numeric"
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.searchButton, isLoading && styles.disabledButton]}
          onPress={handleSearchHotels}
          disabled={isLoading}
        >
          <Text style={styles.searchButtonText}>
            {isLoading ? "Searching..." : "Search Hotels"}
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={styles.section}>
          <LoadingSpinner message="Searching for hotels..." />
        </View>
      )}

      {hotels.length > 0 && !isLoading && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Hotels</Text>
          <Text style={styles.text}>Found {hotels.length} hotels in {searchForm.destination}:</Text>
          
          {hotels.map((hotel) => (
            <TouchableOpacity
              key={hotel.id}
              style={styles.hotelCard}
              onPress={() => handleSelectHotel(hotel)}
            >
              <View style={styles.hotelHeader}>
                <View style={styles.hotelInfo}>
                  <Text style={styles.hotelName}>{hotel.name}</Text>
                  {renderHotelStars(hotel.starRating)}
                  <Text style={styles.hotelLocation}>{hotel.location}</Text>
                  {hotel.distanceFromCenter && (
                    <Text style={styles.distanceText}>{hotel.distanceFromCenter} from center</Text>
                  )}
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.hotelPrice}>{hotel.currency} {hotel.price}</Text>
                  <Text style={styles.pricePerNight}>per night</Text>
                </View>
              </View>
              
              <View style={styles.ratingContainer}>
                {renderStarRating(hotel.rating)}
                <Text style={styles.reviewsText}>({hotel.reviews} reviews)</Text>
              </View>
              
              <View style={styles.dateContainer}>
                <View style={styles.dateInfo}>
                  <Text style={styles.dateLabel}>Check-in:</Text>
                  <Text style={styles.dateValue}>{formatDate(hotel.checkinDate)}</Text>
                </View>
                <View style={styles.dateInfo}>
                  <Text style={styles.dateLabel}>Check-out:</Text>
                  <Text style={styles.dateValue}>{formatDate(hotel.checkoutDate)}</Text>
                </View>
              </View>
              
              <View style={styles.amenitiesContainer}>
                {hotel.amenities.slice(0, 4).map((amenity, index) => (
                  <View key={index} style={styles.amenityTag}>
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
                {hotel.amenities.length > 4 && (
                  <View style={styles.amenityTag}>
                    <Text style={styles.amenityText}>+{hotel.amenities.length - 4} more</Text>
                  </View>
                )}
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
  numberInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  destinationList: {
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
  destinationItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  destinationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  destinationDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  destinationType: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  guestInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchButton: {
    backgroundColor: '#ff6b35',
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
  hotelCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  hotelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  hotelInfo: {
    flex: 1,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  hotelStars: {
    fontSize: 14,
    color: '#ffc107',
    marginTop: 2,
  },
  hotelLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  distanceText: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  hotelPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  pricePerNight: {
    fontSize: 12,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 12,
    color: '#ffc107',
    marginRight: 5,
  },
  reviewsText: {
    fontSize: 12,
    color: '#666',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateInfo: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  dateValue: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  amenityText: {
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