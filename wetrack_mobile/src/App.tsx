
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Login from "./pages/login/login.tsx";
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
