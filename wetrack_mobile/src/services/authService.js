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
  USER_ME: '/auth/user/',
};

class AuthService {
  async login(username, password) {
    try {
      const response = await fetch(`${API_URL}${AUTH_ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw { response: { data } };
      }

      // Clear any existing transaction data
      await AsyncStorage.removeItem('transactions');

      // Store both tokens
      await AsyncStorage.setItem('accessToken', data.access);
      await AsyncStorage.setItem('refreshToken', data.refresh);

      // Store user data if it's included in the response
      if (data.user) {
        const user = {
          ...data.user,
          accessToken: data.access,
          refreshToken: data.refresh
        };
        await AsyncStorage.setItem('user', JSON.stringify(user));
        return { user };
      }

      return {
        user: {
          username,
          accessToken: data.access,
          refreshToken: data.refresh
        }
      };
    } catch (error) {
      console.error('Login error details:', error);
      throw error;
    }
  }

   async register(userData) {
      try {
        const response = await fetch(`${API_URL}${AUTH_ENDPOINTS.REGISTER}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw { response: { data } };
        }

        return data;
      } catch (error) {
        console.error('Registration error details:', error);
        throw error;
      }
    }

  async logout() {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('transactions'); // Clear transactions on logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Rest of the methods remain unchanged
  async getUserProfile() {
    try {
      const token = await this.getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_URL}${AUTH_ENDPOINTS.USER_ME}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const userData = await response.json();
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
      return await this.getUserProfile();
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async getToken() {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  async getRefreshToken() {
    try {
      return await AsyncStorage.getItem('refreshToken');
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  async refreshAccessToken() {
    try {
      const refreshToken = await this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      const response = await fetch(`${API_URL}/auth/jwt/refresh/`, {
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
        throw new Error('Failed to refresh token');
      }

      await AsyncStorage.setItem('accessToken', data.access);
      return data.access;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  async isAuthenticated() {
    try {
      const token = await this.getToken();
      return Boolean(token);
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  }
}

export default new AuthService();