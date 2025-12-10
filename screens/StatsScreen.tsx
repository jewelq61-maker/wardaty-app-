import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { AppIcon } from "@/components/AppIcon";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { useLayout } from "@/lib/ThemePersonaContext";
import { usePaywall } from "@/hooks/usePaywall";
import { Spacing, BorderRadius } from "@/constants/theme";
import { useApp } from "@/lib/AppContext";
import { getCurrentCycleDay } from "@/lib/cycle-utils";
import type { AppIconName } from "@/components/AppIcon";

function GlassCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.glassContent,
        { backgroundColor: theme.glassBackground, borderColor: theme.glassBorder },
        style,
      ]}
    >
      {children}
    </View>
  );
}

function StatItem({
  icon,
  label,
  value,
  color,
}: {
  icon: AppIconName;
  label: string;
  value: string | number;
  color: string;
}) {
  const { theme, isDark } = useTheme();
  const layout = useLayout();

  return (
    <View
      style={[
        styles.statItem,
        { flexDirection: layout.flexDirection },
        {
          backgroundColor: isDark
            ? "rgba(255,255,255,0.06)"
            : "rgba(0,0,0,0.025)",
          borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
        },
      ]}
    >
      <View style={[styles.statIcon, { backgroundColor: `${color}15`, [layout.marginEnd]: Spacing.md }]}>
        <AppIcon name={icon} size={20} color={color} weight="semibold" />
      </View>
      <View style={styles.statText}>
        <ThemedText type="small" style={{ color: theme.textSecondary, textAlign: layout.textAlign }}>
          {label}
        </ThemedText>
        <ThemedText type="h3" style={{ color: theme.text, textAlign: layout.textAlign }}>
          {value}
        </ThemedText>
      </View>
    </View>
  );
}

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const layout = useLayout();
  const { data } = useApp();
  const { isPlus, isTrial } = usePaywall();

  const { settings, qadhaSummary, beautyRoutineLogs, cycleLogs } = data;

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

  const getMonthlyPeriodDays = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return cycleLogs.filter((log) => {
      const logDate = new Date(log.date);
      return logDate >= startOfMonth && log.isPeriod;
    }).length;
  };

  const weeklyBeautyCount = getWeeklyBeautyCount();
  const monthlyPeriodDays = getMonthlyPeriodDays();
  const cycleLength = settings.cycleSettings.cycleLength;
  const periodLength = settings.cycleSettings.periodLength;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: insets.bottom + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInDown.duration(400)}>
        <View style={styles.section}>
          <ThemedText
            type="caption"
            style={[
              styles.sectionTitle,
              { color: theme.textSecondary, textAlign: layout.textAlign },
            ]}
          >
            {t("profile", "cycleStats")}
          </ThemedText>
          <GlassCard>
            <View style={styles.statsGrid}>
              <StatItem
                icon="calendar"
                label={t("profile", "cycleDay")}
                value={currentCycleDay ? `${currentCycleDay}` : "--"}
                color={theme.primary}
              />
              <StatItem
                icon="clock"
                label={t("profile", "avgCycle")}
                value={`${cycleLength} ${t("settings", "days")}`}
                color={theme.secondary}
              />
              <StatItem
                icon="droplet"
                label={t("settings", "periodLength")}
                value={`${periodLength} ${t("settings", "days")}`}
                color={theme.period}
              />
              <StatItem
                icon="clock"
                label={language === "ar" ? "أيام الدورة هذا الشهر" : "Period Days This Month"}
                value={monthlyPeriodDays}
                color={theme.period}
              />
            </View>
          </GlassCard>
        </View>
      </Animated.View>

      {(isPlus || isTrial) ? (
        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
          <View style={styles.section}>
            <ThemedText
              type="caption"
              style={[
                styles.sectionTitle,
                { color: theme.textSecondary, textAlign: layout.textAlign },
              ]}
            >
              {t("profile", "qadhaStats")}
            </ThemedText>
            <GlassCard>
              <View style={styles.statsGrid}>
                <StatItem
                  icon="book"
                  label={t("profile", "remaining")}
                  value={qadhaSummary.remaining}
                  color={theme.period}
                />
                <StatItem
                  icon="checkmark.circle"
                  label={t("profile", "madeUp")}
                  value={qadhaSummary.totalMadeUp}
                  color={theme.qadha}
                />
                <StatItem
                  icon="plus.circle"
                  label={language === "ar" ? "إجمالي المسجل" : "Total Logged"}
                  value={qadhaSummary.remaining + qadhaSummary.totalMadeUp}
                  color={theme.info}
                />
              </View>
            </GlassCard>
          </View>
        </Animated.View>
      ) : null}

      <Animated.View entering={FadeInDown.duration(400).delay(200)}>
        <View style={styles.section}>
          <ThemedText
            type="caption"
            style={[
              styles.sectionTitle,
              { color: theme.textSecondary, textAlign: layout.textAlign },
            ]}
          >
            {t("profile", "beautyStats")}
          </ThemedText>
          <GlassCard>
            <View style={styles.statsGrid}>
              <StatItem
                icon="sparkles"
                label={t("profile", "routinesThisWeek")}
                value={weeklyBeautyCount}
                color={theme.primaryLight}
              />
              <StatItem
                icon="checkmark.circle"
                label={language === "ar" ? "إجمالي السجلات" : "Total Logs"}
                value={beautyRoutineLogs.length}
                color={theme.success}
              />
            </View>
          </GlassCard>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  glassWrapper: {
    borderRadius: BorderRadius.large,
    overflow: "hidden",
  },
  glassContent: {
    borderRadius: BorderRadius.large,
    borderWidth: 0.5,
    overflow: "hidden",
    padding: Spacing.lg,
  },
  statsGrid: {
    gap: Spacing.md,
  },
  statItem: {
    alignItems: "center",
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    borderWidth: 0.5,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.medium,
    alignItems: "center",
    justifyContent: "center",
  },
  statText: {
    flex: 1,
    gap: 2,
  },
});
