// @ts-nocheck
import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { useTheme } from "../hooks/useTheme";
import { Spacing, BorderRadius } from "../constants/theme";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "cycle" | "beauty" | "qadha" | "reminder";
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "تذكير بالدورة",
    message: "موعد الدورة الشهرية المتوقع بعد 3 أيام",
    time: "منذ ساعة",
    type: "cycle",
    isRead: false,
  },
  {
    id: "2",
    title: "روتين الجمال الصباحي",
    message: "لا تنسي إكمال روتين العناية بالبشرة الصباحي",
    time: "منذ 3 ساعات",
    type: "beauty",
    isRead: false,
  },
  {
    id: "3",
    title: "تذكير بالقضاء",
    message: "لديك 5 أيام قضاء متبقية",
    time: "أمس",
    type: "qadha",
    isRead: true,
  },
  {
    id: "4",
    title: "شرب الماء",
    message: "تذكير بشرب الماء - أكملي 8 أكواب يومياً",
    time: "أمس",
    type: "reminder",
    isRead: true,
  },
  {
    id: "5",
    title: "روتين الجمال المسائي",
    message: "حان وقت روتين العناية بالبشرة المسائي",
    time: "منذ يومين",
    type: "beauty",
    isRead: true,
  },
];

function NotificationCard({ notification }: { notification: Notification }) {
  const { theme } = useTheme();

  const getIconAndColor = () => {
    switch (notification.type) {
      case "cycle":
        return { icon: "calendar" as const, color: theme.period };
      case "beauty":
        return { icon: "heart" as const, color: theme.primary };
      case "qadha":
        return { icon: "book-open" as const, color: theme.qadha };
      case "reminder":
        return { icon: "bell" as const, color: theme.secondary };
      default:
        return { icon: "bell" as const, color: theme.primary };
    }
  };

  const { icon, color } = getIconAndColor();

  const cardContent = (
    <>
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <Feather name={icon} size={20} color={color} />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <ThemedText type="h4" style={{ flex: 1 }}>
            {notification.title}
          </ThemedText>
          {!notification.isRead ? (
            <View style={[styles.unreadDot, { backgroundColor: theme.primary }]} />
          ) : null}
        </View>
        <ThemedText
          type="body"
          style={{ color: theme.textSecondary, marginTop: Spacing.xs, writingDirection: "rtl", textAlign: "right" }}
        >
          {notification.message}
        </ThemedText>
        <ThemedText
          type="small"
          style={{ color: theme.textSecondary, marginTop: Spacing.sm, textAlign: "right" }}
        >
          {notification.time}
        </ThemedText>
      </View>
    </>
  );

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.glassBackground,
          borderColor: theme.glassBorder,
        },
      ]}
    >
      {cardContent}
    </View>
  );
}

function EmptyState() {
  const { theme } = useTheme();

  return (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIcon, { backgroundColor: `${theme.textSecondary}20` }]}>
        <Feather name="bell-off" size={32} color={theme.textSecondary} />
      </View>
      <ThemedText
        type="h3"
        style={{ marginTop: Spacing.lg, textAlign: "center" }}
      >
        لا توجد إشعارات
      </ThemedText>
      <ThemedText
        type="body"
        style={{ color: theme.textSecondary, marginTop: Spacing.sm, textAlign: "center" }}
      >
        ستظهر الإشعارات هنا عند وصولها
      </ThemedText>
    </View>
  );
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();

  const renderItem = ({ item, index }: { item: Notification; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(300)}>
      <NotificationCard notification={item} />
    </Animated.View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={mockNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingTop: headerHeight + Spacing.md,
          paddingBottom: insets.bottom + Spacing.xxl,
          paddingHorizontal: Spacing.lg,
          flexGrow: 1,
        }}
        ListEmptyComponent={<EmptyState />}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardWrapper: {
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.medium,
    overflow: "hidden",
  },
  card: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    marginBottom: Spacing.md,
    overflow: "hidden",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.medium,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.md,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xxl,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
