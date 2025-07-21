import { StatusBar } from "expo-status-bar"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"

import LoginScreen from "./src/screens/Auth/LoginScreen"
import { ROUTES } from "./src/constants/routes"

const Stack = createStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName={ROUTES.LOGIN}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
