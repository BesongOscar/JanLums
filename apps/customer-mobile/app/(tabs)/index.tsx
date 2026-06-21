import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';
import { colors } from '../../src/config/colors';

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.greeting}>
          Hello, {user?.firstName || 'there'}!
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          What would you like to do today?
        </Text>
      </View>

      <Card style={styles.card} onPress={() => router.push('/(tabs)/new-order')}>
        <Card.Content>
          <Text variant="titleMedium">New Order</Text>
          <Text variant="bodyMedium" style={styles.cardDescription}>
            Schedule a new laundry pickup
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card} onPress={() => router.push('/(tabs)/orders')}>
        <Card.Content>
          <Text variant="titleMedium">My Orders</Text>
          <Text variant="bodyMedium" style={styles.cardDescription}>
            View your active and past orders
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card} onPress={() => router.push('/(tabs)/notifications')}>
        <Card.Content>
          <Text variant="titleMedium">Notifications</Text>
          <Text variant="bodyMedium" style={styles.cardDescription}>
            Check your latest updates
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
    paddingTop: 60,
  },
  greeting: {
    color: colors.text.primary,
  },
  subtitle: {
    color: colors.text.secondary,
    marginTop: 4,
  },
  card: {
    marginBottom: 12,
    backgroundColor: colors.surface,
  },
  cardDescription: {
    color: colors.text.secondary,
    marginTop: 4,
  },
});
