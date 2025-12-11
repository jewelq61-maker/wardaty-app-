import React, { ReactNode } from "react";
import { StyleSheet, Pressable, ViewStyle, StyleProp, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "./ThemedText";
import { useTheme } from "../hooks/useTheme";
import { useLayout } from "../lib/ThemePersonaContext";
import {
  BorderRadius,
  Spacing,
  Animations,
  GlassEffects,
  Shadows,
  Gradients,
} from "../constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface GlassCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  glow?: boolean;
  glowColor?: "primary" | "accent" | "persona";
  noPadding?: boolean;
}

export function GlassCard({
  children,
  title,
  subtitle,
  onPress,
  style,
  disabled = false,
  glow = false,
  glowColor = "primary",
  noPadding = false,
}: GlassCardProps) {
  const { theme } = useTheme();
  const layout = useLayout();
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

  const getGlowShadow = () => {
    if (!glow) return {};
    switch (glowColor) {
      case "accent":
        return Shadows.glowAccent;
      case "persona":
        return {
          ...Shadows.glow,
          shadowColor: theme.personaAccent,
        };
      default:
        return Shadows.glow;
    }
  };

  const cardContent = (
    <>
      {title ? (
        <ThemedText type="h4" style={[styles.glassCardTitle, { textAlign: layout.textAlign }]}>
          {title}
        </ThemedText>
      ) : null}
      {subtitle ? (
        <ThemedText
          type="small"
          style={[styles.glassCardSubtitle, { color: theme.textSecondary, textAlign: layout.textAlign }]}
        >
          {subtitle}
        </ThemedText>
      ) : null}
      {children}
    </>
  );

  const innerContent = (
    <View
      style={[
        styles.glassCardInner,
        noPadding ? null : styles.glassCardPadding,
        { backgroundColor: theme.glassBackground },
      ]}
    >
      {cardContent}
    </View>
  );

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || !onPress}
      style={[
        styles.glassCardOuter,
        {
          opacity: disabled ? 0.5 : 1,
          borderWidth: 1,
          borderColor: theme.glassBorder,
        },
        getGlowShadow(),
        animatedStyle,
        style,
      ]}
    >
      {innerContent}
    </AnimatedPressable>
  );
}

interface FrostedButtonProps {
  onPress?: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  variant?: "primary" | "accent" | "persona" | "glass";
  size?: "small" | "medium" | "large";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

export function FrostedButton({
  onPress,
  children,
  style,
  disabled = false,
  variant = "primary",
  size = "medium",
  icon,
  iconPosition = "left",
}: FrostedButtonProps) {
  const { theme } = useTheme();
  const layout = useLayout();
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

  const getHeight = () => {
    switch (size) {
      case "small":
        return 36;
      case "large":
        return 56;
      default:
        return Spacing.buttonHeight;
    }
  };

  const getPadding = () => {
    switch (size) {
      case "small":
        return Spacing.md;
      case "large":
        return Spacing.xxl;
      default:
        return Spacing.xl;
    }
  };

  const getBackgroundColor = () => {
    switch (variant) {
      case "accent":
        return theme.accent;
      case "persona":
        return theme.personaAccent;
      case "glass":
        return theme.glassBackground;
      default:
        return theme.primary;
    }
  };

  const getTextColor = () => {
    if (variant === "glass") {
      return theme.text;
    }
    return "#FFFFFF";
  };

  const iconContent = icon ? (
    <View
      style={[
        iconPosition === "left" ? styles.iconLeft : styles.iconRight,
        { flexDirection: layout.flexDirection },
      ]}
    >
      {icon}
    </View>
  ) : null;

  if (variant === "glass") {
    const glassInnerContent = (
      <View
        style={[
          styles.frostedButtonInner,
          {
            height: getHeight(),
            paddingHorizontal: getPadding(),
            backgroundColor: theme.glassBackground,
            flexDirection: layout.flexDirection,
          },
        ]}
      >
        {iconPosition === "left" ? iconContent : null}
        <ThemedText type="body" style={[styles.frostedButtonText, { color: getTextColor() }]}>
          {children}
        </ThemedText>
        {iconPosition === "right" ? iconContent : null}
      </View>
    );

    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          styles.frostedButtonOuter,
          {
            opacity: disabled ? 0.5 : 1,
            borderWidth: 1,
            borderColor: theme.glassBorder,
          },
          animatedStyle,
          style,
        ]}
      >
        {glassInnerContent}
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
        styles.frostedButtonOuter,
        styles.frostedButtonInner,
        {
          height: getHeight(),
          paddingHorizontal: getPadding(),
          backgroundColor: getBackgroundColor(),
          opacity: disabled ? 0.5 : 1,
          flexDirection: layout.flexDirection,
        },
        Shadows.glass,
        animatedStyle,
        style,
      ]}
    >
      {iconPosition === "left" ? iconContent : null}
      <ThemedText type="body" style={[styles.frostedButtonText, { color: getTextColor() }]}>
        {children}
      </ThemedText>
      {iconPosition === "right" ? iconContent : null}
    </AnimatedPressable>
  );
}

