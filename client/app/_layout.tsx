import React from "react";
import { Entypo, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";

export default function Layout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: styles.tab }}>
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ size, color }) => <Entypo name="home" size={size} color={color} />,
        }}
      />

      {/* Login Tab */}
      <Tabs.Screen
        name="login"
        options={{
          title: "Login",
          tabBarIcon: ({ size, color }) => <MaterialIcons name="login" size={size} color={color} />,
        }}
      />

      {/* Cart Tab */}
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ size, color }) => <FontAwesome5 name="shopping-cart" size={size} color={color} />,
        }}
      />

      {/* Orders Tab */}
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ size, color }) => <MaterialIcons name="receipt" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}


const styles=StyleSheet.create({
  tab:{
    backgroundColor:"black"
  }
})