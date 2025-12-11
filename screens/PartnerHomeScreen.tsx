import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";
import { useLayout } from "../lib/ThemePersonaContext";
import { usePartner, PartnerSummary } from "../lib/PartnerContext";
import { Spacing, BorderRadius } from "../constants/theme";

export default function PartnerHomeScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const layout = useLayout();
  const { partnerSummary, refreshPartnerData, disconnectPartner, isLoading } = usePartner();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refreshPartnerData();
    setRefreshing(false);
  }, [refreshPartnerData]);

  useEffect(() => {
    refreshPartnerData();
  }, []);

  const handleDisconnect = () => {
    Alert.alert(
      t("partnerMode", "disconnectPartner"),
      t("partnerMode", "disconnectConfirm"),
      [
        { text: t("common", "cancel"), style: "cancel" },
        {
          text: t("common", "confirm"),
          style: "destructive",
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            await disconnectPartner();
          },
        },
      ]
    );
  };

  const getPhaseColor = (phase: PartnerSummary["phase"]) => {
    switch (phase) {
      case "period":
        return theme.period;
      case "fertile":
      case "ovulation":
        return theme.fertile;
      case "follicular":
        return theme.follicular;
      case "luteal":
        return theme.luteal;
      default:
        return theme.primary;
    }
  };

  const getPhaseLabel = (phase: PartnerSummary["phase"]) => {
    const labels: Record<PartnerSummary["phase"], string> = {
      period: t("phases", "period"),
      fertile: t("phases", "fertile"),
      ovulation: t("phases", "ovulation"),
      follicular: t("phases", "follicular"),
      luteal: t("phases", "luteal"),
      normal: t("home", "tracking"),
    };
    return labels[phase] || phase;
  };

  const getMoodLabel = (mood: PartnerSummary["moodTrend"]) => {
    if (!mood) return "-";
    const labels: Record<NonNullable<PartnerSummary["moodTrend"]>, string> = {
      great: t("moods", "great"),
      good: t("moods", "good"),
      okay: t("moods", "okay"),
      stressed: t("partnerMode", "stressed"),
      tired: t("partnerMode", "tired"),
    };
    return labels[mood] || mood;
  };

  const getMoodIcon = (mood: PartnerSummary["moodTrend"]): keyof typeof Feather.glyphMap => {
    if (!mood) return "meh";
    const icons: Record<NonNullable<PartnerSummary["moodTrend"]>, keyof typeof Feather.glyphMap> = {
      great: "smile",
      good: "smile",
      okay: "meh",
      stressed: "frown",
      tired: "moon",
    };
    return icons[mood] || "meh";
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing.xxl,
            paddingBottom: insets.bottom + Spacing.xxl,
          },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Animated.View entering={FadeInDown.duration(400)}>
          <View style={styles.header}>
            <View
              style={[styles.iconContainer, { backgroundColor: theme.primaryLight }]}
            >
              <Feather name="heart" size={32} color="#FFFFFF" />
            </View>
            <ThemedText type="h1" style={styles.title}>
              {partnerSummary?.partnerName || t("partnerMode", "partnerHome")}
            </ThemedText>
            <ThemedText
              type="body"
              style={[styles.subtitle, { color: theme.textSecondary }]}
            >
              {t("partnerMode", "cycleStatus")}
            </ThemedText>
          </View>

          {partnerSummary ? (
            <View style={styles.cards}>
              <Card glass style={styles.mainCard}>
                <View style={[styles.phaseHeader, { flexDirection: layout.flexDirection }]}>
                  <View
                    style={[
                      styles.phaseBadge,
                      { backgroundColor: getPhaseColor(partnerSummary.phase) + "20" },
                    ]}
                  >
                    <View
                      style={[
                        styles.phaseDot,
                        { backgroundColor: getPhaseColor(partnerSummary.phase) },
                      ]}
                    />
                    <ThemedText
                      type="caption"
                      style={{ color: getPhaseColor(partnerSummary.phase) }}
                    >
                      {getPhaseLabel(partnerSummary.phase)}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.cycleInfo}>
                  <View style={styles.cycleDayContainer}>
                    <ThemedText type="largeTitle" style={{ color: theme.primary }}>
                      {partnerSummary.cycleDay || "-"}
                    </ThemedText>
                    <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                      {t("home", "cycleDay")}
                    </ThemedText>
                  </View>
                </View>
              </Card>

              <View style={styles.statsRow}>
                <Card glass style={styles.statCard}>
                  <Feather name="calendar" size={24} color={theme.primary} />
                  <ThemedText
                    type="small"
                    style={[styles.statLabel, { color: theme.textSecondary }]}
                  >
                    {t("partnerMode", "nextPeriod")}
                  </ThemedText>
                  <ThemedText type="h4">
                    {partnerSummary.daysUntilNextPeriod !== null
                      ? `${partnerSummary.daysUntilNextPeriod} ${t("home", "days")}`
                      : "-"}
                  </ThemedText>
                </Card>

                <Card glass style={styles.statCard}>
                  <Feather
                    name={getMoodIcon(partnerSummary.moodTrend)}
                    size={24}
                    color={theme.secondary}
                  />
                  <ThemedText
                    type="small"
                    style={[styles.statLabel, { color: theme.textSecondary }]}
                  >
                    {t("partnerMode", "moodTrend")}
                  </ThemedText>
                  <ThemedText type="h4">
                    {getMoodLabel(partnerSummary.moodTrend)}
                  </ThemedText>
                </Card>
              </View>

              {partnerSummary.fertileWindow ? (
                <Card glass style={styles.fertileCard}>
                  <View style={[styles.fertileRow, { flexDirection: layout.flexDirection }]}>
                    <Feather name="heart" size={20} color={theme.fertile} />
                    <View style={styles.fertileInfo}>
                      <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                        {t("partnerMode", "fertileWindow")}
                      </ThemedText>
                      <ThemedText type="body">
                        {partnerSummary.fertileWindow.start} - {partnerSummary.fertileWindow.end}
                      </ThemedText>
                    </View>
                  </View>
                </Card>
              ) : null}
            </View>
          ) : (
            <Card glass style={styles.emptyCard}>
              <Feather name="info" size={32} color={theme.textSecondary} />
              <ThemedText
                type="body"
                style={[styles.emptyText, { color: theme.textSecondary }]}
              >
                {t("common", "loading")}
              </ThemedText>
            </Card>
          )}

          <View style={styles.footer}>
            <Button variant="outline" onPress={handleDisconnect}>
              {t("partnerMode", "disconnectPartner")}
            </Button>
          </View>
        </Animated.View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.xxxl,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.large,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  subtitle: {
    textAlign: "center",
  },
  cards: {
    gap: Spacing.lg,
    marginBottom: Spacing.xxxl,
  },
  mainCard: {
    padding: Spacing.xl,
    alignItems: "center",
  },
  phaseHeader: {
    width: "100%",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  phaseBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
  phaseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cycleInfo: {
    alignItems: "center",
  },
  cycleDayContainer: {
    alignItems: "center",
    gap: Spacing.xs,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    padding: Spacing.lg,
    alignItems: "center",
    gap: Spacing.sm,
  },
  statLabel: {
    textAlign: "center",
  },
  fertileCard: {
    padding: Spacing.lg,
  },
  fertileRow: {
    alignItems: "center",
    gap: Spacing.md,
  },
  fertileInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  emptyCard: {
    padding: Spacing.xxxl,
    alignItems: "center",
    gap: Spacing.md,
  },
  emptyText: {
    textAlign: "center",
  },
  footer: {
    gap: Spacing.md,
  },
});
