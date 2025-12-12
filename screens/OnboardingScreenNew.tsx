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

const { width } = Dimensions.get("window");

// ===================================
// THEME CONSTANTS
// ===================================

const BG_ROOT = "#0F0820";
const BG_ELEVATED = "#1A1330";
const BG_CARD = "#251B40";
const GLASS_BG = "rgba(37, 27, 64, 0.6)";
const GLASS_BORDER = "rgba(255, 255, 255, 0.1)";
const TEXT_PRIMARY = "#FFFFFF";
const TEXT_SECONDARY = "rgba(255, 255, 255, 0.7)";
const TEXT_TERTIARY = "rgba(255, 255, 255, 0.5)";

const PERSONA_COLORS = {
  single: "#FF6B9D",
  married: "#FF8D8D",
  mother: "#A684F5",
  partner: "#7EC8E3",
};

const PERSONA_GRADIENTS = {
  single: ["#FF6B9D", "#FF8BC0"],
  married: ["#FF8D8D", "#FFB8A8"],
  mother: ["#A684F5", "#C4A8FF"],
  partner: ["#7EC8E3", "#A0D9ED"],
};

const SPACING = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 44,
};

const BORDER_RADIUS = {
  small: 8,
  medium: 12,
  large: 16,
  xlarge: 24,
};

// ===================================
// TYPES
// ===================================

interface OnboardingData {
  language: "ar" | "en";
  persona: Persona | null;
  email: string;
  password: string;
  beautyPreferences: string[];
  lastPeriodDate: Date | null;
  cycleLength: number;
  name: string;
  ageRange: string;
  goals: string[];
  notificationsEnabled: boolean;
}

// ===================================
// MAIN COMPONENT
// ===================================

