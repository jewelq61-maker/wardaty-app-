import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { Card } from "../components/Card";
import { useTheme } from "../hooks/useTheme";
import { useApp } from "../lib/AppContext";
import { useLanguage } from "../hooks/useLanguage";
import { useLayout } from "../lib/ThemePersonaContext";
import { Spacing, BorderRadius } from "../constants/theme";
import { Mood } from "../lib/types";

const MOOD_ICONS: Record<Mood, keyof typeof Feather.glyphMap> = {
  great: "smile",
  good: "meh",
  okay: "meh",
  bad: "frown",
  terrible: "frown",
  anxious: "alert-circle",
};

const MOOD_COLORS: Record<Mood, string> = {
  great: "#66BB6A",
  good: "#81C784",
  okay: "#FFA726",
  bad: "#EF5350",
  terrible: "#D32F2F",
  anxious: "#78909C",
};

export default function WellnessScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { data } = useApp();
  const { t } = useLanguage();
  const layout = useLayout();

  const last7Days = data.dailyLogs.slice(-7);
  const todayLog = data.dailyLogs.find((log) => {
    const today = new Date().toISOString().split("T")[0];
    return log.date === today;
  });

  const averageWater =
    last7Days.length > 0
      ? Math.round(
          last7Days.reduce((sum, log) => sum + (log.waterCups || 0), 0) /
            last7Days.length
        )
      : 0;

  const averageSleep =
    last7Days.length > 0
      ? (
          last7Days.reduce((sum, log) => sum + (log.sleepHours || 0), 0) /
          last7Days.length
        ).toFixed(1)
      : "0";

  const moodCounts = last7Days.reduce(
    (acc, log) => {
      if (log.mood) {
        acc[log.mood] = (acc[log.mood] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  const dominantMood = Object.entries(moodCounts).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const getMoodLabel = (mood: string): string => {
    return t("moods", mood) || mood.charAt(0).toUpperCase() + mood.slice(1);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundRoot,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: insets.bottom + Spacing.xl,
          paddingHorizontal: Spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
      >
        <View style={styles.header}>
          <ThemedText type="h2">{t("wellness", "wellnessInsights")}</ThemedText>
          <ThemedText
            type="body"
            style={[styles.subtitle, { color: theme.textSecondary }]}
          >
            {t("wellness", "healthAtGlance")}
          </ThemedText>
        </View>

        <ThemedText
          type="h4"
          style={[styles.sectionTitle, { color: theme.textSecondary }]}
        >
          {t("wellness", "todaysSummary")}
        </ThemedText>

        <View style={[styles.todayGrid, { flexDirection: layout.flexDirection }]}>
          <Card style={{ ...styles.todayCard, flex: 1 }}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: theme.primary + "20" },
              ]}
            >
              <Feather name="droplet" size={20} color={theme.primary} />
            </View>
            <ThemedText type="h3" style={styles.todayValue}>
              {todayLog?.waterCups || 0}
            </ThemedText>
            <ThemedText
              type="small"
              style={{ color: theme.textSecondary, textAlign: "center" }}
            >
              {t("wellness", "glassesOfWater")}
            </ThemedText>
          </Card>

          <Card style={{ ...styles.todayCard, flex: 1 }}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: theme.secondary + "20" },
              ]}
            >
              <Feather name="moon" size={20} color={theme.secondary} />
            </View>
            <ThemedText type="h3" style={styles.todayValue}>
              {todayLog?.sleepHours || 0}h
            </ThemedText>
            <ThemedText
              type="small"
              style={{ color: theme.textSecondary, textAlign: "center" }}
            >
              {t("wellness", "hoursOfSleep")}
            </ThemedText>
          </Card>

          <Card style={{ ...styles.todayCard, flex: 1 }}>
            <View
              style={[
                styles.iconCircle,
                {
                  backgroundColor: todayLog?.mood
                    ? MOOD_COLORS[todayLog.mood as Mood] + "20"
                    : theme.textSecondary + "20",
                },
              ]}
            >
              <Feather
                name={
                  todayLog?.mood ? MOOD_ICONS[todayLog.mood as Mood] : "minus-circle"
                }
                size={20}
                color={
                  todayLog?.mood
                    ? MOOD_COLORS[todayLog.mood as Mood]
                    : theme.textSecondary
                }
              />
            </View>
            <ThemedText type="h4" style={styles.todayValue}>
              {todayLog?.mood
                ? getMoodLabel(todayLog.mood)
                : t("wellness", "none")}
            </ThemedText>
            <ThemedText
              type="small"
              style={{ color: theme.textSecondary, textAlign: "center" }}
            >
              {t("wellness", "currentMood")}
            </ThemedText>
          </Card>
        </View>

        <ThemedText
          type="h4"
          style={[styles.sectionTitle, { color: theme.textSecondary }]}
        >
          {t("wellness", "weeklyOverview")}
        </ThemedText>

        <Card style={styles.weeklyCard}>
          <View style={[styles.weeklyRow, { flexDirection: layout.flexDirection }]}>
            <View style={[styles.weeklyItem, { flexDirection: layout.flexDirection }]}>
              <Feather name="droplet" size={24} color={theme.primary} />
              <View style={styles.weeklyInfo}>
                <ThemedText type="h4">{averageWater} {t("wellness", "glasses")}</ThemedText>
                <ThemedText
                  type="small"
                  style={{ color: theme.textSecondary }}
                >
                  {t("wellness", "avgDailyWater")}
                </ThemedText>
              </View>
            </View>

            <View
              style={[styles.divider, { backgroundColor: theme.cardBorder }]}
            />

            <View style={[styles.weeklyItem, { flexDirection: layout.flexDirection }]}>
              <Feather name="moon" size={24} color={theme.secondary} />
              <View style={styles.weeklyInfo}>
                <ThemedText type="h4">{averageSleep}h</ThemedText>
                <ThemedText
                  type="small"
                  style={{ color: theme.textSecondary }}
                >
                  {t("wellness", "avgDailySleep")}
                </ThemedText>
              </View>
            </View>
          </View>
        </Card>

        <ThemedText
          type="h4"
          style={[styles.sectionTitle, { color: theme.textSecondary }]}
        >
          {t("wellness", "moodTrends")}
        </ThemedText>

        <Card style={styles.moodCard}>
          {dominantMood ? (
            <View style={styles.dominantMoodContainer}>
              <View
                style={[
                  styles.largeMoodCircle,
                  { backgroundColor: MOOD_COLORS[dominantMood[0] as Mood] + "20" },
                ]}
              >
                <Feather
                  name={MOOD_ICONS[dominantMood[0] as Mood]}
                  size={32}
                  color={MOOD_COLORS[dominantMood[0] as Mood]}
                />
              </View>
              <ThemedText type="h4" style={styles.dominantMoodText}>
                {t("wellness", "mostly")}{" "}
                {getMoodLabel(dominantMood[0])}
              </ThemedText>
              <ThemedText
                type="body"
                style={{ color: theme.textSecondary, textAlign: "center" }}
              >
                {t("wellness", "dominantMoodThisWeek")}
              </ThemedText>
            </View>
          ) : (
            <View style={styles.emptyMood}>
              <Feather name="bar-chart-2" size={32} color={theme.textSecondary} />
              <ThemedText
                type="body"
                style={{
                  color: theme.textSecondary,
                  textAlign: "center",
                  marginTop: Spacing.sm,
                }}
              >
                {t("wellness", "startTrackingMood")}
              </ThemedText>
            </View>
          )}

          {Object.keys(moodCounts).length > 0 ? (
            <View style={styles.moodBreakdown}>
              <ThemedText
                type="caption"
                style={{
                  color: theme.textSecondary,
                  marginBottom: Spacing.sm,
                }}
              >
                {t("wellness", "moodBreakdown")}
              </ThemedText>
              <View style={styles.moodBars}>
                {Object.entries(moodCounts).map(([mood, count]) => (
                  <View key={mood} style={[styles.moodBarItem, { flexDirection: layout.flexDirection }]}>
                    <View style={[styles.moodBarLabel, { flexDirection: layout.flexDirection }]}>
                      <Feather
                        name={MOOD_ICONS[mood as Mood]}
                        size={14}
                        color={MOOD_COLORS[mood as Mood]}
                      />
                      <ThemedText type="small" style={{ marginStart: 4 }}>
                        {getMoodLabel(mood)}
                      </ThemedText>
                    </View>
                    <View
                      style={[
                        styles.moodBar,
                        { backgroundColor: theme.backgroundSecondary },
                      ]}
                    >
                      <View
                        style={[
                          styles.moodBarFill,
                          {
                            backgroundColor: MOOD_COLORS[mood as Mood],
                            width: `${(count / 7) * 100}%`,
                          },
                        ]}
                      />
                    </View>
                    <ThemedText
                      type="small"
                      style={{ color: theme.textSecondary, width: 20 }}
                    >
                      {count}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </Card>

        <ThemedText
          type="h4"
          style={[styles.sectionTitle, { color: theme.textSecondary }]}
        >
          {t("wellness", "wellnessTips")}
        </ThemedText>

        <Card style={styles.tipCard}>
          <View style={[styles.tipContent, { flexDirection: layout.flexDirection }]}>
            <View
              style={[
                styles.tipIcon,
                { backgroundColor: theme.success + "20" },
              ]}
            >
              <Feather name="zap" size={20} color={theme.success} />
            </View>
            <View style={styles.tipText}>
              <ThemedText type="body" style={{ fontWeight: "500" }}>
                {t("wellness", "stayHydrated")}
              </ThemedText>
              <ThemedText
                type="small"
                style={{ color: theme.textSecondary, marginTop: 2 }}
              >
                {t("wellness", "stayHydratedDesc")}
              </ThemedText>
            </View>
          </View>
        </Card>

        <Card style={{ ...styles.tipCard, marginTop: Spacing.md }}>
          <View style={[styles.tipContent, { flexDirection: layout.flexDirection }]}>
            <View
              style={[styles.tipIcon, { backgroundColor: theme.primary + "20" }]}
            >
              <Feather name="heart" size={20} color={theme.primary} />
            </View>
            <View style={styles.tipText}>
              <ThemedText type="body" style={{ fontWeight: "500" }}>
                {t("wellness", "trackYourCycle")}
              </ThemedText>
              <ThemedText
                type="small"
                style={{ color: theme.textSecondary, marginTop: 2 }}
              >
                {t("wellness", "trackYourCycleDesc")}
              </ThemedText>
            </View>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  subtitle: {
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  todayGrid: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  todayCard: {
    alignItems: "center",
    padding: Spacing.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  todayValue: {
    marginBottom: 2,
  },
  weeklyCard: {
    marginBottom: Spacing.xl,
  },
  weeklyRow: {
    alignItems: "center",
  },
  weeklyItem: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.md,
  },
  weeklyInfo: {},
  divider: {
    width: 1,
    height: 40,
    marginHorizontal: Spacing.md,
  },
  moodCard: {
    marginBottom: Spacing.xl,
  },
  dominantMoodContainer: {
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  largeMoodCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  dominantMoodText: {
    marginBottom: Spacing.xs,
  },
  emptyMood: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  moodBreakdown: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  moodBars: {
    gap: Spacing.sm,
  },
  moodBarItem: {
    alignItems: "center",
    gap: Spacing.sm,
  },
  moodBarLabel: {
    alignItems: "center",
    width: 80,
  },
  moodBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  moodBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  tipCard: {},
  tipContent: {
    alignItems: "center",
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.medium,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  tipText: {
    flex: 1,
  },
});
