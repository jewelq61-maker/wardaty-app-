import { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, TextInput, ScrollView, Dimensions, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { PersonaSelector } from "@/components/PersonaSelector";
import { useLanguage } from "@/hooks/useLanguage";
import { useApp } from "@/lib/AppContext";
import { Persona } from "@/lib/types";
import { DarkTheme, PersonaColors } from "@/constants/theme";
import { Spacing, BorderRadius } from "@/constants/theme";

const { width } = Dimensions.get("window");

// Simplified order: Language → Persona → Personal Data
type OnboardingStep = "language" | "persona" | "personalData";

const ONBOARDING_PROGRESS_KEY = "@wardaty_onboarding_progress";

interface OnboardingProgress {
  step: OnboardingStep;
  language?: "ar" | "en";
  persona?: Persona;
  name?: string;
  age?: string;
  cycleLength?: string;
  periodLength?: string;
  lastPeriodDate?: string;
  waterGoal?: string;
  sleepGoal?: string;
}

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { t, language, setLanguage, isRTL } = useLanguage();
  const { settings, updateSettings } = useApp();

  // State
  const [step, setStep] = useState<OnboardingStep>("language");
  const [selectedLanguage, setSelectedLanguage] = useState<"ar" | "en" | null>(null);
  const [persona, setPersona] = useState<Persona>("single");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [cycleLength, setCycleLength] = useState("28");
  const [periodLength, setPeriodLength] = useState("5");
  const [lastPeriodDate, setLastPeriodDate] = useState("");
  const [waterGoal, setWaterGoal] = useState("8");
  const [sleepGoal, setSleepGoal] = useState("8");
  
  // Debug: Reset counter (tap logo 5 times to reset)
  const [resetTapCount, setResetTapCount] = useState(0);

  // Load saved progress on mount
  useEffect(() => {
    loadProgress();
  }, []);

  // Save progress whenever state changes
  useEffect(() => {
    saveProgress();
  }, [step, selectedLanguage, persona, name, age, cycleLength, periodLength, lastPeriodDate, waterGoal, sleepGoal]);

  const loadProgress = async () => {
    try {
      const saved = await AsyncStorage.getItem(ONBOARDING_PROGRESS_KEY);
      if (saved) {
        const progress: OnboardingProgress = JSON.parse(saved);
        setStep(progress.step || "language");
        if (progress.language) {
          setSelectedLanguage(progress.language);
          setLanguage(progress.language);
        }
        if (progress.persona) setPersona(progress.persona);
        if (progress.name) setName(progress.name);
        if (progress.age) setAge(progress.age);
        if (progress.cycleLength) setCycleLength(progress.cycleLength);
        if (progress.periodLength) setPeriodLength(progress.periodLength);
        if (progress.lastPeriodDate) setLastPeriodDate(progress.lastPeriodDate);
        if (progress.waterGoal) setWaterGoal(progress.waterGoal);
        if (progress.sleepGoal) setSleepGoal(progress.sleepGoal);
      }
    } catch (error) {
      console.error("Failed to load onboarding progress:", error);
    }
  };

  const saveProgress = async () => {
    try {
      const progress: OnboardingProgress = {
        step,
        language: selectedLanguage || undefined,
        persona,
        name,
        age,
        cycleLength,
        periodLength,
        lastPeriodDate,
        waterGoal,
        sleepGoal,
      };
      await AsyncStorage.setItem(ONBOARDING_PROGRESS_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error("Failed to save onboarding progress:", error);
    }
  };

  const clearProgress = async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_PROGRESS_KEY);
    } catch (error) {
      console.error("Failed to clear onboarding progress:", error);
    }
  };

  // Debug: Handle logo tap for reset
  const handleLogoTap = async () => {
    const newCount = resetTapCount + 1;
    setResetTapCount(newCount);
    
    if (newCount >= 5) {
      // Reset everything
      await clearProgress();
      setStep("language");
      setSelectedLanguage(null);
      setPersona("single");
      setName("");
      setAge("");
      setCycleLength("28");
      setPeriodLength("5");
      setLastPeriodDate("");
      setWaterGoal("8");
      setSleepGoal("8");
      setResetTapCount(0);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      alert("Onboarding reset! Starting from Language Selection.");
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Reset counter after 2 seconds
    setTimeout(() => setResetTapCount(0), 2000);
  };

  // Validation
  const canProceed = () => {
    if (step === "language") return selectedLanguage !== null;
    if (step === "persona") return true; // persona has default
    if (step === "personalData") {
      // Name and age are required
      if (!name.trim() || !age.trim()) return false;
      // Cycle data is required
      if (!cycleLength.trim() || !periodLength.trim()) return false;
      const cycleNum = parseInt(cycleLength);
      const periodNum = parseInt(periodLength);
      if (isNaN(cycleNum) || isNaN(periodNum)) return false;
      if (cycleNum < 21 || cycleNum > 35) return false;
      if (periodNum < 3 || periodNum > 7) return false;
      return true;
    }
    return false;
  };

  const handleNext = async () => {
    if (!canProceed()) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (step === "language") {
      if (selectedLanguage) {
        await setLanguage(selectedLanguage);
      }
      setStep("persona");
    } else if (step === "persona") {
      setStep("personalData");
    } else if (step === "personalData") {
      try {
        console.log("[Onboarding] Starting to save settings...");
        
        // Save all settings and complete onboarding
        const ageNum = parseInt(age);
        const cycleLengthNum = parseInt(cycleLength);
        const periodLengthNum = parseInt(periodLength);
        const waterGoalNum = parseInt(waterGoal) || 8;
        const sleepGoalNum = parseInt(sleepGoal) || 8;

        console.log("[Onboarding] Parsed values:", { ageNum, cycleLengthNum, periodLengthNum });

        await updateSettings({
          persona,
          name,
          age: ageNum,
          cycleSettings: {
            ...settings.cycleSettings,
            cycleLength: cycleLengthNum,
            periodLength: periodLengthNum,
            lastPeriodStart: lastPeriodDate || new Date().toISOString().split("T")[0],
          },
          wellnessGoals: {
            waterCups: waterGoalNum,
            sleepHours: sleepGoalNum,
          },
          onboardingCompleted: true,
        });

        console.log("[Onboarding] Settings saved successfully!");

        // Clear progress
        await clearProgress();
        console.log("[Onboarding] Progress cleared!");

        // Navigate to main app
        console.log("[Onboarding] Navigating to Main...");
        navigation.reset({
          index: 0,
          routes: [{ name: "Main" as never }],
        });
      } catch (error) {
        console.error("[Onboarding] Error completing onboarding:", error);
        alert(`Error: ${error}`);
      }
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (step === "persona") {
      setStep("language");
    } else if (step === "personalData") {
      setStep("persona");
    }
  };

  // Step 1: Language Selection (Bilingual)
  const renderLanguageStep = () => (
    <Animated.View
      entering={FadeInDown.duration(600)}
      exiting={FadeOutUp.duration(400)}
      style={styles.stepContainer}
    >
      <Pressable onPress={handleLogoTap}>
        <Feather name="globe" size={48} color={DarkTheme.text.primary} style={{ marginBottom: Spacing.xl }} />
      </Pressable>
      
      <ThemedText style={styles.title}>
        Choose Language / اختر اللغة
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Select your preferred language / اختر لغتك المفضلة
      </ThemedText>
      
      <View style={styles.optionsContainer}>
        <Pressable
          style={[
            styles.optionButton,
            selectedLanguage === "ar" && styles.optionButtonActive,
          ]}
          onPress={() => {
            setSelectedLanguage("ar");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <ThemedText style={[
            styles.optionButtonText,
            selectedLanguage === "ar" && styles.optionButtonTextActive,
          ]}>
            العربية
          </ThemedText>
          {selectedLanguage === "ar" && (
            <Feather name="check-circle" size={20} color={PersonaColors.single.primary} />
          )}
        </Pressable>

        <Pressable
          style={[
            styles.optionButton,
            selectedLanguage === "en" && styles.optionButtonActive,
          ]}
          onPress={() => {
            setSelectedLanguage("en");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <ThemedText style={[
            styles.optionButtonText,
            selectedLanguage === "en" && styles.optionButtonTextActive,
          ]}>
            English
          </ThemedText>
          {selectedLanguage === "en" && (
            <Feather name="check-circle" size={20} color={PersonaColors.single.primary} />
          )}
        </Pressable>
      </View>
    </Animated.View>
  );

  // Step 2: Persona Selection
  const renderPersonaStep = () => (
    <Animated.View
      entering={FadeInDown.duration(600)}
      exiting={FadeOutUp.duration(400)}
      style={styles.stepContainer}
    >
      <Feather name="star" size={48} color={DarkTheme.text.primary} style={{ marginBottom: Spacing.xl }} />
      
      <ThemedText style={styles.title}>
        {t("onboarding", "selectPersona")}
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        {t("onboarding", "personalizesExperience")}
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

  // Step 4: Personal Data (Name, Age, Cycle, Wellness)
  const renderPersonalDataStep = () => (
    <Animated.View
      entering={FadeInDown.duration(600)}
      exiting={FadeOutUp.duration(400)}
      style={styles.stepContainer}
    >
      <ScrollView 
        style={styles.formScroll}
        contentContainerStyle={styles.formContent}
        showsVerticalScrollIndicator={false}
      >
        <Feather name="edit" size={48} color={DarkTheme.text.primary} style={{ marginBottom: Spacing.xl, alignSelf: "center" }} />
        
        <ThemedText style={styles.title}>
          {t("onboarding", "personalInfo")}
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          {t("onboarding", "personalInfoDescription")}
        </ThemedText>
        
        {/* Name */}
        <View style={styles.inputWrapper}>
          <ThemedText style={styles.label}>
            {t("onboarding", "name")} *
          </ThemedText>
          <TextInput
            style={[styles.input, { textAlign: isRTL ? "right" : "left" }]}
            value={name}
            onChangeText={setName}
            placeholder={t("onboarding", "enterName")}
            placeholderTextColor={DarkTheme.text.tertiary}
            autoCapitalize="words"
          />
        </View>

        {/* Age */}
        <View style={styles.inputWrapper}>
          <ThemedText style={styles.label}>
            {t("onboarding", "age")} *
          </ThemedText>
          <TextInput
            style={[styles.input, { textAlign: isRTL ? "right" : "left" }]}
            value={age}
            onChangeText={setAge}
            placeholder="25"
            placeholderTextColor={DarkTheme.text.tertiary}
            keyboardType="number-pad"
          />
        </View>

        {/* Cycle Data */}
        <ThemedText style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>
          {t("onboarding", "cycleInformation")}
        </ThemedText>

            <View style={styles.inputWrapper}>
              <ThemedText style={styles.label}>
                {t("settings", "cycleLength")} * (21-35 {t("settings", "days")})
              </ThemedText>
              <TextInput
                style={[styles.input, { textAlign: isRTL ? "right" : "left" }]}
                value={cycleLength}
                onChangeText={setCycleLength}
                keyboardType="number-pad"
                placeholder="28"
                placeholderTextColor={DarkTheme.text.tertiary}
              />
            </View>

            <View style={styles.inputWrapper}>
              <ThemedText style={styles.label}>
                {t("settings", "periodLength")} * (3-7 {t("settings", "days")})
              </ThemedText>
              <TextInput
                style={[styles.input, { textAlign: isRTL ? "right" : "left" }]}
                value={periodLength}
                onChangeText={setPeriodLength}
                keyboardType="number-pad"
                placeholder="5"
                placeholderTextColor={DarkTheme.text.tertiary}
              />
            </View>

            <View style={styles.inputWrapper}>
              <ThemedText style={styles.label}>
                {t("onboarding", "lastPeriodDate")} ({t("common", "optional")})
              </ThemedText>
              <TextInput
                style={[styles.input, { textAlign: isRTL ? "right" : "left" }]}
                value={lastPeriodDate}
                onChangeText={setLastPeriodDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={DarkTheme.text.tertiary}
                keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "default"}
              />
            </View>

        {/* Wellness Goals (Optional) */}
        <ThemedText style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>
          {t("onboarding", "wellnessGoals")} ({t("common", "optional")})
        </ThemedText>

        <View style={styles.inputWrapper}>
          <ThemedText style={styles.label}>
            {t("wellness", "dailyWaterGoal")} ({t("wellness", "glasses")})
          </ThemedText>
          <TextInput
            style={[styles.input, { textAlign: isRTL ? "right" : "left" }]}
            value={waterGoal}
            onChangeText={setWaterGoal}
            keyboardType="number-pad"
            placeholder="8"
            placeholderTextColor={DarkTheme.text.tertiary}
          />
        </View>

        <View style={styles.inputWrapper}>
          <ThemedText style={styles.label}>
            {t("wellness", "dailySleepGoal")} ({t("wellness", "hours")})
          </ThemedText>
          <TextInput
            style={[styles.input, { textAlign: isRTL ? "right" : "left" }]}
            value={sleepGoal}
            onChangeText={setSleepGoal}
            keyboardType="number-pad"
            placeholder="8"
            placeholderTextColor={DarkTheme.text.tertiary}
          />
        </View>

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </Animated.View>
  );

  // Progress indicator
  const getProgress = () => {
    const steps = ["language", "persona", "personalData"];
    const currentIndex = steps.indexOf(step);
    const totalSteps = 3;
    return ((currentIndex + 1) / totalSteps) * 100;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${getProgress()}%` }]} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {step === "language" && renderLanguageStep()}
        {step === "persona" && renderPersonaStep()}
        {step === "personalData" && renderPersonalDataStep()}
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={[styles.bottomContainer, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
        {step !== "language" && (
          <Pressable
            style={styles.secondaryButton}
            onPress={handleBack}
          >
            <Feather 
              name={isRTL ? "chevron-right" : "chevron-left"} 
              size={20} 
              color={DarkTheme.text.primary} 
            />
            <ThemedText style={styles.secondaryButtonText}>
              {t("common", "back")}
            </ThemedText>
          </Pressable>
        )}
        
        <Pressable
          style={[
            styles.primaryButton, 
            step !== "language" && { flex: 1 },
            !canProceed() && styles.primaryButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!canProceed()}
        >
          <ThemedText style={styles.primaryButtonText}>
            {step === "personalData" ? t("common", "finish") : t("common", "next")}
          </ThemedText>
          <Feather 
            name={isRTL ? "chevron-left" : "chevron-right"} 
            size={20} 
            color="#FFFFFF" 
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.background.root,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: DarkTheme.background.elevated,
    width: "100%",
  },
  progressBar: {
    height: "100%",
    backgroundColor: PersonaColors.single.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xxxl,
  },
  stepContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 400,
  },
  formScroll: {
    width: "100%",
  },
  formContent: {
    paddingBottom: Spacing.xxxl,
  },
  
  // Typography
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: DarkTheme.text.primary,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    color: DarkTheme.text.secondary,
    textAlign: "center",
    marginBottom: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: DarkTheme.text.primary,
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: DarkTheme.text.secondary,
    marginBottom: Spacing.sm,
  },
  
  // Options
  optionsContainer: {
    width: "100%",
    gap: Spacing.md,
  },
  optionButton: {
    width: "100%",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    backgroundColor: DarkTheme.background.elevated,
    borderRadius: BorderRadius.large,
    borderWidth: 2,
    borderColor: DarkTheme.border.subtle,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionButtonActive: {
    borderColor: PersonaColors.single.primary,
    backgroundColor: `${PersonaColors.single.primary}15`,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    flex: 1,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: DarkTheme.text.primary,
  },
  optionButtonTextActive: {
    color: PersonaColors.single.primary,
  },
  optionDescription: {
    fontSize: 13,
    fontWeight: "400",
    color: DarkTheme.text.tertiary,
    marginTop: 2,
  },
  
  // Input
  inputWrapper: {
    width: "100%",
    marginBottom: Spacing.lg,
  },
  input: {
    width: "100%",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: DarkTheme.background.elevated,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    borderColor: DarkTheme.border.default,
    fontSize: 16,
    color: DarkTheme.text.primary,
  },
  
  // Bottom Buttons
  bottomContainer: {
    flexDirection: "row",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  primaryButton: {
    flex: 1,
    borderRadius: BorderRadius.large,
    backgroundColor: PersonaColors.single.primary,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  secondaryButton: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    backgroundColor: DarkTheme.background.elevated,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    borderColor: DarkTheme.border.default,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: DarkTheme.text.primary,
  },
});
