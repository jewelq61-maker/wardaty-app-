import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Dimensions,
  Platform,
  I18nManager,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import { ThemedText } from "../components/ThemedText";
import { PersonaSelector } from "../components/PersonaSelector";
import { useLanguage } from "../hooks/useLanguage";
import { useApp } from "../lib/AppContext";
import { Persona } from "../lib/types";
import {
  DarkTheme,
  PersonaColors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../constants/theme";

const { width } = Dimensions.get("window");

// Persona colors
const PERSONA_COLORS = {
  single: "#FF6B9D",
  married: "#FF8D8D",
  mother: "#A684F5",
  partner: "#7EC8E3",
};

// Dark glass theme colors
const GLASS_BG = "rgba(37, 27, 64, 0.6)";
const GLASS_BORDER = "rgba(255, 255, 255, 0.1)";
const BG_ROOT = "#0F0820";
const BG_ELEVATED = "#1A1330";
const BG_CARD = "#251B40";

interface OnboardingData {
  language: "ar" | "en";
  persona: Persona | null;
  email: string;
  password: string;
  confirmPassword: string;
  beautyPreferences: string[];
  lastPeriodDate: Date | null;
  cycleLength: string;
  name: string;
  ageRange: string;
  goals: string[];
  notificationsEnabled: boolean;
}

const BEAUTY_OPTIONS = [
  { id: "skincare", labelAr: "العناية بالبشرة", labelEn: "Skincare" },
  { id: "hair", labelAr: "العناية بالشعر", labelEn: "Hair Care" },
  { id: "nails", labelAr: "العناية بالأظافر", labelEn: "Nail Care" },
  { id: "makeup", labelAr: "المكياج", labelEn: "Makeup" },
  { id: "fragrance", labelAr: "العطور", labelEn: "Fragrance" },
  { id: "wellness", labelAr: "العافية", labelEn: "Wellness" },
];

const AGE_RANGES = [
  { id: "18-24", label: "18-24" },
  { id: "25-34", label: "25-34" },
  { id: "35-44", label: "35-44" },
  { id: "45+", label: "45+" },
];

const GOAL_OPTIONS = [
  { id: "track_cycle", labelAr: "تتبع الدورة", labelEn: "Track Cycle" },
  { id: "conceive", labelAr: "الحمل", labelEn: "Conceive" },
  { id: "avoid_pregnancy", labelAr: "تجنب الحمل", labelEn: "Avoid Pregnancy" },
  { id: "health", labelAr: "الصحة العامة", labelEn: "General Health" },
  { id: "beauty", labelAr: "الجمال", labelEn: "Beauty & Wellness" },
];

export function OnboardingScreenNew() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { t, language, setLanguage } = useLanguage();
  const { updateData } = useApp();

  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    language: "ar",
    persona: null,
    email: "",
    password: "",
    confirmPassword: "",
    beautyPreferences: [],
    lastPeriodDate: null,
    cycleLength: "28",
    name: "",
    ageRange: "",
    goals: [],
    notificationsEnabled: true,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isRTL = data.language === "ar";
  const personaColor = data.persona ? PERSONA_COLORS[data.persona] : PERSONA_COLORS.single;

  // Calculate cycle predictions
  const calculateCyclePredictions = () => {
    if (!data.lastPeriodDate || !data.cycleLength) return null;

    const cycleLen = parseInt(data.cycleLength);
    const lastPeriod = new Date(data.lastPeriodDate);
    
    const nextPeriod = new Date(lastPeriod);
    nextPeriod.setDate(nextPeriod.getDate() + cycleLen);
    
    const ovulation = new Date(nextPeriod);
    ovulation.setDate(ovulation.getDate() - 14);
    
    const fertileStart = new Date(ovulation);
    fertileStart.setDate(fertileStart.getDate() - 5);
    
    const fertileEnd = new Date(ovulation);
    fertileEnd.setDate(fertileEnd.getDate() + 1);

    return { nextPeriod, ovulation, fertileStart, fertileEnd };
  };

  // Validation
  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 2 && !data.persona) {
      newErrors.persona = isRTL ? "اختاري الشخصية" : "Select a persona";
    }

    if (step === 3) {
      if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
        newErrors.email = isRTL ? "بريد إلكتروني غير صالح" : "Invalid email";
      }
      if (!data.password || data.password.length < 6) {
        newErrors.password = isRTL ? "كلمة المرور قصيرة جداً" : "Password too short";
      }
      if (data.password !== data.confirmPassword) {
        newErrors.confirmPassword = isRTL ? "كلمات المرور غير متطابقة" : "Passwords don't match";
      }
    }

    if (step === 5 && data.persona !== "partner") {
      if (!data.lastPeriodDate) {
        newErrors.lastPeriodDate = isRTL ? "اختاري تاريخ آخر دورة" : "Select last period date";
      }
      if (!data.cycleLength || parseInt(data.cycleLength) < 21 || parseInt(data.cycleLength) > 35) {
        newErrors.cycleLength = isRTL ? "طول الدورة يجب أن يكون بين 21-35 يوماً" : "Cycle length must be 21-35 days";
      }
    }

    if (step === 6) {
      if (!data.name.trim()) {
        newErrors.name = isRTL ? "أدخلي اسمك" : "Enter your name";
      }
      if (!data.ageRange) {
        newErrors.ageRange = isRTL ? "اختاري الفئة العمرية" : "Select age range";
      }
      if (data.goals.length === 0) {
        newErrors.goals = isRTL ? "اختاري هدفاً واحداً على الأقل" : "Select at least one goal";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Skip cycle details for Partner persona
    if (step === 4 && data.persona === "partner") {
      setStep(6);
      return;
    }

    if (step < 6) {
      setStep(step + 1);
    } else {
      await completeOnboarding();
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Skip cycle details when going back from step 6 if Partner
    if (step === 6 && data.persona === "partner") {
      setStep(4);
      return;
    }

    if (step > 1) {
      setStep(step - 1);
    }
  };

  const completeOnboarding = async () => {
    try {
      const predictions = data.persona !== "partner" ? calculateCyclePredictions() : null;

      const appData = {
        settings: {
          language: data.language,
          persona: data.persona!,
          notificationsEnabled: data.notificationsEnabled,
        },
        user: {
          email: data.email,
          name: data.name,
          ageRange: data.ageRange,
          goals: data.goals,
          beautyPreferences: data.beautyPreferences,
        },
        cycle: data.persona !== "partner" && predictions ? {
          lastPeriodDate: data.lastPeriodDate!.toISOString(),
          cycleLength: parseInt(data.cycleLength),
          nextPeriodDate: predictions.nextPeriod.toISOString(),
          ovulationDate: predictions.ovulation.toISOString(),
          fertileWindowStart: predictions.fertileStart.toISOString(),
          fertileWindowEnd: predictions.fertileEnd.toISOString(),
        } : null,
      };

      await AsyncStorage.setItem("onboardingComplete", "true");
      await AsyncStorage.setItem("appData", JSON.stringify(appData));
      
      await setLanguage(data.language);
      await updateData(appData);

      // Apply RTL if Arabic
      if (data.language === "ar" && !I18nManager.isRTL) {
        I18nManager.forceRTL(true);
        // Note: App restart required for RTL to take full effect
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Navigate to main app
      (navigation as any).reset({
        index: 0,
        routes: [{ name: "Main" }],
      });
    } catch (error) {
      console.error("Onboarding completion error:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const toggleBeautyPreference = (id: string) => {
    setData(prev => ({
      ...prev,
      beautyPreferences: prev.beautyPreferences.includes(id)
        ? prev.beautyPreferences.filter(p => p !== id)
        : [...prev.beautyPreferences, id],
    }));
  };

  const toggleGoal = (id: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.includes(id)
        ? prev.goals.filter(g => g !== id)
        : [...prev.goals, id],
    }));
  };

  // Step 1: Language Selection
  const renderLanguageStep = () => (
    <Animated.View
      entering={FadeInDown.duration(400)}
      exiting={FadeOutUp.duration(300)}
      style={styles.stepContainer}
    >
      <Feather name="globe" size={64} color={personaColor} style={{ marginBottom: Spacing.xl }} />
      
      <ThemedText style={[styles.title, { textAlign: "center" }]}>
        {isRTL ? "اختاري اللغة" : "Choose Language"}
      </ThemedText>
      
      <ThemedText style={[styles.subtitle, { textAlign: "center" }]}>
        {isRTL ? "اختاري لغتك المفضلة" : "Select your preferred language"}
      </ThemedText>

      <View style={styles.optionsContainer}>
        <Pressable
          style={[
            styles.languageOption,
            data.language === "ar" && { borderColor: personaColor, backgroundColor: `${personaColor}15` },
          ]}
          onPress={() => {
            setData(prev => ({ ...prev, language: "ar" }));
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <ThemedText style={[styles.languageText, data.language === "ar" && { color: personaColor }]}>
            العربية
          </ThemedText>
          {data.language === "ar" && <Feather name="check-circle" size={24} color={personaColor} />}
        </Pressable>

        <Pressable
          style={[
            styles.languageOption,
            data.language === "en" && { borderColor: personaColor, backgroundColor: `${personaColor}15` },
          ]}
          onPress={() => {
            setData(prev => ({ ...prev, language: "en" }));
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <ThemedText style={[styles.languageText, data.language === "en" && { color: personaColor }]}>
            English
          </ThemedText>
          {data.language === "en" && <Feather name="check-circle" size={24} color={personaColor} />}
        </Pressable>
      </View>
    </Animated.View>
  );

  // Step 2: Persona Selection
  const renderPersonaStep = () => (
    <Animated.View
      entering={FadeInDown.duration(400)}
      exiting={FadeOutUp.duration(300)}
      style={styles.stepContainer}
    >
      <Feather name="star" size={64} color={personaColor} style={{ marginBottom: Spacing.xl }} />
      
      <ThemedText style={[styles.title, { textAlign: isRTL ? "right" : "left" }]}>
        {isRTL ? "اختاري شخصيتك" : "Select Your Persona"}
      </ThemedText>
      
      <ThemedText style={[styles.subtitle, { textAlign: isRTL ? "right" : "left" }]}>
        {isRTL ? "اختاري الشخصية التي تناسبك" : "Choose the persona that fits you"}
      </ThemedText>

      {errors.persona && (
        <ThemedText style={styles.errorText}>{errors.persona}</ThemedText>
      )}

      <PersonaSelector
        selectedPersona={data.persona}
        onSelect={(persona) => {
          setData(prev => ({ ...prev, persona }));
          setErrors(prev => ({ ...prev, persona: "" }));
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }}
      />
    </Animated.View>
  );

  // Step 3: Email Signup
  const renderEmailStep = () => (
    <Animated.View
      entering={FadeInDown.duration(400)}
      exiting={FadeOutUp.duration(300)}
      style={styles.stepContainer}
    >
      <Feather name="mail" size={64} color={personaColor} style={{ marginBottom: Spacing.xl }} />
      
      <ThemedText style={[styles.title, { textAlign: isRTL ? "right" : "left" }]}>
        {isRTL ? "إنشاء حساب" : "Create Account"}
      </ThemedText>
      
      <ThemedText style={[styles.subtitle, { textAlign: isRTL ? "right" : "left" }]}>
        {isRTL ? "أدخلي بريدك الإلكتروني وكلمة المرور" : "Enter your email and password"}
      </ThemedText>

      <View style={styles.inputsContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, { textAlign: isRTL ? "right" : "left" }, errors.email && styles.inputError]}
            placeholder={isRTL ? "البريد الإلكتروني" : "Email"}
            placeholderTextColor={DarkTheme.text.tertiary}
            value={data.email}
            onChangeText={(text) => {
              setData(prev => ({ ...prev, email: text }));
              setErrors(prev => ({ ...prev, email: "" }));
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {errors.email && <ThemedText style={styles.errorText}>{errors.email}</ThemedText>}
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, { textAlign: isRTL ? "right" : "left" }, errors.password && styles.inputError]}
            placeholder={isRTL ? "كلمة المرور" : "Password"}
            placeholderTextColor={DarkTheme.text.tertiary}
            value={data.password}
            onChangeText={(text) => {
              setData(prev => ({ ...prev, password: text }));
              setErrors(prev => ({ ...prev, password: "" }));
            }}
            secureTextEntry
            autoCapitalize="none"
          />
          {errors.password && <ThemedText style={styles.errorText}>{errors.password}</ThemedText>}
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, { textAlign: isRTL ? "right" : "left" }, errors.confirmPassword && styles.inputError]}
            placeholder={isRTL ? "تأكيد كلمة المرور" : "Confirm Password"}
            placeholderTextColor={DarkTheme.text.tertiary}
            value={data.confirmPassword}
            onChangeText={(text) => {
              setData(prev => ({ ...prev, confirmPassword: text }));
              setErrors(prev => ({ ...prev, confirmPassword: "" }));
            }}
            secureTextEntry
            autoCapitalize="none"
          />
          {errors.confirmPassword && <ThemedText style={styles.errorText}>{errors.confirmPassword}</ThemedText>}
        </View>
      </View>
    </Animated.View>
  );

  // Step 4: Beauty Preferences
  const renderBeautyStep = () => (
    <Animated.View
      entering={FadeInDown.duration(400)}
      exiting={FadeOutUp.duration(300)}
      style={styles.stepContainer}
    >
      <Feather name="heart" size={64} color={personaColor} style={{ marginBottom: Spacing.xl }} />
      
      <ThemedText style={[styles.title, { textAlign: isRTL ? "right" : "left" }]}>
        {isRTL ? "اهتماماتك الجمالية" : "Beauty Interests"}
      </ThemedText>
      
      <ThemedText style={[styles.subtitle, { textAlign: isRTL ? "right" : "left" }]}>
        {isRTL ? "اختاري ما يهمك" : "Select what interests you"}
      </ThemedText>

      <View style={styles.chipsContainer}>
        {BEAUTY_OPTIONS.map((option) => {
          const isSelected = data.beautyPreferences.includes(option.id);
          return (
            <Pressable
              key={option.id}
              style={[
                styles.chip,
                isSelected && { borderColor: personaColor, backgroundColor: `${personaColor}15` },
              ]}
              onPress={() => {
                toggleBeautyPreference(option.id);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <ThemedText style={[styles.chipText, isSelected && { color: personaColor }]}>
                {isRTL ? option.labelAr : option.labelEn}
              </ThemedText>
              {isSelected && <Feather name="check" size={16} color={personaColor} style={{ marginStart: 4 }} />}
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );

  // Step 5: Cycle Details (skip for Partner)
  const renderCycleStep = () => {
    const predictions = calculateCyclePredictions();

    return (
      <Animated.View
        entering={FadeInDown.duration(400)}
        exiting={FadeOutUp.duration(300)}
        style={styles.stepContainer}
      >
        <Feather name="calendar" size={64} color={personaColor} style={{ marginBottom: Spacing.xl }} />
        
        <ThemedText style={[styles.title, { textAlign: isRTL ? "right" : "left" }]}>
          {isRTL ? "تفاصيل الدورة" : "Cycle Details"}
        </ThemedText>
        
        <ThemedText style={[styles.subtitle, { textAlign: isRTL ? "right" : "left" }]}>
          {isRTL ? "أدخلي معلومات دورتك الشهرية" : "Enter your menstrual cycle information"}
        </ThemedText>

        <View style={styles.inputsContainer}>
          <View style={styles.inputWrapper}>
            <ThemedText style={[styles.label, { textAlign: isRTL ? "right" : "left" }]}>
              {isRTL ? "تاريخ آخر دورة" : "Last Period Date"}
            </ThemedText>
            <Pressable
              style={[styles.dateButton, errors.lastPeriodDate && styles.inputError]}
              onPress={() => {
                setShowDatePicker(true);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <ThemedText style={styles.dateButtonText}>
                {data.lastPeriodDate
                  ? data.lastPeriodDate.toLocaleDateString(isRTL ? "ar-SA" : "en-US")
                  : (isRTL ? "اختاري التاريخ" : "Select Date")}
              </ThemedText>
              <Feather name="calendar" size={20} color={DarkTheme.text.secondary} />
            </Pressable>
            {errors.lastPeriodDate && <ThemedText style={styles.errorText}>{errors.lastPeriodDate}</ThemedText>}
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={data.lastPeriodDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setData(prev => ({ ...prev, lastPeriodDate: selectedDate }));
                  setErrors(prev => ({ ...prev, lastPeriodDate: "" }));
                }
              }}
              maximumDate={new Date()}
            />
          )}

          <View style={styles.inputWrapper}>
            <ThemedText style={[styles.label, { textAlign: isRTL ? "right" : "left" }]}>
              {isRTL ? "طول الدورة (بالأيام)" : "Cycle Length (days)"}
            </ThemedText>
            <TextInput
              style={[styles.input, { textAlign: isRTL ? "right" : "left" }, errors.cycleLength && styles.inputError]}
              placeholder="28"
              placeholderTextColor={DarkTheme.text.tertiary}
              value={data.cycleLength}
              onChangeText={(text) => {
                setData(prev => ({ ...prev, cycleLength: text }));
                setErrors(prev => ({ ...prev, cycleLength: "" }));
              }}
              keyboardType="number-pad"
              maxLength={2}
            />
            {errors.cycleLength && <ThemedText style={styles.errorText}>{errors.cycleLength}</ThemedText>}
          </View>

          {predictions && (
            <View style={styles.predictionsCard}>
              <ThemedText style={[styles.predictionsTitle, { textAlign: isRTL ? "right" : "left" }]}>
                {isRTL ? "التوقعات" : "Predictions"}
              </ThemedText>
              
              <View style={styles.predictionRow}>
                <Feather name="circle" size={12} color={personaColor} />
                <ThemedText style={styles.predictionLabel}>
                  {isRTL ? "الدورة القادمة:" : "Next Period:"}
                </ThemedText>
                <ThemedText style={styles.predictionValue}>
                  {predictions.nextPeriod.toLocaleDateString(isRTL ? "ar-SA" : "en-US")}
                </ThemedText>
              </View>

              <View style={styles.predictionRow}>
                <Feather name="circle" size={12} color={personaColor} />
                <ThemedText style={styles.predictionLabel}>
                  {isRTL ? "الإباضة:" : "Ovulation:"}
                </ThemedText>
                <ThemedText style={styles.predictionValue}>
                  {predictions.ovulation.toLocaleDateString(isRTL ? "ar-SA" : "en-US")}
                </ThemedText>
              </View>

              <View style={styles.predictionRow}>
                <Feather name="circle" size={12} color={personaColor} />
                <ThemedText style={styles.predictionLabel}>
                  {isRTL ? "فترة الخصوبة:" : "Fertile Window:"}
                </ThemedText>
                <ThemedText style={styles.predictionValue}>
                  {predictions.fertileStart.toLocaleDateString(isRTL ? "ar-SA" : "en-US")} - {predictions.fertileEnd.toLocaleDateString(isRTL ? "ar-SA" : "en-US")}
                </ThemedText>
              </View>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  // Step 6: Personal Info
  const renderPersonalInfoStep = () => (
    <Animated.View
      entering={FadeInDown.duration(400)}
      exiting={FadeOutUp.duration(300)}
      style={styles.stepContainer}
    >
      <Feather name="user" size={64} color={personaColor} style={{ marginBottom: Spacing.xl }} />
      
      <ThemedText style={[styles.title, { textAlign: isRTL ? "right" : "left" }]}>
        {isRTL ? "معلوماتك الشخصية" : "Personal Information"}
      </ThemedText>
      
      <ThemedText style={[styles.subtitle, { textAlign: isRTL ? "right" : "left" }]}>
        {isRTL ? "أخبرينا المزيد عنك" : "Tell us more about you"}
      </ThemedText>

      <View style={styles.inputsContainer}>
        <View style={styles.inputWrapper}>
          <ThemedText style={[styles.label, { textAlign: isRTL ? "right" : "left" }]}>
            {isRTL ? "الاسم" : "Name"}
          </ThemedText>
          <TextInput
            style={[styles.input, { textAlign: isRTL ? "right" : "left" }, errors.name && styles.inputError]}
            placeholder={isRTL ? "أدخلي اسمك" : "Enter your name"}
            placeholderTextColor={DarkTheme.text.tertiary}
            value={data.name}
            onChangeText={(text) => {
              setData(prev => ({ ...prev, name: text }));
              setErrors(prev => ({ ...prev, name: "" }));
            }}
          />
          {errors.name && <ThemedText style={styles.errorText}>{errors.name}</ThemedText>}
        </View>

        <View style={styles.inputWrapper}>
          <ThemedText style={[styles.label, { textAlign: isRTL ? "right" : "left" }]}>
            {isRTL ? "الفئة العمرية" : "Age Range"}
          </ThemedText>
          <View style={styles.chipsContainer}>
            {AGE_RANGES.map((range) => {
              const isSelected = data.ageRange === range.id;
              return (
                <Pressable
                  key={range.id}
                  style={[
                    styles.chip,
                    isSelected && { borderColor: personaColor, backgroundColor: `${personaColor}15` },
                  ]}
                  onPress={() => {
                    setData(prev => ({ ...prev, ageRange: range.id }));
                    setErrors(prev => ({ ...prev, ageRange: "" }));
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <ThemedText style={[styles.chipText, isSelected && { color: personaColor }]}>
                    {range.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
          {errors.ageRange && <ThemedText style={styles.errorText}>{errors.ageRange}</ThemedText>}
        </View>

        <View style={styles.inputWrapper}>
          <ThemedText style={[styles.label, { textAlign: isRTL ? "right" : "left" }]}>
            {isRTL ? "أهدافك" : "Your Goals"}
          </ThemedText>
          <View style={styles.chipsContainer}>
            {GOAL_OPTIONS.map((goal) => {
              const isSelected = data.goals.includes(goal.id);
              return (
                <Pressable
                  key={goal.id}
                  style={[
                    styles.chip,
                    isSelected && { borderColor: personaColor, backgroundColor: `${personaColor}15` },
                  ]}
                  onPress={() => {
                    toggleGoal(goal.id);
                    setErrors(prev => ({ ...prev, goals: "" }));
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <ThemedText style={[styles.chipText, isSelected && { color: personaColor }]}>
                    {isRTL ? goal.labelAr : goal.labelEn}
                  </ThemedText>
                  {isSelected && <Feather name="check" size={16} color={personaColor} style={{ marginStart: 4 }} />}
                </Pressable>
              );
            })}
          </View>
          {errors.goals && <ThemedText style={styles.errorText}>{errors.goals}</ThemedText>}
        </View>

        <Pressable
          style={styles.notificationToggle}
          onPress={() => {
            setData(prev => ({ ...prev, notificationsEnabled: !prev.notificationsEnabled }));
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <View style={[styles.checkbox, data.notificationsEnabled && { backgroundColor: personaColor, borderColor: personaColor }]}>
            {data.notificationsEnabled && <Feather name="check" size={16} color="#FFFFFF" />}
          </View>
          <ThemedText style={styles.notificationText}>
            {isRTL ? "تفعيل الإشعارات" : "Enable Notifications"}
          </ThemedText>
        </Pressable>
      </View>
    </Animated.View>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return renderLanguageStep();
      case 2:
        return renderPersonaStep();
      case 3:
        return renderEmailStep();
      case 4:
        return renderBeautyStep();
      case 5:
        return renderCycleStep();
      case 6:
        return renderPersonalInfoStep();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xxl + 80,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <View
              key={s}
              style={[
                styles.progressDot,
                s <= step && { backgroundColor: personaColor },
                s === step && { transform: [{ scale: 1.2 }] },
              ]}
            />
          ))}
        </View>

        {renderStep()}
      </ScrollView>

      {/* Bottom Buttons */}
      <View
        style={[
          styles.bottomButtons,
          {
            paddingBottom: insets.bottom + Spacing.md,
            flexDirection: isRTL ? "row-reverse" : "row",
          },
        ]}
      >
        {step > 1 && (
          <Pressable
            style={[styles.secondaryButton, { flex: 1, marginEnd: Spacing.sm }]}
            onPress={handleBack}
          >
            <Feather name={isRTL ? "arrow-right" : "arrow-left"} size={20} color={DarkTheme.text.primary} />
            <ThemedText style={styles.secondaryButtonText}>
              {isRTL ? "السابق" : "Back"}
            </ThemedText>
          </Pressable>
        )}

        <Pressable
          style={[
            styles.primaryButton,
            { flex: 1, backgroundColor: personaColor },
            step === 1 && { flex: 1 },
          ]}
          onPress={handleNext}
        >
          <ThemedText style={styles.primaryButtonText}>
            {step === 6 ? (isRTL ? "إنهاء" : "Finish") : (isRTL ? "التالي" : "Next")}
          </ThemedText>
          <Feather name={isRTL ? "arrow-left" : "arrow-right"} size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_ROOT,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenPadding,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: DarkTheme.border.subtle,
  },
  stepContainer: {
    alignItems: "center",
    width: "100%",
  },
  title: {
    ...Typography.title1,
    color: DarkTheme.text.primary,
    marginBottom: Spacing.xs,
    width: "100%",
  },
  subtitle: {
    ...Typography.callout,
    color: DarkTheme.text.secondary,
    marginBottom: Spacing.xl,
    width: "100%",
  },
  optionsContainer: {
    width: "100%",
    gap: Spacing.md,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    backgroundColor: BG_CARD,
    borderRadius: BorderRadius.large,
    borderWidth: 2,
    borderColor: GLASS_BORDER,
    minHeight: Spacing.listItemHeight,
  },
  languageText: {
    ...Typography.headline,
    color: DarkTheme.text.primary,
  },
  inputsContainer: {
    width: "100%",
    gap: Spacing.lg,
  },
  inputWrapper: {
    width: "100%",
  },
  label: {
    ...Typography.callout,
    color: DarkTheme.text.secondary,
    marginBottom: Spacing.xs,
  },
  input: {
    backgroundColor: BG_CARD,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    padding: Spacing.md,
    minHeight: Spacing.listItemHeight,
    ...Typography.callout,
    color: DarkTheme.text.primary,
  },
  inputError: {
    borderColor: "#FF5252",
  },
  errorText: {
    ...Typography.caption1,
    color: "#FF5252",
    marginTop: Spacing.xxxs,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: BG_CARD,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
  },
  chipText: {
    ...Typography.callout,
    color: DarkTheme.text.primary,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: BG_CARD,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    padding: Spacing.md,
    minHeight: Spacing.listItemHeight,
  },
  dateButtonText: {
    ...Typography.callout,
    color: DarkTheme.text.primary,
  },
  predictionsCard: {
    backgroundColor: BG_ELEVATED,
    borderRadius: BorderRadius.large,
    padding: Spacing.lg,
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  predictionsTitle: {
    ...Typography.headline,
    color: DarkTheme.text.primary,
    marginBottom: Spacing.xs,
  },
  predictionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  predictionLabel: {
    ...Typography.callout,
    color: DarkTheme.text.secondary,
    flex: 1,
  },
  predictionValue: {
    ...Typography.callout,
    color: DarkTheme.text.primary,
  },
  notificationToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: GLASS_BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationText: {
    ...Typography.callout,
    color: DarkTheme.text.primary,
  },
  bottomButtons: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.md,
    backgroundColor: BG_ROOT,
    borderTopWidth: 1,
    borderTopColor: GLASS_BORDER,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    minHeight: Spacing.buttonHeight,
    borderRadius: BorderRadius.large,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    ...Shadows.small,
  },
  primaryButtonText: {
    ...Typography.callout,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    minHeight: Spacing.buttonHeight,
    borderRadius: BorderRadius.large,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: BG_CARD,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
  },
  secondaryButtonText: {
    ...Typography.callout,
    color: DarkTheme.text.primary,
    fontWeight: "600",
  },
});
