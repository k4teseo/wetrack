import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity,
    TextInput,
    Image
} from 'react-native';
import { useTransactions } from '../../context/TransactionContext';
const search = require("../../assets/icons/Search.png");

const TransactionItem = ({ item }) => {
    return (
        <View style={styles.transactionItem}>
            <View style={styles.transactionDetails}>
                <Text style={styles.category}>{item.category_display}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
            <Text style={[styles.amount, { color: '#D9534F'}]}>
                {item.currency} {Math.abs(item.amount).toFixed(2)}
            </Text>
        </View>
    );
};

const DateSection = ({ date, transactions, isExpanded, onToggle }) => {
    const totalAmount = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return (
        <View style={styles.dateSection}>
            <TouchableOpacity
                style={styles.dateSectionHeader}
                onPress={onToggle}
            >
                <View style={styles.dateHeaderLeft}>
                    <Text style={styles.date}>{date}</Text>
                </View>
                <Text style={[styles.totalAmount, { color: '#D9534F'}]}>
                    {transactions[0].currency} {Math.abs(totalAmount).toFixed(2)}
                </Text>
            </TouchableOpacity>

            {isExpanded && transactions.map((transaction) => (
                <TransactionItem
                    key={transaction.id}
                    item={transaction}
                />
            ))}
        </View>
    );
};

const TransactionPage = () => {
    const { transactions, isLoading, error, fetchTransactions } = useTransactions();
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedDates, setExpandedDates] = useState(new Set());

    // Initialize with filtered transactions
    const getFilteredAndSortedTransactions = () => {
        let filtered = [...transactions];

        // Apply search filter if there's a query
        if (searchQuery.trim() !== '') {
            filtered = filtered.filter(transaction =>
                transaction.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort by date (newest first)
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        return filtered;
    };

    // Group transactions by date
    const getGroupedTransactions = (filteredTransactions) => {
        return filteredTransactions.reduce((acc, transaction) => {
            const date = new Date(transaction.date).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(transaction);
            return acc;
        }, {});
    };

    useEffect(() => {
        loadTransactions();
    }, []);

    // Set initial expanded state for the first date
    useEffect(() => {
        const filtered = getFilteredAndSortedTransactions();
        const grouped = getGroupedTransactions(filtered);
        const dates = Object.keys(grouped);

        if (dates.length > 0 && !expandedDates.has(dates[0])) {
            setExpandedDates(new Set([dates[0]]));
        }
    }, [transactions]); // Only run when transactions change

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

    const toggleDateExpansion = (date) => {
        setExpandedDates(prev => {
            const newSet = new Set(prev);
            if (newSet.has(date)) {
                newSet.delete(date);
            } else {
                newSet.add(date);
            }
            return newSet;
        });
    };

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

    const filteredTransactions = getFilteredAndSortedTransactions();
    const groupedTransactions = getGroupedTransactions(filteredTransactions);
    const sortedDates = Object.keys(groupedTransactions);

    return (
        <View style={styles.container}>
            <FlatList
                data={sortedDates}
                keyExtractor={(date) => date}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                ListHeaderComponent={
                    <View style={styles.headerContainer}>
                        <View style={styles.searchContainer}>
                            <Image source={search} style={styles.searchIcon} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search descriptions..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                clearButtonMode="while-editing"
                            />
                        </View>
                    </View>
                }
                renderItem={({ item: date }) => (
                    <DateSection
                        date={date}
                        transactions={groupedTransactions[date]}
                        isExpanded={expandedDates.has(date)}
                        onToggle={() => toggleDateExpansion(date)}
                    />
                )}
                ListFooterComponent={<View style={styles.footerSpace} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No transactions found</Text>
                    </View>
                }
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
    },
    headerContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginTop: 12,
        paddingHorizontal: 15,
    },
    searchIcon: {
        marginRight: 8,
        height: 20,
        width: 20,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 8,
        fontSize: 18,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    dateSection: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    dateSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    dateHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    date: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
        marginLeft: 8,
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 17,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    icon: {
        marginRight: 16,
    },
    transactionDetails: {
        flex: 1,
    },
    category: {
        fontSize: 15,
        color: '#000000',
    },
    description: {
        fontSize: 15,
        color: '#6c757d',
    },
    amount: {
        fontSize: 17,
        fontWeight: 'bold',
    },
    footerSpace: {
        height: 80,
    },
    errorText: {
        fontSize: 16,
        color: '#dc3545',
        textAlign: 'center',
        padding: 16,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#6c757d',
    },
});

export default TransactionPage;