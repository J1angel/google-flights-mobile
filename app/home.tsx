import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
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
    <ScrollView className="flex-1 bg-gray-100 p-5 pt-15">
    
      <ApiStatus 
        isUsingFallback={false} 
        apiKeyConfigured={API_CONFIG.RAPIDAPI_KEY !== 'YOUR_RAPIDAPI_KEY'} 
      />
      
      <View className="mt-5 bg-white p-5 rounded-xl mb-5 shadow-lg">
        <Text className="text-xl font-bold mb-4 text-gray-800">Account</Text>
        <Text className="text-gray-800 mb-2.5 text-base">Username: {auth.user?.username || 'Not set'}</Text>
        <Text className="text-gray-800 mb-2.5 text-base">User ID: {auth.user?.id || 'Not set'}</Text>
        <TouchableOpacity className="bg-red-600 p-3 rounded-lg items-center mt-2.5" onPress={handleLogout}>
          <Text className="text-white text-base font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white p-5 rounded-xl mb-5 shadow-lg">
        <Text className="text-xl font-bold mb-4 text-gray-800">Choose Your Service</Text>
        <Text className="text-base text-gray-600 mb-5 text-center">What would you like to book today?</Text>
        
        <TouchableOpacity className="flex-row items-center bg-gray-50 p-5 rounded-xl mb-4 border border-gray-200" onPress={navigateToFlights}>
          <View className="w-12 h-12 rounded-full bg-white justify-center items-center mr-4 shadow-sm">
            <Text className="text-2xl">✈️</Text>
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-800 mb-1">Search Flights</Text>
            <Text className="text-sm text-gray-600 leading-5">
              Find the best flight deals with real-time pricing and availability
            </Text>
          </View>
          <Text className="text-2xl text-blue-600 font-bold">›</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center bg-gray-50 p-5 rounded-xl mb-4 border border-gray-200" onPress={navigateToCarHire}>
          <View className="w-12 h-12 rounded-full bg-white justify-center items-center mr-4 shadow-sm">
            <Text className="text-2xl">🚗</Text>
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-800 mb-1">Car Hire</Text>
            <Text className="text-sm text-gray-600 leading-5">
              Rent a car for your trip with competitive rates and flexible options
            </Text>
          </View>
          <Text className="text-2xl text-blue-600 font-bold">›</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center bg-gray-50 p-5 rounded-xl mb-4 border border-gray-200" onPress={navigateToHotels}>
          <View className="w-12 h-12 rounded-full bg-white justify-center items-center mr-4 shadow-sm">
            <Text className="text-2xl">🏨</Text>
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-800 mb-1">Hotels</Text>
            <Text className="text-sm text-gray-600 leading-5">
              Book comfortable accommodations with great rates and amenities
            </Text>
          </View>
          <Text className="text-2xl text-blue-600 font-bold">›</Text>
        </TouchableOpacity>

      </View>


      <StatusBar style="auto" />
    </ScrollView>
  );
} 