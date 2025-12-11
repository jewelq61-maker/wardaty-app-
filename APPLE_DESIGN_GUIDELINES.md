# 🍎 WARDATY - APPLE DESIGN GUIDELINES

## Goal: Make Wardaty feel like a native iOS app

---

## 📐 1. TYPOGRAPHY (SF Pro / Tajawal)

### iOS Text Styles (Human Interface Guidelines)

**Large Title:** 34pt, Bold  
**Title 1:** 28pt, Regular  
**Title 2:** 22pt, Regular  
**Title 3:** 20pt, Regular  
**Headline:** 17pt, Semibold  
**Body:** 17pt, Regular  
**Callout:** 16pt, Regular  
**Subhead:** 15pt, Regular  
**Footnote:** 13pt, Regular  
**Caption 1:** 12pt, Regular  
**Caption 2:** 11pt, Regular  

### Wardaty Implementation

```typescript
export const iOSTypography = {
  largeTitle: {
    fontSize: 34,
    fontWeight: "700",
    lineHeight: 41,
    fontFamily: "Tajawal-Bold",
  },
  title1: {
    fontSize: 28,
    fontWeight: "400",
    lineHeight: 34,
    fontFamily: "Tajawal-Regular",
  },
  title2: {
    fontSize: 22,
    fontWeight: "400",
    lineHeight: 28,
    fontFamily: "Tajawal-Regular",
  },
  title3: {
    fontSize: 20,
    fontWeight: "400",
    lineHeight: 25,
    fontFamily: "Tajawal-Regular",
  },
  headline: {
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 22,
    fontFamily: "Tajawal-Bold",
  },
  body: {
    fontSize: 17,
    fontWeight: "400",
    lineHeight: 22,
    fontFamily: "Tajawal-Regular",
  },
  callout: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 21,
    fontFamily: "Tajawal-Regular",
  },
  subheadline: {
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 20,
    fontFamily: "Tajawal-Regular",
  },
  footnote: {
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 18,
    fontFamily: "Tajawal-Regular",
  },
  caption1: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
    fontFamily: "Tajawal-Regular",
  },
  caption2: {
    fontSize: 11,
    fontWeight: "400",
    lineHeight: 13,
    fontFamily: "Tajawal-Regular",
  },
};
```

---

## 📏 2. SPACING (iOS Standard)

### iOS Spacing System

**4pt grid system** (everything is multiple of 4)

```typescript
export const iOSSpacing = {
  xxxs: 2,   // 0.5 × 4
  xxs: 4,    // 1 × 4
  xs: 8,     // 2 × 4
  sm: 12,    // 3 × 4
  md: 16,    // 4 × 4 (most common)
  lg: 20,    // 5 × 4
  xl: 24,    // 6 × 4
  xxl: 32,   // 8 × 4
  xxxl: 44,  // 11 × 4 (min tap target)
  
  // iOS Specific
  screenPadding: 16,        // Standard screen edges
  cardPadding: 16,          // Standard card padding
  listItemPadding: 16,      // List item horizontal padding
  listItemHeight: 44,       // Min list item height
  buttonHeight: 50,         // Standard button height
  inputHeight: 44,          // Standard input height
  tabBarHeight: 49,         // iOS tab bar height
  navigationBarHeight: 44,  // iOS navigation bar height
  statusBarHeight: 20,      // iOS status bar height (non-notch)
};
```

---

## 🎨 3. COLORS (iOS Dark Mode)

### iOS System Colors (Dark Mode)

```typescript
export const iOSSystemColors = {
  // Labels
  label: "rgba(255, 255, 255, 1.0)",              // Primary text
  secondaryLabel: "rgba(235, 235, 245, 0.6)",     // Secondary text
  tertiaryLabel: "rgba(235, 235, 245, 0.3)",      // Tertiary text
  quaternaryLabel: "rgba(235, 235, 245, 0.18)",   // Quaternary text
  
  // Fills (for UI elements)
  systemFill: "rgba(120, 120, 128, 0.36)",
  secondarySystemFill: "rgba(120, 120, 128, 0.32)",
  tertiarySystemFill: "rgba(118, 118, 128, 0.24)",
  quaternarySystemFill: "rgba(118, 118, 128, 0.18)",
  
  // Backgrounds
  systemBackground: "#000000",                     // Primary background
  secondarySystemBackground: "#1C1C1E",            // Grouped background
  tertiarySystemBackground: "#2C2C2E",             // Grouped content background
  
  // Grouped Backgrounds
  systemGroupedBackground: "#000000",
  secondarySystemGroupedBackground: "#1C1C1E",
  tertiarySystemGroupedBackground: "#2C2C2E",
  
  // Separators
  separator: "rgba(84, 84, 88, 0.6)",
  opaqueSeparator: "#38383A",
};
```

### Wardaty Colors (iOS-compliant)

