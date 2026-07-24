import { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors } from '../../config/colors';
import { spacing, borderRadius } from '../../config/spacing';

interface SkeletonBlockProps {
  width?: number | string;
  height?: number;
  borderRadiusVal?: number;
  style?: any;
}

function SkeletonBlock({ width = '100%', height = 16, borderRadiusVal = borderRadius.sm, style }: SkeletonBlockProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius: borderRadiusVal,
          backgroundColor: colors.gray[200],
          opacity,
        },
        style,
      ]}
    />
  );
}

interface SkeletonCardProps {
  lines?: number;
}

export function SkeletonCard({ lines = 3 }: SkeletonCardProps) {
  return (
    <View style={styles.card}>
      <SkeletonBlock width="40%" height={16} />
      <View style={{ height: spacing[3] }} />
      {Array.from({ length: lines - 1 }).map((_, i) => (
        <View key={i} style={{ marginBottom: spacing[2] }}>
          <SkeletonBlock
            width={i === lines - 2 ? '55%' : '100%'}
            height={14}
          />
        </View>
      ))}
    </View>
  );
}

interface SkeletonListProps {
  count?: number;
  lines?: number;
}

export function SkeletonList({ count = 3, lines = 3 }: SkeletonListProps) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} lines={lines} />
      ))}
    </View>
  );
}

interface SkeletonTimelineProps {
  steps?: number;
}

export function SkeletonTimeline({ steps = 5 }: SkeletonTimelineProps) {
  return (
    <View style={styles.timeline}>
      {Array.from({ length: steps }).map((_, index) => (
        <View key={index} style={styles.timelineRow}>
          <View style={styles.timelineDot} />
          {index < steps - 1 && <View style={styles.timelineLine} />}
          <SkeletonBlock width="65%" height={14} style={{ marginLeft: spacing[3] }} />
        </View>
      ))}
    </View>
  );
}

interface SkeletonHeroProps {
  hasIcon?: boolean;
}

export function SkeletonHero({ hasIcon = true }: SkeletonHeroProps) {
  return (
    <View style={styles.hero}>
      {hasIcon && <SkeletonBlock width={72} height={72} borderRadiusVal={36} />}
      <View style={{ height: spacing[3] }} />
      <SkeletonBlock width="50%" height={24} />
      <View style={{ height: spacing[2] }} />
      <SkeletonBlock width="35%" height={14} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    marginBottom: spacing[2],
  },
  list: {
    paddingTop: spacing[4],
    paddingHorizontal: spacing[4],
    gap: spacing[2],
  },
  timeline: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 36,
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.gray[100],
  },
  timelineLine: {
    position: 'absolute',
    left: 9,
    top: 20,
    width: 2,
    height: 28,
    backgroundColor: colors.gray[100],
  },
  hero: {
    alignItems: 'center',
    paddingVertical: spacing[6],
    paddingHorizontal: spacing[4],
  },
});

export { SkeletonBlock };
