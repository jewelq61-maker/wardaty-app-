import React, { useMemo } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { ThemedText } from "@/components/ThemedText";
import { DarkTheme, PersonaColors, CycleColors, Spacing, getPersonaGlow } from "@/constants/theme";
import { Persona } from "@/lib/types";

interface CycleRingDotsProps {
  cycleDay: number;
  cycleLength?: number;
  periodLength?: number;
  persona: Persona;
  onDaySelect?: (day: number) => void;
}

const DOT_COUNT = 28;
const RING_SIZE = 280;
const DOT_SIZE = 8;
const SELECTED_DOT_SIZE = 16;
const CENTER_SIZE = 180;

export function CycleRingDots({
  cycleDay,
  cycleLength = 28,
  periodLength = 5,
  persona,
  onDaySelect,
}: CycleRingDotsProps) {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  const personaColor = PersonaColors[persona].primary;
  const personaGlow = getPersonaGlow(persona);

  // Calculate dot colors based on cycle phase
  const getDotColor = (day: number): string => {
    if (day <= periodLength) {
      return CycleColors.period;
    } else if (day >= 12 && day <= 16) {
      // Fertile window
      return CycleColors.fertile;
    } else if (day === 14) {
      // Ovulation
      return CycleColors.ovulation;
    } else {
      return DarkTheme.border.default;
    }
  };

  // Generate dots
  const dots = useMemo(() => {
    const result = [];
    for (let i = 1; i <= DOT_COUNT; i++) {
      const angle = ((i - 1) / DOT_COUNT) * 2 * Math.PI - Math.PI / 2;
      const x = (RING_SIZE / 2) * Math.cos(angle);
      const y = (RING_SIZE / 2) * Math.sin(angle);
      const isToday = i === cycleDay;
      const color = getDotColor(i);

      result.push({
        day: i,
        x,
        y,
        isToday,
        color,
      });
    }
    return result;
  }, [cycleDay, periodLength]);

  // Pan gesture for rotation
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      const angle = Math.atan2(e.translationY, e.translationX);
      rotation.value = angle;
    })
    .onEnd(() => {
      rotation.value = withSpring(0);
    });

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}rad` },
      { scale: scale.value },
    ],
  }));

  const handleDotPress = (day: number) => {
    scale.value = withTiming(0.95, { duration: 100 }, () => {
      scale.value = withSpring(1);
    });
    onDaySelect?.(day);
  };

  return (
    <View style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.ringContainer, animatedContainerStyle]}>
          {/* Dots */}
          {dots.map((dot) => {
            const dotSize = dot.isToday ? SELECTED_DOT_SIZE : DOT_SIZE;
            const dotStyle = {
              position: "absolute" as const,
              left: RING_SIZE / 2 + dot.x - dotSize / 2,
              top: RING_SIZE / 2 + dot.y - dotSize / 2,
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: dot.isToday ? personaColor : dot.color,
            };

            return (
              <Pressable
                key={dot.day}
                onPress={() => handleDotPress(dot.day)}
                style={({ pressed }) => [
                  dotStyle,
                  dot.isToday && personaGlow,
                  pressed && { opacity: 0.7 },
                ]}
              />
            );
          })}

          {/* Center content */}
          <View style={styles.center}>
            <ThemedText type="h1" style={styles.dayNumber}>
              {cycleDay}
            </ThemedText>
            <ThemedText type="caption" style={styles.dayLabel}>
              Day
            </ThemedText>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: RING_SIZE + 40,
    height: RING_SIZE + 40,
    alignItems: "center",
    justifyContent: "center",
  },
  ringContainer: {
    width: RING_SIZE + 40,
    height: RING_SIZE + 40,
    position: "relative",
  },
  center: {
    position: "absolute",
    left: (RING_SIZE + 40 - CENTER_SIZE) / 2,
    top: (RING_SIZE + 40 - CENTER_SIZE) / 2,
    width: CENTER_SIZE,
    height: CENTER_SIZE,
    borderRadius: CENTER_SIZE / 2,
    backgroundColor: DarkTheme.background.card,
    borderWidth: 1,
    borderColor: DarkTheme.border.subtle,
    alignItems: "center",
    justifyContent: "center",
  },
  dayNumber: {
    fontSize: 64,
    fontWeight: "700",
    color: DarkTheme.text.primary,
  },
  dayLabel: {
    fontSize: 14,
    color: DarkTheme.text.secondary,
    marginTop: Spacing.xs,
  },
});
