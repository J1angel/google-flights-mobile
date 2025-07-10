import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ApiStatusProps {
  isUsingFallback: boolean;
  apiKeyConfigured: boolean;
}

export default function ApiStatus({ isUsingFallback, apiKeyConfigured }: ApiStatusProps) {
  if (!apiKeyConfigured) {
    return (
      <View style={[styles.container, styles.warning]}>
        <Text style={styles.text}>
          ⚠️ Demo Mode: Using sample data. Configure your API key for real flight data.
        </Text>
      </View>
    );
  }

  if (isUsingFallback) {
    return (
      <View style={[styles.container, styles.info]}>
        <Text style={styles.text}>
          ℹ️ Using sample data due to API limits. Real data will be shown when available.
        </Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 8,
  },
  warning: {
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  info: {
    backgroundColor: '#d1ecf1',
    borderWidth: 1,
    borderColor: '#bee5eb',
  },
  text: {
    fontSize: 12,
    textAlign: 'center',
    color: '#856404',
  },
}); 