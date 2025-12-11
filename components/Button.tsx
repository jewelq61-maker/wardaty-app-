import React, { ReactNode } from "react";
import { StyleSheet, Pressable, ViewStyle, StyleProp } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import {
  BorderRadius,
  Spacing,
  Animations,
} from "@/constants/theme";

interface ButtonProps {
  onPress?: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline" | "text" | "pill";
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  onPress,
  children,
  style,
  disabled = false,
  variant = "primary",
}: ButtonProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(Animations.buttonScale, Animations.spring);
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      scale.value = withSpring(1, Animations.spring);
    }
  };

  const handlePress = () => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress?.();
    }
  };

  if (variant === "primary") {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          styles.buttonWrapper,
          styles.primaryButton,
          { 
            backgroundColor: theme.personaAccent,
            opacity: disabled ? 0.5 : 1,
          },
          style,
          animatedStyle,
        ]}
      >
        <ThemedText
          type="body"
          style={[styles.buttonText, { color: "#FFFFFF" }]}
        >
          {children}
        </ThemedText>
      </AnimatedPressable>
    );
  }

  if (variant === "pill") {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          styles.buttonWrapper,
          styles.pillButton,
          { 
            backgroundColor: theme.personaAccent,
            shadowColor: theme.personaAccentLight,
            opacity: disabled ? 0.5 : 1,
          },
          style,
          animatedStyle,
        ]}
      >
        <ThemedText
          type="body"
          style={[styles.buttonText, { color: "#FFFFFF" }]}
        >
          {children}
        </ThemedText>
      </AnimatedPressable>
    );
  }

  if (variant === "secondary") {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          styles.buttonWrapper,
          styles.secondaryButton,
          { 
            backgroundColor: theme.backgroundDefault,
            borderColor: theme.primary,
            opacity: disabled ? 0.5 : 1,
          },
          style,
          animatedStyle,
        ]}
      >
        <ThemedText
          type="body"
          style={[styles.buttonText, { color: theme.primary }]}
        >
          {children}
        </ThemedText>
      </AnimatedPressable>
    );
  }

  if (variant === "outline") {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          styles.buttonWrapper,
          styles.outlineButton,
          { 
            backgroundColor: "transparent",
            borderColor: theme.primary,
            opacity: disabled ? 0.5 : 1,
          },
          style,
          animatedStyle,
        ]}
      >
        <ThemedText
          type="body"
          style={[styles.buttonText, { color: theme.primary }]}
        >
          {children}
        </ThemedText>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.textButton,
        { opacity: disabled ? 0.5 : 1 },
        style,
        animatedStyle,
      ]}
    >
      <ThemedText
        type="body"
        style={[styles.buttonText, { color: theme.primary }]}
      >
        {children}
      </ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.medium,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  primaryButton: {
    borderRadius: BorderRadius.medium,
  },
  pillButton: {
    borderRadius: 999,
    paddingHorizontal: Spacing.xxxl,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  secondaryButton: {
    borderWidth: 2,
    borderRadius: BorderRadius.medium,
  },
  outlineButton: {
    borderWidth: 2,
    borderRadius: BorderRadius.medium,
  },
  textButton: {
    height: Spacing.buttonHeight,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.md,
  },
  buttonText: {
    ...Theme.typography.callout,
    fontWeight: "600",
  },
});
