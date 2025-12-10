import React from "react";
import { StyleSheet, Pressable, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { AppIcon, AppIconName } from "@/components/AppIcon";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Animations } from "@/constants/theme";

export interface FeatureCardProps {
  title: string;
  subtitle?: string;
  icon: AppIconName;
  iconColor: string;
  onPress?: () => void;
  isRTL?: boolean;
  locked?: boolean;
  children?: React.ReactNode;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FeatureCard({
  title,
  subtitle,
  icon,
  iconColor,
  onPress,
  isRTL = false,
  locked = false,
  children,
  style,
}: FeatureCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(Animations.cardScale, Animations.spring);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, Animations.spring);
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onPress) {
      onPress();
    }
  };

  const cardContent = (
    <>
      <View style={[styles.header, isRTL && styles.headerRTL]}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: iconColor + "15" },
          ]}
        >
          <AppIcon name={icon} size={24} color={iconColor} />
        </View>
        <View style={[styles.titleContainer, isRTL && styles.titleContainerRTL]}>
          <ThemedText type="h4" style={isRTL ? { textAlign: "right" } : undefined}>
            {title}
          </ThemedText>
          {subtitle ? (
            <ThemedText
              type="small"
              style={{ 
                color: locked ? theme.warning : theme.textSecondary,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {subtitle}
            </ThemedText>
          ) : null}
        </View>
      </View>

      {locked ? (
        <View style={[styles.lockBadge, { backgroundColor: theme.warning + "20" }, isRTL && styles.lockBadgeRTL]}>
          <AppIcon name="lock" size={12} color={theme.warning} />
          <ThemedText type="small" style={{ color: theme.warning, marginLeft: 4 }}>
            Plus
          </ThemedText>
        </View>
      ) : null}

      {!locked && children ? <View style={styles.content}>{children}</View> : null}
    </>
  );

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.card,
        {
          backgroundColor: theme.glassBackground,
          borderColor: theme.glassBorder,
          opacity: locked ? 0.7 : 1,
        },
        animatedStyle,
        style,
      ]}
    >
      {cardContent}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  cardOuter: {
    borderRadius: BorderRadius.large,
    overflow: "hidden",
  },
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.large,
    borderWidth: 0.5,
    overflow: "hidden",
  },
  glassCard: {
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  headerRTL: {
    flexDirection: "row-reverse",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.medium,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flex: 1,
    gap: 2,
  },
  titleContainerRTL: {
    alignItems: "flex-end",
  },
  lockBadge: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.small,
  },
  lockBadgeRTL: {
    right: undefined,
    left: Spacing.md,
  },
  content: {
    marginTop: Spacing.md,
  },
});
