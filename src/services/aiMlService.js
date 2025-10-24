// src/services/aiMlService.js - COMPLETE FIXED VERSION
import api from './api';

export const aiMlService = {
  // ==================== AI/ML ARTICLES ====================
  
  // Get AI/ML news with filtering
  getNews: async (params) => {
    try {
      const response = await api.get('/ai-ml/news', { params });
      console.log('AI/ML news API response:', response.data);
      
      const actualData = response.data?.data || response.data;
      return {
        data: {
          articles: actualData?.articles || actualData || [],
          pagination: actualData?.pagination || {
            page: params?.page || 1,
            limit: params?.limit || 10,
            totalPages: 1,
            totalCount: Array.isArray(actualData) ? actualData.length : 0,
            hasNext: false,
            hasPrev: false
          }
        }
      };
    } catch (error) {
      console.error('AI/ML news error:', error);
      throw error;
    }
  },
  
  // ==================== SEARCH AI/ML ARTICLES ====================
  
  /**
   * Search AI/ML articles - Used by Time Saver search modal
   */
  searchArticles: async (params) => {
    try {
      console.log('AI/ML Service: Searching articles with params:', params);
      
      // Build search params
      const searchParams = {
        q: params.q || params.query || params.search || '',
        limit: params.limit || 20,
        status: params.status || 'PUBLISHED',
        isPublished: params.isPublished !== undefined ? params.isPublished : true,
        sortBy: 'publishedAt',
        order: 'desc'
      };
      
      // Add optional filters
      if (params.category) searchParams.category = params.category;
      if (params.tags) searchParams.tags = params.tags;
      
      console.log('AI/ML Service: Search params:', searchParams);
      
      // Try search endpoint
      try {
        const response = await api.get('/ai-ml/search', { params: searchParams });
        console.log('AI/ML Service: Search response:', response.data);
        
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
          return dateB - dateA;
        });
        
        return {
          data: {
            articles: sortedArticles
          }
        };
      } catch (searchError) {
        // Fallback to news endpoint
        console.warn('AI/ML Service: Search endpoint not available, using news endpoint');
        
        const response = await api.get('/ai-ml/news', { 
          params: {
            page: 1,
            limit: searchParams.limit,
            status: searchParams.status
          }
        });
        
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
          return dateB - dateA;
        });
        
        console.log('AI/ML Service: Client-side filtered to', filteredArticles.length, 'articles');
        
        return {
          data: {
            articles: filteredArticles
          }
        };
      }
    } catch (error) {
      console.error('AI/ML Service: Search error:', error);
      return {
        data: {
          articles: []
        }
      };
    }
  },
  
  // ==================== SINGLE ARTICLE ====================
  
  // Get single AI/ML article
  getArticle: async (id) => {
    try {
      if (!id) {
        throw new Error('Article ID is required');
      }
      
      console.log('AI/ML Service: Fetching article with ID:', id);
      
      const response = await api.get(`/ai-ml/news/${id}`, {
        params: { trackView: 'true' }
      });
      console.log('AI/ML article API response:', response.data);
      
      const actualData = response.data?.data || response.data;
      return {
        data: actualData?.article || actualData
      };
    } catch (error) {
      console.error('AI/ML Service: Get article error:', error);
      throw error;
    }
  },
  
  // ==================== TRENDING ====================
  
  // Get trending AI/ML news
  getTrending: async (params) => {
    try {
      const response = await api.get('/ai-ml/trending', { params });
      const actualData = response.data?.data || response.data;
      return {
        data: {
          articles: actualData?.articles || actualData || []
        }
      };
    } catch (error) {
      console.error('AI/ML trending error:', error);
      throw error;
    }
  },
  
  // ==================== CATEGORIES ====================
  
  // Get AI/ML categories - FIXED VERSION
  getCategories: async () => {
    try {
      console.log('🔍 Fetching AI/ML categories...');
      const response = await api.get('/ai-ml/categories');
      
      console.log('📦 Full response:', response);
      console.log('📦 Response.data:', response.data);
      
      // Handle multiple possible response structures
      let categories = [];
      
      if (response.data) {
        // Structure 1: { success: true, data: { categories: [...] } }
        if (response.data.data && response.data.data.categories) {
          categories = response.data.data.categories;
          console.log('✅ Found categories in response.data.data.categories');
        }
        // Structure 2: { success: true, categories: [...] }
        else if (response.data.categories) {
          categories = response.data.categories;
          console.log('✅ Found categories in response.data.categories');
        }
        // Structure 3: Direct array [...]
        else if (Array.isArray(response.data)) {
          categories = response.data;
          console.log('✅ Response.data is direct array');
        }
      }
      
      console.log(`✅ Successfully extracted ${categories.length} categories`);
      console.log('📊 Categories:', categories);
      
      // Return in consistent format
      return {
        data: {
          categories: categories
        }
      };
    } catch (error) {
      console.error('❌ AI/ML categories error:', error);
      console.error('❌ Error details:', error.response?.data);
      
      // Return empty array to prevent UI breaking
      return {
        data: {
          categories: []
        }
      };
    }
  },
  
  // Create AI/ML category
  createCategory: async (data) => {
    try {
      console.log('Creating category with data:', data);
      const response = await api.post('/ai-ml/categories', data);
      console.log('Create category response:', response.data);
      
      const actualData = response.data?.data || response.data;
      return {
        data: actualData?.category || actualData
      };
    } catch (error) {
      console.error('AI/ML create category error:', error);
      throw error;
    }
  },
  
  // Update AI/ML category
  updateCategory: async (id, data) => {
    try {
      console.log('Updating category:', id, data);
      const response = await api.put(`/ai-ml/categories/${id}`, data);
      console.log('Update category response:', response.data);
      
      const actualData = response.data?.data || response.data;
      return {
        data: actualData?.category || actualData
      };
    } catch (error) {
      console.error('AI/ML update category error:', error);
      throw error;
    }
  },
  
  // Delete AI/ML category
  deleteCategory: async (id) => {
    try {
      console.log('Deleting category:', id);
      const response = await api.delete(`/ai-ml/categories/${id}`);
      console.log('Delete category response:', response.data);
      
      return { 
        success: true, 
        data: response.data 
      };
    } catch (error) {
      console.error('AI/ML delete category error:', error);
      throw error;
    }
  },
  
  // ==================== ARTICLE MANAGEMENT ====================
  
  // Create AI/ML article
  createArticle: async (data) => {
    try {
      console.log('AI/ML Service: Creating article with data:', data);
      
      const response = await api.post('/ai-ml/news', data);
      console.log('AI/ML Service: Create response:', response.data);
      
      const actualData = response.data?.data || response.data;
      return {
        success: true,
        data: actualData?.article || actualData
      };
    } catch (error) {
      console.error('AI/ML Service: Create article error:', error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Unknown error';
        
        if (status === 403) {
          throw new Error('Access denied: Only EDITOR and AD_MANAGER roles can create AI/ML articles');
        } else if (status === 401) {
          throw new Error('Authentication required: Please log in to create articles');
        } else if (status === 400) {
          throw new Error(`Validation error: ${message}`);
        } else {
          throw new Error(`Server error: ${message}`);
        }
      }
      throw error;
    }
  },
  
  // Update AI/ML article
  updateArticle: async (id, data) => {
    try {
      console.log('AI/ML Service: Updating article ID:', id, 'with data:', data);
      
      const response = await api.put(`/ai-ml/news/${id}`, data);
      console.log('AI/ML Service: Update response:', response.data);
      
      const actualData = response.data?.data || response.data;
      return {
        success: true,
        data: actualData?.article || actualData
      };
    } catch (error) {
      console.error('AI/ML Service: Update article error:', error);
      
      if (error.response?.status === 403) {
        throw new Error('Access denied: You do not have permission to update this article');
      } else if (error.response?.status === 404) {
        throw new Error('Article not found');
      }
      throw error;
    }
  },
  
  // Delete AI/ML article
  deleteArticle: async (id) => {
    try {
      console.log('AI/ML Service: Deleting article ID:', id);
      
      const response = await api.delete(`/ai-ml/news/${id}`);
      console.log('AI/ML Service: Delete response:', response.data);
      
      return { 
        success: true, 
        data: response.data 
      };
    } catch (error) {
      console.error('AI/ML Service: Delete article error:', error);
      
      if (error.response?.status === 403) {
        throw new Error('Access denied: You do not have permission to delete this article');
      } else if (error.response?.status === 404) {
        throw new Error('Article not found');
      }
      throw error;
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
      console.warn('AI/ML view tracking failed (non-critical):', error.message);
      return { success: false };
    }
  },
  
  // Track article interaction
  trackInteraction: async (id, interactionType) => {
    try {
      await api.post(`/ai-ml/news/${id}/interaction`, { 
        interactionType,
        timestamp: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.warn('AI/ML interaction tracking failed (non-critical):', error.message);
      return { success: false };
    }
  },
  
  // ==================== INSIGHTS ====================
  
  // Get AI insights (for admins/managers)
  getInsights: async (params) => {
    try {
      const response = await api.get('/ai-ml/insights', { params });
      const actualData = response.data?.data || response.data;
      return {
        data: actualData?.insights || actualData
      };
    } catch (error) {
      console.error('AI/ML insights error:', error);
      throw error;
    }
  }
};

export default aiMlService;