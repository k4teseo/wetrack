/* import React from "react";
import {
    View,
    StyleSheet,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
} from "react-native";

const profile_picture = require("");
const account = require("");
const help = require("");
const logout = require("");
const notification = require("");
const setting = require("");
*/
const Profile = () => {
    return (
        /*
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.topSection}>
                    <View style={styles.propicArea}>
                        <Image source={profile_picture} style={styles.propic} />
                    </View>
                    <Text style={styles.name}></Text>
                    <Text style={styles.membership}></Text>
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
            </SafeAreaView>
        </View> */
        <Text>Profile</Text>
    );
};

export default Profile;

/*
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    safeArea: {
        flex: 1,
    },
    topSection: {
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    propicArea: {
        width: 170,
        height: 170,
        borderRadius: '100%',
        borderWidth: 4,
        borderColor: '#FFBB3B'
    },
    propic: {
        width: '100%',
        height: '100%'
    },
    name: {
        marginTop: 20,
        color: 'white',
        fontSize: 32,
    },
    membership: {
        color: '#FFBB3B',
        fontSize: 18,
    },
    buttonList: {
        marginTop: 20,
    },
    buttonSection: {
        paddingTop: 10,
        paddingBottom: 5,
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
        color: 'white',
        marginLeft: 20,
    },
    sp: {
        width: 400,
        marginTop: 10,
        height: 1,
        backgroundColor: '#FFFFFF45'
    }
}); */