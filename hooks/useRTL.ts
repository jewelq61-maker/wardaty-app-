import { I18nManager } from "react-native";
import { useLanguage } from "./useLanguage";

/**
 * Comprehensive RTL/LTR layout hook
 * Provides all necessary utilities for proper bidirectional layout
 */
export function useRTL() {
  const { isRTL, language } = useLanguage();

  return {
    // Core direction
    isRTL,
    isLTR: !isRTL,
    language,

    // Flex direction
    flexDirection: (isRTL ? "row-reverse" : "row") as "row" | "row-reverse",
    flexDirectionReverse: (isRTL ? "row" : "row-reverse") as "row" | "row-reverse",
    
    // Text alignment
    textAlign: (isRTL ? "right" : "left") as "left" | "right" | "center",
    textAlignReverse: (isRTL ? "left" : "right") as "left" | "right" | "center",
    
    // Self alignment
    alignSelf: (isRTL ? "flex-end" : "flex-start") as "flex-start" | "flex-end",
    alignSelfEnd: (isRTL ? "flex-start" : "flex-end") as "flex-start" | "flex-end",
    
    // Margins
    marginStart: isRTL ? "marginRight" : "marginLeft",
    marginEnd: isRTL ? "marginLeft" : "marginRight",
    
    // Padding
    paddingStart: isRTL ? "paddingRight" : "paddingLeft",
    paddingEnd: isRTL ? "paddingLeft" : "paddingRight",
    
    // Borders
    borderStart: isRTL ? "borderRightWidth" : "borderLeftWidth",
    borderEnd: isRTL ? "borderLeftWidth" : "borderRightWidth",
    borderStartColor: isRTL ? "borderRightColor" : "borderLeftColor",
    borderEndColor: isRTL ? "borderLeftColor" : "borderRightColor",
    
    // Positioning
    left: isRTL ? "right" : "left",
    right: isRTL ? "left" : "right",
    start: isRTL ? "right" : "left",
    end: isRTL ? "left" : "right",
    
    // Transform for icons that need flipping
    transform: { scaleX: isRTL ? -1 : 1 },
    
    // Helper functions
    select: <T,>(ltr: T, rtl: T): T => (isRTL ? rtl : ltr),
    
    // Margin/padding helpers
    ms: (value: number) => ({ [isRTL ? "marginRight" : "marginLeft"]: value }),
    me: (value: number) => ({ [isRTL ? "marginLeft" : "marginRight"]: value }),
    ps: (value: number) => ({ [isRTL ? "paddingRight" : "paddingLeft"]: value }),
    pe: (value: number) => ({ [isRTL ? "paddingLeft" : "paddingRight"]: value }),
  };
}
