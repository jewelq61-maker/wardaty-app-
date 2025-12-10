import { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useLanguage } from "@/hooks/useLanguage";
import { useApp } from "@/lib/AppContext";
import { useLayout } from "@/lib/ThemePersonaContext";
import {
  getCurrentCycleDay,
  getDaysUntilNextPeriod,
  getDetailedCyclePhase,
} from "@/lib/cycle-utils";
import {
  DarkBackgrounds,
  PersonaColors,
  NeutralColors,
  GlassStyles,
  getPersonaPrimary,
} from "@/constants/colors";
import {
  Spacing,
  BorderRadius,
  Typography,
  Shadows,
  IconSizes,
  Layout,
} from "@/constants/design-tokens";

const { width } = Dimensions.get("window");

interface QuickAction {
  id: string;
  icon: string;
  titleAr: string;
  titleEn: string;
  screen: string;
}

const quickActions: QuickAction[] = [
  {
    id: "beauty",
    icon: "heart",
    titleAr: "الجمال",
    titleEn: "Beauty",
    screen: "BeautyTab",
  },
  {
    id: "qadha",
    icon: "moon",
    titleAr: "القضاء",
    titleEn: "Qadha",
    screen: "CalendarTab",
  },
  {
    id: "articles",
    icon: "book-open",
    titleAr: "المقالات",
    titleEn: "Articles",
    screen: "ProfileTab",
  },
  {
    id: "profile",
    icon: "user",
    titleAr: "الملف الشخصي",
    titleEn: "Profile",
    screen: "ProfileTab",
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { t, language } = useLanguage();
  const layout = useLayout();
  const { data } = useApp();
  
  // Safety check: if data is not loaded yet, show loading or use defaults
  if (!data || !data.settings) {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ThemedText style={{ color: NeutralColors.white }}>
            {language === "ar" ? "جارٍ التحميل..." : "Loading..."}
          </ThemedText>
        </View>
      </View>
    );
  }

  const settings = data.settings;
  const logs = data.cycleLogs;

  // Safe defaults when no period data exists
  const cycleDay = settings.lastPeriodStart 
    ? getCurrentCycleDay(settings.lastPeriodStart, settings.cycleLength)
    : 1;
  const daysUntilPeriod = settings.lastPeriodStart
    ? getDaysUntilNextPeriod(settings.lastPeriodStart, settings.cycleLength)
    : settings.cycleLength;
  const today = new Date().toISOString().split("T")[0];
  const phaseResult = settings.lastPeriodStart
    ? getDetailedCyclePhase(today, settings.lastPeriodStart, {
        cycleLength: settings.cycleLength,
        periodLength: settings.periodLength,
        lastPeriodStart: settings.lastPeriodStart,
      })
    : "follicular";
  const phase = { name: phaseResult };

  const personaColor = getPersonaPrimary(settings.persona || "single");

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
  const userName = settings?.name || (language === "ar" ? "حبيبتي" : "Dear");

  const handleNotificationPress = () => {
    Haptics.selectionAsync();
    navigation.navigate("Notifications" as never);
  };

  const handleCardPress = (screen: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate(screen as never);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing.lg,
            paddingBottom: insets.bottom + Layout.bottomNavHeight + Spacing["2xl"],
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { flexDirection: layout.flexDirection }]}>
          <View style={{ flex: 1 }}>
            <ThemedText style={[styles.greeting, { textAlign: layout.textAlign }]}>
              {greeting}
            </ThemedText>
            <ThemedText style={[styles.userName, { textAlign: layout.textAlign }]}>
              {userName}
            </ThemedText>
          </View>
          
          <Pressable
            onPress={handleNotificationPress}
            style={({ pressed }) => [
              styles.notificationButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Feather name="bell" size={IconSizes.base} color={personaColor} />
          </Pressable>
        </View>

        {/* Cycle Card */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(600)}
        >
          <Pressable
            style={styles.cycleCard}
            onPress={() => handleCardPress("Calendar")}
          >
            <LinearGradient
              colors={PersonaColors[settings.persona || "single"].gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cycleGradient}
            >
              <View style={[styles.cycleContent, { flexDirection: layout.flexDirection }]}>
                <View style={styles.cycleInfo}>
                  <ThemedText style={[styles.cycleTitle, { textAlign: layout.textAlign }]}>
                    {language === "ar" ? "اليوم" : "Day"} {cycleDay}
                  </ThemedText>
                  <ThemedText style={[styles.cycleSubtitle, { textAlign: layout.textAlign }]}>
                    {phase.name}
                  </ThemedText>
                </View>

                <View style={styles.cycleDays}>
                  <ThemedText style={styles.cycleDaysNumber}>
                    {daysUntilPeriod}
                  </ThemedText>
                  <ThemedText style={styles.cycleDaysLabel}>
                    {language === "ar" ? "أيام متبقية" : "days left"}
                  </ThemedText>
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        </Animated.View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { textAlign: layout.textAlign }]}>
            {language === "ar" ? "الإجراءات السريعة" : "Quick Actions"}
          </ThemedText>

          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <Animated.View
                key={action.id}
                entering={FadeInDown.delay(200 + index * 50).duration(600)}
                style={styles.actionItem}
              >
                <Pressable
                  style={styles.actionCard}
                  onPress={() => handleCardPress(action.screen)}
                >
                  <View style={styles.glassCard}>
                    <View style={[styles.actionIconContainer, { backgroundColor: `${personaColor}20` }]}>
                      <Feather name={action.icon as any} size={IconSizes.lg} color={personaColor} />
                    </View>
                    <ThemedText style={[styles.actionTitle, { textAlign: "center" }]}>
                      {language === "ar" ? action.titleAr : action.titleEn}
                    </ThemedText>
                  </View>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Today's Insights */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { textAlign: layout.textAlign }]}>
            {language === "ar" ? "رؤى اليوم" : "Today's Insights"}
          </ThemedText>

          <Animated.View entering={FadeInDown.delay(400).duration(600)}>
            <View style={styles.glassCard}>
              <View style={[styles.insightHeader, { flexDirection: layout.flexDirection }]}>
                <View style={[styles.insightIconContainer, { backgroundColor: `${personaColor}20` }]}>
                  <Feather name="activity" size={IconSizes.base} color={personaColor} />
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText style={[styles.insightTitle, { textAlign: layout.textAlign }]}>
                    {language === "ar" ? "الطاقة" : "Energy Level"}
                  </ThemedText>
                  <ThemedText style={[styles.insightValue, { textAlign: layout.textAlign, color: personaColor }]}>
                    {language === "ar" ? "متوسطة" : "Moderate"}
                  </ThemedText>
                </View>
              </View>
              <ThemedText style={[styles.insightDescription, { textAlign: layout.textAlign }]}>
                {language === "ar" 
                  ? "مستوى طاقتك متوسط اليوم. حاولي أخذ فترات راحة قصيرة."
                  : "Your energy level is moderate today. Try taking short breaks."}
              </ThemedText>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkBackgrounds.base,
  },
  scrollContent: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
  },

  // Header
  header: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  greeting: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    fontWeight: Typography.body.fontWeight,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: Spacing.xs,
  },
  userName: {
    fontSize: Typography.h2.fontSize,
    lineHeight: Typography.h2.lineHeight,
    fontWeight: Typography.h2.fontWeight,
    color: NeutralColors.white,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: DarkBackgrounds.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },

  // Cycle Card
  cycleCard: {
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    marginBottom: Spacing.xl,
  },
  cycleGradient: {
    padding: Spacing.xl,
  },
  cycleContent: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  cycleInfo: {
    flex: 1,
  },
  cycleTitle: {
    fontSize: Typography.h1.fontSize,
    lineHeight: Typography.h1.lineHeight,
    fontWeight: Typography.h1.fontWeight,
    color: NeutralColors.white,
    marginBottom: Spacing.xs,
  },
  cycleSubtitle: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    fontWeight: Typography.body.fontWeight,
    color: "rgba(255, 255, 255, 0.9)",
  },
  cycleDays: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  cycleDaysNumber: {
    fontSize: Typography.h1.fontSize,
    lineHeight: Typography.h1.lineHeight,
    fontWeight: Typography.h1.fontWeight,
    color: NeutralColors.white,
  },
  cycleDaysLabel: {
    fontSize: Typography.caption.fontSize,
    lineHeight: Typography.caption.lineHeight,
    fontWeight: Typography.caption.fontWeight,
    color: "rgba(255, 255, 255, 0.9)",
  },

  // Section
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.h3.fontSize,
    lineHeight: Typography.h3.lineHeight,
    fontWeight: Typography.h3.fontWeight,
    color: NeutralColors.white,
    marginBottom: Spacing.lg,
  },

  // Quick Actions Grid
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.base,
  },
  actionItem: {
    width: (width - Layout.screenPaddingHorizontal * 2 - Spacing.base) / 2,
  },
  actionCard: {
    width: "100%",
  },
  glassCard: {
    backgroundColor: DarkBackgrounds.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    ...Shadows.dark.md,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  actionTitle: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    fontWeight: Typography.body.fontWeight,
    color: NeutralColors.white,
  },

  // Insights
  insightHeader: {
    alignItems: "center",
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  insightIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  insightTitle: {
    fontSize: Typography.label.fontSize,
    lineHeight: Typography.label.lineHeight,
    fontWeight: Typography.label.fontWeight,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: Spacing.xs,
  },
  insightValue: {
    fontSize: Typography.h4.fontSize,
    lineHeight: Typography.h4.lineHeight,
    fontWeight: Typography.h4.fontWeight,
  },
  insightDescription: {
    fontSize: Typography.bodySmall.fontSize,
    lineHeight: Typography.bodySmall.lineHeight,
    fontWeight: Typography.bodySmall.fontWeight,
    color: "rgba(255, 255, 255, 0.7)",
  },
});
