import React, { useState } from "react";
import { View, StyleSheet, FlatList, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "../components/ThemedText";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";
import { useLayout } from "../lib/ThemePersonaContext";
import { useApp } from "../lib/AppContext";
import { DarkTheme, GlassEffects, Typography, Spacing, BorderRadius, IconSizes } from "../constants/theme";
import type { ArticlesStackParamList } from "../navigation/ArticlesStackNavigator";
import { getAllArticles } from "../data/articles";

interface Article {
  id: string;
  titleAr: string;
  titleEn: string;
  contentAr: string | null;
  contentEn: string | null;
  excerptAr: string;
  excerptEn: string;
  category: string;
  readTime: number;
  icon: string;
  personas: string[] | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

type ArticlesNavigationProp = NativeStackNavigationProp<ArticlesStackParamList, "Articles">;

const CATEGORIES = ["all", "health", "beauty", "faith", "wellness"] as const;

export default function ArticlesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<ArticlesNavigationProp>();
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const layout = useLayout();
  const { data: appData } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const personaColor = Theme.getPersonaColor(appData.settings.persona || "single");

  // Use local articles data
  const allArticles = getAllArticles();
  const articles: Article[] = allArticles.map(article => ({
    id: article.id,
    titleAr: article.titleAr,
    titleEn: article.titleEn,
    contentAr: article.contentAr,
    contentEn: article.contentEn,
    excerptAr: article.excerptAr,
    excerptEn: article.excerptEn,
    category: article.category,
    readTime: article.readTime,
    icon: article.icon,
    personas: article.personas,
    createdAt: new Date(article.createdAt),
    updatedAt: new Date(article.updatedAt),
  }));

  const filteredArticles =
    selectedCategory === "all"
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "health":
        return personaColor.primary;
      case "beauty":
        return Theme.semantic.error;
      case "faith":
        return personaColor.dark;
      case "wellness":
        return Theme.semantic.success;
      default:
        return personaColor.primary;
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      all: { ar: "الكل", en: "All" },
      health: { ar: "الصحة", en: "Health" },
      beauty: { ar: "الجمال", en: "Beauty" },
      faith: { ar: "الإيمان", en: "Faith" },
      wellness: { ar: "العافية", en: "Wellness" },
    };
    return language === "ar" ? labels[category]?.ar : labels[category]?.en;
  };

  const handleArticlePress = (articleId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ArticleDetail", { articleId });
  };

  const handleCategoryPress = (category: string) => {
    Haptics.selectionAsync();
    setSelectedCategory(category);
  };

  const renderCategoryPill = (category: string) => {
    const isSelected = selectedCategory === category;
    const categoryColor = getCategoryColor(category);

    return (
      <Pressable
        key={category}
        onPress={() => handleCategoryPress(category)}
        style={({ pressed }) => [
          styles.categoryPill,
          {
            backgroundColor: isSelected
              ? categoryColor
              : GlassEffects.light.backgroundColor,
            borderColor: isSelected
              ? categoryColor
              : GlassEffects.light.borderColor,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <ThemedText
          style={[
            styles.categoryPillText,
            {
              color: isSelected ? "#FFFFFF" : DarkTheme.text.secondary,
              fontWeight: isSelected ? "600" : "400",
            },
          ]}
        >
          {getCategoryLabel(category)}
        </ThemedText>
      </Pressable>
    );
  };

  const renderArticleCard = ({ item }: { item: Article }) => {
    const categoryColor = getCategoryColor(item.category);

    return (
      <Pressable
        style={({ pressed }) => [
          styles.articleCard,
          { opacity: pressed ? 0.7 : 1 },
        ]}
        onPress={() => handleArticlePress(item.id)}
      >
        <View style={styles.articleCardContent}>
          <View style={[styles.articleIcon, { backgroundColor: `${categoryColor}20` }]}>
            <Feather name={item.icon as any} size={IconSizes.medium} color={categoryColor} />
          </View>
          <View style={styles.articleTextContent}>
            <ThemedText
              style={[
                styles.articleTitle,
                { textAlign: layout.textAlign },
              ]}
              numberOfLines={2}
            >
              {language === "ar" ? item.titleAr : item.titleEn}
            </ThemedText>
            <ThemedText
              style={[
                styles.articleExcerpt,
                { textAlign: layout.textAlign },
              ]}
              numberOfLines={2}
            >
              {language === "ar" ? item.excerptAr : item.excerptEn}
            </ThemedText>
            <View style={[styles.articleMeta, { flexDirection: layout.flexDirection }]}>
              <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}20` }]}>
                <ThemedText style={[styles.categoryBadgeText, { color: categoryColor }]}>
                  {getCategoryLabel(item.category)}
                </ThemedText>
              </View>
              <ThemedText style={styles.readTime}>
                {item.readTime} {language === "ar" ? "دقائق" : "min"}
              </ThemedText>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredArticles}
        renderItem={renderArticleCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: insets.top + Spacing.xl,
            paddingBottom: insets.bottom + Spacing.tabBarHeight + Spacing.xl,
          },
        ]}
        ListHeaderComponent={
          <View style={styles.header}>
            <ThemedText style={[styles.headerTitle, { textAlign: layout.textAlign }]}>
              {language === "ar" ? "المقالات" : "Articles"}
            </ThemedText>
            <ThemedText style={[styles.headerSubtitle, { textAlign: layout.textAlign }]}>
              {language === "ar"
                ? "اكتشفي مقالات مفيدة لصحتك وجمالك"
                : "Discover helpful articles for your health and beauty"}
            </ThemedText>
            <View style={styles.categoriesContainer}>
              {CATEGORIES.map(renderCategoryPill)}
            </View>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.background.root,
  },
  listContent: {
    paddingHorizontal: Spacing.screenPadding,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    ...Typography.largeTitle,
    color: DarkTheme.text.primary,
    marginBottom: Spacing.xxs,
  },
  headerSubtitle: {
    ...Typography.callout,
    color: DarkTheme.text.secondary,
    marginBottom: Spacing.md,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
  },
  categoryPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  categoryPillText: {
    ...Typography.callout,
  },
  articleCard: {
    backgroundColor: GlassEffects.light.backgroundColor,
    borderWidth: GlassEffects.light.borderWidth,
    borderColor: GlassEffects.light.borderColor,
    borderRadius: BorderRadius.large,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  articleCardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  articleIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginEnd: Spacing.sm,
  },
  articleTextContent: {
    flex: 1,
  },
  articleTitle: {
    ...Typography.headline,
    color: DarkTheme.text.primary,
    marginBottom: Spacing.xxs,
  },
  articleExcerpt: {
    ...Typography.footnote,
    color: DarkTheme.text.secondary,
    marginBottom: Spacing.xs,
  },
  articleMeta: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xxxs,
    borderRadius: BorderRadius.small,
  },
  categoryBadgeText: {
    ...Typography.caption1,
    fontWeight: "600",
  },
  readTime: {
    ...Typography.caption1,
    color: DarkTheme.text.tertiary,
  },
});
