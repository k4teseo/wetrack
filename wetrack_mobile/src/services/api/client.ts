import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../../config/apiConfig';

const api: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Add CORS headers if needed (based on your Django CORS_ALLOW_ALL_ORIGINS = True)
if (environment.dev) {
  api.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
}

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem('wetrack-auth');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('wetrack-refresh-token');
        const response = await axios.post(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN}`,
          { refresh: refreshToken }
        );

        const { access } = response.data;
        await AsyncStorage.setItem('wetrack-auth', access);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`;
        }
        return api(originalRequest);
      } catch (err) {
        await AsyncStorage.multiRemove(['wetrack-auth', 'wetrack-refresh-token']);
        // Handle logout/redirect to login
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;