import React, { useCallback } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { FeatureCard } from "@/components/FeatureCard";
import { AppIcon } from "@/components/AppIcon";
import { GlassCard } from "@/components/UIKit";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { usePaywall } from "@/hooks/usePaywall";
import { Spacing, BorderRadius } from "@/constants/theme";
import { useApp } from "@/lib/AppContext";
import { useLayout } from "@/lib/ThemePersonaContext";
import { useFABHandler } from "@/contexts/FABContext";
import { getCurrentCycleDay } from "@/lib/cycle-utils";
import type { AppIconName } from "@/components/AppIcon";
import type { TranslationKeys } from "@/lib/translations";

interface ThemeColors {
  text: string;
  textSecondary: string;
  backgroundRoot: string;
  backgroundDefault: string;
  backgroundSecondary: string;
  primary: string;
  primaryLight: string;
  glassBackground: string;
  glassBorder: string;
}

function StatPill({
  icon,
  label,
  value,
  color,
  onPress,
  trend,
}: {
  icon: AppIconName;
  label: string;
  value: string | number;
  color: string;
  onPress?: () => void;
  trend?: { direction: "up" | "down" | "neutral"; percentage: number };
}) {
  const { theme, isDark } = useTheme();

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.direction === "up") return "trending-up";
    if (trend.direction === "down") return "trending-down";
    return "minus";
  };

  const getTrendColor = () => {
    if (!trend) return theme.textSecondary;
    if (trend.direction === "up") return theme.qadha;
    if (trend.direction === "down") return theme.error;
    return theme.textSecondary;
  };

  const content = (
    <View style={styles.statPillContent}>
      <View style={[styles.statPillIcon, { backgroundColor: `${color}15` }]}>
        <AppIcon name={icon} size={16} color={color} weight="semibold" />
      </View>
      <View style={styles.statPillText}>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {label}
        </ThemedText>
        <View style={{ flexDirection: "row", alignItems: "center", gap: Spacing.xs }}>
          <ThemedText type="h4" style={{ color: theme.text }}>
            {value}
          </ThemedText>
          {trend && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
              <Feather name={getTrendIcon()!} size={12} color={getTrendColor()} />
              <ThemedText type="small" style={{ color: getTrendColor() }}>
                {trend.percentage}%
              </ThemedText>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const pillStyle = {
    backgroundColor: isDark
      ? "rgba(255,255,255,0.06)"
      : "rgba(0,0,0,0.025)",
    borderWidth: 0.5,
    borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
  };

  if (onPress) {
    return (
      <Pressable
        onPress={() => {
          Haptics.selectionAsync();
          onPress();
        }}
        style={({ pressed }) => [
          styles.statPill,
          pillStyle,
          { opacity: pressed ? 0.7 : 1 },
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View style={[styles.statPill, pillStyle]}>
      {content}
    </View>
  );
}

function EnhancedProfileCard({
  name,
  persona,
  isSubscribed,
  isDarkMode,
  onPress,
  t,
  greeting,
}: {
  name: string;
  persona: string;
  isSubscribed: boolean;
  isDarkMode: boolean;
  onPress: () => void;
  t: (section: keyof TranslationKeys, key: string) => string;
  greeting: string;
}) {
  const { theme, isDark } = useTheme();
  const layout = useLayout();

  const getPersonaLabel = () => {
    const labels: Record<string, string> = {
      single: t("profile", "single"),
      partner: t("profile", "partner"),
      married: t("profile", "married"),
      mother: t("profile", "mother"),
    };
    return labels[persona] || persona;
  };

  const getPersonaIcon = (): keyof typeof Feather.glyphMap => {
    const icons: Record<string, keyof typeof Feather.glyphMap> = {
      single: "user",
      partner: "link",
      married: "heart",
      mother: "users",
    };
    return icons[persona] || "user";
  };

  const displayName = name || t("profile", "dear");
  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
    >
      <GlassCard>
        <View style={styles.unifiedProfileCard}>
          <View style={[styles.greetingRow, { flexDirection: layout.flexDirection }]}>
            <View style={{ alignItems: layout.alignSelf }}>
              <ThemedText
                type="caption"
                style={{
                  color: theme.primary,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  textAlign: layout.textAlign,
                }}
              >
                {greeting}
              </ThemedText>
            </View>
            <Feather
              name={layout.isRTL ? "chevron-left" : "chevron-right"}
              size={20}
              color={theme.textSecondary}
            />
          </View>
          <View style={[styles.profileCardContent, { flexDirection: layout.flexDirection }]}>
            <View style={[styles.avatar, { backgroundColor: theme.primaryLight }]}>
              <ThemedText type="h2" style={{ color: "#FFFFFF" }}>
                {firstLetter}
              </ThemedText>
            </View>
            <View style={[styles.profileInfo, { alignItems: layout.alignSelf }]}>
              <View style={[styles.nameRow, { flexDirection: layout.flexDirection }]}>
                <ThemedText type="h2" style={{ textAlign: layout.textAlign }}>
                  {displayName}
                </ThemedText>
                <Feather name="edit-2" size={16} color={theme.textSecondary} style={{ [layout.marginStart]: Spacing.sm }} />
              </View>
              <View style={[styles.badges, { flexDirection: layout.flexDirection }]}>
                <View style={[styles.badge, { backgroundColor: theme.backgroundSecondary }]}>
                  <Feather name={getPersonaIcon()} size={14} color={theme.primary} />
                  <ThemedText type="small" style={{ color: theme.primary, marginStart: Spacing.xs }}>
                    {getPersonaLabel()}
                  </ThemedText>
                </View>
                <View style={[styles.badge, { backgroundColor: isDarkMode ? theme.backgroundTertiary : theme.primarySoft }]}>
                  <Feather name={isDarkMode ? "moon" : "sun"} size={14} color={isDarkMode ? theme.accent : theme.primary} />
                </View>
                {isSubscribed ? (
                  <View style={[styles.badge, { backgroundColor: theme.secondary }]}>
                    <Feather name="award" size={14} color="#FFFFFF" />
                    <ThemedText type="small" style={{ color: "#FFFFFF", marginStart: Spacing.xs }}>
                      Plus
                    </ThemedText>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        </View>
      </GlassCard>
    </Pressable>
  );
}

function SubscriptionPromoCard({
  onPress,
  t,
  isArabic,
}: {
  onPress: () => void;
  t: (section: keyof TranslationKeys, key: string) => string;
  isArabic: boolean;
}) {
  const { theme, isDark } = useTheme();

  const features = isArabic
    ? ["تتبع القضاء", "روتين العناية بالجمال", "مقالات صحية", "تتبع البنات"]
    : ["Qadha Tracking", "Beauty Routines", "Health Articles", "Daughter Tracking"];

  const cardContent = (
    <View style={styles.promoCardContent}>
      <View style={styles.promoHeader}>
        <View style={[styles.promoIconContainer, { backgroundColor: `${theme.warning}20` }]}>
          <AppIcon name="star" size={22} color={theme.warning} weight="semibold" />
        </View>
        <View style={styles.promoTextContainer}>
          <ThemedText type="h4" style={{ color: theme.warning }}>
            {t("profile", "wardatyPlus")}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {t("profile", "unlockPremium")}
          </ThemedText>
        </View>
      </View>

      <View style={styles.promoFeatures}>
        {features.map((feature, index) => (
          <View key={index} style={styles.promoFeatureItem}>
            <AppIcon name="checkmark" size={14} color={theme.qadha} weight="bold" />
            <ThemedText type="small" style={{ marginStart: Spacing.xs, color: theme.text }}>
              {feature}
            </ThemedText>
          </View>
        ))}
      </View>

      <View style={[styles.promoButton, { backgroundColor: theme.warning }]}>
        <ThemedText type="body" style={{ color: "#fff", fontWeight: "600" }}>
          {t("profile", "upgradeNow")}
        </ThemedText>
        <AppIcon name="chevronRight" size={16} color="#fff" />
      </View>
    </View>
  );

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
    >
      <GlassCard style={{ borderColor: `${theme.warning}40` }}>
        {cardContent}
      </GlassCard>
    </Pressable>
  );
}

function SubscriptionStatusCard({
  statusText,
  t,
}: {
  statusText: string;
  t: (section: keyof TranslationKeys, key: string) => string;
}) {
  const { theme } = useTheme();
  const layout = useLayout();

  return (
    <GlassCard>
      <View style={[styles.subscriptionStatusContent, { flexDirection: layout.flexDirection }]}>
        <View style={[styles.subscriptionIcon, { backgroundColor: `${theme.secondary}20` }]}>
          <AppIcon name="star" size={20} color={theme.secondary} weight="semibold" />
        </View>
        <View style={[styles.subscriptionInfo, { alignItems: layout.alignSelf }]}>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {t("profile", "subscriptionStatus")}
          </ThemedText>
          <ThemedText type="body" style={{ fontWeight: "600", color: theme.secondary }}>
            {statusText}
          </ThemedText>
        </View>
        <AppIcon name="checkmark.circle" size={24} color={theme.qadha} />
      </View>
    </GlassCard>
  );
}

function SupportListItem({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress?: () => void;
}) {
  const { theme, isDark } = useTheme();
  const layout = useLayout();

  return (
    <Pressable
      onPress={() => {
        if (onPress) {
          Haptics.selectionAsync();
          onPress();
        }
      }}
      style={({ pressed }) => [
        styles.supportItem,
        {
          backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
          opacity: pressed ? 0.7 : 1,
          flexDirection: layout.flexDirection,
        },
      ]}
    >
      <View style={[styles.supportItemIcon, { backgroundColor: `${theme.primary}15` }]}>
        <Feather name={icon} size={18} color={theme.primary} />
      </View>
      <ThemedText type="body" style={{ flex: 1, textAlign: layout.textAlign }}>
        {label}
      </ThemedText>
      <Feather
        name={layout.isRTL ? "chevron-left" : "chevron-right"}
        size={18}
        color={theme.textSecondary}
      />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme, isDark } = useTheme();
  const { t, isRTL, language } = useLanguage();
  const layout = useLayout();
  const navigation = useNavigation<any>();
  const { data } = useApp();
  const { isPlus, isTrial, isFeatureLocked, checkAndNavigate, navigateToPaywall, getSubscriptionStatusText } = usePaywall();

  const { settings, qadhaSummary, beautyRoutineLogs } = data;
  const { name, persona, isSubscribed } = settings;
  const isArabic = language === "ar";

  useFABHandler("ProfileTab", useCallback(() => navigation.navigate("Settings"), [navigation]));

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return t("profile", "goodMorning");
    if (hour >= 12 && hour < 17) return t("profile", "goodAfternoon");
    return t("profile", "goodEvening");
  };

  const currentCycleDay = getCurrentCycleDay(
    settings.cycleSettings.lastPeriodStart,
    settings.cycleSettings.cycleLength
  );

  const getWeeklyBeautyCount = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    return beautyRoutineLogs.filter((log) => {
      const logDate = new Date(log.date);
      return logDate >= startOfWeek && (log.amSteps.length > 0 || log.pmSteps.length > 0);
    }).length;
  };

  const weeklyBeautyCount = getWeeklyBeautyCount();
  const greeting = getTimeBasedGreeting();
  const displayName = name || t("profile", "dear");
  const subscriptionStatus = getSubscriptionStatusText();
  const subscriptionStatusText = isArabic ? subscriptionStatus.ar : subscriptionStatus.en;

  // Wellness Stats calculations with trends
  const getWeeklyWellnessStats = () => {
    const today = new Date();
    
    // This week
    const startOfThisWeek = new Date(today);
    startOfThisWeek.setDate(today.getDate() - 7);
    startOfThisWeek.setHours(0, 0, 0, 0);

    const thisWeekLogs = data.dailyLogs.filter((log) => {
      const logDate = new Date(log.date);
      return logDate >= startOfThisWeek;
    });

    // Last week
    const startOfLastWeek = new Date(today);
    startOfLastWeek.setDate(today.getDate() - 14);
    const endOfLastWeek = new Date(today);
    endOfLastWeek.setDate(today.getDate() - 7);

    const lastWeekLogs = data.dailyLogs.filter((log) => {
      const logDate = new Date(log.date);
      return logDate >= startOfLastWeek && logDate < endOfLastWeek;
    });

    // This week stats
    const totalWater = thisWeekLogs.reduce((sum, log) => sum + (log.waterCups || 0), 0);
    const totalSleep = thisWeekLogs.reduce((sum, log) => sum + (log.sleepHours || 0), 0);
    const daysWithData = thisWeekLogs.filter(log => (log.waterCups || 0) > 0 || (log.sleepHours || 0) > 0).length;

    const avgWater = daysWithData > 0 ? Math.round(totalWater / daysWithData) : 0;
    const avgSleep = daysWithData > 0 ? Math.round((totalSleep / daysWithData) * 10) / 10 : 0;

    // Last week stats
    const lastWeekTotalWater = lastWeekLogs.reduce((sum, log) => sum + (log.waterCups || 0), 0);
    const lastWeekTotalSleep = lastWeekLogs.reduce((sum, log) => sum + (log.sleepHours || 0), 0);
    const lastWeekDaysWithData = lastWeekLogs.filter(log => (log.waterCups || 0) > 0 || (log.sleepHours || 0) > 0).length;

    const lastWeekAvgWater = lastWeekDaysWithData > 0 ? Math.round(lastWeekTotalWater / lastWeekDaysWithData) : 0;
    const lastWeekAvgSleep = lastWeekDaysWithData > 0 ? Math.round((lastWeekTotalSleep / lastWeekDaysWithData) * 10) / 10 : 0;

    // Calculate trends
    const waterTrend = lastWeekAvgWater > 0 ? {
      direction: avgWater > lastWeekAvgWater ? "up" as const : avgWater < lastWeekAvgWater ? "down" as const : "neutral" as const,
      percentage: Math.abs(Math.round(((avgWater - lastWeekAvgWater) / lastWeekAvgWater) * 100)),
    } : undefined;

    const sleepTrend = lastWeekAvgSleep > 0 ? {
      direction: avgSleep > lastWeekAvgSleep ? "up" as const : avgSleep < lastWeekAvgSleep ? "down" as const : "neutral" as const,
      percentage: Math.abs(Math.round(((avgSleep - lastWeekAvgSleep) / lastWeekAvgSleep) * 100)),
    } : undefined;

    return { avgWater, avgSleep, daysTracked: daysWithData, waterTrend, sleepTrend };
  };

  const wellnessStats = getWeeklyWellnessStats();

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
      <Animated.View entering={FadeIn.duration(400)}>
        <View style={styles.section}>
          <EnhancedProfileCard
            name={name}
            persona={persona}
            isSubscribed={isSubscribed}
            isDarkMode={isDark}
            onPress={() => navigation.navigate("EditProfile")}
            t={t}
            greeting={greeting}
          />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(100)}>
        <View style={styles.section}>
          {!isPlus && !isTrial ? (
            <SubscriptionPromoCard
              onPress={navigateToPaywall}
              t={t}
              isArabic={isArabic}
            />
          ) : (
            <SubscriptionStatusCard
              statusText={subscriptionStatusText}
              t={t}
            />
          )}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(200)}>
        <View style={styles.section}>
          <ThemedText
            type="caption"
            style={{
              color: theme.textSecondary,
              marginBottom: Spacing.sm,
              textTransform: "uppercase",
              letterSpacing: 1,
              textAlign: layout.textAlign,
            }}
          >
            {t("profile", "cycleStats")}
          </ThemedText>
          <View style={styles.statsRow}>
            <StatPill
              icon="calendar"
              label={t("profile", "cycleDay")}
              value={currentCycleDay ? `${currentCycleDay}` : "--"}
              color={theme.primary}
            />
            <StatPill
              icon="clock"
              label={t("profile", "avgCycle")}
              value={`${settings.cycleSettings.cycleLength} ${t("settings", "days")}`}
              color={theme.secondary}
            />
          </View>
        </View>
      </Animated.View>

      {(isPlus || isTrial) ? (
        <Animated.View entering={FadeInDown.duration(400).delay(250)}>
          <View style={styles.section}>
            <ThemedText
              type="caption"
              style={{
                color: theme.textSecondary,
                marginBottom: Spacing.sm,
                textTransform: "uppercase",
                letterSpacing: 1,
                textAlign: layout.textAlign,
              }}
            >
              {t("profile", "qadhaStats")}
            </ThemedText>
            <View style={styles.statsRow}>
              <StatPill
                icon="book"
                label={t("profile", "remaining")}
                value={qadhaSummary.remaining}
                color={theme.period}
                onPress={() => navigation.navigate("Qadha")}
              />
              <StatPill
                icon="checkmark.circle"
                label={t("profile", "madeUp")}
                value={qadhaSummary.totalMadeUp}
                color={theme.qadha}
                onPress={() => navigation.navigate("Qadha")}
              />
            </View>
          </View>
        </Animated.View>
      ) : null}

      <Animated.View entering={FadeInDown.duration(400).delay(300)}>
        <View style={styles.section}>
          <ThemedText
            type="caption"
            style={{
              color: theme.textSecondary,
              marginBottom: Spacing.sm,
              textTransform: "uppercase",
              letterSpacing: 1,
              textAlign: layout.textAlign,
            }}
          >
            {t("profile", "beautyStats")}
          </ThemedText>
          <View style={styles.statsRow}>
            <StatPill
              icon="sparkles"
              label={t("profile", "routinesThisWeek")}
              value={weeklyBeautyCount}
              color={theme.primaryLight}
            />
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(325)}>
        <View style={styles.section}>
          <ThemedText
            type="caption"
            style={{
              color: theme.textSecondary,
              marginBottom: Spacing.sm,
              textTransform: "uppercase",
              letterSpacing: 1,
              textAlign: layout.textAlign,
            }}
          >
            {t("wellness", "title")}
          </ThemedText>
          <View style={styles.statsRow}>
            <StatPill
              icon="drop"
              label={t("wellness", "avgDailyWater")}
              value={`${wellnessStats.avgWater} ${t("wellness", "glasses")}`}
              color={theme.accent}
              onPress={() => navigation.navigate("Wellness")}
              trend={wellnessStats.waterTrend}
            />
            <StatPill
              icon="moon"
              label={t("wellness", "avgDailySleep")}
              value={`${wellnessStats.avgSleep} ${t("wellness", "hours")}`}
              color={theme.secondary}
              onPress={() => navigation.navigate("Wellness")}
              trend={wellnessStats.sleepTrend}
            />
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(350)}>
        <View style={styles.section}>
          <ThemedText
            type="caption"
            style={{
              color: theme.textSecondary,
              marginBottom: Spacing.sm,
              textTransform: "uppercase",
              letterSpacing: 1,
              textAlign: layout.textAlign,
            }}
          >
            {t("profile", "features")}
          </ThemedText>
          <View style={styles.featureCards}>
            <FeatureCard
              icon="calendar"
              title={t("profile", "qadhaSettings")}
              subtitle={qadhaSummary.remaining > 0 ? `${qadhaSummary.remaining} ${t("profile", "daysRemaining")}` : t("profile", "allCaughtUp")}
              iconColor={theme.qadha}
              onPress={() => checkAndNavigate("qadha", () => navigation.navigate("Qadha"))}
              isRTL={isRTL}
              locked={isFeatureLocked("qadha")}
            />
            <FeatureCard
              icon="bar-chart-2"
              title={t("profile", "statistics")}
              subtitle={t("profile", "statisticsSubtitle")}
              iconColor={theme.success}
              onPress={() => navigation.navigate("Stats")}
              isRTL={isRTL}
            />
            <FeatureCard
              icon="settings"
              title={t("profile", "settings")}
              subtitle={t("profile", "appPreferences")}
              iconColor={theme.textSecondary}
              onPress={() => navigation.navigate("Settings")}
              isRTL={isRTL}
            />
            <FeatureCard
              icon="book"
              title={t("profile", "articles")}
              subtitle={t("profile", "articlesSubtitle")}
              iconColor={theme.info}
              onPress={() => navigation.navigate("Articles")}
              isRTL={isRTL}
            />
            {persona === "mother" ? (
              <FeatureCard
                icon="users"
                title={t("profile", "myDaughters")}
                subtitle={t("profile", "manageDaughters")}
                iconColor={theme.primaryLight}
                onPress={() => checkAndNavigate("daughters", () => navigation.navigate("Daughters"))}
                isRTL={isRTL}
                locked={isFeatureLocked("daughters")}
              />
            ) : null}
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(400)}>
        <View style={styles.section}>
          <ThemedText
            type="caption"
            style={{
              color: theme.textSecondary,
              marginBottom: Spacing.sm,
              textTransform: "uppercase",
              letterSpacing: 1,
              textAlign: layout.textAlign,
            }}
          >
            {t("profile", "support")}
          </ThemedText>
          <View style={styles.supportList}>
            <SupportListItem
              icon="shield"
              label={t("profile", "privacyPolicy")}
            />
            <SupportListItem
              icon="info"
              label={`${t("profile", "about")} - ${t("profile", "version")} 1.0.0`}
            />
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  statPill: {
    flex: 1,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
  },
  statPillContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  statPillIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  statPillText: {
    flex: 1,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  unifiedProfileCard: {
    gap: Spacing.md,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    flex: 1,
    gap: Spacing.sm,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  badges: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.small,
  },
  promoCardContent: {
    gap: Spacing.md,
  },
  promoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  promoIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  promoTextContainer: {
    flex: 1,
  },
  promoFeatures: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  promoFeatureItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "45%",
  },
  promoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  subscriptionStatusContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  subscriptionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  subscriptionInfo: {
    flex: 1,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  featureCards: {
    gap: Spacing.md,
  },
  supportList: {
    gap: Spacing.sm,
  },
  supportItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
    gap: Spacing.md,
  },
  supportItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
