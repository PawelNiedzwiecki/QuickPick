/**
 * Preferences Screen Route
 * Screen for selecting mood, energy, and runtime preferences
 */

import React from 'react';
import { StyleSheet, View, SafeAreaView, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PrimaryButton } from '../src/components/ui';
import { usePreferenceStore } from '../src/store/preferenceStore';
import { useSessionStore } from '../src/store/sessionStore';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
  MOOD_OPTIONS,
  ENERGY_OPTIONS,
  RUNTIME_OPTIONS,
} from '../src/utils/constants';
import { Mood, EnergyLevel, RuntimePreference } from '../src/types';

type OptionItem = {
  value: string;
  label: string;
  emoji: string;
  description: string;
};

export default function PreferencesScreen() {
  const router = useRouter();
  const {
    mood,
    energy,
    runtime,
    step,
    setMood,
    setEnergy,
    setRuntime,
    nextStep,
    prevStep,
    reset: resetPreferences,
    getPreferences,
  } = usePreferenceStore();

  const { session, currentParticipant, submitPreferences } = useSessionStore();

  // Get current step configuration
  const getStepConfig = () => {
    switch (step) {
      case 0:
        return {
          title: "What's the mood?",
          subtitle: 'Pick what feels right for tonight',
          options: MOOD_OPTIONS as unknown as OptionItem[],
          selected: mood,
          onSelect: (value: string) => setMood(value as Mood),
        };
      case 1:
        return {
          title: 'Energy level?',
          subtitle: 'How intense should it be?',
          options: ENERGY_OPTIONS as unknown as OptionItem[],
          selected: energy,
          onSelect: (value: string) => setEnergy(value as EnergyLevel),
        };
      case 2:
        return {
          title: 'How long?',
          subtitle: 'Pick your runtime',
          options: RUNTIME_OPTIONS as unknown as OptionItem[],
          selected: runtime,
          onSelect: (value: string) => setRuntime(value as RuntimePreference),
        };
      default:
        return null;
    }
  };

  const stepConfig = getStepConfig();

  // Handle continuing to next step or submitting
  const handleContinue = async () => {
    if (step < 2) {
      nextStep();
    } else {
      // Submit preferences
      const preferences = getPreferences();
      if (preferences && currentParticipant) {
        submitPreferences(currentParticipant.id, preferences);
        router.push('/recommendations');
      }
    }
  };

  // Handle going back
  const handleBack = () => {
    if (step > 0) {
      prevStep();
    } else {
      resetPreferences();
      router.back();
    }
  };

  // Get current selection based on step
  const getCurrentSelection = () => {
    switch (step) {
      case 0:
        return mood;
      case 1:
        return energy;
      case 2:
        return runtime;
      default:
        return null;
    }
  };

  if (!stepConfig) return null;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={28}
            color={COLORS.text}
            onPress={handleBack}
          />
          <View style={styles.stepIndicator}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={[
                  styles.stepDot,
                  i === step && styles.stepDotActive,
                  i < step && styles.stepDotCompleted,
                ]}
              />
            ))}
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>{stepConfig.title}</Text>
          <Text style={styles.subtitle}>{stepConfig.subtitle}</Text>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {stepConfig.options.map((option) => (
              <Pressable
                key={option.value}
                style={({ pressed }) => [
                  styles.optionCard,
                  stepConfig.selected === option.value && styles.optionCardSelected,
                  pressed && styles.optionCardPressed,
                ]}
                onPress={() => stepConfig.onSelect(option.value)}
              >
                <Text style={styles.optionEmoji}>{option.emoji}</Text>
                <Text
                  style={[
                    styles.optionLabel,
                    stepConfig.selected === option.value && styles.optionLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Bottom Button */}
        <View style={styles.bottomSection}>
          <PrimaryButton
            title={step < 2 ? 'Continue' : 'Find Matches'}
            onPress={handleContinue}
            disabled={!getCurrentSelection()}
            variant="filled"
            size="large"
            style={[
              styles.continueButton,
              getCurrentSelection() && styles.continueButtonActive,
            ]}
            textStyle={{ color: COLORS.secondary }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  stepIndicator: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.textLight,
  },
  stepDotActive: {
    backgroundColor: COLORS.primary,
    width: 24,
  },
  stepDotCompleted: {
    backgroundColor: COLORS.primary,
  },
  headerSpacer: {
    width: 28,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  optionsContainer: {
    gap: SPACING.md,
  },
  optionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  optionCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
  },
  optionCardPressed: {
    opacity: 0.8,
  },
  optionEmoji: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  optionLabel: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  optionLabelSelected: {
    color: COLORS.primary,
  },
  optionDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  bottomSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  continueButton: {
    backgroundColor: COLORS.textLight,
  },
  continueButtonActive: {
    backgroundColor: COLORS.primary,
  },
});
