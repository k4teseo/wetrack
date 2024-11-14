import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { enableScreens } from 'react-native-screens';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Auth imports
import Login from "../src/app/(auth)/login";
import Signup from "../src/app/(auth)/signup";

// Page imports
import DashboardPage from '../src/app/pages/DashboardPage';
import TransactionPage from '../src/app/pages/TransactionPage';
import AddTransactionPage from '../src/app/pages/AddTransactionPage';
import BudgetPage from '../src/app/pages/BudgetPage';
import ProfilePage from '../src/app/pages/ProfilePage';

// Asset imports
import dashboard from './assets/icons/Dashboard.png';
import transactions from './assets/icons/CurrencyCircleDollar.png';
import add from './assets/icons/Plus.png';
import budget from './assets/icons/PiggyBank.png';
import user from './assets/icons/User.png';

enableScreens();

const Stack = createNativeStackNavigator();
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

function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: true,
                tabBarStyle: { height: 78 },
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardPage}
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
                component={TransactionPage}
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
                component={AddTransactionPage}
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
                component={BudgetPage}
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
                component={ProfilePage}
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
    );
}

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Signup" component={Signup} />
                <Stack.Screen name="MainApp" component={TabNavigator} />
            </Stack.Navigator>
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