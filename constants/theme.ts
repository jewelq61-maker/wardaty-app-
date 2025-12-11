// ===================================
// WARDATY UNIFIED THEME SYSTEM
// Dark-first design with glassmorphism + iOS compliance
// ===================================

import { Platform } from "react-native";
import { Persona } from "@/lib/types";
import { iOSTokens, iOSTypography, iOSSpacing, iOSBorderRadius, iOSShadows } from "./ios-tokens";

// ===================================
// 1) DARK THEME COLORS (Global - Default)
// ===================================

export const DarkTheme = {
  // Backgrounds
  background: {
    root: "#0F0820",      // Darkest - main background
    elevated: "#1A1330",  // Slightly elevated surfaces
    card: "#251B40",      // Cards and containers
  },
  
  // Text
  text: {
    primary: "#FFFFFF",
    secondary: "rgba(255, 255, 255, 0.7)",
    tertiary: "rgba(255, 255, 255, 0.5)",
    disabled: "rgba(255, 255, 255, 0.3)",
  },
  
  // Borders
  border: {
    subtle: "rgba(255, 255, 255, 0.1)",
    default: "rgba(255, 255, 255, 0.2)",
    strong: "rgba(255, 255, 255, 0.3)",
  },
  
  // Overlays
  overlay: {
    light: "rgba(0, 0, 0, 0.3)",
    medium: "rgba(0, 0, 0, 0.5)",
    heavy: "rgba(0, 0, 0, 0.7)",
  },
} as const;

// ===================================
// 2) PERSONA COLORS (Accents Only)
// ===================================

export const PersonaColors = {
  single: {
    primary: "#FF5FA8",
    light: "#FF8FC4",
    dark: "#E54D96",
    glow: "rgba(255, 95, 168, 0.4)",
    gradient: ["#FF5FA8", "#FF8FC4"],
  },
  married: {
    primary: "#9D4EDD",
    light: "#C77DFF",
    dark: "#7B2CBF",
    glow: "rgba(157, 78, 221, 0.4)",
    gradient: ["#9D4EDD", "#C77DFF"],
  },
  mother: {
    primary: "#4CC9F0",
    light: "#72D7F7",
    dark: "#3AA5D1",
    glow: "rgba(76, 201, 240, 0.4)",
    gradient: ["#4CC9F0", "#72D7F7"],
  },
  partner: {
    primary: "#06D6A0",
    light: "#38E4B7",
    dark: "#05B385",
    glow: "rgba(6, 214, 160, 0.4)",
    gradient: ["#06D6A0", "#38E4B7"],
  },
} as const;

// ===================================
// 3) SEMANTIC COLORS (Status)
// ===================================

export const SemanticColors = {
  success: "#06D6A0",
  warning: "#FFB703",
  error: "#EF476F",
  info: "#4CC9F0",
  
  // With backgrounds
  successBg: "rgba(6, 214, 160, 0.15)",
  warningBg: "rgba(255, 183, 3, 0.15)",
  errorBg: "rgba(239, 71, 111, 0.15)",
  infoBg: "rgba(76, 201, 240, 0.15)",
} as const;

// ===================================
// 4) GLASSMORPHISM EFFECTS
// ===================================

export const GlassEffects = {
  light: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
  },
  medium: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
  },
  strong: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
  },
} as const;

// ===================================
// 5) SPACING (iOS 4pt grid)
// ===================================

export const Spacing = iOSSpacing;

// ===================================
// 6) BORDER RADIUS (iOS-compliant)
// ===================================

export const BorderRadius = iOSBorderRadius;

// ===================================
// 7) TYPOGRAPHY (iOS-compliant)
// ===================================

export const Typography = {
  // iOS standard text styles
  ...iOSTypography,
  
  // Wardaty-specific styles (for special cases)
  hero: {
    fontSize: 48,
    fontWeight: "700" as const,
    lineHeight: 56,
    fontFamily: "Tajawal-Bold",
  },
  cycleDayNumber: {
    fontSize: 64,
    fontWeight: "700" as const,
    letterSpacing: -2,
    fontFamily: "Tajawal-Bold",
  },
} as const;

// ===================================
// 8) SHADOWS (iOS-compliant)
// ===================================

export const Shadows = iOSShadows;

// ===================================
// 9) ANIMATIONS (iOS-compliant)
// ===================================

export const Animations = {
  spring: iOSTokens.animations.spring,
  springGentle: iOSTokens.animations.springGentle,
  springBouncy: iOSTokens.animations.springBouncy,
  timing: iOSTokens.animations.timing,
  buttonScale: iOSTokens.animations.buttonScale,
  cardScale: iOSTokens.animations.cardScale,
} as const;

// ===================================
// 10) ICON SIZES (iOS-compliant)
// ===================================

export const IconSizes = iOSTokens.iconSizes;

// ===================================
// 11) HAPTICS (iOS-compliant)
// ===================================

export const Haptics = iOSTokens.haptics;

// ===================================
// 12) HELPER FUNCTIONS
// ===================================

/**
 * Get persona color by type
 */
export function getPersonaColor(persona: Persona) {
  return PersonaColors[persona];
}

/**
 * Get text style by iOS type
 */
export function getTextStyle(style: keyof typeof Typography) {
  return Typography[style];
}

/**
 * Get spacing by size
 */
export function getSpacing(size: keyof typeof Spacing) {
  return Spacing[size];
}

/**
 * Get border radius by size
 */
export function getBorderRadius(size: keyof typeof BorderRadius) {
  return BorderRadius[size];
}

/**
 * Get shadow by size
 */
export function getShadow(size: keyof typeof Shadows) {
  return Shadows[size];
}

/**
 * Create glassmorphism style with persona glow
 */
export function createGlassStyle(
  persona: Persona,
  intensity: "light" | "medium" | "strong" = "medium"
) {
  const personaColor = getPersonaColor(persona);
  const baseGlass = GlassEffects[intensity];
  
  return {
    ...baseGlass,
    borderColor: personaColor.glow,
    shadowColor: personaColor.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  };
}

// ===================================
// 13) EXPORT ALL
// ===================================

export const Theme = {
  dark: DarkTheme,
  persona: PersonaColors,
  semantic: SemanticColors,
  glass: GlassEffects,
  spacing: Spacing,
  borderRadius: BorderRadius,
  typography: Typography,
  shadows: Shadows,
  animations: Animations,
  iconSizes: IconSizes,
  haptics: Haptics,
  
  // Helper functions
  getPersonaColor,
  getTextStyle,
  getSpacing,
  getBorderRadius,
  getShadow,
  createGlassStyle,
} as const;

export default Theme;
