import { Platform } from 'react-native';

const DEV_API_URLS = {
  // For Android Emulator connecting to Django development server
  ANDROID: 'http://10.0.2.2:8000',
  // For iOS Simulator
  IOS: 'http://localhost:8000',
  // For physical device testing (replace with your computer's IP address)
  // DEVICE: 'http://192.168.1.xxx:8000'
};

export type Environment = {
  dev: boolean;
  apiUrl: string;
  apiTimeout: number;
};

const getDeviceSpecificUrl = (): string => {
  return Platform.select({
    ios: DEV_API_URLS.IOS,
    android: DEV_API_URLS.ANDROID,
    // Add your local IP for physical device testing if needed
  }) || DEV_API_URLS.ANDROID;
};

export const environment: Environment = {
  dev: __DEV__,
  apiUrl: getDeviceSpecificUrl(),
  apiTimeout: 30000, // 30 seconds
};

// src/config/apiConfig.ts
import { environment } from './environment';

export const API_CONFIG = {
  BASE_URL: environment.apiUrl,
  TIMEOUT: environment.apiTimeout,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/dj-rest-auth/login/',          // matches your dj-rest-auth urls
      REGISTER: '/dj-rest-auth/registration/', // matches your dj-rest-auth urls
      REFRESH_TOKEN: '/dj-rest-auth/token/refresh/',
      LOGOUT: '/dj-rest-auth/logout/',
      USER: '/dj-rest-auth/user/',
    },
    TRACKER: {
      TRANSACTIONS: '/api/tracker/',  // assuming this matches your tracker app urls
    },
    CURRENCY: {
      RATES: '/api/currency/',        // assuming this matches your currency app urls
    },
  },
  HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};