/**
 * Result Screen Route
 * Displays the winning movie/show
 */

import React from "react";
import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, Badge } from "../src/components/ui";
import { useSessionStore } from "../src/store/sessionStore";
import { usePreferenceStore } from "../src/store/preferenceStore";
import { getTMDBImageUrl, formatRuntime, formatRating, getYear } from "../src/utils/helpers";

export default function ResultScreen() {
  const router = useRouter();
  const { session, reset: resetSession } = useSessionStore();
  const { reset: resetPreferences } = usePreferenceStore();

  const winner = session?.winner;

  const handleStartOver = () => {
    resetSession();
    resetPreferences();
    router.replace("/");
  };

  if (!winner) {
    return (
      <View className="flex-1 bg-foreground">
        <SafeAreaView className="flex-1 items-center justify-center p-6">
          <Text className="mb-6 text-lg text-white">No result available</Text>
          <Button variant="default" onPress={handleStartOver}>
            Go Home
          </Button>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-foreground">
      {/* Background Image */}
      {winner.backdropPath && (
        <Image
          source={{ uri: getTMDBImageUrl(winner.backdropPath, "w780") || "" }}
          className="absolute inset-0 opacity-50"
          resizeMode="cover"
        />
      )}
      <LinearGradient
        colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.95)"]}
        className="absolute inset-0"
      />

      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-center px-6">
          {/* Trophy Icon */}
          <View className="mb-8 items-center">
            <MaterialCommunityIcons name="trophy" size={64} color="#F59E0B" />
            <Text className="mt-4 text-lg font-bold tracking-widest text-accent">
              THE GROUP HAS SPOKEN!
            </Text>
          </View>

          {/* Winner Card */}
          <View className="items-center">
            {/* Poster */}
            <View className="mb-6 h-60 w-40 overflow-hidden rounded-xl shadow-lg">
              {winner.posterPath ? (
                <Image
                  source={{ uri: getTMDBImageUrl(winner.posterPath, "w342") || "" }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="h-full w-full items-center justify-center bg-secondary">
                  <MaterialCommunityIcons name="movie" size={64} color="#94A3B8" />
                </View>
              )}
            </View>

            {/* Title */}
            <Text className="mb-2 text-center text-3xl font-bold text-white">
              {winner.title}
            </Text>

            {/* Meta */}
            <View className="mb-4 flex-row items-center">
              <Text className="text-base text-muted-foreground/70">
                {getYear(winner.releaseDate)}
              </Text>
              <Text className="mx-1 text-muted-foreground/50">•</Text>
              <Text className="text-base text-muted-foreground/70">
                {winner.contentType === "movie"
                  ? formatRuntime(winner.runtime)
                  : `${winner.numberOfSeasons} Season${winner.numberOfSeasons !== 1 ? "s" : ""}`}
              </Text>
              <Text className="mx-1 text-muted-foreground/50">•</Text>
              <View className="flex-row items-center gap-1">
                <MaterialCommunityIcons name="star" size={16} color="#F59E0B" />
                <Text className="text-base font-semibold text-accent">
                  {formatRating(winner.voteAverage)}
                </Text>
              </View>
            </View>

            {/* Genres */}
            <View className="mb-4 flex-row flex-wrap justify-center gap-1">
              {winner.genres.map((genre) => (
                <View
                  key={genre.id}
                  className="rounded-full bg-white/20 px-3 py-1"
                >
                  <Text className="text-sm text-white">{genre.name}</Text>
                </View>
              ))}
            </View>

            {/* Overview */}
            <Text
              className="px-4 text-center text-base leading-6 text-muted-foreground/70"
              numberOfLines={4}
            >
              {winner.overview}
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="mt-8 items-center gap-4">
            <Button
              variant="default"
              size="xl"
              onPress={handleStartOver}
              className="w-72"
            >
              Start Watching!
            </Button>
            <Button
              variant="outline"
              size="default"
              onPress={handleStartOver}
              className="border-white"
            >
              <Text className="font-semibold text-white">Pick Again</Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
