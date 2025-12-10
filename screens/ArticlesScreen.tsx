import React, { useState } from "react";
import { View, StyleSheet, FlatList, Pressable, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { useLayout } from "@/lib/ThemePersonaContext";
import { useApp } from "@/lib/AppContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import type { Article as ArticleType } from "@shared/schema";
import type { ArticlesStackParamList } from "@/navigation/ArticlesStackNavigator";
import { getApiUrl } from "@/lib/query-client";
import { getAllArticles, getArticlesByCategory } from "@/data/articles";

interface Article {
  id: string;
  titleAr: string;
  titleEn: string;
  contentAr: string | null;
  contentEn: string | null;
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
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation<ArticlesNavigationProp>();
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const layout = useLayout();
  const { data: appData } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Offline mode: use local articles data
  const allArticles = getAllArticles();
  const articles: Article[] = allArticles.map(article => ({
    id: article.id,
    titleAr: article.titleAr,
    titleEn: article.titleEn,
    contentAr: article.contentAr,
    contentEn: article.contentEn,
    category: article.category,
    readTime: article.readTime,
    icon: article.icon,
    personas: article.personas,
    createdAt: new Date(article.createdAt),
    updatedAt: new Date(article.updatedAt),
  }));
  const isLoading = false;
  const error = null;
  
  // const { data: articles = [], isLoading, error } = useQuery<Article[]>({
  //   queryKey: ["/api/articles", appData.settings.persona],
  //   queryFn: async () => {
  //     const url = new URL("/api/articles", getApiUrl());
  //     if (appData.settings.persona) {
  //       url.searchParams.set("persona", appData.settings.persona);
  //     }
  //     const response = await fetch(url.toString());
  //     if (!response.ok) throw new Error("Failed to fetch articles");
  //     return response.json();
  //   },
  // });

  const filteredArticles =
    selectedCategory === "all"
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "health":
        return theme.primary;
      case "beauty":
        return theme.secondary;
      case "faith":
        return theme.secondaryDark;
      case "wellness":
        return theme.success;
      default:
        return theme.primary;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "all":
        return t("articles", "all");
      case "health":
        return t("articles", "health");
      case "beauty":
        return t("articles", "beauty");
      case "faith":
        return t("articles", "faith");
      case "wellness":
        return t("articles", "wellness");
      default:
        return category;
    }
  };

  const renderCategoryTab = (category: string) => {
    const isSelected = selectedCategory === category;
    return (
      <Pressable
        key={category}
        onPress={() => setSelectedCategory(category)}
        style={[
          styles.categoryTab,
          {
            backgroundColor: isSelected
              ? theme.primary
              : theme.backgroundSecondary,
            borderColor: isSelected ? theme.primary : theme.cardBorder,
          },
        ]}
      >
        <ThemedText
          type="caption"
          style={{ color: isSelected ? theme.buttonText : theme.text }}
        >
          {getCategoryLabel(category)}
        </ThemedText>
      </Pressable>
    );
  };

  const getArticleTitle = (article: Article) => {
    return language === "ar" ? article.titleAr : article.titleEn;
  };

  const handleArticlePress = (articleId: string) => {
    navigation.navigate("ArticleDetail", { articleId });
  };

  const renderArticle = ({ item }: { item: Article }) => (
    <Card style={styles.articleCard} onPress={() => handleArticlePress(item.id)}>
      <View style={[styles.articleContent, { flexDirection: layout.flexDirection }]}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: getCategoryColor(item.category) + "20" },
            { [layout.marginEnd]: Spacing.md },
          ]}
        >
          <Feather
            name={item.icon as keyof typeof Feather.glyphMap}
            size={20}
            color={getCategoryColor(item.category)}
          />
        </View>
        <View style={styles.articleInfo}>
          <ThemedText
            type="body"
            numberOfLines={2}
            style={[styles.articleTitle, { textAlign: layout.textAlign }]}
          >
            {getArticleTitle(item)}
          </ThemedText>
          <View style={[styles.articleMeta, { flexDirection: layout.flexDirection }]}>
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
                {getCategoryLabel(item.category)}
              </ThemedText>
            </View>
            <View style={[styles.readTime, { flexDirection: layout.flexDirection }]}>
              <Feather name="clock" size={12} color={theme.textSecondary} />
              <ThemedText
                type="small"
                style={{
                  color: theme.textSecondary,
                  [layout.marginStart]: 4,
                }}
              >
                {item.readTime} {t("articles", "min")}
              </ThemedText>
            </View>
          </View>
        </View>
        <Feather
          name={layout.isRTL ? "chevron-left" : "chevron-right"}
          size={20}
          color={theme.textSecondary}
        />
      </View>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.backgroundRoot }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

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
        data={filteredArticles}
        renderItem={renderArticle}
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
            <ThemedText
              type="h2"
              style={[styles.title, { textAlign: layout.textAlign }]}
            >
              {t("articles", "title")}
            </ThemedText>
            <ThemedText
              type="body"
              style={[
                styles.subtitle,
                { color: theme.textSecondary, textAlign: layout.textAlign },
              ]}
            >
              {t("articles", "subtitle")}
            </ThemedText>

            <Card
              style={{ ...styles.fatwaCard, backgroundColor: theme.secondaryDark + "15" }}
              onPress={() => navigation.navigate("Fatwa")}
            >
              <View style={[styles.fatwaCardContent, { flexDirection: layout.flexDirection }]}>
                <View
                  style={[
                    styles.fatwaIconContainer,
                    { backgroundColor: theme.secondaryDark + "20" },
                    { [layout.marginEnd]: Spacing.md },
                  ]}
                >
                  <Feather name="book" size={24} color={theme.secondaryDark} />
                </View>
                <View style={styles.fatwaTextContainer}>
                  <ThemedText
                    type="body"
                    style={[styles.fatwaTitle, { textAlign: layout.textAlign }]}
                  >
                    {language === "ar" ? "مكتبة الفتاوى" : "Fatwa Library"}
                  </ThemedText>
                  <ThemedText
                    type="small"
                    style={[styles.fatwaSubtitle, { color: theme.textSecondary, textAlign: layout.textAlign }]}
                  >
                    {language === "ar" ? "إرشادات إسلامية لصحة المرأة" : "Islamic guidance for women's health"}
                  </ThemedText>
                </View>
                <Feather
                  name={layout.isRTL ? "chevron-left" : "chevron-right"}
                  size={20}
                  color={theme.secondaryDark}
                />
              </View>
            </Card>

            <View style={[styles.categoryTabs, { flexDirection: layout.flexDirection }]}>
              {CATEGORIES.map(renderCategoryTab)}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="file-text" size={48} color={theme.textSecondary} />
            <ThemedText
              type="body"
              style={[styles.emptyText, { color: theme.textSecondary }]}
            >
              {t("articles", "noArticles")}
            </ThemedText>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing.xl * 2,
  },
  emptyText: {
    marginTop: Spacing.md,
    textAlign: "center",
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    marginBottom: Spacing.xs,
  },
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
  articleCard: {
    padding: Spacing.md,
  },
  articleContent: {
    alignItems: "center",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  articleInfo: {
    flex: 1,
  },
  articleTitle: {
    marginBottom: Spacing.xs,
  },
  articleMeta: {
    alignItems: "center",
    gap: Spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.small,
  },
  readTime: {
    alignItems: "center",
  },
  separator: {
    height: Spacing.md,
  },
  fatwaCard: {
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.medium,
  },
  fatwaCardContent: {
    alignItems: "center",
  },
  fatwaIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  fatwaTextContainer: {
    flex: 1,
  },
  fatwaTitle: {
    fontWeight: "600",
    marginBottom: 2,
  },
  fatwaSubtitle: {},
});
