// src/services/aiMlService.js - COMPLETE WITH CATEGORY MANAGEMENT
import api from './api';

export const aiMlService = {
  // ==================== AI/ML NEWS LISTING ====================
  
  // Get AI/ML news articles
  getNews: async (params) => {
    try {
      console.log('AiMlService: Requesting AI/ML news with params:', params);
      
      const cleanParams = {};
      Object.keys(params || {}).forEach(key => {
        if (params[key] !== undefined && params[key] !== '' && params[key] !== null) {
          cleanParams[key] = params[key];
        }
      });
      
      console.log('AiMlService: Clean params:', cleanParams);
      
      const response = await api.get('/ai-ml/news', { params: cleanParams });
      console.log('AiMlService: Raw API response:', response.data);
      
      let articlesData, paginationData;
      
      if (response.data && response.data.success && response.data.data) {
        const dataObject = response.data.data;
        articlesData = dataObject.articles || dataObject || [];
        paginationData = dataObject.pagination;
      } else {
        articlesData = response.data || [];
        paginationData = null;
      }
      
      console.log('AiMlService: Extracted articles:', articlesData);
      console.log('AiMlService: Extracted pagination:', paginationData);
      
      return {
        data: {
          articles: Array.isArray(articlesData) ? articlesData : [],
          pagination: paginationData || {
            currentPage: cleanParams?.page || 1,
            totalPages: 1,
            totalItems: Array.isArray(articlesData) ? articlesData.length : 0,
            hasNext: false,
            hasPrevious: false
          }
        }
      };
    } catch (error) {
      console.error('AiMlService: Get news error:', error);
      throw error;
    }
  },
  
  // ==================== SINGLE ARTICLE ====================
  
  // Get single AI/ML article by ID
  getArticle: async (id) => {
    try {
      const response = await api.get(`/ai-ml/news/${id}`);
      console.log('AiMlService: Article detail response:', response.data);
      
      let articleData;
      
      if (response.data && response.data.success && response.data.data) {
        if (response.data.data.article) {
          articleData = response.data.data.article;
        } else {
          articleData = response.data.data;
        }
      } else if (response.data && response.data.article) {
        articleData = response.data.article;
      } else {
        articleData = response.data;
      }
      
      return { data: articleData };
    } catch (error) {
      console.error('AiMlService: Get article error:', error);
      throw error;
    }
  },
  
  // ==================== CREATE, UPDATE & DELETE ARTICLES ====================
  
  // Create new AI/ML article
  createArticle: async (data) => {
    try {
      console.log('AiMlService: Creating AI/ML article with data:', data);
      
      const response = await api.post('/ai-ml/news', data);
      console.log('AiMlService: Create response:', response.data);
      
      let articleData;
      if (response.data && response.data.success && response.data.data) {
        articleData = response.data.data.article || response.data.data;
      } else {
        articleData = response.data;
      }
      
      return { 
        success: true,
        data: articleData 
      };
    } catch (error) {
      console.error('AiMlService: Create article error:', error);
      throw error;
    }
  },
  
  // Update AI/ML article
  updateArticle: async (id, data) => {
    try {
      console.log('AiMlService: Updating AI/ML article:', id, data);
      
      const response = await api.put(`/ai-ml/news/${id}`, data);
      console.log('AiMlService: Update response:', response.data);
      
      let articleData;
      if (response.data && response.data.success && response.data.data) {
        articleData = response.data.data.article || response.data.data;
      } else {
        articleData = response.data;
      }
      
      return { 
        success: true,
        data: articleData 
      };
    } catch (error) {
      console.error('AiMlService: Update article error:', error);
      throw error;
    }
  },
  
  // Delete AI/ML article
  deleteArticle: async (id) => {
    try {
      console.log('AiMlService: Deleting AI/ML article:', id);
      
      const response = await api.delete(`/ai-ml/news/${id}`);
      console.log('AiMlService: Delete response:', response.data);
      
      return { 
        success: true,
        data: response.data 
      };
    } catch (error) {
      console.error('AiMlService: Delete article error:', error);
      throw error;
    }
  },
  
  // ==================== CATEGORY MANAGEMENT ====================
  
  // Get AI/ML categories
  getCategories: async () => {
    try {
      const response = await api.get('/ai-ml/categories');
      console.log('AiMlService: Categories response:', response.data);
      
      let categoriesData;
      if (response.data && response.data.success && response.data.data) {
        categoriesData = response.data.data.categories || response.data.data || [];
      } else {
        categoriesData = response.data || [];
      }
      
      return {
        data: {
          categories: Array.isArray(categoriesData) ? categoriesData : []
        }
      };
    } catch (error) {
      console.error('AiMlService: Get categories error:', error);
      return {
        data: {
          categories: []
        }
      };
    }
  },
  
  // Create new category
  createCategory: async (data) => {
    try {
      console.log('AiMlService: Creating category with data:', data);
      
      const response = await api.post('/ai-ml/categories', data);
      console.log('AiMlService: Create category response:', response.data);
      
      let categoryData;
      if (response.data && response.data.success && response.data.data) {
        categoryData = response.data.data.category || response.data.data;
      } else {
        categoryData = response.data;
      }
      
      return { 
        success: true,
        data: categoryData 
      };
    } catch (error) {
      console.error('AiMlService: Create category error:', error);
      throw error;
    }
  },
  
  // Update category
  updateCategory: async (id, data) => {
    try {
      console.log('AiMlService: Updating category:', id, data);
      
      const response = await api.put(`/ai-ml/categories/${id}`, data);
      console.log('AiMlService: Update category response:', response.data);
      
      let categoryData;
      if (response.data && response.data.success && response.data.data) {
        categoryData = response.data.data.category || response.data.data;
      } else {
        categoryData = response.data;
      }
      
      return { 
        success: true,
        data: categoryData 
      };
    } catch (error) {
      console.error('AiMlService: Update category error:', error);
      throw error;
    }
  },
  
  // Delete category
  deleteCategory: async (id) => {
    try {
      console.log('AiMlService: Deleting category:', id);
      
      const response = await api.delete(`/ai-ml/categories/${id}`);
      console.log('AiMlService: Delete category response:', response.data);
      
      return { 
        success: true,
        data: response.data 
      };
    } catch (error) {
      console.error('AiMlService: Delete category error:', error);
      throw error;
    }
  },
  
  // Get articles by category
  getArticlesByCategory: async (category, params) => {
    try {
      const response = await api.get(`/ai-ml/category/${category}`, { params });
      
      let articlesData, paginationData;
      if (response.data && response.data.success && response.data.data) {
        const dataObject = response.data.data;
        articlesData = dataObject.articles || dataObject || [];
        paginationData = dataObject.pagination;
      } else {
        articlesData = response.data || [];
        paginationData = null;
      }
      
      return {
        data: {
          articles: Array.isArray(articlesData) ? articlesData : [],
          pagination: paginationData
        }
      };
    } catch (error) {
      console.error('AiMlService: Get articles by category error:', error);
      throw error;
    }
  },
  
  // ==================== TRENDING & SEARCH ====================
  
  // Get trending AI/ML articles
  getTrending: async (params) => {
    try {
      const response = await api.get('/ai-ml/trending', { params });
      
      let articlesData;
      if (response.data && response.data.success && response.data.data) {
        articlesData = response.data.data.articles || response.data.data || [];
      } else {
        articlesData = response.data || [];
      }
      
      return {
        data: {
          articles: Array.isArray(articlesData) ? articlesData : []
        }
      };
    } catch (error) {
      console.error('AiMlService: Get trending error:', error);
      throw error;
    }
  },
  
  // Search AI/ML content
  searchContent: async (params) => {
    try {
      console.log('AiMlService: Searching AI/ML content with params:', params);
      
      const searchParams = {
        q: params.q || params.query || params.search || '',
        limit: params.limit || 20,
        category: params.category,
        sortBy: params.sortBy || 'publishedAt',
        order: params.order || 'desc'
      };
      
      const response = await api.get('/ai-ml/search', { params: searchParams });
      console.log('AiMlService: Search response:', response.data);
      
      let articlesData;
      if (response.data && response.data.success && response.data.data) {
        articlesData = response.data.data.articles || response.data.data || [];
      } else if (response.data && response.data.articles) {
        articlesData = response.data.articles;
      } else {
        articlesData = response.data || [];
      }
      
      return {
        data: {
          articles: Array.isArray(articlesData) ? articlesData : []
        }
      };
    } catch (error) {
      console.error('AiMlService: Search content error:', error);
      return {
        data: {
          articles: []
        }
      };
    }
  },
  
  // ==================== INTERACTIONS ====================
  
  // Track article view
  trackView: async (id) => {
    try {
      await api.post(`/ai-ml/news/${id}/view`, {
        timestamp: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.warn('AiMlService: Track view failed (non-critical):', error.message);
      return { success: false };
    }
  },
  
  // Track article interaction
  trackInteraction: async (id, interactionType) => {
    try {
      await api.post(`/ai-ml/news/${id}/interaction`, {
        interactionType: interactionType || 'VIEW',
        timestamp: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.warn('AiMlService: Track interaction failed (non-critical):', error.message);
      return { success: false };
    }
  },
  
  // ==================== TIME SAVERS ====================
  
  // Get time savers linked to AI article
  getTimeSavers: async (articleId) => {
    try {
      const response = await api.get(`/ai-ml/news/${articleId}/timesavers`);
      
      let timeSaversData;
      if (response.data && response.data.success && response.data.data) {
        timeSaversData = response.data.data.timeSavers || response.data.data || [];
      } else {
        timeSaversData = response.data || [];
      }
      
      return {
        data: {
          timeSavers: Array.isArray(timeSaversData) ? timeSaversData : []
        }
      };
    } catch (error) {
      console.error('AiMlService: Get time savers error:', error);
      return {
        data: {
          timeSavers: []
        }
      };
    }
  },
  
  // ==================== POPULAR TOPICS ====================
  
  // Get popular AI topics
  getPopularTopics: async (params) => {
    try {
      const response = await api.get('/ai-ml/topics/popular', { params });
      
      let topicsData;
      if (response.data && response.data.success && response.data.data) {
        topicsData = response.data.data.topics || response.data.data || [];
      } else {
        topicsData = response.data || [];
      }
      
      return {
        data: {
          topics: Array.isArray(topicsData) ? topicsData : []
        }
      };
    } catch (error) {
      console.error('AiMlService: Get popular topics error:', error);
      return {
        data: {
          topics: []
        }
      };
    }
  },
  
  // ==================== ANALYTICS ====================
  
  // Get AI insights and analytics
  getInsights: async (params) => {
    try {
      const response = await api.get('/ai-ml/insights', { params });
      
      let insightsData;
      if (response.data && response.data.success && response.data.data) {
        insightsData = response.data.data;
      } else {
        insightsData = response.data || {};
      }
      
      return {
        data: insightsData
      };
    } catch (error) {
      console.error('AiMlService: Get insights error:', error);
      throw error;
    }
  }
};

export default aiMlService;