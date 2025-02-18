import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert, Platform } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import Loader from '../../components/Loader.js';
import { WebView } from 'react-native-webview';
import RazorpayCheckout from '../../components/RazorpayCheckout';
import axios from 'axios';

const Cart = () => {
  const [userID, setUserID] = useState(null);
  const [items, setItems] = useState([]);
  const [flagArray, setFlagArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [addressPopup, showAddressPopup] = useState(false);
  const navigation = useNavigation();

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: ""
  })

  const [orderProcessing, setOrderProcessing] = useState(false);
  const generateShiprocketToken = async () => {
    try {
      const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
        email: "hemanth.a21@iiits.in",
        password: "Hemanth#2003"
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.data.token) {
        throw new Error('Failed to generate Shiprocket token');
      }

      return response.data.token;
    } catch (error) {
      console.error('Shiprocket Token Generation Error:', error.response ? error.response.data : error.message);
      throw new Error('Failed to generate Shiprocket authentication token');
    }
  };
  const createShiprocketOrder = async (orderDetails) => {
    try {
      const shiprocketToken = await generateShiprocketToken();

      const response = await fetch('https://2-0-server.vercel.app/api/shiprocket/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${shiprocketToken}`,
        },
        body: JSON.stringify({
          order_id: orderDetails.orderId,
          order_date: new Date().toISOString().split('T')[0],
          pickup_location: "Primary",
          billing_customer_name: orderDetails.customerName,
          billing_last_name: "",
          billing_address: address.street,
          billing_city: address.city,
          billing_state: address.state,
          billing_country: "India",
          billing_pincode: address.pincode,
          billing_email: orderDetails.email,
          billing_phone: orderDetails.phone,
          shipping_is_billing: true,
          order_items: items.map(item => ({
            name: item.product.name,
            sku: item.product._id,
            units: item.quantity,
            selling_price: item.product.price,
            size: item.size
          })),
          payment_method: "Prepaid",
          sub_total: items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0),
          length: 10,
          breadth: 10,
          height: 10,
          weight: 0.5
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create shipping order');
      }

      const shipmentData = await response.json();
      return shipmentData;
    } catch (error) {
      console.error('Shiprocket Order Creation Error:', error);
      throw error;
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
        setShowPayment(true);
      }
      else alert(data.message);
    } catch (error) {
      console.log('Error: ', error);
      alert(error);
    }
  }

  const handleCheckout = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');

      const response = await fetch(`https://2-0-server.vercel.app/${userId}/checkout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Checkout successful:', data);
        return data;
      } else {
        throw new Error(data.message || 'Checkout failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      throw error;
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      setLoading(true);
      setOrderProcessing(true);
      const userName = await AsyncStorage.getItem('userName');
      const email = await AsyncStorage.getItem('email');
      // Process the checkout after successful payment
      const checkoutResult = await handleCheckout();
      const orderDetails = {
        orderId: `shiprocket_${new Date()}_${email}`,
        customerName: userName,
        email: email,
        phone: '9618825172'
      };

      const shipmentResult = await createShiprocketOrder(orderDetails);

      if (shipmentResult) {
        Alert.alert('Success', 'Order placed and shipping arranged successfully!');
        setShowPayment(false);
        setItems([]);
        setFlagArray([]);
        setAddress({ street: '', city: '', state: '', pincode: '' });

        navigation.navigate('Orders');
      }
    } catch (error) {
      console.error('Error processing order:', error);
      Alert.alert('Error', 'Failed to process your order. Please try again.');
    } finally {
      setLoading(false);
      setOrderProcessing(false);
    }
  };

  const handlePaymentFailure = (error) => {
    Alert.alert('Payment Failed', error);
    setShowPayment(false);
  };



  useFocusEffect(
    React.useCallback(() => {
      const getCart = async () => {
        setLoading(true);
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
        } finally {
          setLoading(false);
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

        {showPayment && (
          <View style={StyleSheet.absoluteFill}>
            <RazorpayCheckout
              totalBill={totalBill}
              onSuccess={handlePaymentSuccess}
              onFailure={handlePaymentFailure}
            />
          </View>
        )}
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
    fontFamily: 'Inconsolata',
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