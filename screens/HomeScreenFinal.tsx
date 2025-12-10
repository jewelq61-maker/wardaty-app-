import { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { useApp } from "@/lib/AppContext";
import {
  getCurrentCycleDay,
  getDaysUntilNextPeriod,
  getDetailedCyclePhase,
} from "@/lib/cycle-utils";
import { BrandColors } from "@/constants/colors";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const { settings, logs } = useApp();

  const cycleDay = getCurrentCycleDay(logs, settings);
  const daysUntilPeriod = getDaysUntilNextPeriod(logs, settings);
  const phase = getDetailedCyclePhase(cycleDay, settings);

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
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <ThemedText style={styles.greeting}>
              {greeting}
            </ThemedText>
            <ThemedText style={styles.userName}>
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
            <Feather name="bell" size={22} color={BrandColors.violet.main} />
          </Pressable>
        </View>

        {/* Cycle Card */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(600)}
          style={styles.cardContainer}
        >
          <Pressable
            style={styles.cycleCard}
            onPress={() => handleCardPress("Calendar")}
          >
            <LinearGradient
              colors={[BrandColors.violet.main, BrandColors.coral.main]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cycleGradient}
            >
              <View style={styles.cycleContent}>
                <View style={styles.cycleInfo}>
                  <ThemedText style={styles.cycleTitle}>
                    {language === "ar" ? "اليوم" : "Day"} {cycleDay}
                  </ThemedText>
                  <ThemedText style={styles.cycleSubtitle}>
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

        {/* Quick Actions Grid */}
        <View style={styles.grid}>
          <Animated.View
            entering={FadeInDown.delay(200).duration(600)}
            style={styles.gridItem}
          >
            <Pressable
              style={styles.actionCard}
              onPress={() => handleCardPress("Pregnancy")}
            >
              <View style={styles.actionIconContainer}>
                <ThemedText style={styles.actionIcon}>🤰</ThemedText>
              </View>
              <ThemedText style={styles.actionTitle}>
                {language === "ar" ? "الحمل" : "Pregnancy"}
              </ThemedText>
              <ThemedText style={styles.actionDescription}>
                {language === "ar" ? "متابعة الحمل" : "Track pregnancy"}
              </ThemedText>
            </Pressable>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(250).duration(600)}
            style={styles.gridItem}
          >
            <Pressable
              style={styles.actionCard}
              onPress={() => handleCardPress("Wellness")}
            >
              <View style={styles.actionIconContainer}>
                <ThemedText style={styles.actionIcon}>💪</ThemedText>
              </View>
              <ThemedText style={styles.actionTitle}>
                {language === "ar" ? "الصحة" : "Wellness"}
              </ThemedText>
              <ThemedText style={styles.actionDescription}>
                {language === "ar" ? "صحتك اليومية" : "Daily wellness"}
              </ThemedText>
            </Pressable>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(300).duration(600)}
            style={styles.gridItem}
          >
            <Pressable
              style={styles.actionCard}
              onPress={() => handleCardPress("Beauty")}
            >
              <View style={styles.actionIconContainer}>
                <ThemedText style={styles.actionIcon}>✨</ThemedText>
              </View>
              <ThemedText style={styles.actionTitle}>
                {language === "ar" ? "الجمال" : "Beauty"}
              </ThemedText>
              <ThemedText style={styles.actionDescription}>
                {language === "ar" ? "روتين العناية" : "Beauty routine"}
              </ThemedText>
            </Pressable>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(350).duration(600)}
            style={styles.gridItem}
          >
            <Pressable
              style={styles.actionCard}
              onPress={() => handleCardPress("Daughters")}
            >
              <View style={styles.actionIconContainer}>
                <ThemedText style={styles.actionIcon}>👧</ThemedText>
              </View>
              <ThemedText style={styles.actionTitle}>
                {language === "ar" ? "البنات" : "Daughters"}
              </ThemedText>
              <ThemedText style={styles.actionDescription}>
                {language === "ar" ? "متابعة البنات" : "Track daughters"}
              </ThemedText>
            </Pressable>
          </Animated.View>
        </View>

        {/* Today's Insights */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(600)}
          style={styles.sectionContainer}
        >
          <ThemedText style={styles.sectionTitle}>
            {language === "ar" ? "نصائح اليوم" : "Today's Insights"}
          </ThemedText>

          <Pressable
            style={styles.insightCard}
            onPress={() => handleCardPress("Articles")}
          >
            <View style={styles.insightContent}>
              <View style={styles.insightIconContainer}>
                <ThemedText style={styles.insightIcon}>💡</ThemedText>
              </View>
              <View style={styles.insightText}>
                <ThemedText style={styles.insightTitle}>
                  {phase.advice}
                </ThemedText>
                <ThemedText style={styles.insightSubtitle}>
                  {language === "ar" ? "اقرأي المزيد" : "Read more"}
                </ThemedText>
              </View>
              <Feather name="chevron-right" size={20} color={BrandColors.violet.main} />
            </View>
          </Pressable>
        </Animated.View>

        {/* Stats Card */}
        <Animated.View
          entering={FadeInDown.delay(450).duration(600)}
          style={styles.cardContainer}
        >
          <Pressable
            style={styles.statsCard}
            onPress={() => handleCardPress("Stats")}
          >
            <ThemedText style={styles.statsTitle}>
              {language === "ar" ? "الإحصائيات" : "Statistics"}
            </ThemedText>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Feather name="calendar" size={24} color={BrandColors.violet.main} />
                </View>
                <ThemedText style={styles.statNumber}>28</ThemedText>
                <ThemedText style={styles.statLabel}>
                  {language === "ar" ? "يوم" : "days"}
                </ThemedText>
              </View>
              
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Feather name="clock" size={24} color={BrandColors.coral.main} />
                </View>
                <ThemedText style={styles.statNumber}>5</ThemedText>
                <ThemedText style={styles.statLabel}>
                  {language === "ar" ? "أيام" : "days"}
                </ThemedText>
              </View>
              
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Feather name="trending-up" size={24} color={BrandColors.violet.main} />
                </View>
                <ThemedText style={styles.statNumber}>92%</ThemedText>
                <ThemedText style={styles.statLabel}>
                  {language === "ar" ? "دقة" : "accuracy"}
                </ThemedText>
              </View>
            </View>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
    paddingHorizontal: 4,
  },
  greeting: {
    fontSize: 16,
    fontWeight: "400",
    color: "#6B7280",
    marginBottom: 4,
  },
  userName: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: -0.5,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    marginBottom: 20,
  },
  cycleCard: {
    height: 160,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cycleGradient: {
    flex: 1,
    padding: 24,
  },
  cycleContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cycleInfo: {
    flex: 1,
  },
  cycleTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  cycleSubtitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.9)",
  },
  cycleDays: {
    alignItems: "center",
  },
  cycleDaysNumber: {
    fontSize: 48,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  cycleDaysLabel: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.9)",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 32,
  },
  gridItem: {
    width: (width - 56) / 2,
  },
  actionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 160,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  actionIcon: {
    fontSize: 28,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6B7280",
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  insightCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  insightContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  insightIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
  },
  insightIcon: {
    fontSize: 24,
  },
  insightText: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  insightSubtitle: {
    fontSize: 13,
    fontWeight: "400",
    color: "#6B7280",
  },
  statsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "400",
    color: "#6B7280",
  },
});
