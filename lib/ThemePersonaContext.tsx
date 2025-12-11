import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme, I18nManager, Platform } from "react-native";
import { Persona } from "./types";
import { Theme, ThemeMode, getTheme, getDefaultTheme, getLogoGradient } from "../constants/personaThemes";

const STORAGE_KEYS = {
  PERSONA: "WARDATY_PERSONA",
  THEME_MODE: "WARDATY_THEME_MODE",
};

type ThemePreference = "light" | "dark" | "system";

export interface LayoutDirection {
  isRTL: boolean;
  flexDirection: "row" | "row-reverse";
  flexDirectionReverse: "row-reverse" | "row";
  textAlign: "left" | "right";
  alignSelf: "flex-start" | "flex-end";
  alignSelfEnd: "flex-end" | "flex-start";
  marginStart: "marginLeft" | "marginRight";
  marginEnd: "marginRight" | "marginLeft";
  paddingStart: "paddingLeft" | "paddingRight";
  paddingEnd: "paddingRight" | "paddingLeft";
  borderStart: "borderLeftWidth" | "borderRightWidth";
  borderEnd: "borderRightWidth" | "borderLeftWidth";
  left: "left" | "right";
  right: "right" | "left";
  transform: { scaleX: number };
}

export interface LogoColors {
  gradient: readonly [string, string];
  primary: string;
  secondary: string;
}

interface ThemePersonaContextType {
  persona: Persona;
  mode: ThemeMode;
  themePreference: ThemePreference;
  theme: Theme;
  isDark: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  hasStoredPersona: boolean;
  hasStoredTheme: boolean;
  logoColors: LogoColors;
  layout: LayoutDirection;
  setPersona: (newPersona: Persona) => Promise<void>;
  setMode: (newMode: ThemePreference) => Promise<void>;
  toggleMode: () => Promise<void>;
}

const ThemePersonaContext = createContext<ThemePersonaContextType | undefined>(undefined);

function getLayoutDirection(isRTL: boolean): LayoutDirection {
  return {
    isRTL,
    flexDirection: isRTL ? "row-reverse" : "row",
    flexDirectionReverse: isRTL ? "row" : "row-reverse",
    textAlign: isRTL ? "right" : "left",
    alignSelf: isRTL ? "flex-end" : "flex-start",
    alignSelfEnd: isRTL ? "flex-start" : "flex-end",
    marginStart: isRTL ? "marginRight" : "marginLeft",
    marginEnd: isRTL ? "marginLeft" : "marginRight",
    paddingStart: isRTL ? "paddingRight" : "paddingLeft",
    paddingEnd: isRTL ? "paddingLeft" : "paddingRight",
    borderStart: isRTL ? "borderRightWidth" : "borderLeftWidth",
    borderEnd: isRTL ? "borderLeftWidth" : "borderRightWidth",
    left: isRTL ? "right" : "left",
    right: isRTL ? "left" : "right",
    transform: { scaleX: isRTL ? -1 : 1 },
  };
}

export function ThemePersonaProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [persona, setPersonaState] = useState<Persona>("single");
  const [themePreference, setThemePreference] = useState<ThemePreference>("system");
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasStoredPersona, setHasStoredPersona] = useState(false);
  const [hasStoredTheme, setHasStoredTheme] = useState(false);

  const isRTL = I18nManager.isRTL;

  const effectiveMode: ThemeMode = useMemo(() => {
    // Respect user's theme preference
    if (themePreference === "system") {
      return systemColorScheme === "dark" ? "dark" : "light";
    }
    return themePreference === "dark" ? "dark" : "light";
  }, [themePreference, systemColorScheme]);

  const theme = useMemo(() => {
    return getTheme(persona, effectiveMode);
  }, [persona, effectiveMode]);

  const isDark = effectiveMode === "dark";

  const logoColors = useMemo<LogoColors>(() => {
    const gradient = getLogoGradient(persona);
    return {
      gradient,
      primary: gradient[0],
      secondary: gradient[1],
    };
  }, [persona]);

  const layout = useMemo<LayoutDirection>(() => {
    return getLayoutDirection(isRTL);
  }, [isRTL]);

  useEffect(() => {
    loadFromStorage();
  }, []);

  const loadFromStorage = async () => {
    try {
      const [storedPersona, storedMode] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.PERSONA),
        AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE),
      ]);

      if (storedPersona && isValidPersona(storedPersona)) {
        setPersonaState(storedPersona as Persona);
        setHasStoredPersona(true);
      }

      if (storedMode && isValidThemePreference(storedMode)) {
        setThemePreference(storedMode as ThemePreference);
        setHasStoredTheme(true);
      }
    } catch (error) {
      console.error("Error loading theme preferences:", error);
    } finally {
      setIsLoading(false);
      setIsHydrated(true);
    }
  };

  const setPersona = useCallback(async (newPersona: Persona) => {
    setPersonaState(newPersona);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PERSONA, newPersona);
    } catch (error) {
      console.error("Error saving persona:", error);
    }
  }, []);

  const setMode = useCallback(async (newMode: ThemePreference) => {
    setThemePreference(newMode);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, newMode);
    } catch (error) {
      console.error("Error saving theme mode:", error);
    }
  }, []);

  const toggleMode = useCallback(async () => {
    const newMode: ThemePreference = effectiveMode === "light" ? "dark" : "light";
    await setMode(newMode);
  }, [effectiveMode, setMode]);

  const value = useMemo(() => ({
    persona,
    mode: effectiveMode,
    themePreference,
    theme,
    isDark,
    isLoading,
    isHydrated,
    hasStoredPersona,
    hasStoredTheme,
    logoColors,
    layout,
    setPersona,
    setMode,
    toggleMode,
  }), [persona, effectiveMode, themePreference, theme, isDark, isLoading, isHydrated, hasStoredPersona, hasStoredTheme, logoColors, layout, setPersona, setMode, toggleMode]);

  if (!isHydrated) {
    return null;
  }

  return (
    <ThemePersonaContext.Provider value={value}>
      {children}
    </ThemePersonaContext.Provider>
  );
}

export function useThemePersona() {
  const context = useContext(ThemePersonaContext);
  if (!context) {
    throw new Error("useThemePersona must be used within a ThemePersonaProvider");
  }
  return context;
}

export function useLayout(): LayoutDirection {
  const context = useContext(ThemePersonaContext);
  if (context) {
    return context.layout;
  }
  return getLayoutDirection(I18nManager.isRTL);
}

export function useLogoColors(): LogoColors {
  const context = useContext(ThemePersonaContext);
  if (!context) {
    throw new Error("useLogoColors must be used within a ThemePersonaProvider");
  }
  return context.logoColors;
}

function isValidPersona(value: string): value is Persona {
  return ["single", "partner", "married", "mother"].includes(value);
}

function isValidThemePreference(value: string): value is ThemePreference {
  return ["light", "dark", "system"].includes(value);
}
