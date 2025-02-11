import { View, Text, Button, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ScrollView } from "react-native";
import { Icon } from "react-native-elements";
import RNPickerSelect from "react-native-picker-select";
import { useState } from "react";
import Loader from "../components/Loader";

const ProductDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const product = route.params?.product;
  const [selectedSize, setSelectedSize] = useState(null);
  const [flagArray, setFlagArray] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddCart = async (id, size) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`https://2-0-server.vercel.app/${userId}/add-item/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ size: size })
      });

      const data = await response.json();
      if (data.message === "Item added to cart successfully!" || data.message === "Quantity updated!") {
        alert("Item added to cart successfully!");
        setSelectedSize(null);
      }
      console.log(data);
    } catch (error) {
      console.log(error);
      alert(error);
    } finally {
      setLoading(false);
    }

  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Product Not Found</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  if (loading) {
    return (
      <Loader visible={loading} />
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
          <Image source={product.imgURL} resizeMode="cover" style={styles.cloth} />
          <Image source={product.altURL} resizeMode="cover" style={styles.cloth} />
        </ScrollView>
        <View style={styles.slide}>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.ots}>OVERSIZED T-SHIRT</Text>
          <Text style={styles.price}>₹{product.price}.00</Text>

          <View style={styles.sizeContainer}>
            <Text style={styles.sz}>Size: </Text>

            <TouchableOpacity
              style={[styles.sizebtn, selectedSize === "S" && styles.selectedSizebtn]}
              onPress={() => setSelectedSize("S")}
            >
              <Text style={[styles.sizeText, selectedSize === "S" && styles.selectedSizeText]}>S</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sizebtn, selectedSize === "M" && styles.selectedSizebtn]}
              onPress={() => setSelectedSize("M")}
            >
              <Text style={[styles.sizeText, selectedSize === "M" && styles.selectedSizeText]}>M</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sizebtn, selectedSize === "L" && styles.selectedSizebtn]}
              onPress={() => setSelectedSize("L")}
            >
              <Text style={[styles.sizeText, selectedSize === "L" && styles.selectedSizeText]}>L</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sizebtn, selectedSize === "XL" && styles.selectedSizebtn]}
              onPress={() => setSelectedSize("XL")}
            >
              <Text style={[styles.sizeText, selectedSize === "XL" && styles.selectedSizeText]}>XL</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sizebtn, selectedSize === "XXL" && styles.selectedSizebtn]}
              onPress={() => setSelectedSize("XXL")}
            >
              <Text style={[styles.sizeText, selectedSize === "XXL" && styles.selectedSizeText]}>XXL</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.addToCartBtn} onPress={() => handleAddCart(product.id, selectedSize)}>
            <Text style={styles.addToCartText}>ADD TO CART</Text>
          </TouchableOpacity>

          <Text style={styles.h1}>Product Detail: </Text>
          <Text style={styles.description}>Experience ultimate comfort and style with our premium True Hood T-shirt. Crafted from 100% soft, breathable cotton.
            Details: Product is of 240GSM (Oversized) with a 9 x 12 inch design on it.</Text>
        </View>

        {/* Table */}
        <View style={styles.sizeTableContainer}>
          <Text style={styles.sizeTableTitle}>Size Chart</Text>
          <View style={styles.sizeTable}>
            <View style={styles.sizeTableRow}>
              <Text style={[styles.sizeTableCell, styles.headerCell]}>Size</Text>
              <Text style={[styles.sizeTableCell, styles.headerCell]}>S</Text>
              <Text style={[styles.sizeTableCell, styles.headerCell]}>M</Text>
              <Text style={[styles.sizeTableCell, styles.headerCell]}>L</Text>
              <Text style={[styles.sizeTableCell, styles.headerCell]}>XL</Text>
              <Text style={[styles.sizeTableCell, styles.headerCell]}>XXL</Text>
              <Text style={[styles.sizeTableCell, styles.headerCell]}>XXXL</Text>
            </View>

            <View style={styles.sizeTableRow}>
              <Text style={[styles.sizeTableCell, styles.labelCell]}>Chest (in)</Text>
              <Text style={styles.sizeTableCell}>42</Text>
              <Text style={styles.sizeTableCell}>44</Text>
              <Text style={styles.sizeTableCell}>46</Text>
              <Text style={styles.sizeTableCell}>48</Text>
              <Text style={styles.sizeTableCell}>50</Text>
              <Text style={styles.sizeTableCell}>52</Text>
            </View>

            <View style={styles.sizeTableRow}>
              <Text style={[styles.sizeTableCell, styles.labelCell]}>Length (in)</Text>
              <Text style={styles.sizeTableCell}>29</Text>
              <Text style={styles.sizeTableCell}>29.75</Text>
              <Text style={styles.sizeTableCell}>30.5</Text>
              <Text style={styles.sizeTableCell}>31.25</Text>
              <Text style={styles.sizeTableCell}>32</Text>
              <Text style={styles.sizeTableCell}>32.75</Text>
            </View>

            <View style={styles.sizeTableRow}>
              <Text style={[styles.sizeTableCell, styles.labelCell]}>Shoulder (in)</Text>
              <Text style={styles.sizeTableCell}>20.5</Text>
              <Text style={styles.sizeTableCell}>21.25</Text>
              <Text style={styles.sizeTableCell}>22</Text>
              <Text style={styles.sizeTableCell}>22.75</Text>
              <Text style={styles.sizeTableCell}>23.5</Text>
              <Text style={styles.sizeTableCell}>24.25</Text>
            </View>
          </View>
        </View>


        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Products")}>
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 0,
  },
  title: {
    fontFamily: "Inconsolata",
    fontSize: 22,
    width: "50%"
  },
  price: {
    fontSize: 20,
    color: "",
    marginBottom: 10,
  },
  h1: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10
  },
  description: {
    textAlign: "left",
    fontFamily: "Inconsolata",
    fontSize: 16,
    lineHeight: 16,
    width: "90%",
    fontWeight: "300",
    position: "relative",
    top: "2%"
  },
  slide: {
    textAlign: "left",
    position: "relative",
    bottom: "2%",
    width: "90%",
    padding: 0
  },
  imageScroll: {
    flexDirection: "row",
    marginVertical: 10,
  },
  cloth: {
    width: 390,
    height: 330,
    padding: 4,
    marginTop: 40,
    marginHorizontal: 10, // Add spacing between images
  },
  ots: {
    color: "grey",
    fontSize: 8.6,
    fontWeight: "400",
    letterSpacing: 2.9,
    lineHeight: 22,
    textTransform: "uppercase",
    paddingTop: 0,
  },
  btn: {
    position: "relative",
    bottom: "90%",
    right: "40%",
    backgroundColor: "white",
    zIndex: 100,
    padding: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "black",
  },
  sz: {
    fontSize: 16
  },
  sizebtn: {
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "black",
    borderRadius: 8, // Rounded corners for a premium look
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginHorizontal: 4, // Space between buttons
    alignItems: "center",
    justifyContent: "center",
    minWidth: 50, // Ensures equal button width
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3, // Shadow effect on Android
  },
  selectedSizebtn: {
    backgroundColor: "black", // Changes background when selected
    borderColor: "black",
  },
  sizeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "black",
    textTransform: "uppercase",
  },
  selectedSizeText: {
    color: "white", // Text turns white when selected
  },
  sizeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
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
    width: "100%", // Full width for better UX
  },
  addToCartText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  sizeTableContainer: {
    marginTop: 30,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  sizeTableTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 10,
    color: "#222",
  },
  sizeTable: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
  },
  sizeTableRow: {
    flexDirection: "row",
    backgroundColor: "white",
  },
  sizeTableCell: {
    flex: 1,
    textAlign: "center",
    paddingVertical: 10,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    fontSize: 10,
  },
  headerCell: {
    backgroundColor: "black",
    color: "white",
    fontWeight: "bold",
  },
  labelCell: {
    fontWeight: "bold",
    backgroundColor: "#eee",
  },
});

export default ProductDetail;
