# Onboarding System - Complete Rebuild

**Date:** December 11, 2024  
**Version:** 2.0  
**Status:** ✅ Complete

---

## 🎯 Overview

تم إعادة بناء نظام Onboarding بالكامل بترتيب صارم ومنطقي، مع دعم كامل لـ RTL/LTR، حفظ التقدم، والتحقق من صحة البيانات.

---

## 📋 Strict Order

### **الترتيب الجديد:**

```
1. Language Selection (اختيار اللغة)
   ↓
2. Role Selection (اختيار الدور: مستخدمة/شريك)
   ↓
3. Persona Selection (اختيار الحالة: عزباء/متزوجة/أم) - للمستخدمات فقط
   ↓
4. Personal Data (البيانات الشخصية: الاسم، العمر، الدورة، الصحة)
```

### **الترتيب القديم (تم إزالته):**

```
❌ Language → Welcome → Persona → Name → Cycle
```

---

## 🔄 Step-by-Step Breakdown

### **Step 1: Language Selection**

#### **Purpose:**
- اختيار اللغة قبل أي شيء آخر
- تطبيق RTL/LTR فوراً

#### **UI:**
- Bilingual title: "Choose Language / اختر اللغة"
- Bilingual subtitle: "Select your preferred language / اختر لغتك المفضلة"
- زران كبيران: "العربية" و "English"
- أيقونة globe في الأعلى
- Check icon عند الاختيار

#### **Validation:**
- يجب اختيار لغة قبل المتابعة
- Next button معطل حتى الاختيار

#### **Code:**
```typescript
const renderLanguageStep = () => (
  <Animated.View entering={FadeInDown.duration(600)}>
    <Feather name="globe" size={48} />
    <ThemedText>Choose Language / اختر اللغة</ThemedText>
    
    <Pressable onPress={() => setSelectedLanguage("ar")}>
      <ThemedText>العربية</ThemedText>
      {selectedLanguage === "ar" && <Feather name="check-circle" />}
    </Pressable>
    
    <Pressable onPress={() => setSelectedLanguage("en")}>
      <ThemedText>English</ThemedText>
      {selectedLanguage === "en" && <Feather name="check-circle" />}
    </Pressable>
  </Animated.View>
);
```

---

### **Step 2: Role Selection (NEW)**

#### **Purpose:**
- تحديد هل المستخدم أنثى (user) أم ذكر (partner)
- تخطي خطوات الدورة للشريك تلقائياً

#### **UI:**
- عنوان: "Select Your Role" / "اختاري دورك"
- وصف: "Are you a user or a partner?" / "هل أنتِ مستخدمة أم شريك؟"
- كارتان كبيرتان:
  - **User (Female)**: أيقونة user + "Track cycle, wellness, and beauty"
  - **Partner (Male)**: أيقونة heart + "Support your partner and understand her cycle"
- أيقونة users في الأعلى

#### **Logic:**
```typescript
if (role === "partner") {
  setPersona("partner");
  setStep("personalData"); // Skip persona step
} else {
  setStep("persona"); // Go to persona selection
}
```

#### **Validation:**
- يجب اختيار دور قبل المتابعة

#### **Code:**
```typescript
const renderRoleStep = () => (
  <Animated.View entering={FadeInDown.duration(600)}>
    <Feather name="users" size={48} />
    <ThemedText>{t("onboarding", "selectRole")}</ThemedText>
    
    <Pressable onPress={() => setRole("user")}>
      <Feather name="user" />
      <ThemedText>{t("onboarding", "userFemale")}</ThemedText>
      <ThemedText>{t("onboarding", "userDescription")}</ThemedText>
      {role === "user" && <Feather name="check-circle" />}
    </Pressable>
    
    <Pressable onPress={() => setRole("partner")}>
      <Feather name="heart" />
      <ThemedText>{t("onboarding", "partnerMale")}</ThemedText>
      <ThemedText>{t("onboarding", "partnerDescription")}</ThemedText>
      {role === "partner" && <Feather name="check-circle" />}
    </Pressable>
  </Animated.View>
);
```

---

### **Step 3: Persona Selection**

#### **Purpose:**
- اختيار الحالة الاجتماعية (للمستخدمات فقط)
- تطبيق theme الشخصية فوراً

