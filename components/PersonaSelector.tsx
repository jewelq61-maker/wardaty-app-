import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Image, ImageSource } from "expo-image";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "./ThemedText";
import { useLanguage } from "../hooks/useLanguage";
import { Spacing, BorderRadius, Typography, Shadows } from "../constants/theme";
import { DarkTheme } from "../constants/theme";
import { Persona } from "../lib/types";

interface PersonaSelectorProps {
  selectedPersona: Persona | null;
  onSelect: (persona: Persona) => void;
}

// Persona colors matching requirements
const PERSONA_COLORS: Record<Persona, string> = {
  single: "#FF6B9D",
  married: "#FF8D8D",
  mother: "#A684F5",
  partner: "#7EC8E3",
};

// Dark glass theme colors
const GLASS_BG = "rgba(37, 27, 64, 0.6)";
const GLASS_BORDER = "rgba(255, 255, 255, 0.1)";
const BG_CARD = "#251B40";

const personaImages: Record<Persona, ImageSource> = {
  single: require("@/assets/images/icon-single-pink.png"),
  married: require("@/assets/images/icon-married-coral.png"),
  mother: require("@/assets/images/icon-mother-purple.png"),
  partner: require("@/assets/images/icon-single-pink.png"), // Reuse single icon for partner
};

const personaIds: Persona[] = ["single", "married", "mother", "partner"];

const personaLabels: Record<Persona, { ar: string; en: string; descAr: string; descEn: string }> = {
  single: {
    ar: "عزباء",
    en: "Single",
    descAr: "تتبعي دورتك وجمالك",
    descEn: "Track your cycle & beauty",
  },
  married: {
    ar: "متزوجة",
    en: "Married",
    descAr: "خططي لحياتك الزوجية",
    descEn: "Plan your married life",
  },
  mother: {
    ar: "أم",
    en: "Mother",
    descAr: "تابعي صحتك بعد الولادة",
    descEn: "Track postpartum health",
  },
  partner: {
    ar: "شريك",
    en: "Partner",
    descAr: "ادعمي شريكتك",
    descEn: "Support your partner",
  },
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function PersonaCard({
  personaId,
  isSelected,
  onSelect,
  isRTL,
}: {
  personaId: Persona;
  isSelected: boolean;
  onSelect: () => void;
  isRTL: boolean;
}) {
  const scale = useSharedValue(1);
  const labels = personaLabels[personaId];
  const personaColor = PERSONA_COLORS[personaId];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onSelect}
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 15 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15 });
      }}
      style={[
        styles.card,
        {
          borderColor: isSelected ? personaColor : GLASS_BORDER,
          borderWidth: isSelected ? 2 : 1,
          backgroundColor: isSelected ? `${personaColor}10` : BG_CARD,
        },
        isSelected && Shadows.small,
        animatedStyle,
      ]}
    >
      {/* Flower Icon */}
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: isSelected ? `${personaColor}20` : "rgba(255, 255, 255, 0.05)",
          },
        ]}
      >
        <Image
          source={personaImages[personaId]}
          style={styles.personaImage}
          contentFit="contain"
        />
      </View>

      {/* Title */}
      <ThemedText
        style={[
          styles.cardTitle,
          {
            color: isSelected ? personaColor : DarkTheme.text.primary,
            textAlign: "center",
          },
        ]}
      >
        {isRTL ? labels.ar : labels.en}
      </ThemedText>

      {/* Description */}
      <ThemedText
        style={[
          styles.cardDescription,
          {
            color: DarkTheme.text.secondary,
            textAlign: "center",
          },
        ]}
      >
        {isRTL ? labels.descAr : labels.descEn}
      </ThemedText>

      {/* Check Icon (when selected) */}
      {isSelected && (
        <View style={[styles.checkIcon, { backgroundColor: personaColor }]}>
          <Feather name="check" size={16} color="#FFFFFF" />
        </View>
      )}
    </AnimatedPressable>
  );
}

export function PersonaSelector({ selectedPersona, onSelect }: PersonaSelectorProps) {
  const { isRTL } = useLanguage();

  return (
    <View style={styles.container}>
      {personaIds.map((personaId) => (
        <PersonaCard
          key={personaId}
          personaId={personaId}
          isSelected={selectedPersona === personaId}
          onSelect={() => onSelect(personaId)}
          isRTL={isRTL}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: Spacing.md,
  },
  card: {
    width: "100%",
    padding: Spacing.lg,
    borderRadius: BorderRadius.large,
    alignItems: "center",
    gap: Spacing.xs,
    position: "relative",
    minHeight: 140,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xs,
  },
  personaImage: {
    width: 48,
    height: 48,
  },
  cardTitle: {
    ...Typography.headline,
  },
  cardDescription: {
    ...Typography.subheadline,
  },
  checkIcon: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
