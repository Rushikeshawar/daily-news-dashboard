 
// src/services/notificationService.js
import api from './api';

export const notificationService = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markAsRead: (notificationIds) => api.put('/notifications/mark-read', { notificationIds }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  sendAnnouncement: (data) => api.post('/notifications/announcement', data)
};

