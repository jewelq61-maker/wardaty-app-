# 📱 كيف تشغل التطبيق على جهازك

## الطرق المتاحة

لديك 3 طرق لتشغيل التطبيق على جهازك:

---

## 🚀 الطريقة 1: Expo Go (الأسرع - للتجربة الفورية)

### ما تحتاجه:
- تطبيق **Expo Go** على جهازك
- نفس شبكة الواي فاي للكمبيوتر والجهاز

### الخطوات:

#### 1. حمّل تطبيق Expo Go

**Android:**
- افتح Google Play Store
- ابحث عن "Expo Go"
- ثبّت التطبيق

**iOS:**
- افتح App Store
- ابحث عن "Expo Go"
- ثبّت التطبيق

#### 2. شغّل المشروع على الكمبيوتر

```bash
cd /home/ubuntu/new-project/wardaty-app-
npm start
```

#### 3. افتح التطبيق على جهازك

**Android:**
- افتح Expo Go
- اضغط "Scan QR code"
- صوّر الـ QR code الذي يظهر في Terminal

**iOS:**
- افتح Camera
- صوّر الـ QR code
- اضغط على الإشعار الذي يظهر

**النتيجة:** التطبيق سيفتح مباشرة على جهازك! 🎉

**ملاحظة:** أي تغيير في الكود سيظهر فوراً على الجهاز (Hot Reload)

---

## 📦 الطريقة 2: Build APK/IPA (للتثبيت الدائم)

### ما تحتاجه:
- حساب Expo (مجاني)
- 5-10 دقائق لإنشاء Build

### الخطوات:

#### 1. سجل دخول إلى Expo

```bash
cd /home/ubuntu/new-project/wardaty-app-
npx eas-cli login
```

أدخل:
- Email: بريدك الإلكتروني
- Password: كلمة المرور

#### 2. شغّل Build

**لـ Android (APK):**
```bash
npx eas-cli build --platform android --profile preview
```

**لـ iOS (IPA):**
```bash
npx eas-cli build --platform ios --profile preview
```

#### 3. انتظر اكتمال Build (5-10 دقائق)

سيظهر لك رابط لمتابعة Build:
```
🔗 https://expo.dev/accounts/wardaty/projects/wardaty-app-/builds/...
```

#### 4. حمّل الملف

بعد اكتمال Build:
- افتح الرابط في المتصفح
- اضغط "Download"
- ستحصل على:
  - **Android**: ملف `.apk`
  - **iOS**: ملف `.ipa`

#### 5. ثبّت التطبيق

**Android:**
1. انقل ملف APK إلى جهازك (عبر USB أو Google Drive)
2. افتح الملف على الجهاز
3. اضغط "Install"
4. إذا ظهرت رسالة "Install blocked"، اذهب إلى:
   - Settings → Security → Install unknown apps
   - فعّل الخيار للتطبيق الذي تستخدمه (مثل Files أو Chrome)

**iOS:**
1. تحتاج TestFlight أو Xcode
2. أو استخدم خدمة مثل Diawi لتثبيت IPA
3. أو استخدم Apple Developer account

---

## 🔌 الطريقة 3: Emulator/Simulator (على الكمبيوتر)

### Android Emulator

#### 1. ثبّت Android Studio
```bash
# إذا لم يكن مثبتاً
sudo apt update
sudo apt install android-studio
```

#### 2. أنشئ Emulator
- افتح Android Studio
- Tools → Device Manager
- Create Virtual Device
- اختر جهاز (مثل Pixel 5)
- اختر System Image (مثل Android 13)
- Finish

#### 3. شغّل Emulator
```bash
# من Android Studio
# أو من Terminal
emulator -avd <device_name>
```

#### 4. شغّل التطبيق
```bash
cd /home/ubuntu/new-project/wardaty-app-
npm start
# اضغط 'a' لفتح على Android
```

### iOS Simulator (Mac فقط)

#### 1. ثبّت Xcode
```bash
xcode-select --install
```

#### 2. شغّل Simulator
```bash
open -a Simulator
```

#### 3. شغّل التطبيق
```bash
cd /home/ubuntu/new-project/wardaty-app-
npm start
# اضغط 'i' لفتح على iOS
```

---

## 🎯 أي طريقة تختار؟

### استخدم Expo Go إذا:
- ✅ تريد تجربة سريعة
- ✅ تريد رؤية التغييرات فوراً
- ✅ لا تحتاج native modules إضافية

### استخدم Build APK/IPA إذا:
- ✅ تريد تطبيق دائم على جهازك
- ✅ تريد مشاركة التطبيق مع آخرين
- ✅ تريد اختبار Production build

### استخدم Emulator إذا:
- ✅ لا تملك جهاز حقيقي
- ✅ تريد اختبار أحجام شاشات مختلفة
- ✅ تريد debugging متقدم

---

## 🆘 حل المشاكل الشائعة

### مشكلة: "Unable to connect to Metro"
**الحل:**
```bash
# أعد تشغيل Metro bundler
npm start --reset-cache
```

### مشكلة: "Network response timed out"
**الحل:**
- تأكد أن الكمبيوتر والجهاز على نفس الواي فاي
- أو استخدم Tunnel mode:
```bash
npm start --tunnel
```

### مشكلة: "App installation blocked" (Android)
**الحل:**
- Settings → Security → Install unknown apps
- فعّل الخيار للتطبيق المستخدم

### مشكلة: "Developer certificate not trusted" (iOS)
**الحل:**
- Settings → General → Device Management
- اضغط على Developer App
- Trust

---

## 📞 الدعم

إذا واجهت مشاكل:
- **Expo Docs**: https://docs.expo.dev/get-started/expo-go/
- **Expo Forums**: https://forums.expo.dev/
- **Discord**: https://chat.expo.dev/

---

## 🎉 ملخص سريع

**الطريقة الأسرع (دقيقة واحدة):**
```bash
cd /home/ubuntu/new-project/wardaty-app-
npm start
# حمّل Expo Go على جهازك
# صوّر QR code
# جاهز! 🚀
```

**للتثبيت الدائم (10 دقائق):**
```bash
cd /home/ubuntu/new-project/wardaty-app-
npx eas-cli login
npx eas-cli build --platform android --profile preview
# انتظر Build
# حمّل APK
# ثبّت على جهازك
# جاهز! 🎉
```
