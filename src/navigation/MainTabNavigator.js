import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "../constants/colors"

// Import your tab screens
import HomeScreen from "../screens/Dashboard/HomeScreen"
import AttendanceScreen from "../screens/Dashboard/AttendanceScreen"
import QuizzesScreen from "../screens/Dashboard/QuizzesScreen"
import StudentMarksScreen from "../screens/Dashboard/StudentMarksScreen"
import DatesheetScreen from "../screens/Dashboard/DatesheetScreen"

const Tab = createBottomTabNavigator()

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Hide header for tab screens
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          height: 60, // Adjust height for better appearance
          paddingBottom: 5, // Padding for icon/label
          paddingTop: 5,
          backgroundColor: COLORS.white,
          borderTopWidth: 0,
          elevation: 10, // Shadow for Android
          shadowColor: COLORS.black, // Shadow for iOS
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "DashboardTab") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "AttendanceTab") {
            iconName = focused ? "calendar" : "calendar-outline"
          } else if (route.name === "QuizzesTab") {
            iconName = focused ? "pencil" : "pencil-outline"
          } else if (route.name === "UploadMarksTab") {
            iconName = focused ? "cloud-upload" : "cloud-upload-outline"
          } else if (route.name === "DatesheetTab") {
            iconName = focused ? "document-text" : "document-text-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
      })}
    >
      <Tab.Screen name="DashboardTab" component={HomeScreen} options={{ title: "Dashboard" }} />
      <Tab.Screen name="AttendanceTab" component={AttendanceScreen} options={{ title: "Attendance" }} />
      <Tab.Screen name="QuizzesTab" component={QuizzesScreen} options={{ title: "Quizzes" }} />
      <Tab.Screen name="UploadMarksTab" component={StudentMarksScreen} options={{ title: "Marks" }} />
      <Tab.Screen name="DatesheetTab" component={DatesheetScreen} options={{ title: "Datesheet" }} />
    </Tab.Navigator>
  )
}

export default MainTabNavigator
