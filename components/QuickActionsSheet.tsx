import React from "react";
import { View, Text, StyleSheet, Pressable, Modal, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { useLanguage } from "../hooks/useLanguage";
import { useRTL } from "../hooks/useRTL";
import { useApp } from "../lib/AppContext";
import { DarkTheme, getPersonaColor, Typography, Spacing, BorderRadius, Shadows } from "../constants/theme";

interface QuickAction {
  id: string;
  icon: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  onPress: () => void;
}

interface QuickActionsSheetProps {
  visible: boolean;
  onClose: () => void;
  actions: QuickAction[];
}

export function QuickActionsSheet({ visible, onClose, actions }: QuickActionsSheetProps) {
  const insets = useSafeAreaInsets();
  const { language } = useLanguage();
  const rtl = useRTL();
  const { data } = useApp();
  
  const personaColor = getPersonaColor(data?.settings?.persona || "single");

  const handleActionPress = (action: QuickAction) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onClose();
    // Small delay to let sheet close animation finish
    setTimeout(() => action.onPress(), 300);
  };

  const handleBackdropPress = () => {
    Haptics.selectionAsync();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={styles.backdrop}
      >
        <Pressable style={styles.backdropPressable} onPress={handleBackdropPress} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        entering={SlideInDown.springify().damping(20).stiffness(300)}
        exiting={SlideOutDown.duration(200)}
        style={[
          styles.sheetContainer,
          { paddingBottom: insets.bottom + Spacing.md },
        ]}
      >
        {/* Background with blur */}
        {Platform.OS === "ios" ? (
          <BlurView intensity={95} tint="dark" style={StyleSheet.absoluteFill} />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.sheetBackground]} />
        )}

        {/* Handle */}
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        {/* Title */}
        <View style={styles.header}>
          <Text style={[styles.title, { textAlign: rtl.textAlign }]}>
            {language === "ar" ? "إضافة سريعة" : "Quick Add"}
          </Text>
          <Text style={[styles.subtitle, { textAlign: rtl.textAlign }]}>
            {language === "ar" ? "اختاري ما تريدين إضافته" : "Choose what to add"}
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          {actions.map((action, index) => (
            <Pressable
              key={action.id}
              style={({ pressed }) => [
                styles.actionItem,
                { opacity: pressed ? 0.6 : 1 },
              ]}
              onPress={() => handleActionPress(action)}
            >
              <View
                style={[
                  styles.actionIconContainer,
                  { backgroundColor: personaColor.soft },
                ]}
              >
                <Feather
                  name={action.icon as any}
                  size={24}
                  color={personaColor.primary}
                />
              </View>
              <View style={[styles.actionTextContainer, { flexDirection: rtl.flexDirection }]}>
                <Text style={[styles.actionTitle, { textAlign: rtl.textAlign }]}>
                  {language === "ar" ? action.titleAr : action.titleEn}
                </Text>
                <Text style={[styles.actionDescription, { textAlign: rtl.textAlign }]}>
                  {language === "ar" ? action.descriptionAr : action.descriptionEn}
                </Text>
              </View>
              <Feather
                name={rtl.isRTL ? "chevron-left" : "chevron-right"}
                size={20}
                color={DarkTheme.text.tertiary}
              />
            </Pressable>
          ))}
        </View>

        {/* Cancel Button */}
        <Pressable
          style={({ pressed }) => [
            styles.cancelButton,
            { opacity: pressed ? 0.6 : 1 },
          ]}
          onPress={handleBackdropPress}
        >
          <Text style={styles.cancelButtonText}>
            {language === "ar" ? "إلغاء" : "Cancel"}
          </Text>
        </Pressable>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdropPressable: {
    flex: 1,
  },
  sheetContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    overflow: "hidden",
    ...Shadows.large,
  },
  sheetBackground: {
    backgroundColor: DarkTheme.background.elevated,
  },
  handleContainer: {
    alignItems: "center",
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: DarkTheme.text.tertiary,
    opacity: 0.3,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  title: {
    ...Typography.title2,
    color: DarkTheme.text.primary,
    marginBottom: Spacing.xxs,
  },
  subtitle: {
    ...Typography.subheadline,
    color: DarkTheme.text.secondary,
  },
  actionsContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    backgroundColor: DarkTheme.background.card,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
    minHeight: 72,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  actionTextContainer: {
    flex: 1,
    gap: Spacing.xxs,
  },
  actionTitle: {
    ...Typography.headline,
    color: DarkTheme.text.primary,
  },
  actionDescription: {
    ...Typography.footnote,
    color: DarkTheme.text.secondary,
  },
  cancelButton: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    padding: Spacing.md,
    backgroundColor: DarkTheme.background.card,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  cancelButtonText: {
    ...Typography.headline,
    color: DarkTheme.text.primary,
  },
});
