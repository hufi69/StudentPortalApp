"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Vibration } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import * as LocalAuthentication from "expo-local-authentication"
import { COLORS } from "../constants/colors"
import CustomButton from "../components/CustomButton"

// Dummy data for student's registered courses and today's lectures
const dummyTodayLectures = [
  {
    id: "lec_cs101_001",
    courseCode: "CS101",
    courseTitle: "Programming Fundamentals",
    instructor: "Dr. Ali Khan",
    timeSlot: "09:00 AM - 10:30 AM",
    room: "Lab 101",
    status: "upcoming", // upcoming, ongoing, completed, missed
    attendanceWindow: {
      start: "08:45 AM",
      end: "10:45 AM", // 15 min before start, 15 min after end
    },
    currentTime: new Date().toLocaleTimeString(),
  },
  {
    id: "lec_ma201_002",
    courseCode: "MA201",
    courseTitle: "Calculus I",
    instructor: "Prof. Sara Ahmed",
    timeSlot: "11:00 AM - 12:30 PM",
    room: "Room 205",
    status: "ongoing",
    attendanceWindow: {
      start: "10:45 AM",
      end: "12:45 PM",
    },
    currentTime: new Date().toLocaleTimeString(),
  },
  {
    id: "lec_ph101_003",
    courseCode: "PH101",
    courseTitle: "Applied Physics",
    instructor: "Dr. Usman Tariq",
    timeSlot: "02:00 PM - 03:30 PM",
    room: "Lab 203",
    status: "upcoming",
    attendanceWindow: {
      start: "01:45 PM",
      end: "03:45 PM",
    },
    currentTime: new Date().toLocaleTimeString(),
  },
]

// Dummy attendance records for today
const dummyAttendanceRecords = [
  {
    lectureId: "lec_cs101_001",
    turnInTime: "09:05 AM",
    turnOutTime: null, // Still in class
    status: "present",
  },
]

