import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Platform } from "react-native";
import { useNavigation, useFocusEffect} from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import moment from 'moment-timezone';
import { useLocalSearchParams, useRouter } from "expo-router";
import { Icon } from "react-native-elements";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [userID, setUserID] = useState(null);
  const [userName, setUserName] = useState('');
  const router = useRouter();
  
  // More explicit conversion to IST
  const formatDateToIST = (utcDateString) => {
    return moment(utcDateString).tz('Asia/Kolkata').format('D MMM YYYY, h:mm A');
  };
  
  useFocusEffect(
    React.useCallback(() => {
      const getOrders = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          const userId = await AsyncStorage.getItem('userId');
          const username = await AsyncStorage.getItem('userName');
          
          
          setUserID(userId);
          setUserName(username);

          const response = await fetch(`https://2-0-server.vercel.app/${userID}/get-cart`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          const data = await response.json();
          if (data.message === "No token provided") {
            //setuserId(null);
          }
          // Sort by date (newest first)
          const sortedOrders = [...data.orders].sort((a, b) => new Date(b.date) - new Date(a.date));
          setOrders(sortedOrders || []);
        } catch (error) {
          console.log('Error: ', error);
        }
      }

      getOrders();
    }, [userID, setOrders])
  );

  //console.log('22222222: ', userID);

  if (!userID) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Please login to display your orders!</Text>
      </View>
    )
  }

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>You haven't order any item yet!😔</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.mainContainer}>
      <View>
        <View style={styles.navbar}>
          <Text style={styles.navbarText}>THANK YOU <Text style={styles.blink}>{userName}</Text> FOR BEING PART OF OUR HOOD.</Text>
        </View>
        <View style={styles.orderdiv}>
          {orders?.map((order) => {
            return (
              <View key={order._id} style={[styles.flexcol, { height: order.length * 100 }]}>
                <Text style={styles.date}>
                  Ordered at {formatDateToIST(order.date)}
                </Text>
                <Text style={styles.bill}>TOTAL AMOUNT PAID: ₹{order.totalBill}.00</Text>
                {order?.items?.map((item) => {
                  return (
                    <View style={styles.eachorderdiv} key={item._id}>
                      <View style={styles.rowdiv}>
                        <Image source={{ uri: `https://sociopedia-bucket.s3.us-east-1.amazonaws.com${item.productImagePath}` }} style={styles.proimg} />
                        <View style={styles.coldiv}>
                          <Text style={styles.itemdiv}>Name: {item.productName}</Text>
                          <Text style={styles.pq}>Quantity: {item.productQuantity} <Text style={{ fontWeight: "700" }}>(Size: {item.productSize})</Text></Text>
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

        <TouchableOpacity style={styles.btn} onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: 16,
    fontFamily: "Inconsolata"
  },
  navbar: {
    backgroundColor: "#000",
    height: Platform.OS === 'ios' ? 80 : 60,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  navbarText: {
    color: "#fff",
    fontSize: Platform.OS === 'ios' ? 9 : 7,
    fontWeight: "400",
    letterSpacing: 2.9,
    lineHeight: 22,
    textTransform: "uppercase",
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    textAlign: "center",
  },
  blink: {
    color: "red",
    fontWeight: "700"
  },
  orderdiv: {
    padding: 10,
    width: "100%",
    marginTop:30
  },
  eachorderdiv: {
    marginTop: 25
  },
  rowdiv: {
    flexDirection: "row",
    width: "100%",
  },
  coldiv: {
    flex: 1,
    padding: 10,
  },
  date: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "inconsolata-bold"
  },
  bill: {
    fontSize: 12.6,
    fontWeight: "400",
    letterSpacing: 2.9,
    lineHeight: 22,
    textTransform: "uppercase",
    paddingTop: 10,
  },
  flexcol: {
    borderColor: "black",
    borderWidth: 1.5,
    padding: 10,
    marginTop: 20,
  },
  itemdiv: {
    fontSize: 16,
    width: "100%",
    marginTop: 5,
    fontFamily: "inconsolata"
  },
  proimg: {
    height: 170,
    width: 190,
    resizeMode: "cover",
    borderColor: "black",
    borderWidth: 1,
    padding: 3
  },
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
  btn: {
    position: "absolute",
    bottom: Platform.OS === 'ios' ? '81%' : '96%',
    right: "86%",
    backgroundColor: "black",
    zIndex: 100,
    padding: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "black",
    width:"10%",
  },
});

export default Orders;
