/**
 * WARDATY DESIGN TOKENS
 * Based on Wardaty website design system
 * 
 * Contains spacing, typography, shadows, and other design tokens
 */

// ===================================
// 1) SPACING SCALE
// ===================================

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
  "4xl": 80,
  "5xl": 120,
} as const;

// ===================================
// 2) BORDER RADIUS
// ===================================

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  "2xl": 28,
  pill: 999,  // For pill-shaped buttons
  circle: "50%",
} as const;

// ===================================
// 3) TYPOGRAPHY SCALE
// ===================================

export const Typography = {
  // Hero (for landing/onboarding)
  hero: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: "800" as const,
    letterSpacing: -0.5,
  },
  
  // Display (for large titles)
  display: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: "700" as const,
    letterSpacing: -0.5,
  },
  
  // Heading 1
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
    letterSpacing: -0.3,
  },
  
  // Heading 2
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
    letterSpacing: -0.2,
  },
  
  // Heading 3
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
    letterSpacing: -0.1,
  },
  
  // Heading 4
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
    letterSpacing: 0,
  },
  
  // Body Large
  bodyLarge: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "400" as const,
    letterSpacing: 0,
  },
  
  // Body (default)
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
    letterSpacing: 0,
  },
  
  // Body Small
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
    letterSpacing: 0,
  },
  
  // Caption
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500" as const,
    letterSpacing: 0.3,
  },
  
  // Button
  button: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600" as const,
    letterSpacing: 0.2,
  },
  
  // Button Small
  buttonSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600" as const,
    letterSpacing: 0.2,
  },
  
  // Label
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500" as const,
    letterSpacing: 0.1,
  },
} as const;

// ===================================
// 4) SHADOWS & ELEVATION
// ===================================

export const Shadows = {
  // Light mode shadows
  light: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
      elevation: 4,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 24,
      elevation: 8,
    },
    xl: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.12,
      shadowRadius: 32,
      elevation: 12,
    },
  },
  
  // Dark mode shadows
  dark: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 4,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 24,
      elevation: 8,
    },
    xl: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.5,
      shadowRadius: 32,
      elevation: 12,
    },
  },
} as const;

// ===================================
// 5) GLOW SHADOWS (for active states)
// ===================================

export function getGlowShadow(color: string, intensity: "sm" | "md" | "lg" = "md") {
  const intensityMap = {
    sm: { opacity: 0.2, radius: 12 },
    md: { opacity: 0.3, radius: 20 },
    lg: { opacity: 0.4, radius: 28 },
  };
  
  const { opacity, radius } = intensityMap[intensity];
  
  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation: 8,
  };
}

// ===================================
// 6) ICON SIZES
// ===================================

export const IconSizes = {
  xs: 16,
  sm: 20,
  base: 24,
  md: 28,
  lg: 32,
  xl: 40,
  "2xl": 48,
  "3xl": 64,
  "4xl": 80,
} as const;

// ===================================
// 7) ANIMATION DURATIONS
// ===================================

export const AnimationDurations = {
  fast: 150,
  normal: 250,
  slow: 350,
  slower: 500,
} as const;

// ===================================
// 8) LAYOUT CONSTANTS
// ===================================

export const Layout = {
  // Screen padding
  screenPadding: Spacing.lg,
  screenPaddingHorizontal: Spacing.lg,
  screenPaddingVertical: Spacing.xl,
  
  // Card padding
  cardPadding: Spacing.xl,
  cardPaddingSmall: Spacing.lg,
  
  // Section spacing
  sectionSpacing: Spacing["3xl"],
  sectionSpacingSmall: Spacing["2xl"],
  
  // Grid gaps
  gridGap: Spacing.lg,
  gridGapSmall: Spacing.base,
  
  // Bottom navigation
  bottomNavHeight: 72,
  
  // FAB button
  fabSize: 56,
  fabMargin: Spacing.base,
  
  // Top navigation
  topNavHeight: 64,
} as const;

// ===================================
// 9) GLASSMORPHISM BLUR
// ===================================

export const BlurIntensity = {
  light: 10,
  medium: 20,
  heavy: 30,
} as const;

// ===================================
// 10) OPACITY VALUES
// ===================================

export const Opacity = {
  disabled: 0.4,
  secondary: 0.7,
  tertiary: 0.5,
  overlay: 0.6,
  glass: 0.7,
} as const;

// ===================================
// 11) TYPE EXPORTS
// ===================================

export type SpacingKey = keyof typeof Spacing;
export type BorderRadiusKey = keyof typeof BorderRadius;
export type TypographyKey = keyof typeof Typography;
export type IconSizeKey = keyof typeof IconSizes;
