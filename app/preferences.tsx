/**
 * Preferences Screen Route
 * Screen for selecting mood, energy, and runtime preferences
 */

import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "../src/components/ui";
import { usePreferenceStore } from "../src/store/preferenceStore";
import { useSessionStore } from "../src/store/sessionStore";
import {
  MOOD_OPTIONS,
  ENERGY_OPTIONS,
  RUNTIME_OPTIONS,
} from "../src/utils/constants";
import { Mood, EnergyLevel, RuntimePreference } from "../src/types";
import { cn } from "../src/lib/utils";

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

  const { currentParticipant, submitPreferences } = useSessionStore();

  const getStepConfig = () => {
    switch (step) {
      case 0:
        return {
          title: "What's the mood?",
          subtitle: "Pick what feels right for tonight",
          options: MOOD_OPTIONS as unknown as OptionItem[],
          selected: mood,
          onSelect: (value: string) => setMood(value as Mood),
        };
      case 1:
        return {
          title: "Energy level?",
          subtitle: "How intense should it be?",
          options: ENERGY_OPTIONS as unknown as OptionItem[],
          selected: energy,
          onSelect: (value: string) => setEnergy(value as EnergyLevel),
        };
      case 2:
        return {
          title: "How long?",
          subtitle: "Pick your runtime",
          options: RUNTIME_OPTIONS as unknown as OptionItem[],
          selected: runtime,
          onSelect: (value: string) => setRuntime(value as RuntimePreference),
        };
      default:
        return null;
    }
  };

  const stepConfig = getStepConfig();

  const handleContinue = async () => {
    if (step < 2) {
      nextStep();
    } else {
      const preferences = getPreferences();
      if (preferences && currentParticipant) {
        submitPreferences(currentParticipant.id, preferences);
        router.push("/recommendations");
      }
    }
  };

  const handleBack = () => {
    if (step > 0) {
      prevStep();
    } else {
      resetPreferences();
      router.back();
    }
  };

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

  const hasSelection = getCurrentSelection() !== null;

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4">
          <Pressable onPress={handleBack}>
            <MaterialCommunityIcons name="arrow-left" size={28} color="#1E293B" />
          </Pressable>
          <View className="flex-row gap-2">
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                className={cn(
                  "h-2 rounded-full",
                  i === step ? "w-6 bg-primary" : i < step ? "w-2 bg-primary" : "w-2 bg-muted-foreground/30"
                )}
              />
            ))}
          </View>
          <View className="w-7" />
        </View>

        {/* Content */}
        <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
          <Text className="text-center text-3xl font-bold text-foreground">
            {stepConfig.title}
          </Text>
          <Text className="mb-8 mt-2 text-center text-base text-muted-foreground">
            {stepConfig.subtitle}
          </Text>

          {/* Options */}
          <View className="gap-4">
            {stepConfig.options.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => stepConfig.onSelect(option.value)}
                className={cn(
                  "items-center rounded-xl border-2 bg-secondary p-5 active:opacity-80",
                  stepConfig.selected === option.value
                    ? "border-primary bg-primary/10"
                    : "border-transparent"
                )}
              >
                <Text className="mb-2 text-3xl">{option.emoji}</Text>
                <Text
                  className={cn(
                    "text-lg font-semibold",
                    stepConfig.selected === option.value ? "text-primary" : "text-foreground"
                  )}
                >
                  {option.label}
                </Text>
                <Text className="mt-1 text-sm text-muted-foreground">
                  {option.description}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Button */}
        <View className="px-6 py-4">
          <Button
            variant="default"
            size="xl"
            onPress={handleContinue}
            disabled={!hasSelection}
            className={cn("w-full", !hasSelection && "bg-muted-foreground")}
          >
            {step < 2 ? "Continue" : "Find Matches"}
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}
