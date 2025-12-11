import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query-client";

import RootStackNavigator from "@/navigation/RootStackNavigator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppProvider } from "@/lib/AppContext";
import { ThemePersonaProvider, useThemePersona } from "@/lib/ThemePersonaContext";
import { PartnerProvider } from "@/lib/PartnerContext";
import { FABProvider } from "@/contexts/FABContext";

SplashScreen.preventAutoHideAsync();

function ThemedAppContent() {
  const { theme, isDark } = useThemePersona();
  
  return (
    <View style={[styles.themedRoot, { backgroundColor: theme.colors.backgroundRoot }]}>
      <GestureHandlerRootView style={styles.root}>
        <KeyboardProvider>
          <NavigationContainer>
            <RootStackNavigator />
          </NavigationContainer>
          <StatusBar style={isDark ? "light" : "dark"} />
        </KeyboardProvider>
      </GestureHandlerRootView>
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    "Tajawal-Regular": require("./assets/fonts/Tajawal-Regular.ttf"),
    "Tajawal-Medium": require("./assets/fonts/Tajawal-Medium.ttf"),
    "Tajawal-Bold": require("./assets/fonts/Tajawal-Bold.ttf"),
    "Tajawal-Light": require("./assets/fonts/Tajawal-Light.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemePersonaProvider>
          <AppProvider>
            <PartnerProvider>
              <FABProvider>
                <SafeAreaProvider>
                  <ThemedAppContent />
                </SafeAreaProvider>
              </FABProvider>
            </PartnerProvider>
          </AppProvider>
        </ThemePersonaProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  themedRoot: {
    flex: 1,
  },
  root: {
    flex: 1,
  },
});
