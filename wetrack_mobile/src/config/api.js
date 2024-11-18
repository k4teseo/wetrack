import { Platform } from 'react-native';

export const API_URL = __DEV__
  ? Platform.OS === 'android'
    ? 'http://10.0.2.2:8000'
    : 'http://localhost:8000'
  : 'https://wetrack.com';

// API endpoints
export const ENDPOINTS = {
  // Auth endpoints
  REGISTER: '/api/auth/register/',
  LOGIN: '/api/auth/login/',

};

// Common headers
const getHeaders = (token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Auth API service
export const authAPI = {
  register: async (userData) => {
    try {
      const response = await fetch(`${API_URL}${ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}${ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};

// Transaction API service
export const transactionAPI = {
  getAll: async (token) => {
    try {
      const response = await fetch(`${API_URL}${ENDPOINTS.TRANSACTIONS}`, {
        method: 'GET',
        headers: getHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch transactions');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  create: async (transactionData, token) => {
    try {
      const response = await fetch(`${API_URL}${ENDPOINTS.TRANSACTIONS}`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create transaction');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  update: async (id, transactionData, token) => {
    try {
      const response = await fetch(`${API_URL}${ENDPOINTS.TRANSACTIONS}${id}/`, {
        method: 'PUT',
        headers: getHeaders(token),
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update transaction');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  delete: async (id, token) => {
    try {
      const response = await fetch(`${API_URL}${ENDPOINTS.TRANSACTIONS}${id}/`, {
        method: 'DELETE',
        headers: getHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete transaction');
      }

      return true;
    } catch (error) {
      throw error;
    }
  },
};

// Categories API service
export const categoryAPI = {
  getAll: async (token) => {
    try {
      const response = await fetch(`${API_URL}${ENDPOINTS.CATEGORIES}`, {
        method: 'GET',
        headers: getHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch categories');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  create: async (categoryData, token) => {
    try {
      const response = await fetch(`${API_URL}${ENDPOINTS.CATEGORIES}`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create category');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};

// Expenses API service
export const expenseAPI = {
  getAll: async (token) => {
    try {
      const response = await fetch(`${API_URL}${ENDPOINTS.EXPENSES}`, {
        method: 'GET',
        headers: getHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch expenses');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  create: async (expenseData, token) => {
    try {
      const response = await fetch(`${API_URL}${ENDPOINTS.EXPENSES}`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(expenseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create expense');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  update: async (id, expenseData, token) => {
    try {
      const response = await fetch(`${API_URL}${ENDPOINTS.EXPENSES}${id}/`, {
        method: 'PUT',
        headers: getHeaders(token),
        body: JSON.stringify(expenseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update expense');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  delete: async (id, token) => {
    try {
      const response = await fetch(`${API_URL}${ENDPOINTS.EXPENSES}${id}/`, {
        method: 'DELETE',
        headers: getHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete expense');
      }

      return true;
    } catch (error) {
      throw error;
    }
  },

  // Additional methods for filtering and analytics
  getByDateRange: async (startDate, endDate, token) => {
    try {
      const response = await fetch(
        `${API_URL}${ENDPOINTS.EXPENSES}?start_date=${startDate}&end_date=${endDate}`,
        {
          method: 'GET',
          headers: getHeaders(token),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch expenses by date range');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getByCategory: async (categoryId, token) => {
    try {
      const response = await fetch(
        `${API_URL}${ENDPOINTS.EXPENSES}?category=${categoryId}`,
        {
          method: 'GET',
          headers: getHeaders(token),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch expenses by category');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};

// Fixed Costs API service
export const fixedCostAPI = {
  getAll: async (token) => {
    try {
      const response = await fetch(`${API_URL}${ENDPOINTS.FIXED_COSTS}`, {
        method: 'GET',
        headers: getHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch fixed costs');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  create: async (fixedCostData, token) => {
    try {
      const response = await fetch(`${API_URL}${ENDPOINTS.FIXED_COSTS}`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(fixedCostData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create fixed cost');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  update: async (id, fixedCostData, token) => {
    try {
      const response = await fetch(`${API_URL}${ENDPOINTS.FIXED_COSTS}${id}/`, {
        method: 'PUT',
        headers: getHeaders(token),
        body: JSON.stringify(fixedCostData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update fixed cost');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  delete: async (id, token) => {
    try {
      const response = await fetch(`${API_URL}${ENDPOINTS.FIXED_COSTS}${id}/`, {
        method: 'DELETE',
        headers: getHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete fixed cost');
      }

      return true;
    } catch (error) {
      throw error;
    }
  },
};