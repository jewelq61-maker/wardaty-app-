import React from "react";
import { View, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HeaderButton } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import ArticleDetailScreen from "../screens/ArticleDetailScreen";
import { HeaderTitle } from "../components/HeaderTitle";
import { useScreenOptions } from "../hooks/useScreenOptions";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";

export type HomeStackParamList = {
  Home: undefined;
  Notifications: undefined;
  ArticleDetail: { articleId: string };
};

function NotificationsBellButton() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();

  return (
    <HeaderButton
      onPress={() => navigation.navigate("Notifications")}
      accessibilityLabel="Notifications"
      pressColor={theme.primary}
      style={styles.headerButton} // Apple HIG: 44x44 hit target
    >
      <Feather name="bell" size={20} color={theme.text} /> {/* Apple HIG: 20-22pt icons */}
    </HeaderButton>
  );
}

function HeaderSpacer() {
  return <View style={styles.spacer} />;
}

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  const screenOptions = useScreenOptions();
  const { t, isRTL } = useLanguage();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          headerTitle: t("settings", "notifications"),
        }}
      />
      <Stack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
        options={{
          headerTitle: "",
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  // Apple HIG: 44x44 minimum hit target
  headerButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  spacer: {
    width: 44,
    height: 44,
  },
});
