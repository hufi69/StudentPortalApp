import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "../../constants/colors"
import CustomButton from "../../components/CustomButton"

const { width } = Dimensions.get("window")
const SCREEN_HORIZONTAL_PADDING = 20
const CARD_GAP = 12
const CARD_WIDTH = (width - 2 * SCREEN_HORIZONTAL_PADDING - 2 * CARD_GAP) / 3

const DashboardCard = ({ icon, title, value, gradient, delay = 0 }) => (
  <View style={styles.summaryCard}>
    <LinearGradient
      colors={gradient}
      style={styles.summaryCardGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.summaryCardIconContainer}>
        <Ionicons name={icon} size={28} color={COLORS.white} />
      </View>
      <Text style={styles.summaryCardValue}>{value}</Text>
      <Text style={styles.summaryCardTitle}>{title}</Text>
      <View style={styles.summaryCardGlow} />
    </LinearGradient>
  </View>
)

const UpdateCard = ({ icon, title, date, buttonText, onPress, gradient, delay = 0 }) => (
  <View style={styles.updateCard}>
    <LinearGradient
      colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0.7)"]}
      style={styles.updateCardGradient}
    >
      <View style={styles.updateCardHeader}>
        <LinearGradient
          colors={gradient}
          style={styles.updateIconContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name={icon} size={20} color={COLORS.white} />
        </LinearGradient>
        <View style={styles.updateTextContainer}>
          <Text style={styles.updateTitle}>{title}</Text>
          <Text style={styles.updateDate}>{date}</Text>
        </View>
      </View>
      <CustomButton
        title={buttonText}
        onPress={onPress}
        variant="glass"
        size="small"
        style={styles.updateButton}
      />
    </LinearGradient>
  </View>
)

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets()

  const openDrawer = () => {
    navigation.openDrawer()
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Header Section */}
        <LinearGradient
          colors={COLORS.primaryGradient}
          style={[styles.headerGradient, { paddingTop: insets.top + 20 }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerPattern} />
          
          <View style={styles.headerTopRow}>
            <TouchableOpacity onPress={openDrawer} style={styles.drawerToggle}>
              <LinearGradient
                colors={["rgba(255,255,255,0.2)", "rgba(255,255,255,0.1)"]}
                style={styles.headerButton}
              >
                <Ionicons name="menu-outline" size={24} color={COLORS.white} />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Settings")} style={styles.settingsIcon}>
              <LinearGradient
                colors={["rgba(255,255,255,0.2)", "rgba(255,255,255,0.1)"]}
                style={styles.headerButton}
              >
                <Ionicons name="settings-outline" size={20} color={COLORS.white} />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.headerUserInfo}>
            <LinearGradient
              colors={["rgba(255,255,255,0.25)", "rgba(255,255,255,0.15)"]}
              style={styles.avatarContainer}
            >
              <Ionicons name="person-outline" size={32} color={COLORS.white} />
            </LinearGradient>
            <View style={styles.userTextContainer}>
              <Text style={styles.welcomeText}>Welcome back!</Text>
              <Text style={styles.dashboardSubtitle}>Ready to learn today?</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Main Dashboard Content Area */}
        <View style={styles.mainContentArea}>
          {/* Summary Cards */}
          <Text style={styles.sectionTitle}>Your Overview</Text>
          
          <View style={styles.summaryGrid}>
            <DashboardCard 
              icon="book-outline" 
              title="Courses" 
              value="5" 
              gradient={COLORS.primaryGradient}
              delay={100}
            />
            <DashboardCard 
              icon="checkmark-done-outline" 
              title="Attendance" 
              value="85%" 
              gradient={COLORS.successGradient}
              delay={200}
            />
            <DashboardCard 
              icon="trending-up-outline" 
              title="GPA" 
              value="3.7" 
              gradient={COLORS.accentGradient}
              delay={300}
            />
            <DashboardCard 
              icon="time-outline" 
              title="Quizzes" 
              value="2" 
              gradient={COLORS.warningGradient}
              delay={400}
            />
            <DashboardCard 
              icon="document-text-outline" 
              title="Assignments" 
              value="3" 
              gradient={COLORS.errorGradient}
              delay={500}
            />
            <DashboardCard 
              icon="calendar-outline" 
              title="Exams" 
              value="1" 
              gradient={COLORS.secondaryGradient}
              delay={600}
            />
          </View>

          {/* Recent Updates */}
          <Text style={styles.sectionTitle}>Recent Updates</Text>
          
          <UpdateCard
            icon="pencil-outline"
            title="New Quiz: CS101 - Chapter 3"
            date="Due: July 25, 2025"
            buttonText="Take Quiz"
            onPress={() => navigation.navigate("QuizzesTab")}
            gradient={COLORS.primaryGradient}
            delay={100}
          />
          
          <UpdateCard
            icon="gift-outline"
            title="Holiday: Eid-ul-Adha"
            date="July 17-19, 2025"
            buttonText="View Details"
            onPress={() => navigation.navigate("Holidays")}
            gradient={COLORS.secondaryGradient}
            delay={200}
          />

          {/* Quick Access */}
          <Text style={styles.sectionTitle}>Quick Access</Text>
          
          <View style={styles.quickAccessGrid}>
            <CustomButton
              title="View Grades"
              onPress={() => navigation.navigate("UploadMarksTab")}
              variant="glass"
              size="small"
              style={styles.quickAccessButton}
            />
            <CustomButton
              title="Course Registration"
              onPress={() => navigation.navigate("CourseRegistration")}
              variant="glass"
              size="small"
              style={styles.quickAccessButton}
            />
            <CustomButton
              title="Exam Scanner"
              onPress={() => navigation.navigate("ExamScanner")}
              variant="glass"
              size="small"
              style={styles.quickAccessButton}
            />
            <CustomButton
              title="Biometric Attendance"
              onPress={() => navigation.navigate("BiometricAttendance")}
              variant="glass"
              size="small"
              style={styles.quickAccessButton}
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
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 20,
    position: "relative",
    overflow: "hidden",
  },
  headerPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    backgroundColor: "transparent",
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  drawerToggle: {
    // No additional styles needed
  },
  settingsIcon: {
    // No additional styles needed
  },
  headerUserInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  userTextContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  dashboardSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.85)",
    marginTop: 4,
    fontWeight: "500",
  },
  mainContentArea: {
    paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 16,
    marginTop: 8,
    letterSpacing: -0.3,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  summaryCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.1,
    marginBottom: CARD_GAP,
    borderRadius: 20,
    overflow: "hidden",
  },
  summaryCardGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    position: "relative",
  },
  summaryCardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryCardValue: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.white,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  summaryCardTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.white,
    textAlign: "center",
    opacity: 0.9,
    letterSpacing: 0.2,
  },
  summaryCardGlow: {
    position: "absolute",
    top: -20,
    right: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  updateCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: COLORS.shadowMedium,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  updateCardGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  updateCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  updateIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  updateTextContainer: {
    flex: 1,
  },
  updateTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  updateDate: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  updateButton: {
    alignSelf: "flex-end",
    minWidth: 100,
  },
  quickAccessGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  quickAccessButton: {
    width: "48%",
    marginBottom: 12,
    backgroundColor: COLORS.glassBg,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    shadowColor: COLORS.shadowLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
})