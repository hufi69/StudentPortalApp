import { StatusBar } from "expo-status-bar"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"

import LoginScreen from "./src/screens/Auth/LoginScreen"
import SignupScreen from "./src/screens/Auth/SignupScreen"
import MainDrawerNavigator from "./src/navigation/MainDrawerNavigator" // New import for Drawer Navigator
import { ROUTES } from "./src/constants/routes"

const Stack = createStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName={ROUTES.LOGIN}
        screenOptions={{
          headerShown: false, // Hide the header for all screens in this stack
        }}
      >
        <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
        <Stack.Screen name={ROUTES.SIGNUP} component={SignupScreen} />
        {/* Once logged in, navigate to the MainDrawerNavigator */}
        <Stack.Screen name={ROUTES.MAIN_DRAWER} component={MainDrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
