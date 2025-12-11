#!/bin/bash

echo "🔧 Fixing Babel issues..."
echo ""

# Step 1: Clean everything
echo "1️⃣ Cleaning node_modules and cache..."
rm -rf node_modules
rm -rf node_modules/.cache
rm -rf .expo
rm -rf ~/.expo
rm -rf /tmp/metro-*
rm -rf /tmp/react-*
rm -rf package-lock.json
echo "✅ Cleaned!"
echo ""

# Step 2: Clean npm cache
echo "2️⃣ Cleaning npm cache..."
npm cache clean --force
echo "✅ Cache cleaned!"
echo ""

# Step 3: Reinstall
echo "3️⃣ Reinstalling dependencies..."
npm install
echo "✅ Dependencies installed!"
echo ""

# Step 4: Start Expo
echo "4️⃣ Starting Expo..."
echo ""
npx expo start --clear
