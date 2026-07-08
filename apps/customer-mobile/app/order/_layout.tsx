import { Stack } from 'expo-router';
import { colors } from '../../src/config/colors';

export default function OrderFlowLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="services" />
      <Stack.Screen name="service/[id]" />
      <Stack.Screen name="branch" />
      <Stack.Screen name="garments" />
      <Stack.Screen name="address" />
      <Stack.Screen name="address-form" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="review" />
      <Stack.Screen name="success" />
    </Stack>
  );
}