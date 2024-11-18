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
            // Clear existing transactions and fetch fresh data
            await AsyncStorage.removeItem('transactions');
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

    // Rest of the methods remain the same...
    const value = {
        transactions,
        isLoading,
        error,
        fetchTransactions,
        addTransaction: async () => {},
        deleteTransaction: async () => {},
        updateTransaction: async () => {},
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