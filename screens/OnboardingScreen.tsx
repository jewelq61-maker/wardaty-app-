import React, { useState } from "react";
import { View, StyleSheet, TextInput, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  FadeOutUp,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { PersonaSelector } from "@/components/PersonaSelector";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { useLayout } from "@/lib/ThemePersonaContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import { useApp } from "@/lib/AppContext";
import { Persona } from "@/lib/types";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { Language } from "@/lib/translations";

type OnboardingStep = "language" | "welcome" | "persona" | "name" | "cycle";

interface OnboardingScreenProps {
  onBack?: () => void;
}

export default function OnboardingScreen({ onBack }: OnboardingScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { updateSettings } = useApp();
  const { t, setLanguage, language } = useLanguage();
  const layout = useLayout();

  const [step, setStep] = useState<OnboardingStep>("language");
  const [persona, setPersona] = useState<Persona>("single");
  const [name, setName] = useState("");
  const [cycleLength, setCycleLength] = useState("28");
  const [periodLength, setPeriodLength] = useState("5");

  const handleSelectLanguage = async (lang: Language) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await setLanguage(lang);
    setStep("welcome");
  };

  const handleNext = () => {
    if (step === "language") setStep("welcome");
    else if (step === "welcome") setStep("persona");
    else if (step === "persona") setStep("name");
    else if (step === "name") setStep("cycle");
  };

  const handleBack = () => {
    if (step === "welcome") setStep("language");
    else if (step === "persona") setStep("welcome");
    else if (step === "name") setStep("persona");
    else if (step === "cycle") setStep("name");
  };

  const handleComplete = async () => {
    await updateSettings({
      persona,
      name: name.trim() || "Friend",
      cycleSettings: {
        cycleLength: parseInt(cycleLength) || 28,
        periodLength: parseInt(periodLength) || 5,
        lastPeriodStart: null,
      },
      onboardingComplete: true,
    });
  };

  const canProceed = () => {
    if (step === "cycle") {
      const cl = parseInt(cycleLength);
      const pl = parseInt(periodLength);
      return cl >= 21 && cl <= 40 && pl >= 2 && pl <= 10;
    }
    return true;
  };

  const renderLanguage = () => (
    <Animated.View
      entering={FadeInDown.duration(400)}
      exiting={FadeOutUp.duration(300)}
      style={styles.stepContainer}
    >
      {onBack ? (
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onBack();
          }}
          style={[styles.backButtonTop, { [layout.left]: Spacing.lg, [layout.right]: undefined }]}
        >
          <Feather name={layout.isRTL ? "chevron-right" : "chevron-left"} size={24} color={theme.text} />
        </Pressable>
      ) : null}
      <View style={styles.welcomeContent}>
        <View style={[styles.logoContainer, { backgroundColor: theme.backgroundSecondary }]}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.logo}
            contentFit="contain"
          />
        </View>
        <ThemedText type="h1" style={styles.welcomeTitle}>
          {t("onboarding", "chooseLanguage")}
        </ThemedText>
        <ThemedText type="body" style={[styles.welcomeSubtitle, { color: theme.textSecondary }]}>
          {t("onboarding", "chooseLanguageDesc")}
        </ThemedText>
      </View>
      <View style={styles.languageOptions}>
        <Pressable
          onPress={() => handleSelectLanguage("ar")}
          style={[
            styles.languageButton,
            {
              backgroundColor: language === "ar" ? theme.primary : theme.backgroundDefault,
              borderColor: language === "ar" ? theme.primary : theme.cardBorder,
            },
          ]}
        >
          <ThemedText
            type="h3"
            style={{ color: language === "ar" ? theme.buttonText : theme.text }}
          >
            العربية
          </ThemedText>
          <ThemedText
            type="caption"
            style={{ color: language === "ar" ? theme.buttonText : theme.textSecondary }}
          >
            Arabic
          </ThemedText>
        </Pressable>
        <Pressable
          onPress={() => handleSelectLanguage("en")}
          style={[
            styles.languageButton,
            {
              backgroundColor: language === "en" ? theme.primary : theme.backgroundDefault,
              borderColor: language === "en" ? theme.primary : theme.cardBorder,
            },
          ]}
        >
          <ThemedText
            type="h3"
            style={{ color: language === "en" ? theme.buttonText : theme.text }}
          >
            English
          </ThemedText>
          <ThemedText
            type="caption"
            style={{ color: language === "en" ? theme.buttonText : theme.textSecondary }}
          >
            الإنجليزية
          </ThemedText>
        </Pressable>
      </View>
    </Animated.View>
  );

  const renderWelcome = () => (
    <Animated.View
      entering={FadeInDown.duration(400)}
      exiting={FadeOutUp.duration(300)}
      style={styles.stepContainer}
    >
      <View style={styles.welcomeContent}>
        <View style={[styles.logoContainer, { backgroundColor: theme.backgroundSecondary }]}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.logo}
            contentFit="contain"
          />
        </View>
        <ThemedText type="h1" style={styles.welcomeTitle}>
          {t("onboarding", "welcome")}
        </ThemedText>
        <ThemedText type="body" style={[styles.welcomeSubtitle, { color: theme.textSecondary }]}>
          {t("onboarding", "welcomeDesc")}
        </ThemedText>
      </View>
      <View style={styles.features}>
        <FeatureItem
          icon="calendar"
          title={t("onboarding", "featureTrackCycle")}
          description={t("onboarding", "featureTrackCycleDesc")}
        />
        <FeatureItem
          icon="heart"
          title={t("onboarding", "featureBeauty")}
          description={t("onboarding", "featureBeautyDesc")}
        />
        <FeatureItem
          icon="book-open"
          title={t("onboarding", "featureFaith")}
          description={t("onboarding", "featureFaithDesc")}
        />
      </View>
    </Animated.View>
  );

  const renderPersona = () => (
    <Animated.View
      entering={FadeInDown.duration(400)}
      exiting={FadeOutUp.duration(300)}
      style={styles.stepContainer}
    >
      <View style={[styles.stepHeader, { alignItems: layout.alignSelf }]}>
        <ThemedText type="h2" style={{ textAlign: layout.textAlign }}>
          {t("onboarding", "tellAboutYourself")}
        </ThemedText>
        <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: layout.textAlign }}>
          {t("onboarding", "personalizesExperience")}
        </ThemedText>
      </View>
      <PersonaSelector selectedPersona={persona} onSelect={setPersona} />
    </Animated.View>
  );

  const renderName = () => (
    <Animated.View
      entering={FadeInDown.duration(400)}
      exiting={FadeOutUp.duration(300)}
      style={styles.stepContainer}
    >
      <View style={[styles.stepHeader, { alignItems: layout.alignSelf }]}>
        <ThemedText type="h2" style={{ textAlign: layout.textAlign }}>
          {t("onboarding", "whatsYourName")}
        </ThemedText>
        <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: layout.textAlign }}>
          {t("onboarding", "greetPersonally")}
        </ThemedText>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.backgroundDefault,
              borderColor: theme.cardBorder,
              color: theme.text,
              textAlign: layout.textAlign,
            },
          ]}
          placeholder={t("onboarding", "enterName")}
          placeholderTextColor={theme.textSecondary}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoCorrect={false}
        />
        <ThemedText type="small" style={{ color: theme.textSecondary, textAlign: layout.textAlign }}>
          {t("onboarding", "skipIfPrefer")}
        </ThemedText>
      </View>
    </Animated.View>
  );

  const renderCycle = () => (
    <Animated.View
      entering={FadeInDown.duration(400)}
      exiting={FadeOutUp.duration(300)}
      style={styles.stepContainer}
    >
      <View style={[styles.stepHeader, { alignItems: layout.alignSelf }]}>
        <ThemedText type="h2" style={{ textAlign: layout.textAlign }}>
          {t("onboarding", "setupCycle")}
        </ThemedText>
        <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: layout.textAlign }}>
          {t("onboarding", "predictPeriods")}
        </ThemedText>
      </View>
      <View style={styles.cycleInputs}>
        <View style={styles.cycleInputGroup}>
          <ThemedText type="caption" style={{ textAlign: layout.textAlign }}>
            {t("settings", "cycleLength")}
          </ThemedText>
          <View style={[styles.cycleInputRow, { flexDirection: layout.flexDirection }]}>
            <Pressable
              onPress={() => {
                const val = parseInt(cycleLength) - 1;
                if (val >= 21) setCycleLength(val.toString());
              }}
              style={[styles.cycleButton, { backgroundColor: theme.backgroundSecondary }]}
            >
              <Feather name="minus" size={20} color={theme.text} />
            </Pressable>
            <TextInput
              style={[
                styles.cycleInput,
                {
                  backgroundColor: theme.backgroundDefault,
                  borderColor: theme.cardBorder,
                  color: theme.text,
                },
              ]}
              value={cycleLength}
              onChangeText={setCycleLength}
              keyboardType="number-pad"
              maxLength={2}
            />
            <Pressable
              onPress={() => {
                const val = parseInt(cycleLength) + 1;
                if (val <= 40) setCycleLength(val.toString());
              }}
              style={[styles.cycleButton, { backgroundColor: theme.backgroundSecondary }]}
            >
              <Feather name="plus" size={20} color={theme.text} />
            </Pressable>
            <ThemedText type="body" style={{ marginHorizontal: Spacing.sm }}>
              {t("settings", "days")}
            </ThemedText>
          </View>
          <ThemedText type="small" style={{ color: theme.textSecondary, textAlign: layout.textAlign }}>
            {t("onboarding", "cycleLengthHint")}
          </ThemedText>
        </View>

        <View style={styles.cycleInputGroup}>
          <ThemedText type="caption" style={{ textAlign: layout.textAlign }}>
            {t("settings", "periodLength")}
          </ThemedText>
          <View style={[styles.cycleInputRow, { flexDirection: layout.flexDirection }]}>
            <Pressable
              onPress={() => {
                const val = parseInt(periodLength) - 1;
                if (val >= 2) setPeriodLength(val.toString());
              }}
              style={[styles.cycleButton, { backgroundColor: theme.backgroundSecondary }]}
            >
              <Feather name="minus" size={20} color={theme.text} />
            </Pressable>
            <TextInput
              style={[
                styles.cycleInput,
                {
                  backgroundColor: theme.backgroundDefault,
                  borderColor: theme.cardBorder,
                  color: theme.text,
                },
              ]}
              value={periodLength}
              onChangeText={setPeriodLength}
              keyboardType="number-pad"
              maxLength={2}
            />
            <Pressable
              onPress={() => {
                const val = parseInt(periodLength) + 1;
                if (val <= 10) setPeriodLength(val.toString());
              }}
              style={[styles.cycleButton, { backgroundColor: theme.backgroundSecondary }]}
            >
              <Feather name="plus" size={20} color={theme.text} />
            </Pressable>
            <ThemedText type="body" style={{ marginHorizontal: Spacing.sm }}>
              {t("settings", "days")}
            </ThemedText>
          </View>
          <ThemedText type="small" style={{ color: theme.textSecondary, textAlign: layout.textAlign }}>
            {t("onboarding", "periodLengthHint")}
          </ThemedText>
        </View>
      </View>
    </Animated.View>
  );

  const allSteps: OnboardingStep[] = ["language", "welcome", "persona", "name", "cycle"];
  const currentStepIndex = allSteps.indexOf(step);

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.contentContainer,
        {
          paddingTop: insets.top + Spacing.xl,
          paddingBottom: insets.bottom + Spacing.xl,
        },
      ]}
    >
      {step !== "language" ? (
        <Pressable onPress={handleBack} style={[styles.backButton, { alignSelf: layout.alignSelf }]}>
          <Feather name={layout.isRTL ? "arrow-right" : "arrow-left"} size={24} color={theme.text} />
        </Pressable>
      ) : null}

      <View style={styles.progressContainer}>
        {allSteps.map((s, i) => (
          <View
            key={s}
            style={[
              styles.progressDot,
              {
                backgroundColor:
                  currentStepIndex >= i
                    ? theme.primary
                    : theme.backgroundSecondary,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.content}>
        {step === "language" ? renderLanguage() : null}
        {step === "welcome" ? renderWelcome() : null}
        {step === "persona" ? renderPersona() : null}
        {step === "name" ? renderName() : null}
        {step === "cycle" ? renderCycle() : null}
      </View>

      {step !== "language" ? (
        <View style={styles.footer}>
          {step === "cycle" ? (
            <Button onPress={handleComplete} disabled={!canProceed()}>
              {t("onboarding", "getStarted")}
            </Button>
          ) : (
            <Button onPress={handleNext}>
              {step === "welcome" ? t("onboarding", "getStarted") : t("common", "next")}
            </Button>
          )}
        </View>
      ) : null}
    </KeyboardAwareScrollViewCompat>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  description: string;
}) {
  const { theme } = useTheme();
  const layout = useLayout();

  return (
    <View style={[styles.featureItem, { flexDirection: layout.flexDirection }]}>
      <View style={[styles.featureIcon, { backgroundColor: theme.backgroundSecondary }]}>
        <Feather name={icon} size={24} color={theme.primary} />
      </View>
      <View style={styles.featureText}>
        <ThemedText type="h4" style={{ textAlign: layout.textAlign }}>{title}</ThemedText>
        <ThemedText type="small" style={{ color: theme.textSecondary, textAlign: layout.textAlign }}>
          {description}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.sm,
    marginVertical: Spacing.lg,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  stepContainer: {
    gap: Spacing.xxl,
  },
  stepHeader: {
    gap: Spacing.sm,
  },
  welcomeContent: {
    alignItems: "center",
    gap: Spacing.lg,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  logo: {
    width: 80,
    height: 80,
  },
  welcomeTitle: {
    textAlign: "center",
  },
  welcomeSubtitle: {
    textAlign: "center",
    paddingHorizontal: Spacing.lg,
  },
  features: {
    gap: Spacing.lg,
  },
  featureItem: {
    alignItems: "center",
    gap: Spacing.md,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.medium,
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    flex: 1,
    gap: Spacing.xs,
  },
  languageOptions: {
    flexDirection: "row",
    gap: Spacing.lg,
    justifyContent: "center",
  },
  languageButton: {
    flex: 1,
    padding: Spacing.xl,
    borderRadius: BorderRadius.large,
    borderWidth: 2,
    alignItems: "center",
    gap: Spacing.xs,
  },
  inputContainer: {
    gap: Spacing.sm,
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
  },
  cycleInputs: {
    gap: Spacing.xl,
  },
  cycleInputGroup: {
    gap: Spacing.sm,
  },
  cycleInputRow: {
    alignItems: "center",
    gap: Spacing.sm,
  },
  cycleButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.medium,
    alignItems: "center",
    justifyContent: "center",
  },
  cycleInput: {
    width: 60,
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    paddingTop: Spacing.xl,
  },
  backButtonTop: {
    position: "absolute",
    top: 0,
    zIndex: 10,
    padding: Spacing.sm,
  },
});
