// src/app/pages/TransactionPage.tsx
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTransactions } from '../../context/TransactionContext';

const TransactionItem = ({ item }) => {
    const getIconName = (category) => {
        const icons = {
            '1': 'car',
            '2': 'restaurant',
            '3': 'tv',
            '4': 'document-text',
            '5': 'cart',
            '6': 'basket'
        };
        return icons[item.category] || 'cash';
    };

    return (
        <View style={styles.transactionItem}>
            <Icon
                name={getIconName(item.category)}
                size={30}
                color="#6c757d"
                style={styles.icon}
            />
            <View style={styles.transactionDetails}>
                <Text style={styles.category}>{item.category_display}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
            <Text style={[
                styles.amount,
                { color: parseFloat(item.amount) < 0 ? '#D9534F' : '#5CB85C' }
            ]}>
                {item.currency} {Math.abs(item.amount).toFixed(2)}
            </Text>
        </View>
    );
};

const TransactionPage = () => {
    const { transactions, isLoading, error, fetchTransactions } = useTransactions();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchTransactions();
    }, []);

    console.log('Current transactions:', transactions);

    const loadTransactions = async () => {
        const result = await fetchTransactions();
        if (!result.success) {
            console.error('Failed to fetch transactions:', result.error);
        }
    };

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await loadTransactions();
        setRefreshing(false);
    }, []);

    if (isLoading && !refreshing) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    // Group transactions by date
    const groupedTransactions = transactions?.reduce((acc, transaction) => {
        const date = new Date(transaction.date).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(transaction);
        return acc;
    }, {}) || {};

    const sortedDates = Object.keys(groupedTransactions).sort((a, b) =>
        new Date(b) - new Date(a)
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={sortedDates}
                keyExtractor={(date) => date}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#0000ff']}
                    />
                }
                renderItem={({ item: date }) => (
                    <View>
                        <Text style={styles.date}>{date}</Text>
                        {groupedTransactions[date].map((transaction) => (
                            <TransactionItem
                                key={transaction.id}
                                item={transaction}
                            />
                        ))}
                    </View>
                )}
                ListHeaderComponent={
                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>Transactions</Text>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No transactions yet</Text>
                    </View>
                }
                ListFooterComponent={<View style={styles.footerSpace} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    headerContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    date: {
        fontSize: 18,
        fontWeight: '600',
        color: '#6c757d',
        marginTop: 16,
        marginLeft: 16,
        marginBottom: 8,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    icon: {
        marginRight: 16,
        width: 30,
        height: 30,
        textAlign: 'center',
    },
    transactionDetails: {
        flex: 1,
    },
    category: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
    description: {
        fontSize: 14,
        color: '#6c757d',
        marginTop: 2,
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    footerSpace: {
        height: 80,
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#6c757d',
        textAlign: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#dc3545',
        textAlign: 'center',
        padding: 16,
    },
});

export default TransactionPage;