export default function OnboardingScreenNew() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { setLanguage } = useLanguage();
  const { updateData } = useApp();

  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    language: "en",
    persona: null,
    email: "",
    password: "",
    beautyPreferences: [],
    lastPeriodDate: null,
    cycleLength: 28,
    name: "",
    ageRange: "",
    goals: [],
    notificationsEnabled: true,
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  const isRTL = data.language === "ar";
  const personaColor = data.persona ? PERSONA_COLORS[data.persona] : "#8C64F0";

  // ===================================
  // TRANSLATIONS
  // ===================================

  const t = (key: string): string => {
    const translations: Record<string, { ar: string; en: string }> = {
      // Step 1
      selectLanguage: { ar: "اختر اللغة", en: "Select Language" },
      choosePreferred: { ar: "اختر لغتك المفضلة", en: "Choose your preferred language" },
      
      // Step 2
      selectPersona: { ar: "اختر شخصيتك", en: "Select Your Persona" },
      whoAreYou: { ar: "من أنت؟", en: "Who are you?" },
      single: { ar: "عزباء", en: "Single" },
      married: { ar: "متزوجة", en: "Married" },
      mother: { ar: "أم", en: "Mother" },
      partner: { ar: "شريك", en: "Partner" },
      
      // Step 3
      createAccount: { ar: "إنشاء حساب", en: "Create Account" },
      enterDetails: { ar: "أدخل بياناتك", en: "Enter your details" },
      email: { ar: "البريد الإلكتروني", en: "Email" },
      password: { ar: "كلمة المرور", en: "Password" },
      confirmPassword: { ar: "تأكيد كلمة المرور", en: "Confirm Password" },
      
      // Step 4
      beautyPreferences: { ar: "اهتماماتك", en: "Beauty Preferences" },
      selectInterests: { ar: "اختر اهتماماتك", en: "Select your interests" },
      skincare: { ar: "العناية بالبشرة", en: "Skincare" },
      hairCare: { ar: "العناية بالشعر", en: "Hair Care" },
      nailCare: { ar: "العناية بالأظافر", en: "Nail Care" },
      makeup: { ar: "المكياج", en: "Makeup" },
      fragrance: { ar: "العطور", en: "Fragrance" },
      wellness: { ar: "العافية", en: "Wellness" },
      
      // Step 5
      cycleDetails: { ar: "تفاصيل الدورة", en: "Cycle Details" },
      trackCycle: { ar: "تتبع دورتك الشهرية", en: "Track your menstrual cycle" },
      lastPeriod: { ar: "آخر دورة شهرية", en: "Last Period Date" },
      cycleLength: { ar: "طول الدورة (أيام)", en: "Cycle Length (days)" },
      selectDate: { ar: "اختر التاريخ", en: "Select Date" },
      
      // Step 6
      personalInfo: { ar: "معلوماتك الشخصية", en: "Personal Information" },
      tellUsAbout: { ar: "أخبرنا عنك", en: "Tell us about yourself" },
      name: { ar: "الاسم", en: "Name" },
      ageRange: { ar: "الفئة العمرية", en: "Age Range" },
      goals: { ar: "أهدافك", en: "Your Goals" },
      trackCycleGoal: { ar: "تتبع الدورة", en: "Track Cycle" },
      conceive: { ar: "الحمل", en: "Conceive" },
      avoidPregnancy: { ar: "تجنب الحمل", en: "Avoid Pregnancy" },
      generalHealth: { ar: "الصحة العامة", en: "General Health" },
      beautyWellness: { ar: "الجمال والعافية", en: "Beauty & Wellness" },
      notifications: { ar: "تفعيل الإشعارات", en: "Enable Notifications" },
      
      // Navigation
      next: { ar: "التالي", en: "Next" },
      back: { ar: "رجوع", en: "Back" },
      finish: { ar: "إنهاء", en: "Finish" },
    };

    return translations[key]?.[data.language] || key;
  };

  // ===================================
  // VALIDATION
  // ===================================

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 2 && !data.persona) {
      newErrors.persona = "Please select a persona";
      setErrors(newErrors);
      return false;
    }

    if (currentStep === 3) {
      if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
        newErrors.email = "Invalid email";
      }
      if (!data.password || data.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
      if (data.password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return false;
      }
    }

    if (currentStep === 4 && data.beautyPreferences.length === 0) {
      newErrors.beautyPreferences = "Select at least one preference";
      setErrors(newErrors);
      return false;
    }

    if (currentStep === 5 && data.persona !== "partner") {
      if (!data.lastPeriodDate) {
        newErrors.lastPeriodDate = "Please select last period date";
      }
      if (data.cycleLength < 21 || data.cycleLength > 35) {
        newErrors.cycleLength = "Cycle length must be between 21-35 days";
      }
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return false;
      }
    }

    if (currentStep === 6) {
      if (!data.name.trim()) {
        newErrors.name = "Name is required";
      }
      if (!data.ageRange) {
        newErrors.ageRange = "Please select age range";
      }
      if (data.goals.length === 0) {
        newErrors.goals = "Select at least one goal";
      }
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return false;
      }
    }

    setErrors({});
    return true;
  };

  // ===================================
  // CYCLE CALCULATIONS
  // ===================================

  const calculateCycleDates = () => {
    if (!data.lastPeriodDate) return null;

    const lastPeriod = new Date(data.lastPeriodDate);
    const cycleLength = data.cycleLength;

    const nextPeriod = new Date(lastPeriod);
    nextPeriod.setDate(nextPeriod.getDate() + cycleLength);

    const ovulation = new Date(nextPeriod);
    ovulation.setDate(ovulation.getDate() - 14);

    const fertileStart = new Date(ovulation);
    fertileStart.setDate(fertileStart.getDate() - 5);

    const fertileEnd = new Date(ovulation);
    fertileEnd.setDate(fertileEnd.getDate() + 1);

    return {
      nextPeriodDate: nextPeriod.toISOString(),
      ovulationDate: ovulation.toISOString(),
      fertileWindowStart: fertileStart.toISOString(),
      fertileWindowEnd: fertileEnd.toISOString(),
    };
  };

  // ===================================
  // NAVIGATION
  // ===================================

  const handleNext = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (!validateStep()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    // Step 1: Language selection
    if (currentStep === 1) {
      await setLanguage(data.language);
      if (data.language === "ar") {
        I18nManager.forceRTL(true);
      } else {
        I18nManager.forceRTL(false);
      }
      setCurrentStep(2);
      return;
    }

    // Skip step 5 for partner
    if (currentStep === 4 && data.persona === "partner") {
      setCurrentStep(6);
      return;
    }

    // Last step: Save and navigate
    if (currentStep === 6) {
      await handleFinish();
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Skip step 5 for partner when going back
    if (currentStep === 6 && data.persona === "partner") {
      setCurrentStep(4);
      return;
    }

    setCurrentStep(currentStep - 1);
  };

  const handleFinish = async () => {
    try {
      const cycleDates = data.persona !== "partner" ? calculateCycleDates() : null;

      const appData = {
        settings: {
          language: data.language,
          persona: data.persona,
          notificationsEnabled: data.notificationsEnabled,
        },
        user: {
          email: data.email,
          name: data.name,
          ageRange: data.ageRange,
          goals: data.goals,
          beautyPreferences: data.beautyPreferences,
        },
        cycle: cycleDates ? {
          lastPeriodDate: data.lastPeriodDate?.toISOString(),
          cycleLength: data.cycleLength,
          ...cycleDates,
        } : null,
      };

      await AsyncStorage.setItem("@wardaty_onboarding_complete", "true");
      await AsyncStorage.setItem("@wardaty_app_data", JSON.stringify(appData));
      
      await updateData(appData);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      navigation.reset({
        index: 0,
        routes: [{ name: "Main" as never }],
      });
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  // ===================================
  // RENDER STEPS
  // ===================================

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Language data={data} setData={setData} t={t} personaColor={personaColor} />;
      case 2:
        return <Step2Persona data={data} setData={setData} t={t} errors={errors} />;
      case 3:
        return <Step3Email data={data} setData={setData} confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} t={t} errors={errors} isRTL={isRTL} />;
      case 4:
        return <Step4Beauty data={data} setData={setData} t={t} errors={errors} isRTL={isRTL} />;
      case 5:
        return <Step5Cycle data={data} setData={setData} t={t} errors={errors} showDatePicker={showDatePicker} setShowDatePicker={setShowDatePicker} isRTL={isRTL} />;
      case 6:
        return <Step6Personal data={data} setData={setData} t={t} errors={errors} isRTL={isRTL} />;
      default:
        return null;
    }
  };

  const totalSteps = data.persona === "partner" ? 5 : 6;
  const displayStep = currentStep === 6 && data.persona === "partner" ? 5 : currentStep;

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Progress Dots */}
      <View style={styles.progressContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index + 1 === displayStep && { backgroundColor: personaColor },
            ]}
          />
        ))}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          key={currentStep}
          entering={FadeInDown.duration(300)}
          exiting={FadeOutUp.duration(200)}
        >
          {renderStep()}
        </Animated.View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={[styles.navigationContainer, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
        {currentStep > 1 && (
          <Pressable
            onPress={handleBack}
            style={[styles.backButton, { borderColor: GLASS_BORDER }]}
          >
            <Feather name={isRTL ? "arrow-right" : "arrow-left"} size={20} color={TEXT_PRIMARY} />
            <Text style={styles.backButtonText}>{t("back")}</Text>
          </Pressable>
        )}

        <Pressable
          onPress={handleNext}
          style={[
            styles.nextButton,
            { backgroundColor: personaColor },
            currentStep === 1 && styles.nextButtonFull,
          ]}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === 6 ? t("finish") : t("next")}
          </Text>
          <Feather name={isRTL ? "arrow-left" : "arrow-right"} size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

// ===================================
// STEP 1: LANGUAGE
// ===================================

function Step1Language({ data, setData, t, personaColor }: any) {
  return (
    <View style={styles.stepContainer}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <LinearGradient
          colors={["#8C64F0", "#FF5FA8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoGradient}
        >
          <Text style={styles.logoText}>ورديتي</Text>
        </LinearGradient>
      </View>

      <Text style={styles.title}>{t("selectLanguage")}</Text>
      <Text style={styles.subtitle}>{t("choosePreferred")}</Text>

      <View style={styles.optionsContainer}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setData({ ...data, language: "ar" });
          }}
          style={[
            styles.languageOption,
            data.language === "ar" && { borderColor: personaColor, borderWidth: 2 },
          ]}
        >
          <Text style={styles.languageText}>العربية</Text>
          {data.language === "ar" && <Feather name="check" size={24} color={personaColor} />}
        </Pressable>

        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setData({ ...data, language: "en" });
          }}
          style={[
            styles.languageOption,
            data.language === "en" && { borderColor: personaColor, borderWidth: 2 },
          ]}
        >
          <Text style={styles.languageText}>English</Text>
          {data.language === "en" && <Feather name="check" size={24} color={personaColor} />}
        </Pressable>
      </View>
    </View>
  );
}

