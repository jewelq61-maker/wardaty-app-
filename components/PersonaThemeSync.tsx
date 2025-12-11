import { useEffect, useRef } from "react";
import { useApp } from "../lib/AppContext";
import { useThemePersona } from "../lib/ThemePersonaContext";

export function PersonaThemeSync() {
  const { data, updateSettings } = useApp();
  const { 
    persona: themePersona, 
    setPersona, 
    themePreference, 
    setMode, 
    isHydrated,
    hasStoredPersona,
    hasStoredTheme
  } = useThemePersona();
  const isInitialSyncDone = useRef(false);
  const lastAppPersona = useRef(data.settings.persona);
  const lastThemePersona = useRef(themePersona);
  const lastAppTheme = useRef(data.settings.theme);
  const lastThemePreference = useRef(themePreference);

  useEffect(() => {
    if (!isHydrated) return;
    
    if (!isInitialSyncDone.current) {
      const appPersona = data.settings.persona;
      const appTheme = data.settings.theme;
      
      if (hasStoredPersona) {
        if (appPersona !== themePersona) {
          updateSettings({ persona: themePersona });
        }
        lastAppPersona.current = themePersona;
        lastThemePersona.current = themePersona;
      } else if (appPersona) {
        setPersona(appPersona);
        lastAppPersona.current = appPersona;
        lastThemePersona.current = appPersona;
      } else {
        lastAppPersona.current = themePersona;
        lastThemePersona.current = themePersona;
      }
      
      if (hasStoredTheme) {
        if (appTheme !== themePreference) {
          updateSettings({ theme: themePreference });
        }
        lastAppTheme.current = themePreference;
        lastThemePreference.current = themePreference;
      } else if (appTheme) {
        setMode(appTheme);
        lastAppTheme.current = appTheme;
        lastThemePreference.current = appTheme;
      } else {
        lastAppTheme.current = themePreference;
        lastThemePreference.current = themePreference;
      }
      
      isInitialSyncDone.current = true;
      return;
    }

    if (data.settings.persona !== lastAppPersona.current) {
      setPersona(data.settings.persona);
      lastAppPersona.current = data.settings.persona;
      lastThemePersona.current = data.settings.persona;
    }

    if (data.settings.theme !== lastAppTheme.current) {
      setMode(data.settings.theme);
      lastAppTheme.current = data.settings.theme;
      lastThemePreference.current = data.settings.theme;
    }
  }, [data.settings.persona, data.settings.theme, themePersona, themePreference, setPersona, setMode, isHydrated, hasStoredPersona, hasStoredTheme, updateSettings]);

  useEffect(() => {
    if (!isHydrated || !isInitialSyncDone.current) return;

    if (themePersona !== lastThemePersona.current && themePersona !== data.settings.persona) {
      updateSettings({ persona: themePersona });
      lastThemePersona.current = themePersona;
      lastAppPersona.current = themePersona;
    }

    if (themePreference !== lastThemePreference.current && themePreference !== data.settings.theme) {
      updateSettings({ theme: themePreference });
      lastThemePreference.current = themePreference;
      lastAppTheme.current = themePreference;
    }
  }, [themePersona, themePreference, data.settings.persona, data.settings.theme, updateSettings, isHydrated]);

  return null;
}
