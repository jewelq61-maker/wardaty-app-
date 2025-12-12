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
  Switch,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import Animated, {
  FadeInDown,
  FadeOutUp,
  FadeIn,
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";

import { useLanguage } from "../hooks/useLanguage";
import { useApp } from "../lib/AppContext";
import { Persona } from "../lib/types";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Apple iOS Light Theme
const COLORS = {
  base: "#FFFFFF",
  elevated: "#F9F9F9",
  card: "#F5F5F7",
  text: {
    primary: "#000000",
    secondary: "rgba(0, 0, 0, 0.6)",
    tertiary: "rgba(0, 0, 0, 0.4)",
  },
  border: "rgba(0, 0, 0, 0.1)",
  shadow: "rgba(0, 0, 0, 0.15)",
};

// Persona Colors (Official Wardaty)
const PERSONA_COLORS = {
  single: "#FF6B9D",
  married: "#FF8D8D",
  mother: "#A684F5",
  partner: "#7EC8E3",
};

// Persona Flowers (Official Assets)
const PERSONA_FLOWERS = {
  single: require("../assets/flowers/icon-single-pink.png"),
  married: require("../assets/flowers/icon-married-coral.png"),
  mother: require("../assets/flowers/icon-mother-purple.png"),
  partner: require("../assets/flowers/icon-partner-blue.png"),
};

// Apple iOS Typography (Preserved Wardaty Colors)
const TYPOGRAPHY = {
  largeTitle: {
    fontSize: 34,
    fontWeight: "700",
    lineHeight: 41,
    letterSpacing: 0.37,
  },
  title1: {
    fontSize: 28,
    fontWeight: "600",
    lineHeight: 34,
    letterSpacing: 0.36,
  },
  title2: {
    fontSize: 22,
    fontWeight: "600",
    lineHeight: 28,
    letterSpacing: 0.35,
  },
  headline: {
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 22,
    letterSpacing: -0.41,
  },
  body: {
    fontSize: 17,
    fontWeight: "400",
    lineHeight: 22,
    letterSpacing: -0.41,
  },
  callout: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 21,
    letterSpacing: -0.32,
  },
  subheadline: {
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: -0.24,
  },
  footnote: {
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 18,
    letterSpacing: -0.08,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
    letterSpacing: 0,
  },
};

// Apple iOS Spacing
const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
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
  { id: "skincare", labelAr: "العناية بالبشرة", labelEn: "Skincare", icon: "droplet" },
  { id: "hair", labelAr: "العناية بالشعر", labelEn: "Hair Care", icon: "scissors" },
  { id: "nails", labelAr: "العناية بالأظافر", labelEn: "Nail Care", icon: "star" },
  { id: "makeup", labelAr: "المكياج", labelEn: "Makeup", icon: "eye" },
  { id: "fragrance", labelAr: "العطور", labelEn: "Fragrance", icon: "wind" },
  { id: "wellness", labelAr: "العافية", labelEn: "Wellness", icon: "heart" },
];

const AGE_RANGES = [
  { id: "18-24", label: "18-24" },
  { id: "25-34", label: "25-34" },
  { id: "35-44", label: "35-44" },
  { id: "45+", label: "45+" },
];

