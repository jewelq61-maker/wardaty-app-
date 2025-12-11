import React from "react";
import { View, StyleSheet, Platform, Pressable, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import HomeStackNavigator from "./HomeStackNavigator";
import CalendarStackNavigator from "./CalendarStackNavigator";
import BeautyStackNavigator from "./BeautyStackNavigator";
import ProfileStackNavigator from "./ProfileStackNavigator";
import { useLanguage } from "../hooks/useLanguage";
import { useApp } from "../lib/AppContext";
import { useFAB } from "../contexts/FABContext";
import { Spacing, DarkTheme, getPersonaColor } from "../constants/theme";

export type MainTabParamList = {
  HomeTab: undefined;
  CalendarTab: undefined;
  BeautyTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { triggerFAB } = useFAB();
  const { t } = useLanguage();
  const { data } = useApp();

  // Safe default if data not loaded yet
  const persona = data?.settings?.persona || "single";
  const personaColor = getPersonaColor(persona);
  const inactiveColor = DarkTheme.text.tertiary;

  const FAB_SIZE = Spacing.fabSize;
  const TAB_BAR_HEIGHT = Spacing.tabBarHeight;
  const bottomPadding = Platform.OS === "ios" ? insets.bottom : Spacing.sm;

  const handleFABPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Always open LogScreen for unified quick logging
    navigation.navigate("Log");
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

  const getIconName = (routeName: string): any => {
    switch (routeName) {
      case "HomeTab":
        return "home";
      case "CalendarTab":
        return "calendar";
      case "BeautyTab":
        return "heart";
      case "ProfileTab":
        return "user";
      default:
        return "circle";
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
    const iconColor = isFocused ? personaColor.primary : inactiveColor;
    const label = getTabLabel(route.name);

    return (
      <Pressable
        key={route.key}
        onPress={onPress}
        style={({ pressed }) => [
          styles.tabItem,
          { opacity: pressed ? 0.6 : 1 },
        ]}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
      >
        <View style={styles.iconContainer}>
          <Feather
            name={iconName}
            size={Theme.iconSizes.medium}
            color={iconColor}
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
      {/* Glow effect */}
      <View
        style={[
          styles.fabGlow,
          {
            backgroundColor: personaColor.primary,
            opacity: 0.3,
          },
        ]}
      />
      {/* FAB Button */}
      <Pressable
        onPress={handleFABPress}
        style={({ pressed }) => [
          styles.fabButton,
          {
            backgroundColor: personaColor.primary,
            transform: [{ scale: pressed ? Theme.animations.buttonScale : 1 }],
          },
          Theme.shadows.large,
          {
            shadowColor: personaColor.primary,
            shadowOpacity: 0.4,
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
      {/* Background with blur */}
      {Platform.OS === "ios" ? (
        <BlurView
          intensity={80}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: Theme.dark.background.elevated },
          ]}
        />
      )}
      
      {/* Top border */}
      <View
        style={[
          styles.topBorder,
          { backgroundColor: Theme.dark.border.subtle },
        ]}
      />

      {/* Tab bar content */}
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
  },
  topBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },
  tabBarContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: Theme.spacing.xs,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Theme.spacing.xs,
    gap: Theme.spacing.xxxs,
    minHeight: Theme.spacing.listItemHeight,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    ...Theme.typography.caption1,
    textAlign: "center",
  },
  fabContainer: {
    flex: 0.8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -28,
    position: "relative",
  },
  fabButton: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  fabGlow: {
    position: "absolute",
    top: -6,
    width: FAB_SIZE + 16,
    height: FAB_SIZE + 16,
    borderRadius: (FAB_SIZE + 16) / 2,
    zIndex: 1,
  },
});
