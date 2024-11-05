import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import AuthService from '../../services/authService';

const Signup = ({ navigation }) => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password1: "", // dj-rest-auth requires password1 and password2
    password2: "",
    email: "",
    name: "",
  });

  const validateForm = () => {
    if (!form.username) {
      Alert.alert('Error', 'Username is required');
      return false;
    }
    if (!form.password1) {
      Alert.alert('Error', 'Password is required');
      return false;
    }
    if (form.password1 !== form.password2) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const submit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const userData = {
        username: form.username,
        password1: form.password1,
        password2: form.password2,
        email: form.email,
        name: form.name,
      };

      await AuthService.register(userData);

      Alert.alert(
        'Success',
        'Account created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } catch (error) {
      let errorMessage = 'Registration failed';

      if (error.response?.data) {
        // Handle specific error messages
        const errors = error.response.data;
        if (errors.username) errorMessage = errors.username[0];
        else if (errors.password1) errorMessage = errors.password1[0];
        else if (errors.non_field_errors) errorMessage = errors.non_field_errors[0];
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>WeTrack</Text>
        <Text style={styles.subtitle}>Sign Up</Text>

        <FormField
          title="Username"
          value={form.username}
          handleChangeText={(text) => setForm({...form, username: text})}
          otherStyles="mt-7"
        />

        <FormField
          title="Email (optional)"
          value={form.email}
          handleChangeText={(text) => setForm({...form, email: text})}
          otherStyles="mt-7"
          keyboardType="email-address"
        />

        <FormField
          title="Name"
          value={form.name}
          handleChangeText={(text) => setForm({...form, name: text})}
          otherStyles="mt-7"
        />

        <FormField
          title="Password"
          value={form.password1}
          handleChangeText={(text) => setForm({...form, password1: text})}
          otherStyles="mt-7"
          secureTextEntry
        />

        <FormField
          title="Confirm Password"
          value={form.password2}
          handleChangeText={(text) => setForm({...form, password2: text})}
          otherStyles="mt-7"
          secureTextEntry
        />

        <CustomButton
          title="Sign Up"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={isSubmitting}
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")}
          disabled={isSubmitting}
        >
          <Text style={styles.loginText}>
            Already have an account? Log in
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 14,
  },
  title: {
    fontSize: 37,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 65,
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 25,
    color: '#000000',
    marginBottom: 20,
  },
  loginButton: {
    alignSelf: 'center',
    padding: 10,
    marginTop: 20,
  },
  loginText: {
    color: '#000000',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});

export default Signup;