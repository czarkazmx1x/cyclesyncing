import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';

// API base URL - update this based on your environment
const API_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://api.cyclesyncapp.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding token
api.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    try {
      // Get token from secure storage
      const token = await EncryptedStorage.getItem('auth_token');
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // If error is 401 (Unauthorized) and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest?.headers?._retry) {
      // Mark that we've tried refreshing
      if (originalRequest && originalRequest.headers) {
        originalRequest.headers._retry = true;
      }
      
      try {
        // Get refresh token
        const refreshToken = await EncryptedStorage.getItem('refresh_token');
        
        if (!refreshToken) {
          // No refresh token, user needs to login again
          await clearAuthData();
          return Promise.reject(error);
        }
        
        // Call refresh token endpoint
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });
        
        if (response.data.token) {
          // Store new tokens
          await EncryptedStorage.setItem('auth_token', response.data.token);
          await EncryptedStorage.setItem('refresh_token', response.data.refreshToken);
          
          // Update header and retry original request
          if (originalRequest && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed, clear auth data
        await clearAuthData();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper to clear auth data on logout/errors
const clearAuthData = async () => {
  try {
    await EncryptedStorage.removeItem('auth_token');
    await EncryptedStorage.removeItem('refresh_token');
    await AsyncStorage.removeItem('user_data');
    // Could trigger a global state update or navigation here
  } catch (error) {
    console.error('Error clearing auth data', error);
  }
};

// API endpoints
export const AuthService = {
  register: async (userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    
    // Store tokens securely
    await EncryptedStorage.setItem('auth_token', response.data.token);
    await EncryptedStorage.setItem('refresh_token', response.data.refreshToken);
    
    // Store user data in regular storage
    await AsyncStorage.setItem('user_data', JSON.stringify(response.data.user));
    
    return response.data;
  },
  
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      // Clear tokens and data regardless of API success
      await clearAuthData();
    }
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
  
  updateUser: async (userData: any) => {
    const response = await api.put('/users/me', userData);
    
    // Update stored user data
    await AsyncStorage.setItem('user_data', JSON.stringify(response.data));
    
    return response.data;
  },
};

export const CycleService = {
  getAllCycles: async () => {
    const response = await api.get('/cycles');
    return response.data;
  },
  
  getCurrentCycle: async () => {
    const response = await api.get('/cycles/current');
    return response.data;
  },
  
  logPeriodStart: async (date: string) => {
    const response = await api.post('/cycles', { startDate: date });
    return response.data;
  },
  
  logPeriodEnd: async (cycleId: string, date: string) => {
    const response = await api.put(`/cycles/${cycleId}`, { endDate: date });
    return response.data;
  },
  
  updateCycleDay: async (cycleDayId: string, data: any) => {
    const response = await api.put(`/cycle-days/${cycleDayId}`, data);
    return response.data;
  },
  
  logSymptoms: async (cycleDayId: string, symptoms: any[]) => {
    const response = await api.post(`/cycle-days/${cycleDayId}/symptoms`, { symptoms });
    return response.data;
  },
  
  logMoods: async (cycleDayId: string, moods: any[]) => {
    const response = await api.post(`/cycle-days/${cycleDayId}/moods`, { moods });
    return response.data;
  },
};

export const RecommendationService = {
  getRecommendations: async (phase?: string) => {
    const url = phase ? `/recommendations?phase=${phase}` : '/recommendations';
    const response = await api.get(url);
    return response.data;
  },
  
  getNutritionRecommendations: async (phase: string) => {
    const response = await api.get(`/recommendations/nutrition?phase=${phase}`);
    return response.data;
  },
  
  getExerciseRecommendations: async (phase: string) => {
    const response = await api.get(`/recommendations/exercise?phase=${phase}`);
    return response.data;
  },
  
  getSelfCareRecommendations: async (phase: string) => {
    const response = await api.get(`/recommendations/selfcare?phase=${phase}`);
    return response.data;
  },
};

export default api;