/**
 * ParticipantList Component
 * Displays participants in a session using NativeWind
 */

import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import { Participant } from "@/types";
import { cn } from "@/lib/utils";

interface ParticipantListProps {
  participants: Participant[];
  currentUserId?: string;
  className?: string;
}

const avatarColors = [
  "bg-primary",
  "bg-accent",
  "bg-blue-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-indigo-500",
];

export function ParticipantList({
  participants,
  currentUserId,
  className,
}: ParticipantListProps) {
  return (
    <View className={cn("w-full", className)}>
      <Text className="mb-3 text-sm uppercase tracking-wider text-muted-foreground">
        Participants ({participants.length})
      </Text>
      <View className="gap-3">
        {participants.map((participant, index) => (
          <View
            key={participant.id}
            className="flex-row items-center gap-3 rounded-lg bg-secondary p-3"
          >
            <Avatar
              fallback={participant.name}
              size="md"
              color={avatarColors[index % avatarColors.length]}
            />
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-base font-semibold text-foreground">
                  {participant.name}
                  {participant.id === currentUserId && " (You)"}
                </Text>
                {participant.isHost && (
                  <Badge variant="warning" className="flex-row items-center gap-1">
                    <MaterialCommunityIcons
                      name="crown"
                      size={12}
                      color="#F59E0B"
                    />
                    <Text className="text-xs font-medium text-accent">Host</Text>
                  </Badge>
                )}
              </View>
              {participant.hasSubmittedPreferences && (
                <View className="mt-1 flex-row items-center gap-1">
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={14}
                    color="#22C55E"
                  />
                  <Text className="text-xs text-primary">Ready</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
