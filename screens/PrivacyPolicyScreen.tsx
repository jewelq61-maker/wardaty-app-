import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { useLayout, LayoutDirection } from "@/lib/ThemePersonaContext";
import { Spacing, BorderRadius } from "@/constants/theme";

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

function PolicySection({
  title,
  content,
  theme,
  layout,
  delay,
}: {
  title: string;
  content: string;
  theme: any;
  layout: LayoutDirection;
  delay: number;
}) {
  return (
    <Animated.View entering={FadeInDown.duration(400).delay(delay)}>
      <View style={styles.section}>
        <GlassCard>
          <ThemedText
            type="h4"
            style={[styles.policyTitle, { color: theme.primary, textAlign: layout.textAlign }]}
          >
            {title}
          </ThemedText>
          <ThemedText
            type="body"
            style={[styles.policyContent, { color: theme.text, textAlign: layout.textAlign }]}
          >
            {content}
          </ThemedText>
        </GlassCard>
      </View>
    </Animated.View>
  );
}

export default function PrivacyPolicyScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const layout = useLayout();

  const isArabic = language === "ar";

  const policySections = isArabic
    ? [
        {
          title: "جمع البيانات",
          content:
            "نقوم بجمع المعلومات التي تقدمينها مباشرة مثل اسمك، وبيانات الدورة الشهرية، وسجلات القضاء، وروتين العناية بالجمال. يتم تخزين جميع البيانات محلياً على جهازك ولا يتم مشاركتها مع أي طرف ثالث.",
        },
        {
          title: "استخدام البيانات",
          content:
            "نستخدم بياناتك فقط لتوفير وتحسين وظائف التطبيق. تُستخدم بيانات الدورة لحساب التنبؤات، وتُستخدم سجلات القضاء لتتبع تقدمك الروحي. لا نبيع أو نشارك معلوماتك الشخصية.",
        },
        {
          title: "تخزين البيانات",
          content:
            "يتم تخزين جميع البيانات الحساسة محلياً على جهازك باستخدام تقنية التخزين الآمن. يمكنك حذف بياناتك في أي وقت من خلال خيار إعادة تعيين التطبيق في الإعدادات.",
        },
        {
          title: "الإشعارات",
          content:
            "إذا قمتِ بتفعيل الإشعارات، سنرسل لكِ تذكيرات حول دورتك، ونصائح صحية، وتذكيرات بالقضاء. يمكنكِ تعطيل الإشعارات في أي وقت من الإعدادات.",
        },
        {
          title: "أمان البيانات",
          content:
            "نحن نأخذ أمان بياناتك على محمل الجد. نستخدم ممارسات أمنية قياسية في الصناعة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التعديل أو الإفصاح.",
        },
        {
          title: "تحديثات السياسة",
          content:
            "قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنعلمكِ بأي تغييرات جوهرية من خلال التطبيق أو عبر البريد الإلكتروني إذا كان متوفراً.",
        },
        {
          title: "تواصلي معنا",
          content:
            "إذا كان لديكِ أي أسئلة حول سياسة الخصوصية هذه، يرجى التواصل معنا على support@wardaty.app",
        },
      ]
    : [
        {
          title: "Data Collection",
          content:
            "We collect information you provide directly such as your name, menstrual cycle data, qadha logs, and beauty routine information. All data is stored locally on your device and is not shared with any third parties.",
        },
        {
          title: "Data Usage",
          content:
            "We use your data solely to provide and improve app functionality. Cycle data is used to calculate predictions, and qadha logs are used to track your spiritual progress. We do not sell or share your personal information.",
        },
        {
          title: "Data Storage",
          content:
            "All sensitive data is stored locally on your device using secure storage technology. You can delete your data at any time through the reset app option in Settings.",
        },
        {
          title: "Notifications",
          content:
            "If you enable notifications, we will send you reminders about your cycle, health tips, and qadha reminders. You can disable notifications at any time from Settings.",
        },
        {
          title: "Data Security",
          content:
            "We take your data security seriously. We use industry-standard security practices to protect your personal information from unauthorized access, modification, or disclosure.",
        },
        {
          title: "Policy Updates",
          content:
            "We may update this privacy policy from time to time. We will notify you of any material changes through the app or via email if available.",
        },
        {
          title: "Contact Us",
          content:
            "If you have any questions about this privacy policy, please contact us at support@wardaty.app",
        },
      ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: insets.bottom + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInDown.duration(400)}>
        <View style={styles.headerSection}>
          <ThemedText
            type="h2"
            style={[styles.headerTitle, { textAlign: layout.textAlign }]}
          >
            {isArabic ? "سياسة الخصوصية" : "Privacy Policy"}
          </ThemedText>
          <ThemedText
            type="small"
            style={[styles.lastUpdated, { color: theme.textSecondary, textAlign: layout.textAlign }]}
          >
            {isArabic ? "آخر تحديث: ديسمبر 2024" : "Last updated: December 2024"}
          </ThemedText>
        </View>
      </Animated.View>

      {policySections.map((section, index) => (
        <PolicySection
          key={index}
          title={section.title}
          content={section.content}
          theme={theme}
          layout={layout}
          delay={(index + 1) * 50}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    marginBottom: Spacing.xs,
  },
  lastUpdated: {
    marginTop: Spacing.xs,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  glassWrapper: {
    borderRadius: BorderRadius.large,
    overflow: "hidden",
  },
  glassContent: {
    borderRadius: BorderRadius.large,
    borderWidth: 0.5,
    overflow: "hidden",
    padding: Spacing.lg,
  },
  policyTitle: {
    marginBottom: Spacing.sm,
  },
  policyContent: {
    lineHeight: 22,
  },
});
