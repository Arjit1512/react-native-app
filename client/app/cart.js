import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Cart = () => {
  useEffect( () => {
    const getCart = async() => {
      try{
          const response = await fetch(`https://6922-14-139-177-158.ngrok-free.app/${userId}/get-cart`);
          
          const data = await response.json();
          console.log('UserId: : : ',userId);
          console.log('Cart items = ',data);
        }catch(error){
          console.log('Error: ',error);
        }
      }
      getCart();
  },[])
  return (
    <View style={styles.container}>
      <Text>CART</Text>
    </View>
  )
}

export default Cart

const styles = StyleSheet.create({
   container:{
    flex:1,
    alignItems:"center",
    justifyContent:"center",
    fontSize:24
   }
})