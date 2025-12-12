// @ts-nocheck
import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { ThemedText } from "../components/ThemedText";
import { Card } from "../components/Card";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";
import { useLayout } from "../lib/ThemePersonaContext";
import { useApp } from "../lib/AppContext";
import { Spacing, BorderRadius } from "../constants/theme";
import { getApiUrl } from "../lib/query-client";
import { getAllArticles, getRelatedArticles } from "../data/articles";

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

type ArticleDetailParams = { articleId: string };

export default function ArticleDetailScreen() {
  const route = useRoute<RouteProp<{ ArticleDetail: ArticleDetailParams }, "ArticleDetail">>();
  const navigation = useNavigation<any>();
  const articleId = route.params?.articleId;
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();
  const layout = useLayout();
  const { data } = useApp();

  // Offline mode: use local articles data
  const allArticles = getAllArticles();
  const foundArticle = allArticles.find((a: any) => a.id === articleId);
  const article: Article | null = foundArticle ? {
    id: foundArticle.id,
    titleAr: foundArticle.titleAr,
    titleEn: foundArticle.titleEn,
    contentAr: foundArticle.contentAr,
    contentEn: foundArticle.contentEn,
    category: foundArticle.category,
    readTime: foundArticle.readTime,
    icon: foundArticle.icon,
    personas: foundArticle.personas,
    createdAt: new Date(foundArticle.createdAt),
    updatedAt: new Date(foundArticle.updatedAt),
  } : null;
  const isLoadingArticle = false;
  
  // const { data: article, isLoading: isLoadingArticle } = useQuery<Article>({
  //   queryKey: ["/api/articles", articleId],
  //   queryFn: async () => {
  //     const url = new URL(`/api/articles/${articleId}`, getApiUrl());
  //     const response = await fetch(url.toString());
  //     if (!response.ok) throw new Error("Failed to fetch article");
  //     return response.json();
  //   },
  // });

  // Offline mode: use local related articles
  const relatedArticlesData = articleId ? getRelatedArticles(articleId) : [];
  const relatedArticles: Article[] = relatedArticlesData.map(article => ({
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
  const isLoadingRelated = false;
  
  // const { data: relatedArticles = [], isLoading: isLoadingRelated } = useQuery<Article[]>({
  //   queryKey: ["/api/articles", articleId, "related", data.settings.persona],
  //   queryFn: async () => {
  //     const url = new URL(`/api/articles/${articleId}/related`, getApiUrl());
  //     if (data.settings.persona) {
  //       url.searchParams.set("persona", data.settings.persona);
  //     }
  //     const response = await fetch(url.toString());
  //     if (!response.ok) throw new Error("Failed to fetch related articles");
  //     return response.json();
  //   },
  //   enabled: !!articleId,
  // });

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

  const getArticleTitle = (a: Article) => {
    return isRTL ? a.titleAr : a.titleEn;
  };

  const getArticleContent = (a: Article) => {
    return isRTL ? a.contentAr : a.contentEn;
  };

  const handleRelatedArticlePress = (id: string) => {
    navigation.push("ArticleDetail", { articleId: id });
  };

  if (isLoadingArticle || !article) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.backgroundRoot }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const categoryColor = getCategoryColor(article.category);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.lg,
        paddingBottom: insets.bottom + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      showsVerticalScrollIndicator={false}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <View style={[styles.header, { flexDirection: layout.flexDirection }]}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: categoryColor + "20" },
          ]}
        >
          <Feather
            name={article.icon as keyof typeof Feather.glyphMap}
            size={32}
            color={categoryColor}
          />
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: categoryColor + "20" }]}>
          <ThemedText type="small" style={{ color: categoryColor }}>
            {getCategoryLabel(article.category)}
          </ThemedText>
        </View>
        <View style={[styles.readTime, { flexDirection: layout.flexDirection }]}>
          <Feather name="clock" size={14} color={theme.textSecondary} />
          <ThemedText
            type="caption"
            style={{
              color: theme.textSecondary,
              [layout.marginStart]: 6,
            }}
          >
            {article.readTime} {t("articles", "min")}
          </ThemedText>
        </View>
      </View>

      <ThemedText
        type="h1"
        style={[styles.title, { textAlign: layout.textAlign }]}
      >
        {getArticleTitle(article)}
      </ThemedText>

      <Card style={styles.contentCard}>
        <ThemedText
          type="body"
          style={[styles.content, { textAlign: layout.textAlign }]}
        >
          {getArticleContent(article) || t("articles", "noArticles")}
        </ThemedText>
      </Card>

      {relatedArticles.length > 0 ? (
        <View style={styles.relatedSection}>
          <ThemedText
            type="h3"
            style={[styles.relatedTitle, { textAlign: layout.textAlign }]}
          >
            {t("articles", "relatedArticles")}
          </ThemedText>
          {relatedArticles.map((relatedArticle) => (
            <Card
              key={relatedArticle.id}
              style={styles.relatedCard}
              onPress={() => handleRelatedArticlePress(relatedArticle.id)}
            >
              <View style={[styles.relatedContent, { flexDirection: layout.flexDirection }]}>
                <View
                  style={[
                    styles.relatedIconContainer,
                    { backgroundColor: getCategoryColor(relatedArticle.category) + "20" },
                    { [layout.marginEnd]: Spacing.md },
                  ]}
                >
                  <Feather
                    name={relatedArticle.icon as keyof typeof Feather.glyphMap}
                    size={18}
                    color={getCategoryColor(relatedArticle.category)}
                  />
                </View>
                <View style={styles.relatedInfo}>
                  <ThemedText
                    type="body"
                    numberOfLines={2}
                    style={[styles.relatedArticleTitle, { textAlign: layout.textAlign }]}
                  >
                    {getArticleTitle(relatedArticle)}
                  </ThemedText>
                  <View style={[styles.relatedMeta, { flexDirection: layout.flexDirection }]}>
                    <Feather name="clock" size={12} color={theme.textSecondary} />
                    <ThemedText
                      type="small"
                      style={{
                        color: theme.textSecondary,
                        [layout.marginStart]: 4,
                      }}
                    >
                      {relatedArticle.readTime} {t("articles", "min")}
                    </ThemedText>
                  </View>
                </View>
                <Feather
                  name={layout.isRTL ? "chevron-left" : "chevron-right"}
                  size={18}
                  color={theme.textSecondary}
                />
              </View>
            </Card>
          ))}
        </View>
      ) : null}
    </ScrollView>
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
  header: {
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.small,
  },
  readTime: {
    alignItems: "center",
  },
  title: {
    marginBottom: Spacing.lg,
  },
  contentCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  content: {
    lineHeight: 26,
  },
  relatedSection: {
    marginTop: Spacing.md,
  },
  relatedTitle: {
    marginBottom: Spacing.md,
  },
  relatedCard: {
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  relatedContent: {
    alignItems: "center",
  },
  relatedIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  relatedInfo: {
    flex: 1,
  },
  relatedArticleTitle: {
    marginBottom: Spacing.xs,
  },
  relatedMeta: {
    alignItems: "center",
  },
});
