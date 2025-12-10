import React from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { DarkTheme, Spacing, BorderRadius, Typography, Shadows, Glass } from "@/constants/theme";
import { Persona } from "@/lib/types";

interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  excerpt?: string;
}

interface ArticlesPreviewProps {
  articles: Article[];
  persona: Persona;
  onArticlePress: (articleId: string) => void;
  onViewAllPress: () => void;
}

export function ArticlesPreview({
  articles,
  persona,
  onArticlePress,
  onViewAllPress,
}: ArticlesPreviewProps) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Feather name="book-open" size={24} color={DarkTheme.text.primary} />
          <ThemedText type="h3" style={styles.title}>
            مقالات مميزة
          </ThemedText>
        </View>
        <Pressable onPress={onViewAllPress} style={styles.viewAllButton}>
          <ThemedText type="small" style={styles.viewAllText}>
            عرض الكل
          </ThemedText>
          <Feather name="chevron-left" size={16} color={DarkTheme.text.secondary} />
        </Pressable>
      </View>

      {/* Articles Grid */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {articles.map((article, index) => (
          <ArticleCard
            key={article.id}
            article={article}
            onPress={() => onArticlePress(article.id)}
            isFirst={index === 0}
          />
        ))}
      </ScrollView>
    </View>
  );
}

interface ArticleCardProps {
  article: Article;
  onPress: () => void;
  isFirst: boolean;
}

function ArticleCard({ article, onPress, isFirst }: ArticleCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        isFirst && styles.cardFirst,
        pressed && styles.cardPressed,
      ]}
    >
      <BlurView intensity={80} tint="dark" style={styles.cardBlur}>
        <View style={styles.cardContent}>
          {/* Category Badge */}
          <View style={styles.categoryBadge}>
            <ThemedText type="caption" style={styles.categoryText}>
              {article.category}
            </ThemedText>
          </View>

          {/* Title */}
          <ThemedText type="h4" style={styles.articleTitle} numberOfLines={2}>
            {article.title}
          </ThemedText>

          {/* Excerpt */}
          {article.excerpt && (
            <ThemedText type="small" style={styles.excerpt} numberOfLines={2}>
              {article.excerpt}
            </ThemedText>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.readTime}>
              <Feather name="clock" size={14} color={DarkTheme.text.tertiary} />
              <ThemedText type="caption" style={styles.readTimeText}>
                {article.readTime}
              </ThemedText>
            </View>
            <Feather name="arrow-left" size={16} color={DarkTheme.text.secondary} />
          </View>
        </View>
      </BlurView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xxl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  title: {
    color: DarkTheme.text.primary,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  viewAllText: {
    color: DarkTheme.text.secondary,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  card: {
    width: 280,
    height: 180,
    borderRadius: BorderRadius.large,
    overflow: "hidden",
    ...Shadows.card,
  },
  cardFirst: {
    marginLeft: 0,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  cardBlur: {
    flex: 1,
    backgroundColor: Glass.tint,
    borderWidth: 1,
    borderColor: Glass.border,
  },
  cardContent: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: "space-between",
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.small,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  categoryText: {
    color: DarkTheme.text.secondary,
    fontSize: 11,
  },
  articleTitle: {
    color: DarkTheme.text.primary,
    marginTop: Spacing.sm,
    ...Typography.h4,
  },
  excerpt: {
    color: DarkTheme.text.tertiary,
    marginTop: Spacing.xs,
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  readTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  readTimeText: {
    color: DarkTheme.text.tertiary,
  },
});
