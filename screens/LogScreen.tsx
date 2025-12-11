import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "../components/ThemedText";
import { Button } from "../components/Button";
import { MoodTracker } from "../components/MoodTracker";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";
import { Spacing, BorderRadius } from "../constants/theme";
import { useApp } from "../lib/AppContext";
import { Mood } from "../lib/types";

interface QuickLogOption {
  id: string;
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle: string;
  color: string;
}

export default function LogScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { isRTL } = useLanguage();
  const navigation = useNavigation<any>();
  const { addCycleLog, addQadhaLog, updateDailyLog, getTodaysDailyLog } = useApp();

  const todaysLog = getTodaysDailyLog();
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  const logOptions: QuickLogOption[] = [
    {
      id: "period",
      icon: "droplet",
      title: isRTL ? "تسجيل الدورة" : "Log Period",
      subtitle: isRTL ? "ابدأي أو سجلي يوم الدورة" : "Start or log a period day",
      color: theme.period,
    },
    {
      id: "water",
      icon: "coffee",
      title: isRTL ? "تسجيل الماء" : "Log Water",
      subtitle: isRTL ? `${todaysLog.waterCups}/8 أكواب اليوم` : `${todaysLog.waterCups}/8 cups today`,
      color: "#4FC3F7",
    },
    {
      id: "qadha",
      icon: "calendar",
      title: isRTL ? "تسجيل القضاء" : "Mark Qadha",
      subtitle: isRTL ? "سجلي يوم صيام فائت" : "Log a missed fast day",
      color: theme.qadha,
    },
    {
      id: "beauty",
      icon: "heart",
      title: isRTL ? "خطوة الجمال" : "Beauty Step",
      subtitle: isRTL ? "أكملي خطوة من الروتين" : "Complete a routine step",
      color: theme.primary,
    },
  ];

  const handleLogOption = async (optionId: string) => {
    switch (optionId) {
      case "period":
        await addCycleLog({ isPeriod: true });
        setShowSuccess(isRTL ? "تم تسجيل الدورة لليوم" : "Period logged for today");
        break;
      case "water":
        if (todaysLog.waterCups < 8) {
          await updateDailyLog({ waterCups: todaysLog.waterCups + 1 });
          setShowSuccess(isRTL ? `تم تسجيل الماء: ${todaysLog.waterCups + 1}/8 أكواب` : `Water logged: ${todaysLog.waterCups + 1}/8 cups`);
        }
        break;
      case "qadha":
        await addQadhaLog("missed");
        setShowSuccess(isRTL ? "تم تسجيل يوم القضاء" : "Qadha day marked");
        break;
      case "beauty":
        navigation.goBack();
        navigation.navigate("BeautyTab");
        return;
    }

    setTimeout(() => {
      setShowSuccess(null);
    }, 2000);
  };

  const handleMoodSelect = async (mood: Mood) => {
    await updateDailyLog({ mood });
    setShowSuccess(isRTL ? "تم تسجيل المزاج" : "Mood logged");
    setTimeout(() => {
      setShowSuccess(null);
    }, 2000);
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundRoot,
          paddingTop: insets.top + Spacing.lg,
          paddingBottom: insets.bottom + Spacing.xl,
        },
      ]}
    >
      <View style={styles.header}>
        <ThemedText type="h2">{isRTL ? "تسجيل سريع" : "Quick Log"}</ThemedText>
        <Pressable
          onPress={handleClose}
          style={[styles.closeButton, { backgroundColor: theme.backgroundSecondary }]}
        >
          <Feather name="x" size={20} color={theme.text} />
        </Pressable>
      </View>

      {showSuccess ? (
        <View style={[styles.successBanner, { backgroundColor: theme.success + "20" }]}>
          <Feather name="check-circle" size={20} color={theme.success} />
          <ThemedText type="body" style={{ color: theme.success }}>
            {showSuccess}
          </ThemedText>
        </View>
      ) : null}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.optionsGrid}>
          {logOptions.map((option) => (
            <Pressable
              key={option.id}
              onPress={() => handleLogOption(option.id)}
              style={({ pressed }) => [
                styles.optionCard,
                {
                  backgroundColor: theme.backgroundDefault,
                  borderColor: theme.cardBorder,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <View style={[styles.optionIcon, { backgroundColor: option.color + "20" }]}>
                <Feather name={option.icon} size={24} color={option.color} />
              </View>
              <ThemedText type="h4">{option.title}</ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                {option.subtitle}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        <View style={styles.moodSection}>
          <MoodTracker
            selectedMood={todaysLog.mood}
            onMoodSelect={handleMoodSelect}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button onPress={handleClose} variant="secondary">
          {isRTL ? "تم" : "Done"}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.lg,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  optionCard: {
    width: "48%",
    padding: Spacing.lg,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    alignItems: "center",
    gap: Spacing.sm,
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  moodSection: {
    marginTop: Spacing.md,
  },
  footer: {
    paddingTop: Spacing.lg,
  },
});
