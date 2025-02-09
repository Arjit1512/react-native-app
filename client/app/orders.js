import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useMyContext } from "../components/Context";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const {globalUserID,setGlobalUserID} = useMyContext();

  console.log('GLOAADBJNSAGBAKGBKADSJBGKASBG ',globalUserID);
  
  if(!globalUserID){
    return(
      <View style={styles.container}>
        <Text style={styles.text}>Please login to display your orders!</Text>
      </View>
    )
  }
  
  useEffect(() => {
    const getOrders = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('TOKEN----> ',token);
        const response = await fetch(`https://6922-14-139-177-158.ngrok-free.app/${globalUserID}/get-cart`,{
          headers:{
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();
        if(data.message === "No token provided"){
          //setGlobalUserID(null);
        }
        setOrders(data.orders || []);
        console.log('ORDERS====> ', data);
      } catch (error) {
        console.log('Error: ', error);
      }
    }

    getOrders();
  }, [globalUserID]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        USERID: {globalUserID}
        {orders?.map((order) => {
          return (
            <>
              <Text>{order.totalBill}</Text>
            </>
          )
        })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18, fontWeight: "bold" },
});

export default Orders;
