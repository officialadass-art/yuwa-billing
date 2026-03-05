import { APIEndpoints } from '@/constants/apiEndpoint';
import { AUTH_STATE_KEY, SecureStoreGet } from '@/context/AuthContext';
import { AuthState } from '@/types';
import axios from 'axios';
import { router } from 'expo-router';

const apiClient = axios.create({
  baseURL: APIEndpoints.baseURL,
  timeout: 10000,
});

// REQUEST Interceptor: Add Token
apiClient.interceptors.request.use(
  async (config) => {
    const authState = await SecureStoreGet(AUTH_STATE_KEY) || ''
    if (authState && authState.length > 0){
      const jsonParse = JSON.parse(authState) as AuthState
      console.log('Auth State:', (authState && jsonParse.isAuthenticated && jsonParse.token?.length))
      if (authState && jsonParse.isAuthenticated && jsonParse.token) {
        config.headers.Authorization = `Bearer ${jsonParse.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE Interceptor: Handle 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Logic for Logout or Token Refresh
      console.log('Unauthorized - redirecting to login...');
      // Redirect to Login screen
      router.navigate('/auth/login')
    }
    return Promise.reject(error);
  }
);

export default apiClient;