#### **UI:**
- عنوان: "Select your current status" / "اختاري وضعك الحالي"
- وصف: "This helps us personalize your experience"
- PersonaSelector component:
  - Single (عزباء)
  - Married (متزوجة)
  - Mother (أم)
- أيقونة star في الأعلى

#### **Logic:**
- **Partners skip this step** - يتم تعيين persona = "partner" تلقائياً
- Users يختارون من 3 خيارات
- Theme يتغير فوراً بعد الاختيار

#### **Validation:**
- persona له قيمة افتراضية "single"
- يمكن المتابعة مباشرة

---

### **Step 4: Personal Data**

#### **Purpose:**
- جمع البيانات الشخصية والصحية
- تخصيص التجربة

#### **UI:**
- ScrollView لاستيعاب جميع الحقول
- أيقونة edit في الأعلى
- عنوان: "Personal Information" / "المعلومات الشخصية"

#### **Sections:**

##### **A. Basic Info (Required)**
```
- Name* (الاسم)
- Age* (العمر)
```

##### **B. Cycle Information (Required for Users only)**
```
- Cycle Length* (21-35 days)
- Period Length* (3-7 days)
- Last Period Date (Optional, YYYY-MM-DD)
```

**Hidden for Partners** ✅

##### **C. Wellness Goals (Optional)**
```
- Daily Water Goal (glasses)
- Daily Sleep Goal (hours)
```

#### **Validation:**
```typescript
const canProceed = () => {
  // Name and age required
  if (!name.trim() || !age.trim()) return false;
  
  // For users, cycle data required
  if (role === "user") {
    if (!cycleLength.trim() || !periodLength.trim()) return false;
    
    const cycleNum = parseInt(cycleLength);
    const periodNum = parseInt(periodLength);
    
    if (isNaN(cycleNum) || isNaN(periodNum)) return false;
    if (cycleNum < 21 || cycleNum > 35) return false;
    if (periodNum < 3 || periodNum > 7) return false;
  }
  
  return true;
};
```

#### **RTL Support:**
```typescript
<TextInput
  style={[styles.input, { textAlign: isRTL ? "right" : "left" }]}
  value={name}
  onChangeText={setName}
/>
```

---

## 💾 Progress Saving

### **Implementation:**

```typescript
const ONBOARDING_PROGRESS_KEY = "@wardaty_onboarding_progress";

interface OnboardingProgress {
  step: OnboardingStep;
  language?: "ar" | "en";
  role?: UserRole;
  persona?: Persona;
  name?: string;
  age?: string;
  cycleLength?: string;
  periodLength?: string;
  lastPeriodDate?: string;
  waterGoal?: string;
  sleepGoal?: string;
}

// Save on every state change
useEffect(() => {
  saveProgress();
}, [step, selectedLanguage, role, persona, name, age, ...]);

// Load on mount
useEffect(() => {
  loadProgress();
}, []);

// Clear on completion
const handleNext = async () => {
  if (step === "personalData") {
    await clearProgress();
    navigation.navigate("Main");
  }
};
```

### **Benefits:**
- ✅ المستخدم يمكنه إغلاق التطبيق والعودة
- ✅ التقدم محفوظ في AsyncStorage
- ✅ يبدأ من آخر خطوة
- ✅ يتم مسح التقدم عند الانتهاء

---

## 📊 Progress Bar

### **Implementation:**

```typescript
const getProgress = () => {
  const steps = ["language", "role", "persona", "personalData"];
  const currentIndex = steps.indexOf(step);
  
  // If partner, skip persona step in progress
  const totalSteps = role === "partner" ? 3 : 4;
  const adjustedIndex = role === "partner" && step === "personalData" ? 2 : currentIndex;
  
  return ((adjustedIndex + 1) / totalSteps) * 100;
};

<View style={styles.progressBarContainer}>
  <View style={[styles.progressBar, { width: `${getProgress()}%` }]} />
</View>
```

### **Behavior:**
- **User (Female):** 4 steps → 25%, 50%, 75%, 100%
- **Partner (Male):** 3 steps (skip persona) → 33%, 66%, 100%

---

## 🎨 UI/UX Features

### **1. Animations:**
```typescript
<Animated.View
  entering={FadeInDown.duration(600)}
  exiting={FadeOutUp.duration(400)}
>
```

