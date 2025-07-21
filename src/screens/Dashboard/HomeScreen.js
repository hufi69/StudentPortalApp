import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "../../constants/colors"
import CustomButton from "../../components/CustomButton"

const { width } = Dimensions.get("window")
const SCREEN_HORIZONTAL_PADDING = 20 // Padding of mainContentArea
const CARD_GAP = 10 // Gap between cards

// Calculate card width for 3 columns: (total available width - total gap width) / number of cards
const CARD_WIDTH = (width - 2 * SCREEN_HORIZONTAL_PADDING - 2 * CARD_GAP) / 3

const DashboardCard = ({ icon, title, value, color }) => (
  <View style={[styles.summaryCard, { backgroundColor: color }]}>
    <Ionicons name={icon} size={28} color={COLORS.white} />
    <Text style={styles.summaryCardValue}>{value}</Text>
    <Text style={styles.summaryCardTitle}>{title}</Text>
  </View>
)

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets() // Hook to get safe area insets

  const openDrawer = () => {
    navigation.openDrawer()
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryLight]}
          style={[styles.headerGradient, { paddingTop: insets.top + 20 }]} // Adjust padding dynamically
        >
          <View style={styles.headerTopRow}>
            {/* Drawer Toggle Button */}
            <TouchableOpacity onPress={openDrawer} style={styles.drawerToggle}>
              <Ionicons name="menu-outline" size={30} color={COLORS.white} />
            </TouchableOpacity>

            {/* Settings Icon */}
            <TouchableOpacity onPress={() => navigation.navigate("Settings")} style={styles.settingsIcon}>
              <Ionicons name="settings-outline" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.headerUserInfo}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person-circle-outline" size={60} color={COLORS.white} />
            </View>
            <View>
              <Text style={styles.welcomeText}>Welcome, Student!</Text>
              <Text style={styles.dashboardSubtitle}>Your academic journey starts here.</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Main Dashboard Content Area */}
        <View style={styles.mainContentArea}>
          {/* Summary Cards */}
          <Text style={styles.sectionTitle}>Your Overview</Text>
          <View style={styles.summaryGrid}>
            <DashboardCard icon="book-outline" title="Courses Enrolled" value="5" color={COLORS.primaryDark} />
            <DashboardCard icon="checkmark-done-outline" title="Attendance Rate" value="85%" color={COLORS.success} />
            <DashboardCard icon="trending-up-outline" title="Current GPA" value="3.7" color={COLORS.info} />
            <DashboardCard icon="hourglass-outline" title="Upcoming Quizzes" value="2" color={COLORS.secondaryDark} />
            <DashboardCard icon="document-text-outline" title="Assignments Due" value="3" color={COLORS.error} />
            <DashboardCard icon="calendar-outline" title="Exams Soon" value="1" color={COLORS.primary} />
          </View>

          {/* Recent Updates */}
          <Text style={styles.sectionTitle}>Recent Updates</Text>
          <View style={styles.updateCard}>
            <View style={styles.updateCardHeader}>
              <Ionicons name="pencil-outline" size={24} color={COLORS.primary} />
              <Text style={styles.updateTitle}>New Quiz Posted: CS101 - Chapter 3</Text>
            </View>
            <Text style={styles.updateDate}>Due: July 25, 2025</Text>
            <CustomButton
              title="Go to Quizzes"
              onPress={() => navigation.navigate("QuizzesTab")}
              variant="outline"
              size="small"
              style={styles.updateButton}
            />
          </View>
          <View style={styles.updateCard}>
            <View style={styles.updateCardHeader}>
              <Ionicons name="gift-outline" size={24} color={COLORS.secondaryDark} />
              <Text style={styles.updateTitle}>Holiday Announcement: Eid-ul-Adha</Text>
            </View>
            <Text style={styles.updateDate}>July 17-19, 2025</Text>
            <CustomButton
              title="View Holidays"
              onPress={() => navigation.navigate("Holidays")}
              variant="outline"
              size="small"
              style={styles.updateButton}
            />
          </View>

          {/* Quick Access */}
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickAccessGrid}>
            <CustomButton
              title="View Grades"
              onPress={() => navigation.navigate("UploadMarksTab")}
              variant="secondary"
              size="small"
              style={styles.quickAccessButton}
              textStyle={styles.quickAccessButtonText} // Explicitly set text color
            />
            <CustomButton
              title="Course Registration"
              onPress={() => navigation.navigate("CourseRegistration")}
              variant="secondary"
              size="small"
              style={styles.quickAccessButton}
              textStyle={styles.quickAccessButtonText} // Explicitly set text color
            />
            <CustomButton
              title="Exam Entry Scan"
              onPress={() => navigation.navigate("ExamScanner")} // New button
              variant="secondary"
              size="small"
              style={styles.quickAccessButton}
              textStyle={styles.quickAccessButtonText} // Explicitly set text color
            />
            <CustomButton
              title="Biometric Attendance"
              onPress={() => navigation.navigate("BiometricAttendance")}
              variant="secondary"
              size="small"
              style={styles.quickAccessButton}
              textStyle={styles.quickAccessButtonText}
            />
            <CustomButton
              title="Contact Faculty"
              onPress={() => console.log("Contact Faculty")}
              variant="secondary"
              size="small"
              style={styles.quickAccessButton}
              textStyle={styles.quickAccessButtonText} // Explicitly set text color
            />
          </View>
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
    flexGrow: 1,
    paddingBottom: 20,
  },
  headerGradient: {
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20, // Space between top row and user info
  },
  drawerToggle: {
    padding: 5,
  },
  settingsIcon: {
    padding: 5,
  },
  headerUserInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10, // Indent user info slightly
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.white,
  },
  dashboardSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  mainContentArea: {
    paddingHorizontal: SCREEN_HORIZONTAL_PADDING, // Use constant for padding
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 15,
    marginTop: 10,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", // Distribute items evenly
    marginBottom: 20,
  },
  summaryCard: {
    width: CARD_WIDTH, // Calculated width for 3 cards per row
    height: CARD_WIDTH, // Make cards square
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: CARD_GAP, // Vertical margin between rows
    padding: 10, // Reduced padding
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  summaryCardValue: {
    fontSize: 28, // Slightly smaller font
    fontWeight: "bold",
    color: COLORS.white,
    marginTop: 8, // Reduced margin
  },
  summaryCardTitle: {
    fontSize: 12, // Slightly smaller font
    fontWeight: "600",
    color: COLORS.white,
    textAlign: "center",
    marginTop: 4, // Reduced margin
  },
  updateCard: {
    backgroundColor: COLORS.surface, // Use new surface color
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  updateCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  updateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginLeft: 10,
    flexShrink: 1,
  },
  updateDate: {
    fontSize: 12,
    color: COLORS.gray,
    marginLeft: 34, // Align with title text
  },
  updateButton: {
    alignSelf: "flex-end", // Push button to the right
    marginTop: 10,
  },
  quickAccessGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  quickAccessButton: {
    width: "48%", // Two buttons per row
    marginBottom: 10,
    backgroundColor: COLORS.surface, // Apply surface color (white)
    shadowColor: COLORS.black, // Add shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
    borderRadius: 12, // Ensure consistent border radius
  },
  quickAccessButtonText: {
    color: COLORS.textPrimary, // Explicitly set text color to dark for visibility
  },
})

export default HomeScreen
