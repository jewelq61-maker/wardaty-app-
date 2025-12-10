import React from "react";
import { View, StyleSheet, ScrollView, Linking, Alert, Platform, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { useLayout } from "@/lib/ThemePersonaContext";
import { Spacing, BorderRadius } from "@/constants/theme";

interface MoyasarStatus {
  configured: boolean;
  publishableKey: string | null;
}

const translations = {
  title: { en: "Admin Panel", ar: "لوحة التحكم" },
  paymentSettings: { en: "Payment Settings", ar: "إعدادات الدفع" },
  moyasarIntegration: { en: "Moyasar Integration", ar: "تكامل مُيسّر" },
  configured: { en: "Configured", ar: "مُفعّل" },
  notConfigured: { en: "Not Configured", ar: "غير مُفعّل" },
  secretKey: { en: "Secret Key", ar: "المفتاح السري" },
  publishableKey: { en: "Publishable Key", ar: "المفتاح العام" },
  setupInstructions: { en: "Setup Instructions", ar: "تعليمات الإعداد" },
  step1: { 
    en: "1. Go to Moyasar Dashboard (dashboard.moyasar.com)", 
    ar: "1. اذهبي إلى لوحة تحكم مُيسّر (dashboard.moyasar.com)" 
  },
  step2: { 
    en: "2. Navigate to API Settings", 
    ar: "2. انتقلي إلى إعدادات API" 
  },
  step3: { 
    en: "3. Copy your Secret Key (starts with 'sk_')", 
    ar: "3. انسخي المفتاح السري (يبدأ بـ 'sk_')" 
  },
  step4: { 
    en: "4. Copy your Publishable Key (starts with 'pk_')", 
    ar: "4. انسخي المفتاح العام (يبدأ بـ 'pk_')" 
  },
  step5: { 
    en: "5. Add keys to Replit Secrets panel", 
    ar: "5. أضيفي المفاتيح في لوحة Secrets في Replit" 
  },
  secretKeyName: { en: "MOYASAR_SECRET_KEY", ar: "MOYASAR_SECRET_KEY" },
  publishableKeyName: { en: "MOYASAR_PUBLISHABLE_KEY", ar: "MOYASAR_PUBLISHABLE_KEY" },
  openMoyasarDashboard: { en: "Open Moyasar Dashboard", ar: "فتح لوحة تحكم مُيسّر" },
  trialModeActive: { 
    en: "Trial mode is active. Users can start 7-day free trials without payment.", 
    ar: "وضع التجربة مفعّل. يمكن للمستخدمين بدء تجربة مجانية لمدة 7 أيام بدون دفع." 
  },
  paymentModeActive: { 
    en: "Payment mode is active. Users will be redirected to Moyasar for payment.", 
    ar: "وضع الدفع مفعّل. سيتم توجيه المستخدمين إلى مُيسّر للدفع." 
  },
  requiredSecrets: { en: "Required Secrets", ar: "المفاتيح المطلوبة" },
  status: { en: "Status", ar: "الحالة" },
  restartRequired: { 
    en: "After adding keys, restart the app server for changes to take effect.", 
    ar: "بعد إضافة المفاتيح، أعيدي تشغيل الخادم لتطبيق التغييرات." 
  },
};

export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const layout = useLayout();

  const t = (key: keyof typeof translations) => {
    const value = translations[key];
    return language === "ar" ? value.ar : value.en;
  };

  const { data: moyasarStatus, isLoading } = useQuery<MoyasarStatus>({
    queryKey: ["/api/moyasar/status"],
  });

  const isConfigured = moyasarStatus?.configured ?? false;
  const hasPublishableKey = !!moyasarStatus?.publishableKey;

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.backgroundRoot, paddingTop: headerHeight }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const handleOpenMoyasarDashboard = async () => {
    const url = "https://dashboard.moyasar.com";
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          language === "ar" ? "خطأ" : "Error",
          language === "ar" ? "لا يمكن فتح الرابط" : "Cannot open link"
        );
      }
    } catch (error) {
      Alert.alert(
        language === "ar" ? "خطأ" : "Error",
        language === "ar" ? "حدث خطأ أثناء فتح الرابط" : "Failed to open link"
      );
    }
  };

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
      <View style={[styles.section, { alignItems: layout.alignSelf }]}>
        <ThemedText type="h3" style={[styles.sectionTitle, { textAlign: layout.textAlign }]}>
          {t("paymentSettings")}
        </ThemedText>

        <View
          style={[
            styles.statusCard,
            { 
              backgroundColor: theme.backgroundDefault, 
              borderColor: isConfigured ? theme.success : theme.warning 
            },
          ]}
        >
          <View style={[styles.statusHeader, { flexDirection: layout.flexDirection }]}>
            <View style={[styles.statusIcon, { backgroundColor: isConfigured ? theme.success + "20" : theme.warning + "20" }]}>
              <Feather 
                name={isConfigured ? "check-circle" : "alert-circle"} 
                size={24} 
                color={isConfigured ? theme.success : theme.warning} 
              />
            </View>
            <View style={[styles.statusTextContainer, { alignItems: layout.alignSelf }]}>
              <ThemedText type="h4">{t("moyasarIntegration")}</ThemedText>
              <ThemedText 
                type="body" 
                style={{ color: isConfigured ? theme.success : theme.warning }}
              >
                {isConfigured ? t("configured") : t("notConfigured")}
              </ThemedText>
            </View>
          </View>

          <View style={[styles.statusDetails, { borderTopColor: theme.cardBorder }]}>
            <View style={[styles.statusRow, { flexDirection: layout.flexDirection }]}>
              <ThemedText type="body">{t("secretKey")}</ThemedText>
              <View style={[styles.statusBadge, { backgroundColor: isConfigured ? theme.success + "20" : theme.error + "20" }]}>
                <Feather 
                  name={isConfigured ? "check" : "x"} 
                  size={14} 
                  color={isConfigured ? theme.success : theme.error} 
                />
              </View>
            </View>
            <View style={[styles.statusRow, { flexDirection: layout.flexDirection }]}>
              <ThemedText type="body">{t("publishableKey")}</ThemedText>
              <View style={[styles.statusBadge, { backgroundColor: hasPublishableKey ? theme.success + "20" : theme.error + "20" }]}>
                <Feather 
                  name={hasPublishableKey ? "check" : "x"} 
                  size={14} 
                  color={hasPublishableKey ? theme.success : theme.error} 
                />
              </View>
            </View>
          </View>

          <View style={[styles.modeInfo, { backgroundColor: isConfigured ? theme.success + "10" : theme.warning + "10" }]}>
            <Feather 
              name={isConfigured ? "credit-card" : "clock"} 
              size={16} 
              color={isConfigured ? theme.success : theme.warning} 
            />
            <ThemedText 
              type="small" 
              style={[
                styles.modeText, 
                { color: isConfigured ? theme.success : theme.warning, textAlign: layout.textAlign },
              ]}
            >
              {isConfigured ? t("paymentModeActive") : t("trialModeActive")}
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={[styles.section, { alignItems: layout.alignSelf }]}>
        <ThemedText type="h3" style={[styles.sectionTitle, { textAlign: layout.textAlign }]}>
          {t("setupInstructions")}
        </ThemedText>

        <View
          style={[
            styles.instructionsCard,
            { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder },
          ]}
        >
          <View style={styles.stepsList}>
            <ThemedText type="body" style={[styles.stepText, { textAlign: layout.textAlign }]}>
              {t("step1")}
            </ThemedText>
            <ThemedText type="body" style={[styles.stepText, { textAlign: layout.textAlign }]}>
              {t("step2")}
            </ThemedText>
            <ThemedText type="body" style={[styles.stepText, { textAlign: layout.textAlign }]}>
              {t("step3")}
            </ThemedText>
            <ThemedText type="body" style={[styles.stepText, { textAlign: layout.textAlign }]}>
              {t("step4")}
            </ThemedText>
            <ThemedText type="body" style={[styles.stepText, { textAlign: layout.textAlign }]}>
              {t("step5")}
            </ThemedText>
          </View>

          <View style={[styles.keysInfo, { backgroundColor: theme.backgroundSecondary }]}>
            <ThemedText type="caption" style={[styles.keysTitle, { textAlign: layout.textAlign }]}>
              {t("requiredSecrets")}:
            </ThemedText>
            <View style={styles.keyRow}>
              <View style={[styles.keyBadge, { backgroundColor: theme.primary + "20" }]}>
                <ThemedText type="small" style={{ color: theme.primary, fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace" }}>
                  MOYASAR_SECRET_KEY
                </ThemedText>
              </View>
            </View>
            <View style={styles.keyRow}>
              <View style={[styles.keyBadge, { backgroundColor: theme.primary + "20" }]}>
                <ThemedText type="small" style={{ color: theme.primary, fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace" }}>
                  MOYASAR_PUBLISHABLE_KEY
                </ThemedText>
              </View>
            </View>
          </View>

          <View style={[styles.restartNote, { backgroundColor: theme.info + "10" }]}>
            <Feather name="info" size={16} color={theme.info} />
            <ThemedText type="small" style={[styles.restartText, { color: theme.info, textAlign: layout.textAlign }]}>
              {t("restartRequired")}
            </ThemedText>
          </View>
        </View>

        <Button onPress={handleOpenMoyasarDashboard} style={{ marginTop: Spacing.lg }}>
          {t("openMoyasarDashboard")}
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginBottom: Spacing.xl,
    width: "100%",
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  statusCard: {
    borderRadius: BorderRadius.large,
    borderWidth: 2,
    overflow: "hidden",
  },
  statusHeader: {
    alignItems: "center",
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  statusTextContainer: {
    flex: 1,
  },
  statusDetails: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    gap: Spacing.sm,
  },
  statusRow: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  modeInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    margin: Spacing.md,
    marginTop: 0,
    borderRadius: BorderRadius.medium,
    gap: Spacing.sm,
  },
  modeText: {
    flex: 1,
  },
  instructionsCard: {
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    padding: Spacing.lg,
  },
  stepsList: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  stepText: {
    lineHeight: 24,
  },
  keysInfo: {
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  keysTitle: {
    marginBottom: Spacing.xs,
  },
  keyRow: {
    flexDirection: "row",
  },
  keyBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.small,
  },
  restartNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
    gap: Spacing.sm,
  },
  restartText: {
    flex: 1,
    lineHeight: 20,
  },
});
