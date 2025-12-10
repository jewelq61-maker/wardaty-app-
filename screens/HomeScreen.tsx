import React, { useState, useMemo, useCallback } from "react";
import { View, StyleSheet, ScrollView, Pressable, Modal, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AppIcon, AppIconName } from "@/components/AppIcon";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { usePaywall } from "@/hooks/usePaywall";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { useApp } from "@/lib/AppContext";
import { useLayout } from "@/lib/ThemePersonaContext";
import { useFABHandler } from "@/contexts/FABContext";
import { Card } from "@/components/Card";
import { CycleRing } from "@/components/CycleRing";
import { DaysStrip } from "@/components/DaysStrip";
import { MoodTracker } from "@/components/MoodTracker";
import { MoodGrid } from "@/components/MoodGrid";
import { WaterTracker } from "@/components/WaterTracker";
import { SleepTracker } from "@/components/SleepTracker";
import { BeautyRoutineCard } from "@/components/BeautyRoutineCard";
import { PhaseBanner } from "@/components/PhaseBanner";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import {
  getCurrentCycleDay,
  getDaysUntilNextPeriod,
  getDetailedCyclePhase,
  getTodayString,
} from "@/lib/cycle-utils";
import { Mood } from "@/lib/types";

function HeaderSection({
  userName,
  onNotificationPress,
}: {
  userName: string;
  onNotificationPress: () => void;
}) {
  const { theme, isDark } = useTheme();
  const { language } = useLanguage();
  const layout = useLayout();

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return language === "ar" ? "صباح الخير" : "Good morning";
    } else if (hour >= 12 && hour < 17) {
      return language === "ar" ? "مساء الخير" : "Good afternoon";
    } else {
      return language === "ar" ? "مساء النور" : "Good evening";
    }
  };

  const greeting = getTimeBasedGreeting();
  const dearPrefix = language === "ar" ? "عزيزتي" : "Dear";
  const displayName = userName ? `${dearPrefix} ${userName}` : (language === "ar" ? "حبيبتي" : "Dear");

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerTitleSection}>
        <View style={styles.headerTitleRow}>
          <ThemedText type="largeTitle" style={[styles.headerTitle, { color: theme.text }]}>
            Wardaty
          </ThemedText>
          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              onNotificationPress();
            }}
            style={({ pressed }) => [
              styles.headerNotification,
              { 
                backgroundColor: isDark ? theme.backgroundSecondary : theme.backgroundElevated,
                opacity: pressed ? 0.7 : 1,
                borderWidth: 1,
                borderColor: theme.border,
              },
            ]}
          >
            <Feather name="bell" size={20} color={theme.primary} />
          </Pressable>
        </View>
        <View style={[styles.headerGreetingRow, { flexDirection: layout.flexDirection }, layout.isRTL ? { justifyContent: "flex-end", width: "100%" } : null]}>
          {layout.isRTL ? (
            <ThemedText type="body" style={{ color: theme.textSecondary, writingDirection: "rtl", textAlign: "right" }}>
              {greeting} <ThemedText type="body" style={{ color: theme.primary, fontWeight: "600" }}>{displayName}</ThemedText>
            </ThemedText>
          ) : (
            <ThemedText type="body" style={{ color: theme.textSecondary }}>
              {greeting}, <ThemedText type="body" style={{ color: theme.primary, fontWeight: "600" }}>{displayName}</ThemedText>
            </ThemedText>
          )}
        </View>
      </View>
    </View>
  );
}

