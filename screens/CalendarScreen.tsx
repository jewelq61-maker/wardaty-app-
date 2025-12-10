import React, { useState, useMemo, useCallback } from "react";
import { View, StyleSheet, ScrollView, Pressable, Modal, Dimensions, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { useApp } from "@/lib/AppContext";
import { useLayout } from "@/lib/ThemePersonaContext";
import { useFABHandler } from "@/contexts/FABContext";
import {
  getCyclePhase,
  getDetailedCyclePhase,
  getTodayString,
  getCycleDayForDate,
  DetailedCyclePhase,
} from "@/lib/cycle-utils";
import { getHijriDate } from "@/lib/beauty-planner-engine";
import { generateBeautyPlan } from "@/lib/beauty-planner-engine";
import type { CycleLog, DailyLog } from "@/lib/types";

const WEEKDAY_KEYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAY_KEYS_AR = ["ح", "ن", "ث", "ر", "خ", "ج", "س"];

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CALENDAR_PADDING = Spacing.lg * 2 + Spacing.md * 2;
const DAY_SIZE = Math.floor((SCREEN_WIDTH - CALENDAR_PADDING) / 7);
const CIRCLE_SIZE = Math.min(DAY_SIZE - 8, 36);
const SWIPE_THRESHOLD = 50;

interface ThemeColors {
  text: string;
  textSecondary: string;
  backgroundRoot: string;
  backgroundDefault: string;
  backgroundSecondary: string;
  primary: string;
  primaryLight: string;
  period: string;
  fertile: string;
  ovulation: string;
  follicular: string;
  luteal: string;
  qadha: string;
  success: string;
  error: string;
  cardBorder: string;
  glassBackground: string;
  glassBorder: string;
}

type FlowIntensity = "light" | "medium" | "heavy";

const FLOW_OPTIONS: { value: FlowIntensity; label: { en: string; ar: string } }[] = [
  { value: "light", label: { en: "Light", ar: "خفيف" } },
  { value: "medium", label: { en: "Medium", ar: "متوسط" } },
  { value: "heavy", label: { en: "Heavy", ar: "غزير" } },
];

function MonthDayCell({
  date,
  dayNum,
  isToday,
  isSelected,
  isCurrentMonth,
  isPeriod,
  isFertile,
  isOvulation,
  isFollicular,
  isLuteal,
  isQadhaSuitable,
  onPress,
  theme,
}: {
  date: string;
  dayNum: number;
  isToday: boolean;
  isSelected: boolean;
  isCurrentMonth: boolean;
  isPeriod: boolean;
  isFertile: boolean;
  isOvulation: boolean;
  isFollicular: boolean;
  isLuteal: boolean;
  isQadhaSuitable: boolean;
  onPress: () => void;
  theme: ThemeColors;
}) {
  const getBgColor = () => {
    if (isSelected) return theme.primary;
    if (isToday) return `${theme.primary}20`;
    if (isPeriod) return `${theme.period}20`;
    if (isOvulation) return `${theme.ovulation}30`;
    if (isFertile) return `${theme.fertile}15`;
    if (isLuteal) return `${theme.luteal}15`;
    if (isFollicular) return `${theme.follicular}15`;
    if (isQadhaSuitable) return `${theme.qadha}15`;
    return "transparent";
  };

  const getTextColor = () => {
    if (isSelected) return "#FFFFFF";
    if (!isCurrentMonth) return theme.textSecondary + "50";
    if (isPeriod) return theme.period;
    if (isOvulation) return theme.ovulation;
    if (isFertile) return theme.fertile;
    if (isLuteal) return theme.luteal;
    if (isFollicular) return theme.follicular;
    if (isQadhaSuitable) return theme.qadha;
    return theme.text;
  };

  const showDot = isQadhaSuitable;
  const dotColor = theme.qadha;

  return (
    <Pressable onPress={onPress} style={styles.monthDayCell}>
      <View
        style={[
          styles.monthDayCircle,
          {
            backgroundColor: getBgColor(),
            borderWidth: isToday && !isSelected ? 2 : 0,
            borderColor: theme.primary,
          },
        ]}
      >
        <ThemedText
          type="body"
          style={{
            color: getTextColor(),
            fontWeight: isToday || isSelected ? "600" : "400",
            fontSize: 14,
          }}
        >
          {dayNum}
        </ThemedText>
      </View>
      {showDot && !isSelected ? (
        <View style={[styles.dayIndicator, { backgroundColor: dotColor }]} />
      ) : null}
    </Pressable>
  );
}

function TodoItem({
  icon,
  title,
  subtitle,
  color,
  isCompleted,
  onToggle,
  theme,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  color: string;
  isCompleted?: boolean;
  onToggle?: () => void;
  theme: ThemeColors;
}) {
  return (
    <Pressable
      onPress={onToggle}
      style={[
        styles.todoItem,
        { backgroundColor: theme.backgroundSecondary, borderLeftColor: color, borderLeftWidth: 3 },
      ]}
    >
      <View style={[styles.todoIcon, { backgroundColor: `${color}20` }]}>
        <Feather name={icon as any} size={18} color={color} />
      </View>
      <View style={styles.todoContent}>
        <ThemedText
          type="body"
          style={{
            fontWeight: "500",
            textDecorationLine: isCompleted ? "line-through" : "none",
            color: isCompleted ? theme.textSecondary : theme.text,
          }}
        >
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText type="small" style={{ color: theme.textSecondary, marginTop: 2 }}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {onToggle ? (
        <View
          style={[
            styles.todoCheckbox,
            {
              backgroundColor: isCompleted ? color : "transparent",
              borderColor: isCompleted ? color : theme.cardBorder,
            },
          ]}
        >
          {isCompleted ? <Feather name="check" size={12} color="#FFFFFF" /> : null}
        </View>
      ) : null}
    </Pressable>
  );
}

function FlowSelector({
  selected,
  onChange,
  theme,
  language,
}: {
  selected: FlowIntensity | undefined;
  onChange: (flow: FlowIntensity) => void;
  theme: ThemeColors;
  language: string;
}) {
  return (
    <View style={styles.flowSelector}>
      {FLOW_OPTIONS.map((option) => {
        const isSelected = selected === option.value;
        const dropletSize = option.value === "light" ? 14 : option.value === "medium" ? 18 : 22;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[
              styles.flowOption,
              {
                backgroundColor: isSelected ? `${theme.period}20` : `${theme.text}05`,
                borderColor: isSelected ? theme.period : `${theme.text}15`,
              },
            ]}
          >
            <Feather name="droplet" size={dropletSize} color={isSelected ? theme.period : theme.textSecondary} />
            <ThemedText
              type="small"
              style={{
                color: isSelected ? theme.period : theme.textSecondary,
                marginTop: 4,
                fontWeight: isSelected ? "600" : "400",
              }}
            >
              {language === "ar" ? option.label.ar : option.label.en}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme() as { theme: ThemeColors };
  const { t, language, isRTL } = useLanguage();
  const layout = useLayout();
  const { data, addCycleLog, addMissedDay } = useApp();

  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState<FlowIntensity | undefined>(undefined);
  const [notes, setNotes] = useState("");

  const translateX = useSharedValue(0);
  const isAnimating = useSharedValue(false);

  const { settings, cycleLogs, qadhaLogs, pregnancySettings } = data;
  const { cycleSettings, persona, calendarType } = settings;
  const showFertile = persona === "married";
  const isPremiumUser = settings.isSubscribed;
  const isPregnancyMode = pregnancySettings?.enabled || false;

  const today = getTodayString();
  const weekdays = language === "ar" ? WEEKDAY_KEYS_AR : WEEKDAY_KEYS_EN;

  const handleOpenLogModalForFAB = useCallback(() => {
    const dayInfo = getDayInfo(selectedDate);
    if (dayInfo.existingLog) {
      setSelectedFlow(dayInfo.existingLog.flow);
      setNotes(dayInfo.existingLog.notes || "");
    } else {
      setSelectedFlow(undefined);
      setNotes("");
    }
    setShowLogModal(true);
  }, [selectedDate, cycleLogs, qadhaLogs, cycleSettings]);
  
  useFABHandler("CalendarTab", handleOpenLogModalForFAB);

  const monthData = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: { date: string; dayNum: number; isCurrentMonth: boolean }[] = [];

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date: date.toISOString().split("T")[0],
        dayNum: prevMonthLastDay - i,
        isCurrentMonth: false,
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date: date.toISOString().split("T")[0],
        dayNum: day,
        isCurrentMonth: true,
      });
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date: date.toISOString().split("T")[0],
        dayNum: day,
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentMonth]);

  const navigateMonth = useCallback((direction: number) => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
  }, []);

  const animateMonthChange = useCallback(
    (direction: number) => {
      if (isAnimating.value) return;
      isAnimating.value = true;

      translateX.value = withTiming(direction * -SCREEN_WIDTH, { duration: 200 }, () => {
        runOnJS(navigateMonth)(direction);
        translateX.value = direction * SCREEN_WIDTH;
        translateX.value = withTiming(0, { duration: 200 }, () => {
          isAnimating.value = false;
        });
      });
    },
    [navigateMonth]
  );

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .onUpdate((event) => {
      if (!isAnimating.value) {
        translateX.value = event.translationX * 0.3;
      }
    })
    .onEnd((event) => {
      if (isAnimating.value) return;

      const swipeDirection = layout.isRTL ? -1 : 1;

      if (event.translationX > SWIPE_THRESHOLD) {
        runOnJS(animateMonthChange)(-1 * swipeDirection);
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        runOnJS(animateMonthChange)(1 * swipeDirection);
      } else {
        translateX.value = withSpring(0, { damping: 20, stiffness: 300 });
      }
    });

  const monthAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const goToToday = () => {
    const todayDate = new Date();
    setCurrentMonth(new Date(todayDate.getFullYear(), todayDate.getMonth(), 1));
    setSelectedDate(today);
  };

  const getDayInfo = (date: string) => {
    const phase = getCyclePhase(date, cycleSettings.lastPeriodStart, cycleSettings);
    const detailedPhase = getDetailedCyclePhase(date, cycleSettings.lastPeriodStart, cycleSettings);
    const isPeriodLogged = cycleLogs.some((log) => log.date === date && log.isPeriod);
    const isQadha = qadhaLogs.some((log) => log.date === date && log.type === "missed");
    const cycleDay = getCycleDayForDate(date, cycleSettings.lastPeriodStart, cycleSettings.cycleLength);
    const hijriInfo = getHijriDate(new Date(date));
    const lunarDay = hijriInfo.day;
    const isWhiteDay = lunarDay === 13 || lunarDay === 14 || lunarDay === 15;
    const existingLog = cycleLogs.find((log) => log.date === date);

    const isPeriod = isPeriodLogged || detailedPhase === "period";
    const isFertile = showFertile && detailedPhase === "fertile";
    const isOvulation = showFertile && detailedPhase === "ovulation";
    const isFollicular = detailedPhase === "follicular";
    const isLuteal = detailedPhase === "luteal";
    const isQadhaSuitable = !isPeriod && isWhiteDay;

    return {
      phase,
      detailedPhase,
      isPeriodLogged,
      isQadha,
      cycleDay,
      hijriInfo,
      lunarDay,
      isWhiteDay,
      existingLog,
      isPeriod,
      isFertile,
      isOvulation,
      isFollicular,
      isLuteal,
      isQadhaSuitable,
    };
  };

  const getPhaseLabel = (phase: DetailedCyclePhase): string => {
    const labels = {
      ar: {
        period: "الحيض",
        fertile: "الخصوبة",
        ovulation: "التبويض",
        follicular: "الجرابية",
        luteal: "الأصفرية",
      },
      en: {
        period: "Period",
        fertile: "Fertile",
        ovulation: "Ovulation",
        follicular: "Follicular",
        luteal: "Luteal",
      },
    };
    return labels[language as "ar" | "en"][phase];
  };

  const handleDayPress = (date: string) => {
    setSelectedDate(date);
  };

  const handleOpenLogModal = () => {
    const dayInfo = getDayInfo(selectedDate);
    if (dayInfo.existingLog) {
      setSelectedFlow(dayInfo.existingLog.flow);
      setNotes(dayInfo.existingLog.notes || "");
    } else {
      setSelectedFlow(undefined);
      setNotes("");
    }
    setShowLogModal(true);
  };

  const handleLogPeriod = async () => {
    if (selectedDate) {
      const logData: Omit<CycleLog, "date"> & { date: string } = {
        date: selectedDate,
        isPeriod: true,
        flow: selectedFlow,
        notes: notes.trim() || undefined,
      };
      await addCycleLog(logData);
      setShowLogModal(false);
      setSelectedFlow(undefined);
      setNotes("");
    }
  };

  const handleLogQadha = async () => {
    if (selectedDate) {
      await addMissedDay(selectedDate);
      setShowLogModal(false);
    }
  };

  const selectedDayInfo = getDayInfo(selectedDate);
  const selectedDateObj = new Date(selectedDate);
  const selectedDateBeautyPlan = generateBeautyPlan({
    cycleDay: selectedDayInfo.cycleDay || 1,
    lunarDay: selectedDayInfo.lunarDay,
    persona: persona || "single",
    preferences: [],
    hairGoal: "length",
    hijamaPreference: "yes",
    isPremiumUser,
    language: language as "ar" | "en",
  });

  const monthName = currentMonth.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", { month: "long" });
  const year = currentMonth.getFullYear();

  const hijriInfo = getHijriDate(selectedDateObj);

  const todosForSelectedDate = useMemo(() => {
    const todos: { icon: string; title: string; subtitle?: string; color: string; key: string }[] = [];

    if (selectedDayInfo.cycleDay) {
      todos.push({
        key: "cycle",
        icon: "activity",
        title: `${language === "ar" ? "يوم الدورة" : "Cycle Day"} ${selectedDayInfo.cycleDay}`,
        subtitle: getPhaseLabel(selectedDayInfo.detailedPhase),
        color: selectedDayInfo.isPeriod ? theme.period : theme.primary,
      });
    }

    if (selectedDateBeautyPlan.type === "premium" && selectedDateBeautyPlan.recommended.length > 0) {
      todos.push({
        key: "beauty",
        icon: "star",
        title: language === "ar" ? "مخطط الجمال" : "Beauty Plan",
        subtitle: selectedDateBeautyPlan.recommended[0],
        color: theme.primary,
      });
    } else if (selectedDateBeautyPlan.type === "free" && selectedDateBeautyPlan.sample) {
      todos.push({
        key: "beauty",
        icon: "star",
        title: language === "ar" ? "مخطط الجمال" : "Beauty Plan",
        subtitle: selectedDateBeautyPlan.sample,
        color: theme.primary,
      });
    }

    if (selectedDayInfo.isWhiteDay) {
      todos.push({
        key: "whiteDays",
        icon: "sun",
        title: language === "ar" ? "أيام البيض" : "White Days",
        subtitle: language === "ar" ? "صيام مستحب" : "Recommended fasting",
        color: "#B8860B",
      });
    }

    if (!selectedDayInfo.isPeriod) {
      todos.push({
        key: "qadha",
        icon: "check-circle",
        title: language === "ar" ? "يوم مناسب للقضاء" : "Suitable for Qadha",
        subtitle: language === "ar" ? "قضاء الصلاة أو الصيام" : "Make up prayer or fasting",
        color: theme.qadha,
      });
    }

    if (selectedDayInfo.isQadha) {
      todos.push({
        key: "missedPrayer",
        icon: "alert-circle",
        title: language === "ar" ? "صلاة فائتة مسجلة" : "Missed Prayer Logged",
        subtitle: language === "ar" ? "يجب القضاء" : "Needs to be made up",
        color: theme.error,
      });
    }

    todos.push({
      key: "water",
      icon: "droplet",
      title: language === "ar" ? "شرب الماء" : "Water Intake",
      subtitle: language === "ar" ? "8 أكواب يومياً" : "8 cups daily",
      color: "#4FC3F7",
    });

    const dayLog = (data.dailyLogs || []).find((log: DailyLog) => log.date === selectedDate);
    const moodLabels: Record<string, { en: string; ar: string }> = {
      happy: { en: "Happy", ar: "سعيدة" },
      calm: { en: "Calm", ar: "هادئة" },
      tired: { en: "Tired", ar: "متعبة" },
      stressed: { en: "Stressed", ar: "متوترة" },
      sad: { en: "Sad", ar: "حزينة" },
      irritable: { en: "Irritable", ar: "عصبية" },
      anxious: { en: "Anxious", ar: "قلقة" },
      energetic: { en: "Energetic", ar: "نشيطة" },
    };
    const moodValue = dayLog?.mood;
    const moodLabel = moodValue && moodLabels[moodValue] 
      ? (language === "ar" ? moodLabels[moodValue].ar : moodLabels[moodValue].en)
      : undefined;

    todos.push({
      key: "mood",
      icon: "smile",
      title: language === "ar" ? "المزاج" : "Mood",
      subtitle: moodLabel || (language === "ar" ? "سجّلي مزاجك اليوم" : "Log your mood today"),
      color: "#FF9800",
    });

    return todos;
  }, [selectedDate, selectedDayInfo, selectedDateBeautyPlan, language, theme, data.dailyLogs]);

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: headerHeight + Spacing.md,
          paddingBottom: tabBarHeight + Spacing.xl + 80,
          paddingHorizontal: Spacing.lg,
        }}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.monthHeader, { flexDirection: layout.flexDirection }]}>
          <Pressable onPress={() => animateMonthChange(layout.isRTL ? 1 : -1)} style={styles.navButton}>
            <Feather name={layout.isRTL ? "chevron-right" : "chevron-left"} size={24} color={theme.text} />
          </Pressable>
          <Pressable onPress={goToToday}>
            <ThemedText type="h2" style={{ fontWeight: "700" }}>
              {monthName} {year}
            </ThemedText>
            {calendarType !== "gregorian" ? (
              <ThemedText type="small" style={{ color: theme.textSecondary, textAlign: "center" }}>
                {language === "ar" ? hijriInfo.monthName.ar : hijriInfo.monthName.en} {hijriInfo.year}
              </ThemedText>
            ) : null}
          </Pressable>
          <Pressable onPress={() => animateMonthChange(layout.isRTL ? -1 : 1)} style={styles.navButton}>
            <Feather name={layout.isRTL ? "chevron-left" : "chevron-right"} size={24} color={theme.text} />
          </Pressable>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.legendContainer}
        >
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.period }]} />
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {language === "ar" ? "الحيض" : "Period"}
            </ThemedText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.follicular }]} />
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {language === "ar" ? "الجرابية" : "Follicular"}
            </ThemedText>
          </View>
          {showFertile ? (
            <>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: theme.fertile }]} />
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  {language === "ar" ? "الخصوبة" : "Fertile"}
                </ThemedText>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: theme.ovulation }]} />
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  {language === "ar" ? "التبويض" : "Ovulation"}
                </ThemedText>
              </View>
            </>
          ) : null}
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.luteal }]} />
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {language === "ar" ? "الأصفرية" : "Luteal"}
            </ThemedText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.qadha }]} />
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {language === "ar" ? "القضاء" : "Qadha"}
            </ThemedText>
          </View>
        </ScrollView>

        <GestureDetector gesture={swipeGesture}>
          <Animated.View style={[styles.calendarCard, { backgroundColor: theme.backgroundDefault }, monthAnimatedStyle]}>
            <View style={styles.weekdayRow}>
              {weekdays.map((day, index) => (
                <View key={index} style={styles.weekdayCell}>
                  <ThemedText type="small" style={{ color: theme.textSecondary, fontWeight: "500" }}>
                    {day}
                  </ThemedText>
                </View>
              ))}
            </View>

            <View style={styles.monthGrid}>
              {monthData.map((day, index) => {
                const dayInfo = getDayInfo(day.date);
                const isToday = day.date === today;
                const isSelected = day.date === selectedDate;

                return (
                  <MonthDayCell
                    key={index}
                    date={day.date}
                    dayNum={day.dayNum}
                    isToday={isToday}
                    isSelected={isSelected}
                    isCurrentMonth={day.isCurrentMonth}
                    isPeriod={dayInfo.isPeriod}
                    isFertile={dayInfo.isFertile}
                    isOvulation={dayInfo.isOvulation}
                    isFollicular={dayInfo.isFollicular}
                    isLuteal={dayInfo.isLuteal}
                    isQadhaSuitable={dayInfo.isQadhaSuitable}
                    onPress={() => handleDayPress(day.date)}
                    theme={theme}
                  />
                );
              })}
            </View>
          </Animated.View>
        </GestureDetector>

        <View style={styles.selectedDaySection}>
          <View style={[styles.selectedDayHeader, { flexDirection: layout.flexDirection }]}>
            <ThemedText type="h3" style={{ fontWeight: "600" }}>
              {selectedDate === today
                ? language === "ar"
                  ? "اليوم"
                  : "Today"
                : selectedDateObj.toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                  })}
            </ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              {todosForSelectedDate.length} {language === "ar" ? "مهام" : "tasks"}
            </ThemedText>
          </View>

          <View style={styles.todoList}>
            {todosForSelectedDate.map((todo) => (
              <TodoItem
                key={todo.key}
                icon={todo.icon}
                title={todo.title}
                subtitle={todo.subtitle}
                color={todo.color}
                theme={theme}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <Pressable 
        onPress={handleOpenLogModal} 
        style={({ pressed }) => [
          styles.fab, 
          { 
            bottom: tabBarHeight + Spacing.lg, 
            backgroundColor: theme.primary,
            shadowColor: theme.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 8,
            elevation: 8,
            transform: [{ scale: pressed ? 0.92 : 1 }],
          }
        ]}
      >
        <Feather name="plus" size={26} color="#FFFFFF" />
      </Pressable>

      <Modal visible={showLogModal} animationType="slide" transparent onRequestClose={() => setShowLogModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowLogModal(false)}>
          <Pressable
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.backgroundDefault,
                paddingBottom: insets.bottom + Spacing.lg,
              },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHandle} />

            <ThemedText type="h3" style={styles.modalTitle}>
              {selectedDateObj.toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </ThemedText>

            {!isPregnancyMode ? (
              <KeyboardAwareScrollViewCompat style={styles.modalScrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.flowSection}>
                  <ThemedText type="h4" style={{ marginBottom: Spacing.sm }}>
                    {language === "ar" ? "شدة النزيف" : "Flow Intensity"}
                  </ThemedText>
                  <FlowSelector selected={selectedFlow} onChange={setSelectedFlow} theme={theme} language={language} />
                </View>

                <View style={styles.notesSection}>
                  <ThemedText type="h4" style={{ marginBottom: Spacing.sm }}>
                    {language === "ar" ? "ملاحظات" : "Notes"}
                  </ThemedText>
                  <TextInput
                    style={[
                      styles.notesInput,
                      {
                        backgroundColor: `${theme.text}05`,
                        borderColor: `${theme.text}15`,
                        color: theme.text,
                      },
                    ]}
                    placeholder={language === "ar" ? "أضيفي ملاحظاتك هنا..." : "Add your notes here..."}
                    placeholderTextColor={theme.textSecondary}
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    textAlign={layout.textAlign}
                  />
                </View>
              </KeyboardAwareScrollViewCompat>
            ) : null}

            {!isPregnancyMode ? (
              <View style={[styles.modalButtons, { flexDirection: layout.flexDirection }]}>
                <Button onPress={handleLogPeriod} style={{ flex: 1 }}>
                  {t("calendar", "logPeriod")}
                </Button>
                <Button onPress={handleLogQadha} variant="secondary" style={{ flex: 1 }}>
                  {t("calendar", "markQadha")}
                </Button>
              </View>
            ) : (
              <Button onPress={() => setShowLogModal(false)} variant="secondary">
                {t("common", "close")}
              </Button>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  monthHeader: {
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  navButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  legendContainer: {
    flexDirection: "row",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  calendarCard: {
    borderRadius: BorderRadius.large,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  weekdayRow: {
    flexDirection: "row",
    marginBottom: Spacing.sm,
  },
  weekdayCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.xs,
  },
  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  monthDayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  monthDayCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  dayIndicator: {
    position: "absolute",
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  selectedDaySection: {
    marginTop: Spacing.sm,
  },
  selectedDayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  todoList: {
    gap: Spacing.sm,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
    gap: Spacing.md,
  },
  todoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  todoContent: {
    flex: 1,
  },
  todoCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    position: "absolute",
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  fabGradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.lg,
    maxHeight: "85%",
  },
  modalScrollContent: {
    maxHeight: 400,
  },
  modalHandle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "rgba(0,0,0,0.15)",
    alignSelf: "center",
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  flowSection: {
    marginBottom: Spacing.lg,
  },
  flowSelector: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  flowOption: {
    flex: 1,
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
  },
  notesSection: {
    marginBottom: Spacing.lg,
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    minHeight: 80,
    fontSize: 14,
  },
  modalButtons: {
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
});
