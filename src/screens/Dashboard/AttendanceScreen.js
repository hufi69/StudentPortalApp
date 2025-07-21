import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "../../constants/colors"

const { width } = Dimensions.get("window")
const CARD_WIDTH = (width - 48) / 2 // 24 padding on each side, 24 for gap

// Dummy data for demonstration
const dummyAttendanceData = [
  { date: "Jul 15", status: "Present", percentage: 90 },
  { date: "Jul 14", status: "Present", percentage: 90 },
  { date: "Jul 13", status: "Absent", percentage: 80 },
  { date: "Jul 12", status: "Present", percentage: 90 },
  { date: "Jul 11", status: "Present", percentage: 90 },
  { date: "Jul 10", status: "Present", percentage: 90 },
  { date: "Jul 09", status: "Present", percentage: 90 },
]

const AttendanceScreen = () => {
  const overallAttendance = 88 // Dummy overall percentage

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Your Attendance</Text>

        {/* Overall Attendance Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Ionicons name="checkmark-circle-outline" size={28} color={COLORS.primary} />
            <Text style={styles.summaryTitle}>Overall Attendance</Text>
          </View>
          <Text style={styles.percentageText}>{overallAttendance}%</Text>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${overallAttendance}%` }]} />
          </View>
          <Text style={styles.summarySubtitle}>Keep up the good work!</Text>
        </View>

        {/* Recent Attendance Chart (Simulated Bar Chart) */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Last 7 Days Attendance</Text>
          <View style={styles.barChartContainer}>
            {dummyAttendanceData.map((data, index) => (
              <View key={index} style={styles.barColumn}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: data.percentage * 0.8, // Scale height for visual representation
                      backgroundColor: data.status === "Present" ? COLORS.success : COLORS.error,
                    },
                  ]}
                />
                <Text style={styles.barLabel}>{data.date}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Detailed Attendance Records */}
        <Text style={styles.sectionTitle}>Detailed Records</Text>
        <View style={styles.recordsCard}>
          {dummyAttendanceData.map((record, index) => (
            <View key={index} style={styles.recordItem}>
              <Ionicons
                name={record.status === "Present" ? "checkmark-circle" : "close-circle"}
                size={20}
                color={record.status === "Present" ? COLORS.success : COLORS.error}
              />
              <Text style={styles.recordDate}>{record.date}</Text>
              <Text
                style={[styles.recordStatus, { color: record.status === "Present" ? COLORS.success : COLORS.error }]}
              >
                {record.status}
              </Text>
            </View>
          ))}
          <Text style={styles.viewAllText}>View Full Attendance History</Text>
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
  scrollContent: {
    padding: 24,
    paddingBottom: 80, // Add extra padding for bottom tab bar
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 20,
    textAlign: "center",
  },
  summaryCard: {
    backgroundColor: COLORS.surface, // Use new surface color
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginLeft: 10,
  },
  percentageText: {
    fontSize: 48,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  progressBarBackground: {
    width: "100%",
    height: 10,
    backgroundColor: COLORS.grayLight,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.success,
    borderRadius: 5,
  },
  summarySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 15,
    marginTop: 10,
  },
  chartCard: {
    backgroundColor: COLORS.surface, // Use new surface color
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 15,
    textAlign: "center",
  },
  barChartContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 100, // Fixed height for the chart area
    paddingHorizontal: 10,
  },
  barColumn: {
    alignItems: "center",
  },
  bar: {
    width: 20,
    borderRadius: 5,
    marginBottom: 5,
  },
  barLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  recordsCard: {
    backgroundColor: COLORS.surface, // Use new surface color
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  recordItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  recordDate: {
    fontSize: 15,
    color: COLORS.textPrimary,
    marginLeft: 10,
    flex: 1,
  },
  recordStatus: {
    fontSize: 15,
    fontWeight: "600",
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
    marginTop: 15,
    textAlign: "center",
  },
})

export default AttendanceScreen
