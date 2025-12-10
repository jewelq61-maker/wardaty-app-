import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Image, ImageSource } from "expo-image";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { Spacing, BorderRadius } from "@/constants/theme";
import { Persona } from "@/lib/types";

interface PersonaSelectorProps {
  selectedPersona: Persona;
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
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const keys = personaTranslationKeys[personaId];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onSelect}
      onPressIn={() => {
        scale.value = withSpring(0.95, { damping: 15 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15 });
      }}
      style={[
        styles.card,
        {
          backgroundColor: isSelected ? theme.primary : theme.backgroundDefault,
          borderColor: isSelected ? theme.primary : theme.cardBorder,
        },
        animatedStyle,
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: isSelected ? "rgba(255,255,255,0.2)" : theme.backgroundSecondary,
          },
        ]}
      >
        <Image
          source={personaImages[personaId]}
          style={styles.personaImage}
          contentFit="contain"
        />
      </View>
      <ThemedText
        type="h4"
        style={{ 
          color: isSelected ? theme.buttonText : theme.text,
          textAlign: isRTL ? "right" : "center",
        }}
      >
        {t("onboarding", keys.title)}
      </ThemedText>
      <ThemedText
        type="small"
        style={{
          color: isSelected ? "rgba(255,255,255,0.8)" : theme.textSecondary,
          textAlign: "center",
        }}
      >
        {t("onboarding", keys.desc)}
      </ThemedText>
    </AnimatedPressable>
  );
}

export function PersonaSelector({ selectedPersona, onSelect }: PersonaSelectorProps) {
  const { t, isRTL } = useLanguage();
  
  return (
    <View style={styles.container}>
      {personaIds.map((personaId) => (
        <PersonaCard
          key={personaId}
          personaId={personaId}
          isSelected={selectedPersona === personaId}
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
    gap: Spacing.md,
  },
  card: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    alignItems: "center",
    gap: Spacing.sm,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
    overflow: "hidden",
  },
  personaImage: {
    width: 48,
    height: 48,
  },
});
