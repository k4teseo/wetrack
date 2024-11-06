// src/services/authService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const API_URL = __DEV__
  ? Platform.OS === 'android'
    ? 'http://10.0.2.2:8000'
    : 'http://localhost:8000'
  : 'https://wetrack.com';

const AUTH_ENDPOINTS = {
  REGISTER: '/auth/registration/',
  LOGIN: '/auth/login/',
  LOGOUT: '/auth/logout/',
  USER_ME: '/auth/users/me/',
  REFRESH_TOKEN: '/auth/token/refresh/',
};

class AuthService {
  static async register(userData) {
    try {
//      console.log('Making registration request to:', `${API_URL}${AUTH_ENDPOINTS.REGISTER}`);
//      console.log('With data:', userData);

      const response = await fetch(`${API_URL}${AUTH_ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

//      console.log('Response status:', response.status);
      const data = await response.json();
//      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }

      // Store tokens if they're included in the response
      if (data.access_token) {
        await AsyncStorage.setItem('access_token', data.access_token);
      }
      if (data.refresh_token) {
        await AsyncStorage.setItem('refresh_token', data.refresh_token);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  static async login(username, password) {
    try {
      const response = await fetch(`${API_URL}${AUTH_ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      // Store tokens
      await AsyncStorage.setItem('access_token', data.access_token);
      await AsyncStorage.setItem('refresh_token', data.refresh_token);

      return data;
    } catch (error) {
      throw error;
    }
  }

  static async logout() {
    try {
      const token = await AsyncStorage.getItem('access_token');

      await fetch(`${API_URL}${AUTH_ENDPOINTS.LOGOUT}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Clear stored tokens
      await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
    } catch (error) {
      throw error;
    }
  }

  static async getUserProfile() {
    try {
      const token = await AsyncStorage.getItem('access_token');

      const response = await fetch(`${API_URL}${AUTH_ENDPOINTS.USER_ME}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to fetch user profile');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  static async refreshToken() {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token');

      const response = await fetch(`${API_URL}${AUTH_ENDPOINTS.REFRESH_TOKEN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Token refresh failed');
      }

      await AsyncStorage.setItem('access_token', data.access);
      return data.access;
    } catch (error) {
      throw error;
    }
  }
}

export default AuthService;