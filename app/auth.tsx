import { StatusBar } from 'expo-status-bar';
import { Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../src/store';
import { useRouter } from 'expo-router';
import { registerUser, loginUser } from '../src/features/auth/authActions';
import { clearError } from '../src/features/auth/authSlice';
import LoadingSpinner from '../src/components/LoadingSpinner';

export default function Auth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const auth = useAppSelector((state) => state.auth);

  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (auth.isAuthenticated) {
      router.replace('/home');
    }
  }, [auth.isAuthenticated, router]);

  useEffect(() => {
    dispatch(clearError());
  }, [isSignUpMode, dispatch]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (isSignUpMode) {
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
      
      dispatch(registerUser(
        formData.username,
        formData.name,
        formData.password
      ));
    } else {
      dispatch(loginUser(formData.username, formData.password));
    }
  };

  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
    setFormData({
      username: '',
      name: '',
      password: '',
      confirmPassword: '',
    });
  };

  const isFormValid = () => {
    if (isSignUpMode) {
      return formData.username.trim() && 
             formData.name.trim() && 
             formData.password.trim() && 
             formData.confirmPassword.trim() &&
             formData.password === formData.confirmPassword;
    } else {
      return formData.username.trim() && formData.password.trim();
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className=" bg-blue-600 pt-15 pb-10 px-5 items-center">
        <Text className="mt-5 text-3xl font-bold text-white mb-2.5">Google Flights</Text>
        <Text className="text-base text-blue-100 text-center">
          {isSignUpMode ? 'Create your account' : 'Welcome back'}
        </Text>
      </View>

      <View className="p-5">
        <View className="mb-5">
          <Text className="text-base font-semibold mb-2 text-gray-800">Username</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-4 text-base bg-white"
            placeholder="Enter username"
            value={formData.username}
            onChangeText={(text) => handleInputChange('username', text)}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {isSignUpMode && (
          <View className="mb-5">
            <Text className="text-base font-semibold mb-2 text-gray-800">Full Name</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-4 text-base bg-white"
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              autoCapitalize="words"
            />
          </View>
        )}

        <View className="mb-5">
          <Text className="text-base font-semibold mb-2 text-gray-800">Password</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-4 text-base bg-white"
            placeholder="Enter password"
            value={formData.password}
            onChangeText={(text) => handleInputChange('password', text)}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        {isSignUpMode && (
          <View className="mb-5">
            <Text className="text-base font-semibold mb-2 text-gray-800">Confirm Password</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-4 text-base bg-white"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChangeText={(text) => handleInputChange('confirmPassword', text)}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>
        )}

        {auth.error && (
          <View className="bg-red-50 p-4 rounded-lg mb-5 border border-red-200">
            <Text className="text-red-800 text-sm text-center">{auth.error}</Text>
          </View>
        )}

        <TouchableOpacity
          className={`p-4 rounded-lg items-center mb-5 ${(!isFormValid() || auth.isLoading) ? 'bg-gray-400' : 'bg-blue-600'}`}
          onPress={handleSubmit}
          disabled={!isFormValid() || auth.isLoading}
        >
          {auth.isLoading ? (
            <LoadingSpinner message={isSignUpMode ? "Creating account..." : "Signing in..."} />
          ) : (
            <Text className="text-white text-base font-semibold">
              {isSignUpMode ? 'Create Account' : 'Sign In'}
            </Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center items-center mb-5">
          <Text className="text-gray-600 text-sm mr-1">
            {isSignUpMode ? 'Already have an account?' : "Don't have an account?"}
          </Text>
          <TouchableOpacity onPress={toggleMode}>
            <Text className="text-blue-600 text-sm font-semibold">
              {isSignUpMode ? 'Sign In' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>

      </View>

      <StatusBar style="auto" />
    </ScrollView>
  );
} 