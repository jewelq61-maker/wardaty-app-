import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { View, StyleSheet, Pressable, Dimensions } from "react-native";
import Svg, { Circle, G, Defs, RadialGradient, Stop, Path } from "react-native-svg";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
  withRepeat,
  interpolate,
  runOnJS,
  Easing,
  FadeIn,
} from "react-native-reanimated";
import { ThemedText } from "./ThemedText";
import { useApp } from "../lib/AppContext";
import { useLanguage } from "../hooks/useLanguage";
import { useThemePersona } from "../lib/ThemePersonaContext";
import { Spacing, Animations, DarkTheme, getPersonaColor } from "../constants/theme";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import {
  getDateForCycleDay,
  getPhaseForCycleDay,
  formatDateForRing,
  getTodayString,
  DetailedCyclePhase,
} from "../lib/cycle-utils";

const AnimatedView = Animated.View;
const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface CycleRingProps {
  currentDay: number | null;
  cycleLength: number;
  periodLength: number;
  showFertile?: boolean;
  daysUntilNextPeriod: number | null;
  size?: number;
  onPeriodEndedPress?: () => void;
  onEditPeriod?: () => void;
  lastPeriodStart?: string | null;
  externalSelectedDate?: string | null;
  onDateChange?: (date: string) => void;
}

const PHASE_LABELS: Record<DetailedCyclePhase, { en: string; ar: string }> = {
  period: { en: "Period", ar: "فترة الدورة" },
  follicular: { en: "Follicular", ar: "المرحلة الجريبية" },
  fertile: { en: "Fertile Window", ar: "فترة الخصوبة" },
  ovulation: { en: "Ovulation", ar: "يوم الإباضة" },
  luteal: { en: "Luteal Phase", ar: "المرحلة الأصفرية" },
};

function getThemeLightPhaseColor(phase: DetailedCyclePhase, personaMain: string): string {
  // For now, always use dark theme colors
  switch (phase) {
    case "period":
      return "#FF6B9D";
    case "fertile":
      return "#7EC8E3";
    case "ovulation":
      return "#A684F5";
    case "follicular":
      return "#FFB8D9";
    case "luteal":
      return personaMain;
    default:
      return personaMain;
  }
}

function getThemePhaseColor(phase: DetailedCyclePhase, isDark: boolean, personaMain: string): string {
  if (!isDark) {
    return getThemeLightPhaseColor(phase, personaMain);
  }
  // Dark theme colors
  switch (phase) {
    case "period":
      return "#FF6B9D";
    case "fertile":
      return "#7EC8E3";
    case "ovulation":
      return "#A684F5";
    case "follicular":
      return "#FFB8D9";
    case "luteal":
      return personaMain;
    default:
      return personaMain;
  }
}

interface DotProps {
  day: number;
  angle: number;
  radius: number;
  center: number;
  phase: DetailedCyclePhase;
  isToday: boolean;
  isSelected: boolean;
  isDark: boolean;
  personaMain: string;
  showFertile: boolean;
  dotBaseSize: number;
  onPress: (day: number) => void;
}

function CycleDot({
  day,
  angle,
  radius,
  center,
  phase,
  isToday,
  isSelected,
  isDark,
  personaMain,
  showFertile,
  dotBaseSize,
  onPress,
}: DotProps) {
  const scale = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  
  const x = center + radius * Math.cos(angle);
  const y = center + radius * Math.sin(angle);
  
  useEffect(() => {
    scale.value = withDelay(
      day * 25,
      withSpring(1, { damping: 12, stiffness: 200 })
    );
    
    if (isToday || isSelected) {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.4, { duration: 1200, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }
  }, [day, isToday, isSelected]);
  
  useEffect(() => {
    if (isSelected) {
      scale.value = withSequence(
        withSpring(1.3, { damping: 10, stiffness: 300 }),
        withSpring(1, { damping: 12, stiffness: 200 })
      );
    }
  }, [isSelected]);
  
  const getDotColor = () => {
    if (phase === "period") {
      return isDark ? "#FF6B9D" : "#FF8FB5";
    }
    if (phase === "fertile" && showFertile) {
      return isDark ? "#B794F6" : "#D4B9FF";
    }
    if (phase === "ovulation" && showFertile) {
      return isDark ? "#C67BFF" : "#B794F6";
    }
    return isDark ? "rgba(255, 255, 255, 0.25)" : "rgba(140, 100, 240, 0.25)";
  };
  
  const getDotSize = () => {
    if (isSelected) return dotBaseSize * 1.6;
    if (isToday) return dotBaseSize * 1.4;
    if (phase === "ovulation" && showFertile) return dotBaseSize * 1.3;
    if (phase === "period" || (phase === "fertile" && showFertile)) return dotBaseSize * 1.1;
    return dotBaseSize;
  };
  
  const dotColor = getDotColor();
  const dotSize = getDotSize();
  const isSpecialDot = phase === "ovulation" && showFertile;
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: interpolate(glowOpacity.value, [0.4, 1], [1, 1.5]) }],
  }));
  
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(day);
  };
  
  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.dotTouchable,
        {
          left: x - dotBaseSize * 1.5,
          top: y - dotBaseSize * 1.5,
          width: dotBaseSize * 3,
          height: dotBaseSize * 3,
        },
      ]}
    >
      {(isToday || isSelected) ? (
        <AnimatedView
          style={[
            styles.dotGlow,
            glowStyle,
            {
              width: dotSize * 2.5,
              height: dotSize * 2.5,
              borderRadius: dotSize * 1.25,
              backgroundColor: dotColor,
            },
          ]}
        />
      ) : null}
      
      <AnimatedView
        style={[
          animatedStyle,
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            borderRadius: isSpecialDot ? dotSize * 0.35 : dotSize / 2,
            backgroundColor: dotColor,
            borderWidth: isSelected ? 2 : 0,
            borderColor: isDark ? "#FFFFFF" : "#FFFFFF",
            transform: isSpecialDot ? [{ rotate: "45deg" }] : [],
          },
          isSelected && {
            shadowColor: dotColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 12,
          },
        ]}
      />
    </Pressable>
  );
}

