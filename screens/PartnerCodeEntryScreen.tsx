import React, { useState, useRef } from "react";
import { View, StyleSheet, TextInput, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { useLayout } from "@/lib/ThemePersonaContext";
import { usePartner } from "@/lib/PartnerContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import { Card } from "@/components/Card";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";

interface PartnerCodeEntryScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function PartnerCodeEntryScreen({
  onBack,
  onSuccess,
}: PartnerCodeEntryScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const layout = useLayout();
  const { connectAsPartner } = usePartner();

  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  const handleCodeChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, "").slice(0, 6);
    setCode(numericText);
    setError(null);
  };

  const handleConnect = async () => {
    if (code.length !== 6) {
      setError(t("partnerMode", "invalidCode"));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await connectAsPartner(code);
      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onSuccess();
      } else {
        setError(result.error || t("partnerMode", "invalidCode"));
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (err) {
      setError(t("common", "error"));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onBack();
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundRoot,
          paddingTop: insets.top + Spacing.xxl,
          paddingBottom: insets.bottom + Spacing.xxl,
        },
      ]}
    >
      <KeyboardAwareScrollViewCompat
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={styles.content}
        >
          <View style={styles.header}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.primaryLight },
              ]}
            >
              <Feather name="link" size={40} color="#FFFFFF" />
            </View>
            <ThemedText type="h1" style={styles.title}>
              {t("partnerMode", "enterPartnerCode")}
            </ThemedText>
            <ThemedText
              type="body"
              style={[styles.subtitle, { color: theme.textSecondary }]}
            >
              {t("partnerMode", "enterCodePlaceholder")}
            </ThemedText>
          </View>

          <Card glass style={styles.codeCard}>
            <TextInput
              ref={inputRef}
              style={[
                styles.codeInput,
                {
                  color: theme.text,
                  borderColor: error ? theme.error : theme.cardBorder,
                },
              ]}
              value={code}
              onChangeText={handleCodeChange}
              placeholder="------"
              placeholderTextColor={theme.textSecondary}
              keyboardType="number-pad"
              maxLength={6}
              textAlign="center"
              autoFocus
            />
            {error ? (
              <View style={[styles.errorRow, { flexDirection: layout.flexDirection }]}>
                <Feather name="alert-circle" size={16} color={theme.error} />
                <ThemedText
                  type="small"
                  style={[styles.errorText, { color: theme.error }]}
                >
                  {error}
                </ThemedText>
              </View>
            ) : null}
          </Card>

          <View style={styles.buttons}>
            <Button onPress={handleConnect} disabled={isLoading || code.length !== 6}>
              {isLoading ? t("common", "loading") : t("partnerMode", "connect")}
            </Button>
            <Button variant="outline" onPress={handleBack}>
              {t("common", "back")}
            </Button>
          </View>
        </Animated.View>
      </KeyboardAwareScrollViewCompat>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
    width: 80,
    height: 80,
    borderRadius: BorderRadius.large,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: "center",
  },
  codeCard: {
    padding: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  codeInput: {
    fontSize: 32,
    fontWeight: "600",
    letterSpacing: 8,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 2,
  },
  errorRow: {
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: Spacing.md,
  },
  errorText: {
    flex: 1,
  },
  buttons: {
    gap: Spacing.md,
  },
});
