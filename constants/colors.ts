/**
 * WARDATY OFFICIAL COLOR SYSTEM
 * Based on Wardaty website design (https://wardaty-lp-mh8upk2a.manus.space/)
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
  base: "#0F0820",      // Deepest background
  elevated: "#1A1330",  // Elevated surfaces
  card: "#251B40",      // Card backgrounds
} as const;

// ===================================
// 3) LIGHT MODE BACKGROUNDS
// ===================================

export const LightBackgrounds = {
  base: "#F8F9FA",      // Main background (from website)
  elevated: "#FFFFFF",  // Elevated surfaces
  card: "#FFFFFF",      // Card backgrounds
} as const;

// ===================================
// 4) PERSONA COLORS (EXACT FROM WEBSITE)
// ===================================

export const PersonaColors = {
  single: {
    primary: "#FF5FA8",    // Bright pink (from website)
    light: "#FF8FC0",
    dark: "#E54990",
    flower: "#FF5FA8",
    gradient: ["#FF5FA8", "#FF8FC0"] as const,
  },
  married: {
    primary: "#FF7C7C",    // Coral/salmon (from website)
    light: "#FF9E9E",
    dark: "#E66666",
    flower: "#FF7C7C",
    gradient: ["#FF7C7C", "#FF9E9E"] as const,
  },
  mother: {
    primary: "#9A63E8",    // Purple (from website)
    light: "#B084F0",
    dark: "#8450D9",
    flower: "#9A63E8",
    gradient: ["#9A63E8", "#B084F0"] as const,
  },

} as const;

// ===================================
// 5) GRADIENTS
// ===================================

export const Gradients = {
  // Main brand gradient (violet → coral)
  main: {
    colors: ["#8C64F0", "#FF6B9D"] as const,
    angle: 135,
  },
  // Soft gradient (light violet → light coral)
  soft: {
    colors: ["#A684F5", "#FFB5C5"] as const,
    angle: 135,
  },
  // Persona-specific gradients are in PersonaColors
} as const;

// ===================================
// 6) CYCLE COLORS
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
// 7) SEMANTIC COLORS
// ===================================

export const SemanticColors = {
  success: "#34C759",
  warning: "#FF9500",
  error: "#FF3B30",
  info: "#007AFF",
} as const;

// ===================================
// 8) NEUTRAL COLORS
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
// 9) THEME COLORS (LIGHT & DARK)
// ===================================

export const LightTheme = {
  // Backgrounds
  background: LightBackgrounds.base,
  backgroundSecondary: LightBackgrounds.elevated,
  backgroundElevated: LightBackgrounds.card,
  card: LightBackgrounds.card,
  cardSecondary: NeutralColors.gray[50],
  
  // Text
  text: "#2C3E50",                    // Dark navy (from website)
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
  cardBorder: "rgba(0, 0, 0, 0.04)",
  
  // Shadows
  shadow: "rgba(0, 0, 0, 0.06)",
  shadowElevated: "rgba(0, 0, 0, 0.12)",
} as const;

export const DarkTheme = {
  // Backgrounds
  background: DarkBackgrounds.base,
  backgroundSecondary: DarkBackgrounds.elevated,
  backgroundElevated: DarkBackgrounds.card,
  card: DarkBackgrounds.card,
  cardSecondary: "rgba(255, 255, 255, 0.05)",
  
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
  cardBorder: "rgba(255, 255, 255, 0.1)",
  
  // Shadows
  shadow: "rgba(0, 0, 0, 0.3)",
  shadowElevated: "rgba(0, 0, 0, 0.5)",
} as const;

// ===================================
// 10) GLASSMORPHISM STYLES
// ===================================

export const GlassStyles = {
  light: {
    background: "rgba(255, 255, 255, 0.7)",
    blur: 10,
    border: "rgba(255, 255, 255, 0.3)",
    shadow: "rgba(0, 0, 0, 0.1)",
  },
  dark: {
    background: "rgba(37, 27, 64, 0.6)",
    blur: 20,
    border: "rgba(255, 255, 255, 0.1)",
    shadow: "rgba(0, 0, 0, 0.2)",
  },
} as const;

// ===================================
// 11) GLOW EFFECTS (for active states)
// ===================================

export function getPersonaGlow(persona: keyof typeof PersonaColors, opacity: number = 0.3) {
  const color = PersonaColors[persona].primary;
  return `0 0 20px ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
}

export function getBrandGlow(opacity: number = 0.3) {
  return `0 0 20px ${BrandColors.violet.main}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
}

// ===================================
// 12) HELPER FUNCTIONS
// ===================================

export function getPersonaPrimary(persona: keyof typeof PersonaColors) {
  return PersonaColors[persona].primary;
}

export function getPersonaGradient(persona: keyof typeof PersonaColors) {
  return PersonaColors[persona].gradient;
}

export function getPersonaFlower(persona: keyof typeof PersonaColors) {
  return PersonaColors[persona].flower;
}

// ===================================
// 13) TYPE EXPORTS
// ===================================

export type Persona = keyof typeof PersonaColors;
export type ThemeMode = "light" | "dark";
export type Theme = typeof LightTheme | typeof DarkTheme;
