import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../config/colors';
import { spacing, borderRadius } from '../../config/spacing';
import { typography } from '../../config/typography';

export interface Step {
  key: string;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: string;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;

        return (
          <View key={step.key} style={styles.stepWrapper}>
            <View style={styles.stepRow}>
              <View
                style={[
                  styles.dot,
                  isCompleted && styles.dotCompleted,
                  isCurrent && styles.dotCurrent,
                  isPending && styles.dotPending,
                ]}
              >
                {isCompleted ? (
                  <MaterialCommunityIcons name="check" size={14} color={colors.white} />
                ) : (
                  <Text
                    style={[
                      styles.dotNumber,
                      isCurrent && styles.dotNumberCurrent,
                      isPending && styles.dotNumberPending,
                    ]}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.label,
                  (isCompleted || isCurrent) && styles.labelActive,
                  isPending && styles.labelPending,
                ]}
                numberOfLines={1}
              >
                {step.label}
              </Text>
            </View>
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.line,
                  isCompleted && styles.lineCompleted,
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stepWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  stepRow: {
    alignItems: 'center',
    gap: spacing[1],
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotCompleted: {
    backgroundColor: colors.success.DEFAULT,
  },
  dotCurrent: {
    backgroundColor: colors.primary[500],
  },
  dotPending: {
    backgroundColor: colors.gray[200],
  },
  dotNumber: {
    ...typography['label-sm'],
    fontWeight: '700',
  },
  dotNumberCurrent: {
    color: colors.white,
  },
  dotNumberPending: {
    color: colors.text.tertiary,
  },
  label: {
    ...typography.caption,
    textAlign: 'center',
    fontSize: 10,
    maxWidth: 64,
  },
  labelActive: {
    color: colors.primary[700],
    fontWeight: '600',
  },
  labelPending: {
    color: colors.text.tertiary,
  },
  line: {
    position: 'absolute',
    top: 14,
    left: '50%',
    right: -8,
    height: 2,
    backgroundColor: colors.gray[200],
  },
  lineCompleted: {
    backgroundColor: colors.success.DEFAULT,
  },
});