const BiometricAttendanceScreen = ({ navigation }) => {
  const [biometricSupported, setBiometricSupported] = useState(false)
  const [biometricTypes, setBiometricTypes] = useState([])
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [selectedLecture, setSelectedLecture] = useState(null)
  const [attendanceAction, setAttendanceAction] = useState(null) // 'turn-in' or 'turn-out'
  const [attendanceRecords, setAttendanceRecords] = useState(dummyAttendanceRecords)

  useEffect(() => {
    checkBiometricSupport()
  }, [])

  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync()
      setBiometricSupported(compatible)

      if (compatible) {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync()
        setBiometricTypes(types)
      }
    } catch (error) {
      console.error("Error checking biometric support:", error)
    }
  }

  const getBiometricTypeIcon = () => {
    if (biometricTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return "scan-outline"
    } else if (biometricTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return "finger-print-outline"
    } else if (biometricTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return "eye-outline"
    }
    return "lock-closed-outline"
  }

  const getBiometricTypeName = () => {
    if (biometricTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return "Face ID"
    } else if (biometricTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return "Fingerprint"
    } else if (biometricTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return "Iris Scan"
    }
    return "Biometric"
  }

  const getLectureStatus = (lecture) => {
    const existingRecord = attendanceRecords.find((record) => record.lectureId === lecture.id)
    if (existingRecord) {
      if (existingRecord.turnOutTime) {
        return "completed" // Both turn-in and turn-out done
      } else {
        return "checked-in" // Only turn-in done
      }
    }
    return lecture.status
  }

  const canMarkAttendance = (lecture) => {
    const now = new Date()
    const currentTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    // For demo purposes, we'll allow attendance for ongoing and upcoming lectures
    return lecture.status === "ongoing" || lecture.status === "upcoming"
  }

  const getAvailableActions = (lecture) => {
    const existingRecord = attendanceRecords.find((record) => record.lectureId === lecture.id)
    if (!existingRecord) {
      return ["turn-in"] // Can only turn in initially
    } else if (!existingRecord.turnOutTime) {
      return ["turn-out"] // Can turn out if already turned in
    }
    return [] // Both actions completed
  }

  const handleBiometricAuth = async (lecture, action) => {
    if (!biometricSupported) {
      Alert.alert("Not Supported", "Biometric authentication is not supported on this device.")
      return
    }

    setSelectedLecture(lecture)
    setAttendanceAction(action)
    setIsAuthenticating(true)

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `${action === "turn-in" ? "Turn In" : "Turn Out"} for ${lecture.courseCode}`,
        subPrompt: `Use your ${getBiometricTypeName()} to mark attendance`,
        cancelLabel: "Cancel",
        fallbackLabel: "Use Passcode",
      })

      if (result.success) {
        Vibration.vibrate(100) // Success vibration
        await markAttendance(lecture, action)
      } else {
        Alert.alert("Authentication Failed", "Biometric authentication was not successful.")
      }
    } catch (error) {
      console.error("Biometric authentication error:", error)
      Alert.alert("Error", "An error occurred during authentication.")
    } finally {
      setIsAuthenticating(false)
      setSelectedLecture(null)
      setAttendanceAction(null)
    }
  }

  const markAttendance = async (lecture, action) => {
    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    if (action === "turn-in") {
      // Add new attendance record
      const newRecord = {
        lectureId: lecture.id,
        turnInTime: currentTime,
        turnOutTime: null,
        status: "present",
      }
      setAttendanceRecords((prev) => [...prev, newRecord])

      Alert.alert(
        "Turn In Successful! ✅",
        `You have successfully turned in for ${lecture.courseCode} - ${lecture.courseTitle}\n\nTime: ${currentTime}\nRoom: ${lecture.room}`,
        [{ text: "OK" }],
      )
    } else if (action === "turn-out") {
      // Update existing record with turn-out time
      setAttendanceRecords((prev) =>
        prev.map((record) => (record.lectureId === lecture.id ? { ...record, turnOutTime: currentTime } : record)),
      )

      const existingRecord = attendanceRecords.find((record) => record.lectureId === lecture.id)
      const duration = calculateDuration(existingRecord?.turnInTime, currentTime)

      Alert.alert(
        "Turn Out Successful! ✅",
        `You have successfully turned out from ${lecture.courseCode} - ${lecture.courseTitle}\n\nTurn In: ${existingRecord?.turnInTime}\nTurn Out: ${currentTime}\nDuration: ${duration}`,
        [{ text: "OK" }],
      )
    }
  }

  const calculateDuration = (turnInTime, turnOutTime) => {
    if (!turnInTime || !turnOutTime) return "N/A"
    // Simple duration calculation (for demo)
    const turnIn = new Date(`1970/01/01 ${turnInTime}`)
    const turnOut = new Date(`1970/01/01 ${turnOutTime}`)
    const diffMs = turnOut - turnIn
    const diffMins = Math.floor(diffMs / 60000)
    const hours = Math.floor(diffMins / 60)
    const minutes = diffMins % 60
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "ongoing":
        return COLORS.success
      case "upcoming":
        return COLORS.info
      case "completed":
        return COLORS.gray
      case "checked-in":
        return COLORS.warning
      case "missed":
        return COLORS.error
      default:
        return COLORS.textSecondary
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "ongoing":
        return "play-circle-outline"
      case "upcoming":
        return "time-outline"
      case "completed":
        return "checkmark-circle-outline"
      case "checked-in":
        return "log-in-outline"
      case "missed":
        return "close-circle-outline"
      default:
        return "help-circle-outline"
    }
  }

  const renderBiometricStatus = () => (
    <View style={styles.biometricStatusContainer}>
      <View style={styles.biometricStatusHeader}>
        <Ionicons name={getBiometricTypeIcon()} size={30} color={COLORS.primary} />
        <View style={styles.biometricStatusInfo}>
          <Text style={styles.biometricStatusTitle}>Biometric Authentication</Text>
          <Text style={styles.biometricStatusSubtitle}>
            {biometricSupported ? `${getBiometricTypeName()} Available` : "Not Available"}
          </Text>
        </View>
        <View style={[styles.statusIndicator, { backgroundColor: biometricSupported ? COLORS.success : COLORS.error }]}>
          <Ionicons name={biometricSupported ? "checkmark" : "close"} size={16} color={COLORS.white} />
        </View>
      </View>
      {!biometricSupported && (
        <Text style={styles.biometricWarning}>
          Biometric authentication is not available on this device. Please use an alternative method.
        </Text>
      )}
    </View>
  )

  const renderLectureCard = (lecture) => {
    const status = getLectureStatus(lecture)
    const availableActions = getAvailableActions(lecture)
    const existingRecord = attendanceRecords.find((record) => record.lectureId === lecture.id)

    return (
      <View key={lecture.id} style={styles.lectureCard}>
        <View style={styles.lectureHeader}>
          <View style={styles.lectureInfo}>
            <Text style={styles.courseCode}>{lecture.courseCode}</Text>
            <Text style={styles.courseTitle}>{lecture.courseTitle}</Text>
            <Text style={styles.instructor}>👨‍🏫 {lecture.instructor}</Text>
          </View>
          <View style={styles.statusContainer}>
            <Ionicons name={getStatusIcon(status)} size={24} color={getStatusColor(status)} />
            <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
              {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
            </Text>
          </View>
        </View>

        <View style={styles.lectureDetails}>
          <View style={styles.lectureDetailItem}>
            <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.lectureDetailText}>{lecture.timeSlot}</Text>
          </View>
          <View style={styles.lectureDetailItem}>
            <Ionicons name="location-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.lectureDetailText}>{lecture.room}</Text>
          </View>
          <View style={styles.lectureDetailItem}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.lectureDetailText}>
              Attendance: {lecture.attendanceWindow.start} - {lecture.attendanceWindow.end}
            </Text>
          </View>
        </View>

        {existingRecord && (
          <View style={styles.attendanceRecord}>
            <Text style={styles.attendanceRecordTitle}>Today's Record:</Text>
            <View style={styles.attendanceRecordDetails}>
              <Text style={styles.attendanceRecordItem}>Turn In: {existingRecord.turnInTime || "Not marked"}</Text>
              <Text style={styles.attendanceRecordItem}>Turn Out: {existingRecord.turnOutTime || "Not marked"}</Text>
              {existingRecord.turnInTime && existingRecord.turnOutTime && (
                <Text style={styles.attendanceRecordItem}>
                  Duration: {calculateDuration(existingRecord.turnInTime, existingRecord.turnOutTime)}
                </Text>
              )}
            </View>
          </View>
        )}

        <View style={styles.lectureActions}>
          {availableActions.map((action) => (
            <CustomButton
              key={action}
              title={action === "turn-in" ? "🔓 Turn In" : "🔒 Turn Out"}
              onPress={() => handleBiometricAuth(lecture, action)}
              disabled={!canMarkAttendance(lecture) || isAuthenticating}
              loading={isAuthenticating && selectedLecture?.id === lecture.id && attendanceAction === action}
              variant={action === "turn-in" ? "primary" : "secondary"}
              size="medium"
              style={[styles.actionButton, { flex: 1 }]}
            />
          ))}
          {availableActions.length === 0 && (
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
              <Text style={styles.completedText}>Attendance Complete</Text>
            </View>
          )}
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
        <Text style={styles.headerTitle}>Biometric Attendance</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Help",
                "Use your biometric authentication to mark attendance for your lectures. Turn in when you arrive and turn out when you leave.",
              )
            }
          >
            <Ionicons name="help-circle-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderBiometricStatus()}

        <View style={styles.todaySection}>
          <Text style={styles.sectionTitle}>Today's Lectures</Text>
          <Text style={styles.sectionSubtitle}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        {dummyTodayLectures.length > 0 ? (
          dummyTodayLectures.map(renderLectureCard)
        ) : (
          <View style={styles.emptyStateCard}>
            <Ionicons name="calendar-outline" size={60} color={COLORS.grayLight} />
            <Text style={styles.emptyStateTitle}>No Lectures Today</Text>
            <Text style={styles.emptyStateText}>You don't have any lectures scheduled for today.</Text>
          </View>
        )}

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>📋 How it works:</Text>
          <Text style={styles.infoItem}>1. Turn In when you arrive at the lecture (within attendance window)</Text>
          <Text style={styles.infoItem}>2. Turn Out when you leave the lecture</Text>
          <Text style={styles.infoItem}>3. Your attendance duration will be calculated automatically</Text>
          <Text style={styles.infoItem}>4. Minimum attendance duration may be required for marking present</Text>
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
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  biometricStatusContainer: {
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
  biometricStatusHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  biometricStatusInfo: {
    flex: 1,
    marginLeft: 15,
  },
  biometricStatusTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  biometricStatusSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  biometricWarning: {
    fontSize: 14,
    color: COLORS.error,
    marginTop: 15,
    fontStyle: "italic",
  },
  todaySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  lectureCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  lectureHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  lectureInfo: {
    flex: 1,
  },
  courseCode: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  courseTitle: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  instructor: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  statusContainer: {
    alignItems: "center",
    marginLeft: 15,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
    textAlign: "center",
  },
  lectureDetails: {
    marginBottom: 15,
  },
  lectureDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  lectureDetailText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  attendanceRecord: {
    backgroundColor: COLORS.primaryLight + "10",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  attendanceRecordTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  attendanceRecordDetails: {
    gap: 5,
  },
  attendanceRecordItem: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  lectureActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    minHeight: 45,
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.success + "10",
    borderRadius: 10,
    padding: 15,
    flex: 1,
  },
  completedText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.success,
    marginLeft: 8,
  },
  emptyStateCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    padding: 40,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginTop: 15,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  infoSection: {
    backgroundColor: COLORS.info + "10",
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.info,
    marginTop: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.info,
    marginBottom: 12,
  },
  infoItem: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 8,
    paddingLeft: 10,
  },
})

export default BiometricAttendanceScreen
