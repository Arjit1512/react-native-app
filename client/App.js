import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./app/index.js";
import Orders from "./app/orders.js";
import Products from "./components/Products.js";

const Stack = createStackNavigator();

export default function App() {
    console.log("Registered Screens:", Stack);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Orders" component={Orders} />
                <Stack.Screen name="Products" component={Products} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
