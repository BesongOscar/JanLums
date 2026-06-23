import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { OrderStatus } from '../../types';
import { getStatusTranslation, getTimelineStatuses } from '../../utils/statusMapper';
import { colors } from '../../config/colors';
import { spacing, borderRadius } from '../../config/spacing';

interface OrderTimelineProps {
  currentStatus: OrderStatus;
}

export function OrderTimeline({ currentStatus }: OrderTimelineProps) {
  const timelineStatuses = useMemo(() => getTimelineStatuses(), []);
  const currentPosition = useMemo(
    () => timelineStatuses.indexOf(currentStatus),
    [timelineStatuses, currentStatus]
  );

  if (currentPosition === -1) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Progress</Text>
      {timelineStatuses.map((status, index) => {
        const translation = getStatusTranslation(status);
        const isCompleted = index <= currentPosition;
        const isCurrent = index === currentPosition;
        const isLast = index === timelineStatuses.length - 1;

        return (
          <View key={status} style={styles.stepRow}>
            <View style={styles.timelineColumn}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: isCompleted ? translation.color : colors.gray[200] },
                  isCurrent && styles.currentDot,
                ]}
              >
                {isCompleted && (
                  <MaterialCommunityIcons
                    name="check"
                    size={12}
                    color={colors.white}
                  />
                )}
              </View>
              {!isLast && (
                <View
                  style={[
                    styles.line,
                    {
                      backgroundColor:
                        index < currentPosition ? translation.color : colors.gray[200],
                    },
                  ]}
                />
              )}
            </View>
            <View
              style={[
                styles.stepContent,
                isCurrent && styles.currentStepContent,
              ]}
            >
              <Text
                style={[
                  styles.stepLabel,
                  { color: isCompleted ? colors.text.primary : colors.text.tertiary },
                  isCurrent && styles.currentStepLabel,
                ]}
              >
                {translation.label}
              </Text>
              {isCurrent && (
                <View
                  style={[
                    styles.currentBadge,
                    { backgroundColor: translation.backgroundColor },
                  ]}
                >
                  <Text style={[styles.currentBadgeText, { color: translation.color }]}>
                    Current
                  </Text>
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing[4],
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 48,
  },
  timelineColumn: {
    width: 32,
    alignItems: 'center',
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: colors.surface,
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  line: {
    width: 2,
    flex: 1,
    marginVertical: spacing[1],
  },
  stepContent: {
    flex: 1,
    marginLeft: spacing[3],
    paddingBottom: spacing[5],
    justifyContent: 'flex-start',
  },
  currentStepContent: {
    paddingBottom: spacing[4],
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  currentStepLabel: {
    fontWeight: '600',
  },
  currentBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    marginTop: spacing[1],
  },
  currentBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