```typescript
export const WardatyiOSColors = {
  // Use iOS system colors as base
  ...iOSSystemColors,
  
  // Wardaty brand colors (overlays)
  primary: "#9A63E8",      // Mother (purple)
  accent: "#FF5FA8",       // Single (pink)
  secondary: "#FF7C7C",    // Married (coral)
  
  // Semantic colors
  period: "#FF3860",
  fertile: "#8C64F0",
  ovulation: "#BA68C8",
};
```

---

## 🎯 4. NAVIGATION PATTERNS

### iOS Navigation Types

**1. Tab Bar Navigation** (Bottom tabs)
- 5 tabs maximum
- Icons + labels
- Selected state with tint color
- Height: 49pt + safe area

**2. Navigation Bar** (Top bar)
- Large title (scrollable)
- Back button (automatic)
- Right bar buttons
- Height: 44pt + safe area

**3. Modal Presentation**
- Sheet style (iOS 15+)
- Card style
- Full screen
- Swipe to dismiss

### Wardaty Implementation

```typescript
// Tab Bar
<Tab.Navigator
  screenOptions={{
    tabBarStyle: {
      height: 49 + insets.bottom,
      backgroundColor: iOSSystemColors.secondarySystemBackground,
      borderTopColor: iOSSystemColors.separator,
      borderTopWidth: 0.5,
    },
    tabBarActiveTintColor: PersonaColors[persona].primary,
    tabBarInactiveTintColor: iOSSystemColors.secondaryLabel,
    tabBarLabelStyle: iOSTypography.caption2,
  }}
>
```

---

## 👆 5. GESTURES & INTERACTIONS

### iOS Standard Gestures

**Tap:** Primary action  
**Long Press:** Context menu (iOS 13+)  
**Swipe:** Navigate back, delete, actions  
**Pinch:** Zoom  
**Pan:** Scroll, drag  

### iOS Haptic Feedback

```typescript
import * as Haptics from "expo-haptics";

// Light tap (buttons, switches)
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// Medium tap (selections)
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// Heavy tap (important actions)
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

// Success
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// Warning
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

// Error
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

// Selection changed
Haptics.selectionAsync();
```

### Wardaty Interactions

```typescript
// Button press
<Pressable
  onPress={() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    handlePress();
  }}
  style={({ pressed }) => [
    styles.button,
    pressed && { opacity: 0.6, transform: [{ scale: 0.98 }] },
  ]}
>
```

---

## 🎬 6. ANIMATIONS & TRANSITIONS

### iOS Animation Curves

**Ease In Out:** Most common (default)  
**Ease In:** Accelerating  
**Ease Out:** Decelerating  
**Linear:** Constant speed  

### iOS Spring Animations

```typescript
import { withSpring } from "react-native-reanimated";

// iOS default spring
const iOSSpring = {
  damping: 20,
  stiffness: 300,
  mass: 1,
};

// Gentle spring
const gentleSpring = {
  damping: 25,
  stiffness: 250,
  mass: 1,
};

// Bouncy spring
const bouncySpring = {
  damping: 15,
  stiffness: 350,
  mass: 1,
};
```

### iOS Timing

```typescript
export const iOSTiming = {
  instant: 0,
  fast: 200,      // Quick actions
  normal: 300,    // Default
  slow: 400,      // Emphasis
  
  // Specific animations
  buttonPress: 100,
  cardAppear: 300,
  modalPresent: 400,
  pageTransition: 350,
};
```

---

## ♿ 7. ACCESSIBILITY

### iOS Accessibility Features

**VoiceOver:** Screen reader  
**Dynamic Type:** Text size adjustment  
**Reduce Motion:** Disable animations  
**Increase Contrast:** Higher contrast colors  
**Reduce Transparency:** Disable blur effects  

### Wardaty Implementation

```typescript
import { AccessibilityInfo } from "react-native";

// Check if VoiceOver is enabled
const [isVoiceOverEnabled, setIsVoiceOverEnabled] = useState(false);

useEffect(() => {
  AccessibilityInfo.isScreenReaderEnabled().then(setIsVoiceOverEnabled);
  
  const subscription = AccessibilityInfo.addEventListener(
    "screenReaderChanged",
    setIsVoiceOverEnabled
  );
  
  return () => subscription.remove();
}, []);

// Accessibility props
<Pressable
  accessible={true}
  accessibilityLabel={t("home", "cycleCard")}
  accessibilityHint={t("home", "tapToViewDetails")}
  accessibilityRole="button"
  accessibilityState={{ selected: isSelected }}
>
```

---

## 📱 8. iOS UI COMPONENTS

### iOS Standard Components

**List:** Grouped or plain style  
**Card:** Rounded corners, shadow  
**Button:** Filled, tinted, plain  
**Toggle:** Switch style  
**Picker:** Wheel or menu style  
**Alert:** Modal dialog  
**Action Sheet:** Bottom sheet  
**Context Menu:** Long press menu  

### Wardaty Components (iOS-styled)