function QuickActionButton({
  icon,
  label,
  color,
  onPress,
}: {
  icon: AppIconName;
  label: string;
  color: string;
  onPress: () => void;
}) {
  const { theme, isDark } = useTheme();

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => [
        styles.quickActionButton,
        {
          backgroundColor: isDark ? theme.backgroundSecondary : theme.backgroundElevated,
          borderWidth: 0.5,
          borderColor: theme.border,
          transform: [{ scale: pressed ? 0.96 : 1 }],
          ...Shadows.cardSubtle,
        },
      ]}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: `${color}15` }]}>
        <AppIcon name={icon} size={22} color={color} weight="semibold" />
      </View>
      <ThemedText type="caption" style={{ marginTop: Spacing.sm, color: theme.text, fontWeight: "500" }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

function SleepLogModal({
  visible,
  onClose,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (hours: number) => void;
}) {
  const { theme, isDark } = useTheme();
  const { t } = useLanguage();
  const [sleepHours, setSleepHours] = useState("");

  const handleSave = () => {
    const hours = parseFloat(sleepHours);
    if (!isNaN(hours) && hours > 0 && hours <= 24) {
      onSave(hours);
      setSleepHours("");
      onClose();
    }
  };

  const quickOptions = [6, 7, 8, 9];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAwareScrollViewCompat
        contentContainerStyle={styles.modalOverlay}
        bounces={false}
      >
        <View style={[styles.modalContent, { backgroundColor: theme.backgroundElevated }]}>
          <ThemedText type="h3" style={{ marginBottom: Spacing.lg, textAlign: "center" }}>
            {t("home", "logSleep")}
          </ThemedText>
          
          <View style={styles.sleepInputRow}>
            {quickOptions.map((hours) => (
              <Pressable
                key={hours}
                onPress={() => {
                  setSleepHours(hours.toString());
                  Haptics.selectionAsync();
                }}
                style={[
                  styles.sleepQuickButton,
                  { 
                    backgroundColor: sleepHours === hours.toString() ? theme.primary : theme.backgroundSecondary,
                    borderWidth: 1,
                    borderColor: sleepHours === hours.toString() ? theme.primary : theme.border,
                  },
                ]}
              >
                <ThemedText 
                  type="body" 
                  style={{ 
                    color: sleepHours === hours.toString() ? "#FFF" : theme.text,
                    fontWeight: "600",
                  }}
                >
                  {hours}h
                </ThemedText>
              </Pressable>
            ))}
          </View>

          <TextInput
            value={sleepHours}
            onChangeText={setSleepHours}
            placeholder={t("home", "enterHours")}
            placeholderTextColor={theme.textSecondary}
            keyboardType="decimal-pad"
            style={[
              styles.sleepInput,
              { 
                backgroundColor: theme.backgroundSecondary,
                color: theme.text,
                borderWidth: 1,
                borderColor: theme.border,
              },
            ]}
          />

          <View style={styles.modalButtons}>
            <Pressable
              onPress={onClose}
              style={[styles.modalButton, { backgroundColor: theme.backgroundSecondary }]}
            >
              <ThemedText type="body" style={{ color: theme.text }}>{t("common", "cancel")}</ThemedText>
            </Pressable>
            <Pressable
              onPress={handleSave}
              style={[styles.modalButton, { backgroundColor: theme.primary }]}
            >
              <ThemedText type="body" style={{ color: "#FFF" }}>{t("common", "save")}</ThemedText>
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollViewCompat>
    </Modal>
  );
}

