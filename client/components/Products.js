import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import Clothes from "../constants/clothes.js";

const Products = () => {
  const clothes = Clothes;

  return (
    <ScrollView>

      <View style={styles.closet}>
        {clothes.map((item) => {
          return (
            <View key={item.id}>
              <Image source={item.imgURL} style={styles.cloth} />
              <Text style={styles.ots}>Oversized T-Shirt</Text>
              <Text>{item.name}</Text>
              <Text>₹{item.price}.00</Text>

            </View>
          )
        })}
      </View>
    </ScrollView>
  )
}

export default Products

const styles = StyleSheet.create({
  /*clothes section*/
  closet: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "white"
  },
  cloth: {
    height: 300,
    width: 350,
    objectFit: "cover"
  },
  ots: {
    color: "grey",
    fontFamily: "Aeonik Fono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
    fontSize: 8.6,
    fontWeight: "400",
    letterSpacing: 2.9,
    lineHeight: 22,
    textTransform: "uppercase",
    paddingTop: 30,
  }
})