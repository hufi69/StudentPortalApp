import { createDrawerNavigator } from "@react-navigation/drawer"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "../constants/colors"
import { ROUTES } from "../constants/routes"

// Import your custom drawer content
import CustomDrawerContent from "../components/CustomDrawerContent"

// Import the main tab navigator
import MainTabNavigator from "./MainTabNavigator"

// Import other screens that might be directly accessible from the drawer
import ProfileScreen from "../screens/Dashboard/ProfileScreen"
import SettingsScreen from "../screens/SettingsScreen"
import TranscriptScreen from "../screens/Dashboard/TranscriptScreen"
import AcademicCalendarScreen from "../screens/AcademicCalendarScreen"
import NotificationsScreen from "../screens/NotificationsScreen"
import HolidaysScreen from "../screens/HolidaysScreen"
import SupportScreen from "../screens/SupportScreen"
import CourseRegistrationScreen from "../screens/CourseRegistrationScreen"
import ExamEntryScannerScreen from "../screens/ExamEntryScannerScreen"
import FeeTranscriptScreen from "../screens/FeeTranscriptScreen"
import TestQrGeneratorScreen from "../screens/TestQrGeneratorScreen" // Add this import
import FaceAttendanceScreen from "../screens/FaceAttendanceScreen"
// Add the import at the top
import BiometricAttendanceScreen from "../screens/BiometricAttendanceScreen"

const Drawer = createDrawerNavigator()

const MainDrawerNavigator = () => {
  // Debug: Log all routes to check for undefined values
  console.log("ROUTES object:", ROUTES)

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false, // Hide default header for drawer screens
        drawerActiveBackgroundColor: COLORS.primaryLight + "20", // Light transparent primary
        drawerActiveTintColor: COLORS.primary,
        drawerInactiveTintColor: COLORS.textPrimary,
        drawerLabelStyle: {
          marginLeft: -20, // Adjust icon spacing
          fontSize: 16,
          fontWeight: "600",
        },
      }}
    >
      {/* The MainTabNavigator will be the primary screen inside the drawer */}
      <Drawer.Screen
        name="MainTabs" // Use string literal instead of ROUTES.MAIN_TABS temporarily
        component={MainTabNavigator}
        options={{
          title: "Home", // This title will appear in the drawer menu
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      {/* Other screens directly accessible from the drawer */}
      <Drawer.Screen
        name="Profile" // Use string literal
        component={ProfileScreen}
        options={{
          title: "My Profile",
          drawerIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Settings" // Use string literal
        component={SettingsScreen}
        options={{
          title: "Settings",
          drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Transcript" // Use string literal
        component={TranscriptScreen}
        options={{
          title: "Academic Transcript",
          drawerIcon: ({ color, size }) => <Ionicons name="document-text-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="FeeTranscript" // Use string literal
        component={FeeTranscriptScreen}
        options={{
          title: "Fee Transcript",
          drawerIcon: ({ color, size }) => <Ionicons name="wallet-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="CourseRegistration" // Use string literal
        component={CourseRegistrationScreen}
        options={{
          title: "Course Registration",
          drawerIcon: ({ color, size }) => <Ionicons name="add-circle-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="ExamScanner" // Use string literal
        component={ExamEntryScannerScreen}
        options={{
          title: "Exam Entry Scanner",
          drawerIcon: ({ color, size }) => <Ionicons name="qr-code-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="TestQrGenerator" // Use string literal
        component={TestQrGeneratorScreen}
        options={{
          title: "Test QR Generator",
          drawerIcon: ({ color, size }) => <Ionicons name="create-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Calendar" // Use string literal
        component={AcademicCalendarScreen}
        options={{
          title: "Academic Calendar",
          drawerIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Notifications" // Use string literal
        component={NotificationsScreen}
        options={{
          title: "Notifications",
          drawerIcon: ({ color, size }) => <Ionicons name="notifications-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Holidays" // Use string literal
        component={HolidaysScreen}
        options={{
          title: "Holidays & Events",
          drawerIcon: ({ color, size }) => <Ionicons name="gift-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Support" // Use string literal
        component={SupportScreen}
        options={{
          title: "Support",
          drawerIcon: ({ color, size }) => <Ionicons name="help-circle-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="FaceAttendance" // Use string literal
        component={FaceAttendanceScreen}
        options={{
          title: "Face Attendance",
          drawerIcon: ({ color, size }) => <Ionicons name="happy-outline" size={size} color={color} />,
        }}
      />
      {/* Add the screen in the Drawer.Navigator, after FaceAttendance */}
      <Drawer.Screen
        name="BiometricAttendance" // Use string literal
        component={BiometricAttendanceScreen}
        options={{
          title: "Biometric Attendance",
          drawerIcon: ({ color, size }) => <Ionicons name="finger-print-outline" size={size} color={color} />,
        }}
      />
    </Drawer.Navigator>
  )
}

export default MainDrawerNavigator
