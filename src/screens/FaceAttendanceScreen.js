"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "../constants/colors"
import CustomButton from "../components/CustomButton"

const FaceAttendanceScreen = ({ navigation }) => {
  const [demoStep, setDemoStep] = useState(0) // 0: info, 1: camera simulation, 2: detection simulation, 3: success

  const renderInfoScreen = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.featureContainer}>
        <Ionicons name="happy-outline" size={80} color={COLORS.primary} />
        <Text style={styles.featureTitle}>Face Attendance System</Text>
        <Text style={styles.featureDescription}>
          Automated attendance marking using facial recognition technology. This feature will allow students to mark
          their attendance by simply looking at the camera.
        </Text>
      </View>

      <View style={styles.benefitsContainer}>
        <Text style={styles.benefitsTitle}>Key Benefits:</Text>
        <View style={styles.benefitItem}>
          <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.success} />
          <Text style={styles.benefitText}>Quick and contactless attendance</Text>
        </View>
        <View style={styles.benefitItem}>
          <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.success} />
          <Text style={styles.benefitText}>Prevents proxy attendance</Text>
        </View>
        <View style={styles.benefitItem}>
          <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.success} />
          <Text style={styles.benefitText}>Real-time attendance tracking</Text>
        </View>
        <View style={styles.benefitItem}>
          <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.success} />
          <Text style={styles.benefitText}>Integration with academic records</Text>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <Ionicons name="construct-outline" size={24} color={COLORS.warning} />
        <Text style={styles.statusTitle}>Development Status</Text>
        <Text style={styles.statusText}>
          This feature is currently under development. The required packages (expo-face-detector,
          expo-image-manipulator) need to be installed and configured.
        </Text>
      </View>

      <CustomButton
        title="Try Demo Simulation"
        onPress={() => setDemoStep(1)}
        variant="primary"
        size="large"
        style={styles.demoButton}
      />

      <View style={styles.technicalContainer}>
        <Text style={styles.technicalTitle}>Technical Requirements:</Text>
        <Text style={styles.technicalItem}>• expo-face-detector for face detection</Text>
        <Text style={styles.technicalItem}>• expo-image-manipulator for image processing</Text>
        <Text style={styles.technicalItem}>• Backend API for face recognition</Text>
        <Text style={styles.technicalItem}>• Student face database</Text>
      </View>
    </ScrollView>
  )

  const renderCameraSimulation = () => (
    <View style={styles.simulationContainer}>
      <View style={styles.mockCamera}>
        <View style={styles.mockCameraFrame}>
          <Ionicons name="person-outline" size={100} color={COLORS.grayLight} />
          <Text style={styles.mockCameraText}>Camera Preview</Text>
          <Text style={styles.mockCameraSubtext}>Position your face in the frame</Text>
        </View>

        {demoStep >= 2 && (
          <View style={styles.faceDetectionBox}>
            <Text style={styles.detectionText}>Face Detected!</Text>
          </View>
        )}
      </View>

      <View style={styles.simulationControls}>
        <Text style={styles.simulationStatus}>
          {demoStep === 1 && "📷 Camera initialized..."}
          {demoStep === 2 && "👤 Face detected! Processing..."}
          {demoStep === 3 && "✅ Attendance marked successfully!"}
        </Text>

        <View style={styles.simulationButtons}>
          <CustomButton
            title={demoStep === 1 ? "Detect Face" : demoStep === 2 ? "Process Attendance" : "Mark Another"}
            onPress={() => {
              if (demoStep === 1) setDemoStep(2)
              else if (demoStep === 2) setDemoStep(3)
              else setDemoStep(1)
            }}
            variant="primary"
            size="medium"
            style={styles.simulationButton}
          />

          <CustomButton
            title="Back to Info"
            onPress={() => setDemoStep(0)}
            variant="outline"
            size="medium"
            style={styles.simulationButton}
          />
        </View>
      </View>

      {demoStep === 3 && (
        <View style={styles.successContainer}>
          <Ionicons name="checkmark-circle" size={50} color={COLORS.success} />
          <Text style={styles.successTitle}>Attendance Marked!</Text>
          <Text style={styles.successText}>Your attendance has been recorded for today's class.</Text>
          <Text style={styles.successTime}>Time: {new Date().toLocaleTimeString()}</Text>
        </View>
      )}
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={28} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Face Attendance</Text>
        <View style={styles.headerRight}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>DEMO</Text>
          </View>
        </View>
      </View>

      {demoStep === 0 ? renderInfoScreen() : renderCameraSimulation()}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          💡 This is a demonstration of the face attendance feature. Actual implementation requires additional setup.
        </Text>
      </View>
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
    paddingTop: 40,
    justifyContent: "space-between",
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.white,
    flex: 1,
  },
  headerRight: {
    marginLeft: 15,
  },
  statusBadge: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  featureContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    padding: 30,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  featureTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginTop: 15,
    marginBottom: 10,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  benefitsContainer: {
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
  benefitsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 15,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginLeft: 12,
    flex: 1,
  },
  statusContainer: {
    backgroundColor: COLORS.warning + "10",
    borderColor: COLORS.warning,
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.warning,
    marginLeft: 12,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  demoButton: {
    marginBottom: 20,
  },
  technicalContainer: {
    backgroundColor: COLORS.info + "10",
    borderColor: COLORS.info,
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
  },
  technicalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.info,
    marginBottom: 12,
  },
  technicalItem: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 8,
    paddingLeft: 10,
  },
  simulationContainer: {
    flex: 1,
    padding: 24,
  },
  mockCamera: {
    backgroundColor: COLORS.black,
    borderRadius: 15,
    height: 300,
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  mockCameraFrame: {
    alignItems: "center",
  },
  mockCameraText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
  },
  mockCameraSubtext: {
    color: COLORS.grayLight,
    fontSize: 14,
    marginTop: 5,
  },
  faceDetectionBox: {
    position: "absolute",
    top: 80,
    left: 80,
    right: 80,
    bottom: 80,
    borderColor: COLORS.success,
    borderWidth: 3,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  detectionText: {
    color: COLORS.success,
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  simulationControls: {
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
  simulationStatus: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 20,
  },
  simulationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  simulationButton: {
    flex: 1,
  },
  successContainer: {
    backgroundColor: COLORS.success + "10",
    borderColor: COLORS.success,
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.success,
    marginTop: 10,
    marginBottom: 8,
  },
  successText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },
  successTime: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  footer: {
    backgroundColor: COLORS.surface,
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.grayLight,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
    fontStyle: "italic",
  },
})

export default FaceAttendanceScreen
