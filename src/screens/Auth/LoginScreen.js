"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StatusBar,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"

import CustomButton from "../../components/CustomButton"
import InputField from "../../components/InputField"
import { COLORS } from "../../constants/colors"
import { ROUTES } from "../../constants/routes"
import { loginUser } from "../../api/auth" // Import enhanced auth API

const LoginScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    } else if (!formData.email.endsWith("@university.edu.pk")) {
      newErrors.email = "Please use your university email (@university.edu.pk)"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async () => {
    if (!validateForm()) return

    // Security: Limit login attempts
    if (loginAttempts >= 5) {
      setErrors({ general: "Too many failed attempts. Please try again later." })
      return
    }

    setLoading(true)
    try {
      // Call our enhanced login API
      const result = await loginUser(formData.email.trim(), formData.password)

      if (result.success) {
        console.log("Login successful!", result.user)
        // Reset login attempts on successful login
        setLoginAttempts(0)
        navigation.replace(ROUTES.MAIN_DRAWER) // Navigate to Dashboard
      }
    } catch (error) {
      console.error("Login error:", error.message)
      setLoginAttempts((prev) => prev + 1)
      setErrors({ general: error.message || "Login failed. Please try again." })

      // If user not found, suggest signing up
      if (error.message.includes("No account found")) {
        setTimeout(() => {
          navigation.navigate(ROUTES.SIGNUP)
        }, 2000)
      }
    } finally {
      setLoading(false)
    }
  }

  const navigateToSignup = () => {
    navigation.navigate(ROUTES.SIGNUP)
  }

  const navigateToForgotPassword = () => {
    console.log("Navigate to Forgot Password")
    // TODO: Implement forgot password functionality
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <LinearGradient colors={[COLORS.primary, COLORS.primaryLight]} style={styles.headerGradient}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="school-outline" size={40} color={COLORS.white} />
            </View>
            <Text style={styles.logoText}>Student Portal</Text>
            <Text style={styles.logoSubtext}>University Management System</Text>
          </View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>Welcome Back!</Text>
              <Text style={styles.welcomeSubtitle}>Sign in with your university credentials</Text>
            </View>

            <View style={styles.form}>
              <InputField
                label="University Email"
                placeholder="your.name@university.edu.pk"
                value={formData.email}
                onChangeText={(value) => handleInputChange("email", value.toLowerCase())}
                keyboardType="email-address"
                leftIcon="mail-outline"
                error={errors.email}
                autoCapitalize="none"
              />

              <InputField
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChangeText={(value) => handleInputChange("password", value)}
                secureTextEntry
                leftIcon="lock-closed-outline"
                error={errors.password}
              />

              <TouchableOpacity style={styles.forgotPasswordContainer} onPress={navigateToForgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {errors.general && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle-outline" size={16} color={COLORS.error} />
                  <Text style={styles.generalErrorText}>{errors.general}</Text>
                </View>
              )}

              {/* Security Info */}
              {loginAttempts > 2 && (
                <View style={styles.warningContainer}>
                  <Ionicons name="warning-outline" size={16} color={COLORS.warning} />
                  <Text style={styles.warningText}>
                    {5 - loginAttempts} attempts remaining before temporary lockout
                  </Text>
                </View>
              )}

              <CustomButton
                title="Sign In"
                onPress={handleLogin}
                loading={loading}
                disabled={loginAttempts >= 5}
                style={styles.loginButton}
              />

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.divider} />
              </View>

              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-google" size={20} color={COLORS.error} />
                  <Text style={styles.socialButtonText}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-facebook" size={20} color="#1877F2" />
                  <Text style={styles.socialButtonText}>Facebook</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={navigateToSignup}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerGradient: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 4,
  },
  logoSubtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  welcomeSection: {
    marginBottom: 32,
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  form: {
    marginBottom: 32,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  generalErrorText: {
    fontSize: 14,
    color: COLORS.error,
    marginLeft: 8,
    flex: 1,
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 12,
    color: COLORS.warning,
    marginLeft: 8,
    flex: 1,
  },
  loginButton: {
    marginBottom: 24,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.grayLight,
  },
  dividerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginHorizontal: 16,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
  },
  signupText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  signupLink: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "600",
  },
})

export default LoginScreen
