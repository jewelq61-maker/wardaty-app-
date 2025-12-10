import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable, ActivityIndicator, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { useLayout } from "@/lib/ThemePersonaContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import { useApp } from "@/lib/AppContext";
import { apiRequest, getApiUrl } from "@/lib/query-client";
import { ProfileStackParamList } from "@/navigation/ProfileStackNavigator";

interface Plan {
  code: string;
  name: string;
  nameAr: string;
  price: number;
  period: string;
  periodAr: string;
  monthlyPrice: number;
  features: string[];
  featuresAr: string[];
  popular: boolean;
}

interface FeatureRowProps {
  title: string;
  free: boolean;
  plus: boolean;
}

function FeatureRow({ title, free, plus }: FeatureRowProps) {
  const { theme } = useTheme();
  const layout = useLayout();

  return (
    <View style={[styles.featureRow, { flexDirection: layout.flexDirection, borderBottomColor: theme.cardBorder }]}>
      <ThemedText type="body" style={[styles.featureTitle, { textAlign: layout.textAlign }]}>
        {title}
      </ThemedText>
      <View style={[styles.featureIcons, { flexDirection: layout.flexDirection }]}>
        <Feather
          name={free ? "check" : "x"}
          size={20}
          color={free ? theme.success : theme.textSecondary}
        />
        <Feather
          name={plus ? "check" : "x"}
          size={20}
          color={plus ? theme.success : theme.textSecondary}
        />
      </View>
    </View>
  );
}

const translations = {
  title: { en: "Wardaty Plus", ar: "ورديتي بلس" },
  subtitle: { 
    en: "Unlock premium features for a complete wellness experience", 
    ar: "افتحي المميزات المتقدمة لتجربة عناية متكاملة" 
  },
  features: { en: "Features", ar: "المميزات" },
  free: { en: "Free", ar: "مجاني" },
  plus: { en: "Plus", ar: "بلس" },
  monthly: { en: "Monthly", ar: "شهري" },
  yearly: { en: "Yearly", ar: "سنوي" },
  perMonth: { en: "/month", ar: "/شهر" },
  perYear: { en: "/year", ar: "/سنة" },
  justPerMonth: { en: "Just", ar: "فقط" },
  save: { en: "Save 40%", ar: "وفري 40%" },
  startTrial: { en: "Start 7-Day Free Trial", ar: "ابدأي تجربة 7 أيام مجانية" },
  trialInfo: { 
    en: "7-day free trial, then {{price}}/{{period}}. Cancel anytime.", 
    ar: "تجربة 7 أيام مجانية، ثم {{price}}/{{period}}. يمكنك الإلغاء في أي وقت." 
  },
  subscribedMessage: { en: "You're a Wardaty Plus member", ar: "أنتِ عضوة في ورديتي بلس" },
  manageSubscription: { en: "Manage Subscription", ar: "إدارة الاشتراك" },
  activating: { en: "Activating...", ar: "جاري التفعيل..." },
  featureList: {
    cycleTracking: { en: "Cycle Tracking", ar: "تتبع الدورة" },
    beautyRoutines: { en: "Beauty Routines", ar: "روتين الجمال" },
    qadhaTracker: { en: "Qadha Tracker", ar: "تتبع القضاء" },
    waterTracking: { en: "Water Tracking", ar: "تتبع الماء" },
    detailedInsights: { en: "Detailed Insights", ar: "تحليلات مفصلة" },
    unlimitedArticles: { en: "Unlimited Articles", ar: "مقالات غير محدودة" },
    fatwaAccess: { en: "Fatwa Access", ar: "الوصول للفتاوى" },
    fertileWindow: { en: "Fertile Window", ar: "فترة الخصوبة" },
    daughtersHistory: { en: "Daughters History", ar: "سجل البنات" },
    exportData: { en: "Export Data", ar: "تصدير البيانات" },
  },
};

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

