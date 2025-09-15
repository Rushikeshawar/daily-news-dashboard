// src/context/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        isAuthenticated: true, 
        user: action.payload.user,
        token: action.payload.accessToken 
      };
    case 'LOGIN_FAILURE':
      return { 
        ...state, 
        loading: false, 
        error: action.payload,
        isAuthenticated: false,
        user: null,
        token: null
      };
    case 'LOGOUT':
      return { 
        ...state, 
        isAuthenticated: false, 
        user: null, 
        token: null,
        loading: false,
        error: null
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        console.log('Initializing auth:', { hasToken: !!token, hasUserData: !!userData });
        
        if (token && userData) {
          const user = JSON.parse(userData);
          console.log('Found existing auth:', { user: user.email, role: user.role });
          
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user, accessToken: token }
          });
        } else {
          console.log('No existing auth found');
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      console.log('Attempting login for:', credentials.email);
      const response = await authService.login(credentials);
      console.log('Login response:', response.data);
      
      // Handle different response structures
      let user, accessToken;
      
      if (response.data.data) {
        // If response has a nested data structure
        user = response.data.data.user;
        accessToken = response.data.data.accessToken;
      } else {
        // If response has flat structure
        user = response.data.user;
        accessToken = response.data.accessToken;
      }
      
      if (!accessToken) {
        throw new Error('No access token received');
      }
      
      // Store auth data
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('Auth data stored successfully', { user: user.email, hasToken: !!accessToken });
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, accessToken }
      });
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
      console.log('User logged out');
    }
  };

  const updateProfile = (profileData) => {
    const updatedUser = { ...state.user, ...profileData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    dispatch({ type: 'UPDATE_PROFILE', payload: profileData });
  };

  const value = {
    ...state,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};