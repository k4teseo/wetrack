import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity, Modal, Button, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MonthSelector from "../../components/MonthSelector.tsx";
import { useTransactions } from '../../context/TransactionContext';
import AuthService from '../../services/authService';

const BudgetPage = () => {
    const [budget, setBudget] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [inputValue, setInputValue] = useState(budget.toString());
    const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));
    const [totalSpent, setTotalSpent] = useState(0);
    const [userId, setUserId] = useState(null);
    const { transactions } = useTransactions();

    // Get user ID when component mounts
    useEffect(() => {
        const getUserId = async () => {
            const user = await AuthService.getCurrentUser();
            if (user && user.id) {
                setUserId(user.id);
            }
        };
        getUserId();
    }, []);

    // Load saved budget when component mounts, month changes, or userId changes
    useEffect(() => {
        if (userId) {
            loadBudget();
        }
    }, [currentMonth, userId]);

    useEffect(() => {
        calculateMonthlySpending();
    }, [transactions, currentMonth]);

    const loadBudget = async () => {
        try {
            const savedBudget = await AsyncStorage.getItem(`budget_${userId}_${currentMonth}`);
            if (savedBudget !== null) {
                setBudget(parseFloat(savedBudget));
                setInputValue(savedBudget);
            } else {
                setBudget(0);
                setInputValue('0');
            }
        } catch (error) {
            console.error('Error loading budget:', error);
        }
    };

    const handleSave = async () => {
        if (!userId) return;

        const formattedValue = parseFloat(inputValue) || 0;
        setBudget(formattedValue);
        try {
            await AsyncStorage.setItem(`budget_${userId}_${currentMonth}`, formattedValue.toString());
        } catch (error) {
            console.error('Error saving budget:', error);
        }
        setModalVisible(false);
    };

    const calculateMonthlySpending = () => {
        if (!transactions || transactions.length === 0) {
            setTotalSpent(0);
            return;
        }

        // Filter transactions for the current month
        const monthlyTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            const transactionMonth = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
            return transactionMonth === currentMonth;
        });

        console.log('Filtered transactions for month:', monthlyTransactions);

        // Calculate total spending
        const total = monthlyTransactions.reduce((sum, transaction) => {
            const amount = Math.abs(parseFloat(transaction.amount));
            console.log(`Processing transaction: ${transaction.description}, amount: ${amount}`);
            return sum + amount;
        }, 0);

        console.log('Calculated total:', total);
        setTotalSpent(total);
    };

    const handleMonthChange = (month) => {
        console.log('Month changed to:', month); // Debug log
        setCurrentMonth(month);
    };

    const remainingBudget = budget - totalSpent;
    const percentageSpent = budget > 0 ? (totalSpent / budget) * 100 : 0;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Budget</Text>
                <MonthSelector onMonthChange={handleMonthChange} />
            </View>

            <View style={styles.goalContainer}>
            <Text style={styles.goalText}>Monthly Budget</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text style={styles.amountText}>£{budget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                </TouchableOpacity>


                {/* Progress Bar */}
                <View style={styles.progressBarContainer}>
                    <View
                        style={[
                            styles.progressBar,
                            {
                                width: `${Math.min(percentageSpent, 100)}%`,
                                backgroundColor: percentageSpent > 100 ? '#D9534F' : '#5CB85C'
                            }
                        ]}
                    />
                </View>

                {/* Progress Label */}
                <Text style={styles.progressLabel}>
                    {percentageSpent.toFixed(1)}% of budget used
                </Text>

                {/* Spending Summary */}
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Spent</Text>
                        <Text style={[styles.summaryAmount, { color: '#D9534F' }]}>
                            £{totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Remaining</Text>
                        <Text style={[styles.summaryAmount, { color: remainingBudget >= 0 ? '#5CB85C' : '#D9534F' }]}>
                            £{(remainingBudget).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Text>
                    </View>
                </View>
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
                        <Text style={styles.modalTitle}>Set Monthly Budget</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter amount"
                            keyboardType="numeric"
                            value={inputValue}
                            onChangeText={setInputValue}
                        />
                        <View style={styles.modalButtons}>
                            <Button title="Cancel" onPress={() => setModalVisible(false)} color="#6c757d" />
                            <View style={styles.buttonSpacer} />
                            <Button title="Save" onPress={handleSave} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 14,
        backgroundColor: '#fff',
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
        marginVertical: 20,
    },
    progressBarContainer: {
        width: '100%',
        height: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
        marginVertical: 20,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#5CB85C',
        borderRadius: 4,
    },
    progressLabel: {
        fontSize: 14,
        color: '#6E6B65',
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 70,
    },
    summaryItem: {
        alignItems: 'center',
        flex: 1,
    },
    summaryLabel: {
        fontSize: 16,
        color: '#6E6B65',
        marginBottom: 5,
    },
    summaryAmount: {
        fontSize: 24,
        fontWeight: '600',
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
        color: '#000',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    buttonSpacer: {
        width: 20,
    },
});

export default BudgetPage;