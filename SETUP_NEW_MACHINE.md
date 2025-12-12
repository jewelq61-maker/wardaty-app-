# 🚀 Wardaty - Setup على جهاز جديد

## الأوامر الكاملة (نسخ ولصق)

### 1️⃣ Clone المشروع (إذا لم يكن موجود)
```bash
cd ~/Documents/GitHub
git clone https://github.com/jewelq61-maker/wardaty-app-.git
cd wardaty-app-
```

### 2️⃣ أو Pull آخر تحديثات (إذا كان موجود)
```bash
cd ~/Documents/GitHub/wardaty-app-

# احذف أي تغييرات محلية
git reset --hard HEAD

# اسحب آخر تحديثات
git pull origin main
```

### 3️⃣ تنظيف كامل
```bash
# احذف كل الملفات المؤقتة
rm -rf node_modules
rm -rf package-lock.json
rm -rf .expo
rm -rf ios/Pods
rm -rf ios/Podfile.lock
rm -rf android/.gradle
rm -rf android/build
rm -rf android/app/build
```

### 4️⃣ تثبيت Dependencies
```bash
# ثبت npm packages
npm install

# إذا كنت تستخدم iOS (على Mac فقط)
cd ios && pod install && cd ..
```

### 5️⃣ تشغيل التطبيق
```bash
# نظف cache وشغل expo
npx expo start --clear

# أو إذا تريد reset كامل
npx expo start --clear --reset-cache
```

---

## 🔧 إذا طلعت مشكلة babel-preset-expo

```bash
# احذف node_modules
rm -rf node_modules package-lock.json

# ثبت babel-preset-expo يدوياً
npm install --save-dev babel-preset-expo

# ثبت باقي الـ dependencies
npm install

# شغل expo
npx expo start --clear
```

---

## 🎨 إذا طلعت مشكلة backgroundColor

```bash
# تأكد من أن expo-linear-gradient مثبت
npm install expo-linear-gradient

# أعد تشغيل expo
npx expo start --clear
```

---

## 📱 على الهاتف (Expo Go)

1. **افتح Expo Go**
2. **امسح QR code** من Terminal
3. **إذا طلع خطأ:**
   - أغلق Expo Go تماماً (من الخلفية)
   - افتحه من جديد
   - امسح QR code مرة أخرى

---

## 🆘 إذا ما اشتغل أبداً

### الحل النهائي:
```bash
# 1. احذف كل شيء
rm -rf node_modules package-lock.json .expo

# 2. احذف npm cache
npm cache clean --force

# 3. تأكد من npm محدث
npm install -g npm@latest

# 4. أعد تثبيت كل شيء
npm install

# 5. ثبت expo-cli عالمياً
npm install -g expo-cli

# 6. شغل expo
npx expo start --clear --reset-cache
```

---

## ✅ الأوامر السريعة (نسخ ولصق مرة وحدة)

```bash
cd ~/Documents/GitHub/wardaty-app- && \
git reset --hard HEAD && \
git pull origin main && \
rm -rf node_modules package-lock.json .expo && \
npm install && \
npx expo start --clear
```

---

## 📋 Checklist قبل التشغيل

- [ ] Node.js مثبت (v18 أو أحدث)
- [ ] npm محدث (`npm -v` يطلع 9.0.0 أو أحدث)
- [ ] Expo Go مثبت على الهاتف
- [ ] الهاتف والكمبيوتر على نفس الـ WiFi
- [ ] Git مثبت ومسجل دخول

---

## 🔍 تحقق من الإصدارات

```bash
# تحقق من Node.js
node -v
# يجب أن يكون v18.0.0 أو أحدث

# تحقق من npm
npm -v
# يجب أن يكون 9.0.0 أو أحدث

# تحقق من expo
npx expo --version
# يجب أن يكون 54.0.0 أو أحدث
```

---

## 💡 نصائح

1. **دائماً استخدم `--clear`** عند تشغيل expo
2. **احذف .expo folder** إذا طلع خطأ غريب
3. **أغلق Expo Go من الخلفية** قبل إعادة المحاولة
4. **تأكد من WiFi** - الهاتف والكمبيوتر لازم يكونوا على نفس الشبكة
5. **استخدم Terminal** - لا تستخدم IDE terminal أحياناً يسبب مشاكل

---

## 🎯 الأوامر حسب السيناريو

### سيناريو 1: أول مرة تفتح المشروع
```bash
cd ~/Documents/GitHub/wardaty-app-
npm install
npx expo start --clear
```

### سيناريو 2: سحبت تحديثات جديدة
```bash
cd ~/Documents/GitHub/wardaty-app-
git pull origin main
rm -rf node_modules package-lock.json
npm install
npx expo start --clear
```

### سيناريو 3: طلع خطأ babel
```bash
cd ~/Documents/GitHub/wardaty-app-
rm -rf node_modules package-lock.json .expo
npm cache clean --force
npm install
npx expo start --clear --reset-cache
```

### سيناريو 4: التطبيق ما يفتح على الهاتف
```bash
# على الكمبيوتر
cd ~/Documents/GitHub/wardaty-app-
npx expo start --clear --tunnel

# على الهاتف
# أغلق Expo Go تماماً
# افتحه من جديد
# امسح QR code
```

---

## 📞 إذا لسه ما اشتغل

1. تأكد من أن الـ repo محدث:
   ```bash
   git log --oneline -5
   ```
   آخر commit لازم يكون: `e8b348f4`

2. تأكد من أن package.json صحيح:
   ```bash
   cat package.json | grep expo
   ```

3. شيك الـ dependencies:
   ```bash
   npm list expo
   npm list babel-preset-expo
   npm list expo-linear-gradient
   ```

---

## 🎊 بعد ما يشتغل

- ✅ جرب Language selection (Arabic/English)
- ✅ جرب Persona selection (Single/Married/Mother/Partner)
- ✅ أكمل الـ onboarding كامل
- ✅ تأكد من RTL يشتغل (اختر العربية)
- ✅ تأكد من الألوان تتغير حسب الشخصية

---

**Repository:** https://github.com/jewelq61-maker/wardaty-app-  
**Latest commit:** `e8b348f4`

**احفظ هذا الملف!** 📌
