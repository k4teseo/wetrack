import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
const backspace = require("../../assets/icons/Backspace.png");
const dropdown = require("../../assets/icons/DropDown.png");
const check = require("../../assets/icons/CheckCircle.png");
const pencil = require("../../assets/icons/PencilLine.png");
import DateSelector from "../../components/DateSelector.tsx";

const categories = [
    { id: '1', name: 'Transportation' },
    { id: '2', name: 'Entertainment' },
    { id: '3', name: 'Groceries' },
];

const AddTransaction = () => {
    const [transactionDate, setTransactionDate] = useState("");
    const [amount, setAmount] = useState("0.00");
    const [category, setCategory] = useState("Transportation");
    const [description, setDescription] = useState("");

    const handleKeyPress = (key) => {
        if (key === 'delete') {
            setAmount(amount.slice(0, -1) || "0.00");
        } else if (key === 'confirm') {
            console.log("Transaction saved:", { transactionDate, amount, category, description });
        } else {
            setAmount(prev => (prev === "0.00" ? key : prev + key));
        }
    };

    return (
        <View style={styles.container}>
            {/* Date Section */}
            <View style={styles.dateContainer}>
                <DateSelector />
                <Image source={pencil} style={styles.images}/>
            </View>

            {/* Amount Section */}
            <Text style={styles.label}>Amount</Text>
            <View style={styles.amountContainer}>
                <Text style={styles.amount}>{amount}</Text>
                <Text style={styles.currencyCode}>GBP</Text>
                <Image source={dropdown} style={styles.images}/>
            </View>

            {/* Category Section */}
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryContainer}>
                <Text style={styles.category}>{category}</Text>
                <Image source={dropdown} style={styles.images}/>
            </View>

            {/* Description Section */}
            <Text style={styles.label}>Description</Text>
            <TextInput
                style={styles.description}
                placeholderTextColor="#777"
                placeholder={"What was this for?"}
                value={description}
                onChangeText={(text) => setDescription(text)}
            >
            </TextInput>

            {/* Numeric Keypad */}
            <FlatList
                data={['1', '2', '3', '4', '5', '6', '7', '8', '9', 'delete', '0', 'confirm']}
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
                            <Image source={check} />
                        ) : (
                            <Text style={styles.keyText}>{item}</Text>
                        )}
                    </TouchableOpacity>
                )}
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
        marginBottom: 10,
    },
    images: {
        width: 23,
        height: 23,
        marginHorizontal: 8,
    },
    dateText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    label: {
        fontSize: 20,
        color: '#646464',
        marginTop: 20,
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#000000',
    },
    amount: {
        fontSize: 40,
        flex: 1,
        textAlign: 'left',
        color: '#000000',
    },
    currencyCode: {
        fontSize: 25,
        color: '#646464',
    },
    categoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        marginBottom: 12,
    },
    category: {
        fontSize: 20,
        color: '#000000',
    },
    description: {
        fontSize: 20,
        paddingLeft: 0,
    },
    key: {
        width: '30%',
        paddingVertical: 15,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    confirmKey: {
        backgroundColor: '#e0f7e0',
        borderRadius: 50,
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    keyText: {
        fontSize: 31,
        color: '#000',
    }
});

export default AddTransaction;