export default function SubscriptionScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const layout = useLayout();
  const { isPlus, isTrial, subscription, refreshSubscription } = useApp();
  const queryClient = useQueryClient();
  
  const [selectedPlan, setSelectedPlan] = useState<string>("yearly");
  
  const t = (key: keyof typeof translations) => {
    const value = translations[key];
    if (typeof value === "object" && "en" in value) {
      return language === "ar" ? value.ar : value.en;
    }
    return "";
  };
  
  const tFeature = (key: keyof typeof translations.featureList) => {
    const value = translations.featureList[key];
    return language === "ar" ? value.ar : value.en;
  };

  const { data: plans, isLoading: plansLoading } = useQuery<Plan[]>({
    queryKey: ["/api/subscription/plans"],
  });

  const { data: moyasarStatus } = useQuery<{ configured: boolean; publishableKey: string | null }>({
    queryKey: ["/api/moyasar/status"],
  });

  const activateMutation = useMutation({
    mutationFn: async ({ planCode, startTrial }: { planCode: string; startTrial: boolean }) => {
      const userId = "default-user";
      const response = await apiRequest("POST", "/api/subscription/activate", { 
        userId,
        planCode, 
        startTrial 
      });
      return response.json();
    },
    onSuccess: async () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await refreshSubscription();
      queryClient.invalidateQueries({ queryKey: ["/api/subscription/current"] });
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: async ({ planCode }: { planCode: string }) => {
      const userId = "default-user";
      const baseUrl = getApiUrl();
      const callbackUrl = `${baseUrl}api/moyasar/callback`;
      
      const response = await apiRequest("POST", "/api/moyasar/create-payment", { 
        userId,
        planCode,
        callbackUrl,
      });
      return response.json();
    },
    onSuccess: async (result: { formHtml: string; amount: number; planCode: string }) => {
      if (result?.formHtml) {
        navigation.navigate("MoyasarPayment", {
          formHtml: result.formHtml,
          planCode: result.planCode,
          amount: result.amount,
        });
      }
    },
    onError: (error: Error) => {
      Alert.alert(
        language === "ar" ? "خطأ" : "Error",
        error.message || (language === "ar" ? "حدث خطأ أثناء إنشاء الدفع" : "Failed to create payment")
      );
    },
  });

  const handleSubscribe = async () => {
    if (moyasarStatus?.configured) {
      checkoutMutation.mutate({ planCode: selectedPlan });
    } else {
      activateMutation.mutate({ planCode: selectedPlan, startTrial: true });
    }
  };

  const handleManageSubscription = async () => {
    Alert.alert(
      language === "ar" ? "إدارة الاشتراك" : "Manage Subscription",
      language === "ar" 
        ? "للاستفسار عن اشتراكك أو إلغائه، يرجى التواصل مع الدعم على support@wardaty.app" 
        : "To inquire about or cancel your subscription, please contact support at support@wardaty.app"
    );
  };

  const handlePlanSelect = (planCode: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPlan(planCode);
  };

  const getSelectedPlan = () => {
    return plans?.find((p) => p.code === selectedPlan);
  };

  const formatTrialInfo = () => {
    const plan = getSelectedPlan();
    if (!plan) return "";
    const template = t("trialInfo");
    const periodText = language === "ar" ? plan.periodAr : plan.period;
    return template.replace("{{price}}", `$${plan.price}`).replace("{{period}}", periodText);
  };

  const isPlusUser = isPlus || isTrial;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundRoot,
          paddingTop: headerHeight + Spacing.xl,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: Spacing.lg,
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <View style={[styles.badgeIcon, { backgroundColor: theme.warning + "20" }]}>
            <Feather name="award" size={32} color={theme.warning} />
          </View>
          <ThemedText type="h2">{t("title")}</ThemedText>
          <ThemedText
            type="body"
            style={{ color: theme.textSecondary, textAlign: "center" }}
          >
            {t("subtitle")}
          </ThemedText>
        </View>

        <View
          style={[
            styles.comparisonCard,
            { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder },
          ]}
        >
          <View style={[styles.comparisonHeader, { flexDirection: layout.flexDirection, borderBottomColor: theme.cardBorder }]}>
            <ThemedText type="h4">{t("features")}</ThemedText>
            <View style={[styles.headerLabels, { flexDirection: layout.flexDirection }]}>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                {t("free")}
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.primary }}>
                {t("plus")}
              </ThemedText>
            </View>
          </View>
          <FeatureRow title={tFeature("cycleTracking")} free plus />
          <FeatureRow title={tFeature("beautyRoutines")} free plus />
          <FeatureRow title={tFeature("qadhaTracker")} free plus />
          <FeatureRow title={tFeature("waterTracking")} free plus />
          <FeatureRow title={tFeature("detailedInsights")} free={false} plus />
          <FeatureRow title={tFeature("unlimitedArticles")} free={false} plus />
          <FeatureRow title={tFeature("fatwaAccess")} free={false} plus />
          <FeatureRow title={tFeature("fertileWindow")} free={false} plus />
          <FeatureRow title={tFeature("daughtersHistory")} free={false} plus />
          <FeatureRow title={tFeature("exportData")} free={false} plus />
        </View>

        {!isPlusUser ? (
          <View style={[styles.pricingSection, { flexDirection: layout.flexDirection }]}>
            {plansLoading ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : plans?.map((plan) => (
              <Pressable
                key={plan.code}
                onPress={() => handlePlanSelect(plan.code)}
                style={[
                  styles.pricingCard,
                  { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder },
                  selectedPlan === plan.code && styles.selectedCard,
                  selectedPlan === plan.code && { borderColor: theme.primary },
                  plan.popular && styles.recommendedCard,
                  plan.popular && selectedPlan === plan.code && { backgroundColor: theme.primary + "10" },
                ]}
              >
                {plan.popular ? (
                  <View style={[styles.saveBadge, { backgroundColor: theme.primary }]}>
                    <ThemedText type="small" style={{ color: "#FFFFFF" }}>
                      {t("save")}
                    </ThemedText>
                  </View>
                ) : null}
                <ThemedText type="caption">
                  {language === "ar" ? plan.nameAr : plan.name}
                </ThemedText>
                <View style={styles.priceRow}>
                  <ThemedText type="h1">${plan.price}</ThemedText>
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>
                    {plan.code === "yearly" ? t("perYear") : t("perMonth")}
                  </ThemedText>
                </View>
                {plan.code === "yearly" ? (
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>
                    {t("justPerMonth")} ${plan.monthlyPrice.toFixed(2)}{t("perMonth")}
                  </ThemedText>
                ) : null}
                {selectedPlan === plan.code ? (
                  <View style={[styles.selectedIndicator, { backgroundColor: theme.primary }]}>
                    <Feather name="check" size={14} color="#FFFFFF" />
                  </View>
                ) : null}
              </Pressable>
            ))}
          </View>
        ) : null}
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: theme.backgroundRoot,
            paddingBottom: insets.bottom + Spacing.lg + 60,
            borderTopColor: theme.cardBorder,
          },
        ]}
      >
        {isPlusUser ? (
          <View style={styles.subscribedSection}>
            <View style={styles.subscribedBanner}>
              <Feather name="check-circle" size={20} color={theme.success} />
              <ThemedText type="body" style={{ color: theme.success }}>
                {t("subscribedMessage")}
              </ThemedText>
            </View>
            <Button 
              onPress={handleManageSubscription}
              variant="secondary"
            >
              {t("manageSubscription")}
            </Button>
          </View>
        ) : (
          <>
            <Button 
              onPress={handleSubscribe}
              disabled={activateMutation.isPending || checkoutMutation.isPending}
            >
              {(activateMutation.isPending || checkoutMutation.isPending) ? t("activating") : t("startTrial")}
            </Button>
            <ThemedText
              type="small"
              style={{ color: theme.textSecondary, textAlign: "center", marginTop: Spacing.sm }}
            >
              {formatTrialInfo()}
            </ThemedText>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  badgeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  comparisonCard: {
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: Spacing.xl,
  },
  comparisonHeader: {
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
    borderBottomWidth: 1,
  },
  headerLabels: {
    gap: Spacing.xl,
  },
  featureRow: {
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
    borderBottomWidth: 1,
  },
  featureTitle: {
    flex: 1,
  },
  featureIcons: {
    gap: Spacing.xl,
  },
  pricingSection: {
    gap: Spacing.md,
  },
  pricingCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    alignItems: "center",
    gap: Spacing.xs,
    position: "relative",
  },
  selectedCard: {
    borderWidth: 2,
  },
  recommendedCard: {
    position: "relative",
  },
  saveBadge: {
    position: "absolute",
    top: -10,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.small,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: Spacing.xs,
  },
  selectedIndicator: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
  },
  subscribedBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  subscribedSection: {
    gap: Spacing.md,
  },
});
