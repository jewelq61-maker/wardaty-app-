import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { useLayout } from "@/lib/ThemePersonaContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import { Card } from "@/components/Card";

interface RoleSelectionScreenProps {
  onSelectMainUser: () => void;
  onSelectPartner: () => void;
}

export default function RoleSelectionScreen({
  onSelectMainUser,
  onSelectPartner,
}: RoleSelectionScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useLanguage();

  const handleSelectMainUser = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectMainUser();
  };

  const handleSelectPartner = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectPartner();
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
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={styles.content}
      >
        <View style={styles.header}>
          <View
            style={[
              styles.logoContainer,
              { backgroundColor: theme.backgroundSecondary },
            ]}
          >
            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.logo}
              contentFit="contain"
            />
          </View>
          <ThemedText type="h1" style={styles.title}>
            {t("partnerMode", "selectRole")}
          </ThemedText>
          <ThemedText
            type="body"
            style={[styles.subtitle, { color: theme.textSecondary }]}
          >
            {t("partnerMode", "title")}
          </ThemedText>
        </View>

        <View style={styles.options}>
          <RoleOption
            icon="user"
            title={t("partnerMode", "iAmMainUser")}
            description={t("partnerMode", "mainUserDesc")}
            onPress={handleSelectMainUser}
          />
          <RoleOption
            icon="users"
            title={t("partnerMode", "iAmPartner")}
            description={t("partnerMode", "partnerDesc")}
            onPress={handleSelectPartner}
          />
        </View>
      </Animated.View>
    </View>
  );
}

interface RoleOptionProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  description: string;
  onPress: () => void;
}

function RoleOption({ icon, title, description, onPress }: RoleOptionProps) {
  const { theme } = useTheme();
  const layout = useLayout();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
    >
      <Card glass style={styles.optionCard}>
        <View style={[styles.optionContent, { flexDirection: layout.flexDirection }]}>
          <View
            style={[styles.iconContainer, { backgroundColor: theme.primaryLight }]}
          >
            <Feather name={icon} size={28} color="#FFFFFF" />
          </View>
          <View style={[styles.optionText, { alignItems: layout.alignSelf }]}>
            <ThemedText type="h4" style={{ textAlign: layout.textAlign }}>
              {title}
            </ThemedText>
            <ThemedText
              type="small"
              style={{ color: theme.textSecondary, textAlign: layout.textAlign }}
            >
              {description}
            </ThemedText>
          </View>
          <Feather
            name={layout.isRTL ? "chevron-left" : "chevron-right"}
            size={24}
            color={theme.textSecondary}
          />
        </View>
      </Card>
    </Pressable>
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
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.large,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: "center",
  },
  options: {
    gap: Spacing.lg,
  },
  optionCard: {
    padding: Spacing.lg,
  },
  optionContent: {
    alignItems: "center",
    gap: Spacing.lg,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.medium,
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: {
    flex: 1,
    gap: Spacing.xs,
  },
});
