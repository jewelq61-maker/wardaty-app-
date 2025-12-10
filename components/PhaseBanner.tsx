import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { Spacing, BorderRadius } from "@/constants/theme";
import { DetailedCyclePhase } from "@/lib/cycle-utils";

interface PhaseBannerProps {
  phase: DetailedCyclePhase;
  showFertile?: boolean;
}

const PHASE_COLORS: Record<DetailedCyclePhase, string> = {
  period: "#FF3860",
  fertile: "#8C64F0",
  ovulation: "#C67BFF",
  follicular: "#4CAF50",
  luteal: "#FF9800",
};

const PHASE_INFO: Record<DetailedCyclePhase, { en: { name: string; description: string }; ar: { name: string; description: string } }> = {
  period: {
    en: { name: "Period", description: "Rest and take care of yourself" },
    ar: { name: "الحيض", description: "استريحي واعتني بنفسك" },
  },
  follicular: {
    en: { name: "Follicular Phase", description: "Energy is rising, great for new activities" },
    ar: { name: "المرحلة الجرابية", description: "الطاقة في ارتفاع، مثالية للأنشطة الجديدة" },
  },
  fertile: {
    en: { name: "Fertile Window", description: "High fertility period" },
    ar: { name: "فترة الخصوبة", description: "فترة خصوبة عالية" },
  },
  ovulation: {
    en: { name: "Ovulation Day", description: "Peak fertility and energy" },
    ar: { name: "يوم الإباضة", description: "ذروة الخصوبة والطاقة" },
  },
  luteal: {
    en: { name: "Luteal Phase", description: "Prepare for your cycle, focus on self-care" },
    ar: { name: "المرحلة الأصفرية", description: "استعدي لدورتك، ركزي على العناية بالنفس" },
  },
};

export function PhaseBanner({ phase, showFertile = false }: PhaseBannerProps) {
  const { isDark } = useTheme();
  const { language, isRTL } = useLanguage();

  const displayPhase = !showFertile && (phase === "fertile" || phase === "ovulation") ? "follicular" : phase;
  const phaseColor = PHASE_COLORS[displayPhase];
  const phaseInfo = PHASE_INFO[displayPhase][language === "ar" ? "ar" : "en"];

  return (
    <Animated.View entering={FadeInDown.delay(150).springify()}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: phaseColor,
          },
        ]}
      >
        <View style={[styles.content, isRTL && { alignItems: "flex-end" }]}>
          <ThemedText
            type="h4"
            style={[styles.phaseName, { textAlign: isRTL ? "right" : "left" }]}
          >
            {phaseInfo.name}
          </ThemedText>
          <ThemedText
            type="caption"
            style={[styles.phaseDescription, { textAlign: isRTL ? "right" : "left" }]}
          >
            {phaseInfo.description}
          </ThemedText>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.large,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  content: {
    gap: Spacing.xs,
  },
  phaseName: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  phaseDescription: {
    color: "rgba(255, 255, 255, 0.85)",
  },
});
