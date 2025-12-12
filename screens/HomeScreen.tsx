// @ts-nocheck
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import Svg, { Circle } from "react-native-svg";

import { useLanguage } from "../hooks/useLanguage";
import { useRTL } from "../hooks/useRTL";
import { useApp } from "../lib/AppContext";
import {
  getCurrentCycleDay,
  getDaysUntilNextPeriod,
  getDetailedCyclePhase,
} from "../lib/cycle-utils";
import { DarkTheme, GlassEffects, Typography, Spacing, BorderRadius, Shadows, getPersonaColor } from "../constants/theme";
import { QuickActionsSheet } from "../components/QuickActionsSheet";
import { articles } from "../data/articles";

const { width } = Dimensions.get("window");
const CARD_MARGIN = Spacing.lg;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { language } = useLanguage();
  const rtl = useRTL();
  const { data } = useApp();
  
  const [showQuickActions, setShowQuickActions] = useState(false);
  
  // Safety check
  if (!data || !data.settings) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {language === "ar" ? "جارٍ التحميل..." : "Loading..."}
          </Text>
        </View>
      </View>
    );
  }

  const settings = data.settings;
  const personaColor = getPersonaColor(settings.persona || "single");

  // Cycle data
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

  // Greeting
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

  // Phase label
  const getPhaseLabel = (phase: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      period: { ar: "الحيض", en: "Period" },
      follicular: { ar: "الجريبي", en: "Follicular" },
      ovulation: { ar: "الإباضة", en: "Ovulation" },
      luteal: { ar: "الأصفري", en: "Luteal" },
    };
    return language === "ar" ? labels[phase]?.ar || phase : labels[phase]?.en || phase;
  };

  // Handlers
  const handleNotificationPress = () => {
    Haptics.selectionAsync();
    navigation.navigate("Notifications" as never);
  };

  const handleCycleRingPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("CalendarTab" as never);
  };

  const handleQuickAccessPress = (screen: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate(screen as never);
  };

  const handleArticlePress = (articleId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ArticleDetail" as never, { articleId } as never);
  };

  // Quick actions for bottom sheet
  const quickActions = [
    {
      id: "cycle",
      icon: "calendar",
      titleAr: "تسجيل الدورة",
      titleEn: "Log Cycle",
      descriptionAr: "سجلي بداية أو نهاية الدورة",
      descriptionEn: "Record period start or end",
      onPress: () => navigation.navigate("Log" as never),
    },
    {
      id: "mood",
      icon: "smile",
      titleAr: "تسجيل المزاج",
      titleEn: "Log Mood",
      descriptionAr: "سجلي مزاجك اليوم",
      descriptionEn: "Record your mood today",
      onPress: () => navigation.navigate("Log" as never),
    },
    {
      id: "beauty",
      icon: "heart",
      titleAr: "روتين جمالي",
      titleEn: "Beauty Routine",
      descriptionAr: "أضيفي روتين جمالي جديد",
      descriptionEn: "Add a new beauty routine",
      onPress: () => navigation.navigate("BeautyTab" as never),
    },
    {
      id: "qadha",
      icon: "moon",
      titleAr: "قضاء صلاة",
      titleEn: "Qadha Prayer",
      descriptionAr: "سجلي قضاء صلاة",
      descriptionEn: "Log a qadha prayer",
      onPress: () => navigation.navigate("CalendarTab" as never),
    },
  ];

  // Featured articles
  const featuredArticles = articles.slice(0, 2);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + Spacing.md },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={[styles.header, { flexDirection: rtl.flexDirection }]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.greeting, { textAlign: rtl.textAlign }]}>
              {greeting}
            </Text>
            <Text style={[styles.userName, { textAlign: rtl.textAlign }]}>
              {userName}
            </Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.notificationButton,
              { opacity: pressed ? 0.6 : 1 },
            ]}
            onPress={handleNotificationPress}
          >
            <Feather name="bell" size={24} color={personaColor.primary} />
          </Pressable>
        </Animated.View>

        {/* Cycle Ring */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)}>
          <Pressable
            style={styles.cycleRingCard}
            onPress={handleCycleRingPress}
          >
            <LinearGradient
              colors={personaColor.gradient as any}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cycleRingGradient}
            >
              {/* Cycle Ring SVG */}
              <View style={styles.cycleRingContainer}>
                <Svg width={200} height={200}>
                  {/* Background circle */}
                  <Circle
                    cx={100}
                    cy={100}
                    r={85}
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth={12}
                    fill="none"
                  />
                  {/* Progress circle */}
                  <Circle
                    cx={100}
                    cy={100}
                    r={85}
                    stroke="#FFFFFF"
                    strokeWidth={12}
                    fill="none"
                    strokeDasharray={`${(cycleDay / settings.cycleLength) * 534} 534`}
                    strokeLinecap="round"
                    rotation="-90"
                    origin="100, 100"
                  />
                </Svg>
                
                {/* Center content */}
                <View style={styles.cycleRingCenter}>
                  <Text style={styles.cycleDayNumber}>{cycleDay}</Text>
                  <Text style={styles.cycleDayLabel}>
                    {language === "ar" ? "يوم" : "Day"}
                  </Text>
                  <View style={styles.cyclePhaseContainer}>
                    <Text style={styles.cyclePhaseLabel}>{getPhaseLabel(phaseResult)}</Text>
                  </View>
                </View>
              </View>

              {/* Days until period */}
              <View style={styles.daysUntilContainer}>
                <Text style={styles.daysUntilNumber}>{daysUntilPeriod}</Text>
                <Text style={styles.daysUntilLabel}>
                  {language === "ar" ? "أيام متبقية" : "days left"}
                </Text>
              </View>
            </LinearGradient>
          </Pressable>
        </Animated.View>

        {/* Primary Cards Row */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.primaryCardsRow}
        >
          {/* Qadha Card */}
          <Pressable
            style={[styles.primaryCard, { flex: 1 }]}
            onPress={() => handleQuickAccessPress("CalendarTab")}
          >
            <View style={[styles.glassCard, { flexDirection: rtl.flexDirection }]}>
              {Platform.OS === "ios" ? (
                <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
              ) : (
                <View style={[StyleSheet.absoluteFill, styles.glassBackground]} />
              )}
              
              <View style={[styles.primaryCardIcon, { backgroundColor: personaColor.soft }]}>
                <Feather name="moon" size={24} color={personaColor.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.primaryCardTitle, { textAlign: rtl.textAlign }]}>
                  {language === "ar" ? "القضاء" : "Qadha"}
                </Text>
                <Text style={[styles.primaryCardValue, { textAlign: rtl.textAlign }]}>
                  {language === "ar" ? "٥ صلوات" : "5 prayers"}
                </Text>
              </View>
            </View>
          </Pressable>

          {/* Affirmation Card */}
          <Pressable
            style={[styles.primaryCard, { flex: 1 }]}
            onPress={() => {}}
          >
            <View style={[styles.glassCard, { flexDirection: rtl.flexDirection }]}>
              {Platform.OS === "ios" ? (
                <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
              ) : (
                <View style={[StyleSheet.absoluteFill, styles.glassBackground]} />
              )}
              
              <View style={[styles.primaryCardIcon, { backgroundColor: personaColor.soft }]}>
                <Feather name="star" size={24} color={personaColor.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.primaryCardTitle, { textAlign: rtl.textAlign }]}>
                  {language === "ar" ? "تأكيد اليوم" : "Daily Affirmation"}
                </Text>
                <Text style={[styles.primaryCardSubtitle, { textAlign: rtl.textAlign }]} numberOfLines={2}>
                  {language === "ar" 
                    ? "أنتِ قوية وقادرة" 
                    : "You are strong and capable"}
                </Text>
              </View>
            </View>
          </Pressable>
        </Animated.View>

        {/* Quick Access Grid */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { textAlign: rtl.textAlign }]}>
              {language === "ar" ? "الوصول السريع" : "Quick Access"}
            </Text>
          </View>

          <View style={styles.quickAccessGrid}>
            {[
              { icon: "heart", titleAr: "الجمال", titleEn: "Beauty", screen: "BeautyTab" },
              { icon: "calendar", titleAr: "التقويم", titleEn: "Calendar", screen: "CalendarTab" },
              { icon: "book-open", titleAr: "المقالات", titleEn: "Articles", screen: "ProfileTab" },
              { icon: "user", titleAr: "الملف الشخصي", titleEn: "Profile", screen: "ProfileTab" },
            ].map((item, index) => (
              <Pressable
                key={item.screen}
                style={({ pressed }) => [
                  styles.quickAccessItem,
                  { opacity: pressed ? 0.6 : 1 },
                ]}
                onPress={() => handleQuickAccessPress(item.screen)}
              >
                <View style={[styles.glassCard]}>
                  {Platform.OS === "ios" ? (
                    <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                  ) : (
                    <View style={[StyleSheet.absoluteFill, styles.glassBackground]} />
                  )}
                  
                  <View style={[styles.quickAccessIcon, { backgroundColor: personaColor.soft }]}>
                    <Feather name={item.icon as any} size={28} color={personaColor.primary} />
                  </View>
                  <Text style={[styles.quickAccessLabel, { textAlign: rtl.textAlign }]}>
                    {language === "ar" ? item.titleAr : item.titleEn}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Featured Articles */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)}>
          <View style={[styles.sectionHeader, { flexDirection: rtl.flexDirection }]}>
            <Text style={[styles.sectionTitle, { textAlign: rtl.textAlign }]}>
              {language === "ar" ? "مقالات مميزة" : "Featured Articles"}
            </Text>
          </View>

          <View style={styles.articlesContainer}>
            {featuredArticles.map((article) => (
              <Pressable
                key={article.id}
                style={({ pressed }) => [
                  styles.articleCard,
                  { opacity: pressed ? 0.6 : 1 },
                ]}
                onPress={() => handleArticlePress(article.id)}
              >
                <View style={[styles.glassCard, { flexDirection: rtl.flexDirection }]}>
                  {Platform.OS === "ios" ? (
                    <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                  ) : (
                    <View style={[StyleSheet.absoluteFill, styles.glassBackground]} />
                  )}
                  
                  <View style={[styles.articleIcon, { backgroundColor: personaColor.soft }]}>
                    <Feather name="book-open" size={20} color={personaColor.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.articleTitle, { textAlign: rtl.textAlign }]} numberOfLines={2}>
                      {language === "ar" ? article.titleAr : article.titleEn}
                    </Text>
                    <Text style={[styles.articleCategory, { textAlign: rtl.textAlign }]}>
                      {language === "ar" ? article.categoryAr : article.categoryEn}
                    </Text>
                  </View>
                  <Feather
                    name={rtl.isRTL ? "chevron-left" : "chevron-right"}
                    size={20}
                    color={DarkTheme.text.tertiary}
                  />
                </View>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Bottom spacing for FAB */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Quick Actions Sheet */}
      <QuickActionsSheet
        visible={showQuickActions}
        onClose={() => setShowQuickActions(false)}
        actions={quickActions}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.background.root,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    ...Typography.body,
    color: DarkTheme.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: CARD_MARGIN,
    paddingBottom: Spacing.xl,
  },

  // Header
  header: {
    alignItems: "center",
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  greeting: {
    ...Typography.subheadline,
    color: DarkTheme.text.secondary,
    marginBottom: Spacing.xxs,
  },
  userName: {
    ...Typography.largeTitle,
    color: DarkTheme.text.primary,
  },
  notificationButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  // Cycle Ring
  cycleRingCard: {
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    ...Shadows.large,
  },
  cycleRingGradient: {
    padding: Spacing.xl,
    alignItems: "center",
  },
  cycleRingContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  cycleRingCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  cycleDayNumber: {
    fontSize: 56,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Tajawal-Bold",
  },
  cycleDayLabel: {
    ...Typography.callout,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: -Spacing.xs,
  },
  cyclePhaseContainer: {
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xxs,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: BorderRadius.sm,
  },
  cyclePhaseLabel: {
    ...Typography.footnote,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  daysUntilContainer: {
    alignItems: "center",
  },
  daysUntilNumber: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Tajawal-Bold",
  },
  daysUntilLabel: {
    ...Typography.subheadline,
    color: "rgba(255, 255, 255, 0.8)",
  },

  // Primary Cards
  primaryCardsRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  primaryCard: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  glassCard: {
    position: "relative",
    padding: Spacing.md,
    alignItems: "center",
    gap: Spacing.sm,
  },
  glassBackground: {
    backgroundColor: GlassEffects.background,
    borderWidth: 1,
    borderColor: GlassEffects.border,
  },
  primaryCardIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryCardTitle: {
    ...Typography.footnote,
    color: DarkTheme.text.secondary,
  },
  primaryCardValue: {
    ...Typography.title3,
    color: DarkTheme.text.primary,
    fontWeight: "600",
  },
  primaryCardSubtitle: {
    ...Typography.footnote,
    color: DarkTheme.text.secondary,
    marginTop: Spacing.xxs,
  },

  // Section Header
  sectionHeader: {
    marginBottom: Spacing.md,
    alignItems: "center",
  },
  sectionTitle: {
    ...Typography.title2,
    color: DarkTheme.text.primary,
    fontWeight: "600",
  },

  // Quick Access Grid
  quickAccessGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  quickAccessItem: {
    width: (width - CARD_MARGIN * 2 - Spacing.md) / 2,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  quickAccessIcon: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  quickAccessLabel: {
    ...Typography.callout,
    color: DarkTheme.text.primary,
    fontWeight: "600",
  },

  // Articles
  articlesContainer: {
    gap: Spacing.md,
  },
  articleCard: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  articleIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  articleTitle: {
    ...Typography.callout,
    color: DarkTheme.text.primary,
    fontWeight: "600",
    marginBottom: Spacing.xxs,
  },
  articleCategory: {
    ...Typography.caption2,
    color: DarkTheme.text.tertiary,
  },
});
