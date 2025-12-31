/**
 * Recommendations Screen Route
 * Displays AI-generated movie/TV recommendations
 */

import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, Badge } from "../src/components/ui";
import { useSessionStore } from "../src/store/sessionStore";
import { generateRecommendations } from "../src/services/recommendationService";
import { getTMDBImageUrl, formatRuntime, formatRating, getYear } from "../src/utils/helpers";
import { Recommendation } from "../src/types";

export default function RecommendationsScreen() {
  const router = useRouter();
  const { session, setRecommendations } = useSessionStore();
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setLocalRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!session) return;

      setIsLoading(true);
      try {
        const recs = await generateRecommendations(session.participants);
        setLocalRecommendations(recs);
        setRecommendations(recs);
      } catch (error) {
        console.error("Error generating recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecommendations();
  }, [session]);

  const handleStartVoting = () => {
    router.push("/voting");
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background">
        <SafeAreaView className="flex-1 items-center justify-center p-6">
          <ActivityIndicator size="large" color="#22C55E" />
          <Text className="mt-6 text-xl font-semibold text-foreground">
            Finding perfect matches...
          </Text>
          <Text className="mt-2 text-base text-muted-foreground">
            Analyzing everyone's preferences
          </Text>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-center px-4 py-4">
          <Text className="text-lg font-semibold text-foreground">Top Picks</Text>
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          <Text className="mb-6 text-center text-base text-muted-foreground">
            Based on your group's preferences
          </Text>

          {/* Recommendation Cards */}
          {recommendations.map((rec, index) => (
            <View
              key={rec.id}
              className="relative mb-6 overflow-hidden rounded-xl bg-secondary"
            >
              {/* Rank Badge */}
              <View className="absolute left-2 top-2 z-10 rounded-md bg-primary px-2 py-1">
                <Text className="text-sm font-bold text-white">#{index + 1}</Text>
              </View>

              {/* Poster */}
              <View className="aspect-video w-full bg-muted-foreground/20">
                {rec.posterPath ? (
                  <Image
                    source={{ uri: getTMDBImageUrl(rec.posterPath, "w500") || "" }}
                    className="h-full w-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="h-full w-full items-center justify-center">
                    <MaterialCommunityIcons name="movie" size={48} color="#94A3B8" />
                  </View>
                )}
              </View>

              {/* Info */}
              <View className="p-4">
                <Text className="mb-2 text-lg font-bold text-foreground" numberOfLines={2}>
                  {rec.title}
                </Text>

                <View className="mb-2 flex-row items-center">
                  <Text className="text-sm text-muted-foreground">
                    {getYear(rec.releaseDate)}
                  </Text>
                  <Text className="mx-1 text-muted-foreground/50">•</Text>
                  <Text className="text-sm text-muted-foreground">
                    {rec.contentType === "movie"
                      ? formatRuntime(rec.runtime)
                      : `${rec.numberOfSeasons} Season${rec.numberOfSeasons !== 1 ? "s" : ""}`}
                  </Text>
                  <Text className="mx-1 text-muted-foreground/50">•</Text>
                  <View className="flex-row items-center gap-1">
                    <MaterialCommunityIcons name="star" size={14} color="#F59E0B" />
                    <Text className="text-sm font-semibold text-accent">
                      {formatRating(rec.voteAverage)}
                    </Text>
                  </View>
                </View>

                {/* Genres */}
                <View className="mb-4 flex-row flex-wrap gap-1">
                  {rec.genres.slice(0, 3).map((genre) => (
                    <Badge key={genre.id} variant="success">
                      {genre.name}
                    </Badge>
                  ))}
                </View>

                {/* Match Score */}
                <View className="mb-2 flex-row items-center gap-2">
                  <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted-foreground/20">
                    <View
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${rec.matchScore}%` }}
                    />
                  </View>
                  <Text className="min-w-[70px] text-right text-sm font-semibold text-primary">
                    {rec.matchScore}% match
                  </Text>
                </View>

                <Text className="text-sm italic text-muted-foreground">
                  {rec.matchReason}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Vote Button */}
        <View className="border-t border-secondary px-6 py-4">
          <Button variant="default" size="xl" onPress={handleStartVoting} className="w-full">
            Vote for Your Favorite!
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}
