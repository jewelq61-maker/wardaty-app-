import { Persona } from "@/lib/types";
import { BrandColors, CycleColors, PersonaAccents, Colors } from "./theme";

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
    accent: PersonaAccents.single,
    logoGradient: ["#8C64F0", "#FF5FA8"] as const,
  },
  partner: {
    accent: PersonaAccents.partner,
    logoGradient: ["#8C64F0", "#7EC8E3"] as const,
  },
  married: {
    accent: PersonaAccents.married,
    logoGradient: ["#8C64F0", "#FF7C7C"] as const,
  },
  mother: {
    accent: PersonaAccents.mother,
    logoGradient: ["#8C64F0", "#9A63E8"] as const,
  },
};

function createLightColors(persona: Persona): ThemeColors {
  const personaAccent = personaConfigs[persona].accent;
  
  return {
    ...Colors.light,
    background: Colors.light.backgroundRoot,
    card: Colors.light.backgroundElevated,
    textMain: Colors.light.text,
    textSoft: Colors.light.textMuted,
    badge: personaAccent.main,
    chip: personaAccent.soft,
    personaAccent: personaAccent.main,
    personaAccentLight: personaAccent.light,
    personaAccentDark: personaAccent.dark,
    personaAccentSoft: personaAccent.soft,
  };
}

function createDarkColors(persona: Persona): ThemeColors {
  const personaAccent = personaConfigs[persona].accent;
  
  return {
    ...Colors.dark,
    background: Colors.dark.backgroundRoot,
    card: Colors.dark.backgroundElevated,
    textMain: Colors.dark.text,
    textSoft: Colors.dark.textMuted,
    badge: personaAccent.light,
    chip: personaAccent.soft,
    personaAccent: personaAccent.light,
    personaAccentLight: personaAccent.light,
    personaAccentDark: personaAccent.main,
    personaAccentSoft: personaAccent.soft,
  };
}

export const personaThemes: Record<Persona, { light: Theme; dark: Theme }> = {
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
  partner: {
    light: {
      mode: "light",
      persona: "partner",
      colors: createLightColors("partner"),
      personaConfig: personaConfigs.partner,
    },
    dark: {
      mode: "dark",
      persona: "partner",
      colors: createDarkColors("partner"),
      personaConfig: personaConfigs.partner,
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

export function getTheme(persona: Persona, mode: ThemeMode): Theme {
  return personaThemes[persona][mode];
}

export function getDefaultTheme(): Theme {
  return personaThemes.single.dark;
}

export function getLogoGradient(persona: Persona): readonly [string, string] {
  return personaConfigs[persona].logoGradient;
}
