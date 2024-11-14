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
     const errors = [];

     if (!form.username) {
       errors.push('Username is required');
     }
     if (!form.email) {
       errors.push('Email is required');
     } else if (!/\S+@\S+\.\S+/.test(form.email)) {
       errors.push('Please enter a valid email address');
     }
     if (!form.password1) {
       errors.push('Password is required');
     } else if (form.password1.length < 8) {
       errors.push('Password must be at least 8 characters long');
     }
     if (!form.password2) {
       errors.push('Please confirm your password');
     }
     if (form.password1 !== form.password2) {
       errors.push('Passwords do not match');
     }
     // Add password strength validation
     if (form.password1 && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(form.password1)) {
       errors.push('Password must contain at least one letter and one number');
     }

     if (errors.length > 0) {
       Alert.alert('Validation Error', errors.join('\n\n'));
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
          title="Email"
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