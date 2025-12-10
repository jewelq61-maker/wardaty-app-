import { Text, type TextProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { useApp } from "@/lib/AppContext";
import { Typography } from "@/constants/theme";
import { FontScale } from "@/lib/types";

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
    const typography = isArabic ? ArabicTypography : Typography;
    let baseStyle: any;
    switch (type) {
      case "largeTitle":
        baseStyle = typography.largeTitle;
        break;
      case "h1":
        baseStyle = typography.h1;
        break;
      case "h2":
        baseStyle = typography.h2;
        break;
      case "h3":
        baseStyle = typography.h3;
        break;
      case "h4":
        baseStyle = typography.h4;
        break;
      case "body":
        baseStyle = typography.body;
        break;
      case "callout":
        baseStyle = typography.callout;
        break;
      case "caption":
        baseStyle = typography.caption;
        break;
      case "small":
        baseStyle = typography.small;
        break;
      case "link":
        baseStyle = typography.link;
        break;
      default:
        baseStyle = typography.body;
    }
    return {
      ...baseStyle,
      fontSize: Math.round(baseStyle.fontSize * scaleMultiplier),
      lineHeight: baseStyle.lineHeight ? Math.round(baseStyle.lineHeight * scaleMultiplier) : undefined,
    };
  };

  return (
    <Text style={[{ color: getColor() }, getTypeStyle(), style]} {...rest} />
  );
}
