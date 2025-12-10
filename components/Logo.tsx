import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Path, Circle, G } from "react-native-svg";
import { useLogoColors } from "@/lib/ThemePersonaContext";

interface LogoProps {
  size?: number;
  style?: ViewStyle;
  showGlow?: boolean;
}

export function Logo({ size = 40, style, showGlow = false }: LogoProps) {
  const { gradient, primary } = useLogoColors();

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      {showGlow && (
        <View
          style={[
            styles.glow,
            {
              width: size * 1.5,
              height: size * 1.5,
              borderRadius: size * 0.75,
              backgroundColor: primary,
              left: -(size * 0.25),
              top: -(size * 0.25),
            },
          ]}
        />
      )}
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={gradient[0]} />
            <Stop offset="100%" stopColor={gradient[1]} />
          </LinearGradient>
        </Defs>
        <G>
          <Circle cx="50" cy="50" r="16" fill="url(#logoGradient)" />
          <Path
            d="M50 10 C55 20, 65 25, 70 35 C75 45, 70 55, 60 55 C55 55, 52 52, 50 50 C48 52, 45 55, 40 55 C30 55, 25 45, 30 35 C35 25, 45 20, 50 10"
            fill="url(#logoGradient)"
            opacity={0.9}
          />
          <Path
            d="M90 50 C80 55, 75 65, 65 70 C55 75, 45 70, 45 60 C45 55, 48 52, 50 50 C48 48, 45 45, 45 40 C45 30, 55 25, 65 30 C75 35, 80 45, 90 50"
            fill="url(#logoGradient)"
            opacity={0.85}
          />
          <Path
            d="M50 90 C45 80, 35 75, 30 65 C25 55, 30 45, 40 45 C45 45, 48 48, 50 50 C52 48, 55 45, 60 45 C70 45, 75 55, 70 65 C65 75, 55 80, 50 90"
            fill="url(#logoGradient)"
            opacity={0.8}
          />
          <Path
            d="M10 50 C20 45, 25 35, 35 30 C45 25, 55 30, 55 40 C55 45, 52 48, 50 50 C52 52, 55 55, 55 60 C55 70, 45 75, 35 70 C25 65, 20 55, 10 50"
            fill="url(#logoGradient)"
            opacity={0.75}
          />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    opacity: 0.2,
  },
});

export default Logo;
