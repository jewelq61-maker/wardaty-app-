/**
 * WARDATY OFFICIAL COLOR SYSTEM
 * 
 * This file contains ALL official colors used in the Wardaty app.
 * NO inline hex values are allowed anywhere else in the codebase.
 * All components MUST use these tokens.
 */

// ===================================
// 1) BASE BRAND COLORS (GLOBAL)
// ===================================

export const BrandColors = {
  violet: {
    main: "#8C64F0",
    light: "#A684F5",
    dark: "#7450D9",
    soft: "rgba(140, 100, 240, 0.15)",
  },
  coral: {
    main: "#FF6B9D",
    light: "#FF8FB5",
    dark: "#E85585",
    soft: "rgba(255, 107, 157, 0.15)",
  },
} as const;

// ===================================
// 2) DARK MODE BACKGROUNDS
// ===================================

export const DarkBackgrounds = {
  base: "#0F0820",
  elevated: "#1A1330",
  card: "#251B40",
} as const;

// ===================================
// 3) GRADIENTS
// ===================================

export const Gradients = {
  main: {
    colors: ["#8C64F0", "#FF6B9D"] as const,
    angle: 135,
  },
  soft: {
    colors: ["#A684F5", "#FFB5C5"] as const,
    angle: 135,
  },
} as const;

// ===================================
// 4) PERSONA COLORS (EXACT APP COLORS)
// ===================================

export const PersonaColors = {
  single: {
    flower: "#FF6BBD",
    accentOverlay: "#FF6B9D",
    secondary: "#A684F5",
    gradient: ["#A684F5", "#FF6B9D"] as const,
  },
  married: {
    flower: "#FF8F8F",
    accentOverlay: "#FF6B9D",
    secondary: "#F2C27B", // warm gold
    gradient: ["#8C64F0", "#F2C27B"] as const,
  },
  mother: {
    flower: "#A58BFF",
    accentOverlay: "#34C759",
    secondary: "#8CD7B1",
    gradient: ["#8C64F0", "#34C759"] as const,
  },
  partner: {
    flower: "#8CD3F8",
    accentOverlay: "#FF8FB5",
    secondary: "#6FB9D8",
    gradient: ["#8C64F0", "#8CD3F8"] as const,
  },
} as const;

// ===================================
// 5) CYCLE COLORS
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
// 6) LIGHT MODE PHASE COLORS
// ===================================

export const LightModePhaseColors = {
  period: "#FF8FB5",
  fertile: "#D4B9FF",
  ovulation: "#C67BFF",
  luteal: "#FFCCAA",
  qadha: "#A5F3C6",
  follicular: "#A5F3C6",
} as const;

// ===================================
// 7) LIGHT MODE RING GRADIENT
// ===================================

export const LightModeRingGradient = {
  start: "#C8B8FF",
  end: "#FFB7D6",
} as const;

// ===================================
// 8) SEMANTIC COLORS
// ===================================

export const SemanticColors = {
  success: "#34C759",
  warning: "#FF9500",
  error: "#FF3B30",
  info: "#007AFF",
} as const;

// ===================================
// 9) NEUTRAL COLORS
// ===================================

export const NeutralColors = {
  white: "#FFFFFF",
  black: "#000000",
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },
} as const;

// ===================================
// 10) THEME COLORS (LIGHT & DARK)
// ===================================

export const LightTheme = {
  // Backgrounds
  background: NeutralColors.white,
  backgroundSecondary: NeutralColors.gray[50],
  backgroundElevated: NeutralColors.white,
  card: NeutralColors.white,
  
  // Text
  text: NeutralColors.gray[900],
  textSecondary: NeutralColors.gray[600],
  textTertiary: NeutralColors.gray[400],
  
  // Primary & Accent
  primary: BrandColors.violet.main,
  primaryLight: BrandColors.violet.light,
  primaryDark: BrandColors.violet.dark,
  accent: BrandColors.coral.main,
  accentLight: BrandColors.coral.light,
  
  // Borders & Dividers
  border: NeutralColors.gray[200],
  divider: NeutralColors.gray[100],
  
  // Shadows
  shadow: "rgba(0, 0, 0, 0.1)",
} as const;

export const DarkTheme = {
  // Backgrounds
  background: DarkBackgrounds.base,
  backgroundSecondary: DarkBackgrounds.elevated,
  backgroundElevated: DarkBackgrounds.card,
  card: DarkBackgrounds.card,
  
  // Text
  text: NeutralColors.white,
  textSecondary: "rgba(255, 255, 255, 0.7)",
  textTertiary: "rgba(255, 255, 255, 0.5)",
  
  // Primary & Accent
  primary: BrandColors.violet.light,
  primaryLight: BrandColors.violet.light,
  primaryDark: BrandColors.violet.dark,
  accent: BrandColors.coral.light,
  accentLight: BrandColors.coral.light,
  
  // Borders & Dividers
  border: "rgba(255, 255, 255, 0.1)",
  divider: "rgba(255, 255, 255, 0.05)",
  
  // Shadows
  shadow: "rgba(0, 0, 0, 0.3)",
} as const;

// ===================================
// 11) HELPER FUNCTIONS
// ===================================

export function getPersonaGradient(persona: keyof typeof PersonaColors) {
  return PersonaColors[persona].gradient;
}

export function getPersonaAccent(persona: keyof typeof PersonaColors) {
  return PersonaColors[persona].accentOverlay;
}

export function getPersonaSecondary(persona: keyof typeof PersonaColors) {
  return PersonaColors[persona].secondary;
}

// ===================================
// 12) TYPE EXPORTS
// ===================================

export type Persona = keyof typeof PersonaColors;
export type ThemeMode = "light" | "dark";
export type Theme = typeof LightTheme | typeof DarkTheme;
