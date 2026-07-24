import { useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { Text, List, Divider, Dialog, Portal, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useCustomerProfile } from '../../../src/hooks/useCustomerProfile';
import { useAuthStore } from '../../../src/stores/authStore';
import { useAnalytics } from '../../../src/hooks/useAnalytics';
import { isFeatureEnabled } from '../../../src/config/features';
import { colors } from '../../../src/config/colors';
import { spacing, borderRadius } from '../../../src/config/spacing';
import { typography } from '../../../src/config/typography';
import { formatDate } from '../../../src/utils/format';
import { ScreenHeader } from '../../../src/components/common/ScreenHeader';
import { SkeletonBlock } from '../../../src/components/common/SkeletonLoader';
import { ErrorState } from '../../../src/components/common/DataState';

const TIER_STYLES: Record<string, { color: string; bg: string }> = {
  bronze: { color: '#CD7F32', bg: '#FFF3E0' },
  silver: { color: '#9CA3AF', bg: '#F3F4F6' },
  gold: { color: '#F59E0B', bg: '#FEF3C7' },
  platinum: { color: '#6366F1', bg: '#EEF2FF' },
};

export default function AccountScreen() {
  const router = useRouter();
  const analytics = useAnalytics();
  const { user, logout } = useAuthStore();
  const { data: profile, isLoading, isError, refetch, isRefetching } = useCustomerProfile();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    analytics.track({ name: 'account_screen_viewed' });
  }, [analytics]);

  const handleLogout = async () => {
    setShowLogoutDialog(false);
    await logout();
    router.replace('/(auth)/login');
  };

  const initials = profile
    ? `${(profile.firstName ?? '')[0] ?? ''}${(profile.lastName ?? '')[0] ?? ''}`.toUpperCase() || '?'
    : '?';

  const tierStyle = TIER_STYLES[profile?.loyaltyTier ?? ''] ?? TIER_STYLES.bronze;

  const tierLabel = profile?.loyaltyTier
    ? profile.loyaltyTier.charAt(0).toUpperCase() + profile.loyaltyTier.slice(1)
    : 'Bronze';

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Account" showBack={false} />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.skeletonHero}>
            <SkeletonBlock width={72} height={72} borderRadiusVal={36} />
            <View style={{ height: spacing[3] }} />
            <SkeletonBlock width="50%" height={24} />
            <View style={{ height: spacing[1] }} />
            <SkeletonBlock width="35%" height={14} />
          </View>
          <View style={styles.statsRow}>
            <SkeletonBlock width="30%" height={70} borderRadiusVal={borderRadius.lg} />
            <SkeletonBlock width="30%" height={70} borderRadiusVal={borderRadius.lg} />
            <SkeletonBlock width="30%" height={70} borderRadiusVal={borderRadius.lg} />
          </View>
          <View style={styles.skeletonMenuSection}>
            <SkeletonBlock width="30%" height={14} />
            <View style={{ height: spacing[2] }} />
            <SkeletonBlock width="100%" height={48} />
            <View style={{ height: spacing[1] }} />
            <SkeletonBlock width="100%" height={48} />
            <View style={{ height: spacing[1] }} />
            <SkeletonBlock width="100%" height={48} />
          </View>
        </ScrollView>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Account" showBack={false} />
        <ErrorState
          title="Failed to load profile"
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Account" showBack={false} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary[500]} />
        }
      >
        <View style={styles.heroCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>
          <Text style={styles.heroName}>
            {profile?.firstName} {profile?.lastName}
          </Text>
          <Text style={styles.heroEmail}>{profile?.email || user?.email}</Text>
          {profile?.createdAt && (
            <Text style={styles.heroMeta}>
              Member since {formatDate(profile.createdAt, 'long')}
            </Text>
          )}
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.info.light }]}>
            <Text style={[styles.statValue, { color: colors.primary[700] }]}>{profile?.totalOrders ?? 0}</Text>
            <Text style={[styles.statLabel, { color: colors.primary[600] }]}>Total Orders</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.warning.light }]}>
            <Text style={[styles.statValue, { color: colors.warning.DEFAULT }]}>{profile?.loyaltyPoints ?? 0}</Text>
            <Text style={[styles.statLabel, { color: colors.secondary[600] }]}>Points</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: tierStyle.bg }]}>
            <Text style={[styles.statValue, { color: tierStyle.color }]}>{tierLabel}</Text>
            <Text style={[styles.statLabel, { color: tierStyle.color }]}>Tier</Text>
          </View>
        </View>

        <List.Section>
          <List.Subheader style={styles.subheader}>Account</List.Subheader>
          <List.Item
            title="Edit Profile"
            description="Update your personal information"
            left={(props) => <List.Icon {...props} icon="account-edit" color={colors.primary[500]} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => router.push('/(tabs)/account/edit')}
            titleStyle={styles.listTitle}
            descriptionStyle={styles.listDescription}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Saved Addresses"
            description="Manage your saved addresses"
            left={(props) => <List.Icon {...props} icon="map-marker" color={colors.primary[500]} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => router.push('/(tabs)/account/addresses' as any)}
            titleStyle={styles.listTitle}
            descriptionStyle={styles.listDescription}
          />
          {isFeatureEnabled('loyaltyProgram') && (
            <>
              <Divider style={styles.divider} />
              <List.Item
                title="Loyalty & Rewards"
                description="Check your rewards and tier"
                left={(props) => <List.Icon {...props} icon="star" color={colors.primary[500]} />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => router.push('/(tabs)/account/loyalty')}
                titleStyle={styles.listTitle}
                descriptionStyle={styles.listDescription}
              />
            </>
          )}
        </List.Section>

        <List.Section>
          <List.Subheader style={styles.subheader}>App</List.Subheader>
          <List.Item
            title="Settings"
            description="App preferences and sync queue"
            left={(props) => <List.Icon {...props} icon="cog" color={colors.primary[500]} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => router.push('/(tabs)/account/settings')}
            titleStyle={styles.listTitle}
            descriptionStyle={styles.listDescription}
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

        <List.Section>
          <List.Item
            title="Log Out"
            description="Sign out of your account"
            left={(props) => <List.Icon {...props} icon="logout" color={colors.error.DEFAULT} />}
            onPress={() => setShowLogoutDialog(true)}
            titleStyle={[styles.listTitle, { color: colors.error.DEFAULT }]}
            descriptionStyle={styles.listDescription}
          />
        </List.Section>

        <View style={{ height: spacing[8] }} />
      </ScrollView>

      <Portal>
        <Dialog visible={showLogoutDialog} onDismiss={() => setShowLogoutDialog(false)}>
          <Dialog.Icon icon="logout" />
          <Dialog.Title>Log Out</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to log out?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowLogoutDialog(false)}>Cancel</Button>
            <Button onPress={handleLogout} textColor={colors.error.DEFAULT}>Log Out</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[4],
  },
  skeletonHero: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  skeletonMenuSection: {
    marginTop: spacing[4],
  },
  heroCard: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
  },
  avatarInitials: {
    ...typography['heading-xl'],
    color: colors.primary[500],
  },
  heroName: {
    ...typography['heading-lg'],
    color: colors.white,
    marginBottom: spacing[1],
  },
  heroEmail: {
    ...typography.body,
    color: colors.primary[100],
    marginBottom: spacing[1],
  },
  heroMeta: {
    ...typography['body-sm'],
    color: colors.primary[200],
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  statCard: {
    flex: 1,
    borderRadius: borderRadius.lg,
    padding: spacing[3],
    alignItems: 'center',
  },
  statValue: {
    ...typography['heading-md'],
    marginBottom: spacing[1],
  },
  statLabel: {
    ...typography['body-sm'],
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
});
