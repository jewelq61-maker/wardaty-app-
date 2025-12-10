import React from "react";
import { View, StyleSheet, Platform, Pressable, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import HomeStackNavigator from "@/navigation/HomeStackNavigator";
import CalendarStackNavigator from "@/navigation/CalendarStackNavigator";
import BeautyStackNavigator from "@/navigation/BeautyStackNavigator";
import ProfileStackNavigator from "@/navigation/ProfileStackNavigator";
import { AppIcon } from "@/components/AppIcon";
import { useThemePersona } from "@/lib/ThemePersonaContext";
import { useLanguage } from "@/hooks/useLanguage";
import { useFAB } from "@/contexts/FABContext";
import {
  Spacing,
  BorderRadius,
  Typography,
} from "@/constants/theme";

export type MainTabParamList = {
  HomeTab: undefined;
  CalendarTab: undefined;
  BeautyTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const FAB_SIZE = 64;

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
  const { theme, isDark, persona } = useThemePersona();
  const insets = useSafeAreaInsets();
  const { triggerFAB } = useFAB();
  const { t } = useLanguage();

  const TAB_BAR_HEIGHT = Spacing.tabBarHeight + 16;
  const bottomPadding = Platform.OS === "ios" ? insets.bottom : Spacing.sm;

  const personaAccent = theme.colors.personaAccent;
  const personaAccentSoft = theme.colors.personaAccentSoft;
  const inactiveColor = isDark ? "rgba(160, 160, 168, 0.7)" : "rgba(142, 142, 147, 0.8)";

  const getCurrentTabName = () => {
    const currentRoute = state.routes[state.index];
    return currentRoute?.name || "HomeTab";
  };

  const handleFABPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const currentTab = getCurrentTabName();
    triggerFAB(currentTab);
  };

  const getTabLabel = (routeName: string): string => {
    switch (routeName) {
      case "HomeTab":
        return t("tabs", "home");
      case "CalendarTab":
        return t("tabs", "calendar");
      case "BeautyTab":
        return t("tabs", "beauty");
      case "ProfileTab":
        return t("tabs", "profile");
      default:
        return "";
    }
  };

  const renderTabItem = (route: any, index: number) => {
    const { options } = descriptors[route.key];
    const isFocused = state.index === index;

    const onPress = () => {
      Haptics.selectionAsync();
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    const iconName = getIconName(route.name);
    const iconColor = isFocused ? personaAccent : inactiveColor;
    const label = getTabLabel(route.name);

    return (
      <Pressable
        key={route.key}
        onPress={onPress}
        style={styles.tabItem}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
      >
        <View style={styles.iconContainer}>
          <AppIcon
            name={iconName}
            size={24}
            color={iconColor}
            weight={isFocused ? "bold" : "regular"}
          />
        </View>
        <Text
          style={[
            styles.tabLabel,
            {
              color: iconColor,
              fontWeight: isFocused ? "600" : "400",
            },
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  const renderFAB = () => (
    <View style={styles.fabContainer}>
      <View
        style={[
          styles.fabGlow,
          { backgroundColor: personaAccent, opacity: 0.25 },
        ]}
      />
      <Pressable
        onPress={handleFABPress}
        style={({ pressed }) => [
          styles.fabButton,
          {
            backgroundColor: personaAccent,
            shadowColor: personaAccent,
            transform: [{ scale: pressed ? 0.94 : 1 }],
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Quick Add"
      >
        <Feather name="plus" size={28} color="#FFFFFF" />
      </Pressable>
    </View>
  );

  const leftTabs = state.routes.slice(0, 2);
  const rightTabs = state.routes.slice(2);

  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          height: TAB_BAR_HEIGHT + bottomPadding,
          paddingBottom: bottomPadding,
        },
      ]}
    >
      {Platform.OS === "ios" ? (
        <BlurView
          intensity={80}
          tint={isDark ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: isDark ? "rgba(28, 28, 30, 0.95)" : "rgba(255, 255, 255, 0.95)" },
          ]}
        />
      )}
      
      <View
        style={[styles.glassBorder, { backgroundColor: theme.colors.glassBorder }]}
      />

      <View style={styles.tabBarContent}>
        {leftTabs.map((route: any, index: number) =>
          renderTabItem(route, index)
        )}
        {renderFAB()}
        {rightTabs.map((route: any, index: number) =>
          renderTabItem(route, index + 2)
        )}
      </View>
    </View>
  );
}

function getIconName(routeName: string): string {
  switch (routeName) {
    case "HomeTab":
      return "house";
    case "CalendarTab":
      return "calendar";
    case "BeautyTab":
      return "sparkles";
    case "ProfileTab":
      return "person.crop.circle";
    default:
      return "circle";
  }
}

export default function MainTabNavigator() {
  const { t } = useLanguage();

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          title: t("tabs", "home"),
        }}
      />
      <Tab.Screen
        name="CalendarTab"
        component={CalendarStackNavigator}
        options={{
          title: t("tabs", "calendar"),
        }}
      />
      <Tab.Screen
        name="BeautyTab"
        component={BeautyStackNavigator}
        options={{
          title: t("tabs", "beauty"),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          title: t("tabs", "profile"),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    overflow: "visible",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  glassBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 0.5,
  },
  tabBarContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: Spacing.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xs,
    minHeight: 50,
    gap: 4,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: Typography.caption.fontFamily,
    textAlign: "center",
  },
  fabContainer: {
    flex: 0.8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -24,
  },
  fabButton: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 2,
  },
  fabGlow: {
    position: "absolute",
    top: -8,
    width: FAB_SIZE + 20,
    height: FAB_SIZE + 20,
    borderRadius: (FAB_SIZE + 20) / 2,
    zIndex: 1,
  },
});
