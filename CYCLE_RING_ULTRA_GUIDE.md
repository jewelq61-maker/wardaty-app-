# 🎯 ULTRA-MANUS Cycle Ring Enhancement Guide

## Overview
The existing CycleRing is already excellent with dot-based design and rotation. This guide shows how to enhance it to ULTRA-MANUS standards with persona colors from the new theme system and 60fps optimizations.

---

## ✅ **Current Features (Already Excellent):**

1. ✅ **Dot-based circular design** - Perfect full circle
2. ✅ **Drag/swipe rotation** - Clockwise & counter-clockwise
3. ✅ **Real-time updates** - Day, phase, date updates on rotation
4. ✅ **Haptic feedback** - Selection and impact feedback
5. ✅ **Smooth animations** - Spring-based with proper easing
6. ✅ **RTL support** - Angle calculations respect RTL
7. ✅ **Phase colors** - Different colors for period, fertile, ovulation, etc.
8. ✅ **Interactive dots** - Individual dot press handling
9. ✅ **Double tap to reset** - Returns to today
10. ✅ **Long press for edit** - Opens edit modal

---

## 🎨 **ULTRA-MANUS Enhancements Needed:**

### **1. Persona Color Integration**

**Current:** Uses hardcoded colors and old theme system  
**Target:** Use new `getPersonaColor()` from theme.ts

#### **Changes:**

```typescript
// OLD imports
import { useTheme } from "../hooks/useTheme";
import { useThemePersona } from "../lib/ThemePersonaContext";
import { Colors, LightModePhaseColors } from "../constants/theme";

// NEW imports ✅
import { useRTL } from "../hooks/useRTL";
import { DarkTheme, getPersonaColor, Typography, Spacing } from "../constants/theme";
import { useApp } from "../lib/AppContext";

// Get persona color
const { data } = useApp();
const { settings } = data;
const personaColor = getPersonaColor(settings.persona || "single");
const rtl = useRTL();
```

#### **Update Dot Colors:**

```typescript
// OLD
const getDotColor = () => {
  if (phase === "period") {
    return isDark ? "#FF6B9D" : "#FF8FB5";
  }
  if (phase === "fertile" && showFertile) {
    return isDark ? "#B794F6" : "#D4B9FF";
  }
  if (phase === "ovulation" && showFertile) {
    return isDark ? "#C67BFF" : "#B794F6";
  }
  return isDark ? "rgba(255, 255, 255, 0.25)" : "rgba(140, 100, 240, 0.25)";
};

// NEW ✅
const getDotColor = () => {
  if (phase === "period") {
    return personaColor.primary;
  }
  if (phase === "fertile" && showFertile) {
    return personaColor.light;
  }
  if (phase === "ovulation" && showFertile) {
    return personaColor.primary;
  }
  // Future/neutral days
  return DarkTheme.text.tertiary;
};
```

#### **Update Glow Colors:**

```typescript
// OLD
backgroundColor: dotColor,

// NEW ✅
backgroundColor: personaColor.glow,
```

#### **Update Center Card:**

```typescript
// OLD
backgroundColor: glassBackground,
borderColor: glassBorder,

// NEW ✅
backgroundColor: GlassEffects.background,
borderColor: GlassEffects.border,
```

---

### **2. 60fps Performance Optimizations**

#### **Use `useAnimatedReaction` for Smoother Updates:**

```typescript
import { useAnimatedReaction } from "react-native-reanimated";

// Replace useEffect with useAnimatedReaction
useAnimatedReaction(
  () => selectedDayShared.value,
  (current, previous) => {
    if (current !== previous) {
      runOnJS(animateContentChange)();
    }
  }
);
```

#### **Optimize Dot Rendering:**

```typescript
// Use React.memo for CycleDot component
const CycleDot = React.memo(({ day, angle, radius, ... }: DotProps) => {
  // Component code
}, (prevProps, nextProps) => {
  // Custom comparison for better performance
  return (
    prevProps.day === nextProps.day &&
    prevProps.isToday === nextProps.isToday &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.phase === nextProps.phase
  );
});
```

#### **Use `worklet` Directive:**

```typescript
// Mark functions as worklets for better performance
const calculateDayFromPosition = (touchX: number, touchY: number): number => {
  'worklet';
  // ... calculation code
};
```

