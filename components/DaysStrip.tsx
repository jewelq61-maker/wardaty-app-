import React from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { ThemedText } from "./ThemedText";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";
import { Spacing, BorderRadius } from "../constants/theme";
import { CycleSettings } from "../lib/types";
import {
  getUpcomingDays,
  getDayOfWeek,
  getCyclePhase,
  getTodayString,
} from "../lib/cycle-utils";

interface DaysStripProps {
  cycleSettings: CycleSettings;
  showFertile: boolean;
  qadhadays?: string[];
  onDayPress?: (date: string) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function DayItem({
  date,
  phase,
  isQadha,
  isToday,
  onPress,
  index,
  isRTL,
}: {
  date: string;
  phase: "period" | "fertile" | "ovulation" | "normal";
  isQadha: boolean;
  isToday: boolean;
  onPress: () => void;
  index: number;
  isRTL: boolean;
}) {
  const { theme, isDark } = useTheme();
  const scale = useSharedValue(1);
  const dayNum = new Date(date).getDate();
  const dayName = getDayOfWeek(date, isRTL);

  const isSpecialPhase = phase === "period" || phase === "fertile" || phase === "ovulation" || isQadha;

  const getBackgroundColor = () => {
    if (isToday && !isSpecialPhase) {
      return isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)";
    }
    if (phase === "period") return `${theme.period}15`;
    if (phase === "fertile" || phase === "ovulation") return `${theme.fertile}15`;
    if (isQadha) return `${theme.qadha}15`;
    return "transparent";
  };

  const getDotColor = () => {
    if (phase === "period") return theme.period;
    if (phase === "fertile" || phase === "ovulation") return theme.fertile;
    if (isQadha) return theme.qadha;
    return "transparent";
  };

  const getTextColor = () => {
    if (phase === "period") return theme.period;
    if (phase === "fertile" || phase === "ovulation") return theme.fertile;
    if (isQadha) return theme.qadha;
    if (isToday) return theme.primary;
    return theme.text;
  };

  const getSecondaryTextColor = () => {
    if (phase === "period") return `${theme.period}99`;
    if (phase === "fertile" || phase === "ovulation") return `${theme.fertile}99`;
    if (isQadha) return `${theme.qadha}99`;
    return theme.textSecondary;
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View entering={FadeIn.delay(index * 30).duration(300)}>
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={() => {
          scale.value = withSpring(0.92, { damping: 15, stiffness: 300 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15, stiffness: 300 });
        }}
        style={[
          styles.dayItem,
          {
            backgroundColor: getBackgroundColor(),
            borderWidth: isToday ? 1.5 : 0,
            borderColor: isToday ? theme.primary : "transparent",
          },
          animatedStyle,
        ]}
      >
        <ThemedText
          type="small"
          style={[styles.dayName, { color: getSecondaryTextColor() }]}
        >
          {dayName}
        </ThemedText>
        <ThemedText
          type="h3"
          style={[styles.dayNumber, { color: getTextColor() }]}
        >
          {dayNum}
        </ThemedText>
        {isSpecialPhase ? (
          <View style={[styles.indicator, { backgroundColor: getDotColor() }]} />
        ) : (
          <View style={styles.indicatorPlaceholder} />
        )}
      </AnimatedPressable>
    </Animated.View>
  );
}

export function DaysStrip({
  cycleSettings,
  showFertile,
  qadhadays = [],
  onDayPress,
}: DaysStripProps) {
  const { isRTL } = useLanguage();
  const days = getUpcomingDays(14);
  const displayDays = isRTL ? [...days].reverse() : days;
  const today = getTodayString();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {displayDays.map((date, index) => {
        let phase = getCyclePhase(date, cycleSettings.lastPeriodStart, cycleSettings);
        if (!showFertile && (phase === "fertile" || phase === "ovulation")) {
          phase = "normal";
        }
        const isQadha = qadhadays.includes(date);
        const isToday = date === today;

        return (
          <DayItem
            key={date}
            date={date}
            phase={phase}
            isQadha={isQadha}
            isToday={isToday}
            index={index}
            isRTL={isRTL}
            onPress={() => onDayPress?.(date)}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    gap: Spacing.xs,
  },
  dayItem: {
    width: 56,
    height: 76,
    borderRadius: BorderRadius.medium,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
  },
  dayName: {
    fontSize: 11,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  dayNumber: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 4,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  indicatorPlaceholder: {
    width: 6,
    height: 6,
  },
});
