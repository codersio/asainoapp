import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./pages/dashboard";
import LoginScreen from "./pages/login";
import WelcomeScreen from "./pages/login/welcomescreen";
import CalendarScreen from "./pages/task";
import BookingSummary from "./pages/task/singletask";
import BookingMapView from "./pages/task/mapview";

const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        // App Stack for authenticated users
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
          <Stack.Screen name="BookingSummary" component={BookingSummary} />
          <Stack.Screen name="BookingMapView" component={BookingMapView} />
        </Stack.Navigator>
      ) : (
        // Auth Stack for unauthenticated users
        <Stack.Navigator>
          <Stack.Screen name="Welcome">
            {(props) => <WelcomeScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
          </Stack.Screen>
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default App;
