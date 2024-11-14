import React, { useState } from 'react';
import { Button, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';

const DateSelector = () => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const handleToggleInput = () => {
        setShowDatePicker(true);
    };

    const formattedDate = selectedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <View>
            <TouchableOpacity onPress={handleToggleInput}>
                <TextInput style={styles.input}
                    placeholder={formattedDate}
                    placeholderTextColor="#000000"
                    editable={false}
                    value={selectedDate}
                />
            </TouchableOpacity>

            <DatePicker
                modal={true}
                open={showDatePicker}
                date={selectedDate}
                maximumDate={new Date()}
                mode='date'
                onConfirm={(date) => {
                    console.log(date);
                    if (date) {
                        setSelectedDate(date);
                    }
                    setShowDatePicker(false);
                }}
                onCancel={() => {
                    setShowDatePicker(!showDatePicker);
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        fontSize: 25,
    }
})

export default DateSelector;