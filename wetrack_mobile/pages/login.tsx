import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput } from 'react-native';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Add your login logic here
    Alert.alert('Log In', `Username: ${username}\nPassword: ${password}`);
  };

  return (
    <View>
      <Text style={styles.h1}>WeTrack</Text>
      <Text style={styles.h3}>Log In</Text>
      <Text>Username</Text>
          <TextInput/>
    </View>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'black',
  },

  h3: {
      fontSize: 30,
      fontWeight: 'bold',
      color: 'black',
      },
  });

export default Login;