// ===================================
// STEP 2: PERSONA
// ===================================

function Step2Persona({ data, setData, t, errors }: any) {
  const personas: Persona[] = ["single", "married", "mother", "partner"];

  return (
    <View style={styles.stepContainer}>
      {/* Logo with persona gradient */}
      <View style={styles.logoContainer}>
        <LinearGradient
          colors={data.persona ? PERSONA_GRADIENTS[data.persona] : ["#8C64F0", "#FF5FA8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoGradient}
        >
          <Text style={styles.logoText}>ورديتي</Text>
        </LinearGradient>
      </View>

      <Text style={styles.title}>{t("selectPersona")}</Text>
      <Text style={styles.subtitle}>{t("whoAreYou")}</Text>

      <View style={styles.optionsContainer}>
        {personas.map((persona) => (
          <Pressable
            key={persona}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setData({ ...data, persona });
            }}
            style={[
              styles.personaOption,
              data.persona === persona && {
                borderColor: PERSONA_COLORS[persona],
                borderWidth: 2,
                backgroundColor: `${PERSONA_COLORS[persona]}15`,
              },
            ]}
          >
            <View style={[styles.personaIcon, { backgroundColor: PERSONA_COLORS[persona] }]}>
              <Text style={styles.personaEmoji}>
                {persona === "single" ? "🌸" : persona === "married" ? "💕" : persona === "mother" ? "👶" : "🤝"}
              </Text>
            </View>
            <Text style={styles.personaText}>{t(persona)}</Text>
            {data.persona === persona && (
              <Feather name="check" size={20} color={PERSONA_COLORS[persona]} style={styles.personaCheck} />
            )}
          </Pressable>
        ))}
      </View>

      {errors.persona && <Text style={styles.errorText}>{errors.persona}</Text>}
    </View>
  );
}

