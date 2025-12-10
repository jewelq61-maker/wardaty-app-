import { Platform } from "react-native";

export const BrandColors = {
  violet: {
    main: "#8C64F0",
    light: "#A684F5",
    dark: "#7450D9",
    soft: "rgba(140, 100, 240, 0.15)",
  },
  coral: {
    main: "#FF6B9D",
    light: "#FF8FB5",
    dark: "#E85585",
    soft: "rgba(255, 107, 157, 0.15)",
  },
};

export const CycleColors = {
  period: "#FF3860",
  periodLight: "#FF8FB5",
  fertile: "#8C64F0",
  fertileLight: "#D4B9FF",
  normal: "#FFB5C5",
  normalLight: "#FFD4E0",
  qadha: "#4CAF50",
  qadhaLight: "#A5F3C6",
  ovulation: "#C67BFF",
  ovulationLight: "#D4B9FF",
  follicular: "#4CAF50",
  luteal: "#FF9800",
  lutealLight: "#FFCCAA",
};

export const LightModePhaseColors = {
  period: "#FF8FB5",
  fertile: "#D4B9FF",
  ovulation: "#C67BFF",
  luteal: "#FFCCAA",
  qadha: "#A5F3C6",
  follicular: "#A5F3C6",
};

export const LightModeRingGradient = {
  start: "#C8B8FF",
  end: "#FFB7D6",
};

export const PersonaAccents = {
  single: {
    main: "#FF5FA8",
    light: "#FF5FA8",
    dark: "#FF5FA8",
    soft: "rgba(255, 95, 168, 0.15)",
    gradient: ["#8C64F0", "#FF5FA8"] as const,
  },
  partner: {
    main: "#7EC8E3",
    light: "#7EC8E3",
    dark: "#7EC8E3",
    soft: "rgba(126, 200, 227, 0.15)",
    gradient: ["#8C64F0", "#7EC8E3"] as const,
  },
  married: {
    main: "#FF7C7C",
    light: "#FF7C7C",
    dark: "#FF7C7C",
    soft: "rgba(255, 124, 124, 0.15)",
    gradient: ["#8C64F0", "#FF7C7C"] as const,
  },
  mother: {
    main: "#9A63E8",
    light: "#9A63E8",
    dark: "#9A63E8",
    soft: "rgba(154, 99, 232, 0.15)",
    gradient: ["#8C64F0", "#9A63E8"] as const,
  },
};

export const PremiumDark = {
  card: "#1C1C1E", // Apple-style dark gray card
  cardBlur: 40,
  cardBorderGlow: "rgba(140, 100, 240, 0.25)",
  cardShadow: "rgba(0, 0, 0, 0.5)",
  cardRadius: 24,
};

