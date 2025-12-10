# خطة اختبار RTL (العربية) - Wardaty App

**تاريخ:** 10 ديسمبر 2024  
**الهدف:** التحقق من عرض RTL الصحيح للميزات المُصلحة حديثاً

---

## 📋 نظرة عامة

هذه الخطة تركز على اختبار عرض اللغة العربية (RTL) للميزات التالية:
1. ✅ **Onboarding** - اختيار اللغة والخطوات الأولى
2. ✅ **Articles** - قائمة المقالات وتفاصيل المقالة
3. ✅ **HomeScreen** - Pregnancy Mode
4. ✅ **FAB Button** - LogScreen
5. ✅ **Settings** - Light/Dark Mode

---

## 🎯 معايير النجاح

### RTL Display Requirements:
- ✅ النصوص العربية تظهر من اليمين لليسار
- ✅ الأيقونات في الجهة الصحيحة (معكوسة)
- ✅ Chevrons تشير للاتجاه الصحيح (← بدلاً من →)
- ✅ Flexbox direction صحيح (row-reverse للعربية)
- ✅ Text alignment صحيح (textAlign: right)
- ✅ Padding/Margin في الجهة الصحيحة
- ✅ لا يوجد text overflow أو قص

---

## 🧪 Test Cases

### 1️⃣ Onboarding - Language Selection

#### Test Case 1.1: First Screen Display
**الهدف:** التحقق من أن أول شاشة bilingual

**الخطوات:**
1. احذف التطبيق من الجهاز (fresh install)
2. افتح التطبيق لأول مرة
3. راقب أول شاشة تظهر

**النتيجة المتوقعة:**
- ✅ العنوان: "Choose Language / اختر اللغة"
- ✅ الوصف: "Select your preferred language / اختر لغتك المفضلة"
- ✅ زر "العربية" على اليسار
- ✅ زر "English" على اليمين
- ✅ لا يوجد لغة محددة مسبقاً

---

## ✅ Checklist

### Pre-Testing:
- [ ] Pull latest code: git pull origin main
- [ ] Install dependencies: npm install
- [ ] Start Expo: npx expo start
- [ ] Clear app data (fresh install)

### Onboarding Tests:
- [ ] Test Case 1.1: First Screen Display
- [ ] Test Case 1.2: Arabic Language Selection
- [ ] Test Case 1.3: Persona Selection (Arabic)

### Articles Tests:
- [ ] Articles List RTL
- [ ] Article Detail RTL
- [ ] Related Articles RTL

### Pregnancy Mode Tests:
- [ ] Enable Pregnancy Mode
- [ ] Pregnancy Card Layout RTL

### FAB Tests:
- [ ] FAB Button Press
- [ ] LogScreen RTL

---

**تم إنشاؤها بواسطة:** Manus AI  
**آخر تحديث:** 10 ديسمبر 2024
