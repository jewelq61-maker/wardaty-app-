# Calendar Screen Refactor Guide 📅

## Overview
This guide shows how to apply Apple-inspired glassmorphism and persona colors to the Calendar screen.

---

## ✅ **Changes Already Applied:**

### **1. Imports Updated:**
```typescript
// OLD
import { useTheme } from "../hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "../constants/theme";

// NEW ✅
import { useRTL } from "../hooks/useRTL";
import { DarkTheme, GlassEffects, Typography, Spacing, BorderRadius, Shadows, getPersonaColor } from "../constants/theme";
```

### **2. Hooks Updated:**
```typescript
// OLD
const { theme } = useTheme() as { theme: ThemeColors };

// NEW ✅
const rtl = useRTL();
const personaColor = getPersonaColor(persona || "single");
```

---

## 🎨 **Key Changes Needed:**

### **1. Replace ThemeColors with DarkTheme**

**Throughout the file, replace:**
```typescript
// OLD
theme.text → DarkTheme.text.primary
theme.textSecondary → DarkTheme.text.secondary
theme.backgroundRoot → DarkTheme.background.root
theme.backgroundDefault → DarkTheme.background.default
theme.backgroundSecondary → DarkTheme.background.elevated
theme.cardBorder → GlassEffects.border
theme.glassBackground → GlassEffects.background
theme.glassBorder → GlassEffects.border
```

### **2. Apply Persona Colors**

**Replace hardcoded colors with persona colors:**
```typescript
// OLD
theme.primary → personaColor.primary
theme.primaryLight → personaColor.light
theme.period → personaColor.primary
theme.fertile → personaColor.light
theme.ovulation → personaColor.primary
```

### **3. Month Header Glassmorphism**

**Update month header card:**
```typescript
// OLD
<View style={[styles.monthHeader, { backgroundColor: theme.backgroundDefault }]}>

// NEW
<View style={[styles.monthHeader, styles.glassCard]}>
  {Platform.OS === "ios" ? (
    <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
  ) : (
    <View style={[StyleSheet.absoluteFill, styles.glassBackground]} />
  )}
  {/* Content */}
</View>
```

### **4. Calendar Grid Glassmorphism**

**Update calendar container:**
```typescript
// OLD
<View style={[styles.calendarContainer, { backgroundColor: theme.backgroundDefault }]}>

// NEW
<View style={[styles.calendarContainer, styles.glassCard]}>
  {Platform.OS === "ios" ? (
    <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
  ) : (
    <View style={[StyleSheet.absoluteFill, styles.glassBackground]} />
  )}
  {/* Calendar grid */}
</View>
```

### **5. Day Cell Colors**

**Update MonthDayCell to use persona colors:**
```typescript
// Period day
backgroundColor: isPeriod ? personaColor.soft : "transparent"
borderColor: isPeriod ? personaColor.primary : "transparent"

// Ovulation day
backgroundColor: isOvulation ? personaColor.light + "40" : "transparent"
borderColor: isOvulation ? personaColor.primary : "transparent"

// Fertile window
backgroundColor: isFertile ? personaColor.soft : "transparent"

// Selected day
backgroundColor: isSelected ? personaColor.primary : "transparent"

// Today
borderColor: isToday ? personaColor.primary : "transparent"
```

### **6. Day Info Panel Glassmorphism**

**Update day info bottom panel:**
```typescript
// OLD
<View style={[styles.dayInfoPanel, { backgroundColor: theme.backgroundDefault }]}>

// NEW
<View style={[styles.dayInfoPanel, styles.glassCard]}>
  {Platform.OS === "ios" ? (
    <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
  ) : (
    <View style={[StyleSheet.absoluteFill, styles.glassBackground]} />
  )}
  {/* Day info content */}
</View>
```

### **7. Modal Glassmorphism**

**Update log modal:**
```typescript
// OLD
<View style={[styles.modalContent, { backgroundColor: theme.backgroundDefault }]}>

// NEW
<View style={[styles.modalContent, styles.glassCard]}>
  {Platform.OS === "ios" ? (
    <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
  ) : (
    <View style={[StyleSheet.absoluteFill, styles.glassBackground]} />
  )}
  {/* Modal content */}
</View>
```

### **8. Flow Selector Persona Colors**

**Update FlowSelector component:**
```typescript
// Selected flow option
backgroundColor: isSelected ? personaColor.soft : GlassEffects.background
borderColor: isSelected ? personaColor.primary : GlassEffects.border

// Droplet icon
color: isSelected ? personaColor.primary : DarkTheme.text.secondary
```

### **9. Todo Items Persona Colors**

**Update TodoItem component:**
```typescript
// Completed checkbox
backgroundColor: isCompleted ? personaColor.primary : "transparent"
borderColor: isCompleted ? personaColor.primary : GlassEffects.border

// Category dot
backgroundColor: personaColor.primary
```

### **10. Phase Indicators**

**Update phase indicator colors:**
```typescript
const phaseColors = {
  period: personaColor.primary,
  follicular: personaColor.light,
  ovulation: personaColor.primary,
  luteal: personaColor.dark,
};
```

---

## 📐 **StyleSheet Updates:**

### **Add Glass Card Styles:**
```typescript
glassCard: {
  position: "relative",
  overflow: "hidden",
  borderRadius: BorderRadius.lg,
  borderWidth: 1,
  borderColor: GlassEffects.border,
},
glassBackground: {
  backgroundColor: GlassEffects.background,
},
```

