import React from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

import { ThemedText } from "../components/ThemedText";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";
import { useLayout, LayoutDirection } from "../lib/ThemePersonaContext";
import { Spacing, BorderRadius } from "../constants/theme";

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

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const layout = useLayout();

  const isArabic = language === "ar";

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
      <Animated.View entering={FadeIn.duration(400)}>
        <View style={styles.headerSection}>
          <View style={[styles.iconContainer, { backgroundColor: theme.primaryLight }]}>
            <Feather name="heart" size={48} color="#FFFFFF" />
          </View>
          <ThemedText type="h1" style={[styles.appName, { textAlign: layout.textAlign }]}>
            {isArabic ? "وردتي" : "Wardaty"}
          </ThemedText>
          <ThemedText type="body" style={[styles.version, { color: theme.textSecondary }]}>
            {t("settings", "version")} 1.0.0
          </ThemedText>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(100)}>
        <View style={styles.section}>
          <GlassCard>
            <ThemedText
              type="body"
              style={[styles.description, { color: theme.text, textAlign: layout.textAlign }]}
            >
              {t("settings", "appDescription")}
            </ThemedText>
          </GlassCard>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(200)}>
        <View style={styles.section}>
          <ThemedText
            type="caption"
            style={[
              styles.sectionTitle,
              { color: theme.textSecondary, textAlign: layout.textAlign },
            ]}
          >
            {isArabic ? "المميزات" : "Features"}
          </ThemedText>
          <GlassCard>
            <View style={styles.featuresList}>
              <FeatureItem
                icon="calendar"
                text={isArabic ? "تتبع الدورة الشهرية" : "Menstrual Cycle Tracking"}
                theme={theme}
                layout={layout}
              />
              <FeatureItem
                icon="book"
                text={isArabic ? "تتبع صلاة القضاء" : "Qadha Prayer Tracking"}
                theme={theme}
                layout={layout}
              />
              <FeatureItem
                icon="star"
                text={isArabic ? "روتين العناية بالجمال" : "Beauty Routine Management"}
                theme={theme}
                layout={layout}
              />
              <FeatureItem
                icon="activity"
                text={isArabic ? "متابعة الصحة والعافية" : "Health & Wellness Monitoring"}
                theme={theme}
                layout={layout}
              />
              <FeatureItem
                icon="users"
                text={isArabic ? "تتبع دورات البنات" : "Daughter Cycle Tracking"}
                theme={theme}
                layout={layout}
              />
            </View>
          </GlassCard>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(300)}>
        <View style={styles.section}>
          <ThemedText
            type="caption"
            style={[
              styles.sectionTitle,
              { color: theme.textSecondary, textAlign: layout.textAlign },
            ]}
          >
            {t("settings", "contactSupport")}
          </ThemedText>
          <GlassCard>
            <View style={[styles.contactRow, { flexDirection: layout.flexDirection }]}>
              <View style={[styles.contactIcon, { backgroundColor: `${theme.primary}15` }]}>
                <Feather name="mail" size={20} color={theme.primary} />
              </View>
              <ThemedText type="body" style={{ color: theme.text }}>
                support@wardaty.app
              </ThemedText>
            </View>
          </GlassCard>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(400)}>
        <View style={styles.footer}>
          <ThemedText type="small" style={{ color: theme.textSecondary, textAlign: "center" }}>
            {isArabic ? "صنع بحب للمرأة المسلمة" : "Made with love for Muslim women"}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary, textAlign: "center", marginTop: Spacing.xs }}>
            © 2024 Wardaty
          </ThemedText>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

function FeatureItem({
  icon,
  text,
  theme,
  layout,
}: {
  icon: keyof typeof Feather.glyphMap;
  text: string;
  theme: any;
  layout: LayoutDirection;
}) {
  return (
    <View style={[styles.featureItem, { flexDirection: layout.flexDirection }]}>
      <View style={[styles.featureIcon, { backgroundColor: `${theme.primary}15` }]}>
        <Feather name={icon} size={18} color={theme.primary} />
      </View>
      <ThemedText type="body" style={[styles.featureText, { color: theme.text }]}>
        {text}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  appName: {
    marginBottom: Spacing.xs,
  },
  version: {
    marginTop: Spacing.xs,
  },
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
  description: {
    lineHeight: 24,
  },
  featuresList: {
    gap: Spacing.md,
  },
  featureItem: {
    alignItems: "center",
    gap: Spacing.md,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.small,
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    flex: 1,
  },
  contactRow: {
    alignItems: "center",
    gap: Spacing.md,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.medium,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
});
