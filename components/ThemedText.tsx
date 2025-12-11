import { Text, type TextProps } from "react-native";

import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";
import { useApp } from "../lib/AppContext";
import { Typography } from "../constants/theme";
import { FontScale } from "../lib/types";

const fontScaleMultipliers: Record<FontScale, number> = {
  small: 0.85,
  medium: 1,
  large: 1.15,
};

const ArabicTypography = {
  largeTitle: {
    fontSize: 38,
    fontFamily: "Tajawal-Bold",
    letterSpacing: 0,
    lineHeight: 48,
  },
  h1: {
    fontSize: 32,
    fontFamily: "Tajawal-Bold",
    letterSpacing: 0,
    lineHeight: 40,
  },
  h2: {
    fontSize: 26,
    fontFamily: "Tajawal-Bold",
    letterSpacing: 0,
    lineHeight: 34,
  },
  h3: {
    fontSize: 24,
    fontFamily: "Tajawal-Medium",
    letterSpacing: 0,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontFamily: "Tajawal-Medium",
    letterSpacing: 0,
    lineHeight: 28,
  },
  body: {
    fontSize: 19,
    fontFamily: "Tajawal-Regular",
    letterSpacing: 0,
    lineHeight: 28,
  },
  callout: {
    fontSize: 18,
    fontFamily: "Tajawal-Regular",
    letterSpacing: 0,
    lineHeight: 26,
  },
  caption: {
    fontSize: 15,
    fontFamily: "Tajawal-Regular",
    letterSpacing: 0,
    lineHeight: 22,
  },
  small: {
    fontSize: 14,
    fontFamily: "Tajawal-Regular",
    letterSpacing: 0,
    lineHeight: 20,
  },
  link: {
    fontSize: 19,
    fontFamily: "Tajawal-Regular",
    letterSpacing: 0,
    lineHeight: 28,
  },
};

// Default fallback style
const DEFAULT_STYLE = {
  fontSize: 17,
  lineHeight: 22,
  fontFamily: "Tajawal-Regular",
};

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "largeTitle" | "h1" | "h2" | "h3" | "h4" | "body" | "callout" | "caption" | "small" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "body",
  ...rest
}: ThemedTextProps) {
  const { theme, isDark } = useTheme();
  const { language } = useLanguage();
  const { data } = useApp();
  const isArabic = language === "ar";
  const fontScale = data?.settings?.fontScale || "medium";
  const scaleMultiplier = fontScaleMultipliers[fontScale];

  const getColor = () => {
    if (isDark && darkColor) {
      return darkColor;
    }

    if (!isDark && lightColor) {
      return lightColor;
    }

    if (type === "link") {
      return theme.link;
    }

    return theme.text;
  };

  const getTypeStyle = () => {
    try {
      const typography = isArabic ? ArabicTypography : Typography;
      
      // Get base style with fallback
      let baseStyle = typography[type] || typography.body || DEFAULT_STYLE;
      
      // Safety check
      if (!baseStyle || typeof baseStyle.fontSize !== 'number') {
        console.warn(`[ThemedText] Invalid style for type: ${type}, using default`);
        baseStyle = DEFAULT_STYLE;
      }
      
      return {
        fontFamily: baseStyle.fontFamily || DEFAULT_STYLE.fontFamily,
        fontSize: Math.round(baseStyle.fontSize * scaleMultiplier),
        lineHeight: baseStyle.lineHeight ? Math.round(baseStyle.lineHeight * scaleMultiplier) : undefined,
        letterSpacing: baseStyle.letterSpacing,
        fontWeight: baseStyle.fontWeight,
      };
    } catch (error) {
      console.error('[ThemedText] Error in getTypeStyle:', error);
      return DEFAULT_STYLE;
    }
  };

  return (
    <Text style={[{ color: getColor() }, getTypeStyle(), style]} {...rest} />
  );
}
