import React, { useState } from 'react';
import { Text, View, Button, StyleSheet, TouchableOpacity } from 'react-native';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';

const Login = ({ navigation }) => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
      username: '',
      password: '',
      })

  const submit = async () => {
      if (form.username === "" || form.password === "") {
        Alert.alert("Error", "Please fill in all fields");
      }
      setSubmitting(true);
  }

  return (
    <View style={styles.container}>
        <Text style={styles.title}>WeTrack</Text>
        <Text style={styles.subtitle}>Log In</Text>
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
                title="Log In"
                handlePress={submit}
                containerStyles="mt-7"
                isLoading={isSubmitting}
                onPress={() => navigation.navigate("Profile")}
        />

        <TouchableOpacity
            style={styles.signupButton}
            onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.signupText}>Don't have an account? Sign up</Text>
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
    signupButton: {
        alignSelf: 'center',
        padding: 10,
    },
    signupText: {
        color: '#000000',
        fontSize: 15,
        textDecorationLine: 'underline',
    },
});


export default Login;