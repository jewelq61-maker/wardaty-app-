import React, { useState, useCallback } from "react";
import { View, StyleSheet, Pressable, ActivityIndicator, Alert, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { KeyboardAwareScrollViewCompat } from "../components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "../components/ThemedText";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";
import { useLayout } from "../lib/ThemePersonaContext";
import { useAuth } from "../lib/AuthContext";
import { Spacing, BorderRadius } from "../constants/theme";

type AuthMode = "login" | "register";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { isRTL } = useLanguage();
  const layout = useLayout();
  const { login, register } = useAuth();
  
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; username?: string }>({});

  const validateForm = useCallback(() => {
    const newErrors: { email?: string; password?: string; username?: string } = {};
    
    if (!email.trim()) {
      newErrors.email = isRTL ? "البريد الإلكتروني مطلوب" : "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = isRTL ? "البريد الإلكتروني غير صالح" : "Invalid email format";
    }
    
    if (!password) {
      newErrors.password = isRTL ? "كلمة المرور مطلوبة" : "Password is required";
    } else if (password.length < 6) {
      newErrors.password = isRTL ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters";
    }
    
    if (mode === "register" && !username.trim()) {
      newErrors.username = isRTL ? "اسم المستخدم مطلوب" : "Username is required";
    } else if (mode === "register" && username.length < 3) {
      newErrors.username = isRTL ? "اسم المستخدم يجب أن يكون 3 أحرف على الأقل" : "Username must be at least 3 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password, username, mode, isRTL]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      let result;
      if (mode === "login") {
        result = await login(email, password);
      } else {
        result = await register(username, email, password, displayName || undefined);
      }
      
      if (!result.success) {
        Alert.alert(
          isRTL ? "خطأ" : "Error",
          result.error || (isRTL ? "حدث خطأ ما" : "Something went wrong")
        );
      }
    } catch (error) {
      Alert.alert(
        isRTL ? "خطأ" : "Error",
        isRTL ? "حدث خطأ في الشبكة" : "Network error. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [mode, email, password, username, displayName, login, register, validateForm, isRTL]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
    setErrors({});
  }, []);

  const renderInput = (
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    icon: keyof typeof Feather.glyphMap,
    error?: string,
    secureTextEntry?: boolean,
    keyboardType?: "email-address" | "default"
  ) => (
    <View style={styles.inputWrapper}>
      <View
        style={[
          styles.inputContainer,
          { backgroundColor: theme.backgroundSecondary, borderColor: error ? theme.error : theme.cardBorder },
        ]}
      >
        <Feather name={icon} size={20} color={theme.textSecondary} style={styles.inputIcon} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize="none"
          autoCorrect={false}
          style={[
            styles.textInput,
            { color: theme.text, textAlign: layout.textAlign },
          ]}
        />
        {secureTextEntry ? (
          <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
            <Feather name={showPassword ? "eye-off" : "eye"} size={20} color={theme.textSecondary} />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <ThemedText type="small" style={[styles.errorText, { color: theme.error, textAlign: layout.textAlign }]}>
          {error}
        </ThemedText>
      ) : null}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <KeyboardAwareScrollViewCompat
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing.xl * 2,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
          <View style={[styles.logoContainer, { backgroundColor: theme.primary + "20" }]}>
            <Feather name="heart" size={40} color={theme.primary} />
          </View>
          <ThemedText type="h1" style={styles.title}>
            {isRTL ? "ورديتي" : "Wardaty"}
          </ThemedText>
          <ThemedText type="body" style={[styles.subtitle, { color: theme.textSecondary }]}>
            {mode === "login"
              ? isRTL
                ? "مرحباً بعودتك"
                : "Welcome back"
              : isRTL
              ? "أنشئي حسابك"
              : "Create your account"}
          </ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(200)}>
          <Card style={styles.formCard}>
            {mode === "register" ? (
              <>
                {renderInput(username, setUsername, isRTL ? "اسم المستخدم" : "Username", "user", errors.username)}
                {renderInput(displayName, setDisplayName, isRTL ? "الاسم الظاهر (اختياري)" : "Display name (optional)", "smile")}
              </>
            ) : null}
            
            {renderInput(
              email,
              setEmail,
              isRTL ? "البريد الإلكتروني" : "Email",
              "mail",
              errors.email,
              false,
              "email-address"
            )}
            
            {renderInput(
              password,
              setPassword,
              isRTL ? "كلمة المرور" : "Password",
              "lock",
              errors.password,
              true
            )}

            <Button
              title={
                isLoading
                  ? ""
                  : mode === "login"
                  ? isRTL
                    ? "تسجيل الدخول"
                    : "Sign In"
                  : isRTL
                  ? "إنشاء حساب"
                  : "Create Account"
              }
              onPress={handleSubmit}
              disabled={isLoading}
              style={styles.submitButton}
            >
              {isLoading ? <ActivityIndicator color={theme.buttonText} /> : null}
            </Button>

            <View style={styles.switchModeContainer}>
              <ThemedText type="body" style={{ color: theme.textSecondary }}>
                {mode === "login"
                  ? isRTL
                    ? "ليس لديك حساب؟"
                    : "Don't have an account?"
                  : isRTL
                  ? "لديك حساب بالفعل؟"
                  : "Already have an account?"}
              </ThemedText>
              <Pressable onPress={toggleMode}>
                <ThemedText type="body" style={[styles.switchModeText, { color: theme.primary }]}>
                  {mode === "login"
                    ? isRTL
                      ? "سجلي الآن"
                      : "Sign up"
                    : isRTL
                    ? "سجلي الدخول"
                    : "Sign in"}
                </ThemedText>
              </Pressable>
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.footer}>
          <ThemedText type="small" style={[styles.footerText, { color: theme.textSecondary }]}>
            {isRTL
              ? "بتسجيل الدخول، فإنك توافقين على شروط الخدمة وسياسة الخصوصية"
              : "By signing in, you agree to our Terms of Service and Privacy Policy"}
          </ThemedText>
        </Animated.View>
      </KeyboardAwareScrollViewCompat>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.xl * 2,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    marginBottom: Spacing.xs,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
  },
  formCard: {
    padding: Spacing.xl,
  },
  inputWrapper: {
    marginBottom: Spacing.md,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spacing.md,
    height: 52,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
  },
  eyeButton: {
    padding: Spacing.sm,
  },
  errorText: {
    marginTop: Spacing.xs,
    marginHorizontal: Spacing.md,
  },
  submitButton: {
    marginTop: Spacing.md,
  },
  switchModeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.lg,
    gap: Spacing.xs,
  },
  switchModeText: {
    fontWeight: "600",
  },
  footer: {
    marginTop: Spacing.xl * 2,
    paddingHorizontal: Spacing.lg,
  },
  footerText: {
    textAlign: "center",
    lineHeight: 20,
  },
});
