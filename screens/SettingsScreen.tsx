import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Modal, Pressable, Alert, TextInput, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { SettingsItem } from "@/components/SettingsItem";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { useLayout } from "@/lib/ThemePersonaContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import { useApp } from "@/lib/AppContext";
import { usePaywall } from "@/hooks/usePaywall";
import { FontScale } from "@/lib/types";
import { Language } from "@/lib/translations";

const languages: { id: Language; label: string }[] = [
  { id: "ar", label: "العربية" },
  { id: "en", label: "English" },
];

const FONT_SCALE_OPTIONS: { id: FontScale; translationKey: string; icon: keyof typeof Feather.glyphMap }[] = [
  { id: "small", translationKey: "fontSizeSmall", icon: "minimize-2" },
  { id: "medium", translationKey: "fontSizeMedium", icon: "type" },
  { id: "large", translationKey: "fontSizeLarge", icon: "maximize-2" },
];

type ThemeOption = "light" | "dark" | "system";
const THEME_OPTIONS: { id: ThemeOption; translationKey: string; icon: keyof typeof Feather.glyphMap }[] = [
  { id: "light", translationKey: "light", icon: "sun" },
  { id: "dark", translationKey: "dark", icon: "moon" },
  { id: "system", translationKey: "system", icon: "smartphone" },
];

