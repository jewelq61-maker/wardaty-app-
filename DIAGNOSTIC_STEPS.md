# تشخيص خطأ "Cannot read property 'map' of undefined" 🔍

## الخطوات التشخيصية المتقدمة

إذا استمر الخطأ بعد مسح cache الهاتف، اتبعي هذه الخطوات:

---

## 🔍 **الخطوة 1: افحصي رسالة الخطأ الكاملة**

### **على الكمبيوتر في Terminal:**

شوفي الخطأ الكامل - راح يكون فيه:
- اسم الملف
- رقم السطر
- Stack trace

مثال:
```
ERROR  TypeError: Cannot read property 'map' of undefined
    at HomeScreen (screens/HomeScreen.tsx:45)
    at renderApplication
```

**ابحثي عن:**
- اسم الملف (مثل: `HomeScreen.tsx`)
- رقم السطر (مثل: `45`)

---

## 🔍 **الخطوة 2: شغلي في Web Mode**

هذا راح يساعد نعرف إذا المشكلة من الكود أو من Expo Go:

```bash
npx expo start --web
```

**النتيجة:**
- ✅ **إذا اشتغل في المتصفح:** المشكلة من Expo Go cache
- ❌ **إذا ما اشتغل:** المشكلة من الكود

---

## 🔍 **الخطوة 3: شوفي Metro Bundler Logs**

في Terminal، شوفي الأخطاء بالتفصيل:

```bash
npx expo start --clear
```

**ابحثي عن:**
```
ERROR in ./screens/SomeScreen.tsx
Module not found
Cannot resolve
```

---

## 🔍 **الخطوة 4: تحققي من الكود**

### **الأماكن الشائعة للخطأ:**

#### **1. Context Providers:**
```typescript
// ❌ خطأ: data غير معرّف
{data.map(item => ...)}

// ✅ صحيح: تحقق أولاً
{data?.map(item => ...) || []}
```

#### **2. Navigation Props:**
```typescript
// ❌ خطأ: route.params قد يكون undefined
route.params.items.map(...)

// ✅ صحيح
route.params?.items?.map(...) || []
```

#### **3. AsyncStorage:**
```typescript
// ❌ خطأ: قد يكون null
const data = await AsyncStorage.getItem('key');
JSON.parse(data).map(...)

// ✅ صحيح
const data = await AsyncStorage.getItem('key');
const parsed = data ? JSON.parse(data) : [];
parsed.map(...)
```

---

## 🔍 **الخطوة 5: افحصي الملفات المشتبه بها**

### **افحصي هذه الملفات:**

```bash
# 1. HomeScreen
grep -n "\.map(" screens/HomeScreen.tsx

# 2. AppContext
grep -n "\.map(" lib/AppContext.tsx

# 3. Navigation
grep -n "\.map(" navigation/*.tsx
```

**ابحثي عن أي `.map()` بدون تحقق من undefined**

---

## 🔍 **الخطوة 6: جربي Development Build**

إذا Expo Go ما اشتغل، جربي Development Build:

```bash
# ثبتي EAS CLI
npm install -g eas-cli

# سجلي دخول
eas login

# اعملي build
eas build --profile development --platform ios
```

---

## 🔍 **الخطوة 7: افحصي Dependencies**

تأكدي إن كل الـ packages متوافقة:

```bash
# شوفي الإصدارات
npm list react-native
npm list expo

# شوفي التعارضات
npm ls
```

---

## 🔍 **الخطوة 8: شغلي بدون Onboarding**

عشان نعرف إذا المشكلة من OnboardingScreen:

### **عدلي App.tsx مؤقتاً:**

```typescript
// بدل هذا:
return <OnboardingScreenNew />;

// حطي هذا:
return (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Test Screen</Text>
  </View>
);
```

**النتيجة:**
- ✅ **إذا اشتغل:** المشكلة من OnboardingScreen
- ❌ **إذا ما اشتغل:** المشكلة من مكان آخر

---

## 🔍 **الخطوة 9: افحصي OnboardingScreen**

إذا المشكلة من OnboardingScreen، افحصي:

### **1. BEAUTY_OPTIONS:**
```typescript
const BEAUTY_OPTIONS = [
  { id: "skincare", labelAr: "...", labelEn: "...", icon: "droplet" },
  // تأكدي إنه array كامل
];
```

### **2. AGE_RANGES:**
```typescript
const AGE_RANGES = [
  { id: "18-24", label: "18-24" },
  // تأكدي إنه array كامل
];
```

### **3. GOAL_OPTIONS:**
```typescript
const GOAL_OPTIONS = [
  { id: "track_cycle", labelAr: "...", labelEn: "...", icon: "calendar" },
  // تأكدي إنه array كامل
];
```

---

## 🔍 **الخطوة 10: شغلي مع Console Logs**

أضيفي logs عشان تشوفين وين المشكلة:

```typescript
// في OnboardingScreenNew.tsx
console.log('BEAUTY_OPTIONS:', BEAUTY_OPTIONS);
console.log('AGE_RANGES:', AGE_RANGES);
console.log('GOAL_OPTIONS:', GOAL_OPTIONS);
console.log('data:', data);
```

---

## 📋 **Checklist التشخيص:**

- [ ] شفتي رسالة الخطأ الكاملة في Terminal
- [ ] جربتي Web Mode (`npx expo start --web`)
- [ ] شفتي Metro Bundler logs
- [ ] فحصتي الكود للـ `.map()` بدون تحقق
- [ ] فحصتي Context Providers
- [ ] فحصتي Navigation props
- [ ] جربتي بدون OnboardingScreen
- [ ] فحصتي arrays (BEAUTY_OPTIONS, etc.)
- [ ] أضفتي console.logs
- [ ] جربتي Development Build

---

## 🆘 **إذا ما لقيتي الحل:**

### **أرسلي هذه المعلومات:**

1. **رسالة الخطأ الكاملة** من Terminal
2. **Screenshot** من الخطأ
3. **نتيجة Web Mode** (اشتغل أو لا؟)
4. **آخر 20 سطر** من Metro Bundler logs
5. **إصدار Expo:** `npx expo --version`
6. **إصدار React Native:** `npm list react-native`

---

## 💡 **الحلول الشائعة:**

### **1. إذا المشكلة من Context:**
```typescript
// في AppContext.tsx
const [data, setData] = useState({
  beautyPreferences: [], // تأكدي إنه array فاضي
  goals: [],
  // ...
});
```

### **2. إذا المشكلة من Navigation:**
```typescript
// في الشاشة اللي تستقبل params
const items = route.params?.items || [];
items.map(...)
```

### **3. إذا المشكلة من AsyncStorage:**
```typescript
const stored = await AsyncStorage.getItem('key');
const data = stored ? JSON.parse(stored) : { items: [] };
```

---

## ⚡ **الحل السريع:**

إذا تبين تجربين حل سريع:

```bash
# 1. امسحي كل شي
cd ~/Documents/GitHub/wardaty-app-
rm -rf node_modules .expo .git/index.lock package-lock.json

# 2. ثبتي من جديد
npm install

# 3. شغلي في Web
npx expo start --web

# 4. إذا اشتغل في Web، المشكلة من Expo Go
# احذفي Expo Go من الهاتف وثبتيه من جديد
```

---

**استخدمي هذا الدليل خطوة بخطوة لتحديد المشكلة بالضبط!** 🔍✨