### **Update Month Header:**
```typescript
monthHeader: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  padding: Spacing.md,
  marginBottom: Spacing.md,
  borderRadius: BorderRadius.lg,
  ...Shadows.medium,
},
```

### **Update Calendar Container:**
```typescript
calendarContainer: {
  padding: Spacing.md,
  borderRadius: BorderRadius.xl,
  marginBottom: Spacing.md,
  ...Shadows.large,
},
```

### **Update Day Info Panel:**
```typescript
dayInfoPanel: {
  padding: Spacing.lg,
  borderTopLeftRadius: BorderRadius.xl,
  borderTopRightRadius: BorderRadius.xl,
  ...Shadows.large,
},
```

### **Update Modal Content:**
```typescript
modalContent: {
  margin: Spacing.lg,
  padding: Spacing.xl,
  borderRadius: BorderRadius.xl,
  ...Shadows.xlarge,
},
```

---

## 🔄 **RTL Support:**

### **Update Layout Directions:**
```typescript
// Month navigation
<View style={[styles.monthNav, { flexDirection: rtl.flexDirection }]}>
  <Pressable onPress={handlePrevMonth}>
    <Feather name={rtl.isRTL ? "chevron-right" : "chevron-left"} />
  </Pressable>
  <Text>{monthName}</Text>
  <Pressable onPress={handleNextMonth}>
    <Feather name={rtl.isRTL ? "chevron-left" : "chevron-right"} />
  </Pressable>
</View>

// Day info text
<Text style={[styles.dayInfoText, { textAlign: rtl.textAlign }]}>
  {text}
</Text>

// Todo items
<View style={[styles.todoItem, { flexDirection: rtl.flexDirection }]}>
  {/* Content */}
</View>
```

---

## 🎯 **Color Mapping:**

### **Persona Color Usage:**

| Element | Color Property |
|---------|----------------|
| Period days | `personaColor.primary` (background), `personaColor.soft` (light bg) |
| Ovulation days | `personaColor.primary` (border), `personaColor.light + "40"` (bg) |
| Fertile window | `personaColor.soft` (background) |
| Selected day | `personaColor.primary` (background) |
| Today border | `personaColor.primary` (border) |
| Flow selector | `personaColor.primary` (selected), `personaColor.soft` (bg) |
| Todo checkbox | `personaColor.primary` (completed) |
| Phase indicators | `personaColor.primary/light/dark` |
| Action buttons | `personaColor.primary` (background) |

### **Dark Theme Usage:**

| Element | Color Property |
|---------|----------------|
| Background | `DarkTheme.background.root` |
| Cards | `DarkTheme.background.elevated` |
| Primary text | `DarkTheme.text.primary` |
| Secondary text | `DarkTheme.text.secondary` |
| Tertiary text | `DarkTheme.text.tertiary` |
| Borders | `GlassEffects.border` |
| Glass background | `GlassEffects.background` |

---

## ✅ **Testing Checklist:**

### **Visual:**
- [ ] Month header has glass effect
- [ ] Calendar grid has glass background
- [ ] Day cells use persona colors
- [ ] Period days are persona-colored
- [ ] Ovulation days are highlighted
- [ ] Selected day is persona-colored
- [ ] Today has persona-colored border
- [ ] Day info panel has glass effect
- [ ] Modal has glass background
- [ ] Flow selector uses persona colors
- [ ] Todo items use persona colors

### **RTL/LTR:**
- [ ] Month navigation arrows flip
- [ ] Text aligns correctly
- [ ] Todo items mirror
- [ ] Modal content aligns correctly

### **Persona Colors:**
- [ ] Single persona: Pink (#FF6B9D)
- [ ] Married persona: Coral (#FF8D8D)
- [ ] Mother persona: Purple (#A684F5)
- [ ] Partner persona: Blue (#7EC8E3)

---

## 📝 **Implementation Steps:**

1. ✅ **Update imports** (Done)
2. ✅ **Add persona color hook** (Done)
3. **Replace theme colors with DarkTheme**
4. **Apply persona colors to day cells**
5. **Add glassmorphism to cards**
6. **Update flow selector**
7. **Update todo items**
8. **Add RTL support**
9. **Update styles**
10. **Test all personas**
11. **Test RTL/LTR**
12. **Commit changes**

---

## 🚀 **Quick Reference:**

### **Glass Card Pattern:**
```typescript
<View style={[styles.card, styles.glassCard]}>
  {Platform.OS === "ios" ? (
    <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
  ) : (
    <View style={[StyleSheet.absoluteFill, styles.glassBackground]} />
  )}
  {/* Content */}
</View>
```

### **Persona Color Pattern:**
```typescript
const personaColor = getPersonaColor(persona || "single");

// Use in styles
backgroundColor: personaColor.primary
backgroundColor: personaColor.soft  // 15% opacity
backgroundColor: personaColor.light
borderColor: personaColor.primary
color: personaColor.primary
```

### **RTL Pattern:**
```typescript
const rtl = useRTL();

// Use in styles
flexDirection: rtl.flexDirection
textAlign: rtl.textAlign

// Use in icons
name={rtl.isRTL ? "chevron-left" : "chevron-right"}
```

---

**Status:** Guide created, implementation in progress  
**Next:** Apply changes systematically to CalendarScreen.tsx
