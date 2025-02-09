import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./app/Home";
import Orders from "./app/Orders";
import Products from "./app/screens/Products";
import { StatusBar } from "react-native";
import { MyProvider } from "./components/Context";

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Orders" component={Orders} />
    <Stack.Screen 
      name="Products" 
      component={Products}
      options={{ 
        title: "Products", 
        presentation: "modal" 
      }} 
    />
  </Stack.Navigator>
);

export default function App() {
  return (
    <MyProvider>
      <StatusBar hidden={false} barStyle="dark-content" />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </MyProvider>
  );
}