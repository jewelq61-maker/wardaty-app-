import { Persona } from "../lib/types";
// Local color definitions to avoid circular dependency
const LocalDarkTheme = {
  background: {
    root: "#0F0820",
    elevated: "#1A1330",
    card: "#251B40",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "rgba(255, 255, 255, 0.7)",
    tertiary: "rgba(255, 255, 255, 0.5)",
    disabled: "rgba(255, 255, 255, 0.3)",
  },
  border: {
    subtle: "rgba(255, 255, 255, 0.1)",
    default: "rgba(255, 255, 255, 0.2)",
    strong: "rgba(255, 255, 255, 0.3)",
  },
  overlay: {
    light: "rgba(0, 0, 0, 0.3)",
    medium: "rgba(0, 0, 0, 0.5)",
    heavy: "rgba(0, 0, 0, 0.7)",
  },
} as const;

const LocalPersonaColors = {
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
} as const;

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
      main: LocalPersonaColors.single.primary,
      light: LocalPersonaColors.single.light,
      dark: LocalPersonaColors.single.dark,
      soft: LocalPersonaColors.single.soft,
      gradient: LocalPersonaColors.single.gradient,
    },
    logoGradient: ["#8C64F0", "#FF5FA8"] as const,
  },
  married: {
    accent: {
      main: LocalPersonaColors.married.primary,
      light: LocalPersonaColors.married.light,
      dark: LocalPersonaColors.married.dark,
      soft: LocalPersonaColors.married.soft,
      gradient: LocalPersonaColors.married.gradient,
    },
    logoGradient: ["#8C64F0", "#FF7C7C"] as const,
  },
  mother: {
    accent: {
      main: LocalPersonaColors.mother.primary,
      light: LocalPersonaColors.mother.light,
      dark: LocalPersonaColors.mother.dark,
      soft: LocalPersonaColors.mother.soft,
      gradient: LocalPersonaColors.mother.gradient,
    },
    logoGradient: ["#8C64F0", "#9A63E8"] as const,
  },
};

function createDarkColors(persona: Persona): ThemeColors {
  const personaAccent = personaConfigs[persona].accent;
  
  return {
    background: LocalDarkTheme.background.root,
    backgroundRoot: LocalDarkTheme.background.root,
    backgroundDefault: LocalDarkTheme.background.root,
    backgroundSecondary: LocalDarkTheme.background.elevated,
    backgroundTertiary: LocalDarkTheme.background.card,
    backgroundElevated: LocalDarkTheme.background.elevated,
    card: LocalDarkTheme.background.card,
    cardBorder: LocalDarkTheme.border.default,
    primary: personaAccent.main,
    primaryLight: personaAccent.light,
    primaryDark: personaAccent.dark,
    primarySoft: personaAccent.soft,
    secondary: LocalDarkTheme.text.secondary,
    secondaryLight: LocalDarkTheme.text.tertiary,
    secondaryDark: LocalDarkTheme.text.primary,
    accent: personaAccent.main,
    accentLight: personaAccent.light,
    accentDark: personaAccent.dark,
    accentSoft: personaAccent.soft,
    personaAccent: personaAccent.main,
    personaAccentLight: personaAccent.light,
    personaAccentDark: personaAccent.dark,
    personaAccentSoft: personaAccent.soft,
    border: LocalDarkTheme.border.default,
    text: LocalDarkTheme.text.primary,
    textMain: LocalDarkTheme.text.primary,
    textSecondary: LocalDarkTheme.text.secondary,
    textSoft: LocalDarkTheme.text.tertiary,
    badge: personaAccent.main,
    chip: personaAccent.soft,
    buttonText: LocalDarkTheme.text.primary,
    tabIconDefault: LocalDarkTheme.text.tertiary,
    tabIconSelected: personaAccent.main,
    link: personaAccent.main,
    glassBackground: "rgba(37, 27, 64, 0.6)",
    glassBorder: LocalDarkTheme.border.subtle,
    glowPrimary: personaAccent.main,
    glowAccent: personaAccent.light,
    overlay: LocalDarkTheme.overlay.medium,
    period: "#FF5FA8",
    periodLight: "#FF5FA840",
    fertile: "#06D6A0",
    fertileLight: "#06D6A040",
    normal: LocalDarkTheme.border.default,
    normalLight: LocalDarkTheme.border.subtle,
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
