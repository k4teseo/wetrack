import React, { useState } from 'react';
import { Text, View, Button } from 'react-native';
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
    <View>
        <Text>WeTrack</Text>
        <Text>Log In</Text>
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

        <Button
            title="Don't have an account? Sign up"
            onPress={() => navigation.navigate("Signup")}
        />

        <CustomButton
        title="Log In"
        handlePress={submit}
        containerStyles="mt-7"
        isLoading={isSubmitting}
        />

    </View>
  );
};


export default Login;