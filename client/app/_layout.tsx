import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(stack)/ProductDetail" options={{ headerShown: false, title: "Product Detail" }} />
      <Stack.Screen name="(stack)/Register" options={{ headerShown: false, title: "Register"}} />
      <Stack.Screen name="(stack)/Orders" options={{ headerShown: false, title: "Orders" }} />
      <Stack.Screen name="(stack)/CustomerCare" options={{ headerShown: false, title: "CustomerCare" }} />
    </Stack>
  );
}