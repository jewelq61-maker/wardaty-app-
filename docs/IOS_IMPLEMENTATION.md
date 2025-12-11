# Wardaty - iOS Implementation Guide

**Version:** 1.0.0  
**Date:** December 11, 2025  
**Status:** ✅ Complete

---

## 📱 Overview

Wardaty is a comprehensive women's health tracking app designed specifically for Muslim women. This implementation follows Apple Human Interface Guidelines to provide a native iOS experience with full RTL/LTR support for Arabic and English languages.

---

## 🎨 Design System

### Typography

The app uses iOS standard text styles throughout, ensuring consistency with native iOS apps.

**Text Styles:**
```typescript
import { Theme } from "@/constants/theme";

// Large Title (34pt, Bold)
<ThemedText style={Theme.typography.largeTitle}>
  Welcome
</ThemedText>

// Title 1 (28pt, Regular)
<ThemedText style={Theme.typography.title1}>
  Section Title
</ThemedText>

// Headline (17pt, Semibold)
<ThemedText style={Theme.typography.headline}>
  Card Title
</ThemedText>

// Body (17pt, Regular)
<ThemedText style={Theme.typography.body}>
  Body text content
</ThemedText>

// Callout (16pt, Regular)
<ThemedText style={Theme.typography.callout}>
  Secondary content
</ThemedText>

// Footnote (13pt, Regular)
<ThemedText style={Theme.typography.footnote}>
  Small details
</ThemedText>

// Caption (12pt, Regular)
<ThemedText style={Theme.typography.caption1}>
  Metadata
</ThemedText>
```

### Spacing

All spacing follows the iOS 4pt grid system.

**Spacing Scale:**
```typescript
import { Theme } from "@/constants/theme";

// 4pt grid
Theme.spacing.xxxs  // 2pt
Theme.spacing.xxs   // 4pt
Theme.spacing.xs    // 8pt
Theme.spacing.sm    // 12pt
Theme.spacing.md    // 16pt (most common)
Theme.spacing.lg    // 20pt
Theme.spacing.xl    // 24pt
Theme.spacing.xxl   // 32pt
Theme.spacing.xxxl  // 44pt (min tap target)

// iOS specific
Theme.spacing.screenPadding        // 16pt
Theme.spacing.cardPadding          // 16pt
Theme.spacing.listItemHeight       // 44pt
Theme.spacing.buttonHeight         // 50pt
Theme.spacing.tabBarHeight         // 49pt
Theme.spacing.navigationBarHeight  // 44pt
```

**Usage:**
```typescript
<View style={{ padding: Theme.spacing.md }}>
  <View style={{ marginBottom: Theme.spacing.sm }}>
    <ThemedText>Content</ThemedText>
  </View>
</View>
```

### Colors

All colors use the unified theme system with persona-based accents.

**Theme Colors:**
```typescript
import { Theme } from "@/constants/theme";

// Dark theme
Theme.dark.background.root      // #0F0820
Theme.dark.background.elevated  // #1A1330
Theme.dark.background.card      // #251B40

Theme.dark.text.primary         // #FFFFFF
Theme.dark.text.secondary       // rgba(255, 255, 255, 0.7)
Theme.dark.text.tertiary        // rgba(255, 255, 255, 0.5)

Theme.dark.border.subtle        // rgba(255, 255, 255, 0.1)
Theme.dark.border.default       // rgba(255, 255, 255, 0.2)

// Persona colors
const personaColor = Theme.getPersonaColor("single");
personaColor.primary   // #FF5FA8
personaColor.light     // #FF8FC4
personaColor.dark      // #E54D96
personaColor.glow      // rgba(255, 95, 168, 0.4)
personaColor.gradient  // ["#FF5FA8", "#FF8FC4"]

// Semantic colors
Theme.semantic.success  // #06D6A0
Theme.semantic.warning  // #FFB703
Theme.semantic.error    // #EF476F
Theme.semantic.info     // #4CC9F0
```

