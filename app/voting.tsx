/**
 * Voting Screen Route
 * Screen for voting on recommendations
 */

import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "../src/components/ui";
import { useSessionStore } from "../src/store/sessionStore";
import { getTMDBImageUrl } from "../src/utils/helpers";
import { Vote } from "../src/types";
import { SESSION_CONFIG } from "../src/utils/constants";
import { cn } from "../src/lib/utils";

export default function VotingScreen() {
  const router = useRouter();
  const { session, currentParticipant, submitVotes, setWinner } = useSessionStore();
  const [selectedRanks, setSelectedRanks] = useState<Record<string, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(SESSION_CONFIG.VOTING_TIME_SECONDS);

  const recommendations = session?.recommendations || [];

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitVotes();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSelectRank = (recId: string, rank: number) => {
    setSelectedRanks((prev) => {
      const newRanks = { ...prev };

      Object.keys(newRanks).forEach((key) => {
        if (newRanks[key] === rank) {
          delete newRanks[key];
        }
      });

      if (prev[recId] === rank) {
        delete newRanks[recId];
      } else {
        newRanks[recId] = rank;
      }

      return newRanks;
    });
  };

  const handleSubmitVotes = () => {
    if (!session || !currentParticipant) return;

    const votes: Vote[] = Object.entries(selectedRanks).map(([recId, rank]) => ({
      oderId: `vote_${Date.now()}`,
      participantId: currentParticipant.id,
      recommendationId: recId,
      rank,
      timestamp: Date.now(),
    }));

    submitVotes(votes);

    const topRec = recommendations.find((r) => selectedRanks[r.id] === 1) || recommendations[0];
    if (topRec) {
      setWinner(topRec);
    }

    router.replace("/result");
  };

  const allRanksAssigned = Object.keys(selectedRanks).length === recommendations.length;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isUrgent = timeRemaining < 10;

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1">
        {/* Header with Timer */}
        <View className="flex-row items-center justify-center px-4 py-4">
          <View className="flex-row items-center gap-1 rounded-full bg-secondary px-4 py-2">
            <MaterialCommunityIcons
              name="timer-outline"
              size={20}
              color={isUrgent ? "#EF4444" : "#1E293B"}
            />
            <Text
              className={cn("text-lg font-bold", isUrgent ? "text-destructive" : "text-foreground")}
            >
              {formatTime(timeRemaining)}
            </Text>
          </View>
        </View>

        <View className="flex-1 px-6">
          <Text className="text-center text-3xl font-bold text-foreground">
            Rank Your Top 3
          </Text>
          <Text className="mb-8 mt-2 text-center text-base text-muted-foreground">
            Tap the numbers to assign your rankings
          </Text>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {recommendations.map((rec) => (
              <View
                key={rec.id}
                className="mb-4 flex-row items-center rounded-lg bg-secondary p-4"
              >
                {/* Thumbnail */}
                <View className="h-20 w-[60px] overflow-hidden rounded-md">
                  {rec.posterPath ? (
                    <Image
                      source={{ uri: getTMDBImageUrl(rec.posterPath, "w154") || "" }}
                      className="h-full w-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="h-full w-full items-center justify-center bg-muted-foreground/20">
                      <MaterialCommunityIcons name="movie" size={24} color="#94A3B8" />
                    </View>
                  )}
                </View>

                {/* Info */}
                <View className="ml-4 flex-1">
                  <Text className="text-base font-semibold text-foreground" numberOfLines={1}>
                    {rec.title}
                  </Text>
                  <Text className="mt-1 text-sm text-primary">{rec.matchScore}% match</Text>
                </View>

                {/* Rank buttons */}
                <View className="flex-row gap-1">
                  {[1, 2, 3].map((rank) => (
                    <Pressable
                      key={rank}
                      onPress={() => handleSelectRank(rec.id, rank)}
                      className={cn(
                        "h-9 w-9 items-center justify-center rounded-full border-2",
                        selectedRanks[rec.id] === rank
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/30 bg-background"
                      )}
                    >
                      <Text
                        className={cn(
                          "text-base font-bold",
                          selectedRanks[rec.id] === rank ? "text-white" : "text-muted-foreground"
                        )}
                      >
                        {rank}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Submit Button */}
        <View className="border-t border-secondary px-6 py-4">
          <Button
            variant="default"
            size="xl"
            onPress={handleSubmitVotes}
            disabled={!allRanksAssigned}
            className={cn("w-full", !allRanksAssigned && "bg-muted-foreground")}
          >
            {allRanksAssigned ? "Submit Votes" : "Rank All 3 to Continue"}
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}
