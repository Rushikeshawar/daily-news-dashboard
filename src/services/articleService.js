// src/services/articleService.js - COMPLETE FIXED VERSION
import api from './api';

export const articleService = {
  // Get all articles (published/approved)
  getArticles: async (params) => {
    try {
      console.log('ArticleService: Requesting articles with params:', params);
      
      // Remove empty/undefined params
      const cleanParams = {};
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== '' && params[key] !== null) {
          cleanParams[key] = params[key];
        }
      });
      
      console.log('ArticleService: Clean params:', cleanParams);
      
      const response = await api.get('/articles', { params: cleanParams });
      console.log('ArticleService: Raw API response:', response.data);
      
      // Handle backend response structure
      let articlesData, paginationData;
      
      if (response.data && response.data.success && response.data.data) {
        const dataObject = response.data.data;
        articlesData = dataObject.articles || dataObject || [];
        paginationData = dataObject.pagination;
      } else {
        articlesData = response.data || [];
        paginationData = null;
      }
      
      console.log('ArticleService: Extracted articles:', articlesData);
      console.log('ArticleService: Extracted pagination:', paginationData);
      
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
      console.error('ArticleService: Get articles error:', error);
      throw error;
    }
  },
  
  // Get pending articles for approval
  getPendingArticles: async (params) => {
    try {
      console.log('ArticleService: Requesting pending articles');
      
      // Use the dedicated pending endpoint
      const response = await api.get('/articles/pending/approval', { params });
      console.log('ArticleService: Pending articles response:', response.data);
      
      let articlesData, paginationData;
      
      if (response.data && response.data.success && response.data.data) {
        const dataObject = response.data.data;
        articlesData = dataObject.articles || dataObject || [];
        paginationData = dataObject.pagination;
      } else {
        articlesData = response.data || [];
        paginationData = null;
      }
      
      console.log('ArticleService: Found pending articles:', articlesData.length);
      
      return {
        data: {
          articles: Array.isArray(articlesData) ? articlesData : [],
          pagination: paginationData || {
            currentPage: params?.page || 1,
            totalPages: 1,
            totalItems: Array.isArray(articlesData) ? articlesData.length : 0,
            hasNext: false,
            hasPrevious: false
          }
        }
      };
    } catch (error) {
      console.error('ArticleService: Get pending articles error:', error);
      throw error;
    }
  },
  
  // Get single article by ID
  getArticle: async (id) => {
    try {
      const response = await api.get(`/articles/${id}`);
      console.log('ArticleService: Article detail response:', response.data);
      
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
      console.error('ArticleService: Get article error:', error);
      throw error;
    }
  },
  
  // Create new article
  createArticle: async (data) => {
    try {
      console.log('ArticleService: Creating article with data:', data);
      
      const response = await api.post('/articles', data);
      console.log('ArticleService: Create response:', response.data);
      
      let articleData;
      if (response.data && response.data.success && response.data.data) {
        articleData = response.data.data.article || response.data.data;
      } else {
        articleData = response.data;
      }
      
      return { data: articleData };
    } catch (error) {
      console.error('ArticleService: Create article error:', error);
      throw error;
    }
  },
  
  // Update article
  updateArticle: async (id, data) => {
    try {
      console.log('ArticleService: Updating article:', id, data);
      
      const response = await api.put(`/articles/${id}`, data);
      
      let articleData;
      if (response.data && response.data.success && response.data.data) {
        articleData = response.data.data.article || response.data.data;
      } else {
        articleData = response.data;
      }
      
      return { data: articleData };
    } catch (error) {
      console.error('ArticleService: Update article error:', error);
      throw error;
    }
  },
  
  // Delete article
  deleteArticle: async (id) => {
    try {
      const response = await api.delete(`/articles/${id}`);
      return { data: response.data };
    } catch (error) {
      console.error('ArticleService: Delete article error:', error);
      throw error;
    }
  },
  
  // Approve article
  approveArticle: async (id, data) => {
    try {
      const approvalData = {
        action: 'APPROVED',
        comments: data.comments || 'Article approved for publication'
      };
      
      console.log('ArticleService: Approving article:', id, approvalData);
      
      const response = await api.post(`/articles/${id}/approval`, approvalData);
      console.log('ArticleService: Approval response:', response.data);
      
      return { data: response.data };
    } catch (error) {
      console.error('ArticleService: Approve article error:', error);
      throw error;
    }
  },
  
  // Reject article
  rejectArticle: async (id, data) => {
    try {
      const rejectionData = {
        action: 'REJECTED',
        comments: data.comments || 'Article needs revision'
      };
      
      console.log('ArticleService: Rejecting article:', id, rejectionData);
      
      const response = await api.post(`/articles/${id}/approval`, rejectionData);
      console.log('ArticleService: Rejection response:', response.data);
      
      return { data: response.data };
    } catch (error) {
      console.error('ArticleService: Reject article error:', error);
      throw error;
    }
  }
};