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
import { Mood } from "../lib/types";

interface MoodTrackerProps {
  selectedMood?: Mood;
  onMoodSelect: (mood: Mood) => void;
  hideLabel?: boolean;
}

const moodsEn: { id: Mood; icon: keyof typeof Feather.glyphMap; label: string }[] = [
  { id: "great", icon: "smile", label: "Great" },
  { id: "good", icon: "meh", label: "Good" },
  { id: "okay", icon: "meh", label: "Okay" },
  { id: "bad", icon: "frown", label: "Bad" },
  { id: "terrible", icon: "frown", label: "Terrible" },
  { id: "anxious", icon: "alert-circle", label: "Anxious" },
];

const moodsAr: { id: Mood; icon: keyof typeof Feather.glyphMap; label: string }[] = [
  { id: "great", icon: "smile", label: "ممتاز" },
  { id: "good", icon: "meh", label: "جيد" },
  { id: "okay", icon: "meh", label: "عادي" },
  { id: "bad", icon: "frown", label: "سيء" },
  { id: "terrible", icon: "frown", label: "سيء جداً" },
  { id: "anxious", icon: "alert-circle", label: "قلقة" },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function MoodButton({
  mood,
  isSelected,
  onPress,
}: {
  mood: (typeof moods)[0];
  isSelected: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getMoodColor = () => {
    switch (mood.id) {
      case "great":
        return theme.success;
      case "good":
        return theme.primaryLight;
      case "okay":
        return theme.warning;
      case "bad":
        return theme.error;
      case "terrible":
        return theme.error;
      case "anxious":
        return theme.secondary;
      default:
        return theme.textSecondary;
    }
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={() => {
        scale.value = withSpring(0.85, { damping: 15 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15 });
      }}
      style={[
        styles.moodButton,
        {
          backgroundColor: isSelected ? getMoodColor() : theme.backgroundSecondary,
        },
        animatedStyle,
      ]}
    >
      <Feather
        name={mood.icon}
        size={24}
        color={isSelected ? "#FFFFFF" : theme.textSecondary}
      />
    </AnimatedPressable>
  );
}

export function MoodTracker({ selectedMood, onMoodSelect, hideLabel = false }: MoodTrackerProps) {
  const { theme } = useTheme();
  const { isRTL } = useLanguage();
  const moods = isRTL ? moodsAr : moodsEn;

  return (
    <View style={styles.container}>
      {!hideLabel ? (
        <ThemedText type="caption" style={[styles.label, isRTL && { textAlign: "right" }]}>
          {isRTL ? "كيف حالك اليوم؟" : "How are you feeling?"}
        </ThemedText>
      ) : null}
      <View style={[styles.moodRow, isRTL && { flexDirection: "row-reverse" }]}>
        {moods.map((mood) => (
          <MoodButton
            key={mood.id}
            mood={mood}
            isSelected={selectedMood === mood.id}
            onPress={() => onMoodSelect(mood.id)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  label: {
    marginBottom: Spacing.xs,
  },
  moodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  moodButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
});
