import { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";

import { useApp } from "@/lib/AppContext";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function usePaywall() {
  const navigation = useNavigation<NavigationProp>();
  const { isPlus, isTrial, subscription, data } = useApp();

  const isFeatureLocked = useCallback((feature: string): boolean => {
    // Plus and trial users have access to all features
    if (isPlus || isTrial) {
      return false;
    }

    const lockedFeatures = [
      "qadha",
      "beautyPro",
      "beautyProducts",
      "beautyRoutines",
      "knowledge",
      "articles",
      "fatwa",
      "favorites",
      "motherMode",
      "daughters",
      "partnerMode",
      "watchIntegration",
      "export",
      "detailedInsights",
      "fertileWindow",
    ];

    return lockedFeatures.includes(feature);
  }, [isPlus, isTrial]);

  const navigateToPaywall = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("Subscription");
  }, [navigation]);

  const checkAndNavigate = useCallback((feature: string, onAllowed: () => void) => {
    if (isFeatureLocked(feature)) {
      navigateToPaywall();
      return false;
    }
    onAllowed();
    return true;
  }, [isFeatureLocked, navigateToPaywall]);

  const getDaysRemaining = useCallback((): number | null => {
    if (isTrial && subscription.trialEndsAt) {
      const trialEnd = new Date(subscription.trialEndsAt);
      const now = new Date();
      const diffTime = trialEnd.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    
    if (isPlus && subscription.expiresAt) {
      const expiry = new Date(subscription.expiresAt);
      const now = new Date();
      const diffTime = expiry.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    
    return null;
  }, [isPlus, isTrial, subscription]);

  const getSubscriptionStatusText = useCallback((): { en: string; ar: string } => {
    if (isTrial) {
      const days = getDaysRemaining();
      return {
        en: `Trial: ${days} day${days !== 1 ? "s" : ""} remaining`,
        ar: `تجريبي: ${days} يوم متبقي`,
      };
    }
    
    if (isPlus) {
      const planName = subscription.planCode === "yearly" ? "Yearly" : "Monthly";
      const planNameAr = subscription.planCode === "yearly" ? "سنوي" : "شهري";
      return {
        en: `Wardaty Plus (${planName})`,
        ar: `ورديتي بلس (${planNameAr})`,
      };
    }
    
    return {
      en: "Free Plan",
      ar: "الخطة المجانية",
    };
  }, [isPlus, isTrial, subscription, getDaysRemaining]);

  return {
    isPlus,
    isTrial,
    isFeatureLocked,
    navigateToPaywall,
    checkAndNavigate,
    getDaysRemaining,
    getSubscriptionStatusText,
  };
}
