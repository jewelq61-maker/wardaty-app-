import React from "react";
import { View, StyleSheet, Image, ImageSourcePropType } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { Theme } from "@/constants/theme";
import { useApp } from "@/lib/AppContext";
import { useLayout, useLogoColors } from "@/lib/ThemePersonaContext";
import type { Persona } from "@/lib/types";

const personaIcons: Record<Persona, ImageSourcePropType> = {
  single: require("@/assets/images/icon-single-pink.png"),
  partner: require("@/assets/images/icon-partner-blue.png"),
  married: require("@/assets/images/icon-married-coral.png"),
  mother: require("@/assets/images/icon-mother-purple.png"),
};

interface HeaderTitleProps {
  title?: string;
  showIcon?: boolean;
}

export function HeaderTitle({ title = "Wardaty", showIcon = true }: HeaderTitleProps) {
  const { data } = useApp();
  const layout = useLayout();
  const logoColors = useLogoColors();
  const persona = data.settings.persona;
  
  const iconSource = personaIcons[persona] || personaIcons.single;
  
  return (
    <View style={[styles.container, { flexDirection: layout.flexDirection }]}>
      {showIcon ? (
        <Image
          source={iconSource}
          style={[styles.icon, { [layout.marginEnd]: Theme.spacing.sm }]}
          resizeMode="contain"
        />
      ) : null}
      <ThemedText style={[styles.title, { color: logoColors.primary }]}>{title}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  title: {
    ...Theme.typography.headline,
    fontWeight: "700",
  },
});
