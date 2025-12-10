import React, { useState } from "react";
import { View, StyleSheet, Alert, Share, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";
import { useHeaderHeight } from "@react-navigation/elements";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { useLayout } from "@/lib/ThemePersonaContext";
import { usePaywall } from "@/hooks/usePaywall";
import { getApiUrl, apiRequest } from "@/lib/query-client";
import { Spacing, BorderRadius } from "@/constants/theme";

interface GeneratedCode {
  code: string;
  expiresAt: string;
}

export default function PartnerAccessScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const layout = useLayout();
  const { isPlus, navigateToPaywall } = usePaywall();

  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateCode = async () => {
    if (!isPlus) {
      Alert.alert(
        t("partnerMode", "plusRequired"),
        t("partnerMode", "plusRequired"),
        [{ text: t("common", "confirm") }]
      );
      return;
    }

    setIsGenerating(true);
    try {
      const baseUrl = getApiUrl();
      const res = await apiRequest(
        "POST",
        new URL("/api/partner/generateCode", baseUrl).toString(),
        { userId: "current-user" }
      );

      if (res.ok) {
        const data = await res.json();
        setGeneratedCode({ code: data.code, expiresAt: data.expiresAt });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        const errorData = await res.json();
        Alert.alert(t("common", "error"), errorData.error || t("common", "error"));
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (error) {
      Alert.alert(t("common", "error"), t("common", "error"));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = async () => {
    if (generatedCode) {
      await Clipboard.setStringAsync(generatedCode.code);
      setCopied(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareCode = async () => {
    if (generatedCode) {
      try {
        await Share.share({
          message: `${t("partnerMode", "shareCode")}: ${generatedCode.code}`,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
  };

  const formatExpiryTime = (expiresAt: string) => {
    const expiry = new Date(expiresAt);
    const now = new Date();
    const diffMs = expiry.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMins}m`;
    }
    return `${diffMins}m`;
  };

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.content,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xxl,
          },
        ]}
      >
        <Animated.View entering={FadeInDown.duration(400)}>
          <View style={styles.header}>
            <View
              style={[styles.iconContainer, { backgroundColor: theme.primaryLight }]}
            >
              <Feather name="users" size={32} color="#FFFFFF" />
            </View>
            <ThemedText type="h2" style={styles.title}>
              {t("partnerMode", "partnerAccess")}
            </ThemedText>
            <ThemedText
              type="body"
              style={[styles.subtitle, { color: theme.textSecondary }]}
            >
              {t("partnerMode", "partnerAccessSubtitle")}
            </ThemedText>
          </View>

          {!isPlus ? (
            <Card glass style={styles.upgradeCard}>
              <Feather name="lock" size={32} color={theme.warning} />
              <ThemedText type="body" style={styles.upgradeText}>
                {t("partnerMode", "plusRequired")}
              </ThemedText>
              <Button
                onPress={navigateToPaywall}
              >
                {t("profile", "upgrade")}
              </Button>
            </Card>
          ) : (
            <>
              {generatedCode ? (
                <Card glass style={styles.codeCard}>
                  <ThemedText
                    type="caption"
                    style={[styles.codeLabel, { color: theme.textSecondary }]}
                  >
                    {t("partnerMode", "yourPartnerCode")}
                  </ThemedText>
                  <ThemedText type="largeTitle" style={styles.codeText}>
                    {generatedCode.code}
                  </ThemedText>
                  <View style={[styles.expiryRow, { flexDirection: layout.flexDirection }]}>
                    <Feather name="clock" size={14} color={theme.textSecondary} />
                    <ThemedText
                      type="small"
                      style={{ color: theme.textSecondary }}
                    >
                      {t("partnerMode", "codeExpires")} ({formatExpiryTime(generatedCode.expiresAt)})
                    </ThemedText>
                  </View>

                  <View style={styles.codeActions}>
                    <Button
                      variant="secondary"
                      onPress={handleCopyCode}
                      style={styles.actionButton}
                    >
                      {copied ? t("partnerMode", "codeCopied") : t("partnerMode", "copyCode")}
                    </Button>
                    {Platform.OS !== "web" ? (
                      <Button
                        variant="outline"
                        onPress={handleShareCode}
                        style={styles.actionButton}
                      >
                        {t("partnerMode", "shareCode")}
                      </Button>
                    ) : null}
                  </View>
                </Card>
              ) : null}

              <View style={styles.generateSection}>
                <Button
                  onPress={handleGenerateCode}
                  disabled={isGenerating}
                >
                  {isGenerating
                    ? t("common", "loading")
                    : generatedCode
                    ? t("partnerMode", "newCode")
                    : t("partnerMode", "generateCode")}
                </Button>
              </View>

              <Card glass style={styles.infoCard}>
                <View style={[styles.infoRow, { flexDirection: layout.flexDirection }]}>
                  <Feather name="info" size={20} color={theme.textSecondary} />
                  <ThemedText
                    type="small"
                    style={[styles.infoText, { color: theme.textSecondary }]}
                  >
                    {t("partnerMode", "shareCode")}
                  </ThemedText>
                </View>
              </Card>
            </>
          )}
        </Animated.View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
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
  upgradeCard: {
    padding: Spacing.xl,
    alignItems: "center",
    gap: Spacing.lg,
  },
  upgradeText: {
    textAlign: "center",
  },
  codeCard: {
    padding: Spacing.xl,
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  codeLabel: {
    marginBottom: Spacing.sm,
  },
  codeText: {
    letterSpacing: 8,
    marginBottom: Spacing.md,
  },
  expiryRow: {
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  codeActions: {
    width: "100%",
    gap: Spacing.sm,
  },
  actionButton: {
    width: "100%",
  },
  generateSection: {
    marginBottom: Spacing.xl,
  },
  infoCard: {
    padding: Spacing.lg,
  },
  infoRow: {
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  infoText: {
    flex: 1,
  },
});
