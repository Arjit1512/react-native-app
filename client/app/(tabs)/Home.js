import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Button, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import SplashScreen from "../../components/SplashScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useFonts } from 'expo-font';
import Loader from '../../components/Loader.js';

const Home = () => {
  const [showSplash, setShowSplash] = useState(true);
  const navigation = useNavigation();
  const router = useRouter();
  const testimonials = [
    { image: require("../../assets/sources/athlete.jpg") },
    { image: require("../../assets/sources/pic1.png") },
  ];
  const [index, setIndex] = useState(0);
  let [fontsLoaded] = useFonts({
    "Inconsolata": require("../../assets/fonts/Inconsolata_400Regular.ttf"),
    "Inconsolata-Bold": require("../../assets/fonts/Inconsolata_700Bold.ttf"),
    "SpaceMono-Regular": require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });



  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      setTimeout(() => {
        setShowSplash(false);
      }, 2000);
    } catch (error) {
      console.error("Error checking first launch:", error);
      setShowSplash(false);
    }
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <ScrollView style={styles.container}>
      <View>
        <View style={styles.navbar}>
          <Text style={styles.navbarText}>WE THE INDEPENDENT</Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            console.log("Navigating to Products...");
            router.push('/Products');
          }}
        >
          <View style={styles.card}>
            <Image source={testimonials[index].image} style={styles.image} />
          </View>
        </TouchableOpacity>

        {/* Testimonial Section */}
        <View style={styles.typist}>
          <Image source={require("../../assets/sources/ts.jpg")} style={{ width: 160, height: 160 }} />
          <Text style={styles.typewriter}>
            " We sincerely promise that our exclusive t-shirt designs, crafted with the finest fabrics and the latest trends, will not only match your style but also leave you absolutely impressed with their comfort and uniqueness. Experience the perfect blend of fashion and quality like never before! "
          </Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <Image source={require("../../assets/sources/hof.jpg")} style={{ width: "100%", height: 300}} />
          {/* <Text style={[styles.typewriter,{backgroundColor:"black",color:"white",position:"relative",bottom:"45%",left:"25%",lineHeight:20,fontSize:14,textAlign:"center"}]}>
            Currently we dont have a content to paste here!
          </Text> */}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: "100%",
    width: "100%",
  },
  navbar: {
    alignItems: "center",
    backgroundColor: "#000",
    flexDirection: "row",
    height: Platform.OS === 'ios' ? 80 : 60,
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
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    textAlign: "center",
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
  typist: {
    position: "relative",
    top: Platform.OS === 'ios' ? 10 : 0,
    width: "100%",
    zIndex: 1,
    flexDirection: "row",
    backgroundColor:"white"
  },
  typewriter: {
    fontFamily: "Inconsolata",
    fontSize: 9,
    lineHeight: 12,
    width: "50%",
    marginTop: 30
  },
});

export default Home;
