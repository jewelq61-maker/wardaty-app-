import React from "react";
import { StyleSheet, Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { ThemedText } from "./ThemedText";
import { useTheme } from "../hooks/useTheme";
import { Spacing, BorderRadius } from "../constants/theme";

interface BeautyStepItemProps {
  step: string;
  isCompleted: boolean;
  onToggle: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function BeautyStepItem({ step, isCompleted, onToggle }: BeautyStepItemProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onToggle}
      onPressIn={() => {
        scale.value = withSpring(0.95, { damping: 15 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15 });
      }}
      style={[
        styles.container,
        {
          backgroundColor: isCompleted
            ? theme.primaryLight + "20"
            : theme.backgroundDefault,
          borderColor: isCompleted ? theme.primary : theme.cardBorder,
        },
        animatedStyle,
      ]}
    >
      <View
        style={[
          styles.checkbox,
          {
            backgroundColor: isCompleted ? theme.primary : theme.backgroundSecondary,
          },
        ]}
      >
        {isCompleted ? <Feather name="check" size={16} color="#FFFFFF" /> : null}
      </View>
      <ThemedText
        type="body"
        style={{
          textDecorationLine: isCompleted ? "line-through" : "none",
          color: isCompleted ? theme.textSecondary : theme.text,
        }}
      >
        {step}
      </ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    gap: Spacing.md,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
