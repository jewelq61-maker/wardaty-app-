# 🚀 Quick Start Guide - Wardaty App

## Prerequisites

Install these first:
- **Node.js** (v18+): https://nodejs.org/
- **Git**: https://git-scm.com/
- **Expo Go** app on your phone (from App Store or Google Play)

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/jewelq61-maker/wardaty-app-.git
cd wardaty-app-

# 2. Install dependencies
npm install

# 3. Start the development server
npx expo start
```

## Running the App

After running `npx expo start`:
1. Open **Expo Go** app on your phone
2. Scan the QR code
3. Wait for the app to load ✨

### Alternative Options:
- Press `a` to open on Android Emulator
- Press `i` to open on iOS Simulator (Mac only)
- Press `w` to open in browser

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run expo:dev` | Start Expo dev server |
| `npm run server:dev` | Start backend server |
| `npm run all:dev` | Start both frontend & backend |
| `npm run lint` | Check code for errors |
| `npm run lint:fix` | Auto-fix code errors |
| `npm run format` | Format code |

## Building the App

To create APK/IPA files:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
npx eas-cli login

# Build for Android (APK)
npx eas-cli build --platform android --profile preview

# Build for iOS
npx eas-cli build --platform ios --profile preview
```

## Recent Fixes

✅ **Fixed borderWidth error** (Dec 11, 2025)
- Fixed `GlassEffect` → `GlassEffects` import in Card.tsx
- Fixed `GlassEffect` → `GlassEffects` import in UIKit.tsx
- Updated all usages to `GlassEffects.light.borderWidth`

## Troubleshooting

**Port already in use:**
```bash
npx expo start --port 8082
```

**Module not found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Can't connect with Expo Go:**
- Ensure phone and computer are on same WiFi
- Try: `npx expo start --tunnel`

## Documentation

- Expo Docs: https://docs.expo.dev/
- React Native: https://reactnative.dev/
- Project Issues: https://github.com/jewelq61-maker/wardaty-app-/issues

---

**Status:** ✅ Ready to run  
**Last Updated:** December 11, 2025  
**Version:** 1.0.0
