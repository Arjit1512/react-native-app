import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ScrollView,Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import SplashScreen from "../components/SplashScreen";


const Home = () => {
  const [showSplash, setShowSplash] = useState(true);
  const navigation = useNavigation();

  const testimonials = [
    {
      image: require("../assets/sources/athlete.jpg"),
    },
    {
      image: require("../assets/sources/pic1.png"),
    },
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Switch every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setShowSplash(true); // Show splash every time the user navigates to Home
      setTimeout(() => {
        setShowSplash(false);
      }, 1000);
    });

    return unsubscribe; // Cleanup listener
  }, [navigation]);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <ScrollView style={styles.container}>
      <View>
        <View style={styles.navbar}>
          <Text style={styles.navbarText}>WE THE INDEPENDENT</Text>
        </View>


        <Button
            title="Go to Products"
            onPress={() => navigation.navigate("Orders")}
        />
        <TouchableOpacity onPress={() => {
          console.log("Navigating to Products...");
          navigation.navigate("Products");
        }}>
          <View style={styles.card}>
            <Image source={testimonials[index].image} style={styles.image} />
          </View>
        </TouchableOpacity>


        <View style={styles.typist}>
          <Image source={require("../assets/sources/ts.jpg")} style={{ width: 160, height: 160 }} />
          <Text style={styles.typewriter}>" We sincerely promise that our exclusive t-shirt designs, crafted with the finest fabrics and the latest trends, will not only match your style but also
            leave you absolutely impressed with their comfort and uniqueness. Experience the perfect blend of fashion and quality like never before! "</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: "100%",
    width: "100%"
  },
  video: {
    width: "100%",
    height: 300,
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
    fontFamily: "Aeonik Fono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
    fontSize: 12.6,
    fontWeight: "400",
    letterSpacing: 2.9,
    lineHeight: 22,
    textTransform: "uppercase",
    paddingTop: 30,
    textAlign: "center",
  },
  /*testimonial-section*/
  homeimg: {
    width: "100%",
    height: 220
  },
  container1: {
    alignItems: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 220,
  },
  /*discover-section*/
  discover: {
    backgroundColor: "black",
  },
  dh: {
    color: "white",
    width: 170,
    color: "#fff",
    fontFamily: "Aeonik Fono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
    fontSize: 15,
    fontWeight: "400",
    letterSpacing: 2.9,
    lineHeight: 32,
    paddingTop: 30,
  },
  dp: {

  },
  /*travis-section*/
  typist: {
    position: "relative",
    top: 20,
    width: "100%",
    zIndex: 1,
    display: "flex",
    flexDirection: "row",
    width: "100%"
  },
  typewriter: {
    fontFamily: "Inconsolata, monospace",
    fontSize: 8,
    lineHeight: 10,
  },

});

export default Home;
