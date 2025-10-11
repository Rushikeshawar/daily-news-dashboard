// src/services/api.js
import axios from 'axios';
import toast from 'react-hot-toast';

// CRITICAL FIX: Change port from 3000 to your backend port (usually 5000)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Flag to prevent multiple logout redirects
let isRedirecting = false;

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add debug logging (can be removed in production)
    if (process.env.NODE_ENV === 'development') {
      console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
        hasToken: !!token,
        data: config.data,
        params: config.params
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    const { response, request, config } = error;
    
    // Log error details
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API Error: ${config?.method?.toUpperCase()} ${config?.url}`, {
        status: response?.status,
        statusText: response?.statusText,
        message: response?.data?.message || error.message,
        data: response?.data
      });
    }
    
    // Network error (no response received)
    if (!response && request) {
      toast.error('Network error. Please check your connection and ensure the backend server is running.');
      return Promise.reject(new Error('Network error - Backend server may be down'));
    }
    
    // Handle different status codes
    if (response) {
      switch (response.status) {
        case 400:
          // Bad Request - show specific validation errors
          const validationMessage = response.data?.message || 'Invalid request data';
          toast.error(validationMessage);
          break;
          
        case 401:
          // Unauthorized - handle session expiration
          if (!isRedirecting) {
            isRedirecting = true;
            
            // Clear auth data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Only redirect if not on login page
            const isOnLoginPage = window.location.pathname === '/login';
            if (!isOnLoginPage) {
              toast.error('Session expired. Please login again.');
              
              setTimeout(() => {
                window.location.href = '/login';
              }, 1000);
            }
            
            // Reset redirect flag
            setTimeout(() => {
              isRedirecting = false;
            }, 2000);
          }
          break;
          
        case 403:
          // Forbidden - insufficient permissions
          const forbiddenMessage = response.data?.message || 'You do not have permission to perform this action';
          toast.error(forbiddenMessage);
          break;
          
        case 404:
          // Not Found
          const notFoundMessage = response.data?.message || 'Resource not found';
          toast.error(notFoundMessage);
          break;
          
        case 422:
          // Unprocessable Entity - validation errors
          const validationError = response.data?.message || 'Validation failed';
          toast.error(validationError);
          break;
          
        case 429:
          // Too Many Requests
          toast.error('Too many requests. Please try again later.');
          break;
          
        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors
          toast.error('Server error. Please try again later.');
          break;
          
        default:
          // Other errors
          const defaultMessage = response.data?.message || 'An error occurred';
          
          // Don't show toast for silent API calls
          const isSilentCall = config?.url?.includes('/notifications') || 
                              config?.url?.includes('/view') ||
                              config?.url?.includes('/interaction');
          
          if (!isSilentCall) {
            toast.error(defaultMessage);
          }
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper function to check if API is reachable
export const checkApiHealth = async () => {
  try {
    const response = await api.get('/health');
    console.log('✅ API is reachable:', response.data);
    return true;
  } catch (error) {
    console.error('❌ API health check failed:', error.message);
    return false;
  }
};

export default api;