import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Image,
    Alert,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthService from '../../services/authService';

// Import icons
const account = require("../../assets/icons/User.png");
const help = require("../../assets/icons/Info.png");
const logout = require("../../assets/icons/Logout.png");
const notification = require("../../assets/icons/Notification.png");
const setting = require("../../assets/icons/settings.png");

const InitialsAvatar = ({ name }) => {
    const getInitials = (name) => {
        if (!name) return "??";
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <View style={styles.propicArea}>
            <View style={styles.initialsContainer}>
                <Text style={styles.initialsText}>
                    {getInitials(name)}
                </Text>
            </View>
        </View>
    );
};

const ProfilePage = () => {
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const isAuth = await AuthService.isAuthenticated();
                if (!isAuth) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                    });
                    return;
                }

                // Try to get cached user data first
                const cachedUser = await AsyncStorage.getItem('user');
                if (cachedUser) {
                    setUserData(JSON.parse(cachedUser));
                }

                // Fetch fresh user data
                const freshUserData = await AuthService.getUserProfile();
                if (freshUserData) {
                    setUserData(freshUserData);
                    await AsyncStorage.setItem('user', JSON.stringify(freshUserData));
                }
            } catch (error) {
                console.error('Error loading profile:', error);
                if (error.message.includes('token')) {
                    // Token-related errors should redirect to login
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                    });
                } else {
                    Alert.alert(
                        'Error',
                        'Failed to load profile. Please try again later.'
                    );
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadUserProfile();
    }, [navigation]);

    const handleLogout = async () => {
        try {
            setIsLoading(true);
            await AuthService.logout();
            await AsyncStorage.removeItem('user');

            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            console.error('Logout error:', error);
            Alert.alert(
                'Error',
                'Failed to logout. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.topSection}>
                    <InitialsAvatar name={userData?.username || 'User'} />
                    <Text style={styles.name}>{userData?.username || 'User'}</Text>
                    {userData?.email && (
                        <Text style={styles.email}>{userData.email}</Text>
                    )}
                </View>

                <View style={styles.buttonList}>
                    <TouchableOpacity style={styles.buttonSection} activeOpacity={0.9}>
                        <View style={styles.buttonArea}>
                            <View style={styles.iconArea}>
                                <Image source={account} style={styles.iconStyle} resizeMode="contain" />
                            </View>
                            <Text style={styles.buttonName}>Account</Text>
                        </View>
                        <View style={styles.sp}></View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonSection} activeOpacity={0.9}>
                        <View style={styles.buttonArea}>
                            <View style={styles.iconArea}>
                                <Image source={notification} style={styles.iconStyle} resizeMode="contain" />
                            </View>
                            <Text style={styles.buttonName}>Notifications</Text>
                        </View>
                        <View style={styles.sp}></View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonSection} activeOpacity={0.9}>
                        <View style={styles.buttonArea}>
                            <View style={styles.iconArea}>
                                <Image source={setting} style={styles.iconStyle} resizeMode="contain" />
                            </View>
                            <Text style={styles.buttonName}>Settings</Text>
                        </View>
                        <View style={styles.sp}></View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonSection} activeOpacity={0.9}>
                        <View style={styles.buttonArea}>
                            <View style={styles.iconArea}>
                                <Image source={help} style={styles.iconStyle} resizeMode="contain" />
                            </View>
                            <Text style={styles.buttonName}>Help</Text>
                        </View>
                        <View style={styles.sp}></View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buttonSection}
                        activeOpacity={0.9}
                        onPress={handleLogout}
                    >
                        <View style={styles.buttonArea}>
                            <View style={styles.iconArea}>
                                <Image source={logout} style={styles.iconStyle} resizeMode="contain" />
                            </View>
                            <Text style={styles.buttonName}>Logout</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default ProfilePage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    safeArea: {
        flex: 20,
    },
    topSection: {
        height: 350,
        justifyContent: 'center',
        alignItems: 'center',
    },
    propicArea: {
        width: 170,
        height: 170,
        borderRadius: 85,
        borderWidth: 10,
        borderColor: '#E2F5FE',
        overflow: 'hidden',
    },
    initialsContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#4682B4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    initialsText: {
        fontSize: 50,
        color: 'white',
        fontWeight: 'bold',
    },
    name: {
        marginTop: 20,
        color: 'black',
        fontSize: 32,
    },
    email: {
        marginTop: 8,
        color: '#666',
        fontSize: 16,
    },
    buttonList: {
        marginTop: 20,
    },
    buttonSection: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 25,
        paddingRight: 25,
    },
    buttonArea: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconArea: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconStyle: {
        width: 25,
        height: 25,
    },
    buttonName: {
        width: 300,
        fontSize: 20,
        color: 'black',
        marginLeft: 20,
    },
    sp: {
        width: 350,
        marginTop: 15,
        height: 2,
        backgroundColor: 'lightgrey'
    }
});