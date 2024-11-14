// src/config/api.js

import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      // Android Emulator
      return 'http://10.0.2.2:8000';
    } else if (Platform.OS === 'ios') {
      // iOS Simulator
      return 'http://localhost:8000';
    }
    // Physical device -
    // return 'http://192.168.1.X:8000';
  }
  // Production environment
  // return 'https://your-production-domain.com';
};

export const API_URL = getBaseUrl();

// API endpoints
export const ENDPOINTS = {
  REGISTER: '/api/auth/register/',
  LOGIN: '/api/auth/login/',
  // will add others later
};

// API service for auth-related requests
export const authAPI = {
  register: async (userData) => {
    try {
      const response = await fetch(`${API_URL}${ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
};