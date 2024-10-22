import React, { useState } from 'react';
import { Text, View } from 'react-native';
import FormField from '../components/FormField';

const Login = () => {
  const [form, setForm] = useState({
      username: '',
      password: '',
      })

  const handleLogin = () => {
    // Add your login logic here
    Alert.alert('Log In', `Username: ${username}\nPassword: ${password}`);
  };

  return (
    <View>
        <Text className="text-2xl text-white text-semibold mt=10 font-psemibold">Log in to WeTrack</Text>
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
    </View>
  );
};


export default Login;