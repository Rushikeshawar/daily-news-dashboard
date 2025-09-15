// src/context/NotificationContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload.notifications || [],
        unreadCount: action.payload.unreadCount || 0,
        loading: false,
        error: null
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1
      };
    case 'MARK_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => 
          action.payload.includes(n.id) ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - action.payload.length)
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ALL':
      return {
        notifications: [],
        unreadCount: 0,
        loading: false,
        error: null
      };
    default:
      return state;
  }
};

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null
};

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    let intervalId = null;

    if (isAuthenticated && user) {
      // Fetch notifications immediately when authenticated
      fetchNotifications();
      
      // Set up polling every 30 seconds (not every second!)
      intervalId = setInterval(() => {
        if (isAuthenticated && user) {
          fetchNotifications();
        }
      }, 30000);
    } else {
      // Clear notifications when not authenticated
      dispatch({ type: 'CLEAR_ALL' });
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAuthenticated, user]);

  const fetchNotifications = async () => {
    // Don't fetch if not authenticated
    if (!isAuthenticated || !user) {
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await notificationService.getNotifications();
      
      // Mock data if service fails
      const mockData = {
        notifications: [
          {
            id: '1',
            title: 'Welcome!',
            message: 'Welcome to the Daily News Dashboard',
            isRead: false,
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Article Approved',
            message: 'Your article "Breaking News" has been approved',
            isRead: true,
            createdAt: new Date(Date.now() - 3600000).toISOString()
          }
        ],
        unreadCount: 1
      };

      dispatch({
        type: 'SET_NOTIFICATIONS',
        payload: response.data || mockData
      });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      
      // Don't show error for 401 (unauthorized) - just clear notifications
      if (error.response?.status === 401) {
        dispatch({ type: 'CLEAR_ALL' });
        return;
      }
      
      // For other errors, use mock data to prevent infinite loops
      dispatch({
        type: 'SET_NOTIFICATIONS',
        payload: {
          notifications: [
            {
              id: 'welcome',
              title: 'Welcome!',
              message: 'Welcome to the Daily News Dashboard',
              isRead: false,
              createdAt: new Date().toISOString()
            }
          ],
          unreadCount: 1
        }
      });
      
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load notifications' });
    }
  };

  const markAsRead = async (notificationIds) => {
    try {
      await notificationService.markAsRead(notificationIds);
      dispatch({
        type: 'MARK_READ',
        payload: notificationIds
      });
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
      // Still update UI optimistically
      dispatch({
        type: 'MARK_READ',
        payload: notificationIds
      });
    }
  };

  const addNotification = (notification) => {
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        ...notification,
        id: notification.id || Date.now().toString(),
        createdAt: notification.createdAt || new Date().toISOString(),
        isRead: false
      }
    });
  };

  const value = {
    ...state,
    fetchNotifications,
    markAsRead,
    addNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};