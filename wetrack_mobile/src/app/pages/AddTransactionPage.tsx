import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
const pencil = require("../../assets/icons/PencilLine.png");
const backspace = require("../../assets/icons/Backspace.png");
const dropdown = require("../../assets/icons/DropDown.png");
import DateSelector from "../../components/DateSelector.tsx";

const categories = [
    { id: '1', name: 'Transportation', icon: 'car' },
    { id: '2', name: 'Entertainment', icon: 'tv' },
    { id: '3', name: 'Groceries', icon: 'basket' },
];

const AddTransaction = () => {
    const [date, setDate] = useState("Nov 6, 2024");
    const [amount, setAmount] = useState("0.00");
    const [category, setCategory] = useState("Transportation");
    const [description, setDescription] = useState("Tube to class");

    const handleKeyPress = (key) => {
        if (key === 'delete') {
            setAmount(amount.slice(0, -1) || "0.00");
        } else if (key === 'confirm') {
            console.log("Transaction saved:", { date, amount, category, description });
        } else {
            setAmount(prev => (prev === "0.00" ? key : prev + key));
        }
    };

    return (
        <View style={styles.container}>
            {/* Date Section */}
            <View style={styles.dateContainer}>
                <DateSelector/>
            </View>

            {/* Amount Section */}
            <Text style={styles.label}>Amount</Text>
            <View style={styles.amountContainer}>
                <Text style={styles.currency}>£</Text>
                <Text style={styles.amount}>{amount}</Text>
                <Text style={styles.currencyCode}>GBP</Text>
            </View>

            {/* Category Section */}
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryContainer}>
                <Text style={styles.category}>{category}</Text>
                <Image source={dropdown} />
            </View>

            {/* Description Section */}
            <Text style={styles.label}>Description</Text>
            <Text style={styles.description}>{description}</Text>

            {/* Numeric Keypad */}
            <FlatList
                data={['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'delete', 'confirm']}
                numColumns={3}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.key, item === 'confirm' && styles.confirmKey]}
                        onPress={() => handleKeyPress(item)}
                    >
                        {item === 'delete' ? (
                            <Image source={backspace} />
                        ) : item === 'confirm' ? (
                            <Image source={backspace} />
                        ) : (
                            <Text style={styles.keyText}>{item}</Text>
                        )}
                    </TouchableOpacity>
                )}
                ListFooterComponent={<View style={styles.footerSpace} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    images: {
        width: 23,
        height: 23,
    },
    dateText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    label: {
        fontSize: 16,
        color: '#777',
        marginTop: 20,
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#000',
    },
    currency: {
        fontSize: 20,
        color: '#777',
    },
    amount: {
        fontSize: 24,
        flex: 1,
        textAlign: 'center',
        color: '#000',
    },
    currencyCode: {
        fontSize: 16,
        color: '#777',
    },
    categoryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    category: {
        fontSize: 18,
        color: '#000',
    },
    description: {
        fontSize: 18,
        color: '#777',
        marginVertical: 8,
    },
    keypad: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 20,
    },
    key: {
        width: '30%',
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    confirmKey: {
        backgroundColor: '#e0f7e0',
        borderRadius: 10,
    },
    keyText: {
        fontSize: 24,
        color: '#000',
    },
    footerSpace: {
        height: 80,
    },
});

export default AddTransaction;