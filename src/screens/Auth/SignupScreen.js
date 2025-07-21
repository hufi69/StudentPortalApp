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
import { registerUser, getValidRollYears } from "../../api/auth" // Import enhanced auth API

const SignupScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    universityEmail: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

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

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    // Roll number validation
    if (!formData.rollNumber.trim()) {
      newErrors.rollNumber = "Roll number is required"
    } else {
      const rollPattern = /^(sp|fa)(19|20|21|22|23|24|25)$/i // Updated pattern for 2019-2025
      if (!rollPattern.test(formData.rollNumber.trim())) {
        const validYears = getValidRollYears()
        newErrors.rollNumber = `Invalid format. Use: sp${validYears[0]}, fa${validYears[1]}, etc.`
      }
    }

    // Email validation
    if (!formData.universityEmail.trim()) {
      newErrors.universityEmail = "University email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.universityEmail)) {
      newErrors.universityEmail = "Please enter a valid email address"
    } else if (!formData.universityEmail.endsWith("@university.edu.pk")) {
      newErrors.universityEmail = "Must use university email: username@university.edu.pk"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number"
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignup = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      // Call our enhanced registration API
      await registerUser(
        formData.name.trim(),
        formData.rollNumber.trim(),
        formData.universityEmail.trim(),
        formData.password,
      )

      console.log("Signup successful for:", formData.universityEmail)
      alert("Account created successfully! Please log in with your credentials.")
      navigation.replace(ROUTES.LOGIN) // Redirect to login page after successful signup
    } catch (error) {
      console.error("Signup error:", error.message)
      setErrors({ general: error.message || "An error occurred during signup. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const navigateToLogin = () => {
    navigation.navigate(ROUTES.LOGIN)
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
            <Text style={styles.logoSubtext}>Create Your Account</Text>
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
              <Text style={styles.welcomeTitle}>Join Our University!</Text>
              <Text style={styles.welcomeSubtitle}>Register with your official university credentials</Text>
            </View>

            <View style={styles.form}>
              <InputField
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(value) => handleInputChange("name", value)}
                leftIcon="person-outline"
                error={errors.name}
              />

              <InputField
                label="Roll Number"
                placeholder="e.g., sp22, fa21, sp20"
                value={formData.rollNumber}
                onChangeText={(value) => handleInputChange("rollNumber", value.toLowerCase())}
                leftIcon="id-card-outline"
                error={errors.rollNumber}
                autoCapitalize="none"
              />

              <InputField
                label="University Email"
                placeholder="your.name@university.edu.pk"
                value={formData.universityEmail}
                onChangeText={(value) => handleInputChange("universityEmail", value.toLowerCase())}
                keyboardType="email-address"
                leftIcon="mail-outline"
                error={errors.universityEmail}
                autoCapitalize="none"
              />

              <InputField
                label="Password"
                placeholder="Create a strong password"
                value={formData.password}
                onChangeText={(value) => handleInputChange("password", value)}
                secureTextEntry
                leftIcon="lock-closed-outline"
                error={errors.password}
              />

              <InputField
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange("confirmPassword", value)}
                secureTextEntry
                leftIcon="lock-closed-outline"
                error={errors.confirmPassword}
              />

              {/* Password Requirements Info */}
              <View style={styles.passwordInfo}>
                <Text style={styles.passwordInfoText}>
                  Password must contain: uppercase, lowercase, and number (min 8 chars)
                </Text>
              </View>

              {errors.general && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle-outline" size={16} color={COLORS.error} />
                  <Text style={styles.generalErrorText}>{errors.general}</Text>
                </View>
              )}

              <CustomButton
                title="Create Account"
                onPress={handleSignup}
                loading={loading}
                style={styles.signupButton}
              />
            </View>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={navigateToLogin}>
                <Text style={styles.loginLink}>Sign In</Text>
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
  passwordInfo: {
    backgroundColor: COLORS.grayLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  passwordInfoText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
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
  signupButton: {
    marginBottom: 24,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
  },
  loginText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  loginLink: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "600",
  },
})

export default SignupScreen
