import React, { useState } from 'react';
import { Text, View } from 'react-native';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';

const Signup = () => {
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

        <CustomButton
        title="Sign Up"
        handlePress={submit}
        containerStyles="mt-7"
        isLoading={isSubmitting}
        />
    </View>
  );
};


export default Signup;

