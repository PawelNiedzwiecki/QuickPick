/**
 * CodeInput Component
 * 4-digit code input with numeric keypad using NativeWind
 */

import React from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  className?: string;
}

export function CodeInput({
  value,
  onChange,
  maxLength = 4,
  className,
}: CodeInputProps) {
  const handleKeyPress = (key: string) => {
    if (value.length < maxLength) {
      onChange(value + key);
    }
  };

  const handleBackspace = () => {
    onChange(value.slice(0, -1));
  };

  const keys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["", "0", "back"],
  ];

  return (
    <View className={cn("items-center", className)}>
      {/* Code display boxes */}
      <View className="mb-6 flex-row gap-3">
        {Array.from({ length: maxLength }).map((_, index) => (
          <View
            key={index}
            className={cn(
              "h-[72px] w-[60px] items-center justify-center rounded-lg border-2 bg-secondary",
              value[index] ? "border-primary" : "border-muted-foreground/30",
              index === value.length && "border-primary border-[3px]"
            )}
          >
            <Text className="text-3xl font-bold text-primary">
              {value[index] || ""}
            </Text>
          </View>
        ))}
      </View>

      {/* Numeric keypad */}
      <View className="gap-2">
        {keys.map((row, rowIndex) => (
          <View key={rowIndex} className="flex-row gap-2">
            {row.map((key, keyIndex) => {
              if (key === "") {
                return <View key={keyIndex} className="h-[60px] w-20" />;
              }

              if (key === "back") {
                return (
                  <Pressable
                    key={keyIndex}
                    onPress={handleBackspace}
                    className="h-[60px] w-20 items-center justify-center rounded-lg bg-secondary active:bg-secondary-dark"
                  >
                    <MaterialCommunityIcons
                      name="backspace-outline"
                      size={28}
                      color="#1E293B"
                    />
                  </Pressable>
                );
              }

              return (
                <Pressable
                  key={keyIndex}
                  onPress={() => handleKeyPress(key)}
                  className="h-[60px] w-20 items-center justify-center rounded-lg bg-secondary active:bg-secondary-dark"
                >
                  <Text className="text-2xl font-semibold text-foreground">
                    {key}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}
