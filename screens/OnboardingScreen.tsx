import { useState } from "react";
import { View, StyleSheet, Pressable, TextInput, ScrollView, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { PersonaSelector } from "@/components/PersonaSelector";
import { useLanguage } from "@/hooks/useLanguage";
import { useApp } from "@/lib/AppContext";
import { Persona } from "@/lib/types";
import { LightBackgrounds, BrandColors, NeutralColors, PersonaColors } from "@/constants/colors";
import { Spacing, BorderRadius, Typography, Shadows, Layout } from "@/constants/design-tokens";

const { width } = Dimensions.get("window");

type OnboardingStep = "language" | "welcome" | "persona" | "name" | "cycle";

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { t, language, setLanguage } = useLanguage();
  const { settings, updateSettings } = useApp();

  const [step, setStep] = useState<OnboardingStep>("language");
  const [persona, setPersona] = useState<Persona>("single");
  const [name, setName] = useState("");
  const [cycleLength, setCycleLength] = useState("28");
  const [periodLength, setPeriodLength] = useState("5");

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (step === "language") {
      setStep("welcome");
    } else if (step === "welcome") {
      setStep("persona");
    } else if (step === "persona") {
      setStep("name");
    } else if (step === "name") {
      setStep("cycle");
    } else if (step === "cycle") {
      // Save settings and navigate to home
      updateSettings({
        persona,
        name,
        cycleLength: parseInt(cycleLength),
        periodLength: parseInt(periodLength),
        onboardingCompleted: true,
      });
      navigation.navigate("Main" as never);
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (step === "welcome") {
      setStep("language");
    } else if (step === "persona") {
      setStep("welcome");
    } else if (step === "name") {
      setStep("persona");
    } else if (step === "cycle") {
      setStep("name");
    }
  };

  const renderLanguageStep = () => (
    <Animated.View
      entering={FadeInDown.duration(600)}
      exiting={FadeOutUp.duration(400)}
      style={styles.stepContainer}
    >
      <ThemedText style={styles.title}>
        {t("onboarding.selectLanguage")}
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Choose your preferred language
      </ThemedText>
      
      <View style={styles.languageContainer}>
        <Pressable
          style={[
            styles.languageButton,
            language === "ar" && styles.languageButtonActive,
          ]}
          onPress={() => {
            setLanguage("ar");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <ThemedText style={[
            styles.languageButtonText,
            language === "ar" && styles.languageButtonTextActive,
          ]}>
            العربية
          </ThemedText>
        </Pressable>

        <Pressable
          style={[
            styles.languageButton,
            language === "en" && styles.languageButtonActive,
          ]}
          onPress={() => {
            setLanguage("en");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <ThemedText style={[
            styles.languageButtonText,
            language === "en" && styles.languageButtonTextActive,
          ]}>
            English
          </ThemedText>
        </Pressable>
      </View>
    </Animated.View>
  );

  const renderWelcomeStep = () => (
    <Animated.View
      entering={FadeInDown.duration(600)}
      exiting={FadeOutUp.duration(400)}
      style={styles.stepContainer}
    >
      <ThemedText style={styles.hero}>
        {t("onboarding.welcome")}
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        {t("onboarding.welcomeSubtitle")}
      </ThemedText>
    </Animated.View>
  );

  const renderPersonaStep = () => (
    <Animated.View
      entering={FadeInDown.duration(600)}
      exiting={FadeOutUp.duration(400)}
      style={styles.stepContainer}
    >
      <ThemedText style={styles.title}>
        {t("onboarding.selectPersona")}
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        {t("onboarding.personaSubtitle")}
      </ThemedText>
      
      <PersonaSelector
        selected={persona}
        onSelect={(p) => {
          setPersona(p);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      />
    </Animated.View>
  );

  const renderNameStep = () => (
    <Animated.View
      entering={FadeInDown.duration(600)}
      exiting={FadeOutUp.duration(400)}
      style={styles.stepContainer}
    >
      <ThemedText style={styles.title}>
        {t("onboarding.enterName")}
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        {t("onboarding.nameSubtitle")}
      </ThemedText>
      
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder={t("onboarding.namePlaceholder")}
        placeholderTextColor={NeutralColors.gray[400]}
        autoFocus
      />
    </Animated.View>
  );

  const renderCycleStep = () => (
    <Animated.View
      entering={FadeInDown.duration(600)}
      exiting={FadeOutUp.duration(400)}
      style={styles.stepContainer}
    >
      <ThemedText style={styles.title}>
        {t("onboarding.cycleInfo")}
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        {t("onboarding.cycleSubtitle")}
      </ThemedText>
      
      <View style={styles.inputGroup}>
        <View style={styles.inputWrapper}>
          <ThemedText style={styles.label}>
            {t("onboarding.cycleLength")}
          </ThemedText>
          <TextInput
            style={styles.input}
            value={cycleLength}
            onChangeText={setCycleLength}
            keyboardType="number-pad"
            placeholder="28"
            placeholderTextColor={NeutralColors.gray[400]}
          />
        </View>
        
        <View style={styles.inputWrapper}>
          <ThemedText style={styles.label}>
            {t("onboarding.periodLength")}
          </ThemedText>
          <TextInput
            style={styles.input}
            value={periodLength}
            onChangeText={setPeriodLength}
            keyboardType="number-pad"
            placeholder="5"
            placeholderTextColor={NeutralColors.gray[400]}
          />
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {step === "language" && renderLanguageStep()}
        {step === "welcome" && renderWelcomeStep()}
        {step === "persona" && renderPersonaStep()}
        {step === "name" && renderNameStep()}
        {step === "cycle" && renderCycleStep()}
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomContainer}>
        {step !== "language" && (
          <Pressable
            style={styles.secondaryButton}
            onPress={handleBack}
          >
            <ThemedText style={styles.secondaryButtonText}>
              {t("common.back")}
            </ThemedText>
          </Pressable>
        )}
        
        <Pressable
          style={[styles.primaryButton, step !== "language" && { flex: 1 }]}
          onPress={handleNext}
        >
          <ThemedText style={styles.primaryButtonText}>
            {step === "cycle" ? t("common.finish") : t("common.next")}
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LightBackgrounds.base,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingVertical: Spacing["3xl"],
  },
  stepContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 400,
  },
  
  // Typography
  hero: {
    fontSize: Typography.hero.fontSize,
    lineHeight: Typography.hero.lineHeight,
    fontWeight: Typography.hero.fontWeight,
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: Spacing.base,
  },
  title: {
    fontSize: Typography.h1.fontSize,
    lineHeight: Typography.h1.lineHeight,
    fontWeight: Typography.h1.fontWeight,
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: Spacing.base,
  },
  subtitle: {
    fontSize: Typography.bodyLarge.fontSize,
    lineHeight: Typography.bodyLarge.lineHeight,
    fontWeight: Typography.bodyLarge.fontWeight,
    color: NeutralColors.gray[600],
    textAlign: "center",
    marginBottom: Spacing["2xl"],
  },
  label: {
    fontSize: Typography.label.fontSize,
    lineHeight: Typography.label.lineHeight,
    fontWeight: Typography.label.fontWeight,
    color: NeutralColors.gray[700],
    marginBottom: Spacing.sm,
  },
  
  // Language Selection
  languageContainer: {
    width: "100%",
    gap: Spacing.base,
  },
  languageButton: {
    width: "100%",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    backgroundColor: NeutralColors.white,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: NeutralColors.gray[200],
    ...Shadows.light.md,
  },
  languageButtonActive: {
    borderColor: BrandColors.violet.main,
    backgroundColor: BrandColors.violet.soft,
  },
  languageButtonText: {
    fontSize: Typography.button.fontSize,
    lineHeight: Typography.button.lineHeight,
    fontWeight: Typography.button.fontWeight,
    color: NeutralColors.gray[700],
    textAlign: "center",
  },
  languageButtonTextActive: {
    color: BrandColors.violet.main,
  },
  
  // Input
  input: {
    width: "100%",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    backgroundColor: NeutralColors.white,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: NeutralColors.gray[200],
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    color: "#2C3E50",
    ...Shadows.light.sm,
  },
  inputGroup: {
    width: "100%",
    gap: Spacing.lg,
  },
  inputWrapper: {
    width: "100%",
  },
  
  // Bottom Buttons
  bottomContainer: {
    flexDirection: "row",
    gap: Spacing.base,
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingBottom: Spacing.lg,
  },
  primaryButton: {
    flex: 1,
    borderRadius: BorderRadius["2xl"],
    backgroundColor: BrandColors.violet.main,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.light.md,
  },
  primaryButtonText: {
    fontSize: Typography.button.fontSize,
    lineHeight: Typography.button.lineHeight,
    fontWeight: Typography.button.fontWeight,
    color: NeutralColors.white,
  },
  secondaryButton: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    backgroundColor: NeutralColors.white,
    borderRadius: BorderRadius["2xl"],
    borderWidth: 2,
    borderColor: BrandColors.violet.main,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.light.sm,
  },
  secondaryButtonText: {
    fontSize: Typography.button.fontSize,
    lineHeight: Typography.button.lineHeight,
    fontWeight: Typography.button.fontWeight,
    color: BrandColors.violet.main,
  },
});
