/**
 * JoinSessionScreen
 * Screen for joining an existing session with a room code
 */

import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, CodeInput, LoadingOverlay } from "@/components/ui";
import { useSessionStore } from "@/store/sessionStore";
import { isValidRoomCode } from "@/utils/helpers";
import { ERROR_MESSAGES } from "@/utils/constants";
import { cn } from "@/lib/utils";

type JoinStep = "code" | "name";

export function JoinSessionScreen() {
  const router = useRouter();
  const [step, setStep] = useState<JoinStep>("code");
  const [roomCode, setRoomCode] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const { joinSession } = useSessionStore();

  const handleCodeChange = (code: string) => {
    const filtered = code.toUpperCase().replace(/[^23456789ABCDEFGHJKMNPQRSTUVWXYZ]/g, "");
    setRoomCode(filtered);

    if (filtered.length === 4) {
      setStep("name");
    }
  };

  const handleJoin = async () => {
    if (!participantName.trim()) {
      Alert.alert("Name Required", "Please enter your name to join.");
      return;
    }

    if (!isValidRoomCode(roomCode)) {
      Alert.alert("Invalid Code", ERROR_MESSAGES.INVALID_ROOM_CODE);
      return;
    }

    setIsJoining(true);
    try {
      await joinSession(roomCode, participantName.trim());
      router.replace("/waiting");
    } catch (err) {
      const message = err instanceof Error ? err.message : ERROR_MESSAGES.UNKNOWN_ERROR;
      Alert.alert("Could Not Join", message);
    } finally {
      setIsJoining(false);
    }
  };

  const handleBack = () => {
    if (step === "name") {
      setStep("code");
      setRoomCode("");
    } else {
      router.back();
    }
  };

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-4">
            <Pressable onPress={handleBack}>
              <MaterialCommunityIcons name="arrow-left" size={28} color="#1E293B" />
            </Pressable>
            <Text className="text-lg font-semibold text-foreground">Join Pick</Text>
            <View className="w-7" />
          </View>

          <View className="flex-1 px-6">
            {step === "code" ? (
              // Step 1: Enter room code
              <View className="flex-1 items-center pt-12">
                <Text className="mb-2 text-center text-3xl font-bold text-foreground">
                  Enter Room Code
                </Text>
                <Text className="mb-8 text-center text-base text-muted-foreground">
                  Ask your friend for the 4-character code
                </Text>

                <CodeInput value={roomCode} onChange={handleCodeChange} maxLength={4} />

                <Button
                  variant="default"
                  size="xl"
                  onPress={() => setStep("name")}
                  disabled={roomCode.length !== 4}
                  className={cn("mt-8 w-72", roomCode.length !== 4 && "bg-muted-foreground")}
                >
                  Continue
                </Button>
              </View>
            ) : (
              // Step 2: Enter name
              <View className="flex-1 items-center pt-12">
                {/* Code preview */}
                <View className="mb-8 items-center rounded-lg bg-secondary p-4">
                  <Text className="mb-1 text-sm text-muted-foreground">Joining room</Text>
                  <Text className="text-xl font-bold tracking-widest text-primary">
                    {roomCode.split("").join(" ")}
                  </Text>
                </View>

                <Text className="mb-6 text-center text-3xl font-bold text-foreground">
                  What's your name?
                </Text>

                <TextInput
                  className="mb-8 h-14 w-full max-w-xs rounded-lg border-2 border-input bg-secondary px-4 text-lg text-foreground focus:border-primary"
                  value={participantName}
                  onChangeText={setParticipantName}
                  placeholder="Enter your name"
                  placeholderTextColor="#94A3B8"
                  autoFocus
                  maxLength={20}
                />

                <Button
                  variant="default"
                  size="xl"
                  onPress={handleJoin}
                  disabled={!participantName.trim() || isJoining}
                  loading={isJoining}
                  className={cn("w-72", !participantName.trim() && "bg-muted-foreground")}
                >
                  Join Room
                </Button>
              </View>
            )}
          </View>

          {/* Step indicator */}
          <View className="flex-row justify-center gap-2 pb-8">
            <View
              className={cn(
                "h-2 rounded-full bg-muted-foreground/30",
                step === "code" ? "w-6 bg-primary" : "w-2"
              )}
            />
            <View
              className={cn(
                "h-2 rounded-full bg-muted-foreground/30",
                step === "name" ? "w-6 bg-primary" : "w-2"
              )}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <LoadingOverlay visible={isJoining} message="Joining room..." />
    </View>
  );
}
