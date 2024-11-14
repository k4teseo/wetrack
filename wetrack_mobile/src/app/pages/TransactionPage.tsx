import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const transactions = [
    {
        id: '1',
        date: 'Today',
        category: 'Transportation',
        description: 'Tube to class',
        amount: '-$8.74',
        icon: 'car',
        color: '#D9534F',
    },
    {
        id: '2',
        date: 'Today',
        category: 'Entertainment',
        description: 'Netflix Subscription',
        amount: '-$14.99',
        icon: 'tv',
        color: '#D9534F',
    },
    {
        id: '3',
        date: 'Today',
        category: 'Groceries',
        description: 'Groceries week of 10/18',
        amount: '-$33.26',
        icon: 'basket',
        color: '#D9534F',
    },
    {
        id: '4',
        date: 'October 17, 2024',
        category: 'Transportation',
        description: 'Tube to museum',
        amount: '-$5.42',
        icon: 'car',
        color: '#D9534F',
    },
    {
        id: '5',
        date: 'October 16, 2024',
        category: 'Entertainment',
        description: 'Spotify premium',
        amount: '-$20.99',
        icon: 'musical-notes',
        color: '#D9534F',
    },
    {
        id: '6',
        date: 'October 16, 2024',
        category: 'Transportation',
        description: 'Uber to airport',
        amount: '-$7.42',
        icon: 'car',
        color: '#D9534F',
    },
];

const TransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
        <Icon name={item.icon} size={30} color="#6c757d" style={styles.icon} />
        <View style={styles.transactionDetails}>
            <Text style={styles.category}>{item.category}</Text>
            <Text style={styles.description}>{item.description}</Text>
        </View>
        <Text style={[styles.amount, { color: item.color }]}>{item.amount}</Text>
    </View>
);

const TransactionPage = () => {
    // Group transactions by date
    const groupedTransactions = transactions.reduce((acc, transaction) => {
        if (!acc[transaction.date]) {
            acc[transaction.date] = [];
        }
        acc[transaction.date].push(transaction);
        return acc;
    }, {});

    return (
        <FlatList
            data={Object.keys(groupedTransactions)}
            keyExtractor={(date) => date}
            renderItem={({ item: date }) => (
                <View>
                    <Text style={styles.date}>{date}</Text>
                    {groupedTransactions[date].map((transaction) => (
                        <TransactionItem key={transaction.id} item={transaction} />
                    ))}
                </View>
            )}
            ListHeaderComponent={<Text style={styles.header}>Transactions</Text>}
            ListFooterComponent={<View style={styles.footerSpace} />}
        />
    );
};

const styles = StyleSheet.create({
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 16,
    },
    date: {
        fontSize: 18,
        fontWeight: '600',
        color: '#6c757d',
        marginTop: 16,
        marginLeft: 16,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: '#f0f0f0',
    },
    icon: {
        marginRight: 16,
    },
    transactionDetails: {
        flex: 1,
    },
    category: {
        fontSize: 16,
        fontWeight: '500',
    },
    description: {
        fontSize: 14,
        color: '#6c757d',
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    footerSpace: {
        height: 80,
    },
});

export default TransactionPage;