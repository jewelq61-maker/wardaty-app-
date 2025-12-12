// ===================================
// WARDATY UNIFIED THEME SYSTEM
// Dark-first design with glassmorphism + iOS compliance
// ===================================

import { Platform } from "react-native";
import { Persona } from "../lib/types";
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
    primary: "#8C64F0",
    light: "#A78BF5",
    dark: "#6B4BC4",
    soft: "rgba(140, 100, 240, 0.15)",
    glow: "rgba(140, 100, 240, 0.3)",
    gradient: ["#8C64F0", "#FF5FA8"] as const,
  },
  married: {
    primary: "#FF5FA8",
    light: "#FF8BC0",
    dark: "#E04A8F",
    soft: "rgba(255, 95, 168, 0.15)",
    glow: "rgba(255, 95, 168, 0.3)",
    gradient: ["#FF5FA8", "#FFB8D9"] as const,
  },
  mother: {
    primary: "#06D6A0",
    light: "#4DE3BA",
    dark: "#05B589",
    soft: "rgba(6, 214, 160, 0.15)",
    glow: "rgba(6, 214, 160, 0.3)",
    gradient: ["#06D6A0", "#4DE3BA"] as const,
  },
  partner: {
    primary: "#7EC8E3",
    light: "#A0D9ED",
    dark: "#5BA8C3",
    soft: "rgba(126, 200, 227, 0.15)",
    glow: "rgba(126, 200, 227, 0.3)",
    gradient: ["#7EC8E3", "#A0D9ED"] as const,
  },
} as const;

// ===================================
// 3) GLASS EFFECTS
// ===================================

export const GlassEffects = {
  background: "rgba(37, 27, 64, 0.6)",
  border: "rgba(255, 255, 255, 0.1)",
  blur: 20,
  light: {
    backgroundColor: "rgba(37, 27, 64, 0.6)",
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
  },
  dark: {
    backgroundColor: "rgba(15, 8, 32, 0.8)",
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
  },
} as const;

// ===================================
// 4) STATUS COLORS
// ===================================

export const StatusColors = {
  success: "#06D6A0",
  warning: "#FFB020",
  error: "#FF5252",
  info: "#5B9FED",
} as const;

// ===================================
// 5) CYCLE COLORS
// ===================================

export const CycleColors = {
  period: "#FF5FA8",
  periodLight: "rgba(255, 95, 168, 0.15)",
  fertile: "#06D6A0",
  fertileLight: "rgba(6, 214, 160, 0.15)",
  ovulation: "#FFB020",
  ovulationLight: "rgba(255, 176, 32, 0.15)",
  normal: "#8C64F0",
  normalLight: "rgba(140, 100, 240, 0.15)",
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
// 7) TYPOGRAPHY (iOS-compliant with aliases)
// ===================================

export const Typography = {
  // iOS standard text styles - explicit definitions
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
  
  // Aliases for ThemedText compatibility
  h1: {
    fontSize: 34,
    fontWeight: "700" as const,
    lineHeight: 41,
    letterSpacing: 0.37,
    fontFamily: "Tajawal-Bold",
  },
  h2: {
    fontSize: 28,
    fontWeight: "400" as const,
    lineHeight: 34,
    letterSpacing: 0.36,
    fontFamily: "Tajawal-Regular",
  },
  h3: {
    fontSize: 22,
    fontWeight: "400" as const,
    lineHeight: 28,
    letterSpacing: 0.35,
    fontFamily: "Tajawal-Regular",
  },
  h4: {
    fontSize: 20,
    fontWeight: "400" as const,
    lineHeight: 25,
    letterSpacing: 0.38,
    fontFamily: "Tajawal-Regular",
  },
  caption: {
    fontSize: 13,
    fontWeight: "400" as const,
    lineHeight: 18,
    letterSpacing: -0.08,
    fontFamily: "Tajawal-Regular",
  },
  small: {
    fontSize: 12,
    fontWeight: "400" as const,
    lineHeight: 16,
    letterSpacing: 0,
    fontFamily: "Tajawal-Regular",
  },
  link: {
    fontSize: 17,
    fontWeight: "400" as const,
    lineHeight: 22,
    letterSpacing: -0.41,
    fontFamily: "Tajawal-Regular",
  },
  
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

export function getPersonaColor(persona: Persona) {
  return PersonaColors[persona];
}

export function getPersonaGradient(persona: Persona): readonly [string, string] {
  return PersonaColors[persona].gradient;
}

export function getCyclePhaseColor(phase: "period" | "fertile" | "ovulation" | "normal"): string {
  return CycleColors[phase];
}
