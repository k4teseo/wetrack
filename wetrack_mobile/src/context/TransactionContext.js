// src/context/TransactionContext.js
import React, { createContext, useState, useContext } from 'react';
import { Platform } from 'react-native';
import AuthService from '../services/authService';  // Make sure path is correct

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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const getAuthHeaders = async () => {
        try {
            const token = await AuthService.getToken();
            console.log('Got token for request:', token); // Debug log
            if (!token) {
                throw new Error('No authentication token found');
            }
            return {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Using Bearer for JWT
            };
        } catch (error) {
            console.error('Error getting auth headers:', error);
            throw error;
        }
    };

    const handleAuthError = async (error) => {
        if (error.message.includes('401')) {
            try {
                // Try to refresh the token
                await AuthService.refreshAccessToken();
                // Retry the original request
                return true;
            } catch (refreshError) {
                // If refresh fails, logout
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
            console.log('Fetching transactions...');
            const headers = await getAuthHeaders();
            console.log('Using headers:', headers);

            const response = await fetch(`${API_URL}${API_ENDPOINTS.TRANSACTIONS}`, {
                headers,
            });

            console.log('Transaction response status:', response.status);

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
            // console.log('Received transactions:', data);
            setTransactions(data);
            return { success: true, data };
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    const addTransaction = async (transaction) => {
        setIsLoading(true);
        setError(null);
        try {
            console.log('Adding transaction:', transaction);
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_URL}${API_ENDPOINTS.TRANSACTIONS}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(transaction),
            });

            console.log('Add transaction response status:', response.status);

            if (!response.ok) {
                if (response.status === 401) {
                    const retried = await handleAuthError(new Error('401'));
                    if (retried) {
                        return addTransaction(transaction);
                    }
                }
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Added transaction response:', data);
            setTransactions(prevTransactions => [...prevTransactions, data]);
            return { success: true, data };
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
            console.log('Deleting transaction:', transactionId);
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
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setTransactions(prevTransactions =>
                prevTransactions.filter(transaction => transaction.id !== transactionId)
            );
            return { success: true };
        } catch (error) {
            console.error('Error deleting transaction:', error);
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    const updateTransaction = async (transactionId, updatedData) => {
        setIsLoading(true);
        setError(null);
        try {
            console.log('Updating transaction:', transactionId, updatedData);
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_URL}${API_ENDPOINTS.TRANSACTIONS}${transactionId}/`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    const retried = await handleAuthError(new Error('401'));
                    if (retried) {
                        return updateTransaction(transactionId, updatedData);
                    }
                }
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Updated transaction response:', data);
            setTransactions(prevTransactions =>
                prevTransactions.map(transaction =>
                    transaction.id === transactionId ? data : transaction
                )
            );
            return { success: true, data };
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
        addTransaction,
        fetchTransactions,
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