import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RAZORPAY_KEY_ID } from './config';

const RazorpayCheckout = ({ totalBill, onSuccess, onFailure }) => {
    const [loading, setLoading] = useState(true);
    const [html, setHtml] = useState('');
    const [error, setError] = useState(null);

    const generateHTML = (orderId, amount, keyId, prefill) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </head>
    <body>
      <script>
        console.log('Initializing Razorpay with:', {
          key: '${keyId}',
          amount: ${amount},
          order_id: '${orderId}'
        });
        
        var options = {
          key: '${keyId}',
          amount: ${amount},
          currency: 'INR',
          name: 'True Hood',
          description: 'Payment for your order',
          order_id: '${orderId}',
          prefill: ${JSON.stringify(prefill)},
          config: {
            display: {
              hide: [
                { method: "netbanking" },
                { method: "cards" },
                { method: "wallets" },
                { method: "paylater" }
              ],
              preferences: {
                show_default_blocks: true
              }
            }
          },
          handler: function(response) {
            console.log('Payment success:', response);
            window.ReactNativeWebView.postMessage(JSON.stringify(response));
          },
          modal: {
            ondismiss: function() {
              console.log('Payment modal dismissed');
              window.ReactNativeWebView.postMessage('MODAL_CLOSED');
            }
          },
          notes: {
            address: "Hello World"
          },
          on_error: function(err) {
            console.error('Razorpay error:', err);
            window.ReactNativeWebView.postMessage(JSON.stringify({error: err}));
          }
        };
        
        try {
          var rzp = new Razorpay(options);
          rzp.open();
        } catch(e) {
          console.error('Error opening Razorpay:', e);
          window.ReactNativeWebView.postMessage(JSON.stringify({error: e.message}));
        }
      </script>
    </body>
  </html>
`;



    const initiatePayment = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = await AsyncStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const email = await AsyncStorage.getItem('email');
            const userName = await AsyncStorage.getItem('userName');

            // Debug logs
            console.log('Initiating payment with amount:', totalBill);
            console.log('Razorpay Key:', RAZORPAY_KEY_ID);

            const orderResponse = await fetch('https://2-0-server.vercel.app/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    amount: totalBill * 100
                })
            });

            console.log('Server response status:', orderResponse.status);

            if (!orderResponse.ok) {
                const errorText = await orderResponse.text();
                console.log('Error response:', errorText);
                throw new Error(`Server responded with status: ${orderResponse.status}`);
            }

            const orderData = await orderResponse.json();
            console.log('Order data received:', orderData);

            if (!orderData || !orderData.orderId) {
                console.log('Invalid order data structure:', orderData);
                throw new Error('Invalid order data received from server');
            }

            const prefill = {
                email: email || '',
                contact: '',
                name: userName || ''
            };

            console.log('Generating HTML with prefill:', prefill);

            const generatedHtml = generateHTML(
                orderData.orderId,
                totalBill * 100,
                RAZORPAY_KEY_ID,
                prefill
            );

            setHtml(generatedHtml);
        } catch (error) {
            console.error('Payment initialization error details:', {
                message: error.message,
                stack: error.stack,
                totalBill: totalBill
            });
            setError(error.message);
            onFailure(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        initiatePayment();
        return () => {
            setHtml('');
            setError(null);
        };
    }, []);

    const handlePaymentResponse = async (data) => {
        try {
            console.log('Payment response received:', data);

            if (data === 'MODAL_CLOSED') {
                onFailure('Payment cancelled');
                return;
            }

            const paymentData = JSON.parse(data);

            // Check if there's an error in the payment data
            if (paymentData.error) {
                console.error('Payment error:', paymentData.error);
                onFailure(paymentData.error.description || 'Payment failed');
                return;
            }

            const token = await AsyncStorage.getItem('token');

            const verificationResponse = await fetch('https://2-0-server.vercel.app/verify-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    razorpay_payment_id: paymentData.razorpay_payment_id,
                    razorpay_order_id: paymentData.razorpay_order_id,
                    razorpay_signature: paymentData.razorpay_signature
                })
            });

            console.log('Verification response status:', verificationResponse.status);

            if (!verificationResponse.ok) {
                const errorText = await verificationResponse.text();
                console.log('Verification error response:', errorText);
                throw new Error(`Verification failed with status: ${verificationResponse.status}`);
            }

            const verificationData = await verificationResponse.json();
            console.log('Verification data:', verificationData);

            if (verificationData.success) {
                onSuccess(paymentData);
            } else {
                throw new Error('Payment verification failed');
            }
        } catch (error) {
            console.error('Payment verification error:', error);
            onFailure(error.message);
        }
    };

    if (error) {
        return null;
    }

    if (loading && !html) {
        return (
            <View style={[styles.container, styles.loading]}>
                <ActivityIndicator size="large" color="#000000" />
            </View>
        );
    }

    if (!html) {
        return null;
    }

    return (
        <View style={styles.container}>
            <WebView
                source={{ html }}
                onMessage={(event) => handlePaymentResponse(event.nativeEvent.data)}
                style={styles.webview}
                onLoadStart={() => {
                    console.log('WebView loading started');
                    setLoading(true);
                }}
                onLoadEnd={() => {
                    console.log('WebView loading ended');
                    setLoading(false);
                }}
                onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.error('WebView error:', nativeEvent);
                    setError(nativeEvent.description);
                    Alert.alert('Error', 'Failed to load payment gateway.');
                }}
                onNavigationStateChange={(navState) => {
                    console.log('Navigation state:', navState);
                }}
            />
            {loading && (
                <View style={[styles.container, styles.loading]}>
                    <ActivityIndicator size="large" color="#000000" />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        position:'relative',
        top:15,
    },
    webview: {
        flex: 1
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)'
    }
});

export default RazorpayCheckout;