// ===================================
// STEP 3: EMAIL
// ===================================

function Step3Email({ data, setData, confirmPassword, setConfirmPassword, t, errors, isRTL }: any) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>{t("createAccount")}</Text>
      <Text style={styles.subtitle}>{t("enterDetails")}</Text>

      <View style={styles.inputsContainer}>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>{t("email")}</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError, { textAlign: isRTL ? "right" : "left" }]}
            value={data.email}
            onChangeText={(text) => setData({ ...data, email: text })}
            placeholder="example@wardaty.com"
            placeholderTextColor={TEXT_TERTIARY}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>{t("password")}</Text>
          <TextInput
            style={[styles.input, errors.password && styles.inputError, { textAlign: isRTL ? "right" : "left" }]}
            value={data.password}
            onChangeText={(text) => setData({ ...data, password: text })}
            placeholder="••••••"
            placeholderTextColor={TEXT_TERTIARY}
            secureTextEntry
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>{t("confirmPassword")}</Text>
          <TextInput
            style={[styles.input, errors.confirmPassword && styles.inputError, { textAlign: isRTL ? "right" : "left" }]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="••••••"
            placeholderTextColor={TEXT_TERTIARY}
            secureTextEntry
          />
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
        </View>
      </View>
    </View>
  );
}

// ===================================
// STEP 4: BEAUTY PREFERENCES
// ===================================

