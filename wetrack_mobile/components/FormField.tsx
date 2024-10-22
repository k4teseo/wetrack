import { View, Text, TextInput } from 'react-native';
import React, { useState } from 'react';

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View className={`space-y-2 ${otherStyles}`}>
            <Text className="text-base text-gray-100 font-pmedium">{title}</Text>

            <View className="border-2 border-E2F5FE-500 w-full h-16 px-4 rounded-2xl bg-white-100 focus:border-secondary">
            <TextInput className="flex-1 text-black font-psemibold text-base"
            value={value}
            placeholder={placeholder}
            onChangeText={handleChangeText}
            placeholderTextColor="#7b7b8b"
            secureTextEntry={title === 'Password' && !showPassword}
            />
            </View>
        </View>
        )
    }

export default FormField;