---

### **3. Enhanced Gesture Handling**

#### **Improve Pan Gesture:**

```typescript
const panGesture = Gesture.Pan()
  .minDistance(5) // ✅ Add minimum distance
  .onBegin((event) => {
    'worklet';
    runOnJS(setDraggingState)(true);
    runOnJS(Haptics.selectionAsync)(); // ✅ Haptic on begin
    const day = calculateDayFromPosition(event.x, event.y);
    selectedDayShared.value = day;
    lastCalculatedDay.value = day;
    runOnJS(updateSelectedDay)(day);
  })
  .onUpdate((event) => {
    'worklet';
    const day = calculateDayFromPosition(event.x, event.y);
    selectedDayShared.value = day;
    if (day !== lastCalculatedDay.value) {
      lastCalculatedDay.value = day;
      runOnJS(updateSelectedDay)(day);
      runOnJS(Haptics.selectionAsync)(); // ✅ Haptic on day change
    }
  })
  .onEnd(() => {
    'worklet';
    selectedDayShared.value = withSpring(selectedDayShared.value, {
      damping: 20, // ✅ Increased damping for smoother snap
      stiffness: 300,
    });
    runOnJS(setDraggingState)(false);
    runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light); // ✅ Impact on end
  });
```

---

### **4. Typography Updates**

#### **Use New Typography System:**

```typescript
// OLD
<ThemedText type="title1" style={styles.dayNumber}>
  {displayDay}
</ThemedText>

// NEW ✅
<Text style={[Typography.largeTitle, styles.dayNumber, { color: DarkTheme.text.primary }]}>
  {displayDay}
</Text>

<Text style={[Typography.callout, styles.dayLabel, { color: DarkTheme.text.secondary }]}>
  {isRTL ? "يوم" : "Day"}
</Text>

<Text style={[Typography.footnote, styles.phaseLabel, { color: personaColor.primary }]}>
  {phaseInfo.label}
</Text>
```

---

### **5. Enhanced Center Content Animation**

#### **Add Scale and Fade:**

```typescript
const animateContentChange = useCallback(() => {
  // Scale animation
  contentScale.value = withSequence(
    withSpring(0.88, { damping: 18, stiffness: 350 }), // ✅ More dramatic scale
    withSpring(1, { damping: 15, stiffness: 250 })
  );
  
  // Opacity animation
  contentOpacity.value = withSequence(
    withTiming(0.3, { duration: 100 }), // ✅ Lower opacity
    withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) })
  );
  
  // Translate Y animation
  contentTranslateY.value = withSequence(
    withSpring(-12, { damping: 18, stiffness: 350 }), // ✅ More movement
    withSpring(0, { damping: 15, stiffness: 250 })
  );
  
  // ✅ Add haptic feedback
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}, []);
```

---

### **6. Dot Size and Glow Enhancements**

#### **Better Size Hierarchy:**

```typescript
const getDotSize = () => {
  if (isSelected) return dotBaseSize * 1.8; // ✅ Larger selected dot
  if (isToday) return dotBaseSize * 1.5; // ✅ Larger today dot
  if (phase === "ovulation" && showFertile) return dotBaseSize * 1.4;
  if (phase === "period" || (phase === "fertile" && showFertile)) return dotBaseSize * 1.2;
  return dotBaseSize;
};
```

#### **Enhanced Glow Effect:**

```typescript
// Glow animation
useEffect(() => {
  if (isToday || isSelected) {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.sine) }), // ✅ Smoother easing
        withTiming(0.5, { duration: 1000, easing: Easing.inOut(Easing.sine) })
      ),
      -1,
      true
    );
  } else {
    glowOpacity.value = withTiming(0, { duration: 300 });
  }
}, [isToday, isSelected]);

// Glow style
const glowStyle = useAnimatedStyle(() => ({
  opacity: glowOpacity.value * 0.6, // ✅ Reduced opacity for subtlety
  transform: [
    { scale: interpolate(glowOpacity.value, [0.5, 1], [1.2, 1.8]) } // ✅ More dramatic scale
  ],
}));
```

---

### **7. Phase Badge Enhancement**

#### **Add Glass Effect to Phase Badge:**