function Step4Beauty({ data, setData, t, errors, isRTL }: any) {
  const preferences = [
    { id: "skincare", label: t("skincare") },
    { id: "hairCare", label: t("hairCare") },
    { id: "nailCare", label: t("nailCare") },
    { id: "makeup", label: t("makeup") },
    { id: "fragrance", label: t("fragrance") },
    { id: "wellness", label: t("wellness") },
  ];

  const togglePreference = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const current = data.beautyPreferences;
    if (current.includes(id)) {
      setData({ ...data, beautyPreferences: current.filter((p: string) => p !== id) });
    } else {
      setData({ ...data, beautyPreferences: [...current, id] });
    }
  };

  const personaColor = data.persona ? PERSONA_COLORS[data.persona] : "#8C64F0";

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>{t("beautyPreferences")}</Text>
      <Text style={styles.subtitle}>{t("selectInterests")}</Text>

      <View style={styles.chipsContainer}>
        {preferences.map((pref) => {
          const isSelected = data.beautyPreferences.includes(pref.id);
          return (
            <Pressable
              key={pref.id}
              onPress={() => togglePreference(pref.id)}
              style={[
                styles.chip,
                isSelected && { backgroundColor: personaColor, borderColor: personaColor },
              ]}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {pref.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {errors.beautyPreferences && <Text style={styles.errorText}>{errors.beautyPreferences}</Text>}
    </View>
  );
}

// ===================================
// STEP 5: CYCLE DETAILS
// ===================================

function Step5Cycle({ data, setData, t, errors, showDatePicker, setShowDatePicker, isRTL }: any) {
  const formatDate = (date: Date | null) => {
    if (!date) return t("selectDate");
    return date.toLocaleDateString(data.language === "ar" ? "ar-SA" : "en-US");
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>{t("cycleDetails")}</Text>
      <Text style={styles.subtitle}>{t("trackCycle")}</Text>

      <View style={styles.inputsContainer}>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>{t("lastPeriod")}</Text>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowDatePicker(true);
            }}
            style={[styles.input, styles.dateButton, errors.lastPeriodDate && styles.inputError]}
          >
            <Text style={[styles.dateText, !data.lastPeriodDate && { color: TEXT_TERTIARY }]}>
              {formatDate(data.lastPeriodDate)}
            </Text>
            <Feather name="calendar" size={20} color={TEXT_SECONDARY} />
          </Pressable>
          {errors.lastPeriodDate && <Text style={styles.errorText}>{errors.lastPeriodDate}</Text>}
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>{t("cycleLength")}</Text>
          <TextInput
            style={[styles.input, errors.cycleLength && styles.inputError, { textAlign: isRTL ? "right" : "left" }]}
            value={String(data.cycleLength)}
            onChangeText={(text) => setData({ ...data, cycleLength: parseInt(text) || 28 })}
            placeholder="28"
            placeholderTextColor={TEXT_TERTIARY}
            keyboardType="number-pad"
          />
          {errors.cycleLength && <Text style={styles.errorText}>{errors.cycleLength}</Text>}
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={data.lastPeriodDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            setShowDatePicker(Platform.OS === "ios");
            if (selectedDate) {
              setData({ ...data, lastPeriodDate: selectedDate });
            }
          }}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
}

// ===================================
// STEP 6: PERSONAL INFO
// ===================================

function Step6Personal({ data, setData, t, errors, isRTL }: any) {
  const ageRanges = ["18-24", "25-34", "35-44", "45+"];
  const goalsList = [
    { id: "trackCycle", label: t("trackCycleGoal") },
    { id: "conceive", label: t("conceive") },
    { id: "avoidPregnancy", label: t("avoidPregnancy") },
    { id: "generalHealth", label: t("generalHealth") },
    { id: "beautyWellness", label: t("beautyWellness") },
  ];

  const toggleGoal = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const current = data.goals;
    if (current.includes(id)) {
      setData({ ...data, goals: current.filter((g: string) => g !== id) });
    } else {
      setData({ ...data, goals: [...current, id] });
    }
  };

  const personaColor = data.persona ? PERSONA_COLORS[data.persona] : "#8C64F0";

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>{t("personalInfo")}</Text>
      <Text style={styles.subtitle}>{t("tellUsAbout")}</Text>

      <View style={styles.inputsContainer}>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>{t("name")}</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError, { textAlign: isRTL ? "right" : "left" }]}
            value={data.name}
            onChangeText={(text) => setData({ ...data, name: text })}
            placeholder={data.language === "ar" ? "اسمك" : "Your name"}
            placeholderTextColor={TEXT_TERTIARY}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>{t("ageRange")}</Text>
          <View style={styles.chipsContainer}>
            {ageRanges.map((range) => {
              const isSelected = data.ageRange === range;
              return (
                <Pressable
                  key={range}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setData({ ...data, ageRange: range });
                  }}
                  style={[
                    styles.chip,
                    isSelected && { backgroundColor: personaColor, borderColor: personaColor },
                  ]}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {range}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {errors.ageRange && <Text style={styles.errorText}>{errors.ageRange}</Text>}
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>{t("goals")}</Text>
          <View style={styles.chipsContainer}>
            {goalsList.map((goal) => {
              const isSelected = data.goals.includes(goal.id);
              return (
                <Pressable
                  key={goal.id}
                  onPress={() => toggleGoal(goal.id)}
                  style={[
                    styles.chip,
                    isSelected && { backgroundColor: personaColor, borderColor: personaColor },
                  ]}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {goal.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {errors.goals && <Text style={styles.errorText}>{errors.goals}</Text>}
        </View>

        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setData({ ...data, notificationsEnabled: !data.notificationsEnabled });
          }}
          style={[styles.notificationToggle, { flexDirection: isRTL ? "row-reverse" : "row" }]}
        >
          <View style={[styles.checkbox, data.notificationsEnabled && { backgroundColor: personaColor, borderColor: personaColor }]}>
            {data.notificationsEnabled && <Feather name="check" size={16} color="#FFFFFF" />}
          </View>
          <Text style={styles.notificationText}>{t("notifications")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ===================================
// STYLES
// ===================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_ROOT,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.lg,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: GLASS_BORDER,
  },
  stepContainer: {
    alignItems: "center",
    width: "100%",
  },
  logoContainer: {
    marginBottom: SPACING.xl,
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Tajawal-Bold",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    marginBottom: SPACING.xs,
    textAlign: "center",
    fontFamily: "Tajawal-Bold",
  },
  subtitle: {
    fontSize: 16,
    color: TEXT_SECONDARY,
    marginBottom: SPACING.xl,
    textAlign: "center",
    fontFamily: "Tajawal-Regular",
  },
  optionsContainer: {
    width: "100%",
    gap: SPACING.md,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SPACING.lg,
    backgroundColor: BG_CARD,
    borderRadius: BORDER_RADIUS.large,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    minHeight: 60,
  },
  languageText: {
    fontSize: 17,
    fontWeight: "600",
    color: TEXT_PRIMARY,
    fontFamily: "Tajawal-Bold",
  },
  personaOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.lg,
    backgroundColor: BG_CARD,
    borderRadius: BORDER_RADIUS.large,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    gap: SPACING.md,
    minHeight: 80,
  },
  personaIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  personaEmoji: {
    fontSize: 28,
  },
  personaText: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
    color: TEXT_PRIMARY,
    fontFamily: "Tajawal-Bold",
  },
  personaCheck: {
    position: "absolute",
    top: SPACING.sm,
    right: SPACING.sm,
  },
  inputsContainer: {
    width: "100%",
    gap: SPACING.lg,
  },
  inputWrapper: {
    width: "100%",
  },
  label: {
    fontSize: 15,
    color: TEXT_SECONDARY,
    marginBottom: SPACING.xs,
    fontFamily: "Tajawal-Regular",
  },
  input: {
    backgroundColor: BG_CARD,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    padding: SPACING.md,
    minHeight: 50,
    fontSize: 16,
    color: TEXT_PRIMARY,
    fontFamily: "Tajawal-Regular",
  },
  inputError: {
    borderColor: "#FF5252",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateText: {
    fontSize: 16,
    color: TEXT_PRIMARY,
    fontFamily: "Tajawal-Regular",
  },
  errorText: {
    fontSize: 13,
    color: "#FF5252",
    marginTop: SPACING.xs,
    fontFamily: "Tajawal-Regular",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: BG_CARD,
    borderRadius: BORDER_RADIUS.large,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
  },
  chipText: {
    fontSize: 15,
    color: TEXT_PRIMARY,
    fontFamily: "Tajawal-Regular",
  },
  chipTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  notificationToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginTop: SPACING.md,
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
    fontSize: 16,
    color: TEXT_PRIMARY,
    fontFamily: "Tajawal-Regular",
  },
  navigationContainer: {
    flexDirection: "row",
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.xs,
    padding: SPACING.md,
    backgroundColor: BG_CARD,
    borderRadius: BORDER_RADIUS.large,
    borderWidth: 1,
    minHeight: 56,
  },
  backButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: TEXT_PRIMARY,
    fontFamily: "Tajawal-Bold",
  },
  nextButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.xs,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.large,
    minHeight: 56,
  },
  nextButtonFull: {
    flex: 2,
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "Tajawal-Bold",
  },
});
