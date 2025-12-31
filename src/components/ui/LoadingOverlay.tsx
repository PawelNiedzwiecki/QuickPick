/**
 * LoadingOverlay Component
 * Full-screen loading indicator with NativeWind
 */

import React from "react";
import { View, Text, Modal, ActivityIndicator } from "react-native";
import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  className?: string;
}

export function LoadingOverlay({
  visible,
  message = "Loading...",
  className,
}: LoadingOverlayProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        className={cn(
          "flex-1 items-center justify-center bg-black/50",
          className
        )}
      >
        <View className="items-center gap-4 rounded-xl bg-white p-8">
          <ActivityIndicator size="large" color="#22C55E" />
          <Text className="text-base text-foreground">{message}</Text>
        </View>
      </View>
    </Modal>
  );
}
