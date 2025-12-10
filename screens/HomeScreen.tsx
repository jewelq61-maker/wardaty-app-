import React from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { CycleRingDots } from "@/components/CycleRingDots";
import { ArticlesPreview } from "@/components/ArticlesPreview";
import { useLanguage } from "@/hooks/useLanguage";
import { useApp } from "@/lib/AppContext";
import {
  getCurrentCycleDay,
  getDaysUntilNextPeriod,
  getDetailedCyclePhase,
} from "@/lib/cycle-utils";
import {
  DarkTheme,
  PersonaColors,
  Spacing,
  BorderRadius,
  Typography,
  Shadows,
  Glass,
  getPersonaPrimary,
  getPersonaGlow,
} from "@/constants/theme";

interface QuickAction {
  id: string;
  icon: keyof typeof Feather.glyphMap;
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
    screen: "Beauty",
  },
  {
    id: "qadha",
    icon: "moon",
    titleAr: "القضاء",
    titleEn: "Qadha",
    screen: "Qadha",
  },
  {
    id: "articles",
    icon: "book-open",
    titleAr: "المقالات",
    titleEn: "Articles",
    screen: "Articles",
  },
  {
    id: "water",
    icon: "droplet",
    titleAr: "الماء",
    titleEn: "Water",
    screen: "Water",
  },
];

