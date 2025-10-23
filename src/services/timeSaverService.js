// src/services/timeSaverService.js - IMPROVED WITH PROPER LINKING & ROUTING

import api from './api';

// Mock data with linked articles
const mockTimeSaverContent = [
  {
    id: '1',
    title: 'Breaking: Major Tech Breakthrough Announced',
    summary: 'Revolutionary AI advancement changes industry landscape with unprecedented capabilities',
    category: 'TECHNOLOGY',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
    keyPoints: ['AI breakthrough', 'Industry impact', 'Future implications'],
    sourceUrl: 'https://example.com/tech-news',
    readTimeSeconds: 120,
    viewCount: 2500,
    isPriority: true,
    contentType: 'DIGEST',
    contentGroup: 'breaking_critical',
    tags: 'tech,ai,breakthrough,critical',
    linkedArticleId: 'article-123',
    linkedAiArticleId: 'ai-article-456',
    // NEW: Include linked article data
    linkedArticle: {
      id: 'article-123',
      title: 'Full Article: AI Breakthrough Details',
      slug: 'ai-breakthrough-details',
      isPublished: true
    },
    linkedAiArticle: {
      id: 'ai-article-456',
      title: 'AI-Generated: Deep Analysis of AI Advancement',
      slug: 'deep-analysis-ai-advancement',
      isPublished: true
    },
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockStats = {
  storiesCount: 12,
  updatesCount: 8,
  breakingCount: 3,
  todayNewCount: 5,
  criticalCount: 7,
  weeklyCount: 15,
  monthlyCount: 30,
  viralBuzzCount: 10,
  changingNormsCount: 8,
  lastUpdated: new Date().toISOString()
};

const categoryGroups = {
  today_new: 'Today\'s New',
  breaking_critical: 'Breaking & Critical',
  weekly_highlights: 'Weekly Highlights',
  monthly_top: 'Monthly Top',
  brief_updates: 'Brief Updates',
  viral_buzz: 'Viral Buzz',
  changing_norms: 'Changing Norms'
};

const API_TIMEOUT = 10000;

export const timeSaverService = {
  
  // ==================== CONTENT CREATION ====================
  
  /**
   * Create time saver content with article linking
   */
  createContent: async (data) => {
    console.log('TimeSaver Service: Creating content with data:', data);
    
    try {
      if (!data.title || !data.summary || !data.category) {
        throw new Error('Title, summary, and category are required');
      }

      const apiData = {
        title: data.title.trim(),
        summary: data.summary.trim(),
        category: data.category,
        imageUrl: data.imageUrl?.trim() || '',
        keyPoints: Array.isArray(data.keyPoints) 
          ? data.keyPoints.filter(point => point.trim()).join('|')
          : (data.keyPoints || '').split('\n').filter(point => point.trim()).join('|'),
        sourceUrl: data.sourceUrl?.trim() || '',
        readTimeSeconds: data.readTimeSeconds ? parseInt(data.readTimeSeconds) : null,
        isPriority: Boolean(data.isPriority),
        contentType: data.contentType || 'DIGEST',
        contentGroup: data.contentGroup || '',
        tags: Array.isArray(data.tags)
          ? data.tags.filter(tag => tag.trim()).join(',')
          : (data.tags || '').split(',').filter(tag => tag.trim()).join(','),
        linkedArticleId: data.linkedArticleId || null,
        linkedAiArticleId: data.linkedAiArticleId || null
      };

      console.log('TimeSaver Service: Sending API data:', apiData);

      const response = await Promise.race([
        api.post('/time-saver/content', apiData),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), API_TIMEOUT)
        )
      ]);

      console.log('TimeSaver Service: API response:', response.data);
      
      const result = response.data?.data || response.data;
      
      // Include article links in response if available
      if (result.linkedArticle || result.linkedAiArticle) {
        console.log('TimeSaver: Created content with linked articles:', {
          linkedArticle: result.linkedArticle?.title,
          linkedAiArticle: result.linkedAiArticle?.title
        });
      }
      
      return {
        success: true,
        data: result,
        message: 'Content created successfully'
      };

    } catch (error) {
      console.error('TimeSaver Service: Create content error:', error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Unknown error';
        
        if (status === 403) {
          throw new Error('Access denied: Only EDITOR and AD_MANAGER roles can create content');
        } else if (status === 401) {
          throw new Error('Authentication required: Please log in to create content');
        } else if (status === 429) {
          throw new Error('Too many requests: Please wait a moment and try again');
        } else if (status === 400) {
          throw new Error(`Validation error: ${message}`);
        } else {
          throw new Error(`Server error: ${message}`);
        }
      } else if (error.request) {
        throw new Error('Network error: Unable to reach the server. Please check your connection.');
      } else if (error.message === 'Request timeout') {
        throw new Error('Request timeout: The server is taking too long to respond');
      } else {
        throw new Error(error.message || 'Failed to create content');
      }
    }
  },

  // ==================== CONTENT FETCHING ====================

  /**
   * Get time saver content with filtering, pagination, and linked articles
   */
  getContent: async (params = {}) => {
    try {
      console.log('TimeSaver Service: Fetching content with params:', params);
      
      // Add includeLinks parameter to fetch linked articles
      const apiParams = {
        ...params,
        includeLinks: true  // Always include linked article information
      };
      
      const response = await Promise.race([
        api.get('/time-saver/content', { params: apiParams }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), API_TIMEOUT)
        )
      ]);

      console.log('TimeSaver Service: Content API response:', response.data);
      
      const actualData = response.data?.data || response.data;
      const content = actualData?.content || actualData || [];
      
      // Log articles with links for debugging
      const linkedContent = content.filter(item => item.linkedArticle || item.linkedAiArticle);
      if (linkedContent.length > 0) {
        console.log(`TimeSaver: Found ${linkedContent.length} items with linked articles`);
      }
      
      return {
        success: true,
        data: {
          content: content,
          pagination: actualData?.pagination || {
            page: parseInt(params.page) || 1,
            limit: parseInt(params.limit) || 10,
            totalPages: 1,
            totalCount: content.length,
            hasNext: false,
            hasPrev: false
          }
        }
      };

    } catch (error) {
      console.warn('TimeSaver Service: Content API unavailable, using mock data:', error.message);
      
      let filteredContent = [...mockTimeSaverContent];
      
      if (params.category && params.category !== 'ALL') {
        filteredContent = filteredContent.filter(item => item.category === params.category);
      }
      
      if (params.contentGroup) {
        filteredContent = filteredContent.filter(item => item.contentGroup === params.contentGroup);
      }
      
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        filteredContent = filteredContent.filter(item => 
          item.title.toLowerCase().includes(searchTerm) ||
          item.summary.toLowerCase().includes(searchTerm) ||
          (item.tags && item.tags.toLowerCase().includes(searchTerm))
        );
      }

      if (params.sortBy) {
        filteredContent.sort((a, b) => {
          let aVal = a[params.sortBy];
          let bVal = b[params.sortBy];
          
          if (params.sortBy === 'publishedAt') {
            aVal = new Date(aVal);
            bVal = new Date(bVal);
          }
          
          if (params.order === 'asc') {
            return aVal > bVal ? 1 : -1;
          } else {
            return aVal < bVal ? 1 : -1;
          }
        });
      }

      const page = parseInt(params.page) || 1;
      const limit = parseInt(params.limit) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedContent = filteredContent.slice(startIndex, endIndex);
      
      return {
        success: true,
        data: {
          content: paginatedContent,
          pagination: {
            page,
            limit,
            totalPages: Math.ceil(filteredContent.length / limit),
            totalCount: filteredContent.length,
            hasNext: endIndex < filteredContent.length,
            hasPrev: page > 1
          }
        }
      };
    }
  },

  /**
   * Get single Time Saver content by ID with linked articles
   */
  getContentById: async (id) => {
    try {
      console.log('TimeSaver Service: Fetching content by ID:', id);
      
      const response = await Promise.race([
        api.get(`/time-saver/content/${id}?includeLinks=true`),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), API_TIMEOUT)
        )
      ]);

      const actualData = response.data?.data || response.data;
      const content = actualData?.content || actualData;
      
      // Log linked articles if present
      if (content.linkedArticle || content.linkedAiArticle) {
        console.log('TimeSaver: Content has linked articles:', {
          id: content.id,
          linkedArticle: content.linkedArticle?.title,
          linkedAiArticle: content.linkedAiArticle?.title
        });
      }
      
      return {
        success: true,
        data: content
      };

    } catch (error) {
      console.warn('TimeSaver Service: Content by ID API unavailable, using mock data');
      const mockItem = mockTimeSaverContent.find(item => item.id === id) || mockTimeSaverContent[0];
      return {
        success: true,
        data: mockItem
      };
    }
  },

  // ==================== ARTICLE LINKING HELPERS ====================

  /**
   * Get the correct article URL for navigation
   * @param {Object} content - Time Saver content with linked articles
   * @param {boolean} isLoggedIn - User login status
   * @returns {Object} - Navigation info { url, requiresAuth, articleType }
   */
  getArticleNavigationUrl: (content, isLoggedIn = false) => {
    console.log('TimeSaver: Getting navigation URL for content:', content.id);
    console.log('User logged in:', isLoggedIn);
    
    // Priority 1: Use linked regular article if available
    if (content.linkedArticle && content.linkedArticle.slug) {
      const articleUrl = `/articles/${content.linkedArticle.slug}`;
      console.log('Navigating to linked article:', articleUrl);
      
      return {
        url: articleUrl,
        requiresAuth: false,
        articleType: 'regular',
        title: content.linkedArticle.title
      };
    }
    
    // Priority 2: Use linked AI article if available and user is logged in
    if (content.linkedAiArticle && content.linkedAiArticle.slug) {
      if (isLoggedIn) {
        const aiArticleUrl = `/ai-articles/${content.linkedAiArticle.slug}`;
        console.log('Navigating to AI article:', aiArticleUrl);
        
        return {
          url: aiArticleUrl,
          requiresAuth: true,
          articleType: 'ai',
          title: content.linkedAiArticle.title
        };
      } else {
        console.log('AI article requires authentication, redirecting to login');
        
        return {
          url: `/login?redirect=/ai-articles/${content.linkedAiArticle.slug}`,
          requiresAuth: true,
          articleType: 'ai',
          title: content.linkedAiArticle.title,
          needsLogin: true
        };
      }
    }
    
    // Priority 3: Use source URL if provided
    if (content.sourceUrl) {
      console.log('Using source URL:', content.sourceUrl);
      
      return {
        url: content.sourceUrl,
        requiresAuth: false,
        articleType: 'external',
        isExternal: true
      };
    }
    
    // No link available
    console.log('No article link available for content:', content.id);
    return {
      url: null,
      requiresAuth: false,
      articleType: null
    };
  },

  /**
   * Check if content has a linked article
   */
  hasLinkedArticle: (content) => {
    return !!(content.linkedArticle || content.linkedAiArticle || content.sourceUrl);
  },

  /**
   * Get linked article details
   */
  getLinkedArticleInfo: (content) => {
    if (content.linkedArticle) {
      return {
        type: 'regular',
        id: content.linkedArticle.id,
        title: content.linkedArticle.title,
        slug: content.linkedArticle.slug,
        isPublished: content.linkedArticle.isPublished,
        requiresAuth: false
      };
    }
    
    if (content.linkedAiArticle) {
      return {
        type: 'ai',
        id: content.linkedAiArticle.id,
        title: content.linkedAiArticle.title,
        slug: content.linkedAiArticle.slug,
        isPublished: content.linkedAiArticle.isPublished,
        requiresAuth: true
      };
    }
    
    if (content.sourceUrl) {
      return {
        type: 'external',
        url: content.sourceUrl,
        requiresAuth: false
      };
    }
    
    return null;
  },

  // ==================== SEARCH & FILTER ====================

  /**
   * Search articles to link with Time Saver content
   */
  searchArticles: async (query, type = 'regular') => {
    try {
      const endpoint = type === 'ai' ? '/ai-articles/search' : '/articles/search';
      const response = await api.get(endpoint, {
        params: {
          q: query,
          limit: 20,
          isPublished: true
        }
      });

      return {
        success: true,
        data: response.data?.data || response.data || []
      };
    } catch (error) {
      console.error('TimeSaver Service: Search articles error:', error);
      return {
        success: false,
        data: [],
        error: error.message
      };
    }
  },

  /**
   * Get Time Saver content by linked article
   */
  getContentByArticle: async (articleId, articleType = 'regular') => {
    try {
      const params = articleType === 'ai' 
        ? { linkedAiArticleId: articleId }
        : { linkedArticleId: articleId };

      const response = await api.get('/time-saver/content', { params });

      return {
        success: true,
        data: response.data?.data?.content || response.data?.content || []
      };
    } catch (error) {
      console.error('TimeSaver Service: Get content by article error:', error);
      return {
        success: false,
        data: [],
        error: error.message
      };
    }
  },

  // ==================== STATS & ANALYTICS ====================

  /**
   * Get statistics
   */
  getStats: async () => {
    try {
      const response = await Promise.race([
        api.get('/time-saver/stats'),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), API_TIMEOUT)
        )
      ]);

      return {
        success: true,
        data: response.data?.data || response.data || mockStats
      };
    } catch (error) {
      console.warn('TimeSaver Service: Stats API unavailable, using mock data');
      return {
        success: true,
        data: mockStats
      };
    }
  },

  // ==================== INTERACTIONS ====================

  /**
   * Record view
   */
  recordView: async (contentId) => {
    try {
      await api.post(`/time-saver/content/${contentId}/view`);
      return { success: true };
    } catch (error) {
      console.error('TimeSaver Service: Record view error:', error);
      return { success: false };
    }
  },

  /**
   * Record interaction
   */
  recordInteraction: async (contentId, interactionType) => {
    try {
      await api.post(`/time-saver/content/${contentId}/interaction`, {
        interactionType
      });
      return { success: true };
    } catch (error) {
      console.error('TimeSaver Service: Record interaction error:', error);
      return { success: false };
    }
  },

  /**
   * Update content
   */
  updateContent: async (id, data) => {
    try {
      const apiData = {
        title: data.title?.trim(),
        summary: data.summary?.trim(),
        category: data.category,
        imageUrl: data.imageUrl?.trim(),
        keyPoints: Array.isArray(data.keyPoints) 
          ? data.keyPoints.filter(point => point.trim()).join('|')
          : data.keyPoints,
        sourceUrl: data.sourceUrl?.trim(),
        readTimeSeconds: data.readTimeSeconds ? parseInt(data.readTimeSeconds) : undefined,
        isPriority: data.isPriority !== undefined ? Boolean(data.isPriority) : undefined,
        contentType: data.contentType,
        contentGroup: data.contentGroup,
        tags: Array.isArray(data.tags)
          ? data.tags.filter(tag => tag.trim()).join(',')
          : data.tags,
        linkedArticleId: data.linkedArticleId,
        linkedAiArticleId: data.linkedAiArticleId
      };

      // Remove undefined values
      Object.keys(apiData).forEach(key => 
        apiData[key] === undefined && delete apiData[key]
      );

      const response = await api.put(`/time-saver/content/${id}`, apiData);

      return {
        success: true,
        data: response.data?.data || response.data,
        message: 'Content updated successfully'
      };
    } catch (error) {
      console.error('TimeSaver Service: Update content error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update content');
    }
  },

  /**
   * Delete content
   */
  deleteContent: async (id) => {
    try {
      await api.delete(`/time-saver/content/${id}`);
      return {
        success: true,
        message: 'Content deleted successfully'
      };
    } catch (error) {
      console.error('TimeSaver Service: Delete content error:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete content');
    }
  },

  // Helper to get category groups
  getCategoryGroups: () => categoryGroups
};

export default timeSaverService;