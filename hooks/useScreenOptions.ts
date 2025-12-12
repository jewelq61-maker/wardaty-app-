// @ts-nocheck
import { Platform } from "react-native";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { isLiquidGlassAvailable } from "expo-glass-effect";

import { useTheme } from "./useTheme";
import { Typography, Animations } from "../constants/theme";

interface UseScreenOptionsParams {
  transparent?: boolean;
}

export function useScreenOptions({
  transparent = true,
}: UseScreenOptionsParams = {}): NativeStackNavigationOptions {
  const { theme, isDark } = useTheme();

  return {
    // Apple HIG: Navigation Bar
    headerTitleAlign: "center", // Apple HIG: centered titles
    headerTransparent: transparent,
    headerBlurEffect: isDark ? "dark" : "light",
    
    // Apple HIG: Tint color for back button and actions
    headerTintColor: theme.text,
    
    // Apple HIG: Title typography (17pt headline)
    headerTitleStyle: {
      fontSize: 17,
      fontWeight: "600",
      lineHeight: 22,
      letterSpacing: -0.41,
      fontFamily: "Tajawal-Bold",
      color: theme.text,
    },
    
    // Apple HIG: Large title support
    headerLargeTitle: false,
    headerLargeTitleStyle: {
      fontSize: 34,
      fontWeight: "700",
      lineHeight: 41,
      letterSpacing: 0.37,
      fontFamily: "Tajawal-Bold",
      color: theme.text,
    },
    
    // Background
    headerStyle: {
      backgroundColor: Platform.select({
        ios: undefined, // Use blur on iOS
        android: "rgba(26, 19, 48, 0.95)", // Wardaty dark with translucency
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
    animationDuration: Animations.timing.normal,
    
    // iOS presentation
    presentation: "card",
  };
}