```typescript
<View style={[
  styles.phaseBadge,
  {
    backgroundColor: personaColor.soft,
    borderColor: personaColor.primary + "40",
    borderWidth: 1,
  }
]}>
  <Text style={[
    Typography.footnote,
    {
      color: personaColor.primary,
      fontWeight: "600",
    }
  ]}>
    {phaseInfo.label}
  </Text>
</View>

// Style
phaseBadge: {
  paddingHorizontal: Spacing.md,
  paddingVertical: Spacing.xs,
  borderRadius: 16,
  marginTop: Spacing.xs,
},
```

---

### **8. Remaining Days Display**

#### **Enhanced Layout:**

```typescript
<View style={styles.remainingContainer}>
  <Text style={[
    Typography.title2,
    {
      color: DarkTheme.text.primary,
      fontWeight: "700",
      fontSize: 32,
    }
  ]}>
    {daysUntilNextPeriod}
  </Text>
  <Text style={[
    Typography.caption1,
    {
      color: DarkTheme.text.secondary,
      marginTop: -Spacing.xxs,
    }
  ]}>
    {isRTL ? "أيام متبقية" : "days left"}
  </Text>
</View>

// Style
remainingContainer: {
  alignItems: "center",
  marginTop: Spacing.sm,
  gap: Spacing.xxs,
},
```

---

## 🎯 **Implementation Checklist:**

### **Phase 1: Persona Colors**
- [ ] Update imports to use new theme system
- [ ] Replace hardcoded colors with personaColor
- [ ] Update dot colors
- [ ] Update glow colors
- [ ] Update center card colors
- [ ] Update phase badge colors

### **Phase 2: Performance**
- [ ] Add React.memo to CycleDot
- [ ] Use useAnimatedReaction
- [ ] Optimize worklet functions
- [ ] Reduce unnecessary re-renders

### **Phase 3: Gestures**
- [ ] Add minDistance to pan gesture
- [ ] Add haptics on day change
- [ ] Improve snap animation
- [ ] Test RTL rotation

### **Phase 4: Typography**
- [ ] Update to new Typography system
- [ ] Use DarkTheme colors
- [ ] Ensure proper font weights
- [ ] Test Arabic/English

### **Phase 5: Animations**
- [ ] Enhance content change animation
- [ ] Improve glow effect
- [ ] Add scale to phase badge
- [ ] Test 60fps performance

### **Phase 6: Polish**
- [ ] Test all personas (single, married, mother, partner)
- [ ] Test RTL/LTR
- [ ] Test drag rotation
- [ ] Test double tap reset
- [ ] Test long press edit
- [ ] Verify haptic feedback
- [ ] Check memory usage

---

## 🎨 **Color Reference:**

### **Persona Colors:**

| Persona | Primary | Light | Dark | Soft | Glow |
|---------|---------|-------|------|------|------|
| Single | #FF6B9D | #FF8BC0 | #E04A8F | rgba(255,95,168,0.15) | rgba(255,95,168,0.3) |
| Married | #FF8D8D | #FFB0B0 | #E06A6A | rgba(255,141,141,0.15) | rgba(255,141,141,0.3) |
| Mother | #A684F5 | #C4ADFF | #8461E8 | rgba(166,132,245,0.15) | rgba(166,132,245,0.3) |
| Partner | #7EC8E3 | #A3D9ED | #5BA5C9 | rgba(126,200,227,0.15) | rgba(126,200,227,0.3) |

### **Usage:**
- **Period dots:** `personaColor.primary`
- **Ovulation dots:** `personaColor.primary`
- **Fertile dots:** `personaColor.light`
- **Selected dot:** `personaColor.primary`
- **Today dot:** `personaColor.primary`
- **Glow effect:** `personaColor.glow`
- **Phase badge bg:** `personaColor.soft`
- **Phase badge text:** `personaColor.primary`
- **Future dots:** `DarkTheme.text.tertiary`

---

## 🚀 **Performance Targets:**

- ✅ **60fps** during drag rotation
- ✅ **Smooth animations** with no jank
- ✅ **Instant haptic feedback**
- ✅ **No layout shifts**
- ✅ **Minimal re-renders**

---

## 📱 **Testing:**