interface AccentChipProps {
  label: string;
  onPress?: () => void;
  selected?: boolean;
  variant?: "default" | "persona" | "primary" | "accent" | "success" | "warning" | "error";
  size?: "small" | "medium";
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function AccentChip({
  label,
  onPress,
  selected = false,
  variant = "default",
  size = "medium",
  icon,
  style,
}: AccentChipProps) {
  const { theme } = useTheme();
  const layout = useLayout();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.95, Animations.springFast);
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, Animations.springFast);
    }
  };

  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const getBackgroundColor = () => {
    if (selected) {
      switch (variant) {
        case "persona":
          return theme.personaAccent;
        case "primary":
          return theme.primary;
        case "accent":
          return theme.accent;
        case "success":
          return theme.success;
        case "warning":
          return theme.warning;
        case "error":
          return theme.error;
        default:
          return theme.personaAccent;
      }
    }
    switch (variant) {
      case "persona":
        return theme.personaAccentSoft;
      case "primary":
        return theme.primarySoft;
      case "accent":
        return theme.accentSoft;
      case "success":
        return `${theme.success}20`;
      case "warning":
        return `${theme.warning}20`;
      case "error":
        return `${theme.error}20`;
      default:
        return theme.chip;
    }
  };

  const getTextColor = () => {
    if (selected) {
      return "#FFFFFF";
    }
    switch (variant) {
      case "persona":
        return theme.personaAccent;
      case "primary":
        return theme.primary;
      case "accent":
        return theme.accent;
      case "success":
        return theme.success;
      case "warning":
        return theme.warning;
      case "error":
        return theme.error;
      default:
        return theme.personaAccent;
    }
  };

  const isSmall = size === "small";

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={!onPress}
      style={[
        styles.chipContainer,
        {
          backgroundColor: getBackgroundColor(),
          paddingVertical: isSmall ? Spacing.xs : Spacing.sm,
          paddingHorizontal: isSmall ? Spacing.sm : Spacing.md,
          flexDirection: layout.flexDirection,
        },
        animatedStyle,
        style,
      ]}
    >
      {icon ? <View style={styles.chipIcon}>{icon}</View> : null}
      <ThemedText
        type={isSmall ? "small" : "caption"}
        style={{ color: getTextColor() }}
      >
        {label}
      </ThemedText>
    </AnimatedPressable>
  );
}

interface GradientSurfaceProps {
  children: React.ReactNode;
  variant?: "card" | "cardGlow" | "background" | "glass";
  style?: StyleProp<ViewStyle>;
}

export function GradientSurface({
  children,
  variant = "card",
  style,
}: GradientSurfaceProps) {
  const gradientColors = (() => {
    switch (variant) {
      case "cardGlow":
        return Gradients.cardGlow;
      case "background":
        return Gradients.background;
      case "glass":
        return Gradients.glass;
      default:
        return Gradients.card;
    }
  })();

  return (
    <LinearGradient
      colors={[...gradientColors]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradientSurface, style]}
    >
      {children}
    </LinearGradient>
  );
}

interface ThemedSurfaceProps {
  children: React.ReactNode;
  elevation?: "default" | "elevated" | "secondary" | "tertiary" | "glass";
  style?: StyleProp<ViewStyle>;
}

export function ThemedSurface({
  children,
  elevation = "default",
  style,
}: ThemedSurfaceProps) {
  const { theme } = useTheme();

  const getBackgroundColor = () => {
    switch (elevation) {
      case "elevated":
        return theme.backgroundElevated;
      case "secondary":
        return theme.backgroundSecondary;
      case "tertiary":
        return theme.backgroundTertiary;
      case "glass":
        return theme.glassBackground;
      default:
        return theme.backgroundDefault;
    }
  };

  return (
    <View style={[styles.surface, { backgroundColor: getBackgroundColor() }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  glassCardOuter: {
    borderRadius: BorderRadius.large,
    overflow: "hidden",
  },
  glassCardInner: {
    borderRadius: BorderRadius.large - GlassEffects.light.borderWidth,
    overflow: "hidden",
  },
  glassCardPadding: {
    padding: Spacing.xl,
  },
  glassCardTitle: {
    marginBottom: Spacing.xs,
  },
  glassCardSubtitle: {
    marginBottom: Spacing.sm,
  },
  frostedButtonOuter: {
    borderRadius: BorderRadius.medium,
    overflow: "hidden",
  },
  frostedButtonInner: {
    borderRadius: BorderRadius.medium - GlassEffects.light.borderWidth,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  frostedButtonText: {
    fontWeight: "600",
    fontSize: 16,
  },
  iconLeft: {
    marginRight: Spacing.sm,
  },
  iconRight: {
    marginLeft: Spacing.sm,
  },
  chipContainer: {
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  chipIcon: {
    marginRight: Spacing.xs,
  },
  gradientSurface: {
    borderRadius: BorderRadius.large,
  },
  surface: {
    borderRadius: BorderRadius.medium,
  },
});
