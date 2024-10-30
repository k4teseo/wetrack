import React, { useState } from 'react';
import { Text, View } from 'react-native';
import FormField from '../../components/FormField';

const Signup = () => {
    const [form, setForm] = useState({
        name: '',
        username: '',
        password: '',
        })

    const handleSignup = () => {
        // Add signup logic here
        Alert.alert('Signup', `Name: ${name}\nUsername: ${username}\nPassword: ${password}`);
    };

return (
    <View>
        <Text>WeTrack</Text>
        <Text>Sign Up</Text>
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
    </View>
  );
};

export default Signup;

