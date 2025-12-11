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
      if (I18nManager.isRTL !== shouldBeRTL) {
        I18nManager.allowRTL(shouldBeRTL);
        I18nManager.forceRTL(shouldBeRTL);
      }
      if (Platform.OS === "web") {
        document.documentElement.dir = shouldBeRTL ? "rtl" : "ltr";
        document.body.style.direction = shouldBeRTL ? "rtl" : "ltr";
      }
      await updateSettings({ language: newLanguage });
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
