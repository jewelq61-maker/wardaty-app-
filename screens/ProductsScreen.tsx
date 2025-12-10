import React, { useState } from "react";
import { View, StyleSheet, FlatList, Modal, TextInput, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { useLayout } from "@/lib/ThemePersonaContext";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { useApp } from "@/lib/AppContext";
import { BeautyProduct } from "@/lib/types";
import { formatDate, daysBetween, getTodayString } from "@/lib/cycle-utils";

const CATEGORIES = [
  "cleanser",
  "toner",
  "serum",
  "moisturizer",
  "mask",
  "exfoliant",
  "other",
] as const;

const categoryLabels: Record<BeautyProduct["category"], { en: string; ar: string }> = {
  cleanser: { en: "Cleanser", ar: "منظف" },
  toner: { en: "Toner", ar: "تونر" },
  serum: { en: "Serum", ar: "سيروم" },
  moisturizer: { en: "Moisturizer", ar: "مرطب" },
  mask: { en: "Mask", ar: "ماسك" },
  exfoliant: { en: "Exfoliant", ar: "مقشر" },
  other: { en: "Other", ar: "أخرى" },
};

export default function ProductsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const layout = useLayout();
  const { data, addBeautyProduct, deleteBeautyProduct } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [productName, setProductName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<BeautyProduct["category"]>("other");

  const { beautyProducts } = data;
  
  const getCategoryLabel = (cat: BeautyProduct["category"]) => {
    return language === "ar" ? categoryLabels[cat].ar : categoryLabels[cat].en;
  };

  const handleAddProduct = async () => {
    if (productName.trim()) {
      await addBeautyProduct({
        name: productName.trim(),
        category: selectedCategory,
      });
      setProductName("");
      setSelectedCategory("other");
      setShowAddModal(false);
    }
  };

  const getExpiryWarning = (product: BeautyProduct) => {
    if (!product.expiryDate) return null;
    const days = daysBetween(getTodayString(), product.expiryDate);
    if (days < 0) return { text: "Expired", color: theme.error };
    if (days < 30) return { text: `${days} days left`, color: theme.warning };
    return null;
  };

  const renderProduct = ({ item }: { item: BeautyProduct }) => {
    const warning = getExpiryWarning(item);
    return (
      <View
        style={[
          styles.productCard,
          { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder },
        ]}
      >
        <View style={styles.productInfo}>
          <ThemedText type="h4">{item.name}</ThemedText>
          <View style={styles.productMeta}>
            <View style={[styles.categoryBadge, { backgroundColor: theme.backgroundSecondary }]}>
              <ThemedText type="small" style={{ color: theme.primary }}>
                {getCategoryLabel(item.category)}
              </ThemedText>
            </View>
            {warning ? (
              <View style={[styles.warningBadge, { backgroundColor: warning.color + "20" }]}>
                <Feather name="alert-triangle" size={12} color={warning.color} />
                <ThemedText type="small" style={{ color: warning.color }}>
                  {warning.text}
                </ThemedText>
              </View>
            ) : null}
          </View>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {language === "ar" ? "أُضيف في " : "Added "}{formatDate(item.addedDate)}
          </ThemedText>
        </View>
        <Pressable
          onPress={() => deleteBeautyProduct(item.id)}
          style={styles.deleteButton}
        >
          <Feather name="trash-2" size={18} color={theme.textSecondary} />
        </Pressable>
      </View>
    );
  };

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
      <FlatList
        data={beautyProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        contentContainerStyle={{
          paddingHorizontal: Spacing.lg,
          paddingBottom: tabBarHeight + Spacing.xl + 80,
        }}
        ListEmptyComponent={
          <View
            style={[
              styles.emptyState,
              { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder },
            ]}
          >
            <Feather name="package" size={40} color={theme.textSecondary} />
            <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: "center" }}>
              {language === "ar" 
                ? "لا توجد منتجات بعد.\nابدئي بناء مجموعتك التجميلية."
                : "No products added yet.\nStart building your beauty collection."}
            </ThemedText>
            <Button
              onPress={() => setShowAddModal(true)}
              style={{ marginTop: Spacing.md }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: Spacing.sm }}>
                <Feather name="plus" size={18} color="#FFFFFF" />
                <ThemedText type="body" style={{ color: "#FFFFFF", fontWeight: "600" }}>
                  {language === "ar" ? "أضيفي منتج" : "Add Product"}
                </ThemedText>
              </View>
            </Button>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
      />

      <View
        style={[
          styles.fabContainer,
          { bottom: tabBarHeight + Spacing.lg },
        ]}
      >
        <Pressable
          onPress={() => setShowAddModal(true)}
          style={[styles.fab, Shadows.fab, { backgroundColor: theme.primary }]}
        >
          <View style={styles.fabGradient}>
            <Feather name="plus" size={24} color="#FFFFFF" />
          </View>
        </Pressable>
      </View>

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowAddModal(false)}
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.backgroundDefault,
                paddingBottom: insets.bottom + Spacing.lg,
              },
            ]}
          >
            <View style={styles.modalHandle} />
            <ThemedText type="h3" style={styles.modalTitle}>
              {language === "ar" ? "إضافة منتج" : "Add Product"}
            </ThemedText>

            <View style={styles.inputGroup}>
              <ThemedText type="caption">
                {language === "ar" ? "اسم المنتج" : "Product Name"}
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.backgroundSecondary,
                    borderColor: theme.cardBorder,
                    color: theme.text,
                    textAlign: layout.textAlign,
                  },
                ]}
                placeholder={language === "ar" ? "أدخلي اسم المنتج" : "Enter product name"}
                placeholderTextColor={theme.textSecondary}
                value={productName}
                onChangeText={setProductName}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText type="caption">
                {language === "ar" ? "الفئة" : "Category"}
              </ThemedText>
              <View style={styles.categoriesGrid}>
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <Pressable
                      key={cat}
                      onPress={() => setSelectedCategory(cat)}
                      style={[
                        styles.categoryOption,
                        {
                          backgroundColor: isSelected ? theme.primary : theme.backgroundSecondary,
                          borderColor: isSelected ? theme.primary : theme.cardBorder,
                          overflow: "hidden",
                        },
                      ]}
                    >
                      <View style={styles.categoryGradient}>
                        <ThemedText type="small" style={{ color: isSelected ? "#FFFFFF" : theme.text, fontWeight: isSelected ? "600" : "400" }}>
                          {getCategoryLabel(cat)}
                        </ThemedText>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.modalButtons}>
              <Button
                onPress={() => setShowAddModal(false)}
                variant="secondary"
                style={{ flex: 1 }}
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onPress={handleAddProduct}
                disabled={!productName.trim()}
                style={{ flex: 1 }}
              >
                {language === "ar" ? "إضافة" : "Add"}
              </Button>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
  },
  productInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  productMeta: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.small,
  },
  warningBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.small,
  },
  deleteButton: {
    padding: Spacing.sm,
  },
  emptyState: {
    padding: Spacing.xxl,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    alignItems: "center",
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  fabContainer: {
    position: "absolute",
    right: Spacing.lg,
    bottom: 0,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  fabGradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xlarge,
    borderTopRightRadius: BorderRadius.xlarge,
    padding: Spacing.lg,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignSelf: "center",
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  inputGroup: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  categoryOption: {
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
  },
  categoryGradient: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.medium - 1,
  },
  modalButtons: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
});
