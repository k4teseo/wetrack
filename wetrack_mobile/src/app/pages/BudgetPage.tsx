import React, { useState } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity, Modal, Button, Image } from 'react-native';
import MonthSelector from "../../components/MonthSelector.tsx";
const pencil = require("../../assets/icons/NotePencil.png");

const BudgetPage = () => {
    const [budget, setBudget] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [inputValue, setInputValue] = useState(budget.toString());

    const handleSave = () => {
        const formattedValue = parseFloat(inputValue) || 0;
        setBudget(formattedValue);
        setModalVisible(false);
    };

    const formattedBudget = budget.toLocaleString('en-US');

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Budget</Text>
                <MonthSelector />
            </View>

            <View style={styles.goalContainer}>
                <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                    <Text style={styles.goalText}>Spending Goal</Text>
                    <Image source={pencil} style={styles.image} />
                </TouchableOpacity>
                <Text style={styles.amountText}>${formattedBudget}</Text>
            </View>

            {/* Modal for entering budget */}
            <Modal
                transparent
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Set Spending Goal</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter amount"
                            keyboardType="numeric"
                            value={inputValue}
                            onChangeText={setInputValue}
                        />
                        <Button title="Save" onPress={handleSave} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 14,
    },
    title: {
        fontSize: 37,
        color: '#000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 50,
    },
    goalContainer: {
        alignItems: 'center',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 22,
        height: 22,
        marginLeft: 8,
    },
    goalText: {
        fontSize: 22,
        color: '#6E6B65',
    },
    amountText: {
        fontSize: 40,
        color: '#000',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 10,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
});

export default BudgetPage;
