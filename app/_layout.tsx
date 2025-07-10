import { Provider } from 'react-redux';
import { store } from '../src/store';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
} 