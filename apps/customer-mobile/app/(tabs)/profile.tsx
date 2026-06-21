import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';
import { colors } from '../../src/config/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.name}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text variant="bodyLarge" style={styles.email}>
          {user?.email}
        </Text>
      </View>

      <View style={styles.content}>
        <Button mode="outlined" onPress={handleLogout} style={styles.logoutButton}>
          Log Out
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    paddingTop: 60,
    backgroundColor: colors.surface,
  },
  name: {
    color: colors.text.primary,
  },
  email: {
    color: colors.text.secondary,
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  logoutButton: {
    marginTop: 16,
  },
});
