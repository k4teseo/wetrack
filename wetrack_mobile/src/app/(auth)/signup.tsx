import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';

const Signup = ({ navigation }) => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
  });


const submit = async () => {
    if (form.name === "" || form.username === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }
    setSubmitting(true);
}


return (
    <View style={styles.container}>
        <Text style={styles.title}>WeTrack</Text>
        <Text style={styles.subtitle}>Sign Up</Text>
        <FormField
            title="Name"
            value={form.name}
            handleChangeText={(e) => setForm({...form, name: e})}
            otherStyles="mt-7"
        />

        <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({...form, username: e})}
            otherStyles="mt-7"
        />

        <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({...form, password: e})}
            otherStyles="mt-7"
        />

        <CustomButton
        title="Sign Up"
        handlePress={submit}
        containerStyles="mt-7"
        isLoading={isSubmitting}
        />

        <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginText}>Already have an account? Log in</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 14,
        backgroundColor: '#FFFFFF',
        flex: 1,
    },
    title: {
        fontSize: 37,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000000',
        marginTop: 65,
        marginBottom: 40,
    },
    subtitle: {
        fontSize: 25,
        color: '#000000',
    },
    loginButton: {
        alignSelf: 'center',
        padding: 10,
    },
    loginText: {
        color: '#000000',
        fontSize: 15,
        textDecorationLine: 'underline',
    },
});

export default Signup;

