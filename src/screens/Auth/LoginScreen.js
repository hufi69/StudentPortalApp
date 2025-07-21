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
  Dimensions,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"
import Animated, { FadeInDown, FadeInUp, SlideInRight } from "react-native-reanimated"

import CustomButton from "../../components/CustomButton"
import InputField from "../../components/InputField"
import { COLORS } from "../../constants/colors"
import { ROUTES } from "../../constants/routes"
import { loginUser } from "../../api/auth"

const { width, height } = Dimensions.get("window")

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

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    } else if (!formData.email.endsWith("@university.edu.pk")) {
      newErrors.email = "Please use your university email (@university.edu.pk)"
    }

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

    if (loginAttempts >= 5) {
      setErrors({ general: "Too many failed attempts. Please try again later." })
      return
    }

    setLoading(true)
    try {
      const result = await loginUser(formData.email.trim(), formData.password)

      if (result.success) {
        console.log("Login successful!", result.user)
        setLoginAttempts(0)
        navigation.replace(ROUTES.MAIN_DRAWER)
      }
    } catch (error) {
      console.error("Login error:", error.message)
      setLoginAttempts((prev) => prev + 1)
      setErrors({ general: error.message || "Login failed. Please try again." })

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
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Background Gradient */}
      <LinearGradient
        colors={[...COLORS.primaryGradient, COLORS.accentLight]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Floating Elements */}
      <View style={styles.floatingElements}>
        <Animated.View 
          entering={FadeInUp.delay(100).springify()}
          style={[styles.floatingCircle, styles.circle1]} 
        />
        <Animated.View 
          entering={FadeInUp.delay(200).springify()}
          style={[styles.floatingCircle, styles.circle2]} 
        />
        <Animated.View 
          entering={FadeInUp.delay(300).springify()}
          style={[styles.floatingCircle, styles.circle3]} 
        />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <Animated.View 
            entering={FadeInDown.springify()}
            style={styles.headerSection}
          >
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={["rgba(255,255,255,0.3)", "rgba(255,255,255,0.1)"]}
                style={styles.logoCircle}
              >
                <Ionicons name="school-outline" size={48} color={COLORS.white} />
              </LinearGradient>
              <Text style={styles.logoText}>Student Portal</Text>
              <Text style={styles.logoSubtext}>Your Gateway to Academic Excellence</Text>
            </View>
          </Animated.View>

          {/* Form Container */}
          <Animated.View 
            entering={SlideInRight.delay(400).springify()}
            style={styles.formContainer}
          >
            <LinearGradient
              colors={["rgba(255,255,255,0.95)", "rgba(255,255,255,0.9)"]}
              style={styles.formGradient}
            >
              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeTitle}>Welcome Back!</Text>
                <Text style={styles.welcomeSubtitle}>Sign in to continue your journey</Text>
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
                  <Animated.View 
                    entering={FadeInDown.springify()}
                    style={styles.errorContainer}
                  >
                    <Ionicons name="alert-circle-outline" size={16} color={COLORS.error} />
                    <Text style={styles.generalErrorText}>{errors.general}</Text>
                  </Animated.View>
                )}

                {loginAttempts > 2 && (
                  <Animated.View 
                    entering={FadeInDown.springify()}
                    style={styles.warningContainer}
                  >
                    <Ionicons name="warning-outline" size={16} color={COLORS.warning} />
                    <Text style={styles.warningText}>
                      {5 - loginAttempts} attempts remaining before temporary lockout
                    </Text>
                  </Animated.View>
                )}

                <CustomButton
                  title="Sign In"
                  onPress={handleLogin}
                  loading={loading}
                  disabled={loginAttempts >= 5}
                  style={styles.loginButton}
                  variant="primary"
                  size="large"
                />

                <View style={styles.dividerContainer}>
                  <View style={styles.divider} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.divider} />
                </View>

                <View style={styles.socialButtonsContainer}>
                  <TouchableOpacity style={styles.socialButton}>
                    <LinearGradient
                      colors={["#db4437", "#cc2b1d"]}
                      style={styles.socialButtonGradient}
                    >
                      <Ionicons name="logo-google" size={20} color={COLORS.white} />
                      <Text style={styles.socialButtonText}>Google</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.socialButton}>
                    <LinearGradient
                      colors={["#1877F2", "#166fe5"]}
                      style={styles.socialButtonGradient}
                    >
                      <Ionicons name="logo-facebook" size={20} color={COLORS.white} />
                      <Text style={styles.socialButtonText}>Facebook</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity onPress={navigateToSignup}>
                  <Text style={styles.signupLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  backgroundGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  floatingElements: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  floatingCircle: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 100,
  },
  circle1: {
    width: 120,
    height: 120,
    top: height * 0.1,
    right: -40,
  },
  circle2: {
    width: 80,
    height: 80,
    top: height * 0.3,
    left: -20,
  },
  circle3: {
    width: 60,
    height: 60,
    top: height * 0.7,
    right: 40,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  headerSection: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: "center",
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  logoText: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.white,
    marginBottom: 8,
    letterSpacing: -1,
  },
  logoSubtext: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.85)",
    textAlign: "center",
    fontWeight: "500",
  },
  formContainer: {
    flex: 0.6,
    marginTop: 40,
    borderRadius: 32,
    overflow: "hidden",
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 20,
  },
  formGradient: {
    flex: 1,
    padding: 32,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  welcomeSection: {
    marginBottom: 32,
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    fontWeight: "500",
  },
  form: {
    marginBottom: 24,
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
    backgroundColor: COLORS.error + "15",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.error + "30",
  },
  generalErrorText: {
    fontSize: 14,
    color: COLORS.error,
    marginLeft: 8,
    flex: 1,
    fontWeight: "500",
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.warning + "15",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.warning + "30",
  },
  warningText: {
    fontSize: 12,
    color: COLORS.warning,
    marginLeft: 8,
    flex: 1,
    fontWeight: "500",
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
    fontWeight: "600",
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  socialButton: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: COLORS.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  socialButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
    marginLeft: 8,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  signupText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  signupLink: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "700",
  },
})