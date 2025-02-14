import React, { useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, StatusBar, useColorScheme, TextInput, TouchableOpacity, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Loader from '../../components/Loader.js';

const login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://2-0-server.vercel.app/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
      });

      const data = await response.json(); 

      if (data.message === "Login successfull!") {
        router.push("/Home");
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('userId', data.userID);
        await AsyncStorage.setItem('userName', data.userName);
        setEmail('');
        setPassword('');
        alert(data.message);  
      } else if(data.message==="User does not exists!" || data.message==="Incorrect password!") {
        setPassword('');
        alert(data.message);
      }
      else {
        alert(data.message);
        setEmail('');
        setPassword('');  
      }
      console.log('Userid: ===', data.userID);
      console.log(data);
    } catch (error) {
      console.log('Error: ', error);
      alert('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Loader visible={loading} />
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View>
        <View style={styles.navbar}>
          <Text style={styles.navbarText}>TRUE HOOD</Text>
        </View>

        <View style={styles.loginbox}>
          <Text style={styles.title}>This way, to the hood!</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="grey"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="grey"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} style={styles.registerButton} onPress={() => { console.log("Navigating to Register..."); router.push('/(stack)/Register'); }}>
            <View>
              <Text style={styles.registerText}>
                No account? <Text style={{ fontWeight: "bold", textDecorationLine: "underline" }}>Register</Text>
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>

  )
}

export default login

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: "100%",
    width: "100%",
    margin: 0,
  },
  navbar: {
    alignItems: "center",
    backgroundColor: "black",
    color: "black",
    flexDirection: "row",
    height: 80,
    justifyContent: "center",
    position: "relative",
    top: 0,
    width: "100%",
    zIndex: 1,
  },
  navbarText: {
    color: "white",
    fontSize: 12.6,
    fontWeight: "600",
    letterSpacing: 2.9,
    lineHeight: 22,
    textTransform: "uppercase",
    paddingTop: 20,
    textAlign: "center",
  },
  loginbox: {
    backgroundColor: "#1D1616",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "90%",
    minHeight: 500,
    alignSelf: "center",
    elevation: 5,
    position: "relative",
    top: 100,
    gap: 20
  },
  title: {
    fontFamily: "Inconsolata-Bold",
    fontSize: 20,
    lineHeight: 12,
    padding: 20,
    fontWeight: "800",
    color: "white"
  },
  input: {
    width: "100%",
    height: 45,
    color: "white",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    fontFamily: "Inconsolata",
  },
  loginButton: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderRadius: 8,
    width: "40%",
    alignItems: "center",
  },
  loginText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerButton: {
    padding: 10,
    marginTop: 5,
    minWidth: 150,
    alignItems: 'center'
  },
  registerText: {
    marginTop: 15,
    color: "white",
    fontSize: 14,
  }
})