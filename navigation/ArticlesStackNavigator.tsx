import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ArticlesScreen from "../screens/ArticlesScreen";
import ArticleDetailScreen from "../screens/ArticleDetailScreen";
import FatwaScreen from "../screens/FatwaScreen";
import { useScreenOptions } from "../hooks/useScreenOptions";
import { useLanguage } from "../hooks/useLanguage";

export type ArticlesStackParamList = {
  Articles: undefined;
  ArticleDetail: { articleId: string };
  Fatwa: undefined;
};

const Stack = createNativeStackNavigator<ArticlesStackParamList>();

export default function ArticlesStackNavigator() {
  const screenOptions = useScreenOptions();
  const { t, language } = useLanguage();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Articles"
        component={ArticlesScreen}
        options={{
          headerTitle: t('tabs', 'articles'),
        }}
      />
      <Stack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
        options={{
          headerTitle: "",
        }}
      />
      <Stack.Screen
        name="Fatwa"
        component={FatwaScreen}
        options={{
          headerTitle: language === "ar" ? "مكتبة الفتاوى" : "Fatwa Library",
        }}
      />
    </Stack.Navigator>
  );
}
