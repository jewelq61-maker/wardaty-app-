import React from "react";
import { View, StyleSheet, ScrollView, Pressable, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "../components/ThemedText";
import { useLanguage } from "../hooks/useLanguage";
import { useApp } from "../lib/AppContext";
import { useLayout } from "../lib/ThemePersonaContext";
import {
  getCurrentCycleDay,
  getDaysUntilNextPeriod,
  getDetailedCyclePhase,
} from "../lib/cycle-utils";
import { Theme, GlassEffects } from "../constants/theme";
import { articles } from "../data/articles";

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
  
  // Safety check
  if (!data || !data.settings) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>
            {language === "ar" ? "جارٍ التحميل..." : "Loading..."}
          </ThemedText>
        </View>
      </View>
    );
  }

  const settings = data.settings;
  const pregnancySettings = data.pregnancySettings;
  const { getPregnancyWeek, getPregnancyDaysRemaining } = useApp();

  // Check pregnancy mode
  const isPregnancyMode = pregnancySettings?.enabled || false;
  const pregnancyWeek = isPregnancyMode ? getPregnancyWeek() : null;
  const daysRemaining = isPregnancyMode ? getPregnancyDaysRemaining() : null;

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
  const phase = { name: phaseResult };

  const personaColor = Theme.getPersonaColor(settings.persona || "single");

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

  const handleArticlePress = (articleId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ArticleDetail" as never, { articleId } as never);
  };

  const handleSeeAllArticles = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ProfileTab" as never);
  };

  // Get featured articles (first 3)
  const featuredArticles = articles.slice(0, 3);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Theme.spacing.md,
            paddingBottom: insets.bottom + Theme.spacing.tabBarHeight + Theme.spacing.xxl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { flexDirection: layout.flexDirection }]}>
          <View style={styles.headerTextContainer}>
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
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Feather name="bell" size={Theme.iconSizes.medium} color={personaColor.primary} />
          </Pressable>
        </View>

        {/* Cycle or Pregnancy Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)}>
          <Pressable
            style={styles.cycleCard}
            onPress={() => handleCardPress(isPregnancyMode ? "Pregnancy" : "Calendar")}
          >
            <LinearGradient
              colors={personaColor.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cycleGradient}
            >
              {isPregnancyMode ? (
                <View style={[styles.cycleContent, { flexDirection: layout.flexDirection }]}>
                  <View style={styles.cycleInfo}>
                    <ThemedText style={[styles.cycleTitle, { textAlign: layout.textAlign }]}>
                      {language === "ar" ? "الأسبوع" : "Week"} {pregnancyWeek || 1}
                    </ThemedText>
                    <ThemedText style={[styles.cycleSubtitle, { textAlign: layout.textAlign }]}>
                      {language === "ar" ? "من الحمل" : "of pregnancy"}
                    </ThemedText>
                  </View>

                  <View style={styles.cycleDays}>
                    <ThemedText style={styles.cycleDaysNumber}>
                      {daysRemaining || 280}
                    </ThemedText>
                    <ThemedText style={styles.cycleDaysLabel}>
                      {language === "ar" ? "يوم متبقي" : "days left"}
                    </ThemedText>
                  </View>
                </View>
              ) : (
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
              )}
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
                  style={({ pressed }) => [
                    styles.actionCard,
                    { opacity: pressed ? 0.7 : 1 },
                  ]}
                  onPress={() => handleCardPress(action.screen)}
                >
                  <View style={[styles.actionIconContainer, { backgroundColor: personaColor.glow }]}>
                    <Feather name={action.icon as any} size={Theme.iconSizes.large} color={personaColor.primary} />
                  </View>
                  <ThemedText style={styles.actionTitle}>
                    {language === "ar" ? action.titleAr : action.titleEn}
                  </ThemedText>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Featured Articles */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { flexDirection: layout.flexDirection }]}>
            <ThemedText style={[styles.sectionTitle, { textAlign: layout.textAlign }]}>
              {language === "ar" ? "مقالات مميزة" : "Featured Articles"}
            </ThemedText>
            <Pressable onPress={handleSeeAllArticles}>
              <ThemedText style={[styles.seeAllButton, { color: personaColor.primary }]}>
                {language === "ar" ? "عرض الكل" : "See All"}
              </ThemedText>
            </Pressable>
          </View>

          {featuredArticles.map((article, index) => (
            <Animated.View
              key={article.id}
              entering={FadeInDown.delay(300 + index * 100).duration(600)}
            >
              <Pressable
                style={({ pressed }) => [
                  styles.articleCard,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
                onPress={() => handleArticlePress(article.id)}
              >
                <View style={styles.articleContent}>
                  <View style={[styles.articleIconContainer, { backgroundColor: personaColor.glow }]}>
                    <Feather name="book-open" size={Theme.iconSizes.medium} color={personaColor.primary} />
                  </View>
                  <View style={styles.articleText}>
                    <ThemedText style={[styles.articleTitle, { textAlign: layout.textAlign }]} numberOfLines={2}>
                      {language === "ar" ? article.titleAr : article.titleEn}
                    </ThemedText>
                    <ThemedText style={[styles.articleExcerpt, { textAlign: layout.textAlign }]} numberOfLines={2}>
                      {language === "ar" ? article.excerptAr : article.excerptEn}
                    </ThemedText>
                    <ThemedText style={[styles.articleMeta, { textAlign: layout.textAlign }]}>
                      {article.readTime} {language === "ar" ? "دقائق" : "min read"}
                    </ThemedText>
                  </View>
                </View>
              </Pressable>
            </Animated.View>
          ))}
        </View>

        {/* Today's Insights */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { textAlign: layout.textAlign }]}>
            {language === "ar" ? "رؤى اليوم" : "Today's Insights"}
          </ThemedText>

          <Animated.View entering={FadeInDown.delay(600).duration(600)}>
            <View style={styles.insightCard}>
              <View style={[styles.insightHeader, { flexDirection: layout.flexDirection }]}>
                <View style={[styles.insightIconContainer, { backgroundColor: personaColor.glow }]}>
                  <Feather name="activity" size={Theme.iconSizes.medium} color={personaColor.primary} />
                </View>
                <View style={styles.insightTextContainer}>
                  <ThemedText style={[styles.insightTitle, { textAlign: layout.textAlign }]}>
                    {language === "ar" ? "الطاقة" : "Energy Level"}
                  </ThemedText>
                  <ThemedText style={[styles.insightValue, { textAlign: layout.textAlign, color: personaColor.primary }]}>
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
    backgroundColor: Theme.dark.background.root,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    ...Theme.typography.body,
    color: Theme.dark.text.primary,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.screenPadding,
  },
  header: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Theme.spacing.lg,
  },
  headerTextContainer: {
    flex: 1,
  },
  greeting: {
    ...Theme.typography.subheadline,
    color: Theme.dark.text.secondary,
    marginBottom: Theme.spacing.xxxs,
  },
  userName: {
    ...Theme.typography.largeTitle,
    color: Theme.dark.text.primary,
  },
  notificationButton: {
    width: Theme.spacing.listItemHeight,
    height: Theme.spacing.listItemHeight,
    borderRadius: Theme.borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: GlassEffects.light.backgroundColor,
    borderWidth: GlassEffects.light.borderWidth,
    borderColor: GlassEffects.light.borderColor,
  },
  cycleCard: {
    marginBottom: Theme.spacing.xl,
    borderRadius: Theme.borderRadius.xlarge,
    overflow: "hidden",
    ...Theme.shadows.large,
  },
  cycleGradient: {
    padding: Theme.spacing.lg,
  },
  cycleContent: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  cycleInfo: {
    flex: 1,
  },
  cycleTitle: {
    ...Theme.typography.title1,
    color: "#FFFFFF",
    marginBottom: Theme.spacing.xxs,
  },
  cycleSubtitle: {
    ...Theme.typography.callout,
    color: "rgba(255, 255, 255, 0.8)",
  },
  cycleDays: {
    alignItems: "center",
  },
  cycleDaysNumber: {
    ...Theme.typography.largeTitle,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  cycleDaysLabel: {
    ...Theme.typography.footnote,
    color: "rgba(255, 255, 255, 0.8)",
  },
  section: {
    marginBottom: Theme.spacing.xl,
  },
  sectionHeader: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Theme.spacing.md,
  },
  sectionTitle: {
    ...Theme.typography.title3,
    color: Theme.dark.text.primary,
    marginBottom: Theme.spacing.md,
  },
  seeAllButton: {
    ...Theme.typography.callout,
    fontWeight: "600",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -Theme.spacing.xs,
  },
  actionItem: {
    width: "50%",
    padding: Theme.spacing.xs,
  },
  actionCard: {
    backgroundColor: GlassEffects.light.backgroundColor,
    borderWidth: GlassEffects.light.borderWidth,
    borderColor: GlassEffects.light.borderColor,
    borderRadius: Theme.borderRadius.large,
    padding: Theme.spacing.md,
    alignItems: "center",
    minHeight: 120,
    justifyContent: "center",
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Theme.spacing.sm,
  },
  actionTitle: {
    ...Theme.typography.callout,
    color: Theme.dark.text.primary,
    textAlign: "center",
  },
  articleCard: {
    backgroundColor: GlassEffects.light.backgroundColor,
    borderWidth: GlassEffects.light.borderWidth,
    borderColor: GlassEffects.light.borderColor,
    borderRadius: Theme.borderRadius.large,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  articleContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  articleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginEnd: Theme.spacing.sm,
  },
  articleText: {
    flex: 1,
  },
  articleTitle: {
    ...Theme.typography.headline,
    color: Theme.dark.text.primary,
    marginBottom: Theme.spacing.xxs,
  },
  articleExcerpt: {
    ...Theme.typography.footnote,
    color: Theme.dark.text.secondary,
    marginBottom: Theme.spacing.xxs,
  },
  articleMeta: {
    ...Theme.typography.caption1,
    color: Theme.dark.text.tertiary,
  },
  insightCard: {
    backgroundColor: GlassEffects.light.backgroundColor,
    borderWidth: GlassEffects.light.borderWidth,
    borderColor: GlassEffects.light.borderColor,
    borderRadius: Theme.borderRadius.large,
    padding: Theme.spacing.md,
  },
  insightHeader: {
    alignItems: "center",
    marginBottom: Theme.spacing.sm,
  },
  insightIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginEnd: Theme.spacing.sm,
  },
  insightTextContainer: {
    flex: 1,
  },
  insightTitle: {
    ...Theme.typography.callout,
    color: Theme.dark.text.secondary,
    marginBottom: Theme.spacing.xxxs,
  },
  insightValue: {
    ...Theme.typography.headline,
  },
  insightDescription: {
    ...Theme.typography.footnote,
    color: Theme.dark.text.secondary,
    lineHeight: 20,
  },
});
