// src/services/analyticsService.js - REAL DATA ONLY
import api from './api';

export const analyticsService = {
  // Get dashboard analytics
  getDashboard: async (params) => {
    try {
      console.log('📊 Fetching dashboard analytics with params:', params);
      const response = await api.get('/analytics/dashboard', { params });
      console.log('✅ Dashboard analytics response:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Dashboard analytics error:', error);
      throw error;
    }
  },
  
  // Get overview analytics
  getOverview: async (params) => {
    try {
      console.log('📊 Fetching overview analytics with params:', params);
      const response = await api.get('/analytics/overview', { params });
      console.log('✅ Overview analytics response:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Overview analytics error:', error);
      throw error;
    }
  },
  
  // Get content analytics
  getContentAnalytics: async (params) => {
    try {
      console.log('📊 Fetching content analytics with params:', params);
      const response = await api.get('/analytics/content', { params });
      console.log('✅ Content analytics response:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Content analytics error:', error);
      throw error;
    }
  },
  
  // Get user analytics
  getUserAnalytics: async (params) => {
    try {
      console.log('📊 Fetching user analytics with params:', params);
      const response = await api.get('/analytics/users', { params });
      console.log('✅ User analytics response:', response.data);
      return response;
    } catch (error) {
      console.error('❌ User analytics error:', error);
      throw error;
    }
  },
  
  // Get engagement analytics
  getEngagementAnalytics: async (params) => {
    try {
      console.log('📊 Fetching engagement analytics with params:', params);
      const response = await api.get('/analytics/engagement', { params });
      console.log('✅ Engagement analytics response:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Engagement analytics error:', error);
      throw error;
    }
  },
  
  // Get realtime analytics
  getRealtimeAnalytics: async (params) => {
    try {
      console.log('📊 Fetching realtime analytics with params:', params);
      const response = await api.get('/analytics/realtime', { params });
      console.log('✅ Realtime analytics response:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Realtime analytics error:', error);
      throw error;
    }
  },
  
  // Export analytics
  exportAnalytics: async (params) => {
    try {
      console.log('📊 Exporting analytics with params:', params);
      const response = await api.get('/analytics/export', { 
        params,
        responseType: 'blob'
      });
      console.log('✅ Export analytics response received');
      return response;
    } catch (error) {
      console.error('❌ Export analytics error:', error);
      throw error;
    }
  }
};