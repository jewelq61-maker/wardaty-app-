# 🔧 WARDATY APP - COMPLETE FIX PLAN

## Status: IN PROGRESS
**Start Date:** 2025-12-11  
**Goal:** Fix ALL issues - no exceptions, no TODOs, no partial fixes

---

## ✅ COMPLETED FIXES

### 1. Onboarding System
- ✅ Removed Role Selection step
- ✅ Fixed navigation (navigation.reset)
- ✅ Fixed cycleSettings undefined
- ✅ Removed DateTimePicker (causing Babel errors)
- ✅ Simplified to 3 steps: Language → Persona → Personal Data

### 2. Babel Configuration
- ✅ Removed module-resolver plugin
- ✅ Simplified babel.config.js
- ✅ Added Babel dependencies to package.json

### 3. Articles Integration
- ✅ Added 5 real articles with full content
- ✅ Linked ArticlesScreen to data/articles.ts
- ✅ Added related articles in ArticleDetailScreen

### 4. Pregnancy Mode
- ✅ Added pregnancy card to HomeScreen
- ✅ Replaces cycle card when pregnancy mode is active

### 5. FAB Button
- ✅ Unified FAB to always open LogScreen
- ✅ Removed per-tab handlers

### 6. Light/Dark Mode
- ✅ Theme toggle works in Settings

### 7. ProfileScreen Enhancements
- ✅ Added Wellness Stats (water, sleep)
- ✅ Added Trends (week-over-week comparison)
- ✅ Fixed RTL margins (marginStart instead of marginLeft)

---

## 🚧 REMAINING FIXES (Priority Order)

### PHASE 1: Theme & Persona System (CURRENT)
**Status:** Starting now

**Tasks:**
1. [ ] Verify PersonaColors are applied correctly everywhere
2. [ ] Replace ALL inline colors with theme tokens
3. [ ] Fix logo tint based on persona
4. [ ] Ensure glass effects are consistent
5. [ ] Fix half-dark/half-light screens

**Files to Update:**
- `screens/HomeScreen.tsx`
- `screens/CalendarScreen.tsx`
- `screens/WellnessScreen.tsx`
- `screens/BeautyScreen.tsx`
- `screens/ProfileScreen.tsx`
- `components/CycleRing.tsx`
- `navigation/MainTabNavigator.tsx`

---

### PHASE 2: HomeScreen Redesign
**Status:** Pending

**Tasks:**
1. [ ] Add Articles section to HomeScreen
2. [ ] Replace old CycleRing with NEW dot-based design
3. [ ] Update all cards to match website style (glass, glow)
4. [ ] Fix card spacing and layout
5. [ ] Add proper animations

**New Components:**
- `components/NewCycleRing.tsx` (dot-based design)
- `components/ArticlesSection.tsx` (for HomeScreen)

---

### PHASE 3: RTL/LTR Complete Fix
**Status:** Pending

**Tasks:**
1. [ ] Audit ALL screens for RTL issues
2. [ ] Replace marginLeft/Right with marginStart/End
3. [ ] Fix flexDirection for all rows
4. [ ] Fix textAlign for all text
5. [ ] Fix icon placement (chevrons, arrows)
6. [ ] Test with Arabic and English

**Screens to Fix:**
- All screens in `screens/`
- All components in `components/`
- Navigation components

---

### PHASE 4: Navigation & FAB
**Status:** Pending

**Tasks:**
1. [ ] Fix bottom tab labels visibility
2. [ ] Fix tab icon colors (active/inactive)
3. [ ] Update FAB style to match website
4. [ ] Fix all navigation links
5. [ ] Ensure no dead buttons

**Files:**
- `navigation/MainTabNavigator.tsx`
- `contexts/FABContext.tsx`

---

### PHASE 5: Code Quality
**Status:** Pending

**Tasks:**
1. [ ] Fix ALL TypeScript errors
2. [ ] Remove unused imports
3. [ ] Remove unused variables
4. [ ] Fix missing dependencies in useEffect/useCallback
5. [ ] Run `npx expo lint --fix`
6. [ ] Run `tsc --noEmit` and fix all errors

