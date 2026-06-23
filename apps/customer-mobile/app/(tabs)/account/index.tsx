import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { Text, Card, Button, ActivityIndicator, Divider } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCustomerProfile } from '../../../src/hooks/useCustomerProfile';
import { useAuthStore } from '../../../src/stores/authStore';
import { colors } from '../../../src/config/colors';
import { spacing } from '../../../src/config/spacing';
import { typography } from '../../../src/config/typography';

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { data: profile, isLoading, isError, refetch, isRefetching } = useCustomerProfile();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color={colors.error.DEFAULT} />
        <Text style={styles.errorText}>Failed to load profile</Text>
        <Button mode="contained" onPress={() => refetch()} style={styles.retryButton}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing[4] }]}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary[500]} />
      }
    >
      <View style={styles.headerSection}>
        <View style={styles.avatarContainer}>
          <MaterialCommunityIcons name="account-circle" size={72} color={colors.primary[500]} />
        </View>
        <Text style={styles.fullName}>
          {profile?.firstName} {profile?.lastName}
        </Text>
        <Text style={styles.email}>{profile?.email || user?.email}</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <MaterialCommunityIcons name="account-outline" size={18} color={colors.text.secondary} />
              <Text style={styles.label}>First Name</Text>
            </View>
            <Text style={styles.value}>{profile?.firstName}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <MaterialCommunityIcons name="account-outline" size={18} color={colors.text.secondary} />
              <Text style={styles.label}>Last Name</Text>
            </View>
            <Text style={styles.value}>{profile?.lastName}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <MaterialCommunityIcons name="email-outline" size={18} color={colors.text.secondary} />
              <Text style={styles.label}>Email</Text>
            </View>
            <Text style={styles.value}>{profile?.email || user?.email || '-'}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <MaterialCommunityIcons name="phone-outline" size={18} color={colors.text.secondary} />
              <Text style={styles.label}>Phone</Text>
            </View>
            <Text style={styles.value}>{profile?.phone || '-'}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <MaterialCommunityIcons name="map-marker-outline" size={18} color={colors.text.secondary} />
              <Text style={styles.label}>Address</Text>
            </View>
            <Text style={styles.value}>{profile?.address || '-'}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <MaterialCommunityIcons name="city" size={18} color={colors.text.secondary} />
              <Text style={styles.label}>City</Text>
            </View>
            <Text style={styles.value}>{profile?.city || '-'}</Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={() => router.push('/(tabs)/account/edit')}
          style={styles.editButton}
          icon="account-edit"
        >
          Edit Profile
        </Button>

        <Button
          mode="outlined"
          onPress={() => router.push('/(tabs)/account/settings')}
          style={styles.settingsButton}
          icon="cog"
        >
          Settings
        </Button>

        <Button
          mode="text"
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor={colors.error.DEFAULT}
          icon="logout"
        >
          Log Out
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing[4],
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing[4],
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  avatarContainer: {
    marginBottom: spacing[3],
  },
  fullName: {
    ...typography['heading-lg'],
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  email: {
    ...typography.body,
    color: colors.text.secondary,
  },
  card: {
    backgroundColor: colors.surface,
    marginBottom: spacing[4],
  },
  sectionTitle: {
    ...typography['heading-sm'],
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  divider: {
    marginBottom: spacing[3],
    backgroundColor: colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  label: {
    ...typography.body,
    color: colors.text.secondary,
  },
  value: {
    ...typography['label-lg'],
    color: colors.text.primary,
    maxWidth: '50%',
    textAlign: 'right',
  },
  actions: {
    gap: spacing[2],
  },
  editButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing[1],
  },
  settingsButton: {
    borderColor: colors.border,
    paddingVertical: spacing[1],
  },
  logoutButton: {
    paddingVertical: spacing[1],
  },
  errorText: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing[3],
    marginBottom: spacing[4],
  },
  retryButton: {
    backgroundColor: colors.primary[500],
  },
});
