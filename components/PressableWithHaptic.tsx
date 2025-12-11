// ===================================
// WARDATY - PRESSABLE WITH HAPTIC
// iOS-compliant pressable with automatic haptic feedback
// ===================================

import React from "react";
import { Pressable, PressableProps, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { HapticsUtils } from "@/lib/haptics";
import { Theme } from "@/constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PressableWithHapticProps extends PressableProps {
  /**
   * Type of haptic feedback
   */
  hapticType?: "light" | "medium" | "heavy" | "selection" | "none";
  
  /**
   * Scale animation on press
   */
  scaleOnPress?: boolean;
  
  /**
   * Scale value (default: 0.96)
   */
  scaleValue?: number;
  
  /**
   * Opacity animation on press
   */
  opacityOnPress?: boolean;
  
  /**
   * Opacity value (default: 0.6)
   */
  opacityValue?: number;
  
  /**
   * Children
   */
  children: React.ReactNode;
}

export function PressableWithHaptic({
  hapticType = "light",
  scaleOnPress = true,
  scaleValue = Theme.animations.buttonScale,
  opacityOnPress = false,
  opacityValue = 0.6,
  onPress,
  onPressIn,
  onPressOut,
  style,
  children,
  ...props
}: PressableWithHapticProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    const styles: ViewStyle = {};
    
    if (scaleOnPress) {
      styles.transform = [{ scale: scale.value }];
    }
    
    if (opacityOnPress) {
      styles.opacity = opacity.value;
    }
    
    return styles;
  });

  const handlePressIn = (event: any) => {
    if (scaleOnPress) {
      scale.value = withSpring(scaleValue, Theme.animations.spring);
    }
    
    if (opacityOnPress) {
      opacity.value = withTiming(opacityValue, { duration: Theme.animations.timing.fast });
    }
    
    onPressIn?.(event);
  };

  const handlePressOut = (event: any) => {
    if (scaleOnPress) {
      scale.value = withSpring(1, Theme.animations.spring);
    }
    
    if (opacityOnPress) {
      opacity.value = withTiming(1, { duration: Theme.animations.timing.fast });
    }
    
    onPressOut?.(event);
  };

  const handlePress = async (event: any) => {
    // Trigger haptic feedback
    switch (hapticType) {
      case "light":
        await HapticsUtils.light();
        break;
      case "medium":
        await HapticsUtils.medium();
        break;
      case "heavy":
        await HapticsUtils.heavy();
        break;
      case "selection":
        await HapticsUtils.selection();
        break;
      case "none":
        break;
    }
    
    onPress?.(event);
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, style]}
      {...props}
    >
      {children}
    </AnimatedPressable>
  );
}

/**
 * Button variant - with scale animation
 */
export function ButtonPressable(props: PressableWithHapticProps) {
  return (
    <PressableWithHaptic
      hapticType="light"
      scaleOnPress={true}
      {...props}
    />
  );
}

/**
 * Card variant - with subtle scale
 */
export function CardPressable(props: PressableWithHapticProps) {
  return (
    <PressableWithHaptic
      hapticType="light"
      scaleOnPress={true}
      scaleValue={Theme.animations.cardScale}
      {...props}
    />
  );
}

/**
 * Tab variant - with selection haptic
 */
export function TabPressable(props: PressableWithHapticProps) {
  return (
    <PressableWithHaptic
      hapticType="selection"
      scaleOnPress={false}
      opacityOnPress={true}
      {...props}
    />
  );
}

/**
 * Icon button variant - with medium haptic
 */
export function IconButtonPressable(props: PressableWithHapticProps) {
  return (
    <PressableWithHaptic
      hapticType="medium"
      scaleOnPress={true}
      scaleValue={0.9}
      {...props}
    />
  );
}

/**
 * Destructive action variant - with heavy haptic
 */
export function DestructivePressable(props: PressableWithHapticProps) {
  return (
    <PressableWithHaptic
      hapticType="heavy"
      scaleOnPress={true}
      {...props}
    />
  );
}
