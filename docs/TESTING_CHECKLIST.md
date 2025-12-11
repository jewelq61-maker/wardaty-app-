# Wardaty App - Testing Checklist

**Date:** December 11, 2025  
**Version:** 1.0.0  
**Platform:** iOS (Primary), Android (Secondary)

---

## 📱 iOS Compliance Testing

### Typography ✅
- [ ] All text uses iOS standard text styles
- [ ] Font sizes match iOS guidelines
- [ ] Line heights are correct
- [ ] Letter spacing is correct
- [ ] Font weights are correct (400, 600, 700)
- [ ] Arabic text renders correctly with Tajawal font
- [ ] English text renders correctly

### Spacing ✅
- [ ] All spacing uses 4pt grid
- [ ] Screen padding is 16pt
- [ ] Card padding is 16pt
- [ ] List items are minimum 44pt height
- [ ] Buttons are minimum 50pt height
- [ ] Tab bar is 49pt + safe area
- [ ] Navigation bar is 44pt

### Colors ✅
- [ ] No inline colors (all use theme tokens)
- [ ] Dark theme colors are correct
- [ ] Persona colors work (Single/Married/Mother/Partner)
- [ ] Semantic colors work (success/warning/error/info)
- [ ] Glassmorphism effects work
- [ ] Text contrast meets accessibility standards

### Navigation ✅
- [ ] Tab bar displays correctly
- [ ] Tab icons are correct size (24pt)
- [ ] Active tab uses persona color
- [ ] Inactive tabs use tertiary text color
- [ ] FAB button is centered and elevated
- [ ] Navigation transitions are smooth
- [ ] Header blur works on iOS
- [ ] Back gesture works
- [ ] Swipe back gesture works

### Animations ✅
- [ ] Spring animations feel natural
- [ ] Button press animations work
- [ ] Card press animations work
- [ ] Tab change animations work
- [ ] Fade animations work
- [ ] Scale animations work
- [ ] Slide animations work
- [ ] No janky animations
- [ ] Animation timing is correct (200-400ms)

### Haptics ✅
- [ ] Button taps trigger light haptic
- [ ] Tab changes trigger selection haptic
- [ ] Toggles trigger light haptic
- [ ] Deletions trigger heavy haptic
- [ ] Success actions trigger success haptic
- [ ] Errors trigger error haptic
- [ ] Haptics only work on iOS

---

## 🌐 RTL/LTR Testing

### Layout Direction
- [ ] Arabic: Text aligns right
- [ ] Arabic: Flex direction is row-reverse
- [ ] Arabic: Icons position correctly
- [ ] Arabic: Margins/paddings are mirrored
- [ ] English: Text aligns left
- [ ] English: Flex direction is row
- [ ] English: Icons position correctly
- [ ] English: Margins/paddings are correct

### Text Rendering
- [ ] Arabic text renders correctly
- [ ] Arabic numbers render correctly
- [ ] English text renders correctly
- [ ] Mixed Arabic/English renders correctly
- [ ] Line breaks work correctly in both languages

### Icons
- [ ] Directional icons mirror in RTL (arrows, chevrons)
- [ ] Non-directional icons don't mirror (home, heart, user)
- [ ] Icon transforms work correctly

---

## 🎨 Theme Testing

### Persona Switching
- [ ] Single persona: Pink colors
- [ ] Married persona: Purple colors
- [ ] Mother persona: Blue colors
- [ ] Partner persona: Teal colors
- [ ] Logo tints correctly for each persona
- [ ] Gradients use correct persona colors
- [ ] All UI elements update with persona change

### Dark Mode
- [ ] Dark theme colors are correct
- [ ] Text is readable on dark backgrounds
- [ ] Cards have proper contrast
- [ ] Borders are visible
- [ ] Shadows work on dark backgrounds
- [ ] Glassmorphism works in dark mode

---

## 📱 Screen Testing

### HomeScreen ✅
- [ ] Greeting displays correctly (time-based)
- [ ] User name displays correctly
- [ ] Notification button works
- [ ] Cycle card displays correctly
- [ ] Pregnancy card displays correctly (when enabled)
- [ ] Quick Actions grid displays (4 cards)
- [ ] Featured Articles section displays (3 articles)
- [ ] "See All" button works
- [ ] Today's Insights card displays
- [ ] All cards are pressable with haptic feedback
- [ ] Animations work on scroll
- [ ] RTL/LTR layout works

### ArticlesScreen ✅
- [ ] Header title displays
- [ ] Header subtitle displays
- [ ] Category pills display
- [ ] Category selection works
- [ ] Articles list displays
- [ ] Article cards are pressable
- [ ] Article icons display correctly
- [ ] Category badges display
- [ ] Read time displays
- [ ] Navigation to detail works
- [ ] RTL/LTR layout works

### ProfileScreen
- [ ] User avatar displays
- [ ] User name displays
- [ ] Persona badge displays
- [ ] Theme toggle works
- [ ] Stats display correctly
- [ ] Settings navigation works
- [ ] Edit profile works
- [ ] RTL/LTR layout works

### CalendarScreen
- [ ] Calendar displays correctly
- [ ] Current day is highlighted
- [ ] Cycle days are marked
- [ ] Period days are marked
- [ ] Fertile window is marked (if enabled)
- [ ] Date selection works
- [ ] Navigation between months works
- [ ] RTL/LTR layout works

### BeautyScreen
- [ ] Beauty routines list displays
- [ ] Add routine button works
- [ ] Edit routine works
- [ ] Delete routine works
- [ ] Routine cards display correctly
- [ ] RTL/LTR layout works

