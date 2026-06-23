import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, AccessibilityInfo } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { colors } from '../../config/colors';
import { spacing, borderRadius } from '../../config/spacing';
import { typography } from '../../config/typography';

export function OfflineBanner() {
  const insets = useSafeAreaInsets();
  const { isConnected, isInternetReachable, isOffline } = useNetworkStatus();
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOffline ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();

    if (isOffline) {
      AccessibilityInfo.announceForAccessibility('You are offline. Some features may be unavailable.');
    } else {
      AccessibilityInfo.announceForAccessibility('You are back online.');
    }
  }, [isOffline, slideAnim]);

  if (!isOffline) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { paddingTop: insets.top + spacing[1] },
        {
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-80, 0],
              }),
            },
          ],
        },
      ]}
      accessibilityRole="alert"
      accessibilityLabel={`You are offline. ${isInternetReachable === false ? 'No internet connection detected.' : 'Connection lost.'}`}
      accessibilityLiveRegion="assertive"
    >
      <View style={styles.content}>
        <MaterialCommunityIcons name="wifi-off" size={20} color={colors.white} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>No Internet Connection</Text>
          <Text style={styles.subtitle}>
            {isInternetReachable === false
              ? 'Your device appears to be offline.'
              : 'Some features may be unavailable.'}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: colors.gray[800],
    paddingBottom: spacing[3],
    paddingHorizontal: spacing[4],
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...typography['label-lg'],
    color: colors.white,
    fontWeight: '700',
  },
  subtitle: {
    ...typography['body-sm'],
    color: colors.gray[300],
    marginTop: 1,
  },
});
