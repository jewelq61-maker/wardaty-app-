# Wardaty App - Troubleshooting Guide 🔧

## Error: "Cannot read property 'map' of undefined"

This error is caused by **cached bundle data** in Expo Go that doesn't match the current code.

---

## 🚀 **Quick Fix (Recommended)**

### **Option 1: Use the Fix Script**

```bash
cd ~/Documents/GitHub/wardaty-app-
./fix-cache.sh
```

This script will:
1. ✅ Stop all running processes
2. ✅ Clear all caches (Metro, Expo, npm)
3. ✅ Reinstall dependencies
4. ✅ Install babel-preset-expo
5. ✅ Start with clean cache

---

### **Option 2: Manual Steps**

#### **On Your Computer:**

```bash
# 1. Navigate to project
cd ~/Documents/GitHub/wardaty-app-

# 2. Stop all processes
pkill -f expo
pkill -f metro
pkill -f node

# 3. Clear everything
rm -rf node_modules
rm -rf .expo
rm -rf package-lock.json
npm cache clean --force

# 4. Reinstall
npm install
npm install --save-dev babel-preset-expo

# 5. Start clean
npx expo start --clear
```

#### **On Your Phone:**

1. **Close Expo Go completely** (swipe up from app switcher)
2. **Clear Expo Go data:**
   - iOS: Delete and reinstall Expo Go
   - Android: Settings → Apps → Expo Go → Storage → Clear Data
3. **Reopen Expo Go**
4. **Scan QR code again**

---

## 🔍 **Why This Happens**

### **Root Cause:**
Expo Go caches the JavaScript bundle on your phone. When you make code changes, sometimes the old cached bundle conflicts with the new code.

### **Common Triggers:**
- ❌ Code structure changes (adding/removing components)
- ❌ Navigation changes
- ❌ Context provider changes
- ❌ Package updates
- ❌ Git branch switching

---

## 📱 **Phone-Specific Solutions**

### **iOS:**
```
1. Double-click home button (or swipe up)
2. Swipe up on Expo Go to close
3. Delete Expo Go app
4. Reinstall from App Store
5. Scan QR code
```

### **Android:**
```
1. Settings → Apps → Expo Go
2. Storage → Clear Data + Clear Cache
3. Force Stop
4. Reopen Expo Go
5. Scan QR code
```

---

## 🛠️ **Advanced Troubleshooting**

### **If the error persists:**

#### **1. Check for Syntax Errors**
```bash
npm run lint
# or
npx expo start --clear --no-dev
```

#### **2. Verify Dependencies**
```bash
npm list react-native
npm list expo
# Should show no conflicts
```

#### **3. Check Metro Bundler**
```bash
# Kill all Metro processes
lsof -ti:8081 | xargs kill -9
# Start fresh
npx expo start --clear --reset-cache
```

#### **4. Check App.tsx**
Make sure your App.tsx has proper error boundaries:
```typescript
import { ErrorBoundary } from 'react-error-boundary';

// Wrap your app
<ErrorBoundary fallback={<Text>Error</Text>}>
  <YourApp />
</ErrorBoundary>
```

#### **5. Check Navigation**
Verify all navigation screens are properly registered:
```typescript
// In RootStackNavigator.tsx
<Stack.Screen name="OnboardingScreenNew" component={OnboardingScreenNew} />
```

---

## 🔄 **Prevention Tips**

### **Always do this after code changes:**
```bash
# Stop server (Ctrl+C)
# Clear cache
npx expo start --clear

# On phone: Close Expo Go completely
# Reopen and scan
```

### **After git pull:**
```bash
npm install
npx expo start --clear
```

### **After package updates:**
```bash
rm -rf node_modules
npm install
npx expo start --clear
```

---

## 📋 **Checklist**

Use this checklist when debugging:

- [ ] Stopped all Metro/Expo processes
- [ ] Cleared node_modules and reinstalled
- [ ] Cleared npm cache
- [ ] Cleared .expo folder
- [ ] Installed babel-preset-expo
- [ ] Started with `--clear` flag
- [ ] Closed Expo Go on phone
- [ ] Cleared Expo Go data on phone
- [ ] Rescanned QR code
- [ ] Waited for bundle to fully load

---

## 🆘 **Still Not Working?**

### **Try Development Build:**

```bash
# Install EAS CLI
npm install -g eas-cli

# Create development build
eas build --profile development --platform ios
# or
eas build --profile development --platform android
```

Development builds don't use Expo Go and have their own cache.

### **Try Web Version:**

```bash
npx expo start --web
```

This will open in browser and help identify if it's a code issue or cache issue.

---

## 📞 **Get Help**

If none of these work:

1. **Check Expo Status:** https://status.expo.dev/
2. **Expo Forums:** https://forums.expo.dev/
3. **GitHub Issues:** Check if others have similar issues
4. **Discord:** Expo Community Discord

---

## ✅ **Success Indicators**

You'll know it's fixed when:
- ✅ No red error screen
- ✅ App loads to language selection
- ✅ Can navigate between screens
- ✅ No console errors
- ✅ Smooth animations

---

## 📝 **Common Errors & Solutions**

### **"Cannot find module 'babel-preset-expo'"**
```bash
npm install --save-dev babel-preset-expo
```

### **"Metro bundler has encountered an internal error"**
```bash
rm -rf node_modules .expo
npm install
npx expo start --clear
```

### **"Unable to resolve module"**
```bash
npm install
npx expo start --clear --reset-cache
```

### **"Network response timed out"**
- Check WiFi connection
- Make sure phone and computer are on same network
- Try using tunnel mode: `npx expo start --tunnel`

---

## 🎯 **Quick Reference**

| Problem | Solution |
|---------|----------|
| Map error | Clear phone cache |
| Babel error | Install babel-preset-expo |
| Metro error | Clear Metro cache |
| Module error | Reinstall node_modules |
| Network error | Check WiFi / use tunnel |

---

**Last Updated:** Dec 12, 2025  
**App Version:** 1.0.0  
**Expo SDK:** 52
