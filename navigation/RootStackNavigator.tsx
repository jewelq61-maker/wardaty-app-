import React, { useState, useCallback } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "./MainTabNavigator";
import OnboardingScreenNew from "../screens/OnboardingScreenNew";
import RoleSelectionScreen from "../screens/RoleSelectionScreen";
import PartnerCodeEntryScreen from "../screens/PartnerCodeEntryScreen";
import PartnerHomeScreen from "../screens/PartnerHomeScreen";
import SubscriptionScreen from "../screens/SubscriptionScreen";
import { useScreenOptions } from "../hooks/useScreenOptions";
import { useApp } from "../lib/AppContext";
import { usePartner } from "../lib/PartnerContext";
import { PersonaThemeSync } from "../components/PersonaThemeSync";

export type RootStackParamList = {
  RoleSelection: undefined;
  Onboarding: undefined;
  PartnerCodeEntry: undefined;
  PartnerHome: undefined;
  Main: undefined;
  Subscription: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();
  const { data, isLoading: appLoading } = useApp();
  const { isPartnerMode, isLoading: partnerLoading } = usePartner();
  const [selectedRole, setSelectedRole] = useState<"main" | "partner" | null>(null);

  const isLoading = appLoading || partnerLoading;

  if (isLoading) {
    return null;
  }

  const handleSelectMainUser = useCallback(() => {
    setSelectedRole("main");
  }, []);

  const handleSelectPartner = useCallback(() => {
    setSelectedRole("partner");
  }, []);

  const handleBackToRoleSelection = useCallback(() => {
    setSelectedRole(null);
  }, []);

  const handlePartnerConnected = useCallback(() => {
  }, []);

  const needsOnboarding = !data.settings.onboardingComplete;
  const showRoleSelection = needsOnboarding && !isPartnerMode && selectedRole === null;
  const showPartnerCodeEntry = selectedRole === "partner" && !isPartnerMode;
  const showOnboarding = (selectedRole === "main" || data.settings.onboardingComplete === false) && !isPartnerMode && !showRoleSelection && !showPartnerCodeEntry;

  if (isPartnerMode) {
    return (
      <>
        <PersonaThemeSync />
        <Stack.Navigator screenOptions={screenOptions}>
          <Stack.Screen
            name="PartnerHome"
            component={PartnerHomeScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </>
    );
  }

  if (showRoleSelection) {
    return (
      <>
        <PersonaThemeSync />
        <RoleSelectionScreen
          onSelectMainUser={handleSelectMainUser}
          onSelectPartner={handleSelectPartner}
        />
      </>
    );
  }

  if (showPartnerCodeEntry) {
    return (
      <>
        <PersonaThemeSync />
        <PartnerCodeEntryScreen
          onBack={handleBackToRoleSelection}
          onSuccess={handlePartnerConnected}
        />
      </>
    );
  }

  return (
    <>
      <PersonaThemeSync />
      <Stack.Navigator screenOptions={screenOptions}>
        {needsOnboarding && selectedRole === "main" ? (
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreenNew}
            options={{ headerShown: false }}
          />
        ) : null}
        <Stack.Screen
          name="Main"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Subscription"
          component={SubscriptionScreen}
          options={{
            presentation: "modal",
            headerTitle: "",
          }}
        />
      </Stack.Navigator>
    </>
  );
}
