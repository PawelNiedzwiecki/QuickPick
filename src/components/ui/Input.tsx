/**
 * Input Component
 * shadcn/ui style input with NativeWind
 */

import React from "react";
import { TextInput, View, Text, TextInputProps } from "react-native";
import { cn } from "@/lib/utils";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  className?: string;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  className,
  containerClassName,
  ...props
}: InputProps) {
  return (
    <View className={cn("w-full", containerClassName)}>
      {label && (
        <Text className="mb-2 text-sm font-medium text-foreground">
          {label}
        </Text>
      )}
      <TextInput
        className={cn(
          "h-12 w-full rounded-md border border-input bg-background px-4 text-base text-foreground",
          "focus:border-ring focus:ring-1 focus:ring-ring",
          error && "border-destructive",
          className
        )}
        placeholderTextColor="#94A3B8"
        {...props}
      />
      {error && (
        <Text className="mt-1 text-sm text-destructive">{error}</Text>
      )}
    </View>
  );
}
