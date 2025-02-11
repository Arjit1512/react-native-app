import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../components/Loader.js';


const Cart = () => {
  const [userID, setUserID] = useState(null);
  const [items, setItems] = useState([]);
  const [flagArray, setFlagArray] = useState([]);
  const [loading, setLoading] = useState(false);

  const addQuantity = async (userID, productID, size) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await fetch(`https://2-0-server.vercel.app/${userID}/add-item/${productID}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ size: size })
      })
      const data = await response.json();
      console.log(data);
      setFlagArray([...flagArray, 1]);
    } catch (error) {
      console.log('Error: ', error);
      alert(error);
    } finally {
      setLoading(false);
    }
  }

  const removeQuantity = async (userID, productID, size) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await fetch(`https://2-0-server.vercel.app/${userID}/remove-item/${productID}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ size: size })
      })
      const data = await response.json();
      console.log(data);
      setFlagArray([...flagArray, 1]);
    } catch (error) {
      console.log('Error: ', error);
      alert(error);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      const getCart = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          const userId = await AsyncStorage.getItem('userId');
          setUserID(userId);

          const response = await fetch(`https://2-0-server.vercel.app/${userId}/get-cart`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          const data = await response.json();
          console.log('Cart items = ', data);
          setItems(data.items);
        } catch (error) {
          console.log('Error: ', error);
        }
      };

      getCart();
    }, [userID, flagArray, setItems])
  );

  if (loading) {
    return (
      <Loader visible={loading} />
    )
  }

  if (items.length === 0) {
    return (
      <View style={{ position: "relative", top: "50%" }}>
        <Text style={{ textAlign: "center", fontSize: 18, fontFamily: "Inconsolata" }}>Oops, there are no items in your cart!😔</Text>
      </View>
    )
  }

  const totalBill = items.reduce((acc, item) => acc + item.totalBill, 0);

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <Text style={styles.navbarText}>YOUR CART</Text>
        <ScrollView>
          {items?.map((item) => {
            return (
              <View key={item._id} style={styles.flexcol}>
                <View style={styles.flexrowdiv}>

                  <Image source={{ uri: `https://sociopedia-bucket.s3.us-east-1.amazonaws.com${item.imagePath}` }} style={styles.proimg} />
                  <View style={styles.inside}>
                    <Text>{item.product_name}</Text>
                    <Text style={styles.grey}>OVERSIZED T-SHIRT</Text>
                    <View style={styles.smallgap}>
                      <Text style={styles.textsize}>Size: {item.size}</Text>
                      <View style={styles.quantityContainer}>
                        <TouchableOpacity onPress={() => removeQuantity(userID, item.product_id, item.size)} style={styles.qtyBtn}>
                          <Text style={styles.qtyBtnText}>-</Text>
                        </TouchableOpacity>

                        <Text style={styles.qtyText}>{item.product_quantity}</Text>

                        <TouchableOpacity onPress={() => addQuantity(userID, item.product_id, item.size)} style={styles.qtyBtn}>
                          <Text style={styles.qtyBtnText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Text style={{ fontWeight: "700", paddingTop: 3 }}>₹{item.totalBill}.00</Text>
                  </View>
                </View>
              </View>
            )
          })}

          <View style={styles.box}>
            <Text style={styles.summary}>ORDER SUMMARY</Text>
            <View style={styles.samerow}>
            <Text style={styles.gray}>SUB TOTAL:</Text><Text style={styles.bill}>₹{totalBill}.00</Text>
            </View>
            <View style={styles.samerow}>
            <Text style={styles.gray}>DELIVERY CHARGES:</Text><Text style={styles.bill}>FREE</Text>
            </View>
            <View style={styles.samerow}>
            <Text style={styles.gray}>TOTAL:</Text><Text style={styles.bill}>₹{totalBill}.00</Text>
            </View>
            <TouchableOpacity style={styles.addToCartBtn}>
              <Text style={styles.addToCartText}>CHECKOUT</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  )
}

export default Cart

const styles = StyleSheet.create({
  container: {
    fontSize: 24,
    backgroundColor: "white",
    marginTop: 0,
    height: "100%",
    width: "100%",
  },
  navbarText: {
    color: "black",
    fontSize: 22.6,
    fontWeight: "400",
    letterSpacing: 2.9,
    lineHeight: 22,
    textTransform: "uppercase",
    paddingTop: 50,
    textAlign: "center",
  },
  textsize: {
    fontWeight: "400"
  },
  flexcol: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10
  },
  flexrowdiv: {
    display: "flex",
    flexDirection: "row",
    width: "90%",
    paddingBottom: 30,
    borderWidth: 1,
    borderColor: "black",
    borderStyle: "solid",
    marginBottom: 20,
  },
  smallgap: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    paddingTop: 3
  },
  proimg: {
    height: "100%",
    width: "40%",
    objectFit: "cover",
    marginTop: 15
  },
  inside: {
    paddingTop: 24,
    paddingLeft: 24
  },
  grey: {
    color: "grey",
    fontSize: 8.6,
    fontWeight: "400",
    letterSpacing: 2.9,
    lineHeight: 22,
    textTransform: "uppercase",
    paddingTop: 2,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyBtn: {
    backgroundColor: "black",
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  qtyBtnText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  qtyText: {
    fontSize: 15,
    marginHorizontal: 10,
  },
  /*box section*/
  box: {
    borderColor: "black",
    borderWidth: 2,
    padding: 15,
    paddingTop:5,
    paddingBottom: 10,
    width: "90%",
    display: "flex",
    position: "relative",
    left: "5%",
    alignItems: "left",
    textAlign: "left"
  },
  samerow:{
    display: "flex",
    flexDirection:"row",
    gap:10
  },
  summary: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "400"
  },
  gray: {
    color: "grey",
    textDecorationLine: "underline",
    marginTop: 5,
    fontSize: 20,
  },
  bill: {
    fontWeight:"600",
    marginTop: 5,
    fontSize: 20,
  },
  addToCartBtn: {
    backgroundColor: "black",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8, // Rounded corners
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Shadow effect on Android
    width: "70%",
    position: "relative",
    left: "16%"
  },
  addToCartText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
})