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
  USER_ME: '/auth/user/',
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
       console.log('Making login request to:', `${API_URL}${AUTH_ENDPOINTS.LOGIN}`);
       console.log('With credentials:', { username });

       const response = await fetch(`${API_URL}${AUTH_ENDPOINTS.LOGIN}`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           username: username,
           password: password,
         }),
       });

       const data = await response.json();
       console.log('Response status:', response.status);
       console.log('Response data:', data);

       if (!response.ok) {
         const error = new Error(data.non_field_errors?.[0] || data.detail || 'Login failed');
         error.response = { status: response.status, data };
         throw error;
       }

       // Store tokens - note the different key names from dj-rest-auth
       if (data.access) {  // Changed from access_token
         await AsyncStorage.setItem('access_token', data.access);
       }
       if (data.refresh) {  // Changed from refresh_token
         await AsyncStorage.setItem('refresh_token', data.refresh);
       }

       // If user data is included in login response
       if (data.user) {
         await AsyncStorage.setItem('user', JSON.stringify(data.user));
         return data;
       }

       // If not, fetch user profile
       try {
         const userProfile = await this.getUserProfile();
         return {
           ...data,
           user: userProfile
         };
       } catch (profileError) {
         console.error('Error fetching user profile:', profileError);
         return data;
       }
     } catch (error) {
       console.error('Login error:', error);
       throw error;
     }
   }

   static async getUserProfile() {
     try {
       const token = await AsyncStorage.getItem('access_token');

       if (!token) {
         throw new Error('No access token found');
       }

       console.log('Fetching user profile...');
       const response = await fetch(`${API_URL}${AUTH_ENDPOINTS.USER_ME}`, {
         headers: {
           'Authorization': `Bearer ${token}`,
           'Content-Type': 'application/json',
         },
       });

       console.log('Profile response status:', response.status);
       const data = await response.json();
       console.log('Profile data:', data);

       if (!response.ok) {
         throw new Error(data.detail || 'Failed to fetch user profile');
       }

       return data;
     } catch (error) {
       console.error('Get profile error:', error);
       throw error;
     }
   }

  static async refreshToken() {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token');

      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      console.log('Refreshing token...');
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
      console.error('Token refresh error:', error);
      // Clear tokens if refresh fails
      await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
      throw error;
    }
  }

  static async logout() {
    try {
      const token = await AsyncStorage.getItem('access_token');

      if (token) {
        console.log('Logging out...');
        await fetch(`${API_URL}${AUTH_ENDPOINTS.LOGOUT}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      // Clear stored tokens
      await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear tokens even if logout request fails
      await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
      throw error;
    }
  }

  // Helper method to check if user is authenticated
  static async isAuthenticated() {
    try {
      const token = await AsyncStorage.getItem('access_token');
      return !!token;
    } catch {
      return false;
    }
  }
}

export default AuthService;