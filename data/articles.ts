export interface Article {
  id: string;
  titleAr: string;
  titleEn: string;
  category: string;
  categoryAr: string;
  readTime: number;
  contentAr: string;
  contentEn: string;
  image?: string;
  tags: string[];
}

export const articles: Article[] = [
  {
    id: "1",
    titleAr: "فهم الدورة الشهرية: دليل شامل",
    titleEn: "Understanding Your Menstrual Cycle: A Complete Guide",
    category: "health",
    categoryAr: "الصحة",
    readTime: 5,
    tags: ["cycle", "health", "education"],
    contentAr: `# فهم الدورة الشهرية: دليل شامل

الدورة الشهرية هي عملية طبيعية تحدث في جسم المرأة كل شهر، وتعتبر من أهم العلامات على صحة الجهاز التناسلي.

## مراحل الدورة الشهرية

### 1. مرحلة الحيض (الدورة)
تبدأ هذه المرحلة في اليوم الأول من نزول الدم، وتستمر عادة من 3 إلى 7 أيام. خلال هذه الفترة، يتخلص الجسم من بطانة الرحم التي تكونت في الشهر السابق.

### 2. المرحلة الجريبية
بعد انتهاء الحيض، يبدأ الجسم في تحضير بويضة جديدة للإباضة. تستمر هذه المرحلة حتى يوم الإباضة.

### 3. مرحلة الإباضة
تحدث الإباضة عادة في منتصف الدورة (حوالي اليوم 14 في دورة مدتها 28 يوماً). هذه هي الفترة الأكثر خصوبة في الدورة.

### 4. المرحلة الأصفرية
بعد الإباضة، يستعد الجسم لاحتمال حدوث حمل. إذا لم يحدث حمل، تبدأ الدورة الجديدة.

## نصائح للعناية بنفسك خلال الدورة

- اشربي الكثير من الماء
- مارسي التمارين الخفيفة
- احصلي على قسط كافٍ من النوم
- تناولي طعاماً صحياً ومتوازناً
- استخدمي الكمادات الدافئة لتخفيف الألم

## متى يجب استشارة الطبيب؟

- إذا كانت دورتك غير منتظمة بشكل كبير
- إذا كان النزيف شديداً جداً
- إذا كان الألم لا يطاق
- إذا لاحظت أي تغييرات غير طبيعية`,
    contentEn: `# Understanding Your Menstrual Cycle: A Complete Guide

The menstrual cycle is a natural process that occurs in a woman's body every month and is one of the most important signs of reproductive health.

## Phases of the Menstrual Cycle

### 1. Menstruation Phase
This phase begins on the first day of bleeding and usually lasts 3 to 7 days. During this time, the body sheds the uterine lining that built up in the previous month.

### 2. Follicular Phase
After menstruation ends, the body begins preparing a new egg for ovulation. This phase continues until ovulation day.

### 3. Ovulation Phase
Ovulation typically occurs mid-cycle (around day 14 in a 28-day cycle). This is the most fertile period of the cycle.

### 4. Luteal Phase
After ovulation, the body prepares for a possible pregnancy. If pregnancy doesn't occur, a new cycle begins.

## Self-Care Tips During Your Period

- Drink plenty of water
- Do light exercise
- Get enough sleep
- Eat healthy, balanced meals
- Use warm compresses to relieve pain

## When to See a Doctor?

- If your cycle is very irregular
- If bleeding is very heavy
- If pain is unbearable
- If you notice any abnormal changes`,
  },
  {
    id: "2",
    titleAr: "التغذية الصحية خلال الدورة الشهرية",
    titleEn: "Healthy Nutrition During Your Period",
    category: "nutrition",
    categoryAr: "التغذية",
    readTime: 4,
    tags: ["nutrition", "health", "period"],
    contentAr: `# التغذية الصحية خلال الدورة الشهرية

التغذية السليمة تلعب دوراً كبيراً في تخفيف أعراض الدورة الشهرية وتحسين صحتك العامة.

## الأطعمة المفيدة

### الحديد
فقدان الدم خلال الدورة يمكن أن يؤدي إلى نقص الحديد. تناولي:
- اللحوم الحمراء
- السبانخ
- العدس
- الفاصوليا

### الكالسيوم
يساعد في تقليل التقلصات:
- الحليب ومشتقاته
- اللوز
- البروكلي

### أوميغا 3
يقلل من الالتهابات والألم:
- السلمون
- الجوز
- بذور الشيا

## الأطعمة التي يجب تجنبها

- الكافيين الزائد
- الأطعمة المالحة جداً
- السكريات المصنعة
- الأطعمة الدهنية

## نصائح إضافية

- اشربي شاي الزنجبيل لتخفيف الغثيان
- تناولي وجبات صغيرة متكررة
- لا تهملي وجبة الإفطار
- اشربي 8-10 أكواب من الماء يومياً`,
    contentEn: `# Healthy Nutrition During Your Period

Proper nutrition plays a major role in relieving menstrual symptoms and improving your overall health.

## Beneficial Foods

### Iron
Blood loss during menstruation can lead to iron deficiency. Eat:
- Red meat
- Spinach
- Lentils
- Beans

### Calcium
Helps reduce cramps:
- Milk and dairy products
- Almonds
- Broccoli

### Omega-3
Reduces inflammation and pain:
- Salmon
- Walnuts
- Chia seeds

## Foods to Avoid

- Excess caffeine
- Very salty foods
- Processed sugars
- Fatty foods

## Additional Tips

- Drink ginger tea to relieve nausea
- Eat small, frequent meals
- Don't skip breakfast
- Drink 8-10 glasses of water daily`,
  },
  {
    id: "3",
    titleAr: "التمارين الرياضية المناسبة خلال الدورة",
    titleEn: "Suitable Exercises During Your Period",
    category: "fitness",
    categoryAr: "اللياقة",
    readTime: 3,
    tags: ["exercise", "fitness", "period"],
    contentAr: `# التمارين الرياضية المناسبة خلال الدورة

ممارسة الرياضة خلال الدورة الشهرية آمنة ومفيدة، بل قد تساعد في تخفيف الأعراض.

## فوائد التمارين خلال الدورة

- تخفيف التقلصات
- تحسين المزاج
- زيادة الطاقة
- تقليل الانتفاخ

## التمارين الموصى بها

### اليوغا
حركات لطيفة تساعد على الاسترخاء وتخفيف التوتر.

### المشي
تمرين خفيف يحسن الدورة الدموية.

### السباحة
تمرين شامل للجسم دون ضغط على المفاصل.

### تمارين التمدد
تساعد في تخفيف التقلصات وتحسين المرونة.

## تمارين يجب تجنبها

- التمارين الشاقة جداً
- رفع الأثقال الثقيلة
- التمارين المقلوبة في اليوغا

## نصائح مهمة

- استمعي لجسدك
- خذي فترات راحة عند الحاجة
- ارتدي ملابس مريحة
- حافظي على ترطيب جسمك`,
    contentEn: `# Suitable Exercises During Your Period

Exercising during menstruation is safe and beneficial, and may even help relieve symptoms.

## Benefits of Exercise During Period

- Relieve cramps
- Improve mood
- Increase energy
- Reduce bloating

## Recommended Exercises

### Yoga
Gentle movements help relaxation and stress relief.

### Walking
Light exercise improves blood circulation.

### Swimming
Full-body workout without joint stress.

### Stretching
Helps relieve cramps and improve flexibility.

## Exercises to Avoid

- Very intense workouts
- Heavy weightlifting
- Inverted yoga poses

## Important Tips

- Listen to your body
- Take breaks when needed
- Wear comfortable clothes
- Stay hydrated`,
  },
  {
    id: "4",
    titleAr: "العناية بالبشرة خلال الدورة الشهرية",
    titleEn: "Skincare During Your Menstrual Cycle",
    category: "beauty",
    categoryAr: "الجمال",
    readTime: 4,
    tags: ["skincare", "beauty", "hormones"],
    contentAr: `# العناية بالبشرة خلال الدورة الشهرية

التغيرات الهرمونية خلال الدورة تؤثر على بشرتك. إليك كيفية العناية بها.

## التغيرات الهرمونية والبشرة

### الأسبوع الأول (الحيض)
- البشرة جافة وحساسة
- استخدمي مرطبات غنية
- تجنبي المنتجات القاسية

### الأسبوع الثاني (الجريبي)
- البشرة في أفضل حالاتها
- وقت مثالي للعلاجات
- استخدمي الأقنعة المغذية

### الأسبوع الثالث (الإباضة)
- زيادة في إفراز الزيوت
- استخدمي منظفات لطيفة
- تجنبي الإفراط في التقشير

### الأسبوع الرابع (الأصفري)
- ظهور الحبوب محتمل
- استخدمي منتجات مضادة للحبوب
- حافظي على نظافة البشرة

## روتين العناية الأساسي

1. التنظيف اللطيف مرتين يومياً
2. الترطيب المناسب
3. استخدام واقي الشمس
4. شرب الماء بكثرة
5. النوم الكافي

## نصائح إضافية

- لا تلمسي وجهك بأيدٍ غير نظيفة
- غيري غطاء الوسادة بانتظام
- تجنبي الإجهاد
- تناولي طعاماً صحياً`,
    contentEn: `# Skincare During Your Menstrual Cycle

Hormonal changes during your cycle affect your skin. Here's how to care for it.

## Hormonal Changes and Skin

### Week 1 (Menstruation)
- Dry and sensitive skin
- Use rich moisturizers
- Avoid harsh products

### Week 2 (Follicular)
- Skin at its best
- Perfect time for treatments
- Use nourishing masks

### Week 3 (Ovulation)
- Increased oil production
- Use gentle cleansers
- Avoid over-exfoliating

### Week 4 (Luteal)
- Breakouts likely
- Use anti-acne products
- Keep skin clean

## Basic Care Routine

1. Gentle cleansing twice daily
2. Proper moisturizing
3. Use sunscreen
4. Drink plenty of water
5. Get enough sleep

## Additional Tips

- Don't touch your face with dirty hands
- Change pillowcase regularly
- Avoid stress
- Eat healthy food`,
  },
  {
    id: "5",
    titleAr: "إدارة التوتر والقلق خلال الدورة",
    titleEn: "Managing Stress and Anxiety During Your Period",
    category: "mental-health",
    categoryAr: "الصحة النفسية",
    readTime: 5,
    tags: ["mental-health", "stress", "pms"],
    contentAr: `# إدارة التوتر والقلق خلال الدورة

التغيرات الهرمونية يمكن أن تؤثر على مزاجك وحالتك النفسية. إليك كيفية التعامل معها.

## فهم PMS (متلازمة ما قبل الحيض)

### الأعراض الشائعة
- تقلبات المزاج
- القلق والتوتر
- الحزن أو البكاء
- صعوبة التركيز
- التعب

## استراتيجيات التعامل

### 1. التأمل والاسترخاء
خصصي 10-15 دقيقة يومياً للتأمل أو تمارين التنفس العميق.

### 2. النوم الكافي
احرصي على النوم 7-8 ساعات يومياً.

### 3. التمارين الرياضية
النشاط البدني يحسن المزاج ويقلل التوتر.

### 4. التواصل الاجتماعي
تحدثي مع الأصدقاء أو العائلة عن مشاعرك.

### 5. الكتابة
سجلي أفكارك ومشاعرك في دفتر يوميات.

## الأطعمة التي تحسن المزاج

- الشوكولاتة الداكنة (باعتدال)
- الموز
- المكسرات
- الأسماك الدهنية
- الشاي الأخضر

## متى تطلبين المساعدة؟

إذا كانت الأعراض:
- تؤثر على حياتك اليومية
- شديدة جداً
- تستمر طوال الشهر
- تشمل أفكاراً انتحارية

لا تترددي في استشارة طبيب نفسي أو معالج.`,
    contentEn: `# Managing Stress and Anxiety During Your Period

Hormonal changes can affect your mood and mental state. Here's how to deal with them.

## Understanding PMS

### Common Symptoms
- Mood swings
- Anxiety and stress
- Sadness or crying
- Difficulty concentrating
- Fatigue

## Coping Strategies

### 1. Meditation and Relaxation
Dedicate 10-15 minutes daily to meditation or deep breathing exercises.

### 2. Adequate Sleep
Ensure 7-8 hours of sleep daily.

### 3. Exercise
Physical activity improves mood and reduces stress.

### 4. Social Connection
Talk to friends or family about your feelings.

### 5. Journaling
Record your thoughts and feelings in a diary.

## Mood-Boosting Foods

- Dark chocolate (in moderation)
- Bananas
- Nuts
- Fatty fish
- Green tea

## When to Seek Help?

If symptoms:
- Affect your daily life
- Are very severe
- Continue throughout the month
- Include suicidal thoughts

Don't hesitate to consult a psychiatrist or therapist.`,
  },
];

// Helper function to get related articles
export function getRelatedArticles(currentArticleId: string, count: number = 3): Article[] {
  return articles
    .filter(article => article.id !== currentArticleId)
    .slice(0, count);
}

// Helper function to get articles by category
export function getArticlesByCategory(category: string): Article[] {
  return articles.filter(article => article.category === category);
}
