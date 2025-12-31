/**
 * Waiting Screen Route
 * Shown to participants after joining, waiting for host to start
 */

import React from "react";
import { View, Text, ActivityIndicator, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, ParticipantList } from "../src/components/ui";
import { useSessionStore } from "../src/store/sessionStore";

export default function WaitingScreen() {
  const router = useRouter();
  const { session, currentParticipant, leaveSession } = useSessionStore();

  const handleLeave = () => {
    leaveSession();
    router.replace("/");
  };

  if (!session) {
    return (
      <View className="flex-1 bg-background">
        <SafeAreaView className="flex-1 items-center justify-center p-6">
          <Text className="mb-6 text-lg text-muted-foreground">Session not found</Text>
          <Button variant="default" onPress={() => router.replace("/")}>
            Go Home
          </Button>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4">
          <View className="w-7" />
          <Text className="text-lg font-semibold text-foreground">
            Room {session.roomCode}
          </Text>
          <Pressable onPress={handleLeave}>
            <MaterialCommunityIcons name="exit-to-app" size={28} color="#EF4444" />
          </Pressable>
        </View>

        <View className="flex-1 px-6">
          {/* Waiting indicator */}
          <View className="items-center gap-4 py-12">
            <ActivityIndicator size="large" color="#22C55E" />
            <Text className="mt-4 text-xl font-semibold text-foreground">
              Waiting for host to start...
            </Text>
            <Text className="text-base text-muted-foreground">
              Get ready to pick what to watch!
            </Text>
          </View>

          {/* Participants */}
          <View className="flex-1">
            <ParticipantList
              participants={session.participants}
              currentUserId={currentParticipant?.id}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
