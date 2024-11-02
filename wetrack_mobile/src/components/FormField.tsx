import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";

import { eye, eyeHide } from "../constants/icons.tsx";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
      <View style={[styles.container, otherStyles]}>
        <Text style={styles.label}>{title}</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#7B7B8B"
            onChangeText={handleChangeText}
            secureTextEntry={title === "Password" && !showPassword}
            {...props}
          />

          {title === "Password" && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Image
                source={!showPassword ? eye : eyeHide}
                style={styles.icon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      marginTop: 30,
    },
    label: {
      fontSize: 18,
      color: "#000000",
    },
    inputContainer: {
      height: 55,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#D9D9D9',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    input: {
      flex: 1,
      color: "#000000",
      fontSize: 18,
    },
    icon: {
      width: 24,
      height: 24,
      marginLeft: 10,
    },
  });

  export default FormField;