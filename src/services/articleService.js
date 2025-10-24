// src/services/articleService.js - COMPLETE WITH SEARCH METHODS
import api from './api';

export const articleService = {
  // ==================== ARTICLE LISTING ====================
  
  // Get all articles (published/approved)
  getArticles: async (params) => {
    try {
      console.log('ArticleService: Requesting articles with params:', params);
      
      // Remove empty/undefined params
      const cleanParams = {};
      Object.keys(params || {}).forEach(key => {
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
  
  // ==================== SEARCH ARTICLES ====================
  
  /**
   * Search articles by query
   * This is the method used by the Time Saver search modal
   */
  searchArticles: async (params) => {
    try {
      console.log('ArticleService: Searching articles with params:', params);
      
      // Build search params
      const searchParams = {
        q: params.q || params.query || params.search || '',
        limit: params.limit || 20,
        status: params.status || 'PUBLISHED',
        isPublished: params.isPublished !== undefined ? params.isPublished : true,
        sortBy: 'publishedAt', // Sort by published date
        order: 'desc' // Newest first
      };
      
      // Add optional filters
      if (params.category) searchParams.category = params.category;
      if (params.tags) searchParams.tags = params.tags;
      
      console.log('ArticleService: Search params:', searchParams);
      
      // Try search endpoint first
      try {
        const response = await api.get('/articles/search', { params: searchParams });
        console.log('ArticleService: Search response:', response.data);
        
        let articlesData;
        if (response.data && response.data.success && response.data.data) {
          articlesData = response.data.data.articles || response.data.data || [];
        } else if (response.data && response.data.articles) {
          articlesData = response.data.articles;
        } else {
          articlesData = response.data || [];
        }
        
        // Sort by publishedAt date - NEWEST FIRST
        const sortedArticles = Array.isArray(articlesData) ? articlesData : [];
        sortedArticles.sort((a, b) => {
          const dateA = new Date(a.publishedAt || a.createdAt || 0);
          const dateB = new Date(b.publishedAt || b.createdAt || 0);
          return dateB - dateA; // Descending order (newest first)
        });
        
        return {
          data: {
            articles: sortedArticles
          }
        };
      } catch (searchError) {
        // If search endpoint doesn't exist, fall back to regular articles endpoint with query
        console.warn('ArticleService: Search endpoint not available, using articles endpoint');
        
        const fallbackParams = {
          page: 1,
          limit: searchParams.limit,
          status: searchParams.status
        };
        
        const response = await api.get('/articles', { params: fallbackParams });
        
        let allArticles;
        if (response.data && response.data.success && response.data.data) {
          allArticles = response.data.data.articles || response.data.data || [];
        } else {
          allArticles = response.data || [];
        }
        
        // Filter on client side
        const query = searchParams.q.toLowerCase();
        const filteredArticles = allArticles.filter(article => {
          const matchesQuery = !query || 
            article.headline?.toLowerCase().includes(query) ||
            article.briefContent?.toLowerCase().includes(query) ||
            article.fullContent?.toLowerCase().includes(query) ||
            article.tags?.toLowerCase().includes(query);
          
          const matchesCategory = !searchParams.category || 
            article.category === searchParams.category;
          
          return matchesQuery && matchesCategory;
        });
        
        // Sort by publishedAt date - NEWEST FIRST
        filteredArticles.sort((a, b) => {
          const dateA = new Date(a.publishedAt || a.createdAt || 0);
          const dateB = new Date(b.publishedAt || b.createdAt || 0);
          return dateB - dateA; // Descending order (newest first)
        });
        
        console.log('ArticleService: Client-side filtered to', filteredArticles.length, 'articles (sorted newest first)');
        
        return {
          data: {
            articles: filteredArticles
          }
        };
      }
    } catch (error) {
      console.error('ArticleService: Search articles error:', error);
      // Return empty array instead of throwing to prevent UI breaking
      return {
        data: {
          articles: []
        }
      };
    }
  },
  
  // ==================== SINGLE ARTICLE ====================
  
  // Get single article by ID or slug
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

  // Alternative method name for compatibility
  getArticleById: async (identifier) => {
    return articleService.getArticle(identifier);
  },
  
  // ==================== CREATE & UPDATE ====================
  
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
      
      return { 
        success: true,
        data: articleData 
      };
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
      
      return { 
        success: true,
        data: articleData 
      };
    } catch (error) {
      console.error('ArticleService: Update article error:', error);
      throw error;
    }
  },
  
  // Delete article
  deleteArticle: async (id) => {
    try {
      const response = await api.delete(`/articles/${id}`);
      return { 
        success: true,
        data: response.data 
      };
    } catch (error) {
      console.error('ArticleService: Delete article error:', error);
      throw error;
    }
  },
  
  // ==================== APPROVAL WORKFLOW ====================
  
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
      
      return { 
        success: true,
        data: response.data 
      };
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
      
      return { 
        success: true,
        data: response.data 
      };
    } catch (error) {
      console.error('ArticleService: Reject article error:', error);
      throw error;
    }
  },
  
  // ==================== INTERACTIONS ====================
  
  // Track article view
  trackView: async (id) => {
    try {
      await api.post(`/articles/${id}/view`, {
        timestamp: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.warn('ArticleService: Track view failed (non-critical):', error.message);
      return { success: false };
    }
  },
  
  // Update share count
  updateShareCount: async (id) => {
    try {
      await api.post(`/articles/${id}/share`);
      return { success: true };
    } catch (error) {
      console.warn('ArticleService: Update share count failed (non-critical):', error.message);
      return { success: false };
    }
  },
  
  // ==================== FAVORITES ====================
  
  // Add to favorites
  addToFavorites: async (articleId) => {
    try {
      const response = await api.post('/favorites', {
        newsId: articleId,
        type: 'ARTICLE'
      });
      return { 
        success: true,
        data: response.data 
      };
    } catch (error) {
      console.error('ArticleService: Add to favorites error:', error);
      throw error;
    }
  },
  
  // Remove from favorites
  removeFromFavorites: async (articleId) => {
    try {
      const response = await api.delete(`/favorites/article/${articleId}`);
      return { 
        success: true,
        data: response.data 
      };
    } catch (error) {
      console.error('ArticleService: Remove from favorites error:', error);
      throw error;
    }
  },
  
  // Get user's favorite articles
  getFavorites: async (params) => {
    try {
      const response = await api.get('/favorites', { 
        params: {
          ...params,
          type: 'ARTICLE'
        }
      });
      
      let articlesData;
      if (response.data && response.data.success && response.data.data) {
        articlesData = response.data.data.favorites || response.data.data || [];
      } else {
        articlesData = response.data || [];
      }
      
      return {
        data: {
          articles: Array.isArray(articlesData) ? articlesData : []
        }
      };
    } catch (error) {
      console.error('ArticleService: Get favorites error:', error);
      throw error;
    }
  }
};

export default articleService;