### **2. Haptic Feedback:**
```typescript
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
```

### **3. Visual Feedback:**
- Check icons عند الاختيار
- Disabled button opacity (0.5)
- Active state colors
- Border colors للحقول النشطة

### **4. RTL Support:**
```typescript
// Buttons
<View style={{ flexDirection: isRTL ? "row-reverse" : "row" }}>
  <Pressable>Back</Pressable>
  <Pressable>Next</Pressable>
</View>

// Chevrons
<Feather name={isRTL ? "chevron-left" : "chevron-right"} />

// Text alignment
<TextInput style={{ textAlign: isRTL ? "right" : "left" }} />
```

### **5. Keyboard Handling:**
```typescript
<ScrollView
  keyboardShouldPersistTaps="handled"
  showsVerticalScrollIndicator={false}
>
```

---

## 🔧 Type Updates

### **UserSettings:**
```typescript
export interface UserSettings {
  persona: Persona;
  name: string;
  nameAr: string;
  nameEn: string;
  age?: number; // ✨ NEW
  language: "ar" | "en";
  theme: "light" | "dark" | "system";
  calendarType: "gregorian" | "hijri" | "both";
  cycleSettings: CycleSettings;
  wellnessGoals?: { // ✨ NEW
    waterCups: number;
    sleepHours: number;
  };
  notificationsEnabled: boolean;
  isSubscribed: boolean;
  onboardingComplete: boolean;
  fontScale: FontScale;
}
```

### **OnboardingStep:**
```typescript
type OnboardingStep = "language" | "role" | "persona" | "personalData";
```

### **UserRole:**
```typescript
type UserRole = "user" | "partner";
```

---

## 🌐 Translations Added

### **Arabic:**
```typescript
onboarding: {
  // ... existing
  selectRole: "اختاري دورك",
  roleDescription: "هل أنتِ مستخدمة أم شريك؟",
  userFemale: "مستخدمة (أنثى)",
  userDescription: "تتبع الدورة والعناية والصحة",
  partnerMale: "شريك (ذكر)",
  partnerDescription: "دعم شريكتك وفهم دورتها",
  personalInfo: "المعلومات الشخصية",
  personalInfoDescription: "ساعدينا في تخصيص تجربتك",
  name: "الاسم",
  age: "العمر",
  cycleInformation: "معلومات الدورة",
  lastPeriodDate: "تاريخ آخر دورة",
  wellnessGoals: "أهداف الصحة",
}

wellness: {
  // ... existing
  dailyWaterGoal: "هدف الماء اليومي",
  dailySleepGoal: "هدف النوم اليومي",
  hours: "ساعات",
}

common: {
  // ... existing
  optional: "اختياري",
}
```

### **English:**
```typescript
onboarding: {
  // ... existing
  selectRole: "Select Your Role",
  roleDescription: "Are you a user or a partner?",
  userFemale: "User (Female)",
  userDescription: "Track cycle, wellness, and beauty",
  partnerMale: "Partner (Male)",
  partnerDescription: "Support your partner and understand her cycle",
  personalInfo: "Personal Information",
  personalInfoDescription: "Help us personalize your experience",
  name: "Name",
  age: "Age",
  cycleInformation: "Cycle Information",
  lastPeriodDate: "Last Period Date",
  wellnessGoals: "Wellness Goals",
}

wellness: {
  // ... existing
  dailyWaterGoal: "Daily water goal",
  dailySleepGoal: "Daily sleep goal",
  hours: "hours",
}

common: {
  // ... existing
  optional: "Optional",
}
```

---

## ✅ Rules Enforced

### **1. Strict Order:**
- ✅ Language → Role → Persona → Personal Data
- ✅ No step can be skipped
- ✅ Back button respects order
- ✅ Partners skip persona automatically

### **2. Smooth Animations:**
- ✅ FadeInDown (600ms) on enter
- ✅ FadeOutUp (400ms) on exit
- ✅ Haptic feedback on interactions

### **3. Progress Saving:**
- ✅ Saved after each state change
- ✅ Loaded on mount
- ✅ Cleared on completion
- ✅ AsyncStorage persistence

### **4. Localization:**
- ✅ Bilingual language selection
- ✅ RTL/LTR applied immediately
- ✅ All text translated
- ✅ Text alignment correct

