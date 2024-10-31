import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../app/(auth)/login.tsx";
import Signup from "../app/(auth)/signup.tsx";
import { enableScreens } from 'react-native-screens';

enableScreens();

const Stack = createNativeStackNavigator();

function App() {
    return(
        <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
        </Stack.Navigator>
        </NavigationContainer>
        );
    }

export default App;
