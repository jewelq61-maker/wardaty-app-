import React from "react";
import { StyleSheet, Pressable, View, Switch } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { ThemedText } from "./ThemedText";
import { useTheme } from "../hooks/useTheme";
import { Spacing, BorderRadius, Animations } from "../constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SettingsItemProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle?: string;
  value?: string;
  valueColor?: string;
  isSwitch?: boolean;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onPress?: () => void;
  isDestructive?: boolean;
  showChevron?: boolean;
  titleColor?: string;
}

export function SettingsItem({
  icon,
  title,
  subtitle,
  value,
  valueColor,
  isSwitch,
  showSwitch,
  switchValue,
  onSwitchChange,
  onPress,
  isDestructive,
  showChevron,
  titleColor,
}: SettingsItemProps) {
  const { theme } = useTheme();
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

  const handleSwitchChange = (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSwitchChange?.(value);
  };

  const content = (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: theme.backgroundSecondary },
        ]}
      >
        <Feather
          name={icon}
          size={20}
          color={isDestructive ? theme.error : theme.primary}
        />
      </View>
      <View style={styles.content}>
        <ThemedText
          type="body"
          style={{ color: titleColor || (isDestructive ? theme.error : theme.text) }}
        >
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {(isSwitch || showSwitch) ? (
        <Switch
          value={switchValue}
          onValueChange={handleSwitchChange}
          trackColor={{ false: theme.backgroundSecondary, true: theme.primaryLight }}
          thumbColor={switchValue ? theme.primary : theme.textSecondary}
        />
      ) : value ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: Spacing.sm }}>
          <ThemedText type="body" style={{ color: valueColor || theme.textSecondary }}>
            {value}
          </ThemedText>
          {showChevron ? <Feather name="chevron-right" size={20} color={theme.textSecondary} /> : null}
        </View>
      ) : showChevron || onPress ? (
        <Feather name="chevron-right" size={20} color={theme.textSecondary} />
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={animatedStyle}
      >
        {content}
      </AnimatedPressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    gap: Spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.medium,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: 2,
  },
});
