import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../src/config/colors';
import { spacing, borderRadius } from '../../src/config/spacing';
import { typography } from '../../src/config/typography';

const ONBOARDING_KEY = '@janlums/onboarding_complete';

const SLIDES = [
  {
    title: 'Professional Laundry Services',
    description: 'Experience premium laundry care for your garments with our expert cleaning services.',
    icon: 'tshirt-crew' as const,
    iconBg: colors.primary[50],
    iconColor: colors.primary[500],
  },
  {
    title: 'Track Orders In Real Time',
    description: 'Know exactly where your laundry is at every step with live order tracking.',
    icon: 'map-marker-path' as const,
    iconBg: colors.success.light,
    iconColor: colors.success.DEFAULT,
  },
  {
    title: 'Fast Pickup And Delivery',
    description: 'Schedule pickups and enjoy prompt delivery right to your doorstep.',
    icon: 'truck-fast' as const,
    iconBg: colors.warning.light,
    iconColor: colors.warning.DEFAULT,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  const isLastSlide = currentSlide === SLIDES.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      handleComplete();
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handleSkip = async () => {
    setIsCompleting(true);
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    setIsCompleting(false);
    router.replace('/(auth)/login');
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    setIsCompleting(false);
    router.replace('/(auth)/login');
  };

  const slide = SLIDES[currentSlide];

  return (
    <View style={styles.container}>
      <View style={styles.skipContainer}>
        {!isLastSlide && (
          <Button
            mode="text"
            onPress={handleSkip}
            disabled={isCompleting}
            textColor={colors.text.secondary}
            compact
            accessibilityLabel="Skip onboarding"
            accessibilityState={{ disabled: isCompleting }}
          >
            Skip
          </Button>
        )}
      </View>

      <View style={styles.slideContainer} accessibilityLiveRegion="polite">
        <View style={[styles.iconWrapper, { backgroundColor: slide.iconBg }]}>
          <MaterialCommunityIcons name={slide.icon} size={48} color={slide.iconColor} />
        </View>
        <Text style={styles.title} accessibilityRole="header">
          {slide.title}
        </Text>
        <Text style={styles.description}>
          {slide.description}
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots} accessibilityLabel={`Slide ${currentSlide + 1} of ${SLIDES.length}`} accessibilityRole="progressbar" accessibilityValue={{ now: currentSlide + 1, min: 1, max: SLIDES.length }}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentSlide && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <Button
          mode="contained"
          onPress={handleNext}
          loading={isCompleting}
          disabled={isCompleting}
          style={styles.button}
          contentStyle={styles.buttonContent}
          accessibilityLabel={isLastSlide ? 'Get started' : 'Next slide'}
          accessibilityState={{ disabled: isCompleting }}
        >
          {isLastSlide ? 'Get Started' : 'Next'}
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
  skipContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[12],
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[10],
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  title: {
    ...typography['heading-lg'],
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing[3],
  },
  description: {
    ...typography['body-lg'],
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[12],
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    marginBottom: spacing[6],
    gap: spacing[2],
  },
  dot: {
    width: spacing[2],
    height: spacing[2],
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[300],
  },
  activeDot: {
    width: spacing[6],
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.full,
  },
  button: {
    width: '100%',
    borderRadius: borderRadius.lg,
  },
  buttonContent: {
    paddingVertical: spacing[2],
  },
});
