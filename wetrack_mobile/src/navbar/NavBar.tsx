import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import dashboard from '../assets/icons/Dashboard.png';
import transactions from '../assets/icons/CurrencyCircleDollar.png';
import budget from '../assets/icons/PiggyBank.png';

function DashboardScreen() {
    return <View />;
}
function TransactionsScreen() {
    return <View />;
}
function BudgetScreen() {
    return <View />;
}
function ProfileScreen() {
    return <View />;
}

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

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    tabBarShowLabel: true,
                    tabBarStyle: { height: 80 },
                    headerShown: false,
                }}
            >
                <Tab.Screen
                    name="Dashboard"
                    component={DashboardScreen}
                    options={{
                        tabBarIcon: ({  }) => (
                            <Image source={dashboard} resizeModel="contain" />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Transactions"
                    component={TransactionsScreen}
                    options={{
                        tabBarIcon: ({ color, focused }) => (
                            <Image source={transactions} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Add"
                    component={TransactionsScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <Icon name="add" color="#333" size={30} />
                        ),
                        tabBarButton: (props) => (
                            <CustomTabBarButton {...props}>
                                <Icon name="add" color="#333" size={30} />
                            </CustomTabBarButton>
                        ),
                    }}
                />
                <Tab.Screen
                    name="Budget"
                    component={BudgetScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Image source={budget} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Icon name="person-outline" color={color} size={size} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    customButtonContainer: {
        top: -20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    customButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
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