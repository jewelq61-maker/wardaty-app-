import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { ThemedText } from "./ThemedText";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";
import { Spacing, BorderRadius, Animations } from "../constants/theme";

interface SleepTrackerProps {
  hours: number | null;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SleepTracker({ hours, onPress }: SleepTrackerProps) {
  const { theme, isDark } = useTheme();
  const { t, isRTL } = useLanguage();
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
    onPress();
  };

  const getSleepQuality = (): { label: string; color: string } => {
    if (!hours || hours === 0) {
      return { label: isRTL ? "سجلي نومك" : "Log sleep", color: theme.textSecondary };
    }
    if (hours >= 7 && hours <= 9) {
      return { label: isRTL ? "جيد" : "Good", color: theme.success };
    }
    if (hours >= 6 && hours < 7) {
      return { label: isRTL ? "متوسط" : "Fair", color: theme.warning };
    }
    if (hours < 6) {
      return { label: isRTL ? "قليل" : "Low", color: theme.error };
    }
    return { label: isRTL ? "طويل" : "Long", color: theme.warning };
  };

  const sleepQuality = getSleepQuality();

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundDefault,
          borderColor: theme.cardBorder,
        },
        animatedStyle,
      ]}
    >
      <View style={[styles.header, isRTL && { flexDirection: "row-reverse" }]}>
        <View style={[styles.iconContainer, { backgroundColor: `${theme.secondary}15` }]}>
          <Feather name="moon" size={18} color={theme.secondary} />
        </View>
        <View style={styles.headerText}>
          <ThemedText type="body" style={{ fontWeight: "600", textAlign: isRTL ? "right" : "left" }}>
            {isRTL ? "النوم" : "Sleep"}
          </ThemedText>
        </View>
        <Feather name={isRTL ? "chevron-left" : "chevron-right"} size={18} color={theme.textSecondary} />
      </View>

      <View style={styles.content}>
        <View style={[styles.hoursRow, isRTL && { flexDirection: "row-reverse" }]}>
          <ThemedText type="h2" style={{ color: theme.text }}>
            {hours ? `${hours}` : "-"}
          </ThemedText>
          <ThemedText type="body" style={{ color: theme.textSecondary, marginLeft: Spacing.xs }}>
            {isRTL ? "ساعات" : "hours"}
          </ThemedText>
        </View>
        <ThemedText type="caption" style={{ color: sleepQuality.color }}>
          {sleepQuality.label}
        </ThemedText>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    gap: Spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.small,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  content: {
    gap: Spacing.xs,
  },
  hoursRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
});
