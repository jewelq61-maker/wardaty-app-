import { Persona } from "../lib/types";
import { DarkTheme, PersonaColors } from "./theme";

export type ThemeMode = "light" | "dark";

export interface ThemeColors {
  background: string;
  backgroundRoot: string;
  backgroundDefault: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  backgroundElevated: string;
  card: string;
  cardBorder: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primarySoft: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  accent: string;
  accentLight: string;
  accentDark: string;
  accentSoft: string;
  personaAccent: string;
  personaAccentLight: string;
  personaAccentDark: string;
  personaAccentSoft: string;
  border: string;
  text: string;
  textMain: string;
  textSecondary: string;
  textSoft: string;
  badge: string;
  chip: string;
  buttonText: string;
  tabIconDefault: string;
  tabIconSelected: string;
  link: string;
  glassBackground: string;
  glassBorder: string;
  glowPrimary: string;
  glowAccent: string;
  overlay: string;
  period: string;
  periodLight: string;
  fertile: string;
  fertileLight: string;
  normal: string;
  normalLight: string;
  ovulation: string;
  follicular: string;
  luteal: string;
  qadha: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface PersonaAccentColors {
  main: string;
  light: string;
  dark: string;
  soft: string;
  gradient: readonly [string, string];
}

export interface PersonaConfig {
  accent: PersonaAccentColors;
  logoGradient: readonly [string, string];
}

export interface Theme {
  mode: ThemeMode;
  persona: Persona;
  colors: ThemeColors;
  personaConfig: PersonaConfig;
}

const personaConfigs: Record<Persona, PersonaConfig> = {
  single: {
    accent: {
      main: PersonaColors.single.primary,
      light: PersonaColors.single.light,
      dark: PersonaColors.single.dark,
      soft: PersonaColors.single.soft,
      gradient: PersonaColors.single.gradient,
    },
    logoGradient: ["#8C64F0", "#FF5FA8"] as const,
  },
  married: {
    accent: {
      main: PersonaColors.married.primary,
      light: PersonaColors.married.light,
      dark: PersonaColors.married.dark,
      soft: PersonaColors.married.soft,
      gradient: PersonaColors.married.gradient,
    },
    logoGradient: ["#8C64F0", "#FF7C7C"] as const,
  },
  mother: {
    accent: {
      main: PersonaColors.mother.primary,
      light: PersonaColors.mother.light,
      dark: PersonaColors.mother.dark,
      soft: PersonaColors.mother.soft,
      gradient: PersonaColors.mother.gradient,
    },
    logoGradient: ["#8C64F0", "#9A63E8"] as const,
  },
};

function createDarkColors(persona: Persona): ThemeColors {
  const personaAccent = personaConfigs[persona].accent;
  
  return {
    background: DarkTheme.background.root,
    backgroundRoot: DarkTheme.background.root,
    backgroundDefault: DarkTheme.background.root,
    backgroundSecondary: DarkTheme.background.elevated,
    backgroundTertiary: DarkTheme.background.card,
    backgroundElevated: DarkTheme.background.elevated,
    card: DarkTheme.background.card,
    cardBorder: DarkTheme.border.default,
    primary: personaAccent.main,
    primaryLight: personaAccent.light,
    primaryDark: personaAccent.dark,
    primarySoft: personaAccent.soft,
    secondary: DarkTheme.text.secondary,
    secondaryLight: DarkTheme.text.tertiary,
    secondaryDark: DarkTheme.text.primary,
    accent: personaAccent.main,
    accentLight: personaAccent.light,
    accentDark: personaAccent.dark,
    accentSoft: personaAccent.soft,
    personaAccent: personaAccent.main,
    personaAccentLight: personaAccent.light,
    personaAccentDark: personaAccent.dark,
    personaAccentSoft: personaAccent.soft,
    border: DarkTheme.border.default,
    text: DarkTheme.text.primary,
    textMain: DarkTheme.text.primary,
    textSecondary: DarkTheme.text.secondary,
    textSoft: DarkTheme.text.tertiary,
    badge: personaAccent.main,
    chip: personaAccent.soft,
    buttonText: DarkTheme.text.primary,
    tabIconDefault: DarkTheme.text.tertiary,
    tabIconSelected: personaAccent.main,
    link: personaAccent.main,
    glassBackground: "rgba(37, 27, 64, 0.6)",
    glassBorder: DarkTheme.border.subtle,
    glowPrimary: personaAccent.main,
    glowAccent: personaAccent.light,
    overlay: DarkTheme.overlay.medium,
    period: "#FF5FA8",
    periodLight: "#FF5FA840",
    fertile: "#06D6A0",
    fertileLight: "#06D6A040",
    normal: DarkTheme.border.default,
    normalLight: DarkTheme.border.subtle,
    ovulation: "#FFB703",
    follicular: "#9A63E8",
    luteal: "#FF7C7C",
    qadha: "#FFB800",
    success: "#4CAF50",
    warning: "#FF9800",
    error: "#F44336",
    info: "#2196F3",
  };
}

// Light theme (for onboarding only)
function createLightColors(persona: Persona): ThemeColors {
  const personaAccent = personaConfigs[persona].accent;
  
  return {
    background: "#FFFFFF",
    backgroundRoot: "#FFFFFF",
    backgroundDefault: "#FFFFFF",
    backgroundSecondary: "#F8F9FA",
    backgroundTertiary: "#F0F1F3",
    backgroundElevated: "#FFFFFF",
    card: "#FFFFFF",
    cardBorder: "rgba(0, 0, 0, 0.1)",
    primary: personaAccent.main,
    primaryLight: personaAccent.light,
    primaryDark: personaAccent.dark,
    primarySoft: personaAccent.soft,
    secondary: "#6B7280",
    secondaryLight: "#9CA3AF",
    secondaryDark: "#374151",
    accent: personaAccent.main,
    accentLight: personaAccent.light,
    accentDark: personaAccent.dark,
    accentSoft: personaAccent.soft,
    personaAccent: personaAccent.main,
    personaAccentLight: personaAccent.light,
    personaAccentDark: personaAccent.dark,
    personaAccentSoft: personaAccent.soft,
    border: "rgba(0, 0, 0, 0.1)",
    text: "#1F2937",
    textMain: "#1F2937",
    textSecondary: "#6B7280",
    textSoft: "#9CA3AF",
    badge: personaAccent.main,
    chip: personaAccent.soft,
    buttonText: "#FFFFFF",
    tabIconDefault: "#9CA3AF",
    tabIconSelected: personaAccent.main,
    link: personaAccent.main,
    glassBackground: "rgba(255, 255, 255, 0.8)",
    glassBorder: "rgba(0, 0, 0, 0.1)",
    glowPrimary: personaAccent.main,
    glowAccent: personaAccent.light,
    overlay: "rgba(0, 0, 0, 0.3)",
    period: "#FF5FA8",
    periodLight: "#FF5FA840",
    fertile: "#06D6A0",
    fertileLight: "#06D6A040",
    normal: "#E5E7EB",
    normalLight: "#F3F4F6",
    ovulation: "#FFB703",
    follicular: "#9A63E8",
    luteal: "#FF7C7C",
    qadha: "#FFB800",
    success: "#4CAF50",
    warning: "#FF9800",
    error: "#F44336",
    info: "#2196F3",
  };
}

// Lazy initialization to avoid circular dependency issues
let _personaThemes: Record<Persona, { light: Theme; dark: Theme }> | null = null;

function getPersonaThemes(): Record<Persona, { light: Theme; dark: Theme }> {
  if (_personaThemes) return _personaThemes;
  
  _personaThemes = {
  single: {
    light: {
      mode: "light",
      persona: "single",
      colors: createLightColors("single"),
      personaConfig: personaConfigs.single,
    },
    dark: {
      mode: "dark",
      persona: "single",
      colors: createDarkColors("single"),
      personaConfig: personaConfigs.single,
    },
  },
  married: {
    light: {
      mode: "light",
      persona: "married",
      colors: createLightColors("married"),
      personaConfig: personaConfigs.married,
    },
    dark: {
      mode: "dark",
      persona: "married",
      colors: createDarkColors("married"),
      personaConfig: personaConfigs.married,
    },
  },
  mother: {
    light: {
      mode: "light",
      persona: "mother",
      colors: createLightColors("mother"),
      personaConfig: personaConfigs.mother,
    },
    dark: {
      mode: "dark",
      persona: "mother",
      colors: createDarkColors("mother"),
      personaConfig: personaConfigs.mother,
    },
  },
  };
  
  return _personaThemes;
}

export function getTheme(persona: Persona, mode: ThemeMode): Theme {
  return getPersonaThemes()[persona][mode];
}

export function getDefaultTheme(): Theme {
  return getPersonaThemes().single.dark;
}

export function getLogoGradient(persona: Persona): readonly [string, string] {
  return personaConfigs[persona].logoGradient;
}
