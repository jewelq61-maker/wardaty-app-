import React, { useState, useCallback } from "react";
import { View, StyleSheet, ScrollView, Pressable, Modal, TextInput, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ThemedText } from "../components/ThemedText";
import { BeautyStepItem } from "../components/BeautyStepItem";
import { GlassCard } from "../components/UIKit";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";
import { usePaywall } from "../hooks/usePaywall";
import { Spacing, BorderRadius } from "../constants/theme";
import { useApp } from "../lib/AppContext";
import { useLayout } from "../lib/ThemePersonaContext";
import { useFABHandler } from "../contexts/FABContext";
import { formatDate, getTodayString, getCurrentCycleDay, addDays, daysBetween, getUpcomingDays } from "../lib/cycle-utils";
import { generateBeautyPlan, getLunarDay, getHijriDate } from "../lib/beauty-planner-engine";
import { HormonalPhase, RoutineTime, RoutineFrequency, CustomRoutine } from "../lib/types";

const AM_STEPS = ["Cleanser", "Toner", "Serum", "Moisturizer", "Sunscreen"];
const PM_STEPS = ["Makeup Remover", "Cleanser", "Toner", "Serum", "Night Cream"];

const phaseColors: Record<HormonalPhase, string> = {
  comfort: "#E57373",
  regeneration: "#81C784",
  peak_beauty: "#FFB74D",
  balance: "#64B5F6",
};

const phaseIcons: Record<HormonalPhase, keyof typeof Feather.glyphMap> = {
  comfort: "heart",
  regeneration: "refresh-cw",
  peak_beauty: "star",
  balance: "target",
};

const routineTimeIcons: Record<RoutineTime, keyof typeof Feather.glyphMap> = {
  morning: "sun",
  evening: "moon",
  any: "clock",
};

const routineFrequencyIcons: Record<RoutineFrequency, keyof typeof Feather.glyphMap> = {
  daily: "repeat",
  weekly: "calendar",
  monthly: "calendar",
};


function getHormonalPhaseForCycleDay(cycleDay: number): HormonalPhase {
  if (cycleDay >= 1 && cycleDay <= 5) return "comfort";
  if (cycleDay >= 6 && cycleDay <= 12) return "regeneration";
  if (cycleDay >= 13 && cycleDay <= 16) return "peak_beauty";
  return "balance";
}

function getCycleDayForDate(
  dateStr: string,
  lastPeriodStart: string | null,
  cycleLength: number
): number {
  if (!lastPeriodStart) return 1;
  const days = daysBetween(lastPeriodStart, dateStr);
  if (days < 0) return 1;
  return (days % cycleLength) + 1;
}


interface BeautyEvent {
  type: "phase" | "hair" | "hijama" | "peak_beauty";
  icon: keyof typeof Feather.glyphMap;
  color: string;
  title: string;
  description: string;
}