export function CycleRing({
  currentDay,
  cycleLength,
  periodLength,
  showFertile = false,
  size = 280,
  onEditPeriod,
  lastPeriodStart = null,
  daysUntilNextPeriod,
  externalSelectedDate = null,
  onDateChange,
}: CycleRingProps) {
  const { data } = useApp();
  const { isRTL } = useLanguage();
  const { persona } = useThemePersona();
  const personaColor = getPersonaColor(persona);
  const isDark = true; // Always dark theme
  
  const responsiveSize = Math.min(size, SCREEN_WIDTH - 60);
  const dotBaseSize = Math.max(8, Math.min(12, responsiveSize / 28));
  const ringRadius = (responsiveSize - dotBaseSize * 4) / 2;
  const svgSize = responsiveSize + 40;
  const center = svgSize / 2;
  
  const ringScale = useSharedValue(0.9);
  const ringOpacity = useSharedValue(0);
  
  const [selectedDay, setSelectedDay] = useState<number | null>(currentDay);
  const [isManualSelection, setIsManualSelection] = useState(false);
  
  const selectedDayShared = useSharedValue(currentDay ?? 1);
  const lastCalculatedDay = useSharedValue(currentDay ?? 1);
  
  const contentScale = useSharedValue(1);
  const contentOpacity = useSharedValue(1);
  const contentTranslateY = useSharedValue(0);

  const personaAccent = useMemo(() => ({
    main: personaColor.primary,
    light: personaColor.light,
    dark: personaColor.dark,
    soft: personaColor.soft,
  }), [personaColor]);

  useEffect(() => {
    ringScale.value = withDelay(100, withSpring(1, Animations.springBouncy));
    ringOpacity.value = withDelay(50, withTiming(1, { duration: 400 }));
  }, []);
  
  useEffect(() => {
    if (currentDay !== null && !isManualSelection) {
      setSelectedDay(currentDay);
      selectedDayShared.value = currentDay;
    }
  }, [currentDay, isManualSelection]);

  const ringAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  const displayDay = selectedDay !== null ? selectedDay : currentDay;
  
  const phaseInfo = useMemo(() => {
    if (displayDay === null) {
      return {
        phase: "follicular" as DetailedCyclePhase,
        color: personaAccent.main,
        label: isRTL ? "ابدأي التتبع" : "Start Tracking",
      };
    }
    
    const { phase } = getPhaseForCycleDay(displayDay, cycleLength, periodLength, showFertile);
    const themeColor = getThemePhaseColor(phase, isDark, personaAccent.main);
    
    return {
      phase,
      color: themeColor,
      label: isRTL ? PHASE_LABELS[phase].ar : PHASE_LABELS[phase].en,
    };
  }, [displayDay, cycleLength, periodLength, showFertile, isDark, isRTL, personaAccent]);

  const animateContentChange = useCallback(() => {
    contentScale.value = withSequence(
      withSpring(0.92, { damping: 15, stiffness: 300 }),
      withSpring(1, { damping: 12, stiffness: 200 })
    );
    contentOpacity.value = withSequence(
      withTiming(0.5, { duration: 80 }),
      withTiming(1, { duration: 250 })
    );
    contentTranslateY.value = withSequence(
      withSpring(-8, { damping: 15, stiffness: 300 }),
      withSpring(0, { damping: 12, stiffness: 200 })
    );
  }, []);

  const previousDayRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (previousDayRef.current !== null && previousDayRef.current !== displayDay) {
      animateContentChange();
    }
    previousDayRef.current = displayDay;
  }, [displayDay]);

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: contentScale.value },
      { translateY: contentTranslateY.value },
    ],
    opacity: contentOpacity.value,
  }));

  const displayDate = useMemo(() => {
    if (externalSelectedDate) {
      return formatDateForRing(externalSelectedDate, isRTL);
    }
    if (displayDay === null || !lastPeriodStart) {
      return formatDateForRing(getTodayString(), isRTL);
    }
    const dateStr = getDateForCycleDay(displayDay, lastPeriodStart, cycleLength);
    return dateStr ? formatDateForRing(dateStr, isRTL) : formatDateForRing(getTodayString(), isRTL);
  }, [displayDay, lastPeriodStart, cycleLength, isRTL, externalSelectedDate]);
  
  useEffect(() => {
    if (externalSelectedDate && lastPeriodStart) {
      const externalDate = new Date(externalSelectedDate);
      const periodStart = new Date(lastPeriodStart);
      const diffDays = Math.floor((externalDate.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24));
      const cycleDay = (diffDays % cycleLength) + 1;
      if (cycleDay >= 1 && cycleDay <= cycleLength) {
        setSelectedDay(cycleDay);
        selectedDayShared.value = withSpring(cycleDay, { damping: 12, stiffness: 200 });
      }
    }
  }, [externalSelectedDate, lastPeriodStart, cycleLength]);

  const updateSelectedDay = useCallback((day: number) => {
    setSelectedDay(day);
    setIsManualSelection(true);
    
    if (onDateChange && lastPeriodStart) {
      const dateStr = getDateForCycleDay(day, lastPeriodStart, cycleLength);
      if (dateStr) {
        onDateChange(dateStr);
      }
    }
  }, [onDateChange, lastPeriodStart, cycleLength]);

  const resetToToday = useCallback(() => {
    if (currentDay !== null) {
      setSelectedDay(currentDay);
      setIsManualSelection(false);
      selectedDayShared.value = withSpring(currentDay, { damping: 12, stiffness: 200 });
      
      if (onDateChange) {
        onDateChange(getTodayString());
      }
    }
  }, [currentDay, onDateChange]);

  const calculateDayFromPosition = (touchX: number, touchY: number): number => {
    'worklet';
    const dx = touchX - center;
    const dy = touchY - center;
    
    let angle = Math.atan2(dy, dx);
    angle = angle * (180 / Math.PI);
    angle = angle + 90;
    
    if (angle < 0) {
      angle = angle + 360;
    }
    
    const effectiveAngle = isRTL ? ((360 - angle) % 360) : angle;
    
    let day = Math.round((effectiveAngle / 360) * cycleLength) + 1;
    
    if (day < 1) day = 1;
    if (day > cycleLength) day = cycleLength;
    
    return day;
  };

  const setDraggingState = useCallback((dragging: boolean) => {
    if (dragging) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const panGesture = Gesture.Pan()
    .onBegin((event) => {
      'worklet';
      runOnJS(setDraggingState)(true);
      const day = calculateDayFromPosition(event.x, event.y);
      selectedDayShared.value = day;
      lastCalculatedDay.value = day;
      runOnJS(updateSelectedDay)(day);
    })
    .onUpdate((event) => {
      'worklet';
      const day = calculateDayFromPosition(event.x, event.y);
      selectedDayShared.value = day;
      if (day !== lastCalculatedDay.value) {
        lastCalculatedDay.value = day;
        runOnJS(updateSelectedDay)(day);
      }
    })
    .onEnd(() => {
      'worklet';
      selectedDayShared.value = withSpring(selectedDayShared.value, { damping: 12, stiffness: 200 });
      runOnJS(setDraggingState)(false);
    })
    .onFinalize(() => {
      'worklet';
      runOnJS(setDraggingState)(false);
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      'worklet';
      runOnJS(resetToToday)();
    });

  const longPressGesture = Gesture.LongPress()
    .minDuration(500)
    .onEnd(() => {
      'worklet';
      if (onEditPeriod) {
        runOnJS(onEditPeriod)();
      }
    });

  const composedGesture = Gesture.Simultaneous(
    panGesture,
    Gesture.Exclusive(longPressGesture, doubleTapGesture)
  );

  const dots = useMemo(() => {
    const result = [];
    for (let day = 1; day <= cycleLength; day++) {
      const baseAngle = isRTL 
        ? ((-(day - 1) / cycleLength) * 360 - 90) 
        : (((day - 1) / cycleLength) * 360 - 90);
      const angle = baseAngle * (Math.PI / 180);
      
      let { phase } = getPhaseForCycleDay(day, cycleLength, periodLength, showFertile);
      if (!showFertile && (phase === "fertile" || phase === "ovulation")) {
        phase = "follicular";
      }
      
      result.push({
        day,
        angle,
        phase,
      });
    }
    return result;
  }, [cycleLength, periodLength, showFertile, isRTL]);

  const handleDotPress = useCallback((day: number) => {
    updateSelectedDay(day);
  }, [updateSelectedDay]);

  const glassBackground = isDark ? "rgba(30, 20, 50, 0.6)" : "rgba(255, 255, 255, 0.65)";
  const glassBorder = isDark ? "rgba(140, 100, 240, 0.3)" : "rgba(140, 100, 240, 0.15)";
  const lightModeCardShadow = !isDark ? {
    shadowColor: "#A684F5",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
  } : {};
  
  const centerCardSize = ringRadius * 1.3;

  return (
    <View style={styles.container}>
      <AnimatedView style={[styles.ringContainer, ringAnimatedStyle]}>
        <GestureDetector gesture={composedGesture}>
          <View style={[styles.svgContainer, { width: svgSize, height: svgSize }]}>
            <Svg width={svgSize} height={svgSize} style={styles.backgroundSvg}>
              <Defs>
                <RadialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor={isDark ? personaAccent.main : "#D4B9FF"} stopOpacity={isDark ? 0.15 : 0.2} />
                  <Stop offset="70%" stopColor={isDark ? personaAccent.main : "#FFB7D6"} stopOpacity={isDark ? 0.05 : 0.1} />
                  <Stop offset="100%" stopColor="transparent" stopOpacity={0} />
                </RadialGradient>
              </Defs>
              <Circle cx={center} cy={center} r={ringRadius + dotBaseSize * 2} fill="url(#bgGlow)" />
            </Svg>
            
            {dots.map((dot) => (
              <CycleDot
                key={dot.day}
                day={dot.day}
                angle={dot.angle}
                radius={ringRadius}
                center={center}
                phase={dot.phase}
                isToday={dot.day === currentDay}
                isSelected={dot.day === displayDay}
                isDark={isDark}
                personaMain={personaAccent.main}
                showFertile={showFertile}
                dotBaseSize={dotBaseSize}
                onPress={handleDotPress}
              />
            ))}
            
            <AnimatedView 
              style={[
                styles.centerCardWrapper,
                contentAnimatedStyle,
                { 
                  width: svgSize, 
                  height: svgSize,
                }
              ]} 
              pointerEvents="none"
            >
              <View style={[
                styles.centerCard,
                { 
                  width: centerCardSize, 
                  height: centerCardSize,
                  borderRadius: centerCardSize / 2,
                  ...lightModeCardShadow,
                }
              ]}>
                <BlurView 
                  intensity={isDark ? 50 : 70} 
                  tint={isDark ? "dark" : "light"}
                  style={[
                    styles.glassCard,
                    { 
                      borderRadius: centerCardSize / 2,
                      borderColor: glassBorder,
                    }
                  ]}
                >
                  <View style={styles.centerContent}>
                    {displayDay !== null ? (
                      <>
                        <AnimatedView style={contentAnimatedStyle}>
                          <ThemedText style={[
                            styles.dayNumber, 
                            { 
                              color: phaseInfo.color,
                              ...(isDark ? {} : { 
                                textShadowColor: 'rgba(140, 100, 240, 0.2)',
                                textShadowOffset: { width: 0, height: 2 },
                                textShadowRadius: 6,
                              }),
                            }
                          ]}>
                            {displayDay}
                          </ThemedText>
                        </AnimatedView>
                        <ThemedText style={[styles.dateText, { color: DarkTheme.text.secondary }]}>
                          {displayDate}
                        </ThemedText>
                      </>
                    ) : (
                      <>
                        <ThemedText style={[styles.startTitle, { color: DarkTheme.text.secondary }]}>
                          {isRTL ? "ابدأي التتبع" : "Start Tracking"}
                        </ThemedText>
                        <ThemedText style={[styles.startSubtitle, { color: DarkTheme.text.secondary }]}>
                          {isRTL ? "اضغطي لتسجيل دورتك" : "Tap to log your period"}
                        </ThemedText>
                      </>
                    )}
                  </View>
                </BlurView>
              </View>
            </AnimatedView>
          </View>
        </GestureDetector>
      </AnimatedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  ringContainer: {
    position: "relative",
  },
  svgContainer: {
    position: "relative",
  },
  backgroundSvg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  dotTouchable: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  dot: {
    position: "absolute",
  },
  dotGlow: {
    position: "absolute",
  },
  centerCardWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },
  centerCard: {
    overflow: "hidden",
  },
  glassCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    overflow: "hidden",
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
  },
  dayNumber: {
    fontSize: 52,
    fontWeight: "700",
    lineHeight: 60,
    letterSpacing: -2,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
    letterSpacing: 0.3,
  },
  startTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  startSubtitle: {
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    opacity: 0.7,
  },
});
