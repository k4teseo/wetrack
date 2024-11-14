import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./app/(auth)/login.tsx";
import Signup from "./app/(auth)/signup.tsx";
import { enableScreens } from 'react-native-screens';
import DashboardPage from './app/pages/DashboardPage.tsx';
import TransactionPage from './app/pages/TransactionPage.tsx';
import AddTransactionPage from './app/pages/AddTransactionPage.tsx';
import BudgetPage from './app/pages/BudgetPage.tsx';
import ProfilePage from './app/pages/ProfilePage.tsx';
import dashboard from './assets/icons/Dashboard.png';
import transactions from './assets/icons/CurrencyCircleDollar.png';
import add from './assets/icons/Plus.png';
import budget from './assets/icons/PiggyBank.png';
import user from './assets/icons/User.png';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';

enableScreens();

const Stack = createNativeStackNavigator();

function DashboardScreen() {
    return <DashboardPage />;
}
function TransactionsScreen() {
    return <TransactionPage />;
}
function AddScreen() {
    return <AddTransactionPage />;
}
function BudgetScreen() {
    return <BudgetPage />;
}
function ProfileScreen() {
    return <ProfilePage />;
}

// Define Tab Navigator
const Tab = createBottomTabNavigator();

function CustomTabBarButton({ children, onPress }) {
    return (
        <TouchableOpacity
            style={styles.customButtonContainer}
            onPress={onPress}
        >
            <View style={styles.customButton}>
                {children}
            </View>
        </TouchableOpacity>
    );
}

function App() {
    return(
//          <NavigationContainer>
//             <Stack.Navigator initialRouteName="Login">
//                 <Stack.Screen name="Login" component={Login} />
//                 <Stack.Screen name="Signup" component={Signup} />
//                 <Stack.Screen name="Profile" component={ProfilePage} />
//             </Stack.Navigator>
//         </NavigationContainer>
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    tabBarShowLabel: true,
                    tabBarStyle: { height: 78 },
                    headerShown: false,
                }}
            >
                <Tab.Screen
                    name="Dashboard"
                    component={DashboardScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Image
                                source={dashboard}
                                style={{
                                    width: 38,
                                    height: 38,
                                }}
                            />
                        ),
                        tabBarLabelStyle: {
                            fontSize: 12,
                            color: 'black',
                        },
                    }}
                />
                <Tab.Screen
                    name="Transactions"
                    component={TransactionsScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Image
                                source={transactions}
                                style={{
                                    width: 38,
                                    height: 38,
                                }}
                            />
                        ),
                        tabBarLabelStyle: {
                            fontSize: 12,
                            color: 'black',
                        },
                    }}
                />
                <Tab.Screen
                    name="Add"
                    component={AddScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <Icon name="add" color="#333" size={30} />
                        ),
                        tabBarButton: (props) => (
                            <CustomTabBarButton {...props}>
                                <Image source={add} />
                            </CustomTabBarButton>
                        ),
                    }}
                />
                <Tab.Screen
                    name="Budget"
                    component={BudgetScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Image
                                source={budget}
                                style={{
                                    width: 38,
                                    height: 38,
                                }}
                            />
                        ),
                        tabBarLabelStyle: {
                            fontSize: 12,
                            color: 'black',
                        }
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Image
                                source={user}
                                style={{
                                    width: 38,
                                    height: 38,
                                }}
                            />
                        ),
                        tabBarLabelStyle: {
                            fontSize: 12,
                            color: 'black',
                        }
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default App;

const styles = StyleSheet.create({
    customButtonContainer: {
        top: -40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    customButton: {
        width: 80,
        height: 80,
        borderRadius: 50,
        backgroundColor: '#e0f0ff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
    },
});
