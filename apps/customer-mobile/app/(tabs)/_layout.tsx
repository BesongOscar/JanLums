import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUnreadNotificationCount } from '../../src/hooks/useNotifications';
import { colors } from '../../src/config/colors';

/**
 * NotificationTabIcon
 *
 * Isolated component that owns the `useUnreadNotificationCount` hook.
 * Keeping the hook here (rather than in TabsLayout) ensures it only
 * executes after the QueryClientProvider tree is fully mounted.
 * If the query hasn't resolved yet, the badge simply doesn't render.
 */
function NotificationTabIcon({ color, size }: { color: string; size: number }) {
  const { data: unreadData } = useUnreadNotificationCount();
  const unreadCount = unreadData?.count ?? 0;

  return (
    <View
      style={{
        width: size + 4,
        height: size + 4,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <MaterialCommunityIcons
        name={unreadCount > 0 ? 'bell' : 'bell-outline'}
        size={size}
        color={color}
      />
      {unreadCount > 0 && (
        <View
          style={{
            position: 'absolute',
            top: -4,
            right: -6,
            backgroundColor: colors.error.DEFAULT,
            borderRadius: 8,
            minWidth: 16,
            height: 16,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 4,
          }}
        >
          <Text
            style={{ color: colors.white, fontSize: 10, fontWeight: '700' }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </View>
  );
}

/**
 * TabsLayout
 *
 * Root tab navigator. Intentionally contains no hooks of its own —
 * tab layouts are instantiated early in the Expo Router render cycle,
 * sometimes before context providers (QueryClient, etc.) have finished
 * mounting. Any hook that depends on a provider must live in a child
 * component (see NotificationTabIcon above).
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="clipboard-list"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="track"
        options={{
          title: 'Track',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="map-marker-path"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color, size }) => (
            <NotificationTabIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}