import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./app/Home";
import Orders from './app/orders';
import Products from "./app/Products";
import ProductDetail from './app/ProductDetail';
import { StatusBar } from "react-native";

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator 
    initialRouteName="Home"  
    screenOptions={{ 
      headerShown: false,
      contentStyle: { backgroundColor: 'white' }  // Use contentStyle instead of cardStyle
    }}
  >
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Products" component={Products} />  
    <Stack.Screen 
      name="ProductDetail" 
      component={ProductDetail}
      options={{
        headerShown: true,
        title: "Product Detail"  // Use 'title' instead of 'headerTitle'
      }}
    />
    <Stack.Screen name="Orders" component={Orders} />
  </Stack.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <AppNavigator />
    </NavigationContainer>
  );
}
