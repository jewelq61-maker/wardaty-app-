import React from "react";
import { StyleSheet, Pressable, ViewStyle, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "./ThemedText";
import { useTheme } from "../hooks/useTheme";
import { Spacing, BorderRadius, Animations, GlassEffects } from "../constants/theme";

interface CardProps {
  elevation?: number;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  glass?: boolean;
  glow?: boolean;
  gradientBorder?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Card({
  elevation = 1,
  title,
  description,
  children,
  onPress,
  style,
  disabled = false,
  glass = true,
  glow = false,
  gradientBorder = true,
}: CardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress && !disabled) {
      scale.value = withSpring(Animations.cardScale, Animations.spring);
    }
  };

  const handlePressOut = () => {
    if (onPress && !disabled) {
      scale.value = withSpring(1, Animations.spring);
    }
  };

  const handlePress = () => {
    if (onPress && !disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const cardContent = (
    <>
      {title ? (
        <ThemedText type="h4" style={styles.cardTitle}>
          {title}
        </ThemedText>
      ) : null}
      {description ? (
        <ThemedText type="small" style={[styles.cardDescription, { color: theme.textSecondary }]}>
          {description}
        </ThemedText>
      ) : null}
      {children}
    </>
  );

  const innerContent = (
    <View
      style={[
        styles.cardInner,
        {
          backgroundColor: glass ? theme.glassBackground : theme.backgroundSecondary,
        },
      ]}
    >
      <View style={styles.contentWrapper}>
        {cardContent}
      </View>
    </View>
  );

  if (gradientBorder) {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || !onPress}
        style={[
          styles.cardOuter,
          { 
            opacity: disabled ? 0.5 : 1,
            borderWidth: 1,
            borderColor: theme.cardBorder,
          },
          animatedStyle,
          style,
        ]}
      >
        {innerContent}
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || !onPress}
      style={[
        styles.cardOuter,
        { opacity: disabled ? 0.5 : 1 },
        animatedStyle,
        style,
      ]}
    >
      {innerContent}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  cardOuter: {
    borderRadius: BorderRadius.large,
    overflow: "hidden",
  },
  cardInner: {
    borderRadius: BorderRadius.large - GlassEffects.light.borderWidth,
    overflow: "hidden",
    position: "relative",
  },
  contentWrapper: {
    padding: Spacing.xxl,
    position: "relative",
    zIndex: 1,
  },
  cardTitle: {
    marginBottom: Spacing.xs,
  },
  cardDescription: {
    marginBottom: Spacing.sm,
  },
});
