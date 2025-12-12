// @ts-nocheck
import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Alert,
  Modal,
  TextInput,
  FlatList,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "../components/ThemedText";
import { KeyboardAwareScrollViewCompat } from "../components/KeyboardAwareScrollViewCompat";
import { Button } from "../components/Button";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";
import { useLayout, useThemePersona } from "../lib/ThemePersonaContext";
import { Spacing, BorderRadius, Animations } from "../constants/theme";
import { useApp } from "../lib/AppContext";
import { Persona } from "../lib/types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const PERSONA_OPTIONS: { id: Persona; icon: keyof typeof Feather.glyphMap }[] = [
  { id: "single", icon: "user" },
  { id: "married", icon: "heart" },
  { id: "mother", icon: "users" },
];

const CYCLE_LENGTH_OPTIONS = Array.from({ length: 15 }, (_, i) => 21 + i);
const PERIOD_LENGTH_OPTIONS = [3, 4, 5, 6, 7, 8];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PersonaCardProps {
  option: { id: Persona; icon: keyof typeof Feather.glyphMap };
  isSelected: boolean;
  onSelect: () => void;
  label: string;
  theme: any;
}

function PersonaCard({ option, isSelected, onSelect, label, theme }: PersonaCardProps) {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(isSelected ? 1 : 0);

  React.useEffect(() => {
    glowOpacity.value = withSpring(isSelected ? 1 : 0, Animations.spring);
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowOpacity.value, [0, 1], [0, 0.25]),
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, Animations.spring);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, Animations.spring);
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.personaCard, animatedStyle]}
    >
      <Animated.View
        style={[
          styles.personaGlow,
          { backgroundColor: theme.personaAccent },
          glowStyle,
        ]}
      />
      <View
        style={[
          styles.personaCardInner,
          {
            backgroundColor: isSelected
              ? theme.personaAccent + "18"
              : theme.backgroundGlass,
            borderColor: isSelected ? theme.personaAccent : theme.glassBorder,
          },
        ]}
      >
        <View
          style={[
            styles.personaIconContainer,
            {
              backgroundColor: isSelected
                ? theme.personaAccent
                : theme.backgroundSecondary,
            },
          ]}
        >
          <Feather
            name={option.icon}
            size={32}
            color={isSelected ? "#FFFFFF" : theme.textSecondary}
          />
        </View>
        <ThemedText
          type="body"
          style={{
            color: isSelected ? theme.personaAccent : theme.text,
            textAlign: "center",
            fontWeight: isSelected ? "600" : "400",
          }}
        >
          {label}
        </ThemedText>
        {isSelected ? (
          <View style={[styles.checkBadge, { backgroundColor: theme.personaAccent }]}>
            <Feather name="check" size={14} color="#FFFFFF" />
          </View>
        ) : null}
      </View>
    </AnimatedPressable>
  );
}

interface PickerModalProps {
  visible: boolean;
  onClose: () => void;
  options: number[];
  selectedValue: number;
  onSelect: (value: number) => void;
  title: string;
  theme: any;
  layout: any;
  suffix: string;
}

function PickerModal({
  visible,
  onClose,
  options,
  selectedValue,
  onSelect,
  title,
  theme,
  layout,
  suffix,
}: PickerModalProps) {
  const insets = useSafeAreaInsets();

  const handleSelect = (value: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(value);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: theme.backgroundDefault,
              paddingBottom: insets.bottom + Spacing.lg,
            },
          ]}
        >
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <View style={[styles.modalHandle, { backgroundColor: theme.textMuted }]} />
            <ThemedText
              type="h3"
              style={{ textAlign: "center", marginTop: Spacing.md }}
            >
              {title}
            </ThemedText>
          </View>
          <FlatList
            data={options}
            keyExtractor={(item) => item.toString()}
            contentContainerStyle={styles.modalList}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSelect(item)}
                style={[
                  styles.modalOption,
                  {
                    backgroundColor:
                      selectedValue === item
                        ? theme.personaAccent + "15"
                        : "transparent",
                    borderColor:
                      selectedValue === item
                        ? theme.personaAccent
                        : theme.cardBorder,
                  },
                ]}
              >
                <ThemedText
                  type="body"
                  style={{
                    color: selectedValue === item ? theme.personaAccent : theme.text,
                    fontWeight: selectedValue === item ? "600" : "400",
                    textAlign: "center",
                  }}
                >
                  {item} {suffix}
                </ThemedText>
                {selectedValue === item ? (
                  <Feather
                    name="check"
                    size={20}
                    color={theme.personaAccent}
                    style={styles.modalOptionCheck}
                  />
                ) : null}
              </Pressable>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

