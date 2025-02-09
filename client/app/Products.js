import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, StatusBar, useColorScheme } from "react-native";
import Clothes from "../constants/clothes";
import { SafeAreaView } from "react-native-safe-area-context";

const Products = () => {
  const clothes = Clothes;
  const theme = useColorScheme(); // Detect system theme (light or dark)

  return (
     

      <ScrollView>
        <View style={styles.navbar}>
          <Text style={styles.navbarText}>OUR COLLECTIONS</Text>
        </View>

        <View style={styles.closet}>
          {clothes.map((item) => (
            <View key={item.id}>
              <Image source={item.imgURL} style={styles.cloth} />
              <Text style={styles.ots}>Oversized T-Shirt</Text>
              <Text>{item.name}</Text>
              <Text>₹{item.price}.00</Text>
            </View>
          ))}
        </View>
      </ScrollView>
  );
};

export default Products;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: "100%",
    width: "100%",
    margin: 0,
  },
  navbar: {
    alignItems: "center",
    backgroundColor: "#000",
    flexDirection: "row",
    height: 80,
    justifyContent: "center",
    position: "relative",
    top: 0,
    width: "100%",
    zIndex: 1,
  },
  navbarText: {
    color: "#fff",
    fontSize: 12.6,
    fontWeight: "400",
    letterSpacing: 2.9,
    lineHeight: 22,
    textTransform: "uppercase",
    paddingTop: 20,
    textAlign: "center",
  },
  closet: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "white",
  },
  cloth: {
    height: 300,
    width: 350,
    objectFit: "cover",
  },
  ots: {
    color: "grey",
    fontSize: 8.6,
    fontWeight: "400",
    letterSpacing: 2.9,
    lineHeight: 22,
    textTransform: "uppercase",
    paddingTop: 30,
  },
});
