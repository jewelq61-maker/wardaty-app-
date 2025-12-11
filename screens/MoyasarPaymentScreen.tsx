import React, { useState, useRef, useCallback } from "react";
import { View, StyleSheet, ActivityIndicator, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import WebView, { WebViewMessageEvent } from "react-native-webview";

import { ThemedText } from "../components/ThemedText";
import { Button } from "../components/Button";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";
import { Spacing, BorderRadius } from "../constants/theme";
import { useApp } from "../lib/AppContext";

interface RouteParams {
  formHtml: string;
  planCode: string;
  amount: number;
}

interface PaymentMessage {
  type: "payment_completed" | "payment_failed";
  payment?: {
    id: string;
    status: string;
  };
  error?: string;
}

const translations = {
  title: { en: "Complete Payment", ar: "إكمال الدفع" },
  loading: { en: "Loading payment form...", ar: "جاري تحميل نموذج الدفع..." },
  success: { en: "Payment Successful!", ar: "تم الدفع بنجاح!" },
  successMessage: { 
    en: "Your Wardaty Plus subscription is now active.", 
    ar: "اشتراكك في ورديتي بلس مفعّل الآن." 
  },
  failed: { en: "Payment Failed", ar: "فشل الدفع" },
  failedMessage: { 
    en: "Something went wrong with your payment. Please try again.", 
    ar: "حدث خطأ في عملية الدفع. يرجى المحاولة مرة أخرى." 
  },
  done: { en: "Done", ar: "تم" },
  tryAgain: { en: "Try Again", ar: "حاول مرة أخرى" },
  cancel: { en: "Cancel", ar: "إلغاء" },
  webNotSupported: {
    en: "Please use Expo Go on your mobile device to complete the payment.",
    ar: "يرجى استخدام تطبيق Expo Go على جهازك المحمول لإكمال الدفع."
  },
};

type PaymentStatus = "loading" | "paying" | "success" | "failed";

export default function MoyasarPaymentScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { refreshSubscription } = useApp();
  const webViewRef = useRef<WebView>(null);
  
  const params = route.params as RouteParams;
  const [status, setStatus] = useState<PaymentStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const t = (key: keyof typeof translations) => {
    const value = translations[key];
    return language === "ar" ? value.ar : value.en;
  };

  const handleMessage = useCallback(async (event: WebViewMessageEvent) => {
    try {
      const data: PaymentMessage = JSON.parse(event.nativeEvent.data);
      
      if (data.type === "payment_completed") {
        setStatus("success");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        await refreshSubscription();
      } else if (data.type === "payment_failed") {
        setStatus("failed");
        setErrorMessage(data.error || "");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (e) {
      console.error("Error parsing WebView message:", e);
    }
  }, [refreshSubscription]);

  const handleLoadEnd = useCallback(() => {
    setStatus("paying");
  }, []);

  const handleDone = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleTryAgain = useCallback(() => {
    setStatus("loading");
    setErrorMessage("");
    webViewRef.current?.reload();
  }, []);

  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  if (Platform.OS === "web") {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot, paddingTop: insets.top + Spacing.xl }]}>
        <View style={styles.centerContent}>
          <View style={[styles.iconCircle, { backgroundColor: theme.warning + "20" }]}>
            <Feather name="smartphone" size={32} color={theme.warning} />
          </View>
          <ThemedText type="h3" style={styles.centeredText}>
            {t("webNotSupported")}
          </ThemedText>
          <Button onPress={handleCancel} variant="secondary">
            {t("cancel")}
          </Button>
        </View>
      </View>
    );
  }

  if (status === "success") {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot, paddingTop: insets.top + Spacing.xl }]}>
        <View style={styles.centerContent}>
          <View style={[styles.iconCircle, { backgroundColor: theme.success + "20" }]}>
            <Feather name="check-circle" size={48} color={theme.success} />
          </View>
          <ThemedText type="h2" style={styles.centeredText}>
            {t("success")}
          </ThemedText>
          <ThemedText type="body" style={[styles.centeredText, { color: theme.textSecondary }]}>
            {t("successMessage")}
          </ThemedText>
          <Button onPress={handleDone} style={styles.actionButton}>
            {t("done")}
          </Button>
        </View>
      </View>
    );
  }

  if (status === "failed") {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot, paddingTop: insets.top + Spacing.xl }]}>
        <View style={styles.centerContent}>
          <View style={[styles.iconCircle, { backgroundColor: theme.error + "20" }]}>
            <Feather name="x-circle" size={48} color={theme.error} />
          </View>
          <ThemedText type="h2" style={styles.centeredText}>
            {t("failed")}
          </ThemedText>
          <ThemedText type="body" style={[styles.centeredText, { color: theme.textSecondary }]}>
            {errorMessage || t("failedMessage")}
          </ThemedText>
          <View style={styles.buttonRow}>
            <Button onPress={handleTryAgain} style={styles.actionButton}>
              {t("tryAgain")}
            </Button>
            <Button onPress={handleCancel} variant="secondary" style={styles.actionButton}>
              {t("cancel")}
            </Button>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      {status === "loading" ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.primary} />
          <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.md }}>
            {t("loading")}
          </ThemedText>
        </View>
      ) : null}
      
      <WebView
        ref={webViewRef}
        source={{ html: params.formHtml }}
        style={[styles.webview, status === "loading" && styles.hiddenWebview]}
        onMessage={handleMessage}
        onLoadEnd={handleLoadEnd}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState={false}
        scalesPageToFit
        originWhitelist={["*"]}
        mixedContentMode="compatibility"
      />
      
      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.lg, borderTopColor: theme.cardBorder }]}>
        <Button onPress={handleCancel} variant="secondary">
          {t("cancel")}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  centeredText: {
    textAlign: "center",
  },
  actionButton: {
    minWidth: 150,
  },
  buttonRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  webview: {
    flex: 1,
  },
  hiddenWebview: {
    opacity: 0,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
});
