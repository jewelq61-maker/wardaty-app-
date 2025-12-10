import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { usePaywall } from "@/hooks/usePaywall";
import { useApp } from "@/lib/AppContext";

interface LockedFeatureProps {
  title?: string;
  titleAr?: string;
  description?: string;
  descriptionAr?: string;
  children?: React.ReactNode;
  showCard?: boolean;
  showOverlay?: boolean;
  compact?: boolean;
}

export function LockedFeature({
  title = "Premium Feature",
  titleAr = "ميزة مميزة",
  description = "Upgrade to Wardaty Plus to unlock this feature",
  descriptionAr = "قم بالترقية إلى ورديتي بلس لفتح هذه الميزة",
  children,
  showCard = true,
  showOverlay = false,
  compact = false,
}: LockedFeatureProps) {
  const { theme } = useTheme();
  const { data } = useApp();
  const { navigateToPaywall } = usePaywall();
  const isArabic = data.settings.language === "ar";

  const handleUnlock = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigateToPaywall();
  };

  if (showOverlay && children) {
    return (
      <View style={styles.overlayContainer}>
        <View style={styles.childrenContainer}>
          {children}
        </View>
        <Pressable
          onPress={handleUnlock}
          style={[
            styles.overlay,
            { backgroundColor: theme.backgroundRoot + "F0" },
          ]}
        >
          <View style={[styles.overlayContent, { backgroundColor: theme.backgroundDefault }]}>
            <View style={[styles.lockIcon, { backgroundColor: theme.warning + "20" }]}>
              <Feather name="lock" size={24} color={theme.warning} />
            </View>
            <ThemedText type="h4" style={styles.overlayTitle}>
              {isArabic ? titleAr : title}
            </ThemedText>
            <ThemedText type="small" style={[styles.overlayDescription, { color: theme.textSecondary }]}>
              {isArabic ? descriptionAr : description}
            </ThemedText>
            <Button onPress={handleUnlock} style={{ height: 40, paddingHorizontal: Spacing.lg }}>
              {isArabic ? "فتح" : "Unlock"}
            </Button>
          </View>
        </Pressable>
      </View>
    );
  }

  if (!showCard) {
    return (
      <Pressable onPress={handleUnlock} style={styles.inlineContainer}>
        <Feather name="lock" size={16} color={theme.warning} />
        <ThemedText type="small" style={{ color: theme.warning, marginLeft: Spacing.xs }}>
          {isArabic ? "ورديتي بلس" : "Wardaty Plus"}
        </ThemedText>
      </Pressable>
    );
  }

  if (compact) {
    return (
      <Pressable
        onPress={handleUnlock}
        style={[
          styles.compactCard,
          {
            backgroundColor: theme.warning + "15",
            borderColor: theme.warning + "40",
          },
        ]}
      >
        <View style={[styles.compactLockIcon, { backgroundColor: theme.warning + "30" }]}>
          <Feather name="lock" size={16} color={theme.warning} />
        </View>
        <View style={styles.compactContent}>
          <ThemedText type="body" numberOfLines={1}>
            {isArabic ? titleAr : title}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }} numberOfLines={1}>
            {isArabic ? "اضغط للترقية" : "Tap to upgrade"}
          </ThemedText>
        </View>
        <Feather name="chevron-right" size={20} color={theme.warning} />
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handleUnlock}
      style={[
        styles.card,
        {
          backgroundColor: theme.warning + "10",
          borderColor: theme.warning + "30",
        },
      ]}
    >
      <View style={[styles.lockIcon, { backgroundColor: theme.warning + "20" }]}>
        <Feather name="lock" size={28} color={theme.warning} />
      </View>
      <ThemedText type="h4" style={styles.title}>
        {isArabic ? titleAr : title}
      </ThemedText>
      <ThemedText type="body" style={[styles.description, { color: theme.textSecondary }]}>
        {isArabic ? descriptionAr : description}
      </ThemedText>
      <Button onPress={handleUnlock} variant="primary">
        {isArabic ? "الترقية إلى بلس" : "Upgrade to Plus"}
      </Button>
    </Pressable>
  );
}

interface LockedBadgeProps {
  small?: boolean;
}

export function LockedBadge({ small = false }: LockedBadgeProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.badge,
        small ? styles.badgeSmall : null,
        { backgroundColor: theme.warning + "20" },
      ]}
    >
      <Feather name="lock" size={small ? 10 : 12} color={theme.warning} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    alignItems: "center",
    gap: Spacing.md,
  },
  lockIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  compactCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    gap: Spacing.md,
  },
  compactLockIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  compactContent: {
    flex: 1,
    gap: 2,
  },
  inlineContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  overlayContainer: {
    position: "relative",
  },
  childrenContainer: {
    opacity: 0.3,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BorderRadius.large,
  },
  overlayContent: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.large,
    alignItems: "center",
    gap: Spacing.md,
    maxWidth: 280,
  },
  overlayTitle: {
    textAlign: "center",
  },
  overlayDescription: {
    textAlign: "center",
  },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeSmall: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
});
