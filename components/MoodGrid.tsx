import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeInDown,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { Spacing, BorderRadius } from "@/constants/theme";
import { Mood } from "@/lib/types";

interface MoodGridProps {
  selectedMood?: Mood;
  onMoodSelect: (mood: Mood) => void;
}

interface MoodOption {
  id: Mood;
  icon: keyof typeof Feather.glyphMap;
  labelEn: string;
  labelAr: string;
  color: string;
}

const MOODS: MoodOption[] = [
  { id: "great", icon: "smile", labelEn: "Great", labelAr: "رائع", color: "#34C759" },
  { id: "good", icon: "smile", labelEn: "Good", labelAr: "جيد", color: "#8C64F0" },
  { id: "okay", icon: "meh", labelEn: "Okay", labelAr: "عادي", color: "#FF9500" },
  { id: "bad", icon: "frown", labelEn: "Bad", labelAr: "سيء", color: "#FF6B9D" },
  { id: "terrible", icon: "frown", labelEn: "Terrible", labelAr: "سيء جداً", color: "#FF3860" },
  { id: "anxious", icon: "alert-circle", labelEn: "Anxious", labelAr: "قلقة", color: "#BA68C8" },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function MoodPill({
  mood,
  isSelected,
  onPress,
}: {
  mood: MoodOption;
  isSelected: boolean;
  onPress: () => void;
}) {
  const { theme, isDark } = useTheme();
  const { isRTL } = useLanguage();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={() => {
        scale.value = withSpring(0.92, { damping: 15 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15 });
      }}
      style={[
        styles.moodPill,
        {
          backgroundColor: isSelected ? mood.color : isDark ? theme.backgroundSecondary : theme.backgroundElevated,
          borderWidth: 1,
          borderColor: isSelected ? mood.color : theme.border,
        },
        animatedStyle,
      ]}
    >
      <Feather
        name={mood.icon}
        size={20}
        color={isSelected ? "#FFFFFF" : theme.textSecondary}
      />
      <ThemedText
        type="caption"
        style={{
          color: isSelected ? "#FFFFFF" : theme.text,
          fontWeight: isSelected ? "600" : "500",
          textAlign: "center",
        }}
      >
        {isRTL ? mood.labelAr : mood.labelEn}
      </ThemedText>
    </AnimatedPressable>
  );
}

export function MoodGrid({ selectedMood, onMoodSelect }: MoodGridProps) {
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();

  return (
    <Animated.View entering={FadeInDown.delay(250).springify()} style={styles.container}>
      <ThemedText
        type="h3"
        style={[styles.sectionTitle, isRTL && { textAlign: "right" }]}
      >
        {isRTL ? "كيف حالك اليوم؟" : "How are you feeling?"}
      </ThemedText>
      <View style={[styles.grid, isRTL && { flexDirection: "row-reverse" }]}>
        {MOODS.map((mood) => (
          <MoodPill
            key={mood.id}
            mood={mood}
            isSelected={selectedMood === mood.id}
            onPress={() => onMoodSelect(mood.id)}
          />
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    justifyContent: "space-between",
  },
  moodPill: {
    width: "31%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.large,
  },
});
