import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { ThemedText } from "./ThemedText";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";
import { Spacing, BorderRadius, Animations } from "../constants/theme";

interface BeautyRoutineCardProps {
  amCompleted: boolean;
  pmCompleted: boolean;
  isPremium?: boolean;
  onPress?: () => void;
  onUpgradePress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function BeautyRoutineCard({
  amCompleted,
  pmCompleted,
  isPremium = false,
  onPress,
  onUpgradePress,
}: BeautyRoutineCardProps) {
  const { theme, isDark } = useTheme();
  const { t, isRTL } = useLanguage();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(Animations.cardScale, Animations.spring);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, Animations.spring);
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundDefault,
          borderColor: theme.cardBorder,
        },
        animatedStyle,
      ]}
    >
      <View style={[styles.header, isRTL && { flexDirection: "row-reverse" }]}>
        <View style={[styles.iconContainer, { backgroundColor: `${theme.primary}15` }]}>
          <Feather name="heart" size={18} color={theme.primary} />
        </View>
        <View style={styles.headerText}>
          <ThemedText type="body" style={{ fontWeight: "600", textAlign: isRTL ? "right" : "left" }}>
            {t('beauty', 'routine')}
          </ThemedText>
        </View>
        <Feather name={isRTL ? "chevron-left" : "chevron-right"} size={18} color={theme.textSecondary} />
      </View>

      <View style={styles.content}>
        <View style={[styles.routineItem, isRTL && { flexDirection: "row-reverse" }]}>
          <View
            style={[
              styles.checkBox,
              {
                backgroundColor: amCompleted ? theme.success : theme.backgroundSecondary,
              },
            ]}
          >
            {amCompleted ? (
              <Feather name="check" size={14} color="#FFFFFF" />
            ) : null}
          </View>
          <ThemedText type="body">{t('beauty', 'amRoutine')}</ThemedText>
        </View>
        <View style={[styles.routineItem, isRTL && { flexDirection: "row-reverse" }]}>
          <View
            style={[
              styles.checkBox,
              {
                backgroundColor: pmCompleted ? theme.success : theme.backgroundSecondary,
              },
            ]}
          >
            {pmCompleted ? (
              <Feather name="check" size={14} color="#FFFFFF" />
            ) : null}
          </View>
          <ThemedText type="body">{t('beauty', 'pmRoutine')}</ThemedText>
        </View>
      </View>

      {!isPremium ? (
        <View style={[styles.premiumBanner, { backgroundColor: isDark ? "rgba(186,104,200,0.12)" : "rgba(186,104,200,0.08)" }]}>
          <View style={styles.premiumBannerContent}>
            <View style={[styles.premiumIcon, { backgroundColor: `${theme.secondary}20` }]}>
              <Feather name="star" size={14} color={theme.secondary} />
            </View>
            <View style={styles.premiumText}>
              <ThemedText type="caption" style={{ color: theme.secondary, fontWeight: "600" }}>
                {t('beauty', 'beautyPlanner')}
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                {t('beauty', 'premiumOnly')}
              </ThemedText>
            </View>
          </View>
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onUpgradePress?.();
            }}
            style={({ pressed }) => [
              styles.upgradeButton,
              { 
                backgroundColor: theme.secondary,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <ThemedText type="caption" style={{ color: "#fff", fontWeight: "600" }}>
              {t('beauty', 'upgradeToPremium')}
            </ThemedText>
          </Pressable>
        </View>
      ) : null}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    gap: Spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.small,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    gap: Spacing.sm,
  },
  routineItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  premiumBanner: {
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  premiumBannerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  premiumIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  premiumText: {
    flex: 1,
  },
  upgradeButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.small,
    alignItems: "center",
  },
});