```typescript
// iOS List Item
<View style={styles.listItem}>
  <View style={styles.listItemContent}>
    <ThemedText style={iOSTypography.body}>Title</ThemedText>
    <ThemedText style={iOSTypography.caption1}>Subtitle</ThemedText>
  </View>
  <Feather name="chevron-right" size={20} color={iOSSystemColors.tertiaryLabel} />
</View>

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
    backgroundColor: iOSSystemColors.secondarySystemBackground,
    borderBottomWidth: 0.5,
    borderBottomColor: iOSSystemColors.separator,
  },
});
```

---

## 🎨 9. GLASSMORPHISM (iOS-style)

### iOS Blur Effects

```typescript
import { BlurView } from "expo-blur";

// iOS Material styles
<BlurView
  intensity={80}
  tint="dark"  // or "light", "default"
  style={styles.glassCard}
>
  {/* Content */}
</BlurView>

const styles = StyleSheet.create({
  glassCard: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
});
```

---

## 📐 10. SAFE AREA & LAYOUT

### iOS Safe Area

```typescript
import { useSafeAreaInsets } from "react-native-safe-area-context";

const insets = useSafeAreaInsets();

<View style={{
  paddingTop: insets.top,
  paddingBottom: insets.bottom,
  paddingLeft: insets.left,
  paddingRight: insets.right,
}}>
```

### iOS Layout Guidelines

- **Screen padding:** 16pt from edges
- **Card spacing:** 12pt between cards
- **List items:** 44pt minimum height
- **Buttons:** 44pt minimum tap target
- **Icons:** 20-28pt for UI icons

---

## ✅ WARDATY iOS COMPLIANCE CHECKLIST

### Typography
- [ ] Use iOS text styles (Large Title, Title 1-3, Headline, Body, etc.)
- [ ] Support Dynamic Type
- [ ] Use Tajawal font (Arabic) with proper weights

### Spacing
- [ ] Follow 4pt grid system
- [ ] Use iOS standard spacing (8, 12, 16, 20, 24, 32)
- [ ] 16pt screen padding
- [ ] 44pt minimum tap targets

### Colors
- [ ] Use iOS system colors as base
- [ ] Support Dark Mode properly
- [ ] Persona colors as accents only
- [ ] Proper contrast ratios (WCAG AA)

### Navigation
- [ ] Tab bar: 49pt + safe area
- [ ] 5 tabs maximum
- [ ] Icons + labels
- [ ] Proper selected state

### Interactions
- [ ] Haptic feedback on all interactions
- [ ] Proper button press states (opacity 0.6, scale 0.98)
- [ ] Swipe gestures where appropriate
- [ ] Long press for context menus

### Animations
- [ ] Use iOS spring animations
- [ ] 300ms default timing
- [ ] Respect "Reduce Motion" setting
- [ ] Smooth transitions

### Accessibility
- [ ] VoiceOver support
- [ ] Dynamic Type support
- [ ] Proper accessibility labels
- [ ] Keyboard navigation
- [ ] High contrast support

### Components
- [ ] iOS-style lists
- [ ] iOS-style cards
- [ ] iOS-style buttons
- [ ] iOS-style toggles
- [ ] iOS-style pickers

### Layout
- [ ] Safe area insets
- [ ] Proper scroll behavior
- [ ] Keyboard avoidance
- [ ] Responsive to screen sizes

### Polish
- [ ] Blur effects (glassmorphism)
- [ ] Proper shadows
- [ ] Smooth scrolling
- [ ] Native feel

---

## 🚀 IMPLEMENTATION PRIORITY

### Phase 1: Foundation (High Priority)
1. ✅ Typography system (iOS text styles)
2. ✅ Spacing system (4pt grid)
3. ✅ Color system (iOS system colors)
4. ✅ Safe area handling

### Phase 2: Components (High Priority)
1. ✅ Tab bar (iOS-compliant)
2. ✅ Navigation bar
3. ✅ Buttons (iOS-style)
4. ✅ Cards (iOS-style with blur)
5. ✅ Lists (iOS-style)

### Phase 3: Interactions (Medium Priority)
1. ✅ Haptic feedback
2. ✅ Button press states
3. ✅ Swipe gestures
4. ✅ Long press menus

### Phase 4: Animations (Medium Priority)
1. ✅ Spring animations
2. ✅ Transitions
3. ✅ Reduce Motion support

### Phase 5: Accessibility (Medium Priority)
1. ✅ VoiceOver support
2. ✅ Dynamic Type
3. ✅ High contrast
4. ✅ Keyboard navigation

### Phase 6: Polish (Low Priority)
1. ✅ Blur effects refinement
2. ✅ Shadow refinement
3. ✅ Animation tuning
4. ✅ Performance optimization

---

## 📚 REFERENCES

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [iOS Design Themes](https://developer.apple.com/design/human-interface-guidelines/design-themes)
- [iOS Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
- [iOS Color](https://developer.apple.com/design/human-interface-guidelines/color)
- [iOS Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
- [iOS Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)

---

**Last Updated:** 2025-12-11 15:45 GMT+3
