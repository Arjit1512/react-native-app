import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, StatusBar, useColorScheme, Platform } from "react-native";
import Clothes from "../../constants/clothes";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const Products = () => {
  const clothes = Clothes;
  const theme = useColorScheme();
  const router = useRouter();

  const handlePress = (item) => {
    try {
      // Pass individual properties instead of the whole object
      router.push({
        pathname: "/(stack)/ProductDetail",
        params: {
          id: item.id.toString(), // Convert to string as router params should be strings
          name: item.name,
          price: item.price.toString(),
          imgURL: JSON.stringify(item.imgURL), // Convert require() object to string
          altURL: JSON.stringify(item.altURL),
          description: item.description || ""
        }
      });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.navbar}>
          <Text style={styles.navbarText}>OUR COLLECTIONS</Text>
        </View>

        <View style={styles.closet}>
          {clothes.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handlePress(item)}
              style={styles.productContainer}
            >
              <Image source={item.imgURL} style={styles.cloth} />
              <Text style={styles.ots}>Oversized T-Shirt</Text>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>₹{item.price}.00</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
    height: Platform.OS === 'ios' ? 60 : 60,
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
    paddingTop: Platform.OS === 'ios' ? 0 : 0,
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
  productName: {
    fontFamily: "Inconsolata-Bold",
    fontSize: 17,
  },
  ots: {
    color: "grey",
    fontSize: 8.6,
    fontWeight: "400",
    letterSpacing: 2.9,
    lineHeight: 22,
    textTransform: "uppercase",
  },
});

export default Products;