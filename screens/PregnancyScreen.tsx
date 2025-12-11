import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "../components/ThemedText";
import { Button } from "../components/Button";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";
import { useLayout } from "../lib/ThemePersonaContext";
import { Spacing, BorderRadius } from "../constants/theme";
import { useApp } from "../lib/AppContext";

interface BabyGrowthInfo {
  size: { en: string; ar: string };
  development: { en: string; ar: string };
}

const BABY_GROWTH_DATA: Record<number, BabyGrowthInfo> = {
  1: { size: { en: "Poppy seed", ar: "حجم حبة خشخاش" }, development: { en: "Fertilization begins", ar: "بداية الإخصاب" } },
  2: { size: { en: "Poppy seed", ar: "حجم حبة خشخاش" }, development: { en: "Cell division in progress", ar: "انقسام الخلايا جارٍ" } },
  3: { size: { en: "Sesame seed", ar: "حجم حبة سمسم" }, development: { en: "Implantation occurs", ar: "تتم عملية الانغراس" } },
  4: { size: { en: "Poppy seed", ar: "حجم حبة خشخاش" }, development: { en: "Heart begins to form", ar: "بداية تكون القلب" } },
  5: { size: { en: "Sesame seed", ar: "حجم حبة سمسم" }, development: { en: "Brain and spinal cord developing", ar: "تطور الدماغ والحبل الشوكي" } },
  6: { size: { en: "Lentil", ar: "حجم حبة عدس" }, development: { en: "Heart starts beating", ar: "بداية نبض القلب" } },
  7: { size: { en: "Blueberry", ar: "حجم حبة توت" }, development: { en: "Arms and legs budding", ar: "بداية نمو الأطراف" } },
  8: { size: { en: "Raspberry", ar: "حجم حبة توت أحمر" }, development: { en: "Fingers and toes forming", ar: "تكوّن الأصابع" } },
  9: { size: { en: "Grape", ar: "حجم حبة عنب" }, development: { en: "Essential organs formed", ar: "تكوّن الأعضاء الأساسية" } },
  10: { size: { en: "Kumquat", ar: "حجم برتقالة صغيرة" }, development: { en: "Bones beginning to harden", ar: "بداية تصلب العظام" } },
  11: { size: { en: "Fig", ar: "حجم حبة تين" }, development: { en: "Baby can open and close fists", ar: "الجنين يستطيع فتح وإغلاق قبضته" } },
  12: { size: { en: "Lime", ar: "حجم ليمونة" }, development: { en: "Reflexes developing", ar: "تطور ردود الفعل" } },
  13: { size: { en: "Lemon", ar: "حجم ليمونة كبيرة" }, development: { en: "Fingerprints forming", ar: "تكوّن بصمات الأصابع" } },
  14: { size: { en: "Peach", ar: "حجم خوخة" }, development: { en: "Can make facial expressions", ar: "يستطيع عمل تعابير وجه" } },
  15: { size: { en: "Apple", ar: "حجم تفاحة" }, development: { en: "Bones becoming visible on ultrasound", ar: "العظام تظهر في السونار" } },
  16: { size: { en: "Avocado", ar: "حجم أفوكادو" }, development: { en: "Can hear sounds", ar: "يستطيع سماع الأصوات" } },
  17: { size: { en: "Pear", ar: "حجم كمثرى" }, development: { en: "Fat begins to form", ar: "بداية تكوّن الدهون" } },
  18: { size: { en: "Bell pepper", ar: "حجم فلفل حلو" }, development: { en: "Ears moving to final position", ar: "تحرك الأذنين لمكانهما النهائي" } },
  19: { size: { en: "Mango", ar: "حجم مانجو" }, development: { en: "Vernix coating forms", ar: "تكوّن طبقة الطلاء الجنيني" } },
  20: { size: { en: "Banana", ar: "حجم موزة" }, development: { en: "Halfway there! Can feel movement", ar: "نصف المشوار! يمكن الشعور بالحركة" } },
  21: { size: { en: "Carrot", ar: "حجم جزرة" }, development: { en: "Eyebrows and eyelids formed", ar: "تكوّن الحواجب والجفون" } },
  22: { size: { en: "Papaya", ar: "حجم بابايا" }, development: { en: "Sense of touch developing", ar: "تطور حاسة اللمس" } },
  23: { size: { en: "Grapefruit", ar: "حجم جريب فروت" }, development: { en: "Lungs developing", ar: "تطور الرئتين" } },
  24: { size: { en: "Ear of corn", ar: "حجم كوز ذرة" }, development: { en: "Face fully formed", ar: "اكتمال تكوين الوجه" } },
  25: { size: { en: "Rutabaga", ar: "حجم لفت" }, development: { en: "Baby responds to your voice", ar: "الجنين يستجيب لصوتك" } },
  26: { size: { en: "Zucchini", ar: "حجم كوسة" }, development: { en: "Eyes can open", ar: "يستطيع فتح عينيه" } },
  27: { size: { en: "Cauliflower", ar: "حجم قرنبيط" }, development: { en: "Brain actively developing", ar: "تطور نشط للدماغ" } },
  28: { size: { en: "Eggplant", ar: "حجم باذنجان" }, development: { en: "Can blink and dream", ar: "يستطيع الرمش والحلم" } },
  29: { size: { en: "Butternut squash", ar: "حجم قرع" }, development: { en: "Muscles and lungs maturing", ar: "نضج العضلات والرئتين" } },
  30: { size: { en: "Cabbage", ar: "حجم ملفوف" }, development: { en: "Growing rapidly", ar: "نمو سريع" } },
  31: { size: { en: "Coconut", ar: "حجم جوز هند" }, development: { en: "Brain connections increasing", ar: "زيادة اتصالات الدماغ" } },
  32: { size: { en: "Jicama", ar: "حجم بطاطا صغيرة" }, development: { en: "Practicing breathing", ar: "يتمرن على التنفس" } },
  33: { size: { en: "Pineapple", ar: "حجم أناناس" }, development: { en: "Bones fully developed", ar: "اكتمال تطور العظام" } },
  34: { size: { en: "Cantaloupe", ar: "حجم شمام" }, development: { en: "Central nervous system maturing", ar: "نضج الجهاز العصبي المركزي" } },
  35: { size: { en: "Honeydew melon", ar: "حجم شمام أخضر" }, development: { en: "Most organs fully developed", ar: "اكتمال معظم الأعضاء" } },
  36: { size: { en: "Romaine lettuce", ar: "حجم خس روماني" }, development: { en: "Getting into birth position", ar: "الاستعداد لوضعية الولادة" } },
  37: { size: { en: "Swiss chard", ar: "حجم سلق" }, development: { en: "Considered full term", ar: "يعتبر مكتمل النمو" } },
  38: { size: { en: "Leek", ar: "حجم كراث" }, development: { en: "Organs ready for life outside", ar: "الأعضاء جاهزة للحياة خارج الرحم" } },
  39: { size: { en: "Mini watermelon", ar: "حجم بطيخة صغيرة" }, development: { en: "Ready to meet you!", ar: "جاهز للقائك!" } },
  40: { size: { en: "Watermelon", ar: "حجم بطيخة" }, development: { en: "Due date! Baby is ready", ar: "موعد الولادة! الطفل جاهز" } },
  41: { size: { en: "Watermelon", ar: "حجم بطيخة" }, development: { en: "Post-term, monitoring recommended", ar: "بعد الموعد، يُنصح بالمتابعة" } },
  42: { size: { en: "Watermelon", ar: "حجم بطيخة" }, development: { en: "Post-term, consult your doctor", ar: "بعد الموعد، استشيري طبيبك" } },
};