type CalendarTypeOption = "gregorian" | "hijri" | "both";
const CALENDAR_TYPE_OPTIONS: { id: CalendarTypeOption; translationKey: string; calendarKey: string; icon: keyof typeof Feather.glyphMap }[] = [
  { id: "gregorian", translationKey: "gregorian", calendarKey: "gregorian", icon: "calendar" },
  { id: "hijri", translationKey: "hijri", calendarKey: "hijri", icon: "moon" },
  { id: "both", translationKey: "both", calendarKey: "both", icon: "layers" },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { language, t, setLanguage, isRTL } = useLanguage();
  const layout = useLayout();
  const { data, updateSettings, resetApp, enablePregnancy, disablePregnancy, getPregnancyWeek } = useApp();
  const { isPlus, isTrial, getSubscriptionStatusText, navigateToPaywall } = usePaywall();
  const navigation = useNavigation<any>();

  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showFontScaleModal, setShowFontScaleModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showCalendarTypeModal, setShowCalendarTypeModal] = useState(false);
  const [showPregnancyModal, setShowPregnancyModal] = useState(false);
  const [lmpDateInput, setLmpDateInput] = useState("");

  const { settings, pregnancySettings } = data;

  const handleToggleNotifications = async () => {
    await updateSettings({ notificationsEnabled: !settings.notificationsEnabled });
  };

  const handleSelectLanguage = async (lang: Language) => {
    await setLanguage(lang);
    setShowLanguageModal(false);
  };

  const handleSelectFontScale = async (scale: FontScale) => {
    await updateSettings({ fontScale: scale });
    setShowFontScaleModal(false);
  };

  const handleSelectTheme = async (themeOption: ThemeOption) => {
    await updateSettings({ theme: themeOption });
    setShowThemeModal(false);
  };

  const handleSelectCalendarType = async (calendarType: CalendarTypeOption) => {
    await updateSettings({ calendarType });
    setShowCalendarTypeModal(false);
  };

  const handlePregnancyToggle = () => {
    const persona = settings.persona;
    if (persona === "partner") {
      return;
    }
    if (persona === "single") {
      Alert.alert(
        t("pregnancy", "notAvailable"),
        t("pregnancy", "notAvailableMessage"),
        [{ text: t("common", "done"), style: "default" }]
      );
      return;
    }
    if (pregnancySettings.enabled) {
      Alert.alert(
        t("pregnancy", "disablePregnancyTitle"),
        t("pregnancy", "disablePregnancyMessage"),
        [
          { text: t("common", "cancel"), style: "cancel" },
          {
            text: t("common", "confirm"),
            style: "destructive",
            onPress: async () => {
              await disablePregnancy();
            },
          },
        ]
      );
    } else {
      setShowPregnancyModal(true);
    }
  };

  const handleEnablePregnancy = async () => {
    if (!lmpDateInput.trim()) {
      Alert.alert(
        t("common", "error"),
        t("pregnancy", "enterDateError")
      );
      return;
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(lmpDateInput.trim())) {
      Alert.alert(
        t("common", "error"),
        t("pregnancy", "dateFormatError")
      );
      return;
    }
    await enablePregnancy(lmpDateInput.trim());
    setLmpDateInput("");
    setShowPregnancyModal(false);
  };

  const handleResetApp = () => {
    Alert.alert(
      t("common", "confirm"),
      t("settings", "resetConfirmMessage"),
      [
        { text: t("common", "cancel"), style: "cancel" },
        {
          text: t("common", "delete"),
          style: "destructive",
          onPress: async () => {
            await resetApp();
          },
        },
      ]
    );
  };

  const currentLanguageLabel = languages.find((l) => l.id === language)?.label || "English";
  
  const currentFontScale = FONT_SCALE_OPTIONS.find((f) => f.id === settings.fontScale) || FONT_SCALE_OPTIONS[1];
  const displayFontScale = t("settings", currentFontScale.translationKey);
  
  const currentTheme = THEME_OPTIONS.find((opt) => opt.id === settings.theme) || THEME_OPTIONS[2];
  const displayTheme = t("settings", currentTheme.translationKey);

  const currentCalendarType = CALENDAR_TYPE_OPTIONS.find((opt) => opt.id === settings.calendarType) || CALENDAR_TYPE_OPTIONS[0];
  const displayCalendarType = currentCalendarType.id === "both" 
    ? t("settings", "both") 
    : t("calendar", currentCalendarType.calendarKey);

  const subscriptionStatus = getSubscriptionStatusText();
  const displayPlanStatus = language === "ar" ? subscriptionStatus.ar : subscriptionStatus.en;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: insets.bottom + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.section, { alignItems: layout.alignSelf }]}>
        <ThemedText type="caption" style={[styles.sectionTitle, { textAlign: layout.textAlign, [layout.marginStart]: Spacing.sm, [layout.marginEnd]: 0 }]}>
          {t("settings", "account")}
        </ThemedText>
        <View
          style={[
            styles.sectionContent,
            { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder },
          ]}
        >
          <SettingsItem
            icon="user"
            title={t("settings", "profile")}
            subtitle={t("settings", "profileSubtitle")}
            onPress={() => navigation.navigate("EditProfile")}
            showChevron
          />
          <SettingsItem
            icon="bar-chart-2"
            title={t("settings", "statistics")}
            subtitle={t("settings", "statisticsSubtitle")}
            onPress={() => navigation.navigate("Stats")}
            showChevron
          />
        </View>
      </View>

      <View style={[styles.section, { alignItems: layout.alignSelf }]}>
        <ThemedText type="caption" style={[styles.sectionTitle, { textAlign: layout.textAlign, [layout.marginStart]: Spacing.sm, [layout.marginEnd]: 0 }]}>
          {t("settings", "experienceDisplay")}
        </ThemedText>
        <View
          style={[
            styles.sectionContent,
            { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder },
          ]}
        >
          <SettingsItem
            icon="globe"
            title={t("settings", "language")}
            value={currentLanguageLabel}
            onPress={() => setShowLanguageModal(true)}
            showChevron
          />
          <SettingsItem
            icon="type"
            title={t("settings", "fontSize")}
            value={displayFontScale}
            onPress={() => setShowFontScaleModal(true)}
            showChevron
          />
          <SettingsItem
            icon="moon"
            title={t("settings", "theme")}
            value={displayTheme}
            onPress={() => setShowThemeModal(true)}
            showChevron
          />
        </View>
      </View>

      <View style={[styles.section, { alignItems: layout.alignSelf }]}>
        <ThemedText type="caption" style={[styles.sectionTitle, { textAlign: layout.textAlign, [layout.marginStart]: Spacing.sm, [layout.marginEnd]: 0 }]}>
          {t("settings", "appBehavior")}
        </ThemedText>
        <View
          style={[
            styles.sectionContent,
            { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder },
          ]}
        >
          <SettingsItem
            icon="calendar"
            title={t("settings", "calendarType")}
            value={displayCalendarType}
            onPress={() => setShowCalendarTypeModal(true)}
            showChevron
          />
          <SettingsItem
            icon="bell"
            title={t("settings", "notifications")}
            showSwitch
            switchValue={settings.notificationsEnabled}
            onSwitchChange={handleToggleNotifications}
          />
          {settings.persona !== "partner" ? (
            <>
              <SettingsItem
                icon="heart"
                title={t("pregnancy", "pregnancyMode")}
                subtitle={
                  pregnancySettings.enabled
                    ? `${t("pregnancy", "week")} ${getPregnancyWeek()}`
                    : settings.persona === "single"
                    ? t("pregnancy", "availableForMarried")
                    : undefined
                }
                showSwitch
                switchValue={pregnancySettings.enabled}
                onSwitchChange={handlePregnancyToggle}
              />
              {pregnancySettings.enabled ? (
                <SettingsItem
                  icon="activity"
                  title={t("pregnancy", "pregnancyDetails")}
                  onPress={() => navigation.navigate("Pregnancy")}
                  showChevron
                />
              ) : null}
            </>
          ) : null}
        </View>
      </View>

      <View style={[styles.section, { alignItems: layout.alignSelf }]}>
        <ThemedText type="caption" style={[styles.sectionTitle, { textAlign: layout.textAlign, [layout.marginStart]: Spacing.sm, [layout.marginEnd]: 0 }]}>
          {t("settings", "dataSubscription")}
        </ThemedText>
        <View
          style={[
            styles.sectionContent,
            { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder },
          ]}
        >
          <SettingsItem
            icon="trash-2"
            title={t("settings", "resetAllData")}
            titleColor={theme.error}
            onPress={handleResetApp}
            showChevron
          />
          <SettingsItem
            icon="award"
            title={t("settings", "plan")}
            value={displayPlanStatus}
            valueColor={isPlus ? theme.success : isTrial ? theme.info : theme.warning}
            onPress={navigateToPaywall}
            showChevron
          />
          <SettingsItem
            icon="star"
            title={t("profile", "wardatyPlus")}
            subtitle={t("profile", "unlockPremium")}
            onPress={navigateToPaywall}
            showChevron
          />
        </View>
      </View>

      <View style={[styles.section, { alignItems: layout.alignSelf }]}>
        <ThemedText type="caption" style={[styles.sectionTitle, { textAlign: layout.textAlign, [layout.marginStart]: Spacing.sm, [layout.marginEnd]: 0 }]}>
          {t("settings", "info")}
        </ThemedText>
        <View
          style={[
            styles.sectionContent,
            { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder },
          ]}
        >
          <SettingsItem
            icon="shield"
            title={t("settings", "privacyPolicy")}
            onPress={() => navigation.navigate("PrivacyPolicy")}
            showChevron
          />
          <SettingsItem
            icon="info"
            title={t("settings", "about")}
            subtitle={t("settings", "aboutSubtitle")}
            onPress={() => navigation.navigate("About")}
            showChevron
          />
          <SettingsItem
            icon="settings"
            title={t("admin", "title")}
            subtitle={t("admin", "subtitle")}
            onPress={() => navigation.navigate("Admin")}
            showChevron
          />
        </View>
      </View>

      <Modal
        visible={showLanguageModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowLanguageModal(false)}
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.backgroundDefault,
                paddingBottom: insets.bottom + Spacing.lg,
              },
            ]}
          >
            <View style={styles.modalHandle} />
            <ThemedText type="h3" style={styles.modalTitle}>
              {t("settings", "language")}
            </ThemedText>
            {languages.map((lang) => (
              <Pressable
                key={lang.id}
                onPress={() => handleSelectLanguage(lang.id)}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor:
                      language === lang.id
                        ? theme.primary + "20"
                        : theme.backgroundSecondary,
                    borderColor:
                      language === lang.id
                        ? theme.primary
                        : theme.cardBorder,
                  },
                ]}
              >
                <ThemedText
                  type="body"
                  style={{
                    color:
                      language === lang.id ? theme.primary : theme.text,
                  }}
                >
                  {lang.label}
                </ThemedText>
                {language === lang.id ? (
                  <Feather name="check" size={20} color={theme.primary} />
                ) : null}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={showFontScaleModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFontScaleModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowFontScaleModal(false)}
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.backgroundDefault,
                paddingBottom: insets.bottom + Spacing.lg,
              },
            ]}
          >
            <View style={styles.modalHandle} />
            <ThemedText type="h3" style={styles.modalTitle}>
              {t("settings", "fontSize")}
            </ThemedText>
            {FONT_SCALE_OPTIONS.map((scale) => (
              <Pressable
                key={scale.id}
                onPress={() => handleSelectFontScale(scale.id)}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor:
                      settings.fontScale === scale.id
                        ? theme.primary + "20"
                        : theme.backgroundSecondary,
                    borderColor:
                      settings.fontScale === scale.id
                        ? theme.primary
                        : theme.cardBorder,
                  },
                ]}
              >
                <View style={styles.fontScaleOption}>
                  <Feather
                    name={scale.icon}
                    size={20}
                    color={settings.fontScale === scale.id ? theme.primary : theme.textSecondary}
                  />
                  <ThemedText
                    type="body"
                    style={{
                      color: settings.fontScale === scale.id ? theme.primary : theme.text,
                    }}
                  >
                    {t("settings", scale.translationKey)}
                  </ThemedText>
                </View>
                {settings.fontScale === scale.id ? (
                  <Feather name="check" size={20} color={theme.primary} />
                ) : null}
              </Pressable>
            ))}
            <View style={[styles.fontPreview, { backgroundColor: theme.backgroundSecondary }]}>
              <ThemedText type="caption" style={{ color: theme.textSecondary, marginBottom: Spacing.sm }}>
                {t("settings", "preview")}
              </ThemedText>
              <ThemedText type="body">
                {t("settings", "fontSizePreview")}
              </ThemedText>
            </View>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={showThemeModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowThemeModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowThemeModal(false)}
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.backgroundDefault,
                paddingBottom: insets.bottom + Spacing.lg,
              },
            ]}
          >
            <View style={styles.modalHandle} />
            <ThemedText type="h3" style={styles.modalTitle}>
              {t("settings", "theme")}
            </ThemedText>
            {THEME_OPTIONS.map((option) => (
              <Pressable
                key={option.id}
                onPress={() => handleSelectTheme(option.id)}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor:
                      settings.theme === option.id
                        ? theme.primary + "20"
                        : theme.backgroundSecondary,
                    borderColor:
                      settings.theme === option.id
                        ? theme.primary
                        : theme.cardBorder,
                  },
                ]}
              >
                <View style={styles.fontScaleOption}>
                  <Feather
                    name={option.icon}
                    size={20}
                    color={settings.theme === option.id ? theme.primary : theme.textSecondary}
                  />
                  <ThemedText
                    type="body"
                    style={{
                      color: settings.theme === option.id ? theme.primary : theme.text,
                    }}
                  >
                    {t("settings", option.translationKey)}
                  </ThemedText>
                </View>
                {settings.theme === option.id ? (
                  <Feather name="check" size={20} color={theme.primary} />
                ) : null}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={showCalendarTypeModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCalendarTypeModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowCalendarTypeModal(false)}
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.backgroundDefault,
                paddingBottom: insets.bottom + Spacing.lg,
              },
            ]}
          >
            <View style={styles.modalHandle} />
            <ThemedText type="h3" style={styles.modalTitle}>
              {t("settings", "calendarType")}
            </ThemedText>
            {CALENDAR_TYPE_OPTIONS.map((option) => (
              <Pressable
                key={option.id}
                onPress={() => handleSelectCalendarType(option.id)}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor:
                      settings.calendarType === option.id
                        ? theme.primary + "20"
                        : theme.backgroundSecondary,
                    borderColor:
                      settings.calendarType === option.id
                        ? theme.primary
                        : theme.cardBorder,
                  },
                ]}
              >
                <View style={styles.fontScaleOption}>
                  <Feather
                    name={option.icon}
                    size={20}
                    color={settings.calendarType === option.id ? theme.primary : theme.textSecondary}
                  />
                  <ThemedText
                    type="body"
                    style={{
                      color: settings.calendarType === option.id ? theme.primary : theme.text,
                    }}
                  >
                    {option.id === "both" ? t("settings", "both") : t("calendar", option.calendarKey)}
                  </ThemedText>
                </View>
                {settings.calendarType === option.id ? (
                  <Feather name="check" size={20} color={theme.primary} />
                ) : null}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={showPregnancyModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowPregnancyModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowPregnancyModal(false)}
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.backgroundDefault,
                paddingBottom: insets.bottom + Spacing.lg,
              },
            ]}
          >
            <View style={styles.modalHandle} />
            <ThemedText type="h3" style={styles.modalTitle}>
              {isRTL ? "تفعيل وضع الحمل" : "Enable Pregnancy Mode"}
            </ThemedText>
            <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: "center", marginBottom: Spacing.lg }}>
              {isRTL ? "أدخلي تاريخ أول يوم من آخر دورة شهرية" : "Enter the first day of your last menstrual period"}
            </ThemedText>
            <TextInput
              style={[
                styles.dateInput,
                {
                  backgroundColor: theme.backgroundSecondary,
                  color: theme.text,
                  borderColor: theme.cardBorder,
                },
              ]}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.textSecondary}
              value={lmpDateInput}
              onChangeText={setLmpDateInput}
              keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "default"}
            />
            <Button onPress={handleEnablePregnancy} style={{ marginTop: Spacing.lg, width: "100%" }}>
              {isRTL ? "تفعيل" : "Enable"}
            </Button>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sectionContent: {
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    overflow: "hidden",
    width: "100%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xlarge,
    borderTopRightRadius: BorderRadius.xlarge,
    padding: Spacing.lg,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignSelf: "center",
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  fontScaleOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  fontPreview: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    marginTop: Spacing.md,
    alignItems: "center",
  },
  dateInput: {
    height: 50,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
    textAlign: "center",
  },
});