export const Colors = {
  light: {
    text: "#1D1D1F",
    textSecondary: "#666666",
    textMuted: "#999999",
    buttonText: "#FFFFFF",
    tabIconDefault: "#8E8E93",
    tabIconSelected: BrandColors.coral.main,
    link: BrandColors.violet.main,
    backgroundRoot: "#F5F5F7", // Apple-style light gray background
    backgroundDefault: "#FFFFFF",
    backgroundSecondary: "#F2F2F7",
    backgroundTertiary: "#E5E5EA",
    backgroundElevated: "#FFFFFF",
    backgroundGlass: "rgba(255, 255, 255, 0.8)",
    primary: BrandColors.violet.main,
    primaryLight: BrandColors.violet.light,
    primaryDark: BrandColors.violet.dark,
    primarySoft: BrandColors.violet.soft,
    accent: BrandColors.coral.main,
    accentLight: BrandColors.coral.light,
    accentDark: BrandColors.coral.dark,
    accentSoft: BrandColors.coral.soft,
    secondary: "#BA68C8",
    secondaryLight: "#CE93D8",
    secondaryDark: "#AB47BC",
    period: CycleColors.period,
    periodLight: CycleColors.periodLight,
    fertile: CycleColors.fertile,
    fertileLight: CycleColors.fertileLight,
    normal: CycleColors.normal,
    normalLight: CycleColors.normalLight,
    ovulation: CycleColors.ovulation,
    follicular: CycleColors.follicular,
    luteal: CycleColors.luteal,
    qadha: CycleColors.qadha,
    warning: "#FF9500",
    success: "#34C759",
    error: "#FF3860",
    info: "#5AC8FA",
    border: "rgba(0, 0, 0, 0.1)",
    cardBorder: "rgba(0, 0, 0, 0.05)",
    glassBackground: "rgba(255, 255, 255, 0.85)",
    glassBorder: "rgba(0, 0, 0, 0.1)",
    glowPrimary: "rgba(140, 100, 240, 0.2)",
    glowAccent: "rgba(255, 107, 157, 0.2)",
    overlay: "rgba(0, 0, 0, 0.4)",
  },
  dark: {
    text: "#FFFFFF",
    textSecondary: "#EBEBF5",
    textMuted: "#8E8E93",
    buttonText: "#FFFFFF",
    tabIconDefault: "#A0A0A8",
    tabIconSelected: BrandColors.coral.main,
    link: BrandColors.violet.light,
    backgroundRoot: "#000000", // OLED Black
    backgroundDefault: "#000000",
    backgroundSecondary: "#1C1C1E",
    backgroundTertiary: "#2C2C2E",
    backgroundElevated: "#1C1C1E",
    backgroundGlass: "rgba(28, 28, 30, 0.8)",
    primary: BrandColors.violet.main,
    primaryLight: BrandColors.violet.light,
    primaryDark: BrandColors.violet.dark,
    primarySoft: "rgba(140, 100, 240, 0.2)",
    accent: BrandColors.coral.main,
    accentLight: BrandColors.coral.light,
    accentDark: BrandColors.coral.dark,
    accentSoft: "rgba(255, 107, 157, 0.2)",
    secondary: "#BA68C8",
    secondaryLight: "#CE93D8",
    secondaryDark: "#AB47BC",
    period: CycleColors.period,
    periodLight: CycleColors.periodLight,
    fertile: CycleColors.fertile,
    fertileLight: CycleColors.fertileLight,
    normal: CycleColors.normal,
    normalLight: CycleColors.normalLight,
    ovulation: CycleColors.ovulation,
    follicular: CycleColors.follicular,
    luteal: CycleColors.luteal,
    qadha: CycleColors.qadha,
    warning: "#FF9F0A",
    success: "#30D158",
    error: "#FF453A",
    info: "#64D2FF",
    border: "rgba(255, 255, 255, 0.15)",
    cardBorder: "rgba(255, 255, 255, 0.1)",
    glassBackground: "rgba(28, 28, 30, 0.8)",
    glassBorder: "rgba(255, 255, 255, 0.15)",
    glowPrimary: "rgba(140, 100, 240, 0.3)",
    glowAccent: "rgba(255, 107, 157, 0.3)",
    overlay: "rgba(0, 0, 0, 0.8)",
  },
};

