import React from 'react';
import { View, Text } from 'react-native';

interface ApiStatusProps {
  isUsingFallback: boolean;
  apiKeyConfigured: boolean;
}

export default function ApiStatus({ isUsingFallback, apiKeyConfigured }: ApiStatusProps) {
  if (!apiKeyConfigured) {
    return (
      <View className="p-2.5 mx-5 mb-2.5 rounded-lg bg-yellow-50 border border-yellow-200">
        <Text className="text-xs text-center text-yellow-800">
          ⚠️ Demo Mode: Using sample data. Configure your API key for real flight data.
        </Text>
      </View>
    );
  }

  if (isUsingFallback) {
    return (
      <View className="p-2.5 mx-5 mb-2.5 rounded-lg bg-blue-50 border border-blue-200">
        <Text className="text-xs text-center text-blue-800">
          ℹ️ Using sample data due to API limits. Real data will be shown when available.
        </Text>
      </View>
    );
  }

  return null;
} 