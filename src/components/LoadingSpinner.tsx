import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
}

export default function LoadingSpinner({ 
  message = 'Loading...', 
  size = 'large', 
  color = '#007bff' 
}: LoadingSpinnerProps) {
  return (
    <View className="flex-1 justify-center items-center p-5">
      <ActivityIndicator size={size} color={color} />
      <Text className="mt-2.5 text-base text-gray-600 text-center">{message}</Text>
    </View>
  );
} 