**Usage:**
```typescript
<View style={{
  backgroundColor: Theme.dark.background.card,
  borderColor: Theme.dark.border.subtle,
  borderWidth: 1,
}}>
  <ThemedText style={{ color: Theme.dark.text.primary }}>
    Content
  </ThemedText>
</View>
```

### Glassmorphism

The app uses glassmorphism effects for cards and overlays.

**Glass Effects:**
```typescript
import { Theme } from "@/constants/theme";

// Light glass
<View style={{
  ...Theme.glass.light,
  borderRadius: Theme.borderRadius.large,
}}>
  <ThemedText>Content</ThemedText>
</View>

// Create glass with persona glow
const glassStyle = Theme.createGlassStyle("single", "medium");
<View style={[glassStyle, { borderRadius: Theme.borderRadius.large }]}>
  <ThemedText>Content</ThemedText>
</View>
```

---

## 🎭 Animations

### Using Animation Utilities

```typescript
import { AnimationUtils } from "@/lib/animations";
import { useSharedValue, useAnimatedStyle } from "react-native-reanimated";

function MyComponent() {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  // Fade in with delay
  useEffect(() => {
    opacity.value = AnimationUtils.fadeIn(200);
    scale.value = AnimationUtils.scaleIn(200);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <ThemedText>Animated Content</ThemedText>
    </Animated.View>
  );
}
```

### Common Animations

```typescript
// Spring animations
AnimationUtils.spring(1)           // Default spring
AnimationUtils.springGentle(1)     // Gentle spring
AnimationUtils.springBouncy(1)     // Bouncy spring

// Timing animations
AnimationUtils.timingFast(1)       // 200ms
AnimationUtils.timingNormal(1)     // 300ms
AnimationUtils.timingSlow(1)       // 400ms

// Common patterns
AnimationUtils.fadeIn(delay)       // Fade in
AnimationUtils.fadeOut(delay)      // Fade out
AnimationUtils.scaleIn(delay)      // Scale in
AnimationUtils.scaleOut(delay)     // Scale out
AnimationUtils.bounce()            // Bounce effect
AnimationUtils.shake(10)           // Shake effect
AnimationUtils.pulse()             // Pulse (repeating)
AnimationUtils.glow()              // Glow (repeating)

// Button animations
AnimationUtils.buttonPress()       // Button press
AnimationUtils.buttonSuccess()     // Success feedback
AnimationUtils.buttonError()       // Error feedback

// Card animations
AnimationUtils.cardPress()         // Card press
AnimationUtils.cardAppear(delay)   // Card appear

// List animations
AnimationUtils.staggerItem(index, baseDelay, itemDelay)
```

---

## 🎯 Haptic Feedback

### Using Haptic Utilities

```typescript
import { HapticsUtils } from "@/lib/haptics";

// Light impact (buttons, toggles)
await HapticsUtils.light();

// Medium impact (swipes, dismissals)
await HapticsUtils.medium();

// Heavy impact (deletions, confirmations)
await HapticsUtils.heavy();

// Selection (picker changes, tab switches)
await HapticsUtils.selection();

// Notifications
await HapticsUtils.success();
await HapticsUtils.warning();
await HapticsUtils.error();

// Specialized functions
await HapticsUtils.buttonPress();
await HapticsUtils.tabChange();
await HapticsUtils.toggle();
await HapticsUtils.deleteAction();
await HapticsUtils.saveAction();
```

### Using Pressable with Haptic

```typescript
import { ButtonPressable, CardPressable, TabPressable } from "@/components/PressableWithHaptic";

// Button with light haptic + scale
<ButtonPressable onPress={handlePress}>
  <ThemedText>Press Me</ThemedText>
</ButtonPressable>

// Card with light haptic + subtle scale
<CardPressable onPress={handlePress}>
  <ThemedText>Card Content</ThemedText>
</CardPressable>

// Tab with selection haptic + opacity
<TabPressable onPress={handlePress}>
  <ThemedText>Tab</ThemedText>
</TabPressable>

// Custom configuration
<PressableWithHaptic
  hapticType="medium"
  scaleOnPress={true}
  scaleValue={0.95}
  onPress={handlePress}
>
  <ThemedText>Custom</ThemedText>
</PressableWithHaptic>
```

