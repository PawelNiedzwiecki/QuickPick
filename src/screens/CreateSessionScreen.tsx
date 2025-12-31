/**
 * CreateSessionScreen
 * Screen for creating a new session and waiting for participants
 */

import React, { useState } from "react";
import { View, Text, ScrollView, Share, Alert, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import {
  Button,
  Input,
  RoomCodeDisplay,
  ParticipantList,
  LoadingOverlay,
} from "@/components/ui";
import { useSessionStore } from "@/store/sessionStore";
import { SESSION_CONFIG } from "@/utils/constants";
import { cn } from "@/lib/utils";

export function CreateSessionScreen() {
  const router = useRouter();
  const [hostName, setHostName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  const { session, currentParticipant, createSession, reset } = useSessionStore();

  const handleCreateSession = async () => {
    if (!hostName.trim()) {
      Alert.alert("Name Required", "Please enter your name to continue.");
      return;
    }

    setIsCreating(true);
    try {
      await createSession(hostName.trim());
    } catch (error) {
      Alert.alert("Error", "Failed to create session. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleShare = async () => {
    if (!session) return;

    try {
      await Share.share({
        message: `Join my QuickPick session!\n\nRoom Code: ${session.roomCode}\n\nLet's decide what to watch together!`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleStartPicking = () => {
    if (!session) return;

    if (session.participants.length < SESSION_CONFIG.MIN_PARTICIPANTS) {
      Alert.alert(
        "Need More Friends",
        `You need at least ${SESSION_CONFIG.MIN_PARTICIPANTS} people to start. Share the room code!`
      );
      return;
    }

    router.push("/preferences");
  };

  const handleBack = () => {
    if (session) {
      Alert.alert("Leave Session?", "This will end the session for everyone.", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: () => {
            reset();
            router.back();
          },
        },
      ]);
    } else {
      router.back();
    }
  };

  const handleCopy = () => {
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  // Name input screen
  if (!session) {
    return (
      <View className="flex-1 bg-background">
        <SafeAreaView className="flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-4">
            <Pressable onPress={handleBack}>
              <MaterialCommunityIcons name="arrow-left" size={28} color="#1E293B" />
            </Pressable>
            <Text className="text-lg font-semibold text-foreground">Start New Pick</Text>
            <View className="w-7" />
          </View>

          <View className="flex-1 items-center px-6 pt-12">
            <Text className="mb-6 text-2xl font-semibold text-foreground">
              What's your name?
            </Text>
            <TextInput
              className="mb-8 h-14 w-full max-w-xs rounded-lg border-2 border-input bg-secondary px-4 text-lg text-foreground focus:border-primary"
              value={hostName}
              onChangeText={setHostName}
              placeholder="Enter your name"
              placeholderTextColor="#94A3B8"
              autoFocus
              maxLength={20}
            />
            <Button
              variant="default"
              size="xl"
              onPress={handleCreateSession}
              disabled={!hostName.trim() || isCreating}
              loading={isCreating}
              className="w-72"
            >
              Create Room
            </Button>
          </View>
        </SafeAreaView>

        <LoadingOverlay visible={isCreating} message="Creating room..." />
      </View>
    );
  }

  // Session created - show room code
  const canStart = session.participants.length >= SESSION_CONFIG.MIN_PARTICIPANTS;

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4">
          <Pressable onPress={handleBack}>
            <MaterialCommunityIcons name="arrow-left" size={28} color="#1E293B" />
          </Pressable>
          <Text className="text-lg font-semibold text-foreground">Your Room</Text>
          <View className="w-7" />
        </View>

        <ScrollView className="flex-1" contentContainerClassName="px-6 pb-6">
          {/* Room Code */}
          <View className="items-center py-4">
            <RoomCodeDisplay code={session.roomCode} onCopy={handleCopy} />
          </View>

          {/* QR Code */}
          <View className="mt-4 items-center">
            <View className="rounded-lg border-2 border-primary bg-white p-4">
              <QRCode
                value={`quickpick://join/${session.roomCode}`}
                size={120}
                color="#22C55E"
                backgroundColor="#FFFFFF"
              />
            </View>
            <Text className="mt-2 text-sm text-muted-foreground">Scan to join</Text>
          </View>

          {/* Share Button */}
          <Button
            variant="outline"
            size="default"
            onPress={handleShare}
            className="mx-auto mt-6"
          >
            Share Room Code
          </Button>

          {/* Participants */}
          <View className="mt-8">
            <ParticipantList
              participants={session.participants}
              currentUserId={currentParticipant?.id}
            />
          </View>

          {/* Waiting message */}
          {!canStart && (
            <View className="mt-6 flex-row items-center justify-center gap-2 rounded-lg bg-secondary p-4">
              <MaterialCommunityIcons name="account-clock" size={24} color="#64748B" />
              <Text className="text-base text-muted-foreground">
                Waiting for friends to join...
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Bottom button */}
        <View className="border-t border-secondary px-6 py-4">
          <Button
            variant="default"
            size="xl"
            onPress={handleStartPicking}
            disabled={!canStart}
            className={cn("w-full", !canStart && "bg-muted-foreground")}
          >
            {canStart
              ? "Start Picking!"
              : `Need ${SESSION_CONFIG.MIN_PARTICIPANTS - session.participants.length} more`}
          </Button>
        </View>

        {/* Toast */}
        {showCopied && (
          <View className="absolute bottom-24 left-0 right-0 items-center">
            <View className="rounded-full bg-primary px-6 py-3">
              <Text className="font-medium text-white">Room code copied!</Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