interface MotherTip {
  en: string;
  ar: string;
}

const MOTHER_TIPS_BY_TRIMESTER: Record<number, MotherTip[]> = {
  1: [
    { en: "Take prenatal vitamins with folic acid daily", ar: "تناولي فيتامينات الحمل مع حمض الفوليك يومياً" },
    { en: "Stay hydrated and eat small frequent meals", ar: "اشربي الماء بكثرة وتناولي وجبات صغيرة متكررة" },
    { en: "Get plenty of rest as your body adjusts", ar: "احصلي على قسط كافٍ من الراحة" },
    { en: "Avoid raw fish, unpasteurized dairy, and high mercury fish", ar: "تجنبي السمك النيء والألبان غير المبسترة" },
  ],
  2: [
    { en: "Continue prenatal vitamins and stay active", ar: "استمري بفيتامينات الحمل وحافظي على النشاط" },
    { en: "Monitor baby movements - you should start feeling kicks!", ar: "راقبي حركات الجنين - ستبدئين بالشعور بالركلات!" },
    { en: "Consider signing up for birthing classes", ar: "فكري بالتسجيل في دورات الولادة" },
    { en: "Start thinking about your birth plan", ar: "ابدئي التفكير بخطة الولادة" },
  ],
  3: [
    { en: "Prepare your hospital bag", ar: "جهزي حقيبة المستشفى" },
    { en: "Count kicks daily - 10 movements in 2 hours is normal", ar: "عدّي الركلات يومياً - ١٠ حركات في ساعتين طبيعي" },
    { en: "Rest when you can and elevate your feet", ar: "استريحي قدر الإمكان وارفعي قدميك" },
    { en: "Practice breathing exercises for labor", ar: "تمرني على تمارين التنفس للولادة" },
  ],
};

function GlassCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.glassContent,
        { backgroundColor: theme.glassBackground, borderColor: theme.glassBorder },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export default function PregnancyScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation<any>();
  const { theme, isDark } = useTheme();
  const { language } = useLanguage();
  const layout = useLayout();
  const { data, getPregnancyWeek, getPregnancyTrimester } = useApp();

  const { pregnancySettings } = data;
  const week = getPregnancyWeek();
  const trimester = getPregnancyTrimester();

  const getTrimesterLabel = (t: number) => {
    if (language === "ar") {
      if (t === 1) return "الثلث الأول";
      if (t === 2) return "الثلث الثاني";
      return "الثلث الثالث";
    }
    if (t === 1) return "First Trimester";
    if (t === 2) return "Second Trimester";
    return "Third Trimester";
  };

  const formatDueDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", options);
  };

  const getDaysRemaining = () => {
    if (!pregnancySettings.dueDate) return 0;
    const due = new Date(pregnancySettings.dueDate);
    const today = new Date();
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 0);
  };

  const babyInfo = week ? BABY_GROWTH_DATA[week] : null;
  const tips = trimester ? MOTHER_TIPS_BY_TRIMESTER[trimester] : [];

  if (!pregnancySettings.enabled || !week || !trimester) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.backgroundRoot,
            paddingTop: headerHeight + Spacing.xl,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: Spacing.xl,
          },
        ]}
      >
        <View style={[styles.disabledIconContainer, { backgroundColor: theme.primary + "15" }]}>
          <Feather name="heart" size={48} color={theme.primary} />
        </View>
        <ThemedText type="h3" style={{ textAlign: "center", marginTop: Spacing.lg }}>
          {language === "ar" ? "وضع الحمل غير مفعّل" : "Pregnancy Mode Not Enabled"}
        </ThemedText>
        <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: "center", marginTop: Spacing.sm }}>
          {language === "ar" 
            ? "فعّلي وضع الحمل لتتبع رحلة الحمل ومعرفة تطور الجنين أسبوعياً"
            : "Enable pregnancy mode to track your pregnancy journey and see weekly baby development"}
        </ThemedText>
        <Button
          onPress={() => navigation.navigate("Settings")}
          style={{ marginTop: Spacing.xl, width: "100%" }}
        >
          {language === "ar" ? "تفعيل وضع الحمل" : "Enable Pregnancy Mode"}
        </Button>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundRoot,
          paddingTop: headerHeight + Spacing.xl,
        },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingBottom: insets.bottom + Spacing.xl,
          paddingHorizontal: Spacing.lg,
          gap: Spacing.lg,
        }}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <GlassCard style={styles.weekCard}>
          <View style={styles.weekHeader}>
            <View
              style={[
                styles.weekBadge,
                { backgroundColor: theme.primary + "20" },
              ]}
            >
              <ThemedText type="h1" style={{ color: theme.primary, fontWeight: "700" }}>
                {week}
              </ThemedText>
            </View>
            <View style={[styles.weekInfo, layout.isRTL && { alignItems: "flex-end" }]}>
              <ThemedText type="h3" style={{ fontWeight: "600" }}>
                {language === "ar" ? `الأسبوع ${week}` : `Week ${week}`}
              </ThemedText>
              <View
                style={[
                  styles.trimesterBadge,
                  {
                    backgroundColor:
                      trimester === 1
                        ? "#FF9500" + "20"
                        : trimester === 2
                        ? "#34C759" + "20"
                        : "#AF52DE" + "20",
                  },
                ]}
              >
                <ThemedText
                  type="small"
                  style={{
                    color:
                      trimester === 1
                        ? "#FF9500"
                        : trimester === 2
                        ? "#34C759"
                        : "#AF52DE",
                    fontWeight: "600",
                  }}
                >
                  {getTrimesterLabel(trimester)}
                </ThemedText>
              </View>
            </View>
          </View>
          <View style={[styles.progressBar, { backgroundColor: theme.backgroundSecondary }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: theme.primary,
                  width: `${Math.min((week / 40) * 100, 100)}%`,
                },
              ]}
            />
          </View>
          <ThemedText type="small" style={{ color: theme.textSecondary, textAlign: "center" }}>
            {language === "ar"
              ? `${Math.round((week / 40) * 100)}% من رحلة الحمل`
              : `${Math.round((week / 40) * 100)}% of pregnancy journey`}
          </ThemedText>
        </GlassCard>

        <GlassCard>
          <View style={styles.dueDateSection}>
            <Feather name="calendar" size={24} color={theme.primary} />
            <View style={{ flex: 1 }}>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                {language === "ar" ? "موعد الولادة المتوقع" : "Expected Due Date"}
              </ThemedText>
              <ThemedText type="h4" style={{ fontWeight: "600" }}>
                {formatDueDate(pregnancySettings.dueDate)}
              </ThemedText>
            </View>
            <View style={[styles.daysRemaining, { backgroundColor: theme.primary + "20" }]}>
              <ThemedText type="h3" style={{ color: theme.primary, fontWeight: "700" }}>
                {getDaysRemaining()}
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.primary }}>
                {language === "ar" ? "يوم" : "days"}
              </ThemedText>
            </View>
          </View>
        </GlassCard>

        {babyInfo ? (
          <GlassCard>
            <View style={styles.sectionHeader}>
              <Feather name="heart" size={20} color={theme.primary} />
              <ThemedText type="h4" style={{ fontWeight: "600" }}>
                {language === "ar" ? "نمو الجنين" : "Baby Growth"}
              </ThemedText>
            </View>
            <View style={styles.babyInfoContent}>
              <View style={styles.babyInfoRow}>
                <View style={[styles.babyInfoIcon, { backgroundColor: "#FF9500" + "20" }]}>
                  <Feather name="maximize" size={18} color="#FF9500" />
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>
                    {language === "ar" ? "الحجم" : "Size"}
                  </ThemedText>
                  <ThemedText type="body">
                    {language === "ar" ? babyInfo.size.ar : babyInfo.size.en}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.babyInfoRow}>
                <View style={[styles.babyInfoIcon, { backgroundColor: "#34C759" + "20" }]}>
                  <Feather name="activity" size={18} color="#34C759" />
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>
                    {language === "ar" ? "التطور" : "Development"}
                  </ThemedText>
                  <ThemedText type="body">
                    {language === "ar" ? babyInfo.development.ar : babyInfo.development.en}
                  </ThemedText>
                </View>
              </View>
            </View>
          </GlassCard>
        ) : null}

        <GlassCard>
          <View style={styles.sectionHeader}>
            <Feather name="star" size={20} color={theme.primary} />
            <ThemedText type="h4" style={{ fontWeight: "600" }}>
              {language === "ar" ? "نصائح للأم" : "Tips for Mom"}
            </ThemedText>
          </View>
          <View style={styles.tipsContainer}>
            {tips.map((tip, index) => (
              <View key={index} style={styles.tipRow}>
                <View style={[styles.tipBullet, { backgroundColor: theme.primary }]} />
                <ThemedText type="body" style={{ flex: 1 }}>
                  {language === "ar" ? tip.ar : tip.en}
                </ThemedText>
              </View>
            ))}
          </View>
        </GlassCard>

        <View
          style={[
            styles.lmpInfo,
            { backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)" },
          ]}
        >
          <ThemedText type="small" style={{ color: theme.textSecondary, textAlign: "center" }}>
            {language === "ar"
              ? `تاريخ آخر دورة: ${formatDueDate(pregnancySettings.lmpDate)}`
              : `Last Period: ${formatDueDate(pregnancySettings.lmpDate)}`}
          </ThemedText>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  disabledIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  glassWrapper: {
    borderRadius: BorderRadius.large,
    overflow: "hidden",
  },
  glassContent: {
    borderRadius: BorderRadius.large,
    borderWidth: 0.5,
    padding: Spacing.lg,
    overflow: "hidden",
  },
  weekCard: {
    alignItems: "center",
    gap: Spacing.md,
  },
  weekHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
    width: "100%",
  },
  weekBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  weekInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  trimesterBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.medium,
    alignSelf: "flex-start",
  },
  progressBar: {
    width: "100%",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginTop: Spacing.sm,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  dueDateSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  daysRemaining: {
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  babyInfoContent: {
    gap: Spacing.md,
  },
  babyInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  babyInfoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  tipsContainer: {
    gap: Spacing.md,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  lmpInfo: {
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
    marginTop: Spacing.sm,
  },
});
