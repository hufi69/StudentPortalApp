"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, Alert, Dimensions, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Camera } from "expo-camera"
import { BarCodeScanner } from "expo-barcode-scanner"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "../constants/colors"
import CustomButton from "../components/CustomButton"

// Import dummy data
import { dummyExams, dummyExamRegistrations, dummyAttendance, dummyFeeStatus } from "../data/dummyData"

const { width } = Dimensions.get("window")
const qrCodeAreaSize = width * 0.7

const ExamEntryScannerScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null)
  const [scanned, setScanned] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [verificationStatus, setVerificationStatus] = useState(null) // 'success', 'failure', null
  const [failureReason, setFailureReason] = useState("")

  // Dummy current logged-in user (replace with actual user context later)
  const currentUserEmail = "test@university.edu.pk" // This should come from user context

  useEffect(() => {
    ;(async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === "granted")
    })()
  }, [])

  const verifyStudentForExam = (examId, studentEmail) => {
    // 1. Check if exam exists
    const exam = dummyExams.find((e) => e.id === examId)
    if (!exam) {
      return { success: false, reason: "Invalid Exam QR Code. Exam not found." }
    }

    // 2. Check if student is registered for this exam
    const isRegistered = dummyExamRegistrations.some(
      (reg) => reg.studentEmail === studentEmail && reg.examId === examId,
    )
    if (!isRegistered) {
      return { success: false, reason: `You are not registered for the ${exam.courseCode} exam.` }
    }

    // 3. Check attendance for the course associated with the exam
    const studentAttendance = dummyAttendance.find(
      (att) => att.studentEmail === studentEmail && att.courseCode === exam.courseCode,
    )
    const minAttendanceRequired = 75 // Example threshold
    if (!studentAttendance || studentAttendance.percentage < minAttendanceRequired) {
      return {
        success: false,
        reason: `Short attendance in ${exam.courseCode}. Minimum ${minAttendanceRequired}% required.`,
      }
    }

    // 4. Check fee defaulter status
    const studentFeeStatus = dummyFeeStatus.find((fee) => fee.studentEmail === studentEmail)
    if (studentFeeStatus && studentFeeStatus.isDefaulter) {
      return { success: false, reason: "You are a fee defaulter. Please clear your dues." }
    }

    return { success: true, examDetails: exam }
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true)
    setScanResult(data)

    // Assuming 'data' contains the examId
    const verification = verifyStudentForExam(data, currentUserEmail)

    if (verification.success) {
      setVerificationStatus("success")
      setFailureReason("")
      Alert.alert(
        "Verification Successful!",
        `Welcome to the ${verification.examDetails.courseTitle} exam. Room: ${verification.examDetails.room}`,
        [{ text: "OK", onPress: () => setScanned(false) }], // Allow rescanning
      )
    } else {
      setVerificationStatus("failure")
      setFailureReason(verification.reason)
      Alert.alert("Verification Failed", verification.reason, [{ text: "OK", onPress: () => setScanned(false) }]) // Allow rescanning
    }
  }

  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Requesting for camera permission</Text>
      </View>
    )
  }
  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>No access to camera</Text>
        <CustomButton title="Go Back" onPress={() => navigation.goBack()} style={styles.goBackButton} />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={28} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Exam Entry Scanner</Text>
      </View>

      <View style={styles.scannerContainer}>
        <Camera
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
          barCodeScannerSettings={{
            barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr, BarCodeScanner.Constants.BarCodeType.code128],
          }}
        />
        <View style={styles.overlay}>
          <View style={styles.unfocusedContainer} />
          <View style={styles.middleContainer}>
            <View style={styles.unfocusedContainer} />
            <View style={styles.focusedContainer} />
            <View style={styles.unfocusedContainer} />
          </View>
          <View style={styles.unfocusedContainer} />
        </View>
        <Text style={styles.scanInstruction}>Align QR/Barcode within the frame</Text>
      </View>

      {scanResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.scanResultText}>Scanned: {scanResult}</Text>
          {verificationStatus === "success" && (
            <View style={styles.statusSuccess}>
              <Ionicons name="checkmark-circle-outline" size={24} color={COLORS.success} />
              <Text style={styles.statusTextSuccess}>Access Granted!</Text>
            </View>
          )}
          {verificationStatus === "failure" && (
            <View style={styles.statusFailure}>
              <Ionicons name="close-circle-outline" size={24} color={COLORS.error} />
              <Text style={styles.statusTextFailure}>Access Denied!</Text>
              <Text style={styles.failureReasonText}>{failureReason}</Text>
            </View>
          )}
          <CustomButton title="Scan Again" onPress={() => setScanned(false)} style={styles.scanAgainButton} />
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  permissionText: {
    fontSize: 18,
    color: COLORS.textPrimary,
    marginBottom: 20,
  },
  goBackButton: {
    width: "60%",
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
  scannerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.black,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: "100%",
  },
  middleContainer: {
    flexDirection: "row",
    width: "100%",
    height: qrCodeAreaSize,
  },
  focusedContainer: {
    width: qrCodeAreaSize,
    height: qrCodeAreaSize,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 10,
  },
  scanInstruction: {
    position: "absolute",
    bottom: 50,
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  resultContainer: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  scanResultText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  statusSuccess: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.success + "10",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  statusFailure: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: COLORS.error + "10",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  statusTextSuccess: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.success,
    marginLeft: 10,
  },
  statusTextFailure: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.error,
    marginTop: 5,
  },
  failureReasonText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 5,
  },
  scanAgainButton: {
    marginTop: 15,
    width: "80%",
  },
})

export default ExamEntryScannerScreen
