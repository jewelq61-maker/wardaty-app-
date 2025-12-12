import { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "../components/ThemedText";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";
import { useApp } from "../lib/AppContext";
import { useLayout } from "../lib/ThemePersonaContext";
import {
  getCurrentCycleDay,
  getDaysUntilNextPeriod,
  getDetailedCyclePhase,
} from "../lib/cycle-utils";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const { settings, logs } = useApp();
  const layout = useLayout();

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
      <LinearGradient
        colors={['#E91E63', '#9C27B0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

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
            <BlurView intensity={20} style={styles.notificationBlur}>
              <Feather name="bell" size={22} color="#FFFFFF" />
            </BlurView>
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
            <BlurView intensity={30} style={styles.cardBlur}>
              <View style={styles.cycleContent}>
                <View style={styles.cycleIcon}>
                  <ThemedText style={styles.cycleIconText}>🌸</ThemedText>
                </View>
                
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
            </BlurView>
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
              <BlurView intensity={30} style={styles.cardBlur}>
                <ThemedText style={styles.actionIcon}>🤰</ThemedText>
                <ThemedText style={styles.actionTitle}>
                  {language === "ar" ? "الحمل" : "Pregnancy"}
                </ThemedText>
              </BlurView>
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
              <BlurView intensity={30} style={styles.cardBlur}>
                <ThemedText style={styles.actionIcon}>💪</ThemedText>
                <ThemedText style={styles.actionTitle}>
                  {language === "ar" ? "الصحة" : "Wellness"}
                </ThemedText>
              </BlurView>
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
              <BlurView intensity={30} style={styles.cardBlur}>
                <ThemedText style={styles.actionIcon}>✨</ThemedText>
                <ThemedText style={styles.actionTitle}>
                  {language === "ar" ? "الجمال" : "Beauty"}
                </ThemedText>
              </BlurView>
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
              <BlurView intensity={30} style={styles.cardBlur}>
                <ThemedText style={styles.actionIcon}>👧</ThemedText>
                <ThemedText style={styles.actionTitle}>
                  {language === "ar" ? "البنات" : "Daughters"}
                </ThemedText>
              </BlurView>
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
            <BlurView intensity={30} style={styles.cardBlur}>
              <View style={styles.insightContent}>
                <ThemedText style={styles.insightIcon}>💡</ThemedText>
                <View style={styles.insightText}>
                  <ThemedText style={styles.insightTitle}>
                    {phase.advice}
                  </ThemedText>
                  <ThemedText style={styles.insightSubtitle}>
                    {language === "ar" ? "اقرأي المزيد" : "Read more"}
                  </ThemedText>
                </View>
                <Feather name="chevron-right" size={20} color="rgba(255, 255, 255, 0.6)" />
              </View>
            </BlurView>
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
            <BlurView intensity={30} style={styles.cardBlur}>
              <View style={styles.statsContent}>
                <ThemedText style={styles.statsTitle}>
                  {language === "ar" ? "الإحصائيات" : "Statistics"}
                </ThemedText>
                
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <ThemedText style={styles.statNumber}>28</ThemedText>
                    <ThemedText style={styles.statLabel}>
                      {language === "ar" ? "يوم" : "days"}
                    </ThemedText>
                  </View>
                  
                  <View style={styles.statItem}>
                    <ThemedText style={styles.statNumber}>5</ThemedText>
                    <ThemedText style={styles.statLabel}>
                      {language === "ar" ? "أيام" : "days"}
                    </ThemedText>
                  </View>
                  
                  <View style={styles.statItem}>
                    <ThemedText style={styles.statNumber}>92%</ThemedText>
                    <ThemedText style={styles.statLabel}>
                      {language === "ar" ? "دقة" : "accuracy"}
                    </ThemedText>
                  </View>
                </View>
              </View>
            </BlurView>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 17,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  userName: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  notificationBlur: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    marginBottom: 20,
  },
  cycleCard: {
    height: 140,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  cardBlur: {
    flex: 1,
    padding: 24,
  },
  cycleContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  cycleIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  cycleIconText: {
    fontSize: 32,
  },
  cycleInfo: {
    flex: 1,
  },
  cycleTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  cycleSubtitle: {
    fontSize: 15,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.7)",
  },
  cycleDays: {
    alignItems: "center",
  },
  cycleDaysNumber: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  cycleDaysLabel: {
    fontSize: 13,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.7)",
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
    height: 120,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  actionIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  insightCard: {
    height: 100,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  insightContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  insightIcon: {
    fontSize: 32,
  },
  insightText: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  insightSubtitle: {
    fontSize: 13,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.6)",
  },
  statsCard: {
    height: 160,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  statsContent: {
    flex: 1,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.7)",
  },
});
