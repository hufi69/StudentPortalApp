"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "../constants/colors"
import InputField from "../components/InputField"
import CustomButton from "../components/CustomButton"

const TestQrGeneratorScreen = ({ navigation }) => {
  const [qrValue, setQrValue] = useState("exam_cs101_midterm_fall2025") // Default value for easy testing

  const renderQRCodePlaceholder = () => {
    if (!qrValue || qrValue.trim() === "") {
      return (
        <View style={styles.placeholderContainer}>
          <Ionicons name="qr-code-outline" size={80} color={COLORS.grayLight} />
          <Text style={styles.placeholderText}>Enter text to generate QR code content</Text>
        </View>
      )
    }

    return (
      <View style={styles.qrPlaceholderContainer}>
        <Ionicons name="qr-code-outline" size={100} color={COLORS.primary} />
        <Text style={styles.qrPlaceholderTitle}>QR Code Would Appear Here</Text>
        <Text style={styles.qrPlaceholderSubtext}>Install react-native-qrcode-svg to see actual QR code</Text>
        <View style={styles.qrContentBox}>
          <Text style={styles.qrContentLabel}>Content:</Text>
          <Text style={styles.qrContentValue}>{qrValue}</Text>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={28} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Test QR Code Generator</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Package Installation Warning */}
        <View style={styles.warningContainer}>
          <Ionicons name="information-circle-outline" size={24} color={COLORS.info} />
          <Text style={styles.warningTitle}>QR Code Generation Disabled</Text>
          <Text style={styles.warningText}>
            Visual QR code generation is disabled to prevent compatibility issues. You can still generate test content
            for the scanner.
          </Text>
          <Text style={styles.warningSubtext}>
            To enable QR code generation, install: react-native-qrcode-svg and add TextEncoder polyfill
          </Text>
        </View>

        <Text style={styles.instructionText}>
          Enter the text you want to use for testing the scanner. Use values like `exam_cs101_midterm_fall2025` for
          valid scans, or `exam_ma201_final_fall2025` for short attendance testing.
        </Text>

        <InputField
          label="Test Content"
          placeholder="e.g., exam_id_here"
          value={qrValue}
          onChangeText={setQrValue}
          leftIcon="qr-code-outline"
          style={styles.inputField}
        />

        {renderQRCodePlaceholder()}

        <CustomButton
          title="Go to Scanner"
          onPress={() => navigation.navigate("ExamScanner")} // Navigate back to the scanner
          variant="primary"
          size="large"
          style={styles.scannerButton}
        />

        {/* Test Values Section */}
        <View style={styles.testValuesContainer}>
          <Text style={styles.testValuesTitle}>Quick Test Values:</Text>
          <Text style={styles.testValuesSubtitle}>Tap to set different test scenarios</Text>

          <TouchableOpacity style={styles.testValueButton} onPress={() => setQrValue("exam_cs101_midterm_fall2025")}>
            <View style={styles.testValueHeader}>
              <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.success} />
              <Text style={styles.testValueTitle}>Valid Exam Entry</Text>
            </View>
            <Text style={styles.testValueText}>exam_cs101_midterm_fall2025</Text>
            <Text style={styles.testValueDesc}>✓ Student registered ✓ Good attendance ✓ No fee issues</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.testValueButton} onPress={() => setQrValue("exam_ma201_final_fall2025")}>
            <View style={styles.testValueHeader}>
              <Ionicons name="warning-outline" size={20} color={COLORS.warning} />
              <Text style={styles.testValueTitle}>Short Attendance</Text>
            </View>
            <Text style={styles.testValueText}>exam_ma201_final_fall2025</Text>
            <Text style={styles.testValueDesc}>✓ Student registered ✗ Low attendance (60%) ✓ No fee issues</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.testValueButton} onPress={() => setQrValue("exam_ph101_midterm_fall2025")}>
            <View style={styles.testValueHeader}>
              <Ionicons name="close-circle-outline" size={20} color={COLORS.error} />
              <Text style={styles.testValueTitle}>Not Registered</Text>
            </View>
            <Text style={styles.testValueText}>exam_ph101_midterm_fall2025</Text>
            <Text style={styles.testValueDesc}>✗ Student not registered for this exam</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.testValueButton} onPress={() => setQrValue("invalid_exam_id")}>
            <View style={styles.testValueHeader}>
              <Ionicons name="alert-circle-outline" size={20} color={COLORS.error} />
              <Text style={styles.testValueTitle}>Invalid Exam ID</Text>
            </View>
            <Text style={styles.testValueText}>invalid_exam_id</Text>
            <Text style={styles.testValueDesc}>✗ Exam not found in system</Text>
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>How to Test:</Text>
          <Text style={styles.instructionStep}>1. Select a test value above or enter your own</Text>
          <Text style={styles.instructionStep}>2. Go to the Scanner screen</Text>
          <Text style={styles.instructionStep}>3. Manually enter the test value in the scanner</Text>
          <Text style={styles.instructionStep}>4. See the verification result</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 40, // Adjust for safe area
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  warningContainer: {
    backgroundColor: COLORS.info + "10",
    borderColor: COLORS.info,
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.info,
    marginBottom: 5,
    marginLeft: 10,
    flex: 1,
  },
  warningText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginLeft: 10,
    flex: 1,
    marginBottom: 5,
  },
  warningSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 10,
    flex: 1,
    fontStyle: "italic",
  },
  instructionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 20,
    backgroundColor: COLORS.primaryLight + "10",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  inputField: {
    marginBottom: 30,
  },
  placeholderContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    padding: 30,
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
    borderWidth: 2,
    borderColor: COLORS.grayLight,
    borderStyle: "dashed",
  },
  placeholderText: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 10,
    textAlign: "center",
  },
  qrPlaceholderContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 250,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  qrPlaceholderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginTop: 15,
    marginBottom: 5,
  },
  qrPlaceholderSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 20,
  },
  qrContentBox: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 15,
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.grayLight,
  },
  qrContentLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  qrContentValue: {
    fontSize: 16,
    color: COLORS.primary,
    fontFamily: "monospace",
  },
  scannerButton: {
    marginBottom: 30,
  },
  testValuesContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  testValuesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 5,
    textAlign: "center",
  },
  testValuesSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 20,
  },
  testValueButton: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
  },
  testValueHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  testValueTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
  testValueText: {
    fontSize: 14,
    color: COLORS.primary,
    fontFamily: "monospace",
    marginBottom: 5,
    backgroundColor: COLORS.grayLight,
    padding: 8,
    borderRadius: 5,
  },
  testValueDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: "italic",
  },
  instructionsContainer: {
    backgroundColor: COLORS.success + "10",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.success,
    marginBottom: 10,
  },
  instructionStep: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 5,
    paddingLeft: 10,
  },
})

export default TestQrGeneratorScreen
