# 🚀 دليل تشغيل Build للتطبيق

## المشكلة الحالية

واجهنا مشكلة مع EXPO_TOKEN في GitHub Actions حيث جميع Tokens تفشل مع الخطأ:
```
The bearer token is invalid.
Error: GraphQL request failed.
```

تم تجربة 4 tokens مختلفة (Personal و Robot) وجميعها فشلت.

---

## ✅ الحل: تشغيل Build محلياً

يمكنك تشغيل Build محلياً باستخدام حسابك الخاص على Expo.

### الخطوات:

#### 1. تسجيل الدخول إلى EAS

```bash
cd /home/ubuntu/new-project/wardaty-app-
npx eas-cli login
```

سيطلب منك:
- **Email**: أدخل بريدك الإلكتروني لحساب Expo
- **Password**: أدخل كلمة المرور

#### 2. التحقق من تسجيل الدخول

```bash
npx eas-cli whoami
```

يجب أن يظهر اسم حسابك (wardaty).

#### 3. تشغيل Build

**لـ Android (APK للاختبار):**
```bash
npx eas-cli build --platform android --profile preview
```

**لـ iOS (Simulator):**
```bash
npx eas-cli build --platform ios --profile preview
```

**للمنصتين معاً:**
```bash
npx eas-cli build --platform all --profile preview
```

#### 4. متابعة Build

بعد تشغيل الأمر، سيظهر لك:
- رابط لمتابعة Build على Expo Dashboard
- Build ID
- الوقت المتوقع للإنتهاء (5-10 دقائق)

#### 5. تحميل التطبيق

بعد اكتمال Build:
1. اذهب إلى: https://expo.dev/accounts/wardaty/projects/wardaty-app-/builds
2. انقر على Build الأخير
3. حمّل APK (Android) أو IPA (iOS)

---

## 📋 Build Profiles المتاحة

### 1. Development
```bash
npx eas-cli build --platform all --profile development
```
- للتطوير المحلي
- يعمل على Simulator/Emulator
- يتضمن development client

### 2. Preview (موصى به للاختبار)
```bash
npx eas-cli build --platform all --profile preview
```
- للاختبار الداخلي
- APK لـ Android (سهل التثبيت)
- Simulator build لـ iOS

### 3. Production
```bash
npx eas-cli build --platform all --profile production
```
- للإنتاج النهائي
- App Bundle لـ Android
- App Store build لـ iOS
- Auto increment version

---

## 🔧 إصلاح مشكلة GitHub Actions (اختياري)

إذا أردت إصلاح GitHub Actions لاحقاً:

### الخيار 1: استخدام Token من حسابك

1. سجل دخول محلياً:
```bash
npx eas-cli login
```

2. احصل على Token:
```bash
npx eas-cli whoami --json
```

3. أضف Token إلى GitHub Secrets:
```bash
gh secret set EXPO_TOKEN
# الصق Token عند الطلب
```

### الخيار 2: التواصل مع Expo Support

المشكلة قد تكون من جانب Expo API:
- اذهب إلى: https://expo.dev/support
- اشرح المشكلة: "All access tokens fail with 'bearer token is invalid'"
- أرفق Build logs من GitHub Actions

---

## 📱 تثبيت التطبيق على الجهاز

### Android:
1. حمّل APK من Expo Dashboard
2. انقل الملف إلى هاتفك
3. افتح الملف وثبّت التطبيق
4. قد تحتاج تفعيل "Install from unknown sources"

### iOS:
1. حمّل IPA من Expo Dashboard
2. استخدم TestFlight أو Xcode لتثبيته
3. أو استخدم Expo Go للاختبار السريع

---

## 🎯 الخطوات التالية

1. ✅ سجل دخول إلى EAS محلياً
2. ✅ شغّل Build للمنصة التي تريدها
3. ✅ حمّل التطبيق بعد اكتمال Build
4. ✅ ثبّت التطبيق على جهازك واختبره

---

## 📞 الدعم

إذا واجهت أي مشاكل:
- **Expo Docs**: https://docs.expo.dev/build/introduction/
- **Expo Support**: https://expo.dev/support
- **GitHub Issues**: https://github.com/expo/expo/issues

---

## 📊 معلومات المشروع

- **Project ID**: c7acffbd-7c47-45ab-bd21-5591f704376c
- **Owner**: wardaty
- **Slug**: wardaty-app-
- **Expo Dashboard**: https://expo.dev/accounts/wardaty/projects/wardaty-app-
- **GitHub Repo**: https://github.com/jewelq61-maker/wardaty-app-

---

**ملاحظة:** المشروع جاهز تماماً، فقط يحتاج تسجيل دخول محلي لتشغيل Build! 🎉
