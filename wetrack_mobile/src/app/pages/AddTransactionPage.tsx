import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { useTransactions } from '../../context/TransactionContext';
import DateSelector from "../../components/DateSelector";
import CategorySelect from "../../components/CategorySelect";

const AddTransactionPage = ({ navigation }) => {
    const { addTransaction } = useTransactions();
    const [transactionDate, setTransactionDate] = useState(new Date());
    const [amount, setAmount] = useState("0.00");
    const [category, setCategory] = useState("1"); // Default to Transportation
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleKeyPress = (key) => {
        if (key === 'delete') {
            setAmount(prevAmount => {
                const amountInCents = Math.floor(parseFloat(prevAmount) * 100);
                const newAmount = Math.floor(amountInCents / 10) / 100;
                return newAmount.toFixed(2);
            });
        } else if (key === 'confirm') {
            handleConfirm();
        } else if (!isNaN(key)) {
            setAmount(prevAmount => {
                const amountInCents = Math.floor(parseFloat(prevAmount) * 100);
                const newAmountInCents = amountInCents * 10 + parseInt(key);
                return (newAmountInCents / 100).toFixed(2);
            });
        }
    };

    const handleConfirm = async () => {
        if (parseFloat(amount) === 0) {
            Alert.alert("Invalid Amount", "Please enter an amount greater than 0");
            return;
        }

        if (!description.trim()) {
            Alert.alert("Missing Description", "Please enter a description");
            return;
        }

        try {
            setIsSubmitting(true);
            console.log('Submitting transaction:', {
                date: transactionDate.toISOString(),
                amount: parseFloat(amount),
                category,
                description
            });

            const result = await addTransaction({
                date: transactionDate.toISOString(),
                amount: parseFloat(amount),
                category,
                description,
                currency: 'GBP' // Or let user select
            });

            console.log('Transaction result:', result);

            if (result.success) {
                Alert.alert(
                    "Success",
                    "Transaction added successfully",
                    [
                        {
                            text: "OK",
                            onPress: () => navigation.navigate('Transactions')
                        }
                    ]
                );
            } else {
                throw new Error(result.error || 'Failed to add transaction');
            }
        } catch (error) {
            console.error('Error adding transaction:', error);
            Alert.alert(
                "Error",
                error.message || "Failed to add transaction"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const onDateChange = (date) => {
        setTransactionDate(date);
    };

    const onCategoryChange = (selectedCategory) => {
        setCategory(selectedCategory);
    };

    return (
        <View style={styles.container}>
            {/* Date Section */}
            <View style={styles.dateContainer}>
                <DateSelector
                    selectedDate={transactionDate}
                    onDateChange={onDateChange}
                />
            </View>

            {/* Amount Section */}
            <Text style={styles.label}>Amount</Text>
            <View style={styles.amountContainer}>
                <Text style={styles.amount}>{amount}</Text>
                <Text style={styles.currencyCode}>GBP</Text>
            </View>

            {/* Category Section */}
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryContainer}>
                <CategorySelect
                    selectedCategory={category}
                    onCategoryChange={onCategoryChange}
                />
            </View>

            {/* Description Section */}
            <Text style={styles.label}>Description</Text>
            <TextInput
                style={styles.description}
                placeholderTextColor="#000000"
                placeholder="What was this for?"
                value={description}
                onChangeText={setDescription}
                editable={!isSubmitting}
            />

            {/* Numeric Keypad */}
            <FlatList
                data={['1', '2', '3', '4', '5', '6', '7', '8', '9', 'delete', '0', 'confirm']}
                numColumns={3}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.key,
                            item === 'confirm' && styles.confirmKey,
                            isSubmitting && styles.disabledKey
                        ]}
                        onPress={() => !isSubmitting && handleKeyPress(item)}
                        disabled={isSubmitting}
                    >
                        {item === 'delete' ? (
                            <Image source={require('../../assets/icons/Backspace.png')} />
                        ) : item === 'confirm' ? (
                            <Image source={require('../../assets/icons/CheckCircle.png')} />
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
    },
    description: {
        fontSize: 20,
        paddingLeft: 0,
        marginBottom: 2,
        borderBottomWidth: 1,
        borderColor: '#000000',
    },
    key: {
        flex: 1,
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
    disabledKey: {
        opacity: 0.5,
    },
    keyText: {
        fontSize: 31,
        color: '#000',
    },
});

export default AddTransactionPage;