---

## 🌐 RTL/LTR Support

### Using Layout Direction

```typescript
import { useLayout } from "@/lib/ThemePersonaContext";

function MyComponent() {
  const layout = useLayout();

  return (
    <View style={{ flexDirection: layout.flexDirection }}>
      <ThemedText style={{ textAlign: layout.textAlign }}>
        This text aligns correctly in both RTL and LTR
      </ThemedText>
    </View>
  );
}
```

### Layout Properties

```typescript
layout.isRTL                    // boolean
layout.flexDirection            // "row" | "row-reverse"
layout.flexDirectionReverse     // "row-reverse" | "row"
layout.textAlign                // "left" | "right"
layout.alignSelf                // "flex-start" | "flex-end"
layout.alignSelfEnd             // "flex-end" | "flex-start"
layout.marginStart              // "marginLeft" | "marginRight"
layout.marginEnd                // "marginRight" | "marginLeft"
layout.paddingStart             // "paddingLeft" | "paddingRight"
layout.paddingEnd               // "paddingRight" | "paddingLeft"
```

### Using RTL Utilities

```typescript
import { RTLUtils } from "@/lib/rtl-utils";

// Check RTL
const isRTL = RTLUtils.isRTL();

// Get flex direction
const flexDirection = RTLUtils.getFlexDirection();

// Get text alignment
const textAlign = RTLUtils.getTextAlign();

// Create directional styles
const marginStartStyle = RTLUtils.marginStart(16);
const paddingEndStyle = RTLUtils.paddingEnd(16);

// Icon mirroring
const shouldMirror = RTLUtils.shouldMirrorIcon("arrow-right");
const iconTransform = RTLUtils.getIconTransform("arrow-right");
```

---

## 🎨 Persona System

### Using Persona Colors

```typescript
import { Theme } from "@/constants/theme";
import { useApp } from "@/lib/AppContext";

function MyComponent() {
  const { data } = useApp();
  const persona = data.settings.persona; // "single" | "married" | "mother" | "partner"
  
  const personaColor = Theme.getPersonaColor(persona);

  return (
    <View style={{ backgroundColor: personaColor.glow }}>
      <ThemedText style={{ color: personaColor.primary }}>
        Persona-colored text
      </ThemedText>
    </View>
  );
}
```

### Persona Colors

**Single (Pink):**
- Primary: #FF5FA8
- Light: #FF8FC4
- Dark: #E54D96

**Married (Purple):**
- Primary: #9D4EDD
- Light: #C77DFF
- Dark: #7B2CBF

**Mother (Blue):**
- Primary: #4CC9F0
- Light: #72D7F7
- Dark: #3AA5D1

**Partner (Teal):**
- Primary: #06D6A0
- Light: #38E4B7
- Dark: #05B385

---

## 🧭 Navigation

### Tab Bar

The app uses a custom iOS-compliant tab bar with:
- BlurView background (iOS)
- Proper height (49pt + safe area)
- Persona-colored active tabs
- Haptic feedback on tab change
- Centered FAB button

### Screen Options

```typescript
import { useScreenOptions } from "@/hooks/useScreenOptions";

function MyStack() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="MyScreen" component={MyScreen} />
    </Stack.Navigator>
  );
}
```

---

## 📱 Screen Examples

### HomeScreen Structure

