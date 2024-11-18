import React, { createContext, useState, useContext, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthService from '../services/authService';

const API_URL = __DEV__
  ? Platform.OS === 'android'
    ? 'http://10.0.2.2:8000'
    : 'http://localhost:8000'
  : 'https://wetrack.com';

const API_ENDPOINTS = {
    TRANSACTIONS: '/api/transactions/',
};

const TransactionContext = createContext({
    transactions: [],
    isLoading: false,
    error: null,
    addTransaction: async () => {},
    fetchTransactions: async () => {},
    deleteTransaction: async () => {},
    updateTransaction: async () => {},
});

export const TransactionProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializeTransactions = async () => {
            const isAuth = await AuthService.isAuthenticated();
            if (isAuth) {
                await fetchTransactions();
            }
        };

        initializeTransactions();
    }, []);

    const getAuthHeaders = async () => {
        try {
            const token = await AuthService.getToken();
            if (!token) {
                throw new Error('No authentication token found');
            }
            return {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            };
        } catch (error) {
            console.error('Error getting auth headers:', error);
            throw error;
        }
    };

    const handleAuthError = async (error) => {
        if (error.message.includes('401')) {
            try {
                await AuthService.refreshAccessToken();
                return true;
            } catch (refreshError) {
                await AuthService.logout();
                return false;
            }
        }
        return false;
    };

    const fetchTransactions = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_URL}${API_ENDPOINTS.TRANSACTIONS}`, {
                headers,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    const retried = await handleAuthError(new Error('401'));
                    if (retried) {
                        return fetchTransactions();
                    }
                }
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setTransactions(data);
            await AsyncStorage.setItem('transactions', JSON.stringify(data));
            return { success: true, data };
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    const addTransaction = async (transactionData) => {
        setIsLoading(true);
        setError(null);
        try {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_URL}${API_ENDPOINTS.TRANSACTIONS}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(transactionData),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    const retried = await handleAuthError(new Error('401'));
                    if (retried) {
                        return addTransaction(transactionData);
                    }
                }
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            const newTransaction = await response.json();

            // Update local state with the new transaction
            const updatedTransactions = [...transactions, newTransaction];
            setTransactions(updatedTransactions);

            // Update AsyncStorage
            await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));

            return { success: true, data: newTransaction };
        } catch (error) {
            console.error('Error adding transaction:', error);
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    const deleteTransaction = async (transactionId) => {
        setIsLoading(true);
        setError(null);
        try {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_URL}${API_ENDPOINTS.TRANSACTIONS}${transactionId}/`, {
                method: 'DELETE',
                headers,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    const retried = await handleAuthError(new Error('401'));
                    if (retried) {
                        return deleteTransaction(transactionId);
                    }
                }
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            // Update local state
            const updatedTransactions = transactions.filter(t => t.id !== transactionId);
            setTransactions(updatedTransactions);

            // Update AsyncStorage
            await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));

            return { success: true };
        } catch (error) {
            console.error('Error deleting transaction:', error);
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    const updateTransaction = async (transactionId, updateData) => {
        setIsLoading(true);
        setError(null);
        try {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_URL}${API_ENDPOINTS.TRANSACTIONS}${transactionId}/`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    const retried = await handleAuthError(new Error('401'));
                    if (retried) {
                        return updateTransaction(transactionId, updateData);
                    }
                }
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            const updatedTransaction = await response.json();

            // Update local state
            const updatedTransactions = transactions.map(t =>
                t.id === transactionId ? updatedTransaction : t
            );
            setTransactions(updatedTransactions);

            // Update AsyncStorage
            await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));

            return { success: true, data: updatedTransaction };
        } catch (error) {
            console.error('Error updating transaction:', error);
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        transactions,
        isLoading,
        error,
        fetchTransactions,
        addTransaction,
        deleteTransaction,
        updateTransaction,
    };

    return (
        <TransactionContext.Provider value={value}>
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransactions = () => {
    const context = useContext(TransactionContext);
    if (context === undefined) {
        throw new Error('useTransactions must be used within a TransactionProvider');
    }
    return context;
};

export default TransactionContext;