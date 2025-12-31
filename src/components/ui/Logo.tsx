/**
 * Logo Component
 * QuickPick branding with NativeWind
 */

import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";

interface LogoProps {
  showTagline?: boolean;
  size?: "lg" | "md" | "sm";
  variant?: "light" | "dark";
  className?: string;
}

const sizeConfig = {
  lg: { icon: 64, title: "text-5xl", tagline: "text-base" },
  md: { icon: 48, title: "text-3xl", tagline: "text-sm" },
  sm: { icon: 32, title: "text-2xl", tagline: "text-xs" },
};

export function Logo({
  showTagline = true,
  size = "lg",
  variant = "light",
  className,
}: LogoProps) {
  const config = sizeConfig[size];
  const textColor = variant === "light" ? "text-white" : "text-foreground";
  const iconColor = variant === "light" ? "#FFFFFF" : "#22C55E";

  return (
    <View className={cn("items-center", className)}>
      <View className="flex-row items-center gap-2">
        <MaterialCommunityIcons
          name="movie-open"
          size={config.icon}
          color={iconColor}
        />
        <Text className={cn("font-bold", config.title, textColor)}>
          QuickPick
        </Text>
      </View>
      {showTagline && (
        <Text className={cn("mt-2 opacity-90", config.tagline, textColor)}>
          What to watch. Decided in 60 seconds.
        </Text>
      )}
    </View>
  );
}
