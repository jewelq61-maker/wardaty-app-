import { useThemePersona } from "../lib/ThemePersonaContext";
import { ThemeColors } from "../constants/personaThemes";

export function useTheme() {
  const { theme, isDark, mode, persona, themePreference, setMode, toggleMode, isLoading } = useThemePersona();

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
