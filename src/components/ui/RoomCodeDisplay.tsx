/**
 * RoomCodeDisplay Component
 * Large display for 4-digit room code with NativeWind
 */

import React from "react";
import { View, Text, Pressable } from "react-native";
import * as Clipboard from "expo-clipboard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";

interface RoomCodeDisplayProps {
  code: string;
  onCopy?: () => void;
  className?: string;
}

export function RoomCodeDisplay({
  code,
  onCopy,
  className,
}: RoomCodeDisplayProps) {
  const handleCopy = async () => {
    await Clipboard.setStringAsync(code);
    onCopy?.();
  };

  return (
    <View className={cn("items-center", className)}>
      <Text className="mb-2 text-sm uppercase tracking-wider text-muted-foreground">
        Room Code
      </Text>
      <View className="flex-row gap-2">
        {code.split("").map((char, index) => (
          <View
            key={index}
            className="h-20 w-16 items-center justify-center rounded-lg border-2 border-primary bg-white"
          >
            <Text className="text-4xl font-bold text-primary">{char}</Text>
          </View>
        ))}
      </View>
      <Pressable
        onPress={handleCopy}
        className="mt-4 flex-row items-center gap-1 rounded-full bg-secondary px-4 py-2 active:opacity-70"
      >
        <MaterialCommunityIcons name="content-copy" size={18} color="#22C55E" />
        <Text className="text-sm text-primary">Tap to copy</Text>
      </Pressable>
    </View>
  );
}
