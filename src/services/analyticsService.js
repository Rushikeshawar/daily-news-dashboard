 
// src/services/analyticsService.js
import api from './api';

export const analyticsService = {
  getDashboard: (params) => api.get('/analytics/dashboard', { params }),
  getArticleAnalytics: (params) => api.get('/analytics/articles', { params }),
  getUserAnalytics: (params) => api.get('/analytics/users', { params })
};

