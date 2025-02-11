import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [userID, setUserID] = useState(null);


  useEffect(() => {
    const getOrders = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');
        setUserID(userId);

        console.log('SKJFASBFHBFSJ: ', userID);

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
  }, [userID]);

  console.log('22222222: ', userID);

  if (!userID) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Please login to display your orders!</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
        {orders?.map((order) => {
          return (
            <View key={order._id} style={styles.flexcol}>
              <Text>{order.date}</Text>
              <Text>Your Bill: ₹{order.totalBill}.00</Text>
              {order?.items?.map((item) => {
                return(
                <View style={styles.itemdiv} key={item._id}>
                  <Text style={styles.itemdiv}>{item.productName}</Text>
                  <Text>No: {item.productQuantity}</Text>
                  <Text>₹{item.productEntirePrice}.00</Text>
                  <Image source={{ uri: `https://sociopedia-bucket.s3.us-east-1.amazonaws.com${item.productImagePath}` }} style={styles.proimg} />
                </View>
                )
              })}
            </View>
          )
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    fontSize: 27,
    backgroundColor: "white",
    marginTop: 20,
    height: "100%",
    width: "100%",
  },
  text: {
    fontWeight: "bold"
  },
  flexcol: {
    display: "flex",
    flexDirection: "column"
  },
  itemdiv:{
    fontSize:40,
    width:"100%"
  },
  proimg: {
    height: "60%",
    width: "70%",
    objectFit: "cover"
  }
});

export default Orders;
