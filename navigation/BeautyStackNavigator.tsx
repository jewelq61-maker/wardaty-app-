import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { HeaderButton } from "@react-navigation/elements";
import BeautyScreen from "../screens/BeautyScreen";
import ProductsScreen from "../screens/ProductsScreen";
import { useScreenOptions } from "../hooks/useScreenOptions";
import { useTheme } from "../hooks/useTheme";

export type BeautyStackParamList = {
  Beauty: undefined;
  Products: undefined;
};

const Stack = createNativeStackNavigator<BeautyStackParamList>();

export default function BeautyStackNavigator() {
  const screenOptions = useScreenOptions();
  const { theme } = useTheme();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Beauty"
        component={BeautyScreen}
        options={({ navigation }) => ({
          headerTitle: "Beauty Planner",
          headerRight: () => (
            <HeaderButton
              onPress={() => navigation.navigate("Products")}
              pressColor={theme.primary}
            >
              <Feather name="package" size={22} color={theme.text} />
            </HeaderButton>
          ),
        })}
      />
      <Stack.Screen
        name="Products"
        component={ProductsScreen}
        options={{
          headerTitle: "My Products",
        }}
      />
    </Stack.Navigator>
  );
}