### **Visual:**
- [ ] Dots form perfect circle
- [ ] Active dot is larger and glowing
- [ ] Past dots have muted opacity
- [ ] Future dots are neutral gray
- [ ] Persona colors applied correctly
- [ ] Center content updates smoothly
- [ ] Phase badge has glass effect

### **Interaction:**
- [ ] Drag rotation works smoothly
- [ ] Clockwise rotation works
- [ ] Counter-clockwise rotation works
- [ ] Day number updates in real-time
- [ ] Phase label updates correctly
- [ ] Remaining days updates correctly
- [ ] Haptic feedback on every change
- [ ] Double tap resets to today
- [ ] Long press opens edit modal

### **RTL/LTR:**
- [ ] Arabic: RTL rotation logic
- [ ] English: LTR rotation logic
- [ ] No flipped text
- [ ] Proper alignment

### **Performance:**
- [ ] 60fps during rotation
- [ ] No dropped frames
- [ ] Smooth spring animations
- [ ] No memory leaks

---

## 📝 **Code Snippets:**

### **Complete Enhanced CycleDot:**

```typescript
const CycleDot = React.memo(({
  day,
  angle,
  radius,
  center,
  phase,
  isToday,
  isSelected,
  personaColor,
  showFertile,
  dotBaseSize,
  onPress,
}: DotProps) => {
  const scale = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  
  const x = center + radius * Math.cos(angle);
  const y = center + radius * Math.sin(angle);
  
  useEffect(() => {
    scale.value = withDelay(
      day * 20, // ✅ Faster stagger
      withSpring(1, { damping: 15, stiffness: 250 })
    );
    
    if (isToday || isSelected) {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.sine) }),
          withTiming(0.5, { duration: 1000, easing: Easing.inOut(Easing.sine) })
        ),
        -1,
        true
      );
    } else {
      glowOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [day, isToday, isSelected]);
  
  useEffect(() => {
    if (isSelected) {
      scale.value = withSequence(
        withSpring(1.4, { damping: 12, stiffness: 350 }),
        withSpring(1, { damping: 15, stiffness: 250 })
      );
    }
  }, [isSelected]);
  
  const getDotColor = () => {
    if (phase === "period") return personaColor.primary;
    if (phase === "fertile" && showFertile) return personaColor.light;
    if (phase === "ovulation" && showFertile) return personaColor.primary;
    return DarkTheme.text.tertiary;
  };
  
  const getDotSize = () => {
    if (isSelected) return dotBaseSize * 1.8;
    if (isToday) return dotBaseSize * 1.5;
    if (phase === "ovulation" && showFertile) return dotBaseSize * 1.4;
    if (phase === "period" || (phase === "fertile" && showFertile)) return dotBaseSize * 1.2;
    return dotBaseSize;
  };
  
  const dotColor = getDotColor();
  const dotSize = getDotSize();
  const isSpecialDot = phase === "ovulation" && showFertile;
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value * 0.6,
    transform: [{ scale: interpolate(glowOpacity.value, [0.5, 1], [1.2, 1.8]) }],
  }));
  
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(day);
  };
  
  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.dotTouchable,
        {
          left: x - dotBaseSize * 1.5,
          top: y - dotBaseSize * 1.5,
          width: dotBaseSize * 3,
          height: dotBaseSize * 3,
        },
      ]}
    >
      {(isToday || isSelected) ? (
        <AnimatedView
          style={[
            styles.dotGlow,
            glowStyle,
            {
              width: dotSize * 2.5,
              height: dotSize * 2.5,
              borderRadius: dotSize * 1.25,
              backgroundColor: personaColor.glow,
            },
          ]}
        />
      ) : null}
      
      <AnimatedView
        style={[
          animatedStyle,
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            borderRadius: isSpecialDot ? dotSize * 0.35 : dotSize / 2,
            backgroundColor: dotColor,
            borderWidth: isSelected ? 2.5 : 0,
            borderColor: DarkTheme.text.primary,
          },
          isSelected && {
            shadowColor: personaColor.primary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.9,
            shadowRadius: 16,
          },
        ]}
      />
    </Pressable>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.day === nextProps.day &&
    prevProps.isToday === nextProps.isToday &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.phase === nextProps.phase
  );
});
```

---

**Status:** Guide complete, ready for systematic implementation  
**Target:** Apple-grade 60fps interactive cycle ring with persona colors
