import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "../constants/colors"
import { ROUTES } from "../constants/routes"

const CustomDrawerContent = (props) => {
  const handleLogout = () => {
    // In a real app, you'd clear user session here (e.g., Firebase signOut)
    props.navigation.replace(ROUTES.LOGIN) // Go back to login after logout
  }

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        {/* User Profile Section in Drawer Header */}
        <Image
          source={require("../../assets/images/avatar-placeholder.png")} // Ensure this image exists
          style={styles.userAvatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Student Name</Text>
          <Text style={styles.userEmail}>student@university.edu.pk</Text>
        </View>

        {/* Drawer Menu Items (rendered by default from MainDrawerNavigator) */}
        <DrawerItemList {...props} />

        {/* Custom Drawer Items (secondary options) */}
        <View style={styles.customDrawerItems}>
          <TouchableOpacity style={styles.drawerItem} onPress={() => props.navigation.navigate(ROUTES.CALENDAR)}>
            <Ionicons name="calendar-outline" size={22} color={COLORS.textPrimary} style={styles.drawerIcon} />
            <Text style={styles.drawerItemText}>Academic Calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={() => props.navigation.navigate(ROUTES.NOTIFICATIONS)}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.textPrimary} style={styles.drawerIcon} />
            <Text style={styles.drawerItemText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={() => props.navigation.navigate(ROUTES.HOLIDAYS)}>
            <Ionicons name="gift-outline" size={22} color={COLORS.textPrimary} style={styles.drawerIcon} />
            <Text style={styles.drawerItemText}>Holidays & Events</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={() => props.navigation.navigate(ROUTES.SUPPORT)}>
            <Ionicons name="help-circle-outline" size={22} color={COLORS.textPrimary} style={styles.drawerIcon} />
            <Text style={styles.drawerItemText}>Support</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>

      {/* Logout Button at the bottom of the drawer */}
      <View style={styles.drawerFooter}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={COLORS.error} style={styles.drawerIcon} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerHeader: {
    padding: 20,
    backgroundColor: COLORS.primary,
    flexDirection: "row", // Align items horizontally
    alignItems: "center",
    marginBottom: 10,
  },
  userAvatar: {
    width: 60, // Slightly smaller avatar
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  userInfo: {
    flex: 1, // Allow text to take remaining space
  },
  userName: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  userEmail: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  customDrawerItems: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.grayLight,
    paddingTop: 10,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  drawerIcon: {
    marginRight: 10,
  },
  drawerItemText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.grayLight,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: COLORS.error + "10", // Light red background
    borderRadius: 10,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.error,
  },
})

export default CustomDrawerContent
