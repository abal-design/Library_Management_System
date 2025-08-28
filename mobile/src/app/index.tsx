import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./Auth/Login";

import Book from "./Auth/Book";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Book: { user: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
   
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Book" component={Book} />
      </Stack.Navigator>
   
  );
};

export default App;
