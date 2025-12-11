import { I18nManager, StyleSheet, ViewStyle, TextStyle, ImageStyle } from "react-native";
import { Spacing } from "../constants/theme";

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

export function isRTL(): boolean {
  return I18nManager.isRTL;
}

export function createDirectionalStyles<T extends NamedStyles<T>>(
  ltrStyles: T | NamedStyles<T>,
  rtlStyles?: Partial<T | NamedStyles<T>>
): T {
  if (!I18nManager.isRTL) {
    return StyleSheet.create(ltrStyles as T) as T;
  }
  
  const merged: Record<string, ViewStyle | TextStyle | ImageStyle> = {};
  const ltrRecord = ltrStyles as Record<string, ViewStyle | TextStyle | ImageStyle>;
  const rtlRecord = rtlStyles as Record<string, ViewStyle | TextStyle | ImageStyle> | undefined;
  
  for (const key in ltrRecord) {
    if (Object.prototype.hasOwnProperty.call(ltrRecord, key)) {
      const ltrValue = ltrRecord[key] || {};
      const rtlValue = rtlRecord?.[key] || {};
      merged[key] = { ...ltrValue, ...rtlValue };
    }
  }
  
  return StyleSheet.create(merged as T) as T;
}

export function rtlValue<T>(ltrValue: T, rtlValue: T): T {
  return I18nManager.isRTL ? rtlValue : ltrValue;
}

export function flipHorizontal(value: number): number {
  return I18nManager.isRTL ? -value : value;
}

export function rtlTransform(rotation: number = 0): { transform: Array<{ scaleX: number } | { rotate: string }> } {
  return {
    transform: [
      { scaleX: I18nManager.isRTL ? -1 : 1 },
      { rotate: `${rotation}deg` },
    ],
  };
}

export const DirectionalSpacing = {
  startXs: () => ({ [I18nManager.isRTL ? "marginRight" : "marginLeft"]: Spacing.xs }),
  startSm: () => ({ [I18nManager.isRTL ? "marginRight" : "marginLeft"]: Spacing.sm }),
  startMd: () => ({ [I18nManager.isRTL ? "marginRight" : "marginLeft"]: Spacing.md }),
  startLg: () => ({ [I18nManager.isRTL ? "marginRight" : "marginLeft"]: Spacing.lg }),
  startXl: () => ({ [I18nManager.isRTL ? "marginRight" : "marginLeft"]: Spacing.xl }),
  
  endXs: () => ({ [I18nManager.isRTL ? "marginLeft" : "marginRight"]: Spacing.xs }),
  endSm: () => ({ [I18nManager.isRTL ? "marginLeft" : "marginRight"]: Spacing.sm }),
  endMd: () => ({ [I18nManager.isRTL ? "marginLeft" : "marginRight"]: Spacing.md }),
  endLg: () => ({ [I18nManager.isRTL ? "marginLeft" : "marginRight"]: Spacing.lg }),
  endXl: () => ({ [I18nManager.isRTL ? "marginLeft" : "marginRight"]: Spacing.xl }),
  
  paddingStartXs: () => ({ [I18nManager.isRTL ? "paddingRight" : "paddingLeft"]: Spacing.xs }),
  paddingStartSm: () => ({ [I18nManager.isRTL ? "paddingRight" : "paddingLeft"]: Spacing.sm }),
  paddingStartMd: () => ({ [I18nManager.isRTL ? "paddingRight" : "paddingLeft"]: Spacing.md }),
  paddingStartLg: () => ({ [I18nManager.isRTL ? "paddingRight" : "paddingLeft"]: Spacing.lg }),
  paddingStartXl: () => ({ [I18nManager.isRTL ? "paddingRight" : "paddingLeft"]: Spacing.xl }),
  
  paddingEndXs: () => ({ [I18nManager.isRTL ? "paddingLeft" : "paddingRight"]: Spacing.xs }),
  paddingEndSm: () => ({ [I18nManager.isRTL ? "paddingLeft" : "paddingRight"]: Spacing.sm }),
  paddingEndMd: () => ({ [I18nManager.isRTL ? "paddingLeft" : "paddingRight"]: Spacing.md }),
  paddingEndLg: () => ({ [I18nManager.isRTL ? "paddingLeft" : "paddingRight"]: Spacing.lg }),
  paddingEndXl: () => ({ [I18nManager.isRTL ? "paddingLeft" : "paddingRight"]: Spacing.xl }),
  
  start: (value: number) => ({ [I18nManager.isRTL ? "marginRight" : "marginLeft"]: value }),
  end: (value: number) => ({ [I18nManager.isRTL ? "marginLeft" : "marginRight"]: value }),
  paddingStart: (value: number) => ({ [I18nManager.isRTL ? "paddingRight" : "paddingLeft"]: value }),
  paddingEnd: (value: number) => ({ [I18nManager.isRTL ? "paddingLeft" : "paddingRight"]: value }),
};

export function getDirectionalStyle(property: "margin" | "padding", edge: "start" | "end", value: number): ViewStyle {
  const isStart = edge === "start";
  const isRtl = I18nManager.isRTL;
  
  if (property === "margin") {
    if (isStart) {
      return isRtl ? { marginRight: value } : { marginLeft: value };
    }
    return isRtl ? { marginLeft: value } : { marginRight: value };
  }
  
  if (isStart) {
    return isRtl ? { paddingRight: value } : { paddingLeft: value };
  }
  return isRtl ? { paddingLeft: value } : { paddingRight: value };
}

export function getFlexDirection(reverse: boolean = false): "row" | "row-reverse" {
  const baseDirection = I18nManager.isRTL ? "row-reverse" : "row";
  if (reverse) {
    return baseDirection === "row" ? "row-reverse" : "row";
  }
  return baseDirection;
}

export function getTextAlign(): "left" | "right" {
  return I18nManager.isRTL ? "right" : "left";
}

export function getPosition(edge: "start" | "end", value: number): ViewStyle {
  const isStart = edge === "start";
  const isRtl = I18nManager.isRTL;
  
  if (isStart) {
    return isRtl ? { right: value } : { left: value };
  }
  return isRtl ? { left: value } : { right: value };
}

const RTL_MIRRORED_ICONS = new Set([
  "arrow-left",
  "arrow-right",
  "chevron-left",
  "chevron-right",
  "chevrons-left",
  "chevrons-right",
  "corner-down-left",
  "corner-down-right",
  "corner-left-down",
  "corner-left-up",
  "corner-right-down",
  "corner-right-up",
  "corner-up-left",
  "corner-up-right",
  "log-in",
  "log-out",
  "external-link",
  "share",
  "skip-back",
  "skip-forward",
  "rewind",
  "fast-forward",
  "trending-up",
  "trending-down",
  "send",
  "reply",
  "redo",
  "undo",
]);

export function shouldMirrorIcon(iconName: string): boolean {
  return I18nManager.isRTL && RTL_MIRRORED_ICONS.has(iconName);
}

export function getIconTransform(iconName: string): ViewStyle | undefined {
  if (shouldMirrorIcon(iconName)) {
    return { transform: [{ scaleX: -1 }] };
  }
  return undefined;
}