export default function BeautyScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme, isDark } = useTheme();
  const { t, isRTL, language } = useLanguage();
  const layout = useLayout();
  const navigation = useNavigation<any>();
  const { data, updateBeautyRoutine, getTodaysBeautyRoutine, updateDailyLog, getTodaysDailyLog, addCustomRoutine, deleteCustomRoutine, isPlus, isTrial } = useApp();
  const { isFeatureLocked, checkAndNavigate } = usePaywall();

  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [showAddRoutineModal, setShowAddRoutineModal] = useState(false);

  useFABHandler("BeautyTab", useCallback(() => setShowAddRoutineModal(true), []));
  const [routineName, setRoutineName] = useState("");
  const [selectedTime, setSelectedTime] = useState<RoutineTime>("morning");
  const [selectedFrequency, setSelectedFrequency] = useState<RoutineFrequency>("daily");
  const [routineSteps, setRoutineSteps] = useState("");
  const [startDate, setStartDate] = useState(getTodayString());

  const todaysRoutine = getTodaysBeautyRoutine();
  const todaysLog = getTodaysDailyLog();
  const today = getTodayString();

  const cycleSettings = data.settings.cycleSettings;
  const isPremiumUser = isPlus || isTrial;
  const persona = data.settings.persona || "single";

  const weekDays = getUpcomingDays(7);

  const getBeautyDataForDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const cycleDay = getCycleDayForDate(
      dateStr,
      cycleSettings.lastPeriodStart,
      cycleSettings.cycleLength
    );
    const lunarDay = getLunarDay(date);
    const phase = getHormonalPhaseForCycleDay(cycleDay);
    const hijriDate = getHijriDate(date);

    return { cycleDay, lunarDay, phase, hijriDate };
  };

  const getBeautyEventsForDate = (dateStr: string): BeautyEvent[] => {
    const { cycleDay, lunarDay, phase } = getBeautyDataForDate(dateStr);
    const events: BeautyEvent[] = [];

    const phaseNames: Record<HormonalPhase, string> = {
      comfort: t("beauty", "comfort"),
      regeneration: t("beauty", "regeneration"),
      peak_beauty: t("beauty", "peakBeauty"),
      balance: t("beauty", "balance"),
    };

    const phaseDescriptions: Record<HormonalPhase, { ar: string; en: string }> = {
      comfort: {
        ar: "ركزي على الراحة والترطيب العميق",
        en: "Focus on rest and deep moisturizing",
      },
      regeneration: {
        ar: "وقت مثالي لعلاجات التجديد",
        en: "Perfect time for renewal treatments",
      },
      peak_beauty: {
        ar: "أنتِ في أفضل حالاتك!",
        en: "You're at your best!",
      },
      balance: {
        ar: "التوازن والعناية بالبشرة الدهنية",
        en: "Balance and oil control care",
      },
    };

    events.push({
      type: "phase",
      icon: phaseIcons[phase],
      color: phaseColors[phase],
      title: phaseNames[phase],
      description: phaseDescriptions[phase][language],
    });

    if (phase === "peak_beauty") {
      events.push({
        type: "peak_beauty",
        icon: "star",
        color: phaseColors.peak_beauty,
        title: t("beauty", "peakBeautyDay"),
        description: language === "ar"
          ? "يوم مثالي للمناسبات والصور"
          : "Perfect day for events and photos",
      });
    }

    const isLengthDay = lunarDay >= 1 && lunarDay <= 14;
    const isThicknessDay = lunarDay >= 15 && lunarDay <= 30;

    if (isLengthDay) {
      events.push({
        type: "hair",
        icon: "scissors",
        color: theme.primary,
        title: t("beauty", "hairDay"),
        description: language === "ar"
          ? `يوم قمري ${lunarDay} - مثالي لقص الشعر لتعزيز الطول`
          : `Lunar day ${lunarDay} - Ideal for hair cutting to promote length`,
      });
    }

    if ([17, 19, 21].includes(lunarDay) && cycleDay > 5) {
      events.push({
        type: "hijama",
        icon: "droplet",
        color: theme.secondary,
        title: t("beauty", "hijamaDay"),
        description: language === "ar"
          ? `يوم قمري ${lunarDay} - من أيام السنة للحجامة`
          : `Lunar day ${lunarDay} - Sunnah day for hijama`,
      });
    }

    return events;
  };

  const selectedDateData = getBeautyDataForDate(selectedDate);
  const selectedDateEvents = getBeautyEventsForDate(selectedDate);

  const beautyPlan = generateBeautyPlan({
    cycleDay: selectedDateData.cycleDay,
    lunarDay: selectedDateData.lunarDay,
    persona,
    preferences: [],
    hairGoal: "length",
    hijamaPreference: "yes",
    isPremiumUser,
    language,
  });

  const handleToggleAMStep = async (step: string) => {
    await updateBeautyRoutine(step, undefined);
    const allAMDone = AM_STEPS.every((s) =>
      s === step
        ? !todaysRoutine.amSteps.includes(s)
        : todaysRoutine.amSteps.includes(s)
    );
    if (allAMDone !== todaysLog.beautyAM) {
      await updateDailyLog({ beautyAM: allAMDone });
    }
  };

  const handleTogglePMStep = async (step: string) => {
    await updateBeautyRoutine(undefined, step);
    const allPMDone = PM_STEPS.every((s) =>
      s === step
        ? !todaysRoutine.pmSteps.includes(s)
        : todaysRoutine.pmSteps.includes(s)
    );
    if (allPMDone !== todaysLog.beautyPM) {
      await updateDailyLog({ beautyPM: allPMDone });
    }
  };

  const handleAddRoutine = async () => {
    if (!routineName.trim()) {
      Alert.alert(
        t("common", "error"),
        t("beauty", "enterRoutineName")
      );
      return;
    }

    const steps = routineSteps.split("\n").filter((s) => s.trim());
    if (steps.length === 0) {
      Alert.alert(
        t("common", "error"),
        t("beauty", "enterAtLeastOneStep")
      );
      return;
    }

    await addCustomRoutine({
      name: routineName.trim(),
      time: selectedTime,
      frequency: selectedFrequency,
      steps,
      startDate: selectedFrequency !== "daily" ? startDate : undefined,
      reminderEnabled: false,
    });

    setRoutineName("");
    setRoutineSteps("");
    setSelectedTime("morning");
    setSelectedFrequency("daily");
    setStartDate(getTodayString());
    setShowAddRoutineModal(false);
  };

  const handleDeleteRoutine = (routine: CustomRoutine) => {
    Alert.alert(
      t("beauty", "deleteRoutine"),
      `${t("beauty", "deleteRoutineConfirm")} "${routine.name}"?`,
      [
        { text: t("common", "cancel"), style: "cancel" },
        {
          text: t("common", "delete"),
          style: "destructive",
          onPress: () => deleteCustomRoutine(routine.id),
        },
      ]
    );
  };

  const handleDayPress = (dateStr: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDate(dateStr);
  };

  const amProgress = todaysRoutine.amSteps.length;
  const pmProgress = todaysRoutine.pmSteps.length;

  const phaseColor = phaseColors[beautyPlan.phaseKey];
  const phaseIcon = phaseIcons[beautyPlan.phaseKey];

  const getTimeLabel = (time: RoutineTime) => {
    return t("beauty", time);
  };

  const getFrequencyLabel = (frequency: RoutineFrequency) => {
    return t("beauty", frequency);
  };

  const getRoutineTimeIcon = (time: RoutineTime) => {
    return routineTimeIcons[time] || "clock";
  };

  const getDayName = (dateStr: string): string => {
    const date = new Date(dateStr);
    if (language === "ar") {
      const arabicDays = ["أحد", "إثن", "ثلث", "أربع", "خميس", "جمعة", "سبت"];
      return arabicDays[date.getDay()];
    }
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const isToday = (dateStr: string): boolean => dateStr === today;
  const isSelected = (dateStr: string): boolean => dateStr === selectedDate;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: tabBarHeight + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { flexDirection: layout.flexDirection }]}>
        <View>
          <ThemedText type="h2">
            {t("beauty", "beautyPlanner")}
          </ThemedText>
          <ThemedText type="body" style={{ color: theme.textSecondary }}>
            {formatDate(selectedDate, "long")}
          </ThemedText>
        </View>
        <View style={[styles.headerButtons, { flexDirection: layout.flexDirection }]}>
          <Pressable
            onPress={() => checkAndNavigate("beautyRoutines", () => setShowAddRoutineModal(true))}
            style={[styles.headerButton, { backgroundColor: theme.primary + "20" }]}
          >
            <Feather name="plus" size={20} color={theme.primary} />
            {isFeatureLocked("beautyRoutines") ? (
              <View style={[styles.lockedIndicator, { backgroundColor: theme.warning + "20" }]}>
                <Feather name="lock" size={10} color={theme.warning} />
              </View>
            ) : null}
          </Pressable>
          <Pressable
            onPress={() => checkAndNavigate("beautyProducts", () => navigation.navigate("Products"))}
            style={[styles.productsButton, { backgroundColor: theme.backgroundSecondary }]}
          >
            <Feather name="package" size={20} color={theme.primary} />
            <ThemedText type="caption" style={{ color: theme.primary }}>
              {t("beauty", "products")}
            </ThemedText>
            {isFeatureLocked("beautyProducts") ? (
              <View style={[styles.lockedIndicator, { backgroundColor: theme.warning + "20" }]}>
                <Feather name="lock" size={10} color={theme.warning} />
              </View>
            ) : null}
          </Pressable>
        </View>
      </View>

      <GlassCard style={styles.weekStripCard}>
        <ThemedText type="caption" style={[styles.weekStripTitle, { color: theme.textSecondary }]}>
          {t("beauty", "weekOverview")}
        </ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.weekStripContainer,
            { flexDirection: layout.flexDirection },
          ]}
        >
          {weekDays.map((dateStr) => {
            const dayData = getBeautyDataForDate(dateStr);
            const dayPhaseColor = phaseColors[dayData.phase];
            const dayNum = new Date(dateStr).getDate();
            const dayName = getDayName(dateStr);
            const isTodayDay = isToday(dateStr);
            const isSelectedDay = isSelected(dateStr);

            return (
              <Pressable
                key={dateStr}
                onPress={() => handleDayPress(dateStr)}
                style={[
                  styles.weekDayItem,
                  {
                    backgroundColor: isSelectedDay
                      ? dayPhaseColor + "20"
                      : isTodayDay
                        ? isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)"
                        : "transparent",
                    borderWidth: isTodayDay ? 1.5 : 0,
                    borderColor: isTodayDay ? theme.primary : "transparent",
                  },
                  isSelectedDay && styles.weekDayItemSelected,
                ]}
              >
                <ThemedText
                  type="small"
                  style={[
                    styles.weekDayName,
                    { color: isSelectedDay ? dayPhaseColor : theme.textSecondary },
                  ]}
                >
                  {dayName}
                </ThemedText>
                <ThemedText
                  type="h3"
                  style={[
                    styles.weekDayNumber,
                    { color: isSelectedDay ? dayPhaseColor : theme.text },
                  ]}
                >
                  {dayNum}
                </ThemedText>
                <View
                  style={[
                    styles.weekDayIndicator,
                    { backgroundColor: dayPhaseColor },
                  ]}
                />
              </Pressable>
            );
          })}
        </ScrollView>
      </GlassCard>

      <GlassCard style={styles.eventsCard}>
        <View style={[styles.eventsHeader, { flexDirection: layout.flexDirection }]}>
          <View style={[styles.phaseIcon, { backgroundColor: phaseColor + "20" }]}>
            <Feather name={phaseIcon} size={24} color={phaseColor} />
          </View>
          <View style={styles.eventsHeaderText}>
            <ThemedText type="h4">
              {isToday(selectedDate) ? t("beauty", "todaysBeautyEvents") : t("beauty", "upcomingEvents")}
            </ThemedText>
            <ThemedText type="caption" style={{ color: phaseColor }}>
              {beautyPlan.phase}
            </ThemedText>
          </View>
          <View style={[styles.lunarBadge, { flexDirection: layout.flexDirection }]}>
            <Feather name="moon" size={14} color={theme.textSecondary} />
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {isRTL
                ? `${selectedDateData.hijriDate.day} ${selectedDateData.hijriDate.monthName.ar}`
                : `${selectedDateData.hijriDate.monthName.en} ${selectedDateData.hijriDate.day}`}
            </ThemedText>
          </View>
        </View>

        {selectedDateEvents.length > 0 ? (
          <View style={styles.eventsList}>
            {selectedDateEvents.map((event, index) => (
              <View
                key={`${event.type}-${index}`}
                style={[
                  styles.eventItem,
                  { backgroundColor: event.color + "10" },
                  { flexDirection: layout.flexDirection },
                ]}
              >
                <View style={[styles.eventIcon, { backgroundColor: event.color + "20" }]}>
                  <Feather name={event.icon} size={18} color={event.color} />
                </View>
                <View style={styles.eventContent}>
                  <ThemedText type="h4" style={{ color: event.color }}>
                    {event.title}
                  </ThemedText>
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>
                    {event.description}
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.noEventsContainer}>
            <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: "center" }}>
              {t("beauty", "noEventsToday")}
            </ThemedText>
          </View>
        )}

        {beautyPlan.type === "premium" ? (
          <View style={styles.plannerContent}>
            <View style={styles.plannerSection}>
              <ThemedText type="caption" style={{ color: theme.success }}>
                {t("beauty", "recommended")}
              </ThemedText>
              {beautyPlan.recommended.slice(0, 3).map((item, index) => (
                <View key={index} style={[styles.plannerItem, { flexDirection: layout.flexDirection }]}>
                  <Feather name="check-circle" size={14} color={theme.success} />
                  <ThemedText type="body" style={styles.plannerItemText}>
                    {item}
                  </ThemedText>
                </View>
              ))}
            </View>

            <View style={styles.plannerSection}>
              <ThemedText type="caption" style={{ color: theme.error }}>
                {t("beauty", "avoid")}
              </ThemedText>
              {beautyPlan.avoid.slice(0, 2).map((item, index) => (
                <View key={index} style={[styles.plannerItem, { flexDirection: layout.flexDirection }]}>
                  <Feather name="x-circle" size={14} color={theme.error} />
                  <ThemedText type="body" style={styles.plannerItemText}>
                    {item}
                  </ThemedText>
                </View>
              ))}
            </View>

            <View
              style={[
                styles.noteCard,
                { backgroundColor: theme.primaryLight + "15" },
                { flexDirection: layout.flexDirection },
              ]}
            >
              <Feather name="scissors" size={14} color={theme.primary} />
              <ThemedText type="small" style={{ flex: 1 }}>
                {beautyPlan.hairNote}
              </ThemedText>
            </View>

            <View
              style={[
                styles.noteCard,
                { backgroundColor: theme.secondary + "15" },
                { flexDirection: layout.flexDirection },
              ]}
            >
              <Feather name="droplet" size={14} color={theme.secondary} />
              <ThemedText type="small" style={{ flex: 1 }}>
                {beautyPlan.hijamaNote}
              </ThemedText>
            </View>

            <View
              style={[
                styles.wellnessCard,
                { backgroundColor: phaseColor + "15" },
                { flexDirection: layout.flexDirection },
              ]}
            >
              <Feather name="heart" size={16} color={phaseColor} />
              <ThemedText type="small" style={{ flex: 1, color: theme.text }}>
                {beautyPlan.wellness}
              </ThemedText>
            </View>
          </View>
        ) : (
          <View style={styles.plannerContent}>
            <View style={styles.plannerSection}>
              <View style={[styles.plannerItem, { flexDirection: layout.flexDirection }]}>
                <Feather name="check-circle" size={14} color={theme.success} />
                <ThemedText type="body" style={styles.plannerItemText}>
                  {beautyPlan.sample}
                </ThemedText>
              </View>
            </View>

            <View
              style={[
                styles.upsellCard,
                { backgroundColor: theme.primaryLight + "20", borderColor: theme.primary },
                { flexDirection: layout.flexDirection },
              ]}
            >
              <Feather name="lock" size={16} color={theme.primary} />
              <View style={styles.upsellContent}>
                <ThemedText type="small" style={{ color: theme.primary }}>
                  {beautyPlan.upsell}
                </ThemedText>
              </View>
            </View>
          </View>
        )}
      </GlassCard>

      <View style={styles.routineCard}>
        <View style={[styles.routineHeader, { flexDirection: layout.flexDirection }]}>
          <View style={[styles.timeIcon, { backgroundColor: theme.warning + "20" }]}>
            <Feather name="sun" size={20} color={theme.warning} />
          </View>
          <View style={styles.routineInfo}>
            <ThemedText type="h4">
              {t("beauty", "morningRoutine")}
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {amProgress}/{AM_STEPS.length} {t("beauty", "completed")}
            </ThemedText>
          </View>
        </View>
        <View
          style={[
            styles.routineContent,
            { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder },
          ]}
        >
          {AM_STEPS.map((step) => (
            <BeautyStepItem
              key={step}
              step={step}
              isCompleted={todaysRoutine.amSteps.includes(step)}
              onToggle={() => handleToggleAMStep(step)}
            />
          ))}
        </View>
      </View>

      <View style={styles.routineCard}>
        <View style={[styles.routineHeader, { flexDirection: layout.flexDirection }]}>
          <View style={[styles.timeIcon, { backgroundColor: theme.secondary + "20" }]}>
            <Feather name="moon" size={20} color={theme.secondary} />
          </View>
          <View style={styles.routineInfo}>
            <ThemedText type="h4">
              {t("beauty", "eveningRoutine")}
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {pmProgress}/{PM_STEPS.length} {t("beauty", "completed")}
            </ThemedText>
          </View>
        </View>
        <View
          style={[
            styles.routineContent,
            { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder },
          ]}
        >
          {PM_STEPS.map((step) => (
            <BeautyStepItem
              key={step}
              step={step}
              isCompleted={todaysRoutine.pmSteps.includes(step)}
              onToggle={() => handleTogglePMStep(step)}
            />
          ))}
        </View>
      </View>

      {data.customRoutines.length > 0 ? (
        <View style={styles.customRoutinesSection}>
          <ThemedText type="h3" style={styles.customRoutinesTitle}>
            {t("beauty", "myRoutines")}
          </ThemedText>
          {data.customRoutines.map((routine) => (
            <View
              key={routine.id}
              style={[
                styles.customRoutineCard,
                { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder },
              ]}
            >
              <View style={[styles.customRoutineHeader, { flexDirection: layout.flexDirection }]}>
                <View style={[styles.customRoutineIcon, { backgroundColor: theme.primary + "15" }]}>
                  <Feather name={getRoutineTimeIcon(routine.time)} size={18} color={theme.primary} />
                </View>
                <View style={styles.customRoutineInfo}>
                  <ThemedText type="h4">{routine.name}</ThemedText>
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>
                    {getTimeLabel(routine.time)} - {getFrequencyLabel(routine.frequency)} - {routine.steps.length} {t("beauty", "steps")}
                  </ThemedText>
                </View>
                <Pressable
                  onPress={() => handleDeleteRoutine(routine)}
                  style={styles.deleteButton}
                >
                  <Feather name="trash-2" size={18} color={theme.error} />
                </Pressable>
              </View>
              <View style={styles.customRoutineSteps}>
                {routine.steps.map((step, index) => (
                  <View key={index} style={[styles.customRoutineStep, { flexDirection: layout.flexDirection }]}>
                    <View style={[styles.stepNumber, { backgroundColor: theme.primary + "20" }]}>
                      <ThemedText type="small" style={{ color: theme.primary }}>
                        {index + 1}
                      </ThemedText>
                    </View>
                    <ThemedText type="body" style={{ flex: 1 }}>
                      {step}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      ) : null}

      <View
        style={[
          styles.tipCard,
          { backgroundColor: theme.primaryLight + "20", borderColor: theme.primaryLight },
          { flexDirection: layout.flexDirection },
        ]}
      >
        <Feather name="info" size={20} color={theme.primary} />
        <View style={styles.tipContent}>
          <ThemedText type="caption">
            {t("beauty", "beautyTip")}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {t("beauty", "tipText")}
          </ThemedText>
        </View>
      </View>

      <Modal
        visible={showAddRoutineModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddRoutineModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowAddRoutineModal(false)}
        >
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
              {t("beauty", "addNewRoutine")}
            </ThemedText>

            <View style={styles.formField}>
              <ThemedText type="caption" style={styles.fieldLabel}>
                {t("beauty", "routineName")}
              </ThemedText>
              <TextInput
                value={routineName}
                onChangeText={setRoutineName}
                placeholder={t("beauty", "routineNamePlaceholder")}
                placeholderTextColor={theme.textSecondary}
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.backgroundSecondary,
                    color: theme.text,
                    borderColor: theme.cardBorder,
                    textAlign: layout.textAlign,
                  },
                ]}
              />
            </View>

            <View style={styles.formField}>
              <ThemedText type="caption" style={styles.fieldLabel}>
                {t("beauty", "time")}
              </ThemedText>
              <View style={[styles.typeSelector, { flexDirection: layout.flexDirection }]}>
                {(["morning", "evening", "any"] as RoutineTime[]).map((time) => (
                  <Pressable
                    key={time}
                    onPress={() => setSelectedTime(time)}
                    style={[
                      styles.typeOption,
                      {
                        backgroundColor:
                          selectedTime === time
                            ? theme.primary + "20"
                            : theme.backgroundSecondary,
                        borderColor:
                          selectedTime === time
                            ? theme.primary
                            : theme.cardBorder,
                      },
                    ]}
                  >
                    <Feather
                      name={routineTimeIcons[time]}
                      size={16}
                      color={selectedTime === time ? theme.primary : theme.textSecondary}
                    />
                    <ThemedText
                      type="small"
                      style={{
                        color: selectedTime === time ? theme.primary : theme.text,
                      }}
                    >
                      {t("beauty", time)}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.formField}>
              <ThemedText type="caption" style={styles.fieldLabel}>
                {t("beauty", "frequency")}
              </ThemedText>
              <View style={[styles.typeSelector, { flexDirection: layout.flexDirection }]}>
                {(["daily", "weekly", "monthly"] as RoutineFrequency[]).map((freq) => (
                  <Pressable
                    key={freq}
                    onPress={() => setSelectedFrequency(freq)}
                    style={[
                      styles.typeOption,
                      {
                        backgroundColor:
                          selectedFrequency === freq
                            ? theme.primary + "20"
                            : theme.backgroundSecondary,
                        borderColor:
                          selectedFrequency === freq
                            ? theme.primary
                            : theme.cardBorder,
                      },
                    ]}
                  >
                    <Feather
                      name={routineFrequencyIcons[freq]}
                      size={16}
                      color={selectedFrequency === freq ? theme.primary : theme.textSecondary}
                    />
                    <ThemedText
                      type="small"
                      style={{
                        color: selectedFrequency === freq ? theme.primary : theme.text,
                      }}
                    >
                      {t("beauty", freq)}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>

            {selectedFrequency !== "daily" ? (
              <View style={styles.formField}>
                <ThemedText type="caption" style={styles.fieldLabel}>
                  {t("beauty", "startDate")}
                </ThemedText>
                <TextInput
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholder={getTodayString()}
                  placeholderTextColor={theme.textSecondary}
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: theme.backgroundSecondary,
                      color: theme.text,
                      borderColor: theme.cardBorder,
                      textAlign: layout.textAlign,
                    },
                  ]}
                />
              </View>
            ) : null}

            <View style={styles.formField}>
              <ThemedText type="caption" style={styles.fieldLabel}>
                {t("beauty", "stepsLabel")}
              </ThemedText>
              <TextInput
                value={routineSteps}
                onChangeText={setRoutineSteps}
                placeholder={t("beauty", "stepsPlaceholder")}
                placeholderTextColor={theme.textSecondary}
                multiline
                numberOfLines={5}
                style={[
                  styles.textInput,
                  styles.multilineInput,
                  {
                    backgroundColor: theme.backgroundSecondary,
                    color: theme.text,
                    borderColor: theme.cardBorder,
                    textAlign: layout.textAlign,
                  },
                ]}
              />
            </View>

            <View style={[styles.modalButtons, { flexDirection: layout.flexDirection }]}>
              <Pressable
                onPress={() => setShowAddRoutineModal(false)}
                style={[styles.modalButton, { backgroundColor: theme.backgroundSecondary }]}
              >
                <ThemedText type="body">
                  {t("common", "cancel")}
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={handleAddRoutine}
                style={[styles.modalButton, { backgroundColor: theme.primary }]}
              >
                <ThemedText type="body" style={{ color: "#FFFFFF" }}>
                  {t("common", "add")}
                </ThemedText>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.xl,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.medium,
    alignItems: "center",
    justifyContent: "center",
  },
  productsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.medium,
  },
  weekStripCard: {
    marginBottom: Spacing.lg,
  },
  weekStripTitle: {
    marginBottom: Spacing.md,
  },
  weekStripContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  weekDayItem: {
    width: 56,
    height: 80,
    borderRadius: BorderRadius.medium,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  weekDayItemSelected: {
    transform: [{ scale: 1.02 }],
  },
  weekDayName: {
    fontSize: 11,
    textTransform: "uppercase",
  },
  weekDayNumber: {
    fontSize: 20,
    fontWeight: "600",
  },
  weekDayIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  eventsCard: {
    marginBottom: Spacing.lg,
  },
  eventsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  eventsHeaderText: {
    flex: 1,
    gap: 2,
  },
  eventsList: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  eventItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
  },
  eventIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.small,
    alignItems: "center",
    justifyContent: "center",
  },
  eventContent: {
    flex: 1,
    gap: 2,
  },
  noEventsContainer: {
    paddingVertical: Spacing.xl,
    alignItems: "center",
  },
  phaseIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.medium,
    alignItems: "center",
    justifyContent: "center",
  },
  lunarBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  plannerContent: {
    gap: Spacing.md,
  },
  plannerSection: {
    gap: Spacing.sm,
  },
  plannerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  plannerItemText: {
    flex: 1,
  },
  noteCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
  },
  wellnessCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
  },
  upsellCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  upsellContent: {
    flex: 1,
  },
  routineCard: {
    marginBottom: Spacing.xl,
  },
  routineHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  timeIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.medium,
    alignItems: "center",
    justifyContent: "center",
  },
  routineInfo: {
    flex: 1,
    gap: 2,
  },
  routineContent: {
    borderRadius: BorderRadius.large,
    borderWidth: 0.5,
    overflow: "hidden",
  },
  customRoutinesSection: {
    marginBottom: Spacing.xl,
  },
  customRoutinesTitle: {
    marginBottom: Spacing.md,
  },
  customRoutineCard: {
    borderRadius: BorderRadius.large,
    borderWidth: 0.5,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  customRoutineHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  customRoutineIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.medium,
    alignItems: "center",
    justifyContent: "center",
  },
  customRoutineInfo: {
    flex: 1,
    gap: 2,
  },
  deleteButton: {
    padding: Spacing.sm,
  },
  customRoutineSteps: {
    gap: Spacing.sm,
  },
  customRoutineStep: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tipCard: {
    flexDirection: "row",
    padding: Spacing.lg,
    borderRadius: BorderRadius.large,
    borderWidth: 0.5,
    gap: Spacing.md,
    alignItems: "flex-start",
  },
  tipContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xlarge,
    borderTopRightRadius: BorderRadius.xlarge,
    padding: Spacing.lg,
    maxHeight: "85%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignSelf: "center",
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  formField: {
    marginBottom: Spacing.lg,
  },
  fieldLabel: {
    marginBottom: Spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  typeSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  typeOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
  },
  modalButtons: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.medium,
    alignItems: "center",
  },
  lockedIndicator: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
});
