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
import { Spacing, BorderRadius } from "../constants/theme";

interface WaterTrackerProps {
  cups: number;
  maxCups?: number;
  onAddCup: () => void;
  onRemoveCup: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function WaterTracker({
  cups,
  maxCups = 8,
  onAddCup,
  onRemoveCup,
}: WaterTrackerProps) {
  const { theme } = useTheme();
  const { isRTL } = useLanguage();
  const addScale = useSharedValue(1);
  const removeScale = useSharedValue(1);

  const addAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addScale.value }],
  }));

  const removeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: removeScale.value }],
  }));

  const handleAddCup = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAddCup();
  };

  const handleRemoveCup = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onRemoveCup();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder }]}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Feather name="droplet" size={20} color={theme.primary} />
        </View>
        <ThemedText type="caption">{isRTL ? "شرب الماء" : "Water Intake"}</ThemedText>
      </View>
      <View style={styles.content}>
        <View style={styles.cupsRow}>
          {Array.from({ length: maxCups }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.cup,
                {
                  backgroundColor: i < cups ? "#4FC3F7" : theme.backgroundSecondary,
                },
              ]}
            />
          ))}
        </View>
        <ThemedText type="body" style={{ color: theme.textSecondary }}>
          {cups}/{maxCups} {isRTL ? "أكواب" : "cups"}
        </ThemedText>
      </View>
      <View style={styles.buttons}>
        <AnimatedPressable
          onPress={handleRemoveCup}
          onPressIn={() => {
            removeScale.value = withSpring(0.9, { damping: 15 });
          }}
          onPressOut={() => {
            removeScale.value = withSpring(1, { damping: 15 });
          }}
          disabled={cups <= 0}
          style={[
            styles.button,
            { backgroundColor: theme.backgroundSecondary, opacity: cups <= 0 ? 0.5 : 1 },
            removeAnimatedStyle,
          ]}
        >
          <Feather name="minus" size={18} color={theme.text} />
        </AnimatedPressable>
        <AnimatedPressable
          onPress={handleAddCup}
          onPressIn={() => {
            addScale.value = withSpring(0.9, { damping: 15 });
          }}
          onPressOut={() => {
            addScale.value = withSpring(1, { damping: 15 });
          }}
          disabled={cups >= maxCups}
          style={[
            styles.button,
            { backgroundColor: theme.primary, opacity: cups >= maxCups ? 0.5 : 1 },
            addAnimatedStyle,
          ]}
        >
          <Feather name="plus" size={18} color="#FFFFFF" />
        </AnimatedPressable>
      </View>
    </View>
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
  content: {
    gap: Spacing.sm,
  },
  cupsRow: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  cup: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
  buttons: {
    flexDirection: "row",
    gap: Spacing.sm,
    justifyContent: "flex-end",
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
});
