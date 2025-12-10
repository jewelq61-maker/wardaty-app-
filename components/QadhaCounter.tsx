import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { Spacing, BorderRadius } from "@/constants/theme";

interface QadhaCounterProps {
  missed: number;
  completed: number;
}

export function QadhaCounter({ missed, completed }: QadhaCounterProps) {
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();
  const remaining = Math.max(0, missed - completed);
  const total = missed;
  const progress = total > 0 ? completed / total : 0;

  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference * (1 - progress);

  return (
    <View style={styles.container}>
      <View style={[styles.countersRow, isRTL && styles.rtlRow]}>
        <View style={[styles.counterCard, { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder }]}>
          <ThemedText type="h2" style={{ color: theme.error }}>
            {missed}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {t("qadha", "missed")}
          </ThemedText>
        </View>
        <View style={[styles.counterCard, { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder }]}>
          <ThemedText type="h2" style={{ color: theme.success }}>
            {completed}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {t("qadha", "completed")}
          </ThemedText>
        </View>
        <View style={[styles.counterCard, { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder }]}>
          <ThemedText type="h2" style={{ color: theme.secondary }}>
            {remaining}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {t("qadha", "remaining")}
          </ThemedText>
        </View>
      </View>
      <View style={[styles.progressCard, { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder }]}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.backgroundSecondary}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.success}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        <View style={styles.progressText}>
          <ThemedText type="h3">{Math.round(progress * 100)}%</ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {isRTL ? "مكتمل" : "Complete"}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
  },
  countersRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  rtlRow: {
    flexDirection: "row-reverse",
  },
  counterCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    alignItems: "center",
    gap: Spacing.xs,
  },
  progressCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  progressText: {
    position: "absolute",
    alignItems: "center",
  },
});
