import React from "react";
import {
    View,
    StyleSheet,
    Image,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView
} from "react-native";


const profile_picture = require("../../assets/icons/propic.jpg");
const account = require("../../assets/icons/User.png");
const help = require("../../assets/icons/Info.png");
const logout = require("../../assets/icons/Logout.png");
const notification = require("../../assets/icons/Notification.png");
const setting = require("../../assets/icons/Settings.png");

const ProfilePage = () => {
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.topSection}>
                        <View style={styles.propicArea}>
                            <Image source={profile_picture} style={styles.propic} />
                        </View>
                        <Text style={styles.name}>Talal Arif Shaikha</Text>
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

                        <TouchableOpacity style={styles.buttonSection} activeOpacity={0.9}>
                            <View style={styles.buttonArea}>
                                <View style={styles.iconArea}>
                                    <Image source={logout} style={styles.iconStyle} resizeMode="contain" />
                                </View>
                                <Text style={styles.buttonName}>Logout</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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
    safeArea: {
        flex: 20,
    },
    scrollContainer: {
        paddingBottom: 100, // Extra space for nav bar
    },
    topSection: {
        height: 350,
        justifyContent: 'center',
        alignItems: 'center',
    },
    propicArea: {
        width: 170,
        height: 170,
        borderRadius: 100,
        borderWidth: 10,
        borderColor: '#E2F5FE'
    },
    propic: {
        width: '100%',
        height: '100%'
    },
    name: {
        marginTop: 20,
        color: 'black',
        fontSize: 32,
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
    },
});