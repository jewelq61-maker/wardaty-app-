import { useThemePersona } from "../lib/ThemePersonaContext";
import { ThemeColors } from "../constants/personaThemes";

export function useTheme() {
  const { theme, isDark, mode, persona, themePreference, setMode, toggleMode, isLoading } = useThemePersona();

  // Safety check: return default theme if theme is not ready
  if (!theme || !theme.colors) {
    return {
      theme: {
        primary: "#FF6B9D",
        secondary: "#FF8BC0",
        background: "#0F0820",
        backgroundRoot: "#0F0820",
        backgroundDefault: "#1A1330",
        backgroundElevated: "#251B40",
        backgroundSecondary: "#2A1F45",
        backgroundTertiary: "#342850",
        text: "#FFFFFF",
        textSecondary: "rgba(255, 255, 255, 0.7)",
        textTertiary: "rgba(255, 255, 255, 0.5)",
        border: "rgba(255, 255, 255, 0.1)",
        cardBorder: "rgba(255, 255, 255, 0.1)",
        success: "#4CAF50",
        warning: "#FFC107",
        error: "#F44336",
        info: "#2196F3",
        primaryLight: "#FF8BC0",
        primaryDark: "#FF4081",
        backgroundColor: "#0F0820",
      },
      isDark: true,
      mode: "dark" as const,
      persona: "single" as const,
      themePreference: "system" as const,
      setMode: async () => {},
      toggleMode: async () => {},
      isLoading: true,
    };
  }

  return {
    theme: theme.colors,
    isDark,
    mode,
    persona,
    themePreference,
    setMode,
    toggleMode,
    isLoading,
  };
}
