// ===================================
// WARDATY UNIFIED THEME SYSTEM
// Dark-first design with glassmorphism
// ===================================

import { Platform } from "react-native";
import { Persona } from "@/lib/types";

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
    gradient: ["#9A63E8", "#FF5FA8"] as const,
  },
  married: {
    primary: "#FF7C7C",
    light: "#FF9E9E",
    dark: "#E66666",
    glow: "rgba(255, 124, 124, 0.4)",
    gradient: ["#9A63E8", "#FF7C7C"] as const,
  },
  mother: {
    primary: "#9A63E8",
    light: "#B084F0",
    dark: "#8450D9",
    glow: "rgba(154, 99, 232, 0.4)",
    gradient: ["#9A63E8", "#B084F0"] as const,
  },
} as const;

// ===================================
// 3) CYCLE COLORS
// ===================================

export const CycleColors = {
  period: "#FF3860",
  periodLight: "#FF8FB5",
  fertile: "#8C64F0",
  fertileLight: "#D4B9FF",
  normal: "#FFB5C5",
  normalLight: "#FFD4E0",
  qadha: "#4CAF50",
  qadhaLight: "#A5F3C6",
  ovulation: "#C67BFF",
  ovulationLight: "#D4B9FF",
  follicular: "#4CAF50",
  luteal: "#FF9800",
  lutealLight: "#FFCCAA",
} as const;

// ===================================
// 4) GLASS EFFECTS
// ===================================

export const Glass = {
  blur: 40,
  tint: "rgba(37, 27, 64, 0.7)",  // card color with opacity
  border: "rgba(255, 255, 255, 0.1)",
  opacity: 0.8,
} as const;

export const GlassEffect = {
  blur: 40,
  opacity: 0.8,
  borderWidth: 0.5,
  tint: "dark" as const,
};

// ===================================
// 5) SPACING SYSTEM
// ===================================

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 48,
  inputHeight: 50,
  buttonHeight: 52,
  fabSize: 64,
  tabBarHeight: 72,
} as const;

// ===================================
// 6) BORDER RADIUS
// ===================================

export const BorderRadius = {
  xs: 8,
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
  full: 9999,
} as const;

// ===================================
// 7) TYPOGRAPHY
// ===================================

export const Typography = {
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
  extraLarge: {
    fontSize: 48,
    fontWeight: "700" as const,
    letterSpacing: -1,
    fontFamily: "Tajawal-Bold",
  },
  largeTitle: {
    fontSize: 34,
    fontWeight: "700" as const,
    letterSpacing: -0.5,
    fontFamily: "Tajawal-Bold",
  },
  h1: {
    fontSize: 28,
    fontWeight: "700" as const,
    letterSpacing: -0.3,
    fontFamily: "Tajawal-Bold",
  },
  h2: {
    fontSize: 22,
    fontWeight: "600" as const,
    letterSpacing: -0.2,
    fontFamily: "Tajawal-Bold",
  },
  h3: {
    fontSize: 20,
    fontWeight: "600" as const,
    letterSpacing: -0.1,
    fontFamily: "Tajawal-Bold",
  },
  h4: {
    fontSize: 17,
    fontWeight: "600" as const,
    letterSpacing: 0,
    fontFamily: "Tajawal-Bold",
  },
  body: {
    fontSize: 17,
    fontWeight: "400" as const,
    letterSpacing: 0,
    fontFamily: "Tajawal-Regular",
  },
  bodyBold: {
    fontSize: 17,
    fontWeight: "600" as const,
    letterSpacing: 0,
    fontFamily: "Tajawal-Bold",
  },
  callout: {
    fontSize: 16,
    fontWeight: "400" as const,
    letterSpacing: 0,
    fontFamily: "Tajawal-Regular",
  },
  caption: {
    fontSize: 12,
    fontWeight: "500" as const,
    letterSpacing: 0.1,
    fontFamily: "Tajawal-Medium",
  },
  small: {
    fontSize: 11,
    fontWeight: "500" as const,
    letterSpacing: 0.2,
    fontFamily: "Tajawal-Medium",
  },
  link: {
    fontSize: 17,
    fontWeight: "500" as const,
    letterSpacing: 0,
    fontFamily: "Tajawal-Medium",
  },
} as const;

