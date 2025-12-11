// ===================================
// WARDATY - iOS DESIGN TOKENS
// Following Apple Human Interface Guidelines
// ===================================

import { Platform } from "react-native";

// ===================================
// 1. iOS TYPOGRAPHY
// ===================================

export const iOSTypography = {
  largeTitle: {
    fontSize: 34,
    fontWeight: "700" as const,
    lineHeight: 41,
    letterSpacing: 0.37,
    fontFamily: "Tajawal-Bold",
  },
  title1: {
    fontSize: 28,
    fontWeight: "400" as const,
    lineHeight: 34,
    letterSpacing: 0.36,
    fontFamily: "Tajawal-Regular",
  },
  title2: {
    fontSize: 22,
    fontWeight: "400" as const,
    lineHeight: 28,
    letterSpacing: 0.35,
    fontFamily: "Tajawal-Regular",
  },
  title3: {
    fontSize: 20,
    fontWeight: "400" as const,
    lineHeight: 25,
    letterSpacing: 0.38,
    fontFamily: "Tajawal-Regular",
  },
  headline: {
    fontSize: 17,
    fontWeight: "600" as const,
    lineHeight: 22,
    letterSpacing: -0.41,
    fontFamily: "Tajawal-Bold",
  },
  body: {
    fontSize: 17,
    fontWeight: "400" as const,
    lineHeight: 22,
    letterSpacing: -0.41,
    fontFamily: "Tajawal-Regular",
  },
  callout: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 21,
    letterSpacing: -0.32,
    fontFamily: "Tajawal-Regular",
  },
  subheadline: {
    fontSize: 15,
    fontWeight: "400" as const,
    lineHeight: 20,
    letterSpacing: -0.24,
    fontFamily: "Tajawal-Regular",
  },
  footnote: {
    fontSize: 13,
    fontWeight: "400" as const,
    lineHeight: 18,
    letterSpacing: -0.08,
    fontFamily: "Tajawal-Regular",
  },
  caption1: {
    fontSize: 12,
    fontWeight: "400" as const,
    lineHeight: 16,
    letterSpacing: 0,
    fontFamily: "Tajawal-Regular",
  },
  caption2: {
    fontSize: 11,
    fontWeight: "400" as const,
    lineHeight: 13,
    letterSpacing: 0.07,
    fontFamily: "Tajawal-Regular",
  },
} as const;

// ===================================
// 2. iOS SPACING (4pt grid)
// ===================================

export const iOSSpacing = {
  xxxs: 2,   // 0.5 × 4
  xxs: 4,    // 1 × 4
  xs: 8,     // 2 × 4
  sm: 12,    // 3 × 4
  md: 16,    // 4 × 4 (most common)
  lg: 20,    // 5 × 4
  xl: 24,    // 6 × 4
  xxl: 32,   // 8 × 4
  xxxl: 44,  // 11 × 4 (min tap target)
  
  // iOS Specific
  screenPadding: 16,        // Standard screen edges
  cardPadding: 16,          // Standard card padding
  listItemPadding: 16,      // List item horizontal padding
  listItemHeight: 44,       // Min list item height
  buttonHeight: 50,         // Standard button height
  inputHeight: 44,          // Standard input height
  tabBarHeight: 49,         // iOS tab bar height (without safe area)
  navigationBarHeight: 44,  // iOS navigation bar height
  statusBarHeight: 20,      // iOS status bar height (non-notch)
  fabSize: 56,              // FAB button size
} as const;

// ===================================
// 3. iOS SYSTEM COLORS (Dark Mode)
// ===================================

export const iOSSystemColors = {
  // Labels
  label: "rgba(255, 255, 255, 1.0)",              // Primary text
  secondaryLabel: "rgba(235, 235, 245, 0.6)",     // Secondary text
  tertiaryLabel: "rgba(235, 235, 245, 0.3)",      // Tertiary text
  quaternaryLabel: "rgba(235, 235, 245, 0.18)",   // Quaternary text
  
  // Fills (for UI elements)
  systemFill: "rgba(120, 120, 128, 0.36)",
  secondarySystemFill: "rgba(120, 120, 128, 0.32)",
  tertiarySystemFill: "rgba(118, 118, 128, 0.24)",
  quaternarySystemFill: "rgba(118, 118, 128, 0.18)",
  
  // Backgrounds
  systemBackground: "#000000",                     // Primary background
  secondarySystemBackground: "#1C1C1E",            // Grouped background
  tertiarySystemBackground: "#2C2C2E",             // Grouped content background
  
  // Grouped Backgrounds
  systemGroupedBackground: "#000000",
  secondarySystemGroupedBackground: "#1C1C1E",
  tertiarySystemGroupedBackground: "#2C2C2E",
  
  // Separators
  separator: "rgba(84, 84, 88, 0.6)",
  opaqueSeparator: "#38383A",
  
  // Link
  link: "#0A84FF",
} as const;

// ===================================
// 4. iOS BORDER RADIUS
// ===================================

export const iOSBorderRadius = {
  xs: 8,
  small: 10,
  medium: 12,
  large: 14,
  xlarge: 16,
  xxlarge: 20,
  full: 9999,
} as const;

// ===================================
// 5. iOS SHADOWS
// ===================================

export const iOSShadows = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  xlarge: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 6,
  },
} as const;

// ===================================
// 6. iOS ANIMATIONS
// ===================================

export const iOSAnimations = {
  // Spring presets
  spring: {
    damping: 20,
    stiffness: 300,
    mass: 1,
  },
  springGentle: {
    damping: 25,
    stiffness: 250,
    mass: 1,
  },
  springBouncy: {
    damping: 15,
    stiffness: 350,
    mass: 1,
  },
  
  // Timing
  timing: {
    instant: 0,
    fast: 200,
    normal: 300,
    slow: 400,
  },
  
  // Scales
  buttonScale: 0.96,
  cardScale: 0.98,
} as const;

// ===================================
// 7. iOS ICON SIZES
// ===================================

export const iOSIconSizes = {
  small: 20,
  medium: 24,
  large: 28,
  xlarge: 32,
} as const;

// ===================================
// 8. iOS HAPTICS
// ===================================

export const iOSHaptics = {
  light: "light" as const,
  medium: "medium" as const,
  heavy: "heavy" as const,
  success: "success" as const,
  warning: "warning" as const,
  error: "error" as const,
  selection: "selection" as const,
} as const;

// ===================================
// 9. HELPER FUNCTIONS
// ===================================

export function getTextStyle(style: keyof typeof iOSTypography) {
  return iOSTypography[style];
}

export function getSpacing(size: keyof typeof iOSSpacing) {
  return iOSSpacing[size];
}

export function getBorderRadius(size: keyof typeof iOSBorderRadius) {
  return iOSBorderRadius[size];
}

export function getShadow(size: keyof typeof iOSShadows) {
  return iOSShadows[size];
}

// ===================================
// 10. EXPORT ALL
// ===================================

export const iOSTokens = {
  typography: iOSTypography,
  spacing: iOSSpacing,
  colors: iOSSystemColors,
  borderRadius: iOSBorderRadius,
  shadows: iOSShadows,
  animations: iOSAnimations,
  iconSizes: iOSIconSizes,
  haptics: iOSHaptics,
} as const;

export default iOSTokens;
