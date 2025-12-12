#!/bin/bash
# Wardaty App - Complete Cache Fix Script
# This script fixes all Metro bundler and Expo cache issues

echo "🔧 Wardaty App - Complete Cache Fix"
echo "===================================="
echo ""

# Step 1: Kill all running processes
echo "1️⃣ Stopping all running processes..."
pkill -f "expo" || true
pkill -f "metro" || true
pkill -f "node" || true
sleep 2
echo "✅ Processes stopped"
echo ""

# Step 2: Clear all caches
echo "2️⃣ Clearing all caches..."
rm -rf node_modules
rm -rf .expo
rm -rf .expo-shared
rm -rf package-lock.json
rm -rf yarn.lock
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*
npm cache clean --force
echo "✅ Caches cleared"
echo ""

# Step 3: Reinstall dependencies
echo "3️⃣ Reinstalling dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Step 4: Install babel-preset-expo
echo "4️⃣ Installing babel-preset-expo..."
npm install --save-dev babel-preset-expo
echo "✅ Babel preset installed"
echo ""

# Step 5: Start with clean cache
echo "5️⃣ Starting Expo with clean cache..."
echo ""
echo "📱 Next steps:"
echo "   1. On your phone, COMPLETELY CLOSE Expo Go"
echo "   2. Clear Expo Go app data (Settings → Apps → Expo Go → Clear Data)"
echo "   3. Reopen Expo Go"
echo "   4. Scan the QR code below"
echo ""
echo "🚀 Starting server..."
echo ""

npx expo start --clear
