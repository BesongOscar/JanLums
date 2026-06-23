import { Stack } from 'expo-router';
import { colors } from '../../src/config/colors';

export default function OrdersLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="[id]" />
    </Stack>
  );
}