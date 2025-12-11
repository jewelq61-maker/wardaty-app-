import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "./ThemedText";
import { useTheme } from "../hooks/useTheme";
import { Spacing, BorderRadius } from "../constants/theme";
import { Persona } from "../lib/types";

interface ProfileCardProps {
  name: string;
  persona: Persona;
  isSubscribed: boolean;
}

const personaLabels: Record<Persona, string> = {
  single: "Single",
  partner: "Partner",
  married: "Married",
  mother: "Mother",
};

const personaIcons: Record<Persona, keyof typeof Feather.glyphMap> = {
  single: "user",
  partner: "link",
  married: "heart",
  mother: "users",
};

export function ProfileCard({ name, persona, isSubscribed }: ProfileCardProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder },
      ]}
    >
      <View style={[styles.avatar, { backgroundColor: theme.primaryLight }]}>
        <Feather name="user" size={32} color="#FFFFFF" />
      </View>
      <View style={styles.info}>
        <ThemedText type="h3">{name || "Welcome"}</ThemedText>
        <View style={styles.badges}>
          <View style={[styles.badge, { backgroundColor: theme.backgroundSecondary }]}>
            <Feather name={personaIcons[persona]} size={14} color={theme.primary} />
            <ThemedText type="small" style={{ color: theme.primary }}>
              {personaLabels[persona]}
            </ThemedText>
          </View>
          {isSubscribed ? (
            <View style={[styles.badge, { backgroundColor: theme.secondary }]}>
              <Feather name="award" size={14} color="#FFFFFF" />
              <ThemedText type="small" style={{ color: "#FFFFFF" }}>
                Plus
              </ThemedText>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    gap: Spacing.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    gap: Spacing.sm,
  },
  badges: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.small,
  },
});
