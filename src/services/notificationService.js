// src/services/notificationService.js
import api from './api';

const mockNotifications = [
  {
    id: '1',
    title: 'Welcome to Daily News Dashboard',
    message: 'Get started by exploring the features available to you.',
    isRead: false,
    createdAt: new Date().toISOString(),
    type: 'info'
  },
  {
    id: '2',
    title: 'Article Approved',
    message: 'Your article "Breaking Technology News" has been approved and published.',
    isRead: false,
    createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    type: 'success'
  },
  {
    id: '3',
    title: 'New Advertisement Campaign',
    message: 'Your advertisement campaign "Tech Conference 2025" is now live.',
    isRead: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    type: 'info'
  },
  {
    id: '4',
    title: 'System Maintenance',
    message: 'Scheduled system maintenance will occur tonight at 2 AM EST.',
    isRead: true,
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    type: 'warning'
  },
  {
    id: '5',
    title: 'Performance Report',
    message: 'Your monthly performance report is ready for review.',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    type: 'info'
  }
];

export const notificationService = {
  getNotifications: async (params = {}) => {
    try {
      const response = await api.get('/notifications', { params });
      console.log('Notifications API response:', response.data);
      
      // CRITICAL FIX: Parse the nested data structure from backend
      const actualData = response.data?.data || response.data;
      
      return {
        data: {
          notifications: actualData?.notifications || actualData || [],
          unreadCount: actualData?.unreadCount || 0
        }
      };
    } catch (error) {
      console.warn('Notifications API unavailable, using mock data:', error.message);
      
      // Calculate unread count
      const unreadCount = mockNotifications.filter(n => !n.isRead).length;
      
      return {
        data: {
          notifications: mockNotifications,
          unreadCount: unreadCount
        }
      };
    }
  },
  
  markAsRead: async (notificationIds) => {
    try {
      const response = await api.put('/notifications/mark-read', { notificationIds });
      console.log('Mark as read response:', response.data);
      const actualData = response.data?.data || response.data;
      return {
        data: actualData
      };
    } catch (error) {
      console.warn('Mark as read API unavailable');
      // Update mock data locally
      mockNotifications.forEach(notification => {
        if (notificationIds.includes(notification.id)) {
          notification.isRead = true;
        }
      });
      return { data: { success: true } };
    }
  },
  
  getUnreadCount: async () => {
    try {
      const response = await api.get('/notifications/unread-count');
      const actualData = response.data?.data || response.data;
      return {
        data: actualData
      };
    } catch (error) {
      console.warn('Unread count API unavailable');
      const unreadCount = mockNotifications.filter(n => !n.isRead).length;
      return { data: { count: unreadCount } };
    }
  },
  
  sendAnnouncement: async (data) => {
    try {
      const response = await api.post('/notifications/announcement', data);
      const actualData = response.data?.data || response.data;
      return {
        data: actualData
      };
    } catch (error) {
      console.warn('Send announcement API unavailable');
      return {
        data: {
          id: Date.now().toString(),
          ...data,
          createdAt: new Date().toISOString(),
          success: true
        }
      };
    }
  }
};