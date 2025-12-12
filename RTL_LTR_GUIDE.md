# RTL/LTR Complete Guide 🌍

## Overview
Wardaty app supports **100% RTL for Arabic** and **100% LTR for English** with automatic direction switching.

---

## ✅ **Global Direction System**

### **1. I18nManager Setup**

The app uses React Native's `I18nManager` for global RTL/LTR control:

```typescript
// hooks/useLanguage.ts
useEffect(() => {
  const shouldBeRTL = language === "ar";
  if (I18nManager.isRTL !== shouldBeRTL) {
    I18nManager.allowRTL(shouldBeRTL);
    I18nManager.forceRTL(shouldBeRTL);
  }
}, [language]);
```

### **2. Platform-Specific Handling**

#### **iOS/Android:**
- RTL is set globally via `I18nManager`
- App needs reload for direction change to take full effect
- Navigation automatically mirrors

#### **Web:**
- Direction changes immediately via DOM:
```typescript
document.documentElement.dir = shouldBeRTL ? "rtl" : "ltr";
document.documentElement.lang = language;
document.body.style.direction = shouldBeRTL ? "rtl" : "ltr";
```

---

## 🎯 **Layout Utilities**

### **useRTL Hook**

Comprehensive hook for all RTL/LTR layout needs:

```typescript
import { useRTL } from "../hooks/useRTL";

function MyComponent() {
  const rtl = useRTL();
  
  return (
    <View style={{ flexDirection: rtl.flexDirection }}>
      <Text style={{ textAlign: rtl.textAlign }}>Hello</Text>
    </View>
  );
}
```

### **Available Properties:**

```typescript
{
  // Core
  isRTL: boolean,
  isLTR: boolean,
  language: "ar" | "en",
  
  // Flex
  flexDirection: "row" | "row-reverse",
  flexDirectionReverse: "row-reverse" | "row",
  
  // Text
  textAlign: "left" | "right",
  textAlignReverse: "right" | "left",
  
  // Alignment
  alignSelf: "flex-start" | "flex-end",
  alignSelfEnd: "flex-end" | "flex-start",
  
  // Margins
  marginStart: "marginLeft" | "marginRight",
  marginEnd: "marginRight" | "marginLeft",
  
  // Padding
  paddingStart: "paddingLeft" | "paddingRight",
  paddingEnd: "paddingRight" | "paddingLeft",
  
  // Borders
  borderStart: "borderLeftWidth" | "borderRightWidth",
  borderEnd: "borderRightWidth" | "borderLeftWidth",
  
  // Positioning
  left: "left" | "right",
  right: "right" | "left",
  start: "left" | "right",
  end: "right" | "left",
  
  // Transform (for icons)
  transform: { scaleX: -1 | 1 },
  
  // Helpers
  select: (ltr, rtl) => value,
  ms: (value) => { marginLeft/Right: value },
  me: (value) => { marginRight/Left: value },
  ps: (value) => { paddingLeft/Right: value },
  pe: (value) => { paddingRight/Left: value },
}
```

---

## 📐 **Layout Patterns**

### **1. Horizontal Layouts**

```typescript
// ✅ CORRECT
const rtl = useRTL();
<View style={{ flexDirection: rtl.flexDirection }}>
  <Icon />
  <Text />
</View>

// ❌ WRONG
<View style={{ flexDirection: "row" }}>
  <Icon />
  <Text />
</View>
```

### **2. Text Alignment**

```typescript
// ✅ CORRECT
const rtl = useRTL();
<Text style={{ textAlign: rtl.textAlign }}>
  {text}
</Text>

// ❌ WRONG
<Text style={{ textAlign: "left" }}>
  {text}
</Text>
```

### **3. Margins/Padding**

```typescript
// ✅ CORRECT - Using helpers
const rtl = useRTL();
<View style={[styles.container, rtl.ms(16)]}>
  <Text />
</View>

// ✅ CORRECT - Using properties
<View style={{ [rtl.marginStart]: 16 }}>
  <Text />
</View>

// ❌ WRONG
<View style={{ marginLeft: 16 }}>
  <Text />
</View>
```

### **4. Icons That Need Flipping**

```typescript
// ✅ CORRECT - Directional icons
const rtl = useRTL();
<Feather 
  name={rtl.isRTL ? "arrow-left" : "arrow-right"}
  style={{ transform: [rtl.transform] }}
/>

// ✅ CORRECT - Non-directional icons (no flip needed)
<Feather name="heart" />
```