interface DropdownSelectorProps {
  value: number;
  onPress: () => void;
  theme: any;
  layout: any;
  suffix: string;
}

function DropdownSelector({ value, onPress, theme, layout, suffix }: DropdownSelectorProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.dropdownSelector,
        {
          backgroundColor: theme.backgroundGlass,
          borderColor: theme.glassBorder,
          flexDirection: layout.flexDirection,
        },
      ]}
    >
      <ThemedText type="body" style={{ color: theme.text }}>
        {value} {suffix}
      </ThemedText>
      <Feather
        name="chevron-down"
        size={20}
        color={theme.textSecondary}
        style={{ [layout.marginStart]: Spacing.sm }}
      />
    </Pressable>
  );
}

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const layout = useLayout();
  const { data, updateSettings } = useApp();
  const navigation = useNavigation();
  const { setPersona: setGlobalPersona } = useThemePersona();

  const { settings } = data;

  const [nameAr, setNameAr] = useState(settings.nameAr || settings.name || "");
  const [nameEn, setNameEn] = useState(settings.nameEn || "");
  const [persona, setPersonaLocal] = useState<Persona>(settings.persona);
  
  const handlePersonaChange = useCallback((newPersona: Persona) => {
    setPersonaLocal(newPersona);
    setGlobalPersona(newPersona);
  }, [setGlobalPersona]);
  const [cycleLength, setCycleLength] = useState(settings.cycleSettings.cycleLength);
  const [periodLength, setPeriodLength] = useState(settings.cycleSettings.periodLength);
  const [isSaving, setIsSaving] = useState(false);

  const [cycleLengthModalVisible, setCycleLengthModalVisible] = useState(false);
  const [periodLengthModalVisible, setPeriodLengthModalVisible] = useState(false);

  const handleSave = async () => {
    const trimmedNameAr = nameAr.trim();
    const trimmedNameEn = nameEn.trim();

    if (!trimmedNameAr && !trimmedNameEn) {
      Alert.alert(t("common", "error"), t("profile", "nameRequired"));
      return;
    }

    setIsSaving(true);
    try {
      await updateSettings({
        name: trimmedNameAr || trimmedNameEn,
        nameAr: trimmedNameAr,
        nameEn: trimmedNameEn,
        persona,
        cycleSettings: {
          ...settings.cycleSettings,
          cycleLength,
          periodLength,
        },
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert(t("common", "error"), t("common", "error"));
    } finally {
      setIsSaving(false);
    }
  };

  const getPersonaLabel = useCallback((id: Persona) => {
    const labels: Record<Persona, string> = {
      single: t("onboarding", "single"),
      married: t("onboarding", "married"),
      mother: t("onboarding", "mother"),
      partner: t("profile", "partner"),
    };
    return labels[id];
  }, [t]);

  const nameArLabel = language === "ar" ? "الاسم بالعربية" : "Arabic Name";
  const nameEnLabel = language === "ar" ? "الاسم بالإنجليزية" : "English Name";
  const daysText = t("settings", "days");

  return (
    <KeyboardAwareScrollViewCompat
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.lg,
        paddingBottom: insets.bottom + Spacing.xxl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.section, { alignItems: layout.alignSelf }]}>
        <ThemedText
          type="caption"
          style={[
            styles.sectionLabel,
            { textAlign: layout.textAlign, color: theme.textSecondary },
          ]}
        >
          {nameArLabel}
        </ThemedText>
        <View
          style={[
            styles.glassInput,
            {
              backgroundColor: theme.glassBackground,
              borderColor: theme.glassBorder,
            },
          ]}
        >
          <TextInput
            style={[
              styles.textInput,
              { color: theme.text, textAlign: "right", writingDirection: "rtl" },
            ]}
            value={nameAr}
            onChangeText={setNameAr}
            placeholder={language === "ar" ? "أدخلي اسمك بالعربية" : "Enter your Arabic name"}
            placeholderTextColor={theme.textSoft}
          />
        </View>
      </View>

      <View style={[styles.section, { alignItems: layout.alignSelf }]}>
        <ThemedText
          type="caption"
          style={[
            styles.sectionLabel,
            { textAlign: layout.textAlign, color: theme.textSecondary },
          ]}
        >
          {nameEnLabel}
        </ThemedText>
        <View
          style={[
            styles.glassInput,
            {
              backgroundColor: theme.glassBackground,
              borderColor: theme.glassBorder,
            },
          ]}
        >
          <TextInput
            style={[
              styles.textInput,
              { color: theme.text, textAlign: "left", writingDirection: "ltr" },
            ]}
            value={nameEn}
            onChangeText={setNameEn}
            placeholder={language === "ar" ? "Enter your English name" : "Enter your English name"}
            placeholderTextColor={theme.textSoft}
          />
        </View>
      </View>

      <View style={[styles.section, { alignItems: layout.alignSelf }]}>
        <ThemedText
          type="caption"
          style={[
            styles.sectionLabel,
            { textAlign: layout.textAlign, color: theme.textSecondary },
          ]}
        >
          {t("settings", "persona")}
        </ThemedText>
        <View style={styles.personaGrid}>
          {PERSONA_OPTIONS.map((option) => (
            <PersonaCard
              key={option.id}
              option={option}
              isSelected={persona === option.id}
              onSelect={() => handlePersonaChange(option.id)}
              label={getPersonaLabel(option.id)}
              theme={theme}
            />
          ))}
        </View>
      </View>

      <View style={[styles.section, { alignItems: layout.alignSelf }]}>
        <ThemedText
          type="caption"
          style={[
            styles.sectionLabel,
            { textAlign: layout.textAlign, color: theme.textSecondary },
          ]}
        >
          {t("settings", "cycleLength")}
        </ThemedText>
        <DropdownSelector
          value={cycleLength}
          onPress={() => setCycleLengthModalVisible(true)}
          theme={theme}
          layout={layout}
          suffix={daysText}
        />
      </View>

      <View style={[styles.section, { alignItems: layout.alignSelf }]}>
        <ThemedText
          type="caption"
          style={[
            styles.sectionLabel,
            { textAlign: layout.textAlign, color: theme.textSecondary },
          ]}
        >
          {t("settings", "periodLength")}
        </ThemedText>
        <DropdownSelector
          value={periodLength}
          onPress={() => setPeriodLengthModalVisible(true)}
          theme={theme}
          layout={layout}
          suffix={daysText}
        />
      </View>

      <View style={styles.saveButtonContainer}>
        <Button
          variant="pill"
          onPress={handleSave}
          disabled={isSaving}
          style={styles.saveButton}
        >
          {isSaving ? t("common", "loading") : t("common", "save")}
        </Button>
      </View>

      <PickerModal
        visible={cycleLengthModalVisible}
        onClose={() => setCycleLengthModalVisible(false)}
        options={CYCLE_LENGTH_OPTIONS}
        selectedValue={cycleLength}
        onSelect={setCycleLength}
        title={t("settings", "cycleLength")}
        theme={theme}
        layout={layout}
        suffix={daysText}
      />

      <PickerModal
        visible={periodLengthModalVisible}
        onClose={() => setPeriodLengthModalVisible(false)}
        options={PERIOD_LENGTH_OPTIONS}
        selectedValue={periodLength}
        onSelect={setPeriodLength}
        title={t("settings", "periodLength")}
        theme={theme}
        layout={layout}
        suffix={daysText}
      />
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.xl,
    width: "100%",
  },
  sectionLabel: {
    marginBottom: Spacing.sm,
    marginHorizontal: Spacing.xs,
  },
  glassInput: {
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    overflow: "hidden",
    width: "100%",
  },
  textInput: {
    padding: Spacing.lg,
    fontSize: 16,
    minHeight: Spacing.inputHeight,
  },
  personaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    width: "100%",
  },
  personaCard: {
    width: "47%",
    minWidth: 140,
    position: "relative",
  },
  personaGlow: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: BorderRadius.large + 4,
  },
  personaCardInner: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.large,
    borderWidth: 1.5,
    alignItems: "center",
    gap: Spacing.md,
    position: "relative",
  },
  personaIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  checkBadge: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownSelector: {
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    padding: Spacing.lg,
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  saveButtonContainer: {
    marginTop: Spacing.lg,
    alignItems: "center",
  },
  saveButton: {
    minWidth: SCREEN_WIDTH * 0.6,
    height: 56,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xlarge,
    borderTopRightRadius: BorderRadius.xlarge,
    maxHeight: "60%",
  },
  modalHeader: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  modalList: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    position: "relative",
  },
  modalOptionCheck: {
    position: "absolute",
    right: Spacing.lg,
  },
});