// Mock articles data
const mockArticles = [
  {
    id: "1",
    title: "فهم دورتك الشهرية",
    category: "صحة",
    readTime: "5 دقائق",
    excerpt: "دليل شامل لفهم مراحل الدورة الشهرية وتأثيرها على جسمك",
  },
  {
    id: "2",
    title: "العناية بالبشرة خلال الدورة",
    category: "جمال",
    readTime: "4 دقائق",
    excerpt: "نصائح للعناية بالبشرة في كل مرحلة من مراحل الدورة",
  },
  {
    id: "3",
    title: "التغذية والدورة الشهرية",
    category: "تغذية",
    readTime: "6 دقائق",
    excerpt: "الأطعمة المناسبة لكل مرحلة من مراحل دورتك",
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { t, language } = useLanguage();
  const { data } = useApp();

  // Safety check
  if (!data || !data.settings) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>
            {language === "ar" ? "جارٍ التحميل..." : "Loading..."}
          </ThemedText>
        </View>
      </View>
    );
  }

  const settings = data.settings;
  const logs = data.cycleLogs;
  const persona = settings.persona || "single";
  const personaColor = getPersonaPrimary(persona);

  // Calculate cycle data with safe defaults
  const cycleDay = settings.lastPeriodStart
    ? getCurrentCycleDay(settings.lastPeriodStart, settings.cycleLength)
    : 1;

  const daysUntilPeriod = settings.lastPeriodStart
    ? getDaysUntilNextPeriod(settings.lastPeriodStart, settings.cycleLength)
    : settings.cycleLength;

  const phase = settings.lastPeriodStart
    ? getDetailedCyclePhase(
        settings.lastPeriodStart,
        settings.cycleLength,
        settings.periodLength
      )
    : { phase: "follicular", description: "Follicular Phase", emoji: "🌱" };

  const handleQuickAction = (screen: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate(screen as never);
  };

  const handleArticlePress = (articleId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ArticleDetail" as never, { articleId } as never);
  };

  const handleViewAllArticles = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Articles" as never);
  };

  const handleNotifications = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Notifications" as never);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={styles.header}
        >
          <View>
            <ThemedText type="h1" style={styles.greeting}>
              {language === "ar" ? "مرحباً" : "Welcome"}
            </ThemedText>
            <ThemedText type="body" style={styles.subtitle}>
              {language === "ar" ? `اليوم ${cycleDay}` : `Day ${cycleDay}`}
            </ThemedText>
          </View>
          <Pressable onPress={handleNotifications} style={styles.notificationButton}>
            <BlurView intensity={80} tint="dark" style={styles.notificationBlur}>
              <Feather name="bell" size={20} color={personaColor} />
            </BlurView>
          </Pressable>
        </Animated.View>

        {/* Cycle Ring */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(100)}
          style={styles.ringSection}
        >
          <CycleRingDots
            cycleDay={cycleDay}
            cycleLength={settings.cycleLength}
            periodLength={settings.periodLength}
            persona={persona}
          />
        </Animated.View>

        {/* Cycle Info Card */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(200)}
          style={styles.infoCard}
        >
          <BlurView intensity={80} tint="dark" style={styles.cardBlur}>
            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <ThemedText type="caption" style={styles.infoLabel}>
                    {language === "ar" ? "الدورة القادمة" : "Next Period"}
                  </ThemedText>
                  <ThemedText type="h2" style={[styles.infoValue, { color: personaColor }]}>
                    {daysUntilPeriod}
                  </ThemedText>
                  <ThemedText type="caption" style={styles.infoUnit}>
                    {language === "ar" ? "يوم" : "days"}
                  </ThemedText>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoItem}>
                  <ThemedText type="caption" style={styles.infoLabel}>
                    {language === "ar" ? "المرحلة" : "Phase"}
                  </ThemedText>
                  <ThemedText type="h4" style={styles.phaseEmoji}>
                    {phase.emoji}
                  </ThemedText>
                  <ThemedText type="caption" style={styles.infoUnit}>
                    {phase.phase}
                  </ThemedText>
                </View>
              </View>
            </View>
          </BlurView>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(300)}
          style={styles.quickActionsSection}
        >
          <ThemedText type="h3" style={styles.sectionTitle}>
            {language === "ar" ? "إجراءات سريعة" : "Quick Actions"}
          </ThemedText>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <QuickActionCard
                key={action.id}
                action={action}
                language={language}
                personaColor={personaColor}
                onPress={() => handleQuickAction(action.screen)}
                delay={index * 50}
              />
            ))}
          </View>
        </Animated.View>

        {/* Articles Preview */}
        <Animated.View entering={FadeInDown.duration(400).delay(400)}>
          <ArticlesPreview
            articles={mockArticles}
            persona={persona}
            onArticlePress={handleArticlePress}
            onViewAllPress={handleViewAllArticles}
          />
        </Animated.View>

        {/* Bottom Spacing for FAB */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

interface QuickActionCardProps {
  action: QuickAction;
  language: string;
  personaColor: string;
  onPress: () => void;
  delay: number;
}

function QuickActionCard({
  action,
  language,
  personaColor,
  onPress,
  delay,
}: QuickActionCardProps) {
  return (
    <Animated.View entering={FadeInDown.duration(400).delay(delay)}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.quickActionCard,
          pressed && styles.quickActionCardPressed,
        ]}
      >
        <BlurView intensity={80} tint="dark" style={styles.quickActionBlur}>
          <View style={styles.quickActionContent}>
            <View style={[styles.quickActionIcon, { backgroundColor: `${personaColor}20` }]}>
              <Feather name={action.icon} size={24} color={personaColor} />
            </View>
            <ThemedText type="body" style={styles.quickActionTitle}>
              {language === "ar" ? action.titleAr : action.titleEn}
            </ThemedText>
          </View>
        </BlurView>
      </Pressable>
    </Animated.View>
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
    color: DarkTheme.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxxl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  greeting: {
    color: DarkTheme.text.primary,
    ...Typography.h1,
  },
  subtitle: {
    color: DarkTheme.text.secondary,
    marginTop: Spacing.xs,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.medium,
    overflow: "hidden",
  },
  notificationBlur: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Glass.tint,
    borderWidth: 1,
    borderColor: Glass.border,
  },
  ringSection: {
    alignItems: "center",
    marginVertical: Spacing.xxl,
  },
  infoCard: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.xxl,
    borderRadius: BorderRadius.large,
    overflow: "hidden",
    ...Shadows.card,
  },
  cardBlur: {
    backgroundColor: Glass.tint,
    borderWidth: 1,
    borderColor: Glass.border,
  },
  cardContent: {
    padding: Spacing.xl,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  infoItem: {
    flex: 1,
    alignItems: "center",
  },
  infoLabel: {
    color: DarkTheme.text.tertiary,
    marginBottom: Spacing.xs,
  },
  infoValue: {
    ...Typography.h2,
    marginVertical: Spacing.xs,
  },
  infoUnit: {
    color: DarkTheme.text.secondary,
  },
  phaseEmoji: {
    fontSize: 32,
    marginVertical: Spacing.xs,
  },
  divider: {
    width: 1,
    height: 60,
    backgroundColor: DarkTheme.border.subtle,
    marginHorizontal: Spacing.lg,
  },
  quickActionsSection: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    color: DarkTheme.text.primary,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  quickActionCard: {
    width: "48%",
    height: 100,
    borderRadius: BorderRadius.large,
    overflow: "hidden",
    ...Shadows.card,
  },
  quickActionCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  quickActionBlur: {
    flex: 1,
    backgroundColor: Glass.tint,
    borderWidth: 1,
    borderColor: Glass.border,
  },
  quickActionContent: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: "space-between",
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.medium,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionTitle: {
    color: DarkTheme.text.primary,
    ...Typography.body,
  },
});
