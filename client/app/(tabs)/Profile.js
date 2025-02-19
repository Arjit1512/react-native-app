import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Icon } from "react-native-elements";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

const AccountScreen = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch user info from AsyncStorage
    const getUserInfo = async () => {
      try {
        const name = await AsyncStorage.getItem('userName') || '';
        const email = await AsyncStorage.getItem('email') || '';
        const phone = await AsyncStorage.getItem('userPhone') || '';
        
        setUserInfo({ name, email, phone });
      } catch (error) {
        console.log('Error fetching user info:', error);
      }
    };
    
    getUserInfo();
  }, []);

  const MenuOption = ({ title, subtitle, onPress, last }) => (
    <TouchableOpacity 
      style={[styles.menuItem, last ? styles.lastMenuItem : null]} 
      onPress={onPress}
    >
      <View>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <Feather name="chevron-right" size={24} color="#333" />
    </TouchableOpacity>
  );

  // Get initials for the avatar
  const getInitials = (name) => {
    if (!name) return 'AA';
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{getInitials(userInfo.name)}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userInfo.name}</Text>
            <Text style={styles.userEmail}>{userInfo.email}</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <MenuOption title="Orders" onPress={() => router.push("/(stack)/Orders")} />
          <MenuOption title="Customer Care" onPress={() => navigation.navigate('(stack)/CustomerCare')} />
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  headerTitle: {
    color: "#000",
    fontSize: 12.6,
    fontWeight: "800",
    letterSpacing: 2.9,
    lineHeight: 22,
    textTransform: "uppercase",
    paddingTop: 10,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: "Inconsolata-bold",
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
    fontFamily: "Inconsolata",
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginTop: 15,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    fontSize:25
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuTitle: {
    fontSize: 16,
    color: '#000',
    fontFamily: "Inconsolata"
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#000',
    marginTop: 3,
  },
  
});

export default AccountScreen;