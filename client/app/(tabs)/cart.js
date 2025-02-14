import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import Loader from '../../components/Loader.js';
import RazorpayCheckout from 'react-native-razorpay';


const Cart = () => {
  const [userID, setUserID] = useState(null);
  const [items, setItems] = useState([]);
  const [flagArray, setFlagArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addressPopup, showAddressPopup] = useState(false);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: ""
  })

  const initializePayment = async (amount) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const email = await AsyncStorage.getItem('email');
      const userName = await AsyncStorage.getItem('userName');

      // First, create order on your backend
      const orderResponse = await fetch(`https://2-0-server.vercel.app/create-order`, {
        method: 'POST',
        body: JSON.stringify({
          amount: amount * 100 // Convert to paise
        })
      });

      const orderData = await orderResponse.json();

      // Configure Razorpay options
      const options = {
        description: 'Payment for your order',
        image: 'https://sociopedia-bucket.s3.us-east-1.amazonaws.com/images/real-logo-hstar.png',
        currency: 'INR',
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Replace with your key
        amount: amount * 100,
        name: 'True Hood',
        order_id: `receipt${orderData.id}-${Date.now()}`,
        prefill: {
          email: email,
          contact: '',
          name: userName
        },
        theme: { color: '#000000' }
      };

      // Open Razorpay
      const data = await RazorpayCheckout.open(options);

      // Payment successful
      const paymentResponse = await fetch(`https://2-0-server.vercel.app/verify-payment`, {
        method: 'POST',
        body: JSON.stringify({
          razorpay_payment_id: data.razorpay_payment_id,
          razorpay_order_id: data.razorpay_order_id,
          razorpay_signature: data.razorpay_signature
        })
      });

      const paymentData = await paymentResponse.json();

      if (paymentData.success) {
        Alert.alert('Success', 'Payment successful!');
        // Clear cart or navigate to success screen
      }

    } catch (error) {
      console.log('Payment Error:', error);
      Alert.alert('Error', 'Payment failed. Please try again.');
    }
  };

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

  const handleAddressSubmit = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`https://2-0-server.vercel.app/${userId}/add-address`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          street: address.street,
          city: address.city,
          state: address.state,
          pincode: address.pincode
        })
      })
      const data = await response.json();
      if (data.message === "Address added successfully!") {
        showAddressPopup(false);
        setAddress({ street: '', city: '', state: '', pincode: '' });
        await initializePayment(totalBill);
      }
      alert(data.message);
    } catch (error) {
      console.log('Error: ', error);
      alert(error);
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
        <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "500", fontFamily: "Inconsolata" }}>Oops, there are no items in your cart!😔</Text>
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
            <TouchableOpacity style={styles.addToCartBtn} onPress={() => showAddressPopup(true)}>
              <Text style={styles.addToCartText}>CHECKOUT</Text>
            </TouchableOpacity>
          </View>

          {addressPopup && (
            <View style={styles.popupContainer}>
              <BlurView intensity={20} style={StyleSheet.absoluteFill} />
              <View style={styles.popup}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => showAddressPopup(false)}
                >
                  <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>

                <Text style={styles.popupTitle}>Add Delivery Address</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Enter your complete address*"
                  placeholderTextColor="grey"
                  value={address.street}
                  onChangeText={(text) => setAddress({ ...address, street: text })}
                  keyboardType="default"
                />

                <TextInput
                  style={styles.input}
                  placeholder="city*"
                  placeholderTextColor="grey"
                  value={address.city}
                  onChangeText={(text) => setAddress({ ...address, city: text })}
                  keyboardType="default"
                />

                <TextInput
                  style={styles.input}
                  placeholder="state*"
                  placeholderTextColor="grey"
                  value={address.state}
                  onChangeText={(text) => setAddress({ ...address, state: text })}
                  keyboardType="default"
                />

                <TextInput
                  style={styles.input}
                  placeholder="pincode*"
                  placeholderTextColor="grey"
                  value={address.pincode}
                  onChangeText={(text) => setAddress({ ...address, pincode: text })}
                  keyboardType="numeric"
                />

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleAddressSubmit}
                >
                  <Text style={styles.submitButtonText}>SUBMIT ADDRESS</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
    paddingTop: 5,
    paddingBottom: 10,
    width: "90%",
    display: "flex",
    position: "relative",
    left: "5%",
    alignItems: "left",
    textAlign: "left"
  },
  samerow: {
    display: "flex",
    flexDirection: "row",
    gap: 10
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
    fontWeight: "600",
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
  /*address-popup*/
  popupContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
    height: 690
  },
  popup: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 10,
    zIndex: 1,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Inconsolata-Bold'
  },
  input: {
    width: '100%',
    height: 45,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    color: 'black',
    fontFamily: 'Inconsolata'
  },
  submitButton: {
    backgroundColor: 'black',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: '100%',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
})