### **5. Validation:**
- ✅ Required fields checked
- ✅ Next button disabled when invalid
- ✅ Cycle length: 21-35 days
- ✅ Period length: 3-7 days
- ✅ Age: numeric only
- ✅ Different rules for user/partner

### **6. Partner Support:**
- ✅ Partners skip persona
- ✅ Partners skip cycle data
- ✅ Progress bar adjusted
- ✅ Back button works correctly

---

## 🧪 Testing Checklist

### **Step 1: Language**
- [ ] Open app for first time
- [ ] See bilingual UI
- [ ] Select Arabic → RTL applied
- [ ] Select English → LTR applied
- [ ] Next button disabled until selection
- [ ] Check icon appears on selection

### **Step 2: Role**
- [ ] See role selection
- [ ] Select User (Female)
- [ ] Select Partner (Male)
- [ ] Check descriptions
- [ ] Next button disabled until selection

### **Step 3: Persona**
- [ ] **As User:** See persona selection
- [ ] Select Single → theme changes
- [ ] Select Married → theme changes
- [ ] Select Mother → theme changes
- [ ] **As Partner:** This step is skipped ✅

### **Step 4: Personal Data**
- [ ] Enter name (required)
- [ ] Enter age (required)
- [ ] **As User:** See cycle fields
- [ ] **As User:** Enter cycle length (21-35)
- [ ] **As User:** Enter period length (3-7)
- [ ] **As User:** Enter last period date (optional)
- [ ] **As Partner:** Cycle fields hidden ✅
- [ ] Enter water goal (optional)
- [ ] Enter sleep goal (optional)
- [ ] Next button disabled until valid
- [ ] Press Finish → Navigate to Main

### **Progress Saving:**
- [ ] Complete step 1
- [ ] Close app
- [ ] Reopen app
- [ ] Resume from step 2 ✅
- [ ] Complete onboarding
- [ ] Reopen app
- [ ] Go directly to Main (progress cleared) ✅

### **RTL/LTR:**
- [ ] Arabic: Text right-aligned
- [ ] Arabic: Buttons reversed
- [ ] Arabic: Chevrons point left
- [ ] English: Text left-aligned
- [ ] English: Buttons normal order
- [ ] English: Chevrons point right

### **Validation:**
- [ ] Empty name → Next disabled
- [ ] Empty age → Next disabled
- [ ] Cycle length < 21 → Next disabled
- [ ] Cycle length > 35 → Next disabled
- [ ] Period length < 3 → Next disabled
- [ ] Period length > 7 → Next disabled
- [ ] All valid → Next enabled ✅

---

## 📱 Screenshots

### **Before (Old System):**
```
Language → Welcome → Persona → Name → Cycle
```
- ❌ Welcome step unnecessary
- ❌ No role selection
- ❌ No partner support
- ❌ No progress saving
- ❌ Limited validation

### **After (New System):**
```
Language → Role → Persona → Personal Data
```
- ✅ Streamlined flow
- ✅ Role selection
- ✅ Partner support
- ✅ Progress saving
- ✅ Full validation
- ✅ Better UX

---

## 🚀 Next Steps

### **Future Enhancements:**
1. **Profile Picture Upload** in Personal Data step
2. **Email/Phone** for account creation
3. **Social Login** (Google, Apple)
4. **Skip Button** for optional fields
5. **Tooltips** for field explanations
6. **Date Picker** for last period date
7. **Slider** for water/sleep goals
8. **Preview** of persona themes

---

## 📝 Summary

### **What Changed:**
- ✅ Complete rebuild of onboarding flow
- ✅ Added Role Selection (User/Partner)
- ✅ Added progress saving/resume
- ✅ Added full validation
- ✅ Added wellness goals
- ✅ Removed welcome step
- ✅ Improved RTL support
- ✅ Better error handling

### **Files Modified:**
1. `screens/OnboardingScreen.tsx` - Complete rewrite
2. `lib/translations.ts` - Added 15+ new keys
3. `lib/types.ts` - Added age & wellnessGoals

### **Commits:**
- 1 major commit with 551 insertions, 172 deletions

---

**Status:** ✅ Complete and Ready for Testing  
**Next:** User acceptance testing and feedback collection
