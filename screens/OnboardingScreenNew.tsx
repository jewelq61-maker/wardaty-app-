import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Dimensions,
  Platform,
  I18nManager,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";

import { useLanguage } from "../hooks/useLanguage";
import { useApp } from "../lib/AppContext";
import { Persona } from "../lib/types";
import { DarkTheme, Typography, Spacing, BorderRadius, GlassEffects } from "../constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Wardaty Official Dark Theme
const BG_BASE = "#0F0820";
const BG_ELEVATED = "#1A1330";
const BG_CARD = "#251B40";
const GLASS_BG = "rgba(37, 27, 64, 0.6)";
const GLASS_BORDER = "rgba(255, 255, 255, 0.1)";

// Persona Colors (Official)
const PERSONA_COLORS = {
  single: "#FF6B9D",
  married: "#FF8D8D",
  mother: "#A684F5",
  partner: "#7EC8E3",
};

// Persona Flower Images (Official)
const PERSONA_FLOWERS = {
  single: require("../assets/flowers/icon-single-pink.png"),
  married: require("../assets/flowers/icon-married-coral.png"),
  mother: require("../assets/flowers/icon-mother-purple.png"),
  partner: require("../assets/flowers/icon-partner-blue.png"),
};

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

export default function OnboardingScreenNew() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { language, setLanguage } = useLanguage();
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

  const [error, setError] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const isRTL = data.language === "ar";
  const personaColor = data.persona ? PERSONA_COLORS[data.persona] : "#FF6B9D";
  const personaFlower = data.persona ? PERSONA_FLOWERS[data.persona] : PERSONA_FLOWERS.single;

  // Calculate total steps (Partner skips cycle step)
  const totalSteps = data.persona === "partner" ? 5 : 6;

  // Helper: Update data
  const updateField = (field: keyof OnboardingData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  // Helper: Toggle array item
  const toggleArrayItem = (field: "beautyPreferences" | "goals", item: string) => {
    setData((prev) => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter((i) => i !== item)
        : [...prev[field], item],
    }));
  };

  // Validation
  const validateStep = (): boolean => {
    if (step === 2 && !data.persona) {
      setError(isRTL ? "الرجاء اختيار شخصية" : "Please select a persona");
      return false;
    }
    if (step === 3) {
      if (!data.email || !data.email.includes("@")) {
        setError(isRTL ? "الرجاء إدخال بريد إلكتروني صحيح" : "Please enter a valid email");
        return false;
      }
      if (!data.password || data.password.length < 6) {
        setError(isRTL ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters");
        return false;
      }
      if (data.password !== data.confirmPassword) {
        setError(isRTL ? "كلمات المرور غير متطابقة" : "Passwords do not match");
        return false;
      }
    }
    if (step === 4 && data.beautyPreferences.length === 0) {
      setError(isRTL ? "الرجاء اختيار اهتمام واحد على الأقل" : "Please select at least one interest");
      return false;
    }
    if (step === 5 && data.persona !== "partner") {
      if (!data.lastPeriodDate) {
        setError(isRTL ? "الرجاء اختيار تاريخ آخر دورة" : "Please select last period date");
        return false;
      }
      const cycleLen = parseInt(data.cycleLength);
      if (isNaN(cycleLen) || cycleLen < 21 || cycleLen > 35) {
        setError(isRTL ? "طول الدورة يجب أن يكون بين 21-35 يوم" : "Cycle length must be between 21-35 days");
        return false;
      }
    }
    if (step === 6) {
      if (!data.name.trim()) {
        setError(isRTL ? "الرجاء إدخال الاسم" : "Please enter your name");
        return false;
      }
      if (!data.ageRange) {
        setError(isRTL ? "الرجاء اختيار الفئة العمرية" : "Please select age range");
        return false;
      }
      if (data.goals.length === 0) {
        setError(isRTL ? "الرجاء اختيار هدف واحد على الأقل" : "Please select at least one goal");
        return false;
      }
    }
    return true;
  };

  // Navigation
  const handleNext = async () => {
    if (!validateStep()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Step 1: Language selection
    if (step === 1) {
      await setLanguage(data.language);
      I18nManager.forceRTL(data.language === "ar");
      setStep(2);
      return;
    }

    // Skip step 5 for Partner
    if (step === 4 && data.persona === "partner") {
      setStep(6);
      return;
    }

    // Last step: Complete onboarding
    if ((step === 5 && data.persona === "partner") || step === 6) {
      await completeOnboarding();
      return;
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Skip step 5 when going back from step 6 for Partner
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
      // Calculate cycle predictions
      let cyclePredictions = null;
      if (data.persona !== "partner" && data.lastPeriodDate) {
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

        cyclePredictions = {
          lastPeriodDate: lastPeriod.toISOString(),
          cycleLength: cycleLen,
          nextPeriodDate: nextPeriod.toISOString(),
          ovulationDate: ovulation.toISOString(),
          fertileWindowStart: fertileStart.toISOString(),
          fertileWindowEnd: fertileEnd.toISOString(),
        };
      }

      // Save to AsyncStorage
      await AsyncStorage.setItem("@wardaty_onboarding_complete", "true");
      await AsyncStorage.setItem("@wardaty_user_data", JSON.stringify({
        persona: data.persona,
        email: data.email,
        beautyPreferences: data.beautyPreferences,
        name: data.name,
        ageRange: data.ageRange,
        goals: data.goals,
        notificationsEnabled: data.notificationsEnabled,
        cyclePredictions,
      }));

      // Update AppContext
      await updateData({
        persona: data.persona,
        email: data.email,
        name: data.name,
        beautyPreferences: data.beautyPreferences,
        cyclePredictions,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Navigate to Main
      navigation.navigate("Main" as never);
    } catch (err) {
      console.error("Error completing onboarding:", err);
      setError(isRTL ? "حدث خطأ، الرجاء المحاولة مرة أخرى" : "An error occurred, please try again");
    }
  };

  // Render Steps
  const renderStep = () => {
    switch (step) {
      case 1:
        return renderStep1Language();
      case 2:
        return renderStep2Persona();
      case 3:
        return renderStep3Email();
      case 4:
        return renderStep4Beauty();
      case 5:
        return renderStep5Cycle();
      case 6:
        return renderStep6Personal();
      default:
        return null;
    }
  };

  // Step 1: Language Selection
  const renderStep1Language = () => (
    <Animated.View
      entering={FadeInDown.duration(400)}
      exiting={FadeOutUp.duration(300)}
      style={styles.stepContainer}
    >
      {/* Official Wardaty Logo */}
      <LinearGradient
        colors={["#8C64F0", "#FF5FA8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.logoGradient}
      >
        <Text style={styles.logoText}>ورديتي</Text>
        <Text style={styles.logoTextEn}>Wardaty</Text>
      </LinearGradient>

      <Text style={styles.title}>Choose Your Language</Text>
      <Text style={styles.titleAr}>اختاري لغتك</Text>

      <View style={styles.languageContainer}>
        <Pressable
          style={[
            styles.languageCard,
            data.language === "ar" && { borderColor: personaColor, backgroundColor: `${personaColor}15` },
          ]}
          onPress={() => {
            updateField("language", "ar");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={styles.languageEmoji}>🇸🇦</Text>
          <Text style={styles.languageLabel}>العربية</Text>
        </Pressable>

        <Pressable
          style={[
            styles.languageCard,
            data.language === "en" && { borderColor: personaColor, backgroundColor: `${personaColor}15` },
          ]}
          onPress={() => {
            updateField("language", "en");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={styles.languageEmoji}>🇬🇧</Text>
          <Text style={styles.languageLabel}>English</Text>
        </Pressable>
      </View>
    </Animated.View>
  );

  // Step 2: Persona Selection
  const renderStep2Persona = () => (
    <Animated.View
      entering={FadeInDown.duration(400)}
      exiting={FadeOutUp.duration(300)}
      style={styles.stepContainer}
    >
      {/* Logo with Persona Gradient */}
      <LinearGradient
        colors={data.persona ? [personaColor, personaColor] : ["#8C64F0", "#FF5FA8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.logoGradientSmall}
      >
        <Text style={styles.logoTextSmall}>{isRTL ? "ورديتي" : "Wardaty"}</Text>
      </LinearGradient>

      <Text style={[styles.title, { textAlign: isRTL ? "right" : "left" }]}>
        {isRTL ? "اختاري شخصيتك" : "Select Your Persona"}
      </Text>

      <View style={styles.personaGrid}>
        {(["single", "married", "mother", "partner"] as Persona[]).map((persona) => {
          const isSelected = data.persona === persona;
          const color = PERSONA_COLORS[persona];
          const flower = PERSONA_FLOWERS[persona];
          const labels = {
            single: { ar: "عزباء", en: "Single" },
            married: { ar: "متزوجة", en: "Married" },
            mother: { ar: "أم", en: "Mother" },
            partner: { ar: "شريك", en: "Partner" },
          };

          return (
            <Pressable
              key={persona}
              style={[
                styles.personaCard,
                isSelected && { borderColor: color, backgroundColor: `${color}15` },
              ]}
              onPress={() => {
                updateField("persona", persona);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Image source={flower} style={styles.personaFlower} />
              <Text style={[styles.personaLabel, { color: isSelected ? color : DarkTheme.text.primary }]}>
                {isRTL ? labels[persona].ar : labels[persona].en}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );

  // Step 3: Email Signup
  const renderStep3Email = () => (
    <Animated.View
      entering={FadeInDown.duration(400)}
      exiting={FadeOutUp.duration(300)}
      style={styles.stepContainer}
    >
      <Image source={personaFlower} style={styles.stepIcon} />

      <Text style={[styles.title, { textAlign: isRTL ? "right" : "left" }]}>
        {isRTL ? "إنشاء حساب" : "Create Account"}
      </Text>

      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { textAlign: isRTL ? "right" : "left" }]}>
          {isRTL ? "البريد الإلكتروني" : "Email"}
        </Text>
        <TextInput
          style={[styles.input, { textAlign: isRTL ? "right" : "left" }]}
          placeholder={isRTL ? "أدخلي بريدك الإلكتروني" : "Enter your email"}
          placeholderTextColor={DarkTheme.text.secondary}
          value={data.email}
          onChangeText={(text) => updateField("email", text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { textAlign: isRTL ? "right" : "left" }]}>
          {isRTL ? "كلمة المرور" : "Password"}
        </Text>
        <TextInput
          style={[styles.input, { textAlign: isRTL ? "right" : "left" }]}
          placeholder={isRTL ? "أدخلي كلمة المرور" : "Enter password"}
          placeholderTextColor={DarkTheme.text.secondary}
          value={data.password}
          onChangeText={(text) => updateField("password", text)}
          secureTextEntry
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { textAlign: isRTL ? "right" : "left" }]}>
          {isRTL ? "تأكيد كلمة المرور" : "Confirm Password"}
        </Text>
        <TextInput
          style={[styles.input, { textAlign: isRTL ? "right" : "left" }]}
          placeholder={isRTL ? "أعيدي إدخال كلمة المرور" : "Re-enter password"}
          placeholderTextColor={DarkTheme.text.secondary}
          value={data.confirmPassword}
          onChangeText={(text) => updateField("confirmPassword", text)}
          secureTextEntry
        />
      </View>
    </Animated.View>
  );

  // Step 4: Beauty Preferences
  const renderStep4Beauty = () => (
    <Animated.View
      entering={FadeInDown.duration(400)}
      exiting={FadeOutUp.duration(300)}
      style={styles.stepContainer}
    >
      <Image source={personaFlower} style={styles.stepIcon} />

      <Text style={[styles.title, { textAlign: isRTL ? "right" : "left" }]}>
        {isRTL ? "اهتماماتك الجمالية" : "Beauty Interests"}
      </Text>

      <Text style={[styles.subtitle, { textAlign: isRTL ? "right" : "left" }]}>
        {isRTL ? "اختاري ما يهمك" : "Select what interests you"}
      </Text>

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
                toggleArrayItem("beautyPreferences", option.id);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text style={[styles.chipText, isSelected && { color: personaColor }]}>
                {isRTL ? option.labelAr : option.labelEn}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );

  // Step 5: Cycle Details (Skip for Partner)
  const renderStep5Cycle = () => (
    <Animated.View
      entering={FadeInDown.duration(400)}
      exiting={FadeOutUp.duration(300)}
      style={styles.stepContainer}
    >
      <Image source={personaFlower} style={styles.stepIcon} />

      <Text style={[styles.title, { textAlign: isRTL ? "right" : "left" }]}>
        {isRTL ? "تفاصيل الدورة الشهرية" : "Cycle Details"}
      </Text>

      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { textAlign: isRTL ? "right" : "left" }]}>
          {isRTL ? "تاريخ آخر دورة" : "Last Period Date"}
        </Text>
        <Pressable
          style={[styles.dateButton, { flexDirection: isRTL ? "row-reverse" : "row" }]}
          onPress={() => setShowDatePicker(true)}
        >
          <Feather name="calendar" size={20} color={personaColor} />
          <Text style={styles.dateButtonText}>
            {data.lastPeriodDate
              ? data.lastPeriodDate.toLocaleDateString(isRTL ? "ar-SA" : "en-US")
              : isRTL
              ? "اختاري التاريخ"
              : "Select Date"}
          </Text>
        </Pressable>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={data.lastPeriodDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              updateField("lastPeriodDate", selectedDate);
            }
          }}
        />
      )}

      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { textAlign: isRTL ? "right" : "left" }]}>
          {isRTL ? "طول الدورة (بالأيام)" : "Cycle Length (days)"}
        </Text>
        <TextInput
          style={[styles.input, { textAlign: isRTL ? "right" : "left" }]}
          placeholder="28"
          placeholderTextColor={DarkTheme.text.secondary}
          value={data.cycleLength}
          onChangeText={(text) => updateField("cycleLength", text)}
          keyboardType="number-pad"
        />
      </View>
    </Animated.View>
  );

  // Step 6: Personal Info
  const renderStep6Personal = () => (
    <Animated.View
      entering={FadeInDown.duration(400)}
      exiting={FadeOutUp.duration(300)}
      style={styles.stepContainer}
    >
      <Image source={personaFlower} style={styles.stepIcon} />

      <Text style={[styles.title, { textAlign: isRTL ? "right" : "left" }]}>
        {isRTL ? "معلوماتك الشخصية" : "Personal Information"}
      </Text>

      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { textAlign: isRTL ? "right" : "left" }]}>
          {isRTL ? "الاسم" : "Name"}
        </Text>
        <TextInput
          style={[styles.input, { textAlign: isRTL ? "right" : "left" }]}
          placeholder={isRTL ? "أدخلي اسمك" : "Enter your name"}
          placeholderTextColor={DarkTheme.text.secondary}
          value={data.name}
          onChangeText={(text) => updateField("name", text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { textAlign: isRTL ? "right" : "left" }]}>
          {isRTL ? "الفئة العمرية" : "Age Range"}
        </Text>
        <View style={styles.ageRangeContainer}>
          {AGE_RANGES.map((range) => {
            const isSelected = data.ageRange === range.id;
            return (
              <Pressable
                key={range.id}
                style={[
                  styles.ageRangeButton,
                  isSelected && { borderColor: personaColor, backgroundColor: `${personaColor}15` },
                ]}
                onPress={() => {
                  updateField("ageRange", range.id);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Text style={[styles.ageRangeText, isSelected && { color: personaColor }]}>
                  {range.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { textAlign: isRTL ? "right" : "left" }]}>
          {isRTL ? "أهدافك الصحية" : "Health Goals"}
        </Text>
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
                  toggleArrayItem("goals", goal.id);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Text style={[styles.chipText, isSelected && { color: personaColor }]}>
                  {isRTL ? goal.labelAr : goal.labelEn}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Pressable
        style={[styles.notificationToggle, { flexDirection: isRTL ? "row-reverse" : "row" }]}
        onPress={() => {
          updateField("notificationsEnabled", !data.notificationsEnabled);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <View
          style={[
            styles.toggleSwitch,
            data.notificationsEnabled && { backgroundColor: personaColor },
          ]}
        >
          <View
            style={[
              styles.toggleThumb,
              data.notificationsEnabled && { transform: [{ translateX: 20 }] },
            ]}
          />
        </View>
        <Text style={styles.toggleLabel}>
          {isRTL ? "تفعيل الإشعارات" : "Enable Notifications"}
        </Text>
      </Pressable>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderStep()}

        {error ? (
          <Text style={[styles.errorText, { textAlign: isRTL ? "right" : "left" }]}>
            {error}
          </Text>
        ) : null}
      </ScrollView>

      {/* Progress Dots */}
      <View style={styles.progressContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index + 1 === step && { backgroundColor: personaColor },
            ]}
          />
        ))}
      </View>

      {/* Navigation Buttons */}
      <View style={[styles.buttonContainer, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
        {step > 1 && (
          <Pressable style={styles.secondaryButton} onPress={handleBack}>
            <Feather
              name={isRTL ? "arrow-right" : "arrow-left"}
              size={20}
              color={DarkTheme.text.primary}
            />
            <Text style={styles.secondaryButtonText}>
              {isRTL ? "رجوع" : "Back"}
            </Text>
          </Pressable>
        )}

        <Pressable
          style={[styles.primaryButton, { backgroundColor: personaColor, flex: step === 1 ? 1 : 0 }]}
          onPress={handleNext}
        >
          <Text style={styles.primaryButtonText}>
            {step === totalSteps
              ? isRTL
                ? "ابدأي"
                : "Start"
              : isRTL
              ? "التالي"
              : "Next"}
          </Text>
          <Feather
            name={isRTL ? "arrow-left" : "arrow-right"}
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
    backgroundColor: BG_BASE,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  stepContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoGradient: {
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.large,
    alignItems: "center",
    marginBottom: Spacing.xxl,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "Tajawal-Bold",
  },
  logoTextEn: {
    fontSize: 18,
    color: "#FFFFFF",
    marginTop: Spacing.xs,
    fontFamily: "Tajawal-Regular",
  },
  logoGradientSmall: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.xl,
  },
  logoTextSmall: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "Tajawal-Bold",
  },
  stepIcon: {
    width: 80,
    height: 80,
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.largeTitle,
    color: DarkTheme.text.primary,
    marginBottom: Spacing.md,
    width: "100%",
  },
  titleAr: {
    ...Typography.largeTitle,
    color: DarkTheme.text.primary,
    marginBottom: Spacing.xl,
    width: "100%",
    textAlign: "right",
  },
  subtitle: {
    ...Typography.body,
    color: DarkTheme.text.secondary,
    marginBottom: Spacing.lg,
    width: "100%",
  },
  languageContainer: {
    flexDirection: "row",
    gap: Spacing.md,
    width: "100%",
  },
  languageCard: {
    flex: 1,
    backgroundColor: BG_CARD,
    borderRadius: BorderRadius.large,
    padding: Spacing.xl,
    alignItems: "center",
    borderWidth: 2,
    borderColor: GLASS_BORDER,
  },
  languageEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  languageLabel: {
    ...Typography.headline,
    color: DarkTheme.text.primary,
  },
  personaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    width: "100%",
  },
  personaCard: {
    width: (SCREEN_WIDTH - Spacing.lg * 2 - Spacing.md) / 2,
    backgroundColor: BG_CARD,
    borderRadius: BorderRadius.large,
    padding: Spacing.lg,
    alignItems: "center",
    borderWidth: 2,
    borderColor: GLASS_BORDER,
  },
  personaFlower: {
    width: 64,
    height: 64,
    marginBottom: Spacing.md,
  },
  personaLabel: {
    ...Typography.callout,
    fontWeight: "600",
  },
  inputContainer: {
    width: "100%",
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    ...Typography.callout,
    color: DarkTheme.text.primary,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: BG_CARD,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    color: DarkTheme.text.primary,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    ...Typography.body,
  },
  dateButton: {
    backgroundColor: BG_CARD,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    alignItems: "center",
    gap: Spacing.sm,
  },
  dateButtonText: {
    ...Typography.body,
    color: DarkTheme.text.primary,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    width: "100%",
  },
  chip: {
    backgroundColor: BG_CARD,
    borderRadius: BorderRadius.large,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
  },
  chipText: {
    ...Typography.callout,
    color: DarkTheme.text.primary,
  },
  ageRangeContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
    flexWrap: "wrap",
  },
  ageRangeButton: {
    backgroundColor: BG_CARD,
    borderRadius: BorderRadius.medium,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
  },
  ageRangeText: {
    ...Typography.callout,
    color: DarkTheme.text.primary,
  },
  notificationToggle: {
    alignItems: "center",
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  toggleSwitch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: BG_CARD,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
  },
  toggleLabel: {
    ...Typography.callout,
    color: DarkTheme.text.primary,
  },
  errorText: {
    ...Typography.callout,
    color: "#FF6B6B",
    marginTop: Spacing.md,
    width: "100%",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BG_CARD,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    minHeight: Spacing.buttonHeight,
    borderRadius: BorderRadius.large,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  primaryButtonText: {
    ...Typography.headline,
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
