import { Stack } from 'expo-router';
import { colors } from '../../../src/config/colors';

export default function AccountLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text.primary,
        headerTitleStyle: { fontWeight: '600' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Account',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: 'Edit Profile',
        }}
      />
      <Stack.Screen
        name="addresses"
        options={{
          title: 'Saved Addresses',
        }}
      />
      <Stack.Screen
        name="loyalty"
        options={{
          title: 'Loyalty & Rewards',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="sync-queue"
        options={{
          title: 'Pending Sync',
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
    </Stack>
  );
}
