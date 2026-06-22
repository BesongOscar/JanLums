import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { secureStorage } from '../services/secureStorage';
import { CONFIG } from '../config/environment';
import { EventEmitter } from '../utils/eventEmitter';
import { useAuthStore } from '../stores/authStore';

let isLoggingOut = false;

const api = axios.create({
  baseURL: CONFIG.apiUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await secureStorage.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401 && !isLoggingOut) {
      isLoggingOut = true;
      await secureStorage.clearTokens();
      await useAuthStore.getState().logout();
      EventEmitter.emit('AUTH_LOGOUT');
      isLoggingOut = false;
    }
    return Promise.reject(error);
  }
);

export default api;