```typescript
<ScrollView>
  {/* Header */}
  <View style={styles.header}>
    <ThemedText style={Theme.typography.subheadline}>
      {greeting}
    </ThemedText>
    <ThemedText style={Theme.typography.largeTitle}>
      {userName}
    </ThemedText>
  </View>

  {/* Cycle/Pregnancy Card */}
  <Pressable style={styles.cycleCard}>
    <LinearGradient colors={personaColor.gradient}>
      {/* Content */}
    </LinearGradient>
  </Pressable>

  {/* Quick Actions */}
  <View style={styles.actionsGrid}>
    {quickActions.map((action) => (
      <ButtonPressable key={action.id} onPress={() => navigate(action.screen)}>
        {/* Action card */}
      </ButtonPressable>
    ))}
  </View>

  {/* Featured Articles */}
  <View style={styles.section}>
    <ThemedText style={Theme.typography.title3}>
      Featured Articles
    </ThemedText>
    {articles.map((article) => (
      <CardPressable key={article.id} onPress={() => navigate("ArticleDetail", { articleId: article.id })}>
        {/* Article card */}
      </CardPressable>
    ))}
  </View>
</ScrollView>
```

---

## 🔧 Best Practices

### Typography
- Always use `Theme.typography.*` for text styles
- Never use hardcoded font sizes
- Use appropriate text styles for hierarchy

### Spacing
- Always use `Theme.spacing.*` for spacing
- Follow 4pt grid system
- Use consistent spacing throughout

### Colors
- Never use inline color values
- Always use `Theme.dark.*` or `Theme.persona.*`
- Use semantic colors for status indicators

### Animations
- Use `AnimationUtils.*` for animations
- Keep animations under 400ms
- Use spring animations for natural feel

### Haptics
- Use `HapticsUtils.*` for haptic feedback
- Light haptic for buttons and toggles
- Heavy haptic for destructive actions
- Selection haptic for pickers and tabs

### RTL/LTR
- Always use `layout.*` for directional properties
- Use `RTLUtils.*` for complex layouts
- Mirror directional icons in RTL

### Persona
- Use `Theme.getPersonaColor()` for persona colors
- Apply persona colors to accents, not backgrounds
- Keep persona colors consistent

---

## 📚 File Structure

```
wardaty-app-/
├── constants/
│   ├── ios-tokens.ts          # iOS design tokens
│   └── theme.ts               # Unified theme system
├── lib/
│   ├── haptics.ts             # Haptic utilities
│   ├── animations.ts          # Animation utilities
│   └── rtl-utils.ts           # RTL/LTR utilities
├── components/
│   └── PressableWithHaptic.tsx # Pressable with haptics
├── screens/
│   ├── HomeScreen.tsx         # Home screen
│   ├── ArticlesScreen.tsx     # Articles list
│   └── ...
├── navigation/
│   ├── MainTabNavigator.tsx   # Tab bar
│   └── ...
├── hooks/
│   ├── useScreenOptions.ts    # Navigation options
│   └── ...
└── docs/
    ├── IOS_IMPLEMENTATION.md  # This file
    ├── IMPLEMENTATION_SUMMARY.md
    ├── TESTING_CHECKLIST.md
    └── APPLE_DESIGN_GUIDELINES.md
```

---

## 🚀 Getting Started

### Installation

```bash
cd ~/Documents/GitHub/wardaty-app-
npm install
npx expo start
```

### Development

```bash
# Start development server
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android

# Clear cache
npx expo start --clear
```

### Testing

See `docs/TESTING_CHECKLIST.md` for comprehensive testing guide.

---

## 📖 Additional Resources

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [iOS Design Themes](https://developer.apple.com/design/human-interface-guidelines/color)
- [iOS Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)

---

## 🤝 Contributing

When contributing to this project, please follow these guidelines:

1. Use iOS design tokens from `constants/ios-tokens.ts`
2. Follow 4pt grid spacing system
3. Use theme colors (no inline colors)
4. Add haptic feedback to interactions
5. Use iOS-compliant animations
6. Support RTL/LTR layouts
7. Test on both iOS and Android

---

## 📝 License

Copyright © 2024 Wardaty. All rights reserved.

---

**Last Updated:** December 11, 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready

---

*For questions or support, please contact the development team.*
