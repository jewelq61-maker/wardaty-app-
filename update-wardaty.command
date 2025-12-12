#!/bin/bash

# 🚀 Wardaty Auto Update Script
# ضغطتين على هذا الملف وكل شيء يصير تلقائي!

echo "🌸 ═══════════════════════════════════════════════════"
echo "   Wardaty - تحديث تلقائي"
echo "═══════════════════════════════════════════════════"
echo ""

# الانتقال لمجلد المشروع
echo "📂 الانتقال لمجلد المشروع..."
cd ~/Documents/GitHub/wardaty-app-

# التحقق من وجود المشروع
if [ ! -d ".git" ]; then
    echo "❌ خطأ: المشروع غير موجود في المسار الصحيح!"
    echo "   تأكدي من أن المشروع في: ~/Documents/GitHub/wardaty-app-"
    echo ""
    read -p "اضغطي Enter للإغلاق..."
    exit 1
fi

echo "✅ المشروع موجود"
echo ""

# عرض الفرع الحالي
echo "🌿 الفرع الحالي:"
git branch --show-current
echo ""

# سحب التحديثات
echo "📥 سحب آخر التحديثات من GitHub..."
git fetch origin main

# التحقق من وجود تحديثات
UPSTREAM=${1:-'@{u}'}
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse "$UPSTREAM")

if [ $LOCAL = $REMOTE ]; then
    echo "✅ الكود محدث! لا توجد تحديثات جديدة"
    echo ""
else
    echo "🔄 يوجد تحديثات جديدة! جاري التنزيل..."
    
    # حفظ التغييرات المحلية إن وجدت
    if ! git diff-index --quiet HEAD --; then
        echo "💾 حفظ التغييرات المحلية..."
        git stash
        STASHED=1
    fi
    
    # سحب التحديثات
    git pull origin main
    
    # استرجاع التغييرات المحلية
    if [ ! -z "$STASHED" ]; then
        echo "📤 استرجاع التغييرات المحلية..."
        git stash pop
    fi
    
    echo "✅ تم تنزيل التحديثات بنجاح!"
    echo ""
fi

# تنظيف الملفات المؤقتة
echo "🧹 تنظيف الملفات المؤقتة..."
rm -rf node_modules package-lock.json .expo

echo "✅ تم التنظيف"
echo ""

# تثبيت Dependencies
echo "📦 تثبيت Dependencies (قد يستغرق دقيقة)..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ تم تثبيت Dependencies بنجاح!"
else
    echo "❌ خطأ في تثبيت Dependencies"
    echo ""
    read -p "اضغطي Enter للإغلاق..."
    exit 1
fi

echo ""
echo "🎉 ═══════════════════════════════════════════════════"
echo "   تم التحديث بنجاح!"
echo "═══════════════════════════════════════════════════"
echo ""
echo "🚀 جاري تشغيل Expo..."
echo ""
echo "📱 بعد ظهور QR code:"
echo "   1. افتحي Expo Go على هاتفك"
echo "   2. امسحي QR code"
echo "   3. استمتعي! 🌸"
echo ""
echo "⚠️  لإيقاف الخادم: اضغطي Ctrl+C"
echo ""

# تشغيل Expo
npx expo start --clear

# إذا أغلق المستخدم expo
echo ""
echo "👋 تم إيقاف الخادم"
echo ""
read -p "اضغطي Enter للإغلاق..."
