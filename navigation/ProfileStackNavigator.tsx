import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HeaderButton } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import ProfileScreen from "../screens/ProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import QadhaScreen from "../screens/QadhaScreen";
import DaughtersScreen from "../screens/DaughtersScreen";
import WellnessScreen from "../screens/WellnessScreen";
import ArticlesScreen from "../screens/ArticlesScreen";
import FatwaScreen from "../screens/FatwaScreen";
import SettingsScreen from "../screens/SettingsScreen";
import SubscriptionScreen from "../screens/SubscriptionScreen";
import MoyasarPaymentScreen from "../screens/MoyasarPaymentScreen";
import StatsScreen from "../screens/StatsScreen";
import AboutScreen from "../screens/AboutScreen";
import PrivacyPolicyScreen from "../screens/PrivacyPolicyScreen";
import PregnancyScreen from "../screens/PregnancyScreen";
import AdminScreen from "../screens/AdminScreen";
import { useScreenOptions } from "../hooks/useScreenOptions";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  Qadha: undefined;
  Daughters: undefined;
  Wellness: undefined;
  Articles: undefined;
  Fatwa: undefined;
  Settings: undefined;
  Subscription: undefined;
  MoyasarPayment: { formHtml: string; planCode: string; amount: number };
  Stats: undefined;
  About: undefined;
  PrivacyPolicy: undefined;
  Pregnancy: undefined;
  Admin: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStackNavigator() {
  const screenOptions = useScreenOptions();
  const { theme } = useTheme();
  const { t } = useLanguage();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerTitle: t("profile", "title"),
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerTitle: t("profile", "editProfile") }}
      />
      <Stack.Screen
        name="Qadha"
        component={QadhaScreen}
        options={{ headerTitle: t("qadha", "title") }}
      />
      <Stack.Screen
        name="Daughters"
        component={DaughtersScreen}
        options={{ headerTitle: t("daughters", "title") }}
      />
      <Stack.Screen
        name="Wellness"
        component={WellnessScreen}
        options={{ headerTitle: t("wellness", "title") }}
      />
      <Stack.Screen
        name="Articles"
        component={ArticlesScreen}
        options={{ headerTitle: t("articles", "title") }}
      />
      <Stack.Screen
        name="Fatwa"
        component={FatwaScreen}
        options={{ headerTitle: t("fatwa", "title") }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerTitle: t("settings", "title") }}
      />
      <Stack.Screen
        name="Subscription"
        component={SubscriptionScreen}
        options={{ headerTitle: t("profile", "wardatyPlus") }}
      />
      <Stack.Screen
        name="MoyasarPayment"
        component={MoyasarPaymentScreen}
        options={{ headerTitle: "", headerShown: false }}
      />
      <Stack.Screen
        name="Stats"
        component={StatsScreen}
        options={{ headerTitle: t("settings", "statistics") }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ headerTitle: t("settings", "about") }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{ headerTitle: t("settings", "privacyPolicy") }}
      />
      <Stack.Screen
        name="Pregnancy"
        component={PregnancyScreen}
        options={{ headerTitle: t("pregnancy", "title") }}
      />
      <Stack.Screen
        name="Admin"
        component={AdminScreen}
        options={{ headerTitle: t("admin", "title") }}
      />
    </Stack.Navigator>
  );
}
