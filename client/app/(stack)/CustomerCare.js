import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Linking,
    Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomerCare = () => {
    const navigation = useNavigation();
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userId');
            // Update your global context here similar to web version
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        } catch (error) {
            console.log('Error: ', error);
        }
    };

    const handleEmail = () => {
        Linking.openURL('mailto:truehood.business@gmail.com');
    };

    const handleCall = () => {
        Linking.openURL('tel:+919618825172');
    };

    const handleInstagram = () => {
        Linking.openURL('https://instagram.com/truehoodclothing');
    };

    return (
        <ScrollView style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.navbar}>
                <Text style={styles.navbarText}>CUSTOMER CARE</Text>
            </View>

            {/* Contact Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contact Us</Text>

                <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
                    <FontAwesome name="envelope" size={20} color="#000" />
                    <Text style={[styles.text,styles.gd]}>truehood.business@gmail.com</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
                    <FontAwesome name="phone" size={20} color="#000" />
                    <Text style={[styles.text,styles.gd]}>+91 9618825172</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.contactItem} onPress={handleInstagram}>
                    <FontAwesome name="instagram" size={20} color="#000" />
                    <Text style={[styles.text,styles.gd]}>truehoodclothing</Text>
                </TouchableOpacity>
            </View>

            {/* Location Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Our Location</Text>
                <Text style={styles.text}>
                    Lalitha Nagar,{'\n'}
                    Ram Nagar,{'\n'}
                    Hyderabad - 500029
                </Text>
                <Text style={styles.text}>
                    This is our operational address for correspondence and administrative purposes.
                </Text>
                <Image
                    source={require('../../assets/sources/map.png')}
                    style={styles.mapImage}
                    resizeMode="cover"
                />
            </View>

            {/* Other Sections */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Terms and Conditions</Text>
                <Text style={styles.text}>
                    <Text style={styles.b}>Introduction{'\n'}</Text>
                    Welcome to True Hood! These terms and conditions outline the rules and regulations for the use of True Hood's website.

                    By accessing this website we assume you accept these terms and conditions. Do not continue to use True Hood if you do not agree to all of the terms and conditions stated on this page.{'\n'}
                    {'\n'}
                    <Text style={styles.b}>License{'\n'}</Text>
                    Unless otherwise stated, True Hood and/or its licensors own the intellectual property rights for all material on True Hood. All intellectual property rights are reserved. You may access this from True Hood for your own personal use subjected to restrictions set in these terms and conditions.
                    {'\n'}
                    You must not:
                    {'\n'}
                    • Republish material from True Hood{'\n'}
                    • Sell, rent material from True Hood{'\n'}
                    • Reproduce, duplicate or copy from True Hood{'\n'}
                    • Redistribute content from True Hood{'\n'}
                    {'\n'}
                    <Text style={styles.b}>User Comments{'\n'}</Text>
                    Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. True Hood does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of True Hood, its agents, and/or affiliates.
                    {'\n'}
                    True Hood reserves the right to monitor all Comments and to remove any Comments which can be considered inappropriate, offensive, or causes a breach of these Terms and Conditions.

                    {'\n'}
                    {'\n'}

                    <Text style={styles.b}>iFrames{'\n'}</Text>
                    Without prior approval and written permission, you may not create frames around our Webpages that alter in any way the visual presentation or appearance of our Website.
                    {'\n'}
                    {'\n'}
                    <Text style={styles.b}>Content Liability</Text>
                    {'\n'}
                    We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
                    {'\n'}
                    {'\n'}
                    <Text style={styles.b}>Reservation of Rights</Text>
                    {'\n'}
                    We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it’s linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.
                    {'\n'}
                    {'\n'}
                    <Text style={styles.b}>Removal of links from our website</Text>
                    {'\n'}
                    If you find any link on our Website that is offensive for any reason, you are free to contact and inform us any moment. We will consider requests to remove links but we are not obligated to or so or to respond to you directly.
                    {'\n'}
                    We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.

                </Text>
            </View>



            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Return Policy</Text>
                <Text style={styles.text}>
                    Currently we are sorry to tell you that we are not taking any returns of our products.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Privacy & Security</Text>
                <Text style={styles.text}>
                    <Text style={styles.b}>Information Collection</Text>{'\n'}
                    We collect information from you when you register on our site, place an order, subscribe to our newsletter, or fill out a form. When ordering or registering on our site, as appropriate, you may be asked to enter your name, email address, mailing address, phone number, or credit card information.

                    You may, however, visit our site anonymously. We will not sell, trade, or otherwise transfer to outside parties your personally identifiable information without your consent, except as necessary to fulfill your requests, or comply with the law.

                    {'\n'}
                    {'\n'}
                    <Text style={styles.b}>Information Use</Text>{'\n'}
                    The information we collect from you may be used to personalize your experience, improve our website, improve customer service, process transactions, administer a contest, promotion, survey, or other site features, or send periodic emails.

                    Your information helps us to better respond to your individual needs and efficiently handle your transactions. We implement a variety of security measures to maintain the safety of your personal information.

                    {'\n'}
                    {'\n'}
                    <Text style={styles.b}>Information Protection</Text>{'\n'}
                    We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secure networks and is only accessible by a limited number of persons who have special access rights to such systems, and are required to keep the information confidential. We use secure socket layer (SSL) technology to encrypt sensitive information you provide during transactions.

                    Despite our efforts to protect your personal information, no transmission over the Internet or electronic storage method is 100% secure. Therefore, we cannot guarantee absolute security. However, we strive to use commercially acceptable means to protect your personal information.

                    {'\n'}
                    {'\n'}
                    <Text style={styles.b}>Cookies</Text>{'\n'}
                    We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. Cookies are small data files stored on your device that help us remember your preferences and understand how you use our site.

                    You can choose to disable cookies through your browser settings. However, doing so may limit your ability to use certain features on our website.

                    {'\n'}
                    {'\n'}
                    <Text style={styles.b}>Third-Party Links</Text>{'\n'}
                    Our website may contain links to third-party sites. These sites have separate and independent privacy policies. We have no control over and are not responsible for the content and activities of these linked sites. Nonetheless, we seek to protect the integrity of our site and welcome any feedback about these sites.

                    {'\n'}
                    {'\n'}
                    <Text style={styles.b}>Changes to Our Privacy Policy</Text>{'\n'}
                    We may update our privacy policy from time to time to reflect changes in our practices or legal requirements. Any updates will be posted on this page, and the revised date will be indicated at the top of the policy.

                    We encourage you to review our privacy policy periodically to stay informed about how we are protecting your information.
                </Text>
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    navbar: {
        alignItems: "center",
        backgroundColor: "#000",
        flexDirection: "row",
        height: 80,
        justifyContent: "center",
        position: "relative",
        top: 0,
        width: "100%",
        zIndex: 1,
    },
    navbarText: {
        color: "#fff",
        fontSize: 12.6,
        fontWeight: "400",
        letterSpacing: 2.9,
        lineHeight: 22,
        textTransform: "uppercase",
        paddingTop: 30,
        textAlign: "center",
    },
    section: {
        padding: 20,
        marginTop: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    b: {
        fontWeight: 'bold',
        color: "black"
    },
    sectionTitle: {
        fontSize: 24,
        marginBottom: 10,
        color: "#000",
        fontSize: 12.6,
        fontWeight: "800",
        letterSpacing: 2.9,
        lineHeight: 12,
        textTransform: "uppercase",
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 15,
        color: 'gray',
        fontFamily: 'inconsolata'
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 0,
    },
    gd:{
        position:'relative',
        top:7,
        left:10
    },
    mapImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginTop: 10,
    },
    linkText: {
        fontSize: 16,
        color: '#007AFF',
        textDecorationLine: 'underline',
    },
});

export default CustomerCare;