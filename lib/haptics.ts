// ===================================
// WARDATY - HAPTICS UTILITIES
// iOS-compliant haptic feedback
// ===================================

import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

/**
 * Light impact - for UI element interactions
 * Use: Button taps, toggles, selections
 */
export async function light() {
  if (Platform.OS === "ios") {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

/**
 * Medium impact - for moderate interactions
 * Use: Swipe actions, card dismissals
 */
export async function medium() {
  if (Platform.OS === "ios") {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
}

/**
 * Heavy impact - for significant actions
 * Use: Deletions, confirmations, important actions
 */
export async function heavy() {
  if (Platform.OS === "ios") {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }
}

/**
 * Selection - for picker/selector changes
 * Use: Scrolling through options, tab switches
 */
export async function selection() {
  if (Platform.OS === "ios") {
    await Haptics.selectionAsync();
  }
}

/**
 * Success notification
 * Use: Successful operations, confirmations
 */
export async function success() {
  if (Platform.OS === "ios") {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }
}

/**
 * Warning notification
 * Use: Warnings, alerts
 */
export async function warning() {
  if (Platform.OS === "ios") {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }
}

/**
 * Error notification
 * Use: Errors, failures
 */
export async function error() {
  if (Platform.OS === "ios") {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }
}

/**
 * Trigger haptic for button press
 */
export async function buttonPress() {
  await light();
}

/**
 * Trigger haptic for tab change
 */
export async function tabChange() {
  await selection();
}

/**
 * Trigger haptic for toggle switch
 */
export async function toggle() {
  await light();
}

/**
 * Trigger haptic for delete action
 */
export async function deleteAction() {
  await heavy();
}

/**
 * Trigger haptic for save action
 */
export async function saveAction() {
  await success();
}

/**
 * Trigger haptic for cancel action
 */
export async function cancelAction() {
  await light();
}

/**
 * Trigger haptic for swipe action
 */
export async function swipeAction() {
  await medium();
}

/**
 * Trigger haptic for long press
 */
export async function longPress() {
  await medium();
}

/**
 * Trigger haptic for drag start
 */
export async function dragStart() {
  await light();
}

/**
 * Trigger haptic for drag end
 */
export async function dragEnd() {
  await medium();
}

/**
 * Trigger haptic for refresh
 */
export async function refresh() {
  await medium();
}

/**
 * Trigger haptic for notification
 */
export async function notification() {
  await success();
}

// Export all as object
export const HapticsUtils = {
  light,
  medium,
  heavy,
  selection,
  success,
  warning,
  error,
  buttonPress,
  tabChange,
  toggle,
  deleteAction,
  saveAction,
  cancelAction,
  swipeAction,
  longPress,
  dragStart,
  dragEnd,
  refresh,
  notification,
};

export default HapticsUtils;
