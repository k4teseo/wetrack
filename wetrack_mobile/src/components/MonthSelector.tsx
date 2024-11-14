import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native';
import MonthPicker from 'react-native-month-year-picker';
const dropdown = require("../assets/icons/DropDown.png");

const App = () => {
    const [month, setMonth] = useState(new Date());
    const [show, setShow] = useState(false);

    const showPicker = useCallback((value) => setShow(value), []);

    const onValueChange = useCallback(
        (event, newMonth) => {
        const selectedMonth = newMonth || month;

        showPicker(false);
        setMonth(selectedMonth);
        },
        [month, showPicker],
    );

    const formattedMonth = month.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
    });

    return (
        <View>
        <TouchableOpacity style={styles.container} onPress={() => showPicker(true)}>
            <TextInput
                style={styles.input}
                placeholder={formattedMonth}
                placeholderTextColor="#000000"
                editable={false}
                value={month}
            />
            <Image source={dropdown} style={styles.image}/>
        </TouchableOpacity>

        {show && (
            <MonthPicker
            onChange={onValueChange}
            value={month}
            maximumDate={new Date()}
            />
        )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        fontSize: 20,
    },
    image: {
        width: 22,
        height: 22,
    }
})

export default App;