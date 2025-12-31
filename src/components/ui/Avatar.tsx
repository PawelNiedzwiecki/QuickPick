/**
 * Avatar Component
 * shadcn/ui style avatar with NativeWind
 */

import React from "react";
import { View, Text, Image } from "react-native";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  fallback: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  color?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-11 w-11",
  lg: "h-16 w-16",
};

const textSizeClasses = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-lg",
};

export function Avatar({
  src,
  fallback,
  size = "md",
  className,
  color = "bg-primary",
}: AvatarProps) {
  const initials = fallback
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (src) {
    return (
      <Image
        source={{ uri: src }}
        className={cn(
          "rounded-full",
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <View
      className={cn(
        "items-center justify-center rounded-full",
        sizeClasses[size],
        color,
        className
      )}
    >
      <Text
        className={cn(
          "font-semibold text-primary-foreground",
          textSizeClasses[size]
        )}
      >
        {initials}
      </Text>
    </View>
  );
}
