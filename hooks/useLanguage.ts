import { useCallback, useEffect } from "react";
import { I18nManager, Platform } from "react-native";
import { useApp } from "../lib/AppContext";
import { translations, Language, TranslationKeys } from "../lib/translations";

export function useLanguage() {
  const { data, updateSettings } = useApp();
  const language = data.settings.language || "en";
  const isRTL = language === "ar";

  useEffect(() => {
    const shouldBeRTL = language === "ar";
    if (I18nManager.isRTL !== shouldBeRTL) {
      I18nManager.allowRTL(shouldBeRTL);
      I18nManager.forceRTL(shouldBeRTL);
    }
    if (Platform.OS === "web") {
      document.documentElement.dir = shouldBeRTL ? "rtl" : "ltr";
      document.body.style.direction = shouldBeRTL ? "rtl" : "ltr";
    }
  }, [language]);

  const t = useCallback(
    (section: keyof TranslationKeys, key: string): string => {
      const sectionData = translations[language]?.[section];
      if (sectionData && key in sectionData) {
        return (sectionData as Record<string, string>)[key];
      }
      const fallback = translations.en?.[section];
      if (fallback && key in fallback) {
        return (fallback as Record<string, string>)[key];
      }
      return key;
    },
    [language]
  );

  const setLanguage = useCallback(
    async (newLanguage: Language) => {
      const shouldBeRTL = newLanguage === "ar";
      
      // Update settings first
      await updateSettings({ language: newLanguage });
      
      // Force RTL/LTR globally
      if (I18nManager.isRTL !== shouldBeRTL) {
        I18nManager.allowRTL(shouldBeRTL);
        I18nManager.forceRTL(shouldBeRTL);
        
        // On native, need to reload for RTL to take effect
        if (Platform.OS !== "web") {
          // Alert user that app will reload
          // Updates.reloadAsync(); // Uncomment if using expo-updates
        }
      }
      
      // Web: immediate direction change
      if (Platform.OS === "web") {
        document.documentElement.dir = shouldBeRTL ? "rtl" : "ltr";
        document.documentElement.lang = newLanguage;
        document.body.style.direction = shouldBeRTL ? "rtl" : "ltr";
      }
    },
    [updateSettings]
  );

  return {
    language,
    isRTL,
    t,
    setLanguage,
  };
}
