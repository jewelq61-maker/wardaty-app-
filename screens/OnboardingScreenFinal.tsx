import { useState } from "react";
import { View, StyleSheet, Pressable, TextInput, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "../components/ThemedText";
import { PersonaSelector } from "../components/PersonaSelector";
import { useLanguage } from "../hooks/useLanguage";
import { useApp } from "../lib/AppContext";
import { Persona } from "../lib/types";
import { BrandColors } from "../constants/colors";

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
      navigation.navigate("Home" as never);
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
      
      <View style={styles.languageContainer}>
        <Pressable
          style={[
            styles.languageButton,
            language === "ar" && styles.languageButtonActive,
          ]}
          onPress={() => setLanguage("ar")}
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
          onPress={() => setLanguage("en")}
        >
          <ThemedText style={[
            styles.languageButtonText,
            language === "en" && styles.languageButtonTextActive,
          ]}>
            English
          </ThemedText>
        </Pressable>
      </View>

      <Pressable style={styles.primaryButton} onPress={handleNext}>
        <LinearGradient
          colors={[BrandColors.violet.main, BrandColors.coral.main]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientButton}
        >
          <ThemedText style={styles.primaryButtonText}>
            {t("common.continue")}
          </ThemedText>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );

  const renderWelcomeStep = () => (
    <Animated.View
      entering={FadeInDown.duration(600)}
      exiting={FadeOutUp.duration(400)}
      style={styles.stepContainer}
    >
      <View style={styles.iconContainer}>
        <ThemedText style={styles.icon}>🌸</ThemedText>
      </View>

      <ThemedText style={styles.title}>
        {t("onboarding.welcome")}
      </ThemedText>
      
      <ThemedText style={styles.description}>
        {t("onboarding.welcomeDescription")}
      </ThemedText>

      <View style={styles.buttonGroup}>
        <Pressable style={styles.secondaryButton} onPress={handleBack}>
          <ThemedText style={styles.secondaryButtonText}>
            {t("common.back")}
          </ThemedText>
        </Pressable>

        <Pressable style={styles.primaryButton} onPress={handleNext}>
          <LinearGradient
            colors={[BrandColors.violet.main, BrandColors.coral.main]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <ThemedText style={styles.primaryButtonText}>
              {t("common.continue")}
            </ThemedText>
          </LinearGradient>
        </Pressable>
      </View>
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
      
      <ThemedText style={styles.description}>
        {t("onboarding.personaDescription")}
      </ThemedText>

      <View style={styles.personaContainer}>
        <PersonaSelector
          selectedPersona={persona}
          onSelect={setPersona}
        />
      </View>

      <View style={styles.buttonGroup}>
        <Pressable style={styles.secondaryButton} onPress={handleBack}>
          <ThemedText style={styles.secondaryButtonText}>
            {t("common.back")}
          </ThemedText>
        </Pressable>

        <Pressable style={styles.primaryButton} onPress={handleNext}>
          <LinearGradient
            colors={[BrandColors.violet.main, BrandColors.coral.main]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <ThemedText style={styles.primaryButtonText}>
              {t("common.continue")}
            </ThemedText>
          </LinearGradient>
        </Pressable>
      </View>
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
      
      <ThemedText style={styles.description}>
        {t("onboarding.nameDescription")}
      </ThemedText>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder={t("onboarding.namePlaceholder")}
        placeholderTextColor="#9CA3AF"
      />

      <View style={styles.buttonGroup}>
        <Pressable style={styles.secondaryButton} onPress={handleBack}>
          <ThemedText style={styles.secondaryButtonText}>
            {t("common.back")}
          </ThemedText>
        </Pressable>

        <Pressable 
          style={[styles.primaryButton, !name && styles.primaryButtonDisabled]} 
          onPress={handleNext}
          disabled={!name}
        >
          <LinearGradient
            colors={[BrandColors.violet.main, BrandColors.coral.main]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <ThemedText style={styles.primaryButtonText}>
              {t("common.continue")}
            </ThemedText>
          </LinearGradient>
        </Pressable>
      </View>
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
      
      <ThemedText style={styles.description}>
        {t("onboarding.cycleDescription")}
      </ThemedText>

      <View style={styles.inputGroup}>
        <View style={styles.inputWrapper}>
          <ThemedText style={styles.inputLabel}>
            {t("onboarding.cycleLength")}
          </ThemedText>
          <TextInput
            style={styles.input}
            value={cycleLength}
            onChangeText={setCycleLength}
            keyboardType="number-pad"
            placeholder="28"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputWrapper}>
          <ThemedText style={styles.inputLabel}>
            {t("onboarding.periodLength")}
          </ThemedText>
          <TextInput
            style={styles.input}
            value={periodLength}
            onChangeText={setPeriodLength}
            keyboardType="number-pad"
            placeholder="5"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <View style={styles.buttonGroup}>
        <Pressable style={styles.secondaryButton} onPress={handleBack}>
          <ThemedText style={styles.secondaryButtonText}>
            {t("common.back")}
          </ThemedText>
        </Pressable>

        <Pressable style={styles.primaryButton} onPress={handleNext}>
          <LinearGradient
            colors={[BrandColors.violet.main, BrandColors.coral.main]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <ThemedText style={styles.primaryButtonText}>
              {t("common.finish")}
            </ThemedText>
          </LinearGradient>
        </Pressable>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  stepContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 18,
    fontWeight: "400",
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 48,
    lineHeight: 28,
    paddingHorizontal: 16,
  },
  languageContainer: {
    width: "100%",
    gap: 16,
    marginBottom: 48,
  },
  languageButton: {
    height: 64,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  languageButtonActive: {
    borderColor: BrandColors.violet.main,
    backgroundColor: BrandColors.violet.soft,
  },
  languageButtonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6B7280",
  },
  languageButtonTextActive: {
    color: BrandColors.violet.main,
  },
  personaContainer: {
    width: "100%",
    marginBottom: 48,
  },
  inputGroup: {
    width: "100%",
    gap: 24,
    marginBottom: 48,
  },
  inputWrapper: {
    width: "100%",
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1F2937",
  },
  buttonGroup: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  gradientButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  secondaryButton: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: BrandColors.violet.main,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: BrandColors.violet.main,
  },
});
