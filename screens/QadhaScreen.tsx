import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Modal, TextInput, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "../components/ThemedText";
import { Button } from "../components/Button";
import { QadhaCounter } from "../components/QadhaCounter";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";
import { Spacing, BorderRadius } from "../constants/theme";
import { useApp } from "../lib/AppContext";
import { useLayout } from "../lib/ThemePersonaContext";
import { formatDate } from "../lib/cycle-utils";

export default function QadhaScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();
  const layout = useLayout();
  const { data, addMadeUpDay, addMissedDay, deleteMadeUpDay, initializeQadha, updateTotalMissed } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [addType, setAddType] = useState<"missed" | "made_up">("made_up");
  const [notes, setNotes] = useState("");
  const [missedDaysInput, setMissedDaysInput] = useState("");

  const { qadhaLogs, qadhaSummary } = data;

  const sortedLogs = [...qadhaLogs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleAddQadha = async () => {
    if (addType === "made_up") {
      await addMadeUpDay(undefined, notes.trim() || undefined);
    } else {
      await addMissedDay(notes.trim() || undefined);
    }
    setNotes("");
    setShowAddModal(false);
  };

  const handleDeleteLog = (logId: string) => {
    Alert.alert(
      isRTL ? "تأكيد الحذف" : "Confirm Delete",
      isRTL ? "هل تريد حذف هذا السجل؟" : "Are you sure you want to delete this log?",
      [
        { text: t("common", "cancel"), style: "cancel" },
        {
          text: t("common", "delete"),
          style: "destructive",
          onPress: () => deleteMadeUpDay(logId),
        },
      ]
    );
  };

  const openAddModal = (type: "missed" | "made_up") => {
    setAddType(type);
    setShowAddModal(true);
  };

  const handleSetupQadha = async () => {
    const totalMissed = parseInt(missedDaysInput, 10);
    if (isNaN(totalMissed) || totalMissed < 0) {
      Alert.alert(
        isRTL ? "خطأ" : "Error",
        isRTL ? "أدخلي عددًا صحيحًا" : "Please enter a valid number"
      );
      return;
    }
    
    if (qadhaLogs.length > 0) {
      Alert.alert(
        isRTL ? "تأكيد إعادة التعيين" : "Confirm Reset",
        isRTL
          ? "لديك سجلات قضاء سابقة. هل تريدين إعادة التعيين؟ سيتم حذف جميع السجلات السابقة."
          : "You have existing qadha logs. Are you sure you want to reset? All previous logs will be deleted.",
        [
          { text: t("common", "cancel"), style: "cancel" },
          {
            text: isRTL ? "إعادة التعيين" : "Reset",
            style: "destructive",
            onPress: async () => {
              await initializeQadha(totalMissed);
              setMissedDaysInput("");
              setShowSetupModal(false);
            },
          },
        ]
      );
      return;
    }
    
    await initializeQadha(totalMissed);
    setMissedDaysInput("");
    setShowSetupModal(false);
  };

  const handleUpdateTotal = async () => {
    Alert.prompt(
      isRTL ? "تحديث الأيام الفائتة" : "Update Missed Days",
      isRTL ? "أدخلي العدد الجديد للأيام الفائتة" : "Enter the new total of missed days",
      [
        { text: t("common", "cancel"), style: "cancel" },
        {
          text: t("common", "save"),
          onPress: async (value: string | undefined) => {
            const newTotal = parseInt(value || "0", 10);
            if (!isNaN(newTotal) && newTotal >= 0) {
              await updateTotalMissed(newTotal);
            }
          },
        },
      ],
      "plain-text",
      qadhaSummary.totalMissed.toString()
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
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingBottom: insets.bottom + Spacing.xl,
          paddingHorizontal: Spacing.lg,
        }}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <QadhaCounter
          missed={qadhaSummary.totalMissed}
          completed={qadhaSummary.totalMadeUp}
        />

        <View style={styles.buttons}>
          <Button onPress={() => openAddModal("made_up")} style={{ flex: 1 }}>
            {isRTL ? "تسجيل يوم قضاء" : "Log Made-Up Day"}
          </Button>
          <Button
            onPress={() => openAddModal("missed")}
            variant="secondary"
            style={{ flex: 1 }}
          >
            {isRTL ? "إضافة يوم فائت" : "Add Missed Day"}
          </Button>
        </View>

        {qadhaSummary.totalMissed === 0 && qadhaLogs.length === 0 ? (
          <View style={styles.setupSection}>
            <View
              style={[
                styles.setupCard,
                { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder },
              ]}
            >
              <Feather name="calendar" size={48} color={theme.primary} />
              <ThemedText type="h4" style={{ textAlign: "center" }}>
                {isRTL ? "إعداد تتبع القضاء" : "Setup Qadha Tracking"}
              </ThemedText>
              <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: "center" }}>
                {isRTL
                  ? "أدخلي عدد الأيام التي تحتاجين قضاءها من رمضان"
                  : "Enter the number of days you need to make up from Ramadan"}
              </ThemedText>
              <Button onPress={() => setShowSetupModal(true)}>
                {isRTL ? "ابدئي الآن" : "Get Started"}
              </Button>
            </View>
          </View>
        ) : null}

        <View style={[styles.actionsRow, { flexDirection: layout.flexDirection }]}>
          <Pressable
            onPress={handleUpdateTotal}
            style={[styles.actionButton, { backgroundColor: theme.backgroundDefault, flexDirection: layout.flexDirection }]}
          >
            <Feather name="edit-2" size={16} color={theme.primary} />
            <ThemedText type="small" style={{ color: theme.primary }}>
              {isRTL ? "تعديل المجموع" : "Edit Total"}
            </ThemedText>
          </Pressable>
        </View>

        <View style={styles.historySection}>
          <ThemedText type="h4" style={{ textAlign: layout.textAlign }}>
            {isRTL ? "النشاط الأخير" : "Recent Activity"}
          </ThemedText>
          {sortedLogs.length === 0 ? (
            <View
              style={[
                styles.emptyState,
                { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder },
              ]}
            >
              <Feather name="calendar" size={40} color={theme.textSecondary} />
              <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: "center" }}>
                {isRTL
                  ? "لم يتم تسجيل أي أيام قضاء بعد.\nابدئي بتتبع صيامك المقضي."
                  : "No qadha days logged yet.\nStart tracking your made-up fasts."}
              </ThemedText>
            </View>
          ) : (
            <View style={styles.logsList}>
              {sortedLogs.slice(0, 15).map((log) => (
                <View
                  key={log.id}
                  style={[
                    styles.logItem,
                    { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder, flexDirection: layout.flexDirection },
                  ]}
                >
                  <View
                    style={[
                      styles.logIcon,
                      {
                        backgroundColor:
                          log.type === "made_up" ? theme.success + "20" : theme.error + "20",
                      },
                    ]}
                  >
                    <Feather
                      name={log.type === "made_up" ? "check-circle" : "x-circle"}
                      size={20}
                      color={log.type === "made_up" ? theme.success : theme.error}
                    />
                  </View>
                  <View style={[styles.logContent, { alignItems: layout.alignSelf }]}>
                    <ThemedText type="body" style={{ textAlign: layout.textAlign }}>
                      {log.type === "made_up"
                        ? isRTL ? "يوم قضاء" : "Made-up day"
                        : isRTL ? "يوم فائت" : "Missed day"}
                    </ThemedText>
                    <ThemedText type="small" style={{ color: theme.textSecondary, textAlign: layout.textAlign }}>
                      {formatDate(log.date, "long")}
                    </ThemedText>
                    {log.notes ? (
                      <ThemedText type="small" style={{ color: theme.textSecondary, textAlign: layout.textAlign }}>
                        {log.notes}
                      </ThemedText>
                    ) : null}
                  </View>
                  <Pressable
                    onPress={() => handleDeleteLog(log.id)}
                    style={styles.deleteButton}
                  >
                    <Feather name="trash-2" size={18} color={theme.textSecondary} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

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
              {addType === "made_up"
                ? isRTL ? "تسجيل يوم قضاء" : "Log Made-Up Day"
                : isRTL ? "إضافة يوم فائت" : "Add Missed Day"}
            </ThemedText>
            <TextInput
              style={[
                styles.notesInput,
                {
                  backgroundColor: theme.backgroundSecondary,
                  borderColor: theme.cardBorder,
                  color: theme.text,
                  textAlign: layout.textAlign,
                },
              ]}
              placeholder={isRTL ? "أضيفي ملاحظة (اختياري)" : "Add a note (optional)"}
              placeholderTextColor={theme.textSecondary}
              value={notes}
              onChangeText={setNotes}
              multiline
            />
            <View style={styles.modalButtons}>
              <Button
                onPress={() => setShowAddModal(false)}
                variant="secondary"
                style={{ flex: 1 }}
              >
                {t("common", "cancel")}
              </Button>
              <Button onPress={handleAddQadha} style={{ flex: 1 }}>
                {t("common", "save")}
              </Button>
            </View>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={showSetupModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowSetupModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowSetupModal(false)}
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
              {isRTL ? "إعداد القضاء" : "Setup Qadha"}
            </ThemedText>
            <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: "center", marginBottom: Spacing.lg }}>
              {isRTL
                ? "كم يومًا تحتاجين لقضائه؟"
                : "How many days do you need to make up?"}
            </ThemedText>
            <TextInput
              style={[
                styles.numberInput,
                {
                  backgroundColor: theme.backgroundSecondary,
                  borderColor: theme.cardBorder,
                  color: theme.text,
                },
              ]}
              placeholder="0"
              placeholderTextColor={theme.textSecondary}
              value={missedDaysInput}
              onChangeText={setMissedDaysInput}
              keyboardType="number-pad"
              textAlign="center"
            />
            <View style={styles.modalButtons}>
              <Button
                onPress={() => setShowSetupModal(false)}
                variant="secondary"
                style={{ flex: 1 }}
              >
                {t("common", "cancel")}
              </Button>
              <Button onPress={handleSetupQadha} style={{ flex: 1 }}>
                {t("common", "save")}
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
  scrollView: {
    flex: 1,
  },
  buttons: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  setupSection: {
    marginTop: Spacing.xl,
  },
  setupCard: {
    padding: Spacing.xxl,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    alignItems: "center",
    gap: Spacing.md,
  },
  actionsRow: {
    marginTop: Spacing.lg,
  },
  actionButton: {
    alignItems: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.medium,
  },
  historySection: {
    marginTop: Spacing.xxl,
    gap: Spacing.md,
  },
  emptyState: {
    padding: Spacing.xxl,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    alignItems: "center",
    gap: Spacing.md,
  },
  logsList: {
    gap: Spacing.md,
  },
  logItem: {
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    gap: Spacing.md,
  },
  logIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logContent: {
    flex: 1,
    gap: 2,
  },
  deleteButton: {
    padding: Spacing.sm,
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
    marginBottom: Spacing.lg,
  },
  notesInput: {
    height: 100,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    padding: Spacing.lg,
    fontSize: 16,
    textAlignVertical: "top",
    marginBottom: Spacing.lg,
  },
  numberInput: {
    height: 60,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    padding: Spacing.lg,
    fontSize: 24,
    fontWeight: "600",
    marginBottom: Spacing.lg,
  },
  modalButtons: {
    flexDirection: "row",
    gap: Spacing.md,
  },
});
