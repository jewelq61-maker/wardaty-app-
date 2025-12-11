import { Platform } from "react-native";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { isLiquidGlassAvailable } from "expo-glass-effect";

import { useTheme } from "./useTheme";
import { Theme } from "../constants/theme";

interface UseScreenOptionsParams {
  transparent?: boolean;
}

export function useScreenOptions({
  transparent = true,
}: UseScreenOptionsParams = {}): NativeStackNavigationOptions {
  const { theme, isDark } = useTheme();

  return {
    // iOS-compliant navigation
    headerTitleAlign: "center",
    headerTransparent: transparent,
    headerBlurEffect: isDark ? "dark" : "light",
    headerTintColor: theme.text,
    headerTitleStyle: {
      ...Theme.typography.headline,
      color: theme.text,
    },
    headerStyle: {
      backgroundColor: Platform.select({
        ios: undefined, // Use blur on iOS
        android: theme.backgroundRoot,
        web: theme.backgroundRoot,
      }),
    },
    
    // iOS gestures
    gestureEnabled: true,
    gestureDirection: "horizontal",
    fullScreenGestureEnabled: Platform.OS === "ios",
    
    // Content style
    contentStyle: {
      backgroundColor: theme.backgroundRoot,
    },
    
    // iOS animations
    animation: "default",
    animationDuration: Theme.animations.timing.normal,
    
    // iOS presentation
    presentation: "card",
  };
}