const GOAL_OPTIONS = [
  { id: "track_cycle", labelAr: "تتبع الدورة", labelEn: "Track Cycle", icon: "calendar" },
  { id: "conceive", labelAr: "الحمل", labelEn: "Conceive", icon: "heart" },
  { id: "avoid_pregnancy", labelAr: "تجنب الحمل", labelEn: "Avoid Pregnancy", icon: "shield" },
  { id: "health", labelAr: "الصحة العامة", labelEn: "General Health", icon: "activity" },
  { id: "beauty", labelAr: "الجمال", labelEn: "Beauty & Wellness", icon: "star" },
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
  const personaColor = data.persona ? PERSONA_COLORS[data.persona] : PERSONA_COLORS.single;
  const personaFlower = data.persona ? PERSONA_FLOWERS[data.persona] : PERSONA_FLOWERS.single;

  // Calculate total steps (Partner skips cycle step)
  const totalSteps = data.persona === "partner" ? 5 : 6;

  const updateField = (field: keyof OnboardingData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const toggleArrayItem = (field: "beautyPreferences" | "goals", item: string) => {
    setData((prev) => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter((i) => i !== item)
        : [...prev[field], item],
    }));
  };

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

  const handleNext = async () => {
    if (!validateStep()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (step === 1) {
      await setLanguage(data.language);
      I18nManager.forceRTL(data.language === "ar");
      setStep(2);
      return;
    }

    if (step === 4 && data.persona === "partner") {
      setStep(6);
      return;
    }

    if ((step === 5 && data.persona === "partner") || step === 6) {
      await completeOnboarding();
      return;
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
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

      await updateData({
        persona: data.persona,
        email: data.email,
        name: data.name,
        beautyPreferences: data.beautyPreferences,
        cyclePredictions,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.navigate("Main" as never);
    } catch (err) {
      console.error("Error completing onboarding:", err);
      setError(isRTL ? "حدث خطأ، الرجاء المحاولة مرة أخرى" : "An error occurred, please try again");
    }
  };

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

  // Step 1: Language Selection (Apple Style)
  const renderStep1Language = () => (
    <Animated.View
      entering={FadeInDown.springify().damping(15)}
      exiting={FadeOutUp.duration(300)}
      style={styles.stepContainer}
    >
      {/* Wardaty Logo Flower */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/wardaty-logo.png")}
          style={styles.logoFlower}
        />
        <Text style={styles.logoText}>ورديتي</Text>
        <Text style={styles.logoSubtext}>Wardaty</Text>
      </View>

      <Text style={[styles.largeTitle, { marginBottom: SPACING.sm }]}>
        Choose Your Language
      </Text>
      <Text style={[styles.largeTitle, { textAlign: "center" }]}>
        اختاري لغتك
      </Text>

      <View style={styles.languageGrid}>
        {[
          { id: "ar", label: "العربية", flag: "🇸🇦" },
          { id: "en", label: "English", flag: "🇬🇧" },
        ].map((lang) => (
          <Pressable
            key={lang.id}
            style={[
              styles.appleCard,
              data.language === lang.id && {
                borderColor: personaColor,
                borderWidth: 3,
                backgroundColor: "#FFFFFF",
                shadowColor: personaColor,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 12,
                elevation: 8,
              },
            ]}
            onPress={() => {
              updateField("language", lang.id);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Text style={styles.languageFlag}>{lang.flag}</Text>
            <Text style={styles.languageLabel}>{lang.label}</Text>
          </Pressable>
        ))}
      </View>
    </Animated.View>
  );

  // Step 2: Persona Selection (Apple Style with Flowers)
  const renderStep2Persona = () => (
    <Animated.View
      entering={FadeInDown.springify().damping(15)}
      exiting={FadeOutUp.duration(300)}
      style={styles.stepContainer}
    >
      {/* Logo Flower with Persona Color Tint */}
      <View style={styles.logoContainerSmall}>
        <Image
          source={personaFlower}
          style={styles.logoFlowerSmall}
        />
      </View>

      <Text style={[styles.largeTitle, { marginBottom: SPACING.sm }]}>
        {isRTL ? "اختاري شخصيتك" : "Select Your Persona"}
      </Text>
      <Text style={[styles.subheadline, styles.secondaryText, { textAlign: "center", marginBottom: SPACING.md }]}>
        {isRTL ? "اختاري ما يناسبك" : "Choose what suits you"}
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
                styles.appleCard,
                styles.personaCard,
                isSelected && {
                  borderColor: color,
                  borderWidth: 3,
                  backgroundColor: "#FFFFFF",
                  shadowColor: color,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 12,
                  elevation: 8,
                },
              ]}
              onPress={() => {
                updateField("persona", persona);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
            >
              <Image source={flower} style={styles.personaFlower} />
              <Text style={[{ fontSize: 18, fontWeight: "600", color: isSelected ? color : COLORS.text.primary, marginTop: SPACING.sm }]}>
                {isRTL ? labels[persona].ar : labels[persona].en}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );

  // Step 3: Email Signup (Apple iOS Style)
  const renderStep3Email = () => (
    <Animated.View
      entering={FadeInDown.springify().damping(15)}
      exiting={FadeOutUp.duration(300)}
      style={styles.stepContainer}
    >
      <Image source={personaFlower} style={styles.stepIcon} />

      <Text style={[styles.title1, { textAlign: isRTL ? "right" : "left", width: "100%" }]}>
        {isRTL ? "إنشاء حساب" : "Create Account"}
      </Text>
      <Text style={[styles.subheadline, styles.secondaryText, { textAlign: isRTL ? "right" : "left", width: "100%", marginTop: SPACING.sm }]}>
        {isRTL ? "أدخلي معلومات حسابك" : "Enter your account details"}
      </Text>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { textAlign: isRTL ? "right" : "left" }]}>
            {isRTL ? "البريد الإلكتروني" : "Email"}
          </Text>
          <TextInput
            style={[styles.appleInput, { textAlign: isRTL ? "right" : "left" }]}
            placeholder={isRTL ? "name@example.com" : "name@example.com"}
            placeholderTextColor={COLORS.text.tertiary}
            value={data.email}
            onChangeText={(text) => updateField("email", text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { textAlign: isRTL ? "right" : "left" }]}>
            {isRTL ? "كلمة المرور" : "Password"}
          </Text>
          <TextInput
            style={[styles.appleInput, { textAlign: isRTL ? "right" : "left" }]}
            placeholder={isRTL ? "••••••" : "••••••"}
            placeholderTextColor={COLORS.text.tertiary}
            value={data.password}
            onChangeText={(text) => updateField("password", text)}
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { textAlign: isRTL ? "right" : "left" }]}>
            {isRTL ? "تأكيد كلمة المرور" : "Confirm Password"}
          </Text>
          <TextInput
            style={[styles.appleInput, { textAlign: isRTL ? "right" : "left" }]}
            placeholder={isRTL ? "••••••" : "••••••"}
            placeholderTextColor={COLORS.text.tertiary}
            value={data.confirmPassword}
            onChangeText={(text) => updateField("confirmPassword", text)}
            secureTextEntry
          />
        </View>
      </View>
    </Animated.View>
  );

  // Step 4: Beauty Preferences (Apple Grid Style)
  const renderStep4Beauty = () => (
    <Animated.View
      entering={FadeInDown.springify().damping(15)}
      exiting={FadeOutUp.duration(300)}
      style={styles.stepContainer}
    >
      <Image source={personaFlower} style={styles.stepIcon} />

      <Text style={[styles.title1, { textAlign: isRTL ? "right" : "left", width: "100%" }]}>
        {isRTL ? "اهتماماتك الجمالية" : "Beauty Interests"}
      </Text>
      <Text style={[styles.subheadline, styles.secondaryText, { textAlign: isRTL ? "right" : "left", width: "100%", marginTop: SPACING.sm }]}>
        {isRTL ? "اختاري ما يهمك" : "Select what interests you"}
      </Text>

      <View style={styles.beautyGrid}>
        {BEAUTY_OPTIONS.map((option) => {
          const isSelected = data.beautyPreferences.includes(option.id);
          return (
            <Pressable
              key={option.id}
              style={[
                styles.appleCard,
                styles.beautyCard,
                isSelected && {
                  borderColor: personaColor,
                  borderWidth: 3,
                  backgroundColor: "#FFFFFF",
                  shadowColor: personaColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 12,
                  elevation: 8,
                },
              ]}
              onPress={() => {
                toggleArrayItem("beautyPreferences", option.id);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Feather
                name={option.icon as any}
                size={28}
                color={isSelected ? personaColor : COLORS.text.secondary}
              />
              <Text style={[styles.callout, { color: isSelected ? personaColor : COLORS.text.primary, marginTop: SPACING.sm }]}>
                {isRTL ? option.labelAr : option.labelEn}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );

  // Step 5: Cycle Details (iOS Calendar Style)
  const renderStep5Cycle = () => (
    <Animated.View
      entering={FadeInDown.springify().damping(15)}
      exiting={FadeOutUp.duration(300)}
      style={styles.stepContainer}
    >
      <Image source={personaFlower} style={styles.stepIcon} />

      <Text style={[styles.title1, { textAlign: isRTL ? "right" : "left", width: "100%" }]}>
        {isRTL ? "تفاصيل الدورة الشهرية" : "Cycle Details"}
      </Text>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { textAlign: isRTL ? "right" : "left" }]}>
            {isRTL ? "تاريخ آخر دورة" : "Last Period Date"}
          </Text>
          <Pressable
            style={[styles.appleInput, styles.dateButton, { flexDirection: isRTL ? "row-reverse" : "row" }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Feather name="calendar" size={20} color={personaColor} />
            <Text style={[styles.body, { color: data.lastPeriodDate ? COLORS.text.primary : COLORS.text.tertiary }]}>
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

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { textAlign: isRTL ? "right" : "left" }]}>
            {isRTL ? "طول الدورة (بالأيام)" : "Cycle Length (days)"}
          </Text>
          <TextInput
            style={[styles.appleInput, { textAlign: isRTL ? "right" : "left" }]}
            placeholder="28"
            placeholderTextColor={COLORS.text.tertiary}
            value={data.cycleLength}
            onChangeText={(text) => updateField("cycleLength", text)}
            keyboardType="number-pad"
          />
        </View>
      </View>
    </Animated.View>
  );

  // Step 6: Personal Info (iOS Settings Style)
  const renderStep6Personal = () => (
    <Animated.View
      entering={FadeInDown.springify().damping(15)}
      exiting={FadeOutUp.duration(300)}
      style={styles.stepContainer}
    >
      <Image source={personaFlower} style={styles.stepIcon} />

      <Text style={[styles.title1, { textAlign: isRTL ? "right" : "left", width: "100%" }]}>
        {isRTL ? "معلوماتك الشخصية" : "Personal Information"}
      </Text>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { textAlign: isRTL ? "right" : "left" }]}>
            {isRTL ? "الاسم" : "Name"}
          </Text>
          <TextInput
            style={[styles.appleInput, { textAlign: isRTL ? "right" : "left" }]}
            placeholder={isRTL ? "أدخلي اسمك" : "Enter your name"}
            placeholderTextColor={COLORS.text.tertiary}
            value={data.name}
            onChangeText={(text) => updateField("name", text)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { textAlign: isRTL ? "right" : "left" }]}>
            {isRTL ? "الفئة العمرية" : "Age Range"}
          </Text>
          <View style={styles.ageGrid}>
            {AGE_RANGES.map((range) => {
              const isSelected = data.ageRange === range.id;
              return (
                <Pressable
                  key={range.id}
                  style={[
                    styles.appleChip,
                    isSelected && {
                      backgroundColor: personaColor,
                    },
                  ]}
                  onPress={() => {
                    updateField("ageRange", range.id);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Text style={[styles.callout, { color: isSelected ? "#FFFFFF" : COLORS.text.primary }]}>
                    {range.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { textAlign: isRTL ? "right" : "left" }]}>
            {isRTL ? "أهدافك الصحية" : "Health Goals"}
          </Text>
          <View style={styles.goalsGrid}>
            {GOAL_OPTIONS.map((goal) => {
              const isSelected = data.goals.includes(goal.id);
              return (
                <Pressable
                  key={goal.id}
                  style={[
                    styles.appleCard,
                    styles.goalCard,
                    isSelected && {
                      borderColor: personaColor,
                      borderWidth: 3,
                      backgroundColor: "#FFFFFF",
                      shadowColor: personaColor,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.2,
                      shadowRadius: 12,
                      elevation: 8,
                    },
                  ]}
                  onPress={() => {
                    toggleArrayItem("goals", goal.id);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Feather
                    name={goal.icon as any}
                    size={20}
                    color={isSelected ? personaColor : COLORS.text.secondary}
                  />
                  <Text style={[styles.footnote, { color: isSelected ? personaColor : COLORS.text.primary, marginTop: SPACING.xs }]}>
                    {isRTL ? goal.labelAr : goal.labelEn}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={[styles.settingsRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
          <Text style={styles.callout}>
            {isRTL ? "تفعيل الإشعارات" : "Enable Notifications"}
          </Text>
          <Switch
            value={data.notificationsEnabled}
            onValueChange={(value) => {
              updateField("notificationsEnabled", value);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            trackColor={{ false: COLORS.border, true: personaColor }}
            thumbColor="#FFFFFF"
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
        {renderStep()}

        {error ? (
          <Text style={[styles.errorText, { textAlign: isRTL ? "right" : "left" }]}>
            {error}
          </Text>
        ) : null}
      </ScrollView>

      {/* Progress Dots (Apple Style) */}
      <View style={styles.progressContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index + 1 === step && {
                backgroundColor: personaColor,
                width: 32,
                height: 10,
              },
            ]}
          />
        ))}
      </View>

      {/* Navigation Buttons (Apple Style) */}
      <View style={[styles.buttonContainer, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
        {step > 1 && (
          <Pressable style={styles.secondaryButton} onPress={handleBack}>
            <Feather
              name={isRTL ? "arrow-right" : "arrow-left"}
              size={20}
              color={COLORS.text.primary}
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
    backgroundColor: COLORS.base,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  stepContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  
  // Logo Styles
  logoContainer: {
    alignItems: "center",
    marginBottom: SPACING.huge,
  },
  logoFlower: {
    width: 140,
    height: 140,
    marginBottom: SPACING.xl,
  },
  logoText: {
    fontSize: 40,
    fontWeight: "700",
    color: COLORS.text.primary,
    fontFamily: "Tajawal-Bold",
    letterSpacing: -0.5,
  },
  logoSubtext: {
    fontSize: 20,
    fontWeight: "500",
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
    fontFamily: "Tajawal-Regular",
    letterSpacing: 0.5,
  },
  logoContainerSmall: {
    marginBottom: SPACING.xl,
    alignItems: "center",
  },
  logoFlowerSmall: {
    width: 64,
    height: 64,
  },
  stepIcon: {
    width: 80,
    height: 80,
    marginBottom: SPACING.xl,
  },

  // Typography (Apple iOS Style)
  largeTitle: {
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 38,
    letterSpacing: -0.5,
    color: COLORS.text.primary,
    textAlign: "center",
  },
  title1: {
    ...TYPOGRAPHY.title1,
    color: COLORS.text.primary,
  },
  title2: {
    ...TYPOGRAPHY.title2,
    color: COLORS.text.primary,
  },
  headline: {
    ...TYPOGRAPHY.headline,
    color: COLORS.text.primary,
  },
  body: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
  },
  callout: {
    ...TYPOGRAPHY.callout,
    color: COLORS.text.primary,
  },
  subheadline: {
    ...TYPOGRAPHY.subheadline,
    color: COLORS.text.primary,
  },
  footnote: {
    ...TYPOGRAPHY.footnote,
    color: COLORS.text.primary,
  },
  caption: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.primary,
  },
  secondaryText: {
    color: COLORS.text.secondary,
  },

  // Apple Card Style (iOS Light Theme)
  appleCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: SPACING.xxl,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 140,
    justifyContent: "center",
    alignItems: "center",
  },

  // Language Grid
  languageGrid: {
    flexDirection: "row",
    gap: SPACING.lg,
    width: "100%",
    marginTop: SPACING.huge,
    paddingHorizontal: SPACING.md,
  },
  languageFlag: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  languageLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text.primary,
    letterSpacing: -0.3,
  },

  // Persona Grid
  personaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.lg,
    width: "100%",
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  personaCard: {
    width: (SCREEN_WIDTH - SPACING.lg * 2 - SPACING.lg - SPACING.md * 2) / 2,
    alignItems: "center",
    paddingVertical: SPACING.xxl,
    minHeight: 160,
    justifyContent: "center",
  },
  personaFlower: {
    width: 80,
    height: 80,
    marginBottom: SPACING.md,
  },

  // Form Styles (iOS Style)
  formContainer: {
    width: "100%",
    marginTop: SPACING.xl,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    ...TYPOGRAPHY.subheadline,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  appleInput: {
    backgroundColor: COLORS.elevated,
    borderRadius: 12,
    padding: SPACING.md,
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },

  // Beauty Grid
  beautyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.lg,
    width: "100%",
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  beautyCard: {
    width: (SCREEN_WIDTH - SPACING.lg * 2 - SPACING.lg - SPACING.md * 2) / 2,
    alignItems: "center",
    paddingVertical: SPACING.xl,
    minHeight: 120,
    justifyContent: "center",
  },

  // Age Grid
  ageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
  appleChip: {
    backgroundColor: COLORS.elevated,
    borderRadius: 20,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // Goals Grid
  goalsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
  goalCard: {
    width: (SCREEN_WIDTH - SPACING.lg * 2 - SPACING.sm * 2) / 3,
    alignItems: "center",
    paddingVertical: SPACING.md,
  },

  // Settings Row (iOS Style)
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.elevated,
    borderRadius: 12,
    padding: SPACING.md,
    marginTop: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // Error Text
  errorText: {
    ...TYPOGRAPHY.callout,
    color: "#FF6B6B",
    marginTop: SPACING.md,
    width: "100%",
  },

  // Progress Dots (Apple Style)
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.lg,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    transition: "all 0.3s ease",
  },

  // Buttons (Apple iOS Style)
  buttonContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    gap: SPACING.md,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    minHeight: 56,
    borderRadius: 16,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    minHeight: 50,
    borderRadius: 14,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.elevated,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    ...TYPOGRAPHY.callout,
    color: COLORS.text.primary,
    fontWeight: "600",
  },
});