// ===================================
// 8) SHADOWS & GLOWS
// ===================================

export const Shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  cardSubtle: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHover: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  glow: {
    shadowColor: "#9A63E8",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  glowAccent: {
    shadowColor: "#FF5FA8",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  fab: {
    shadowColor: "#FF5FA8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  floating: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  cycleRing: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  glass: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
} as const;

export function getPersonaGlow(persona: Persona) {
  return {
    shadowColor: PersonaColors[persona].primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  };
}

// ===================================
// 9) ICON SIZES
// ===================================

export const IconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
  xxl: 48,
} as const;

// ===================================
// 10) LAYOUT CONSTANTS
// ===================================

export const Layout = {
  screenPadding: Spacing.xl,
  cardPadding: Spacing.lg,
  sectionSpacing: Spacing.xxl,
  bottomNavHeight: 72,
  fabSize: 56,
} as const;

// ===================================
// 11) GRADIENTS
// ===================================

export const Gradients = {
  primary: ["#9A63E8", "#FF5FA8"] as const,
  primarySubtle: ["#B084F0", "#FF8FC4"] as const,
  accent: ["#FF5FA8", "#FF8FC4"] as const,
  period: ["#FF3860", "#FF6B9D"] as const,
  fertile: ["#8C64F0", "#A684F5"] as const,
  normal: ["#FFB5C5", "#FFD4E0"] as const,
  qadha: ["#4CAF50", "#81C784"] as const,
  background: ["#0F0820", "#1A1330"] as const,
  card: ["rgba(154, 99, 232, 0.12)", "rgba(255, 95, 168, 0.08)"] as const,
  cardGlow: ["rgba(154, 99, 232, 0.2)", "rgba(255, 95, 168, 0.15)"] as const,
  fab: ["#FF5FA8", "#FF8FC4"] as const,
  glass: ["rgba(37, 27, 64, 0.9)", "rgba(37, 27, 64, 0.7)"] as const,
  phasePill: {
    period: ["#FF3860", "#FF6B9D"] as const,
    fertile: ["#8C64F0", "#A684F5"] as const,
    ovulation: ["#BA68C8", "#CE93D8"] as const,
    follicular: ["#4CAF50", "#81C784"] as const,
    luteal: ["#FF9800", "#FFB74D"] as const,
  },
} as const;

// ===================================
// 12) ANIMATIONS
// ===================================

export const Animations = {
  spring: {
    damping: 25,
    stiffness: 350,
  },
  springFast: {
    damping: 20,
    stiffness: 400,
  },
  springGentle: {
    damping: 30,
    stiffness: 250,
  },
  springBouncy: {
    damping: 15,
    stiffness: 300,
  },
  springLiquid: {
    damping: 18,
    stiffness: 280,
  },
  springSmooth: {
    damping: 22,
    stiffness: 200,
  },
  buttonScale: 0.96,
  cardScale: 0.98,
  pillScale: 0.97,
  fabRotation: 45,
  duration: {
    fast: 150,
    normal: 250,
    slow: 400,
  },
  cardEnter: {
    delay: 100,
    duration: 400,
  },
} as const;

// ===================================
// 13) HELPER FUNCTIONS
// ===================================

export function getPersonaPrimary(persona: Persona): string {
  return PersonaColors[persona].primary;
}

export function getPersonaLight(persona: Persona): string {
  return PersonaColors[persona].light;
}

export function getPersonaDark(persona: Persona): string {
  return PersonaColors[persona].dark;
}

export function getPersonaGlowColor(persona: Persona): string {
  return PersonaColors[persona].glow;
}

export function getPersonaGradient(persona: Persona): readonly [string, string] {
  return PersonaColors[persona].gradient;
}

// ===================================
// 14) FONTS
// ===================================

export const Fonts = Platform.select({
  ios: {
    sans: "Tajawal-Regular",
    serif: "Tajawal-Regular",
    rounded: "Tajawal-Regular",
    mono: "Menlo",
  },
  default: {
    sans: "Tajawal-Regular",
    serif: "Tajawal-Regular",
    rounded: "Tajawal-Regular",
    mono: "monospace",
  },
  web: {
    sans: "Tajawal, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Tajawal, Georgia, 'Times New Roman', serif",
    rounded: "Tajawal, -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// ===================================
// 15) LEGACY SUPPORT (for gradual migration)
// ===================================

export const Colors = {
  dark: {
    text: DarkTheme.text.primary,
    textSecondary: DarkTheme.text.secondary,
    textMuted: DarkTheme.text.tertiary,
    buttonText: DarkTheme.text.primary,
    tabIconDefault: DarkTheme.text.tertiary,
    tabIconSelected: PersonaColors.single.primary,
    link: PersonaColors.mother.primary,
    backgroundRoot: DarkTheme.background.root,
    backgroundDefault: DarkTheme.background.root,
    backgroundSecondary: DarkTheme.background.elevated,
    backgroundTertiary: DarkTheme.background.card,
    backgroundElevated: DarkTheme.background.elevated,
    backgroundGlass: Glass.tint,
    primary: PersonaColors.mother.primary,
    primaryLight: PersonaColors.mother.light,
    primaryDark: PersonaColors.mother.dark,
    primarySoft: PersonaColors.mother.glow,
    accent: PersonaColors.single.primary,
    accentLight: PersonaColors.single.light,
    accentDark: PersonaColors.single.dark,
    accentSoft: PersonaColors.single.glow,
    secondary: PersonaColors.mother.primary,
    secondaryLight: PersonaColors.mother.light,
    secondaryDark: PersonaColors.mother.dark,
    period: CycleColors.period,
    periodLight: CycleColors.periodLight,
    fertile: CycleColors.fertile,
    fertileLight: CycleColors.fertileLight,
    normal: CycleColors.normal,
    normalLight: CycleColors.normalLight,
    ovulation: CycleColors.ovulation,
    follicular: CycleColors.follicular,
    luteal: CycleColors.luteal,
    qadha: CycleColors.qadha,
    warning: "#FF9F0A",
    success: "#30D158",
    error: "#FF453A",
    info: "#64D2FF",
    border: DarkTheme.border.default,
    cardBorder: DarkTheme.border.subtle,
    glassBackground: Glass.tint,
    glassBorder: Glass.border,
    glowPrimary: PersonaColors.mother.glow,
    glowAccent: PersonaColors.single.glow,
    overlay: DarkTheme.overlay.medium,
  },
};

// Persona Accents (legacy)
export const PersonaAccents = PersonaColors;

// Brand Colors (legacy)
export const BrandColors = {
  violet: {
    main: PersonaColors.mother.primary,
    light: PersonaColors.mother.light,
    dark: PersonaColors.mother.dark,
    soft: PersonaColors.mother.glow,
  },
  coral: {
    main: PersonaColors.single.primary,
    light: PersonaColors.single.light,
    dark: PersonaColors.single.dark,
    soft: PersonaColors.single.glow,
  },
  pink: {
    main: PersonaColors.single.primary,
    light: PersonaColors.single.light,
    dark: PersonaColors.single.dark,
    soft: PersonaColors.single.glow,
  },
  purple: {
    main: PersonaColors.mother.primary,
    light: PersonaColors.mother.light,
    dark: PersonaColors.mother.dark,
    soft: PersonaColors.mother.glow,
  },
};

export const PremiumDark = {
  card: DarkTheme.background.card,
  cardBlur: Glass.blur,
  cardBorderGlow: PersonaColors.mother.glow,
  cardShadow: "rgba(0, 0, 0, 0.5)",
  cardRadius: BorderRadius.large,
};
