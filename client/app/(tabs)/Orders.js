import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [userID, setUserID] = useState(null);
  const [userName, setUserName] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const getOrders = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');
        const username = await AsyncStorage.getItem('userName');
        setUserID(userId);
        setUserName(username);

        console.log('SKJFASBFHBFSJ: ', userID);
        console.log('UNGA NAME : ', userName);


        console.log('TOKEN----> ', token);
        const response = await fetch(`https://2-0-server.vercel.app/${userID}/get-cart`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.message === "No token provided") {
          //setuserId(null);
        }
        setOrders(data.orders || []);
        console.log('ORDERS====> ', data);
      } catch (error) {
        console.log('Error: ', error);
      }
    }

    getOrders();
  }, [userID, setOrders]);

  console.log('22222222: ', userID);

  if (!userID) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Please login to display your orders!</Text>
      </View>
    )
  }

    if (orders.length === 0) {
      return (
        <View style={{ position: "relative", top: "50%"}}>
          <Text style={{ textAlign: "center", fontWeight:"500", fontSize: 16, fontFamily: "Inconsolata" }}>You haven't order any item yet!😔</Text>
        </View>
      )
    }

  return (
    <ScrollView style={styles.container}>
      <View>
        <View style={styles.navbar}>
          <Text style={styles.navbarText}>THANK YOU <Text style={styles.blink}>{userName}</Text> FOR BEING PART OF OUR HOOD.</Text>
        </View>
        <View style={styles.orderdiv}>
          {orders?.map((order) => {
            return (
              <View key={order._id} style={styles.flexcol}>
                <Text style={styles.date}>Ordered at {order.date}</Text>
                <Text style={styles.bill}>TOTAL AMOUNT PAID: ₹{order.totalBill}.00</Text>
                {order?.items?.map((item) => {
                  return (
                    <View style={styles.eachorderdiv} key={item._id}>
                      <View style={styles.rowdiv}>
                        <Image source={{ uri: `https://sociopedia-bucket.s3.us-east-1.amazonaws.com${item.productImagePath}` }} style={styles.proimg} />
                        <View style={styles.coldiv}>
                          <Text style={styles.itemdiv}>Name: {item.productName}</Text>
                          <Text>Quantity: {item.productQuantity} <Text style={{ fontWeight: "700" }}>(Size: {item.productSize})</Text></Text>
                          <Text>Paid: <Text style={{ fontWeight: "700" }}>₹{item.productEntirePrice}.00</Text></Text>
                        </View>
                      </View>
                    </View>
                  )
                })}
              </View>
            )
          })}
        </View>
        <View style={styles.black}>
          <Text style={styles.white}>While we deliver your product, please take a look at our brand new collections!</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    fontSize: 27,
    backgroundColor: "white",
    height: "100%",
    width: "100%",
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
    fontSize: 9,
    fontWeight: "400",
    letterSpacing: 2.9,
    lineHeight: 22,
    textTransform: "uppercase",
    paddingTop: 30,
    textAlign: "center",
  },
  blink: {
    color: "red",
    fontWeight: "700"
  },
  /*order-section*/
  eachorderdiv:{
    marginTop:15
  },
  orderdiv: {
    padding: 15,
    height:"75%",
    width: "100%",
    position: "relative",
    top: "5%",
  },
  rowdiv: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "100%",
  },
  coldiv: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    top: "0%",
    padding: 10
  },
  date: {
    fontSize: 18,
    fontWeight: "600"
  },
  bill: {
    fontSize: 12.6,
    fontWeight: "400",
    letterSpacing: 2.9,
    lineHeight: 22,
    textTransform: "uppercase",
    paddingTop: 10,
    textAlign: "left",
  },
  text: {
    fontWeight: "bold"
  },
  flexcol: {
    display: "flex",
    flexDirection: "column",
    borderColor: "black",
    borderWidth: 1,
    height: "90%",
    padding: 10,
  },
  itemdiv: {
    fontSize: 13,
    width: "100%",
    marginTop: 5
  },
  proimg: {
    height: "65%",
    width: "55%",
    objectFit: "cover",
    borderColor: "black",
    borderWidth: 1,
    padding: 5
  },
  /*black-div*/
  black: {
    backgroundColor: "black",
    padding: 10,
  },
  white: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "400",
    letterSpacing: 2.9,
    lineHeight: 22,
    textTransform: "uppercase",
    textAlign: "center",
  },
  here: {
    color: "red",
    fontWeight: "800",
  }
});

export default Orders;
