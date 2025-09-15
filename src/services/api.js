// src/services/api.js
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
    
    // Add debug logging
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      hasToken: !!token,
      headers: config.headers
    });
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    const { response } = error;
    
    console.error(`API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: response?.status,
      message: response?.data?.message,
      error: error.message
    });
    
    // Handle 401 Unauthorized
    if (response?.status === 401 && !isRedirecting) {
      isRedirecting = true;
      
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only show toast if not already on login page
      const isOnLoginPage = window.location.pathname === '/login';
      if (!isOnLoginPage) {
        toast.error('Session expired. Please login again.');
        
        // Redirect to login
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      }
      
      // Reset flag after redirect
      setTimeout(() => {
        isRedirecting = false;
      }, 2000);
    }
    // Handle server errors (500+)
    else if (response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }
    // Handle other client errors with custom messages
    else if (response?.status >= 400 && response?.data?.message) {
      // Don't show toast for certain API calls (like notifications)
      const isSilentCall = error.config?.url?.includes('/notifications');
      if (!isSilentCall) {
        toast.error(response.data.message);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;