import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../src/config/colors';

const ONBOARDING_KEY = '@janlums/onboarding_complete';

const SLIDES = [
  {
    title: 'Professional Laundry Services',
    description: 'Experience premium laundry care for your garments with our expert cleaning services.',
    icon: '👔',
  },
  {
    title: 'Track Orders In Real Time',
    description: 'Know exactly where your laundry is at every step with live order tracking.',
    icon: '📍',
  },
  {
    title: 'Fast Pickup And Delivery',
    description: 'Schedule pickups and enjoy prompt delivery right to your doorstep.',
    icon: '🚚',
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
            accessibilityLabel="Skip onboarding"
            accessibilityState={{ disabled: isCompleting }}
          >
            Skip
          </Button>
        )}
      </View>

      <View style={styles.slideContainer} accessibilityLiveRegion="polite">
        <Text style={styles.icon}>{slide.icon}</Text>
        <Text variant="headlineMedium" style={styles.title} accessibilityRole="header">
          {slide.title}
        </Text>
        <Text variant="bodyLarge" style={styles.description}>
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
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  icon: {
    fontSize: 80,
    marginBottom: 32,
  },
  title: {
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    marginBottom: 32,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray[300],
  },
  activeDot: {
    width: 24,
    backgroundColor: colors.primary[500],
    borderRadius: 4,
  },
  button: {
    width: '100%',
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
