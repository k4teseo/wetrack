import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './app/(auth)/login.tsx';
import Signup from './app/(auth)/signup.tsx';
import Profile from './app/pages/ProfilePage.tsx';
import NavBar from './components/NavBar.tsx'

const Stack = createNativeStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <NavBar />
        </NavigationContainer>
    );
}

export default App;