---

### PHASE 6: CycleRing Animations
**Status:** Pending

**Tasks:**
1. [ ] Fix missing dependencies in CycleRing useEffect
2. [ ] Fix animation warnings
3. [ ] Ensure smooth transitions
4. [ ] Test on iOS and Android

**Files:**
- `components/CycleRing.tsx`
- `components/NewCycleRing.tsx` (new)

---

### PHASE 7: Final Testing
**Status:** Pending

**Tasks:**
1. [ ] Test all screens in Arabic
2. [ ] Test all screens in English
3. [ ] Test persona switching
4. [ ] Test theme switching
5. [ ] Test all navigation flows
6. [ ] Test on iOS
7. [ ] Test on Android
8. [ ] Fix any remaining issues

---

## 📋 DETAILED CHECKLIST

### UI/UX Consistency
- [ ] All screens use DarkTheme.background.root
- [ ] All cards use Glass effects
- [ ] All text uses DarkTheme.text colors
- [ ] All buttons use persona colors
- [ ] All icons use consistent sizes
- [ ] All spacing uses Spacing tokens
- [ ] All borders use BorderRadius tokens
- [ ] No inline colors anywhere

### Persona System
- [ ] Single: #FF5FA8 (pink)
- [ ] Married: #FF7C7C (coral)
- [ ] Mother: #9A63E8 (purple)
- [ ] Partner: (to be defined)
- [ ] Logo tint changes with persona
- [ ] FAB color changes with persona
- [ ] Active tab color changes with persona

### RTL/LTR
- [ ] Arabic: textAlign="right", flexDirection="row-reverse"
- [ ] English: textAlign="left", flexDirection="row"
- [ ] All marginLeft/Right replaced with marginStart/End
- [ ] All paddingLeft/Right replaced with paddingStart/End
- [ ] Chevrons point correct direction
- [ ] Icons on correct side

### HomeScreen
- [ ] Articles section added
- [ ] New dot-based CycleRing
- [ ] Glass cards with glow
- [ ] Proper spacing
- [ ] Smooth animations

### Onboarding
- [ ] Order: Language → Persona → Personal Data
- [ ] RTL/LTR applied instantly
- [ ] No errors
- [ ] Completes successfully

### Navigation
- [ ] All tabs work
- [ ] All buttons work
- [ ] Labels visible
- [ ] Icons correct colors
- [ ] FAB works

### Code Quality
- [ ] No TypeScript errors
- [ ] No warnings
- [ ] No unused imports
- [ ] No unused variables
- [ ] All dependencies correct
- [ ] Lint passes
- [ ] Type check passes

---

## 🎯 SUCCESS CRITERIA

**The app is considered COMPLETE when:**
1. ✅ No TypeScript errors
2. ✅ No warnings
3. ✅ All screens match website design
4. ✅ RTL/LTR works perfectly
5. ✅ All navigation works
6. ✅ Persona system works
7. ✅ Theme system works
8. ✅ No inline colors
9. ✅ No TODOs in code
10. ✅ All tests pass

---

## 📊 PROGRESS TRACKER

**Overall Progress:** 30% (7/23 major tasks)

**Phase 1 (Theme):** 0% - Starting now  
**Phase 2 (Home):** 0% - Pending  
**Phase 3 (RTL):** 20% - Partially done  
**Phase 4 (Nav):** 50% - FAB fixed  
**Phase 5 (Code):** 0% - Pending  
**Phase 6 (Anim):** 0% - Pending  
**Phase 7 (Test):** 0% - Pending  

---

## 🚀 NEXT STEPS

1. **NOW:** Start Phase 1 - Theme & Persona System
2. **NEXT:** Phase 2 - HomeScreen Redesign
3. **THEN:** Phase 3-7 in order

**Estimated Time:** 6-8 hours of focused work

---

**Last Updated:** 2025-12-11 15:30 GMT+3
