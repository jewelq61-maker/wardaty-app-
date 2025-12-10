import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Feather } from "@expo/vector-icons";
import { shouldMirrorIcon } from "@/lib/rtl-utils";

type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

interface RTLIconProps {
  name: FeatherIconName;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export function RTLIcon({ name, size = 24, color = "#000", style }: RTLIconProps) {
  const shouldMirror = shouldMirrorIcon(name);
  
  return (
    <View style={[shouldMirror ? styles.mirrored : undefined, style]}>
      <Feather name={name} size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  mirrored: {
    transform: [{ scaleX: -1 }],
  },
});
