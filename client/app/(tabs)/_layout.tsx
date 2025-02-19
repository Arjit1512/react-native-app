import React from "react";
import { Entypo, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tab,
      tabBarActiveTintColor: 'white',
      tabBarInactiveTintColor: 'gray'
    }}>
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          tabBarIcon: ({ size, color }) => <Entypo name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: "Login",
          tabBarIcon: ({ size, color }) => <MaterialIcons name="login" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Products"
        options={{
          title: "Products",
          tabBarIcon: ({ size, color }) => <MaterialIcons name="storefront" size={size} color={color} />,
        }}
      />



      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ size, color }) => <FontAwesome5 name="shopping-cart" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ size, color }) => <FontAwesome5 name="user" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tab: {
    backgroundColor: "black"
  }
});