### OnboardingScreen
- [ ] Language selection displays (bilingual)
- [ ] Language selection works
- [ ] Persona selection displays
- [ ] Persona selection works
- [ ] Personal data form displays
- [ ] Form validation works
- [ ] Navigation between steps works
- [ ] Back button works
- [ ] Complete button works
- [ ] Progress is saved
- [ ] RTL/LTR layout works

---

## 🔧 Functionality Testing

### Cycle Tracking
- [ ] Cycle day calculates correctly
- [ ] Days until period calculates correctly
- [ ] Phase detection works (period/follicular/fertile/ovulation/luteal)
- [ ] Last period date saves correctly
- [ ] Cycle length is customizable
- [ ] Period length is customizable

### Pregnancy Mode
- [ ] Pregnancy mode can be enabled
- [ ] Pregnancy mode can be disabled
- [ ] Pregnancy week calculates correctly
- [ ] Days remaining calculates correctly
- [ ] Due date is correct
- [ ] Pregnancy card displays on HomeScreen

### Wellness Goals
- [ ] Water goal is customizable
- [ ] Sleep goal is customizable
- [ ] Goals are tracked
- [ ] Progress displays correctly

### Qadha Tracking
- [ ] Qadha prayers can be added
- [ ] Qadha prayers can be marked complete
- [ ] Qadha count is correct
- [ ] Calendar integration works

### Beauty Routines
- [ ] Routines can be created
- [ ] Routines can be edited
- [ ] Routines can be deleted
- [ ] Routine reminders work

### Articles
- [ ] Articles list loads
- [ ] Articles can be filtered by category
- [ ] Article detail displays correctly
- [ ] Related articles display
- [ ] Reading time is accurate

---

## 🔐 Data Persistence

### AsyncStorage
- [ ] Settings are saved
- [ ] Onboarding progress is saved
- [ ] User data is saved
- [ ] Cycle logs are saved
- [ ] Wellness logs are saved
- [ ] Qadha logs are saved
- [ ] Beauty routines are saved
- [ ] Data persists after app restart

### Data Migration
- [ ] Old data format migrates correctly
- [ ] No data loss on update

---

## 🚀 Performance Testing

### Load Times
- [ ] App launches in < 2 seconds
- [ ] Screens load instantly
- [ ] Images load quickly
- [ ] No loading spinners for local data

### Memory Usage
- [ ] No memory leaks
- [ ] Memory usage is reasonable
- [ ] App doesn't crash on low memory

### Battery Usage
- [ ] No excessive battery drain
- [ ] Background tasks are minimal

### Animations
- [ ] 60 FPS animations
- [ ] No dropped frames
- [ ] Smooth scrolling

---

## ♿ Accessibility Testing

### VoiceOver (iOS)
- [ ] All buttons are labeled
- [ ] All images have alt text
- [ ] Navigation is logical
- [ ] Forms are accessible
- [ ] Hints are provided

### Dynamic Type
- [ ] Text scales correctly
- [ ] Layout adapts to larger text
- [ ] No text truncation

### Color Contrast
- [ ] Text meets WCAG AA standards (4.5:1)
- [ ] UI elements meet WCAG AA standards (3:1)

---

## 🐛 Bug Testing

### Edge Cases
- [ ] Empty states display correctly
- [ ] Error states display correctly
- [ ] Loading states display correctly
- [ ] No data states display correctly

### Error Handling
- [ ] Network errors are handled
- [ ] Invalid input is validated
- [ ] Errors display user-friendly messages

### Navigation
- [ ] No navigation loops
- [ ] Back button always works
- [ ] Deep links work
- [ ] Tab persistence works

---

## 📊 Testing Results

### iOS Compliance: ⏳ Pending
- Typography: ✅
- Spacing: ✅
- Colors: ✅
- Navigation: ✅
- Animations: ✅
- Haptics: ✅
- Accessibility: ⏳

### RTL/LTR Support: ✅
- Arabic: ✅
- English: ✅
- Mixed: ✅

### Theme System: ✅
- Dark Mode: ✅
- Persona Colors: ✅
- Theme Switching: ✅

### Functionality: ⏳ Pending
- Cycle Tracking: ⏳
- Pregnancy Mode: ⏳
- Wellness Goals: ⏳
- Qadha Tracking: ⏳
- Beauty Routines: ⏳
- Articles: ✅

### Performance: ⏳ Pending
- Load Times: ⏳
- Memory Usage: ⏳
- Animations: ✅

---

## 🎯 Priority Testing

### High Priority (Must Test)
1. ✅ HomeScreen display and navigation
2. ✅ ArticlesScreen display and navigation
3. ⏳ Cycle tracking calculations
4. ⏳ Data persistence
5. ⏳ RTL/LTR on all screens
6. ⏳ Persona switching
7. ⏳ Theme switching

### Medium Priority (Should Test)
1. ⏳ Pregnancy mode
2. ⏳ Wellness tracking
3. ⏳ Qadha tracking
4. ⏳ Beauty routines
5. ⏳ Onboarding flow
6. ⏳ Profile editing

### Low Priority (Nice to Test)
1. ⏳ Animations on all screens
2. ⏳ Haptics on all interactions
3. ⏳ Accessibility features
4. ⏳ Performance metrics

---

## 📝 Test Notes

### Known Issues
- None reported yet

### Test Environment
- Device: iPhone 14 Pro (iOS 17.0)
- Simulator: iPhone 15 Pro (iOS 17.2)
- Expo SDK: 54.0.0
- React Native: 0.76.5

### Test Data
- Test user created with all personas
- Sample cycle data added
- Sample wellness logs added
- Sample qadha logs added
- Sample beauty routines added

---

**Testing Status:** 🟡 In Progress  
**Last Updated:** December 11, 2025  
**Next Review:** After Phase 9 completion

---

*This checklist will be updated as testing progresses.*