---

## 🧩 **Component Examples**

### **List Item with Icon**

```typescript
function ListItem({ icon, title, onPress }) {
  const rtl = useRTL();
  
  return (
    <Pressable 
      style={[
        styles.item,
        { flexDirection: rtl.flexDirection }
      ]}
      onPress={onPress}
    >
      <Feather name={icon} size={24} />
      <Text style={[styles.title, { textAlign: rtl.textAlign }]}>
        {title}
      </Text>
      <Feather 
        name={rtl.isRTL ? "chevron-left" : "chevron-right"}
        size={20}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 16,
    alignItems: "center",
    gap: 12,
  },
});
```

### **Form Input**

```typescript
function FormInput({ label, value, onChange }) {
  const rtl = useRTL();
  
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { textAlign: rtl.textAlign }]}>
        {label}
      </Text>
      <TextInput
        style={[styles.input, { textAlign: rtl.textAlign }]}
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
}
```

### **Card with Header**

```typescript
function Card({ title, children }) {
  const rtl = useRTL();
  
  return (
    <View style={styles.card}>
      <View style={[styles.header, { flexDirection: rtl.flexDirection }]}>
        <Text style={[styles.title, { textAlign: rtl.textAlign }]}>
          {title}
        </Text>
        <Feather 
          name="more-horizontal"
          size={20}
        />
      </View>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}
```

---

## 🗓️ **Calendar & Dates**

### **Date Formatting**

```typescript
const rtl = useRTL();

// Format dates based on locale
const formattedDate = date.toLocaleDateString(
  rtl.isRTL ? "ar-SA" : "en-US",
  { year: "numeric", month: "long", day: "numeric" }
);
```

### **Calendar Layout**

```typescript
// Calendar grids should mirror in RTL
<View style={[
  styles.calendarGrid,
  { flexDirection: rtl.flexDirection }
]}>
  {days.map(day => (
    <View key={day} style={styles.dayCell}>
      <Text>{day}</Text>
    </View>
  ))}
</View>
```

---

## 🧭 **Navigation**

### **Back Button**

Navigation back buttons automatically flip in RTL:

```typescript
// React Navigation handles this automatically
<Stack.Screen
  name="Details"
  component={DetailsScreen}
  options={{
    headerBackTitle: rtl.isRTL ? "رجوع" : "Back",
  }}
/>
```

### **Tab Bar**

Tab bars automatically mirror:

```typescript
// MainTabNavigator.tsx
// Icons and labels automatically position correctly
<Tab.Navigator>
  <Tab.Screen name="Home" />
  <Tab.Screen name="Calendar" />
  <Tab.Screen name="Profile" />
</Tab.Navigator>
```

---

## 📱 **Platform-Specific Notes**

### **iOS**

- ✅ Full RTL support built-in
- ✅ Navigation gestures work correctly
- ✅ System fonts support Arabic
- ✅ Safe areas handled automatically

### **Android**

- ✅ RTL support since API 17
- ✅ Requires `android:supportsRtl="true"` in AndroidManifest.xml
- ✅ Material components auto-mirror
- ✅ Edge-to-edge layouts supported

### **Web**

- ✅ CSS `dir` attribute
- ✅ Logical properties (`margin-inline-start`, etc.)
- ✅ Instant direction switching
- ✅ No reload required

---

## ✅ **Testing Checklist**

### **Visual Testing:**
- [ ] All text aligns correctly (right for Arabic, left for English)
- [ ] Icons and images are in correct positions
- [ ] Arrows and chevrons point correctly
- [ ] Forms and inputs align properly
- [ ] Lists and grids mirror correctly
- [ ] Navigation flows naturally

### **Functional Testing:**
- [ ] Language switch works without restart (web)
- [ ] Back navigation works correctly
- [ ] Swipe gestures work in correct direction
- [ ] Modals and overlays position correctly
- [ ] Tooltips and popovers appear on correct side

### **Component Testing:**
- [ ] Home screen
- [ ] Calendar screen
- [ ] Beauty screen
- [ ] Profile screen
- [ ] Settings screen
- [ ] Onboarding flow
- [ ] Forms and inputs
- [ ] Modals and sheets
- [ ] Tab bar
- [ ] Navigation bar

