import React, { useState } from "react";
import { View, StyleSheet, FlatList, Modal, TextInput, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "../components/ThemedText";
import { Button } from "../components/Button";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";
import { useLayout } from "../lib/ThemePersonaContext";
import { Spacing, BorderRadius } from "../constants/theme";
import { useApp } from "../lib/AppContext";
import { Daughter } from "../lib/types";
import { getCurrentCycleDay } from "../lib/cycle-utils";

export default function DaughtersScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const layout = useLayout();
  const { data, addDaughter, deleteDaughter } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const { daughters } = data;

  const handleAddDaughter = async () => {
    if (name.trim() && age) {
      await addDaughter({
        name: name.trim(),
        age: parseInt(age) || 0,
        cycleSettings: {
          cycleLength: 28,
          periodLength: 5,
          lastPeriodStart: null,
        },
      });
      setName("");
      setAge("");
      setShowAddModal(false);
    }
  };

  const renderDaughter = ({ item }: { item: Daughter }) => {
    const cycleDay = getCurrentCycleDay(
      item.cycleSettings.lastPeriodStart,
      item.cycleSettings.cycleLength
    );

    return (
      <View
        style={[
          styles.daughterCard,
          { 
            backgroundColor: theme.backgroundDefault, 
            borderColor: theme.cardBorder,
            flexDirection: layout.flexDirection,
          },
        ]}
      >
        <View style={[styles.avatar, { backgroundColor: theme.primaryLight }]}>
          <ThemedText type="h3" style={{ color: "#FFFFFF" }}>
            {item.name.charAt(0).toUpperCase()}
          </ThemedText>
        </View>
        <View style={styles.daughterInfo}>
          <ThemedText type="h4">{item.name}</ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {t("daughters", "age")}: {item.age}
          </ThemedText>
          {cycleDay !== null ? (
            <View style={[styles.cycleInfo, { flexDirection: layout.flexDirection }]}>
              <View style={[styles.cycleDot, { backgroundColor: theme.primary }]} />
              <ThemedText type="small" style={{ color: theme.primary }}>
                {t("daughters", "dayOfCycle").replace("{day}", String(cycleDay))}
              </ThemedText>
            </View>
          ) : (
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {t("daughters", "cycleNotTracked")}
            </ThemedText>
          )}
        </View>
        <Pressable
          onPress={() => deleteDaughter(item.id)}
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
        data={daughters}
        keyExtractor={(item) => item.id}
        renderItem={renderDaughter}
        contentContainerStyle={{
          paddingHorizontal: Spacing.lg,
          paddingBottom: insets.bottom + 80,
        }}
        ListEmptyComponent={
          <View
            style={[
              styles.emptyState,
              { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder },
            ]}
          >
            <Feather name="users" size={40} color={theme.textSecondary} />
            <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: "center" }}>
              {t("daughters", "noDaughtersYet")}{"\n"}{t("daughters", "addDaughterToTrack")}
            </ThemedText>
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
          style={[styles.fab, { backgroundColor: theme.primary }]}
        >
          <Feather name="plus" size={24} color="#FFFFFF" />
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
              {t("daughters", "addDaughter")}
            </ThemedText>

            <View style={styles.inputGroup}>
              <ThemedText type="caption">{t("daughters", "name")}</ThemedText>
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
                placeholder={t("daughters", "enterName")}
                placeholderTextColor={theme.textSecondary}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText type="caption">{t("daughters", "age")}</ThemedText>
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
                placeholder={t("daughters", "enterAge")}
                placeholderTextColor={theme.textSecondary}
                value={age}
                onChangeText={setAge}
                keyboardType="number-pad"
              />
            </View>

            <View style={[styles.modalButtons, { flexDirection: layout.flexDirection }]}>
              <Button
                onPress={() => setShowAddModal(false)}
                variant="secondary"
                style={{ flex: 1 }}
              >
                {t("common", "cancel")}
              </Button>
              <Button
                onPress={handleAddDaughter}
                disabled={!name.trim() || !age}
                style={{ flex: 1 }}
              >
                {t("common", "add")}
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
  daughterCard: {
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    gap: Spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  daughterInfo: {
    flex: 1,
    gap: 2,
  },
  cycleInfo: {
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: 2,
  },
  cycleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
  modalButtons: {
    gap: Spacing.md,
  },
});
