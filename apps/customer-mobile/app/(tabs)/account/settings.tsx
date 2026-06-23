import { useEffect } from 'react';
import { ScrollView, Alert, StyleSheet } from 'react-native';
import { List, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../../src/stores/authStore';
import { useAnalytics } from '../../../src/hooks/useAnalytics';
import { colors } from '../../../src/config/colors';
import { spacing } from '../../../src/config/spacing';
import { typography } from '../../../src/config/typography';

export default function SettingsScreen() {
  const router = useRouter();
  const analytics = useAnalytics();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    analytics.track({ name: 'settings_viewed' });
  }, [analytics]);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <List.Section>
        <List.Subheader style={styles.subheader} accessibilityRole="header">General</List.Subheader>
        <List.Item
          title="Profile"
          description="View and edit your personal information"
          left={(props) => <List.Icon {...props} icon="account" color={colors.primary[500]} />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => router.push('./edit')}
          titleStyle={styles.listTitle}
          descriptionStyle={styles.listDescription}
          accessibilityLabel="View and edit your profile"
        />
        <Divider style={styles.divider} />
        <List.Item
          title="About App"
          description="JanLums version 1.0.0"
          left={(props) => <List.Icon {...props} icon="information" color={colors.primary[500]} />}
          titleStyle={styles.listTitle}
          descriptionStyle={styles.listDescription}
        />
      </List.Section>

      <Divider style={styles.sectionDivider} />

      <List.Section>
        <List.Subheader style={styles.subheader} accessibilityRole="header">Account</List.Subheader>
        <List.Item
          title="Log Out"
          description="Sign out of your account"
          left={(props) => <List.Icon {...props} icon="logout" color={colors.error.DEFAULT} />}
          onPress={handleLogout}
          titleStyle={[styles.listTitle, { color: colors.error.DEFAULT }]}
          descriptionStyle={styles.listDescription}
          accessibilityLabel="Log out of your account"
          accessibilityHint="Opens a confirmation dialog to log out"
        />
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  subheader: {
    ...typography.label,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listTitle: {
    ...typography['body-lg'],
    color: colors.text.primary,
  },
  listDescription: {
    ...typography['body-sm'],
    color: colors.text.tertiary,
  },
  divider: {
    backgroundColor: colors.border,
    marginLeft: 56,
  },
  sectionDivider: {
    backgroundColor: colors.border,
    marginVertical: spacing[2],
  },
});