---

## 🚫 **Common Mistakes**

### **1. Hardcoded Directions**

```typescript
// ❌ WRONG
<View style={{ flexDirection: "row" }}>

// ✅ CORRECT
const rtl = useRTL();
<View style={{ flexDirection: rtl.flexDirection }}>
```

### **2. Hardcoded Alignment**

```typescript
// ❌ WRONG
<Text style={{ textAlign: "left" }}>

// ✅ CORRECT
const rtl = useRTL();
<Text style={{ textAlign: rtl.textAlign }}>
```

### **3. Hardcoded Margins**

```typescript
// ❌ WRONG
<View style={{ marginLeft: 16 }}>

// ✅ CORRECT
const rtl = useRTL();
<View style={rtl.ms(16)}>
```

### **4. Wrong Icon Direction**

```typescript
// ❌ WRONG
<Feather name="arrow-right" />

// ✅ CORRECT
const rtl = useRTL();
<Feather name={rtl.isRTL ? "arrow-left" : "arrow-right"} />
```

### **5. Not Flipping Directional Icons**

```typescript
// ❌ WRONG - Icon doesn't flip
<Feather name="chevron-right" />

// ✅ CORRECT - Icon flips based on language
const rtl = useRTL();
<Feather name={rtl.isRTL ? "chevron-left" : "chevron-right"} />
```

---

## 📚 **Best Practices**

### **1. Use Logical Properties**

Always use start/end instead of left/right:
- `marginStart` instead of `marginLeft`
- `paddingEnd` instead of `paddingRight`
- `borderStart` instead of `borderLeft`

### **2. Test Both Languages**

Always test every screen in both Arabic and English:
```typescript
// Quick language switch for testing
const { setLanguage } = useLanguage();
setLanguage("ar"); // Test RTL
setLanguage("en"); // Test LTR
```

### **3. Use Layout Hook Consistently**

Import and use `useRTL` in every component that has layout:
```typescript
import { useRTL } from "../hooks/useRTL";

function MyComponent() {
  const rtl = useRTL();
  // Use rtl.* throughout
}
```

### **4. Avoid Absolute Positioning**

Absolute positioning doesn't auto-mirror. If you must use it:
```typescript
const rtl = useRTL();
<View style={{
  position: "absolute",
  [rtl.start]: 16, // Not "left: 16"
}}>
```

### **5. Document RTL Behavior**

Add comments for complex RTL logic:
```typescript
// This icon flips in RTL because it's directional
<Feather name={rtl.isRTL ? "arrow-left" : "arrow-right"} />

// This icon doesn't flip because it's not directional
<Feather name="heart" />
```

---

## 🎨 **Typography & Fonts**

### **Arabic Font Support**

Wardaty uses **Tajawal** font family for Arabic:
```typescript
{
  fontFamily: "Tajawal-Regular",  // 400
  fontFamily: "Tajawal-Bold",     // 700
}
```

### **Letter Spacing**

Arabic text doesn't use letter spacing:
```typescript
const rtl = useRTL();
<Text style={{
  letterSpacing: rtl.isRTL ? 0 : -0.41,
}}>
```

---

## 🔧 **Debugging RTL Issues**

### **1. Check I18nManager**

```typescript
import { I18nManager } from "react-native";
console.log("Is RTL:", I18nManager.isRTL);
```

### **2. Visual Debugging**

Add borders to see layout direction:
```typescript
<View style={{
  borderWidth: 1,
  borderColor: "red",
  flexDirection: rtl.flexDirection,
}}>
```

### **3. Use React DevTools**

Inspect component props to verify RTL values are correct.

---

## ✅ **Status**

### **Fully RTL-Compliant:**
- ✅ Global direction system (I18nManager)
- ✅ useRTL hook for layouts
- ✅ useLanguage hook for translations
- ✅ Navigation (auto-mirroring)
- ✅ Tab bar (auto-mirroring)
- ✅ Onboarding screens
- ✅ Form inputs
- ✅ Date formatting

### **Platform Support:**
- ✅ iOS: Full RTL support
- ✅ Android: Full RTL support
- ✅ Web: Full RTL support with instant switching

---

**Last Updated:** 2024  
**Wardaty Version:** 2.0+  
**Status:** ✅ 100% RTL/LTR Compliant
