# Wardaty Onboarding Testing Guide

## Quick Start

### 1. Reset Onboarding (to test from beginning)
```bash
# In your app, open Developer Menu (Cmd+D on iOS, Cmd+M on Android)
# Then select "Debug Remote JS" and run in console:
AsyncStorage.removeItem('onboardingComplete');
AsyncStorage.removeItem('appData');
# Then reload app
```

### 2. Test Flow

#### Test Case 1: Arabic + Single Persona + Full Flow
1. **Step 1:** Select "العربية"
2. **Step 2:** Select "عزباء" (Single - Pink #FF6B9D)
3. **Step 3:** Enter email: `test@wardaty.com`, password: `test123`, confirm: `test123`
4. **Step 4:** Select at least 2 beauty preferences (e.g., Skincare, Hair)
5. **Step 5:** Select last period date (e.g., 7 days ago), cycle length: `28`
   - ✅ Check predictions display: Next Period, Ovulation, Fertile Window
6. **Step 6:** Name: `سارة`, Age: `25-34`, Goals: `Track Cycle`, Enable notifications
7. **Finish:** Should navigate to Main app with Single persona theme (pink)

#### Test Case 2: English + Partner Persona (Skip Cycle)
1. **Step 1:** Select "English"
2. **Step 2:** Select "Partner" (Blue #7EC8E3)
3. **Step 3:** Enter email: `partner@wardaty.com`, password: `partner123`, confirm: `partner123`
4. **Step 4:** Select beauty preferences (optional)
5. **Step 5:** ❌ SHOULD BE SKIPPED (Partner doesn't track cycle)
6. **Step 6:** Name: `Alex`, Age: `25-34`, Goals: `Support partner`, Enable notifications
7. **Finish:** Should navigate to Main app with Partner persona theme (blue)

#### Test Case 3: Validation Errors
1. **Step 2:** Try to proceed without selecting persona → Should show error
2. **Step 3:** 
   - Try invalid email → Should show "Invalid email"
   - Try password < 6 chars → Should show "Password too short"
   - Try mismatched passwords → Should show "Passwords don't match"
3. **Step 5:** Try cycle length < 21 or > 35 → Should show error
4. **Step 6:**
   - Try empty name → Should show error
   - Try without age range → Should show error
   - Try without goals → Should show error

#### Test Case 4: Back Navigation
1. Complete steps 1-3
2. Press "Back" button on step 4 → Should go to step 3
3. Press "Back" again → Should go to step 2
4. Press "Back" again → Should go to step 1
5. **Special:** If Partner persona, pressing back from step 6 should go to step 4 (skipping step 5)

### 3. Visual Checks

#### Progress Dots
- [ ] 6 dots displayed at top
- [ ] Current step dot is larger and colored
- [ ] Completed steps remain colored
- [ ] Future steps are gray

#### Persona Colors
- [ ] Single: Pink #FF6B9D
- [ ] Married: Coral #FF8D8D
- [ ] Mother: Purple #A684F5
- [ ] Partner: Blue #7EC8E3
- [ ] Selected persona card has colored border and background tint
- [ ] Check icon appears on selected persona

#### Dark Theme
- [ ] Background: #0F0820 (very dark purple)
- [ ] Cards: #251B40 (dark purple)
- [ ] Text: White with good contrast
- [ ] Borders: Subtle white/10% opacity

#### RTL (Arabic)
- [ ] Text aligned right
- [ ] Icons positioned correctly
- [ ] Back/Next buttons flipped
- [ ] Date format: Arabic numerals

### 4. Interaction Checks

#### Haptics
- [ ] Light vibration on chip/button press
- [ ] Medium vibration on persona selection
- [ ] Error vibration on validation failure
- [ ] Success vibration on completion

#### Animations
- [ ] Steps fade in/out smoothly
- [ ] Cards scale down slightly when pressed
- [ ] Progress dots scale up on current step
- [ ] Smooth transitions between steps

### 5. Data Persistence Check

After completing onboarding:
```javascript
// Check AsyncStorage
const complete = await AsyncStorage.getItem('onboardingComplete');
const appData = await AsyncStorage.getItem('appData');

console.log('Onboarding Complete:', complete); // Should be "true"
console.log('App Data:', JSON.parse(appData));

// Should contain:
// - settings: { language, persona, notificationsEnabled }
// - user: { email, name, ageRange, goals, beautyPreferences }
// - cycle: { lastPeriodDate, cycleLength, predictions... } or null for Partner
```

### 6. Edge Cases

#### Cycle Predictions
- [ ] Last period = today, cycle = 28 → Next period = 28 days from today
- [ ] Last period = 7 days ago, cycle = 28 → Next period = 21 days from today
- [ ] Ovulation always 14 days before next period
- [ ] Fertile window = 5 days before ovulation to 1 day after

#### Partner Persona
- [ ] Step 5 completely skipped
- [ ] No cycle data in saved appData
- [ ] Back button from step 6 goes to step 4
- [ ] Next button from step 4 goes to step 6

#### Language Switching
- [ ] Switching language in step 1 updates all subsequent text
- [ ] RTL layout applied for Arabic
- [ ] Date picker locale changes
- [ ] All labels translated correctly

---

## Expected Results

### Successful Completion
✅ User sees Main app (TabNavigator)  
✅ Persona theme applied (correct color)  
✅ AsyncStorage contains complete data  
✅ Language preference saved  
✅ No errors in console  

### Failed Validation
❌ Error message displayed  
❌ Haptic error feedback  
❌ Cannot proceed to next step  
❌ Error text in red (#FF5252)  

---

## Common Issues

### Issue: Onboarding shows again after completion
**Solution:** Check AsyncStorage for `onboardingComplete` key

### Issue: RTL not working
**Solution:** May require app restart after language change

### Issue: Date picker not showing
**Solution:** Check if `@react-native-community/datetimepicker` is installed

### Issue: Persona colors not changing
**Solution:** Check personaThemes.ts has all 4 personas defined

---

## Performance Metrics

- [ ] Step transitions < 300ms
- [ ] No frame drops during animations
- [ ] Haptics respond instantly
- [ ] Date picker opens without delay
- [ ] Validation feedback immediate

---

**Test Status:** Ready for QA  
**Last Updated:** December 11, 2024
