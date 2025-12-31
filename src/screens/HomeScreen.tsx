/**
 * HomeScreen
 * Main landing screen with options to create or join a session
 */

import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Logo, Button } from "@/components/ui";

export function HomeScreen() {
  const router = useRouter();

  const handleStartNewPick = () => {
    router.push("/create");
  };

  const handleJoinPick = () => {
    router.push("/join");
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={["#22C55E", "#16A34A"]}
        className="absolute inset-0"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-6 pb-8">
          {/* Logo Section */}
          <View className="flex-1 items-center justify-center">
            <Logo size="lg" variant="light" />
          </View>

          {/* Buttons Section */}
          <View className="items-center gap-4 pb-12">
            <Button
              variant="secondary"
              size="xl"
              onPress={handleStartNewPick}
              className="w-72"
            >
              <Text className="text-lg font-semibold text-primary">
                Start New Pick
              </Text>
            </Button>
            <Button
              variant="outline"
              size="xl"
              onPress={handleJoinPick}
              className="w-72 border-white"
            >
              <Text className="text-lg font-semibold text-white">
                Join Pick
              </Text>
            </Button>
          </View>

          {/* Footer spacer */}
          <View className="h-8" />
        </View>
      </SafeAreaView>
    </View>
  );
}