function MoodModal({
  visible,
  onClose,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (mood: Mood) => void;
}) {
  const { theme } = useTheme();
  const { t } = useLanguage();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={[styles.modalContent, { backgroundColor: theme.backgroundElevated }]} onPress={(e) => e.stopPropagation()}>
          <ThemedText type="h3" style={{ marginBottom: Spacing.lg, textAlign: "center" }}>
            {t("home", "howAreYou")}
          </ThemedText>
          <MoodTracker
            selectedMood={undefined}
            onMoodSelect={(mood) => {
              onSelect(mood);
              onClose();
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function QuickLogModal({
  visible,
  onClose,
  onLogPeriod,
  onLogSleep,
  onLogMood,
}: {
  visible: boolean;
  onClose: () => void;
  onLogPeriod: () => void;
  onLogSleep: () => void;
  onLogMood: () => void;
}) {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const options = [
    { icon: "droplet" as const, label: t("home", "logPeriod"), color: theme.period, onPress: onLogPeriod },
    { icon: "moon" as const, label: t("home", "sleep"), color: theme.secondary, onPress: onLogSleep },
    { icon: "heart" as const, label: t("home", "mood"), color: theme.accent, onPress: onLogMood },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={[styles.modalContent, { backgroundColor: theme.backgroundElevated }]} onPress={(e) => e.stopPropagation()}>
          <ThemedText type="h3" style={{ marginBottom: Spacing.lg, textAlign: "center" }}>
            {t("home", "quickLog")}
          </ThemedText>
          <View style={styles.quickLogOptions}>
            {options.map((option) => (
              <Pressable
                key={option.label}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onClose();
                  option.onPress();
                }}
                style={({ pressed }) => [
                  styles.quickLogOption,
                  { backgroundColor: `${option.color}15`, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <View style={[styles.quickLogOptionIcon, { backgroundColor: `${option.color}25` }]}>
                  <Feather name={option.icon} size={24} color={option.color} />
                </View>
                <ThemedText type="body" style={{ color: theme.text, fontWeight: "500" }}>
                  {option.label}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function HomeScreen() {
  const { theme, isDark } = useTheme();
  const { t, language } = useLanguage();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<any>();
  const { navigateToPaywall, isFeatureLocked } = usePaywall();
  const { data, updateDailyLog, getTodaysDailyLog, getTodaysBeautyRoutine } = useApp();
  const layout = useLayout();

  const [sleepModalVisible, setSleepModalVisible] = useState(false);
  const [moodModalVisible, setMoodModalVisible] = useState(false);
  const [quickLogModalVisible, setQuickLogModalVisible] = useState(false);

  useFABHandler("HomeTab", useCallback(() => setQuickLogModalVisible(true), []));

  const settings = data.settings;
  const cycleSettings = settings.cycleSettings;
  const showFertile = settings.persona === "married" || settings.persona === "partner";

  const cycleData = useMemo(() => {
    if (!cycleSettings.lastPeriodStart || !cycleSettings.cycleLength) return null;
    
    const currentDay = getCurrentCycleDay(cycleSettings.lastPeriodStart, cycleSettings.cycleLength);
    const daysUntilPeriod = getDaysUntilNextPeriod(cycleSettings.lastPeriodStart, cycleSettings.cycleLength);
    const currentPhase = getDetailedCyclePhase(getTodayString(), cycleSettings.lastPeriodStart, cycleSettings);
    
    return { currentDay, daysUntilPeriod, currentPhase };
  }, [cycleSettings.lastPeriodStart, cycleSettings.cycleLength, cycleSettings.periodLength]);

  const todaysLog = getTodaysDailyLog();
  const beautyRoutine = getTodaysBeautyRoutine();

  const handleLogPeriod = () => {
    navigation.navigate("CalendarTab");
  };

  const handleAddWater = () => {
    const currentCups = todaysLog.waterCups || 0;
    if (currentCups < 8) {
      updateDailyLog({ waterCups: currentCups + 1 });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleRemoveWater = () => {
    const currentCups = todaysLog.waterCups || 0;
    if (currentCups > 0) {
      updateDailyLog({ waterCups: currentCups - 1 });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleSaveSleep = (hours: number) => {
    updateDailyLog({ sleepHours: hours });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleMoodSelect = (mood: Mood) => {
    updateDailyLog({ mood });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + Spacing.md,
          paddingBottom: tabBarHeight + Spacing.xl,
          paddingHorizontal: Spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        <HeaderSection
          userName={language === "ar" ? settings.nameAr || settings.name : settings.nameEn || settings.name}
          onNotificationPress={() => navigation.navigate("Notifications")}
        />

        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <View style={styles.cycleSection}>
            <CycleRing
              currentDay={cycleData?.currentDay ?? null}
              cycleLength={cycleSettings.cycleLength}
              periodLength={cycleSettings.periodLength}
              showFertile={showFertile}
              daysUntilNextPeriod={cycleData?.daysUntilPeriod ?? null}
              lastPeriodStart={cycleSettings.lastPeriodStart}
              onPeriodEndedPress={handleLogPeriod}
              onEditPeriod={handleLogPeriod}
            />
          </View>
        </Animated.View>

        {cycleData?.currentPhase ? (
          <PhaseBanner phase={cycleData.currentPhase} showFertile={showFertile} />
        ) : null}

        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <DaysStrip
            cycleSettings={cycleSettings}
            showFertile={showFertile}
            onDayPress={(date) => {
              Haptics.selectionAsync();
              navigation.navigate("CalendarTab", { selectedDate: date });
            }}
          />
        </Animated.View>

        <MoodGrid
          selectedMood={todaysLog.mood}
          onMoodSelect={handleMoodSelect}
        />

        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.quickActionsRow}>
          <QuickActionButton
            icon="drop"
            label={t('home', 'logPeriod')}
            color={theme.period}
            onPress={handleLogPeriod}
          />
          <QuickActionButton
            icon="moon"
            label={t('home', 'sleep')}
            color={theme.secondary}
            onPress={() => setSleepModalVisible(true)}
          />
          <QuickActionButton
            icon="heart"
            label={t('home', 'mood')}
            color={theme.accent}
            onPress={() => setMoodModalVisible(true)}
          />
          <QuickActionButton
            icon="sparkles"
            label={t('home', 'beauty')}
            color={theme.primary}
            onPress={() => navigation.navigate("BeautyTab")}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.section}>
          <View style={[styles.sectionHeader, { flexDirection: layout.flexDirection }]}>
            <ThemedText type="h3">{t('home', 'dailyInsights')}</ThemedText>
          </View>
          
          <View style={styles.cardsGrid}>
            <BeautyRoutineCard
              amCompleted={beautyRoutine.amSteps.length > 0}
              pmCompleted={beautyRoutine.pmSteps.length > 0}
              isPremium={isFeatureLocked("beautyPro")}
              onPress={() => navigation.navigate("BeautyTab")}
              onUpgradePress={navigateToPaywall}
            />
            <WaterTracker
              cups={todaysLog.waterCups || 0}
              maxCups={8}
              onAddCup={handleAddWater}
              onRemoveCup={handleRemoveWater}
            />
            <SleepTracker
              hours={todaysLog.sleepHours || null}
              onPress={() => setSleepModalVisible(true)}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.section}>
          <View style={[styles.sectionHeader, { flexDirection: layout.flexDirection }]}>
            <ThemedText type="h3">{language === "ar" ? "المقالات" : "Articles"}</ThemedText>
            <Pressable
              onPress={() => navigation.getParent()?.navigate("ProfileTab", { screen: "Articles" })}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <ThemedText type="body" style={{ color: theme.primary }}>
                {language === "ar" ? "عرض الكل" : "View All"}
              </ThemedText>
            </Pressable>
          </View>
          
          <Card
            style={styles.articlesCard}
            onPress={() => navigation.getParent()?.navigate("ProfileTab", { screen: "Articles" })}
          >
            <View style={[styles.articlesCardContent, { flexDirection: layout.flexDirection }]}>
              <View style={[styles.articlesIconContainer, { backgroundColor: `${theme.primary}20` }]}>
                <Feather name="book-open" size={24} color={theme.primary} />
              </View>
              <View style={styles.articlesTextContainer}>
                <ThemedText type="body" style={{ fontWeight: "600" }}>
                  {language === "ar" ? "اكتشفي المقالات" : "Explore Articles"}
                </ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary, marginTop: 2 }}>
                  {language === "ar" ? "نصائح صحية وجمالية وإيمانية" : "Health, beauty & faith tips"}
                </ThemedText>
              </View>
              <Feather 
                name={layout.isRTL ? "chevron-left" : "chevron-right"} 
                size={20} 
                color={theme.textSecondary} 
              />
            </View>
          </Card>
        </Animated.View>
      </ScrollView>

      <SleepLogModal
        visible={sleepModalVisible}
        onClose={() => setSleepModalVisible(false)}
        onSave={handleSaveSleep}
      />

      <MoodModal
        visible={moodModalVisible}
        onClose={() => setMoodModalVisible(false)}
        onSelect={handleMoodSelect}
      />

      <QuickLogModal
        visible={quickLogModalVisible}
        onClose={() => setQuickLogModalVisible(false)}
        onLogPeriod={() => {
          setQuickLogModalVisible(false);
          handleLogPeriod();
        }}
        onLogSleep={() => {
          setQuickLogModalVisible(false);
          setSleepModalVisible(true);
        }}
        onLogMood={() => {
          setQuickLogModalVisible(false);
          setMoodModalVisible(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: Spacing.xl,
  },
  headerTitleSection: {
    gap: Spacing.xs,
  },
  headerTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  headerTitle: {
    fontSize: 34,
  },
  headerNotification: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  headerGreetingRow: {
    alignItems: "center",
  },
  cycleSection: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  quickActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  quickActionButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.large,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  cardsGrid: {
    gap: Spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: Spacing.lg,
  },
  modalContent: {
    borderRadius: BorderRadius.xlarge,
    padding: Spacing.xl,
    ...Shadows.card,
  },
  sleepInputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },
  sleepQuickButton: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  sleepInput: {
    height: 50,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spacing.md,
    fontSize: 18,
    marginBottom: Spacing.lg,
  },
  modalButtons: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  modalButton: {
    flex: 1,
    height: 50,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  quickLogOptions: {
    gap: Spacing.md,
  },
  quickLogOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
    gap: Spacing.md,
  },
  quickLogOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  articlesCard: {
    padding: Spacing.md,
  },
  articlesCardContent: {
    alignItems: "center",
  },
  articlesIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.medium,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  articlesTextContainer: {
    flex: 1,
  },
});
