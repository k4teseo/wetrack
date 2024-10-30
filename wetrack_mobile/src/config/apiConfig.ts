export const API_URL = __DEV__
  ? 'http://10.0.2.2:8000'
  : 'https://your-production-url.com';

// src/services/authService.ts
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/apiConfig';
import { LoginCredentials, AuthResponse, UserData } from '../types/auth';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

interface RefreshTokenResponse {
  access: string;
}

// Refresh token handler
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const response = await axios.post<RefreshTokenResponse>(
          `${API_URL}/auth/token/refresh/`,
          { refresh: refreshToken }
        );

        const { access } = response.data;
        await AsyncStorage.setItem('accessToken', access);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`;
        }
        return api(originalRequest);
      } catch (err) {
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login/', credentials);

    const { access, refresh } = response.data;

    await AsyncStorage.multiSet([
      ['accessToken', access],
      ['refreshToken', refresh],
    ]);

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error.message;
    }
    throw error;
  }
};

export const register = async (userData: Partial<UserData>): Promise<UserData> => {
  try {
    const response = await api.post<UserData>('/auth/registration/', userData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error.message;
    }
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout/');
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error.message;
    }
    throw error;
  }
};

export default api;