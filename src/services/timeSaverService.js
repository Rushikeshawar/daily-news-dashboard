// src/services/timeSaverService.js - COMPLETE WITH LINKING FUNCTIONALITY
import api from './api';

// Mock data remains the same...
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
    linkedArticleId: null,
    linkedAiArticleId: null,
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
  // Create time saver content
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
        // ADDED: Support for linking
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
      return {
        success: true,
        data: result
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

  // Get time saver content with filtering and pagination
  getContent: async (params = {}) => {
    try {
      console.log('TimeSaver Service: Fetching content with params:', params);
      
      const response = await Promise.race([
        api.get('/time-saver/content', { params }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), API_TIMEOUT)
        )
      ]);

      console.log('TimeSaver Service: Content API response:', response.data);
      
      const actualData = response.data?.data || response.data;
      return {
        success: true,
        data: {
          content: actualData?.content || actualData || [],
          pagination: actualData?.pagination || {
            page: parseInt(params.page) || 1,
            limit: parseInt(params.limit) || 10,
            totalPages: 1,
            totalCount: (actualData?.content || actualData || []).length,
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

  // Get single Time Saver content by ID
  getContentById: async (id) => {
    try {
      console.log('TimeSaver Service: Fetching content by ID:', id);
      
      const response = await Promise.race([
        api.get(`/time-saver/content/${id}`),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), API_TIMEOUT)
        )
      ]);

      const actualData = response.data?.data || response.data;
      return {
        success: true,
        data: actualData?.content || actualData
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

  // NEW: Get Time Saver content by linked article
  getContentByArticle: async (articleId, articleType = 'news') => {
    try {
      console.log('TimeSaver Service: Fetching content by article:', articleId, articleType);
      
      const response = await Promise.race([
        api.get(`/time-saver/by-article/${articleId}`, { 
          params: { type: articleType } 
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), API_TIMEOUT)
        )
      ]);

      const actualData = response.data?.data || response.data;
      return {
        success: true,
        data: {
          content: actualData?.content || actualData || []
        }
      };

    } catch (error) {
      console.warn('TimeSaver Service: Content by article API unavailable');
      return {
        success: true,
        data: {
          content: []
        }
      };
    }
  },

  // NEW: Link Time Saver to Article/AI Article
  linkToArticle: async (timeSaverId, articleId, articleType = 'news') => {
    try {
      console.log('TimeSaver Service: Linking to article:', { timeSaverId, articleId, articleType });
      
      const response = await Promise.race([
        api.post(`/time-saver/content/${timeSaverId}/link`, {
          articleId,
          articleType
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), API_TIMEOUT)
        )
      ]);

      console.log('TimeSaver Service: Link response:', response.data);
      return {
        success: true,
        data: response.data
      };

    } catch (error) {
      console.error('TimeSaver Service: Link error:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Article or Time Saver content not found');
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Invalid link request');
      } else {
        throw new Error('Failed to link content');
      }
    }
  },

  // NEW: Unlink Time Saver from Article/AI Article
  unlinkFromArticle: async (timeSaverId, articleType = 'news') => {
    try {
      console.log('TimeSaver Service: Unlinking from article:', { timeSaverId, articleType });
      
      const response = await Promise.race([
        api.post(`/time-saver/content/${timeSaverId}/unlink`, {
          articleType
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), API_TIMEOUT)
        )
      ]);

      console.log('TimeSaver Service: Unlink response:', response.data);
      return {
        success: true,
        data: response.data
      };

    } catch (error) {
      console.error('TimeSaver Service: Unlink error:', error);
      throw new Error('Failed to unlink content');
    }
  },

  // Update content (with link support)
  updateContent: async (id, data) => {
    try {
      console.log('TimeSaver Service: Updating content ID:', id, 'with data:', data);
      
      const apiData = {
        ...data,
        keyPoints: Array.isArray(data.keyPoints) 
          ? data.keyPoints.join('|')
          : data.keyPoints,
        tags: Array.isArray(data.tags)
          ? data.tags.join(',')
          : data.tags,
        readTimeSeconds: data.readTimeSeconds ? parseInt(data.readTimeSeconds) : null,
        // ADDED: Support for linking updates
        linkedArticleId: data.linkedArticleId !== undefined ? data.linkedArticleId : undefined,
        linkedAiArticleId: data.linkedAiArticleId !== undefined ? data.linkedAiArticleId : undefined
      };

      const response = await Promise.race([
        api.put(`/time-saver/content/${id}`, apiData),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), API_TIMEOUT)
        )
      ]);

      const result = response.data?.data || response.data;
      return {
        success: true,
        data: result
      };

    } catch (error) {
      console.error('TimeSaver Service: Update content error:', error);
      
      if (error.response?.status === 403) {
        throw new Error('Access denied: You do not have permission to update content');
      } else if (error.response?.status === 404) {
        throw new Error('Content not found');
      } else {
        throw new Error(error.response?.data?.message || 'Failed to update content');
      }
    }
  },

  // Get quick stats for dashboard
  getStats: async () => {
    try {
      console.log('TimeSaver Service: Fetching stats');
      
      const response = await Promise.race([
        api.get('/time-saver/stats'),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), API_TIMEOUT)
        )
      ]);

      const actualData = response.data?.data || response.data;
      return {
        success: true,
        data: {
          stats: actualData?.stats || actualData || mockStats
        }
      };

    } catch (error) {
      console.warn('TimeSaver Service: Stats API unavailable, using mock data');
      return {
        success: true,
        data: {
          stats: mockStats
        }
      };
    }
  },

  // Get content by category group
  getContentByCategory: async (group, params = {}) => {
    try {
      console.log('TimeSaver Service: Fetching category content for:', group);
      
      const response = await Promise.race([
        api.get(`/time-saver/category/${group}`, { params }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), API_TIMEOUT)
        )
      ]);

      const actualData = response.data?.data || response.data;
      return {
        success: true,
        data: {
          content: actualData?.content || actualData || [],
          category: actualData?.category || group,
          totalCount: actualData?.totalCount || 0
        }
      };

    } catch (error) {
      console.warn('TimeSaver Service: Category API unavailable, using mock data');
      const filteredContent = mockTimeSaverContent.filter(item => item.contentGroup === group);
      return {
        success: true,
        data: {
          content: filteredContent,
          category: group,
          totalCount: filteredContent.length
        }
      };
    }
  },

  // Search time saver content
  search: async (params = {}) => {
    try {
      console.log('TimeSaver Service: Searching content with params:', params);
      
      const response = await Promise.race([
        api.get('/time-saver/search', { params }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), API_TIMEOUT)
        )
      ]);

      const actualData = response.data?.data || response.data;
      return {
        success: true,
        data: {
          content: actualData?.content || actualData || [],
          searchQuery: params.q,
          pagination: actualData?.pagination || {
            page: 1,
            limit: 10,
            totalPages: 1,
            totalCount: 0,
            hasNext: false,
            hasPrev: false
          }
        }
      };

    } catch (error) {
      console.warn('TimeSaver Service: Search API unavailable, using mock data');
      const searchTerm = params.q?.toLowerCase() || '';
      const filteredContent = mockTimeSaverContent.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.summary.toLowerCase().includes(searchTerm) ||
        (item.tags && item.tags.toLowerCase().includes(searchTerm))
      );
      
      return {
        success: true,
        data: {
          content: filteredContent,
          searchQuery: params.q,
          pagination: {
            page: 1,
            limit: 10,
            totalPages: 1,
            totalCount: filteredContent.length,
            hasNext: false,
            hasPrev: false
          }
        }
      };
    }
  },

  // Get analytics
  getAnalytics: async (params = {}) => {
    try {
      console.log('TimeSaver Service: Fetching analytics');
      
      const response = await Promise.race([
        api.get('/time-saver/analytics', { params }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), API_TIMEOUT)
        )
      ]);

      const actualData = response.data?.data || response.data;
      return {
        success: true,
        data: actualData?.analytics || actualData
      };

    } catch (error) {
      console.warn('TimeSaver Service: Analytics API unavailable, using mock data');
      return {
        success: true,
        data: {
          overview: {
            totalContent: 156,
            totalViews: 25670,
            totalInteractions: 1890,
            averageReadTime: 95
          },
          contentByType: [
            { type: 'DIGEST', count: 45, views: 8900 },
            { type: 'QUICK_UPDATE', count: 38, views: 7200 },
            { type: 'HIGHLIGHTS', count: 25, views: 4500 },
            { type: 'VIRAL', count: 20, views: 3200 },
            { type: 'SOCIAL', count: 18, views: 1870 }
          ],
          topPerforming: mockTimeSaverContent.slice(0, 5),
          engagementMetrics: [
            { metric: 'Views', value: 25670, change: 12.5 },
            { metric: 'Shares', value: 892, change: 8.3 },
            { metric: 'Time Spent', value: '2m 35s', change: 15.2 }
          ]
        }
      };
    }
  },

  // Track content view
  trackView: async (id) => {
    try {
      console.log('TimeSaver Service: Tracking view for ID:', id);
      
      await Promise.race([
        api.post(`/time-saver/content/${id}/view`),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 5000)
        )
      ]);

      return { success: true };
    } catch (error) {
      console.warn('TimeSaver Service: View tracking failed (non-critical):', error.message);
      return { success: false, error: error.message };
    }
  },

  // Track content interaction
  trackInteraction: async (id, interactionType) => {
    try {
      console.log('TimeSaver Service: Tracking interaction for ID:', id, 'Type:', interactionType);
      
      await Promise.race([
        api.post(`/time-saver/content/${id}/interaction`, { interactionType }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 5000)
        )
      ]);

      return { success: true };
    } catch (error) {
      console.warn('TimeSaver Service: Interaction tracking failed (non-critical):', error.message);
      return { success: false, error: error.message };
    }
  },

  // Delete content
  deleteContent: async (id) => {
    try {
      console.log('TimeSaver Service: Deleting content ID:', id);
      
      await Promise.race([
        api.delete(`/time-saver/content/${id}`),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), API_TIMEOUT)
        )
      ]);

      return { success: true };

    } catch (error) {
      console.error('TimeSaver Service: Delete content error:', error);
      
      if (error.response?.status === 403) {
        throw new Error('Access denied: You do not have permission to delete content');
      } else if (error.response?.status === 404) {
        throw new Error('Content not found');
      } else {
        throw new Error(error.response?.data?.message || 'Failed to delete content');
      }
    }
  },

  // Utility functions
  getCategoryGroups: () => categoryGroups,
  
  getContentTypes: () => [
    { value: 'DIGEST', label: 'News Digest' },
    { value: 'QUICK_UPDATE', label: 'Quick Update' },
    { value: 'BRIEFING', label: 'Briefing' },
    { value: 'SUMMARY', label: 'Summary' },
    { value: 'HIGHLIGHTS', label: 'Highlights' },
    { value: 'VIRAL', label: 'Viral Content' },
    { value: 'SOCIAL', label: 'Social Buzz' },
    { value: 'BREAKING', label: 'Breaking News' }
  ],

  getCategories: () => [
    { value: 'TECHNOLOGY', label: 'Technology' },
    { value: 'BUSINESS', label: 'Business' },
    { value: 'SOCIETY', label: 'Society' },
    { value: 'ENTERTAINMENT', label: 'Entertainment' },
    { value: 'GENERAL', label: 'General' },
    { value: 'POLITICS', label: 'Politics' },
    { value: 'SPORTS', label: 'Sports' },
    { value: 'SCIENCE', label: 'Science' },
    { value: 'HEALTH', label: 'Health' },
    { value: 'CULTURE', label: 'Culture' }
  ]
};

export default timeSaverService;