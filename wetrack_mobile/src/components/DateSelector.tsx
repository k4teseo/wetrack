// src/components/DateSelector.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import DatePicker from 'react-native-date-picker';
const edit = require("../assets/icons/NotePencil.png");

const DateSelector = ({ selectedDate: propSelectedDate, onDateChange }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(propSelectedDate || new Date());

    useEffect(() => {
        if (propSelectedDate) {
            setSelectedDate(propSelectedDate);
        }
    }, [propSelectedDate]);

    const handleToggleInput = () => {
        setShowDatePicker(true);
    };

    const handleConfirm = (date) => {
        console.log('Selected date:', date);
        setShowDatePicker(false);
        setSelectedDate(date);
        if (onDateChange) {
            onDateChange(date);
        }
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <View>
            <TouchableOpacity
                onPress={handleToggleInput}
                style={styles.touchable}
            >
                <Text style={styles.dateText}>
                    {formatDate(selectedDate)}
                </Text>
                <Image source={edit} style={styles.image}/>
            </TouchableOpacity>

            <DatePicker
                modal
                open={showDatePicker}
                date={selectedDate}
                maximumDate={new Date()}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={() => setShowDatePicker(false)}
                androidVariant="nativeAndroid"
                textColor="#000000"
            />

        </View>
    );
};

const styles = StyleSheet.create({
    touchable: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 25,
        color: '#000000',
    },
    image: {
        width: 25,
        height: 25,
        marginLeft: 8,
    }
});

export default DateSelector;