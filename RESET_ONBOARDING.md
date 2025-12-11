# 🔄 How to Reset Onboarding

## Problem
Onboarding starts from the wrong step (e.g., Role Selection instead of Language Selection).

## Cause
AsyncStorage saves onboarding progress, so the app resumes from the last saved step.

## Solution

### Option 1: Delete App (Recommended) ⭐
1. **On your phone:**
   - Long press the Wardaty app icon
   - Tap "Delete App" or "Uninstall"
   - Confirm deletion

2. **On your computer:**
   ```bash
   cd ~/Documents/GitHub/wardaty-app-
   npx expo start --clear
   ```

3. **On your phone:**
   - Scan the QR code again
   - Open the app
   - ✅ You should see "Choose Language / اختر اللغة" first!

---

### Option 2: Clear AsyncStorage (Advanced)
If you don't want to delete the app, you can clear AsyncStorage manually:

1. **Add this temporary code to `App.js`:**
   ```javascript
   import AsyncStorage from '@react-native-async-storage/async-storage';
   
   // Add this at the top of your App component
   useEffect(() => {
     AsyncStorage.clear().then(() => {
       console.log('AsyncStorage cleared!');
     });
   }, []);
   ```

2. **Reload the app:**
   - Press `r` in the Expo terminal
   - Or shake your phone and tap "Reload"

3. **Remove the code** after clearing

---

### Option 3: Clear Specific Key (Most Precise)
1. **In Expo DevTools:**
   - Shake your phone
   - Tap "Debug Remote JS"
   - Open browser console
   - Run:
     ```javascript
     AsyncStorage.removeItem('@wardaty_onboarding_progress');
     ```

2. **Reload the app**

---

## Verification
After clearing, you should see this order:

```
Step 1: Language Selection
┌─────────────────────────────┐
│  🌐 Choose Language         │
│     اختر اللغة              │
│                             │
│  [  العربية  ]              │
│  [  English  ]              │
└─────────────────────────────┘

↓ Next

Step 2: Role Selection
┌─────────────────────────────┐
│  👥 اختاري دورك             │
│                             │
│  [ استخدام شخصي ]           │
│  [ مشاركة مع الشريك ]       │
└─────────────────────────────┘

↓ Next

Step 3: Persona Selection
┌─────────────────────────────┐
│  ⭐ اختاري وضعك الحالي      │
│                             │
│  [ عزباء ]                  │
│  [ متزوجة ]                 │
│  [ أم ]                     │
└─────────────────────────────┘

↓ Next

Step 4: Personal Data
┌─────────────────────────────┐
│  ✏️ المعلومات الشخصية      │
│                             │
│  Name: _________            │
│  Age: __                    │
│  ...                        │
└─────────────────────────────┘
```

---

## Why This Happens
The onboarding system saves progress automatically so users can resume if they close the app mid-onboarding. This is a **feature**, not a bug!

But for testing, you need to clear the saved progress.

---

## For Development
To disable progress saving during development:

1. **Comment out the save effect in `OnboardingScreen.tsx`:**
   ```typescript
   // useEffect(() => {
   //   saveProgress();
   // }, [step, selectedLanguage, role, ...]);
   ```

2. **Or set a flag:**
   ```typescript
   const ENABLE_PROGRESS_SAVING = false; // Set to false for testing
   
   useEffect(() => {
     if (ENABLE_PROGRESS_SAVING) {
       saveProgress();
     }
   }, [...]);
   ```

---

## Summary
- ✅ **Best for users:** Delete app + reinstall
- ✅ **Best for testing:** Clear AsyncStorage
- ✅ **Best for development:** Disable progress saving temporarily

The code is correct! The issue is just cached progress.
