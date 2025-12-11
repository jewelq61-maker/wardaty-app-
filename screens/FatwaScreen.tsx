import React, { useState } from "react";
import { View, StyleSheet, FlatList, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import { ThemedText } from "../components/ThemedText";
import { Card } from "../components/Card";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";
import { useLayout, LayoutDirection } from "../lib/ThemePersonaContext";
import { Spacing, BorderRadius } from "../constants/theme";

interface Fatwa {
  id: string;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  category: "prayer" | "fasting" | "tahara";
}

const FATWAS: Fatwa[] = [
  {
    id: "1",
    questionAr: "ما حكم الصلاة أثناء الحيض؟",
    questionEn: "What is the ruling on praying during menstruation?",
    answerAr:
      "تُعفى المرأة من الصلاة أثناء الحيض، وهذا رحمة من الله. وبمجرد انتهاء الحيض وأدائها للغسل، تستأنف صلاتها. ولا يلزمها قضاء الصلوات الفائتة خلال هذه الفترة.",
    answerEn:
      "Women are exempt from praying during menstruation. This is a mercy from Allah. Once the period ends and she performs ghusl (ritual bath), she resumes her prayers. There is no need to make up the missed prayers during this time.",
    category: "prayer",
  },
  {
    id: "2",
    questionAr: "هل يجوز الصيام أثناء الحيض؟",
    questionEn: "Can I fast while on my period?",
    answerAr:
      "لا يجوز الصيام أثناء الحيض. ولكن على خلاف الصلاة، يجب قضاء أيام الصيام الفائتة خلال رمضان بعد انتهاء الشهر. ويمكن القضاء في أي وقت قبل رمضان التالي.",
    answerEn:
      "Fasting during menstruation is not permitted. However, unlike prayers, the missed fasting days during Ramadan must be made up after the month ends. This can be done at any time before the next Ramadan.",
    category: "fasting",
  },
  {
    id: "3",
    questionAr: "ما هي الطريقة الصحيحة للغسل بعد الحيض؟",
    questionEn: "What is the proper way to perform ghusl after menstruation?",
    answerAr:
      "الغسل بعد الحيض يتضمن: 1) النية للطهارة، 2) غسل اليدين ثلاث مرات، 3) غسل الفرج، 4) الوضوء الكامل، 5) صب الماء على الرأس ثلاث مرات مع التأكد من وصوله لأصول الشعر، 6) غسل الجسم كله بدءاً من الجانب الأيمن.",
    answerEn:
      "Ghusl after menstruation involves: 1) Making intention for purification, 2) Washing hands three times, 3) Washing private parts, 4) Performing complete wudu, 5) Pouring water over the head three times, ensuring it reaches the roots of hair, 6) Washing the entire body, starting from the right side.",
    category: "tahara",
  },
  {
    id: "4",
    questionAr: "كيف أعرف أن الحيض قد انتهى؟",
    questionEn: "How do I determine the end of my period?",
    answerAr:
      "يُعرف انتهاء الحيض بإحدى علامتين: إما الجفاف التام عند إدخال قطنة نظيفة، أو ظهور الإفراز الأبيض (القصة البيضاء). وبمجرد ظهور أي من العلامتين، يجب الغسل واستئناف الصلاة.",
    answerEn:
      "The end of menstruation is determined by one of two signs: either complete dryness when inserting a clean cotton piece, or the appearance of white discharge (al-qassa). Once either sign appears, you should perform ghusl and resume prayers.",
    category: "tahara",
  },
  {
    id: "5",
    questionAr: "هل يجوز قراءة القرآن أثناء الحيض؟",
    questionEn: "Can I recite Quran during menstruation?",
    answerAr:
      "اختلف العلماء في هذه المسألة. كثير من العلماء يجيزون قراءة القرآن من الحفظ دون مس المصحف أثناء الحيض، خاصة لأغراض التعلم. ويُستحسن استشارة عالم موثوق في هذا الأمر.",
    answerEn:
      "Scholars have different opinions on this. Many scholars permit reciting Quran from memory without touching the Mushaf during menstruation, especially for learning purposes. It is recommended to consult with a trusted scholar about this matter.",
    category: "prayer",
  },
  {
    id: "6",
    questionAr: "ماذا لو جاءني الحيض في رمضان؟",
    questionEn: "What if my period comes during Ramadan?",
    answerAr:
      "إذا جاء الحيض أثناء يوم الصيام، يجب الإفطار فوراً. ويمكنك الأكل والشرب بشكل طبيعي طوال فترة الحيض. احتفظي بعدد الأيام الفائتة واقضيها بعد انتهاء رمضان.",
    answerEn:
      "If your period begins during a fasting day, you must break your fast immediately. You can eat and drink normally for the duration of your period. Keep track of the days you miss and make them up after Ramadan ends.",
    category: "fasting",
  },
  {
    id: "7",
    questionAr: "ما حكم دخول المسجد أثناء الحيض؟",
    questionEn: "What is the ruling on entering the mosque during menstruation?",
    answerAr:
      "يُحرم على الحائض المكث في المسجد، ولكن يجوز لها المرور فيه للحاجة. وبعض العلماء أجازوا الجلوس في المصلى أو مكان الصلاة في البيت للذكر والدعاء.",
    answerEn:
      "A menstruating woman is not permitted to stay in the mosque, but she may pass through it if needed. Some scholars permit sitting in a prayer area or designated space at home for dhikr and dua.",
    category: "prayer",
  },
  {
    id: "8",
    questionAr: "ما هي الأيام البيض وفضل صيامها؟",
    questionEn: "What are the White Days and the virtue of fasting them?",
    answerAr:
      "الأيام البيض هي اليوم الثالث عشر والرابع عشر والخامس عشر من كل شهر هجري. سُميت بذلك لأن القمر يكون بدراً فيها. صيامها سنة مؤكدة وثوابها عظيم، وتُعادل صيام الدهر إذا صيمت كل شهر.",
    answerEn:
      "The White Days are the 13th, 14th, and 15th of each Hijri month. They are called so because the moon is full during these days. Fasting them is a confirmed Sunnah with great reward, and fasting them every month is equivalent to fasting the entire year.",
    category: "fasting",
  },
  {
    id: "9",
    questionAr: "ما حكم الاستحاضة وكيف تختلف عن الحيض؟",
    questionEn: "What is the ruling on istihadha and how does it differ from menstruation?",
    answerAr:
      "الاستحاضة هي نزول دم خارج وقت الحيض أو زيادة عن مدته المعتادة. المستحاضة يجب عليها الصلاة والصيام، وتتوضأ لكل صلاة. بينما الحائض لا تصلي ولا تصوم حتى تطهر.",
    answerEn:
      "Istihadha is bleeding outside the normal menstrual period or exceeding its usual duration. A woman with istihadha must pray and fast, and should perform wudu for each prayer. Unlike menstruation, where the woman does not pray or fast until purified.",
    category: "tahara",
  },
  {
    id: "10",
    questionAr: "هل يجب قضاء صلاة الجماعة الفائتة أثناء الحيض؟",
    questionEn: "Do I need to make up congregational prayers missed during menstruation?",
    answerAr:
      "لا يجب على المرأة قضاء أي صلاة فاتتها أثناء الحيض، سواء كانت صلاة فردية أو جماعة. هذا من رحمة الله بالنساء. فقط الصيام يُقضى، أما الصلاة فلا.",
    answerEn:
      "A woman does not need to make up any prayers missed during menstruation, whether individual or congregational prayers. This is from Allah's mercy upon women. Only fasting needs to be made up, not prayers.",
    category: "prayer",
  },
];

const CATEGORIES = ["all", "prayer", "fasting", "tahara"] as const;

const CATEGORY_LABELS: Record<string, { ar: string; en: string }> = {
  all: { ar: "الكل", en: "All" },
  prayer: { ar: "الصلاة", en: "Prayer" },
  fasting: { ar: "الصيام", en: "Fasting" },
  tahara: { ar: "الطهارة", en: "Tahara" },
};

function FatwaCard({ item, language, layout }: { item: Fatwa; language: string; layout: LayoutDirection }) {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const rotation = useSharedValue(0);

  const toggleExpand = () => {
    const newExpanded = !expanded;
    rotation.value = withTiming(newExpanded ? 1 : 0, { duration: 200 });
    setExpanded(newExpanded);
  };

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value * 180}deg` }],
  }));

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "prayer":
        return theme.secondary;
      case "fasting":
        return theme.success;
      case "tahara":
        return theme.primary;
      default:
        return theme.primary;
    }
  };

  const isArabic = language === "ar";
  const question = isArabic ? item.questionAr : item.questionEn;
  const answer = isArabic ? item.answerAr : item.answerEn;
  const categoryLabel = isArabic ? CATEGORY_LABELS[item.category].ar : CATEGORY_LABELS[item.category].en;

  return (
    <Card style={styles.fatwaCard} onPress={toggleExpand}>
      <View style={[styles.questionRow, { flexDirection: layout.flexDirection }]}>
        <View style={[styles.questionContent, { alignItems: layout.alignSelf }]}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: getCategoryColor(item.category) + "20" },
            ]}
          >
            <ThemedText
              type="small"
              style={{ color: getCategoryColor(item.category) }}
            >
              {categoryLabel}
            </ThemedText>
          </View>
          <ThemedText type="body" style={[styles.question, { textAlign: layout.textAlign }]}>
            {question}
          </ThemedText>
        </View>
        <Animated.View style={iconStyle}>
          <Feather name="chevron-down" size={20} color={theme.textSecondary} />
        </Animated.View>
      </View>
      {expanded ? (
        <View
          style={[
            styles.answerContainer,
            { borderTopColor: theme.cardBorder },
          ]}
        >
          <ThemedText
            type="body"
            style={[styles.answer, { color: theme.textSecondary, textAlign: layout.textAlign }]}
          >
            {answer}
          </ThemedText>
        </View>
      ) : null}
    </Card>
  );
}

export default function FatwaScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const layout = useLayout();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredFatwas =
    selectedCategory === "all"
      ? FATWAS
      : FATWAS.filter((f) => f.category === selectedCategory);

  const renderCategoryTab = (category: string) => {
    const isSelected = selectedCategory === category;
    const label = language === "ar" ? CATEGORY_LABELS[category].ar : CATEGORY_LABELS[category].en;
    return (
      <Pressable
        key={category}
        onPress={() => setSelectedCategory(category)}
        style={[
          styles.categoryTab,
          {
            backgroundColor: isSelected
              ? theme.secondary
              : theme.backgroundSecondary,
            borderColor: isSelected ? theme.secondary : theme.cardBorder,
          },
        ]}
      >
        <ThemedText
          type="caption"
          style={{ color: isSelected ? theme.buttonText : theme.text }}
        >
          {label}
        </ThemedText>
      </Pressable>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundRoot,
        },
      ]}
    >
      <FlatList
        data={filteredFatwas}
        renderItem={({ item }) => <FatwaCard item={item} language={language} layout={layout} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: insets.bottom + Spacing.xl,
          paddingHorizontal: Spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        ListHeaderComponent={
          <View style={[styles.header, { alignItems: layout.alignSelf }]}>
            <View style={[styles.titleRow, { flexDirection: layout.flexDirection }]}>
              <Feather name="book" size={24} color={theme.secondary} />
              <ThemedText type="h2" style={styles.title}>
                {language === "ar" ? "مكتبة الفتاوى" : "Fatwa Library"}
              </ThemedText>
            </View>
            <ThemedText
              type="body"
              style={[styles.subtitle, { color: theme.textSecondary, textAlign: layout.textAlign }]}
            >
              {language === "ar" ? "إرشادات إسلامية لأسئلة صحة المرأة" : "Islamic guidance for women's health questions"}
            </ThemedText>
            <View style={[styles.categoryTabs, { flexDirection: layout.flexDirection }]}>
              {CATEGORIES.map(renderCategoryTab)}
            </View>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="book-open" size={48} color={theme.textSecondary} />
            <ThemedText
              type="body"
              style={[styles.emptyText, { color: theme.textSecondary }]}
            >
              {language === "ar" ? "لا توجد فتاوى في هذا القسم" : "No fatwas in this category"}
            </ThemedText>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  titleRow: {
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  title: {},
  subtitle: {
    marginBottom: Spacing.lg,
  },
  categoryTabs: {
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  categoryTab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  fatwaCard: {
    padding: Spacing.md,
  },
  questionRow: {
    alignItems: "flex-start",
  },
  questionContent: {
    flex: 1,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.small,
    marginBottom: Spacing.xs,
  },
  question: {
    fontWeight: "500",
  },
  answerContainer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  answer: {
    lineHeight: 24,
  },
  separator: {
    height: Spacing.md,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing.xl * 2,
  },
  emptyText: {
    marginTop: Spacing.md,
    textAlign: "center",
  },
});
