// src/services/categoryService.js - UPDATED FOR NEW BACKEND
import api from './api';

export const categoryService = {
  // Get all categories
  getCategories: async (includeInactive = false) => {
    try {
      const response = await api.get('/categories', {
        params: { includeInactive: includeInactive ? 'true' : 'false' }
      });
      console.log('Categories API response:', response.data);
      
      // Backend returns: { success: true, data: { categories: [...] } }
      const categories = response.data?.data?.categories || [];
      
      return {
        success: true,
        data: categories
      };
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  },
  
  // Get single category by ID
  getCategory: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      console.log('Category API response:', response.data);
      
      // Backend returns: { success: true, data: { category: {...} } }
      const category = response.data?.data?.category || null;
      
      return {
        success: true,
        data: category
      };
    } catch (error) {
      console.error('Get category error:', error);
      throw error;
    }
  },
  
  // Create new category
  createCategory: async (data) => {
    try {
      const payload = {
        name: data.name,
        displayName: data.displayName || data.name,
        description: data.description || '',
        color: data.color || '#3B82F6',
        iconUrl: data.iconUrl || '',
        sortOrder: data.sortOrder || 0
      };
      
      const response = await api.post('/categories', payload);
      console.log('Create category response:', response.data);
      
      // Backend returns: { success: true, message: '...', data: { category: {...} } }
      return {
        success: true,
        data: response.data?.data?.category || response.data
      };
    } catch (error) {
      console.error('Create category error:', error);
      throw error;
    }
  },
  
  // Update category
  updateCategory: async (id, data) => {
    try {
      const payload = {
        displayName: data.displayName || data.name,
        description: data.description,
        color: data.color,
        iconUrl: data.iconUrl,
        sortOrder: data.sortOrder,
        isActive: data.isActive
      };
      
      // Remove undefined values
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined) {
          delete payload[key];
        }
      });
      
      const response = await api.put(`/categories/${id}`, payload);
      console.log('Update category response:', response.data);
      
      return {
        success: true,
        data: response.data?.data?.category || response.data
      };
    } catch (error) {
      console.error('Update category error:', error);
      throw error;
    }
  },
  
  // Delete category
  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      console.log('Delete category response:', response.data);
      
      return {
        success: true,
        message: response.data?.message || 'Category deleted successfully'
      };
    } catch (error) {
      console.error('Delete category error:', error);
      // If error has response with message, throw that
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },
  
  // Toggle category status
  toggleCategoryStatus: async (id) => {
    try {
      const response = await api.patch(`/categories/${id}/toggle-status`);
      console.log('Toggle category status response:', response.data);
      
      return {
        success: true,
        data: response.data?.data?.category || response.data
      };
    } catch (error) {
      console.error('Toggle category status error:', error);
      throw error;
    }
  },
  
  // Get articles by category
  getArticlesByCategory: async (id, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/categories/${id}/articles`, {
        params: { page, limit }
      });
      console.log('Articles by category response:', response.data);
      
      return {
        success: true,
        data: response.data?.data || response.data
      };
    } catch (error) {
      console.error('Get articles by category error:', error);
      throw error;
    }
  },
  
  // Get category stats
  getCategoryStats: async (id, timeframe = '30d') => {
    try {
      const response = await api.get(`/categories/${id}/stats`, {
        params: { timeframe }
      });
      console.log('Category stats response:', response.data);
      
      return {
        success: true,
        data: response.data?.data?.stats || response.data
      };
    } catch (error) {
      console.error('Get category stats error:', error);
      throw error;
    }
  }
};