export const Gradients = {
  primary: [BrandColors.violet.main, BrandColors.coral.main] as const,
  primarySubtle: [BrandColors.violet.light, BrandColors.coral.light] as const,
  accent: [BrandColors.coral.main, BrandColors.coral.light] as const,
  period: ["#FF3860", "#FF6B9D"] as const,
  fertile: [BrandColors.violet.main, BrandColors.violet.light] as const,
  normal: ["#FFB5C5", "#FFD4E0"] as const,
  qadha: ["#4CAF50", "#81C784"] as const,
  background: ["#000000", "#1C1C1E"] as const,
  backgroundRadial: ["#1C1C1E", "#000000"] as const,
  card: ["rgba(140, 100, 240, 0.12)", "rgba(255, 107, 157, 0.08)"] as const,
  cardGlow: ["rgba(140, 100, 240, 0.2)", "rgba(255, 107, 157, 0.15)"] as const,
  cardBorder: [BrandColors.violet.main, BrandColors.coral.main] as const,
  fab: [BrandColors.coral.main, BrandColors.coral.light] as const,
  glass: ["rgba(28, 28, 30, 0.9)", "rgba(28, 28, 30, 0.7)"] as const,
  logo: {
    single: [BrandColors.violet.main, "#FF5FA8"] as const,
    partner: [BrandColors.violet.main, "#7EC8E3"] as const,
    married: [BrandColors.violet.main, "#FF7C7C"] as const,
    mother: [BrandColors.violet.main, "#9A63E8"] as const,
  },
  phasePill: {
    period: ["#FF3860", "#FF6B9D"] as const,
    fertile: ["#8C64F0", "#A684F5"] as const,
    ovulation: ["#BA68C8", "#CE93D8"] as const,
    follicular: ["#4CAF50", "#81C784"] as const,
    luteal: ["#FF9800", "#FFB74D"] as const,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 48,
  inputHeight: 50,
  buttonHeight: 52,
  fabSize: 64,
  tabBarHeight: 60,
};

export const BorderRadius = {
  xs: 8,
  small: 12,
  medium: 16,
  large: 24,
  xlarge: 32,
  full: 9999,
};

export const Typography = {
  cycleDayNumber: {
    fontSize: 64,
    fontWeight: "700" as const,
    letterSpacing: -2,
    fontFamily: "Tajawal-Bold",
  },
  extraLarge: {
    fontSize: 48,
    fontWeight: "700" as const,
    letterSpacing: -1,
    fontFamily: "Tajawal-Bold",
  },
  largeTitle: {
    fontSize: 34,
    fontWeight: "700" as const,
    letterSpacing: -0.5,
    fontFamily: "Tajawal-Bold",
  },
  h1: {
    fontSize: 28,
    fontWeight: "700" as const,
    letterSpacing: -0.3,
    fontFamily: "Tajawal-Bold",
  },
  h2: {
    fontSize: 22,
    fontWeight: "600" as const,
    letterSpacing: -0.2,
    fontFamily: "Tajawal-Bold",
  },
  h3: {
    fontSize: 20,
    fontWeight: "600" as const,
    letterSpacing: -0.1,
    fontFamily: "Tajawal-Bold",
  },
  h4: {
    fontSize: 17,
    fontWeight: "600" as const,
    letterSpacing: 0,
    fontFamily: "Tajawal-Bold",
  },
  body: {
    fontSize: 17,
    fontWeight: "400" as const,
    letterSpacing: 0,
    fontFamily: "Tajawal-Regular",
  },
  callout: {
    fontSize: 16,
    fontWeight: "400" as const,
    letterSpacing: 0,
    fontFamily: "Tajawal-Regular",
  },
  caption: {
    fontSize: 12,
    fontWeight: "500" as const,
    letterSpacing: 0.1,
    fontFamily: "Tajawal-Medium",
  },
  small: {
    fontSize: 11,
    fontWeight: "500" as const,
    letterSpacing: 0.2,
    fontFamily: "Tajawal-Medium",
  },
  link: {
    fontSize: 17,
    fontWeight: "500" as const,
    letterSpacing: 0,
    fontFamily: "Tajawal-Medium",
  },
};

export const Shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardSubtle: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHover: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  glow: {
    shadowColor: BrandColors.violet.main,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  glowAccent: {
    shadowColor: BrandColors.coral.main,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  fab: {
    shadowColor: BrandColors.coral.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  floating: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  cycleRing: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  glass: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
};

export const Animations = {
  spring: {
    damping: 25,
    stiffness: 350,
  },
  springFast: {
    damping: 20,
    stiffness: 400,
  },
  springGentle: {
    damping: 30,
    stiffness: 250,
  },
  springBouncy: {
    damping: 15,
    stiffness: 300,
  },
  springLiquid: {
    damping: 18,
    stiffness: 280,
  },
  springSmooth: {
    damping: 22,
    stiffness: 200,
  },
  buttonScale: 0.96,
  cardScale: 0.98,
  pillScale: 0.97,
  fabRotation: 45,
  duration: {
    fast: 150,
    normal: 250,
    slow: 400,
  },
  cardEnter: {
    delay: 100,
    duration: 400,
  },
};

export const GlassEffect = {
  blur: 20,
  opacity: 0.8,
  borderWidth: 0.5,
  tint: "light",
};

export const Fonts = Platform.select({
  ios: {
    sans: "Tajawal-Regular",
    serif: "Tajawal-Regular",
    rounded: "Tajawal-Regular",
    mono: "Menlo",
  },
  default: {
    sans: "Tajawal-Regular",
    serif: "Tajawal-Regular",
    rounded: "Tajawal-Regular",
    mono: "monospace",
  },
  web: {
    sans: "Tajawal, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Tajawal, Georgia, 'Times New Roman', serif",
    rounded: "Tajawal, -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
