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
import { Spacing, BorderRadius, Typography, Shadows, IconSizes } from "../constants/design-tokens";
import { PersonaColors, NeutralColors, LightBackgrounds } from "../constants/colors";
import { Persona } from "../lib/types";

interface PersonaSelectorProps {
  selected: Persona;
  onSelect: (persona: Persona) => void;
}

const personaImages: Record<Persona, ImageSource> = {
  single: require("@/assets/images/icon-single-pink.png"),
  married: require("@/assets/images/icon-married-coral.png"),
  mother: require("@/assets/images/icon-mother-purple.png"),
};

const personaIds: Persona[] = ["single", "married", "mother"];

const personaTranslationKeys: Record<Persona, { title: string; desc: string }> = {
  single: { title: "single", desc: "singleDesc" },
  married: { title: "married", desc: "marriedDesc" },
  mother: { title: "mother", desc: "motherDesc" },
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function PersonaCard({
  personaId,
  isSelected,
  onSelect,
  t,
  isRTL,
}: {
  personaId: Persona;
  isSelected: boolean;
  onSelect: () => void;
  t: (section: string, key: string) => string;
  isRTL: boolean;
}) {
  const scale = useSharedValue(1);
  const keys = personaTranslationKeys[personaId];
  const personaColor = PersonaColors[personaId].primary;

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
          backgroundColor: NeutralColors.white,
          borderColor: isSelected ? personaColor : NeutralColors.gray[200],
          borderWidth: isSelected ? 2 : 1,
        },
        isSelected && {
          ...Shadows.light.md,
        },
        animatedStyle,
      ]}
    >
      {/* Flower Icon */}
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: isSelected 
              ? `${personaColor}15` 
              : NeutralColors.gray[50],
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
            color: isSelected ? personaColor : "#2C3E50",
            textAlign: "center",
          },
        ]}
      >
        {t("onboarding", keys.title)}
      </ThemedText>

      {/* Description */}
      <ThemedText
        style={[
          styles.cardDescription,
          {
            color: NeutralColors.gray[600],
            textAlign: "center",
          },
        ]}
      >
        {t("onboarding", keys.desc)}
      </ThemedText>

      {/* Check Icon (when selected) */}
      {isSelected && (
        <View style={[styles.checkIcon, { backgroundColor: personaColor }]}>
          <Feather name="check" size={16} color={NeutralColors.white} />
        </View>
      )}
    </AnimatedPressable>
  );
}

export function PersonaSelector({ selected, onSelect }: PersonaSelectorProps) {
  const { t, isRTL } = useLanguage();
  
  return (
    <View style={styles.container}>
      {personaIds.map((personaId) => (
        <PersonaCard
          key={personaId}
          personaId={personaId}
          isSelected={selected === personaId}
          onSelect={() => onSelect(personaId)}
          t={t}
          isRTL={isRTL}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: Spacing.base,
  },
  card: {
    width: "100%",
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    alignItems: "center",
    gap: Spacing.sm,
    position: "relative",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  personaImage: {
    width: 56,
    height: 56,
  },
  cardTitle: {
    fontSize: Typography.h3.fontSize,
    lineHeight: Typography.h3.lineHeight,
    fontWeight: Typography.h3.fontWeight,
  },
  cardDescription: {
    fontSize: Typography.bodySmall.fontSize,
    lineHeight: Typography.bodySmall.lineHeight,
    fontWeight: Typography.bodySmall.fontWeight,
  },
  checkIcon: {
    position: "absolute",
    top: Spacing.base,
    right: Spacing.base,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});
