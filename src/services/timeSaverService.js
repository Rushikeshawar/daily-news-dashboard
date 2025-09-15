// src/services/timeSaverService.js
import api from './api';

const mockTimeSaverContent = [
  {
    id: '1',
    title: 'Breaking: Major Tech Breakthrough Announced',
    summary: 'Revolutionary AI advancement changes industry landscape with unprecedented capabilities',
    category: 'TECHNOLOGY',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
    iconName: 'Cpu',
    bgColor: 'bg-blue-500',
    keyPoints: ['AI breakthrough', 'Industry impact', 'Future implications'],
    sourceUrl: 'https://example.com/tech-news',
    readTimeSeconds: 120,
    viewCount: 2500,
    isPriority: true,
    contentType: 'DIGEST',
    contentGroup: 'breaking_critical',
    tags: ['tech', 'ai', 'breakthrough', 'critical'],
    publishedAt: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Week in Review: Key Developments',
    summary: 'Major stories that shaped this week\'s headlines across technology, business, and politics',
    category: 'GENERAL',
    imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=400&fit=crop',
    iconName: 'Calendar',
    bgColor: 'bg-indigo-500',
    keyPoints: ['Weekly summary', 'Key developments', 'Major stories'],
    sourceUrl: 'https://example.com/weekly-review',
    readTimeSeconds: 180,
    viewCount: 890,
    isPriority: false,
    contentType: 'HIGHLIGHTS',
    contentGroup: 'weekly_highlights',
    tags: ['weekly', 'highlights', 'review'],
    publishedAt: new Date(Date.now() - 3*24*60*60*1000).toISOString()
  },
  {
    id: '6',
    title: 'Monthly Overview: Trending Topics',
    summary: 'Most significant developments from the past month across all major sectors',
    category: 'GENERAL',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    iconName: 'BarChart3',
    bgColor: 'bg-red-500',
    keyPoints: ['Monthly overview', 'Trending topics', 'Significant developments'],
    sourceUrl: 'https://example.com/monthly-overview',
    readTimeSeconds: 300,
    viewCount: 1450,
    isPriority: false,
    contentType: 'SUMMARY',
    contentGroup: 'monthly_top',
    tags: ['monthly', 'overview', 'trending'],
    publishedAt: new Date(Date.now() - 15*24*60*60*1000).toISOString()
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

export const timeSaverService = {
  // Get time saver content with filtering
  getContent: async (params) => {
    try {
      const response = await api.get('/time-saver/content', { params });
      console.log('Time Saver content API response:', response.data);
      
      const actualData = response.data?.data || response.data;
      return {
        data: {
          content: actualData?.content || actualData || [],
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
      console.warn('Time Saver content API unavailable, using mock data:', error.message);
      
      let filteredContent = [...mockTimeSaverContent];
      
      if (params?.category) {
        filteredContent = filteredContent.filter(item => item.category === params.category);
      }
      
      if (params?.contentGroup) {
        filteredContent = filteredContent.filter(item => item.contentGroup === params.contentGroup);
      }
      
      if (params?.search) {
        const searchTerm = params.search.toLowerCase();
        filteredContent = filteredContent.filter(item => 
          item.title.toLowerCase().includes(searchTerm) ||
          item.summary.toLowerCase().includes(searchTerm)
        );
      }
      
      return {
        data: {
          content: filteredContent,
          pagination: {
            page: params?.page || 1,
            limit: params?.limit || 10,
            totalPages: Math.ceil(filteredContent.length / (params?.limit || 10)),
            totalCount: filteredContent.length,
            hasNext: false,
            hasPrev: false
          }
        }
      };
    }
  },

  // Get quick stats for dashboard
  getStats: async () => {
    try {
      const response = await api.get('/time-saver/stats');
      const actualData = response.data?.data || response.data;
      return {
        data: {
          stats: actualData?.stats || actualData || mockStats
        }
      };
    } catch (error) {
      console.warn('Time Saver stats API unavailable, using mock data');
      return {
        data: {
          stats: mockStats
        }
      };
    }
  },

  // Get content by category group
  getContentByCategory: async (group, params) => {
    try {
      const response = await api.get(`/time-saver/category/${group}`, { params });
      const actualData = response.data?.data || response.data;
      return {
        data: {
          content: actualData?.content || actualData || [],
          category: actualData?.category || group,
          totalCount: actualData?.totalCount || 0
        }
      };
    } catch (error) {
      console.warn('Time Saver category content API unavailable, using mock data');
      const filteredContent = mockTimeSaverContent.filter(item => item.contentGroup === group);
      return {
        data: {
          content: filteredContent,
          category: group,
          totalCount: filteredContent.length
        }
      };
    }
  },

  // Search time saver content
  search: async (params) => {
    try {
      const response = await api.get('/time-saver/search', { params });
      const actualData = response.data?.data || response.data;
      return {
        data: {
          content: actualData?.content || actualData || [],
          searchQuery: params.q,
          pagination: actualData?.pagination || {
            page: params?.page || 1,
            limit: params?.limit || 10,
            totalPages: 1,
            totalCount: 0,
            hasNext: false,
            hasPrev: false
          }
        }
      };
    } catch (error) {
      console.warn('Time Saver search API unavailable, using mock data');
      const searchTerm = params.q?.toLowerCase() || '';
      const filteredContent = mockTimeSaverContent.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.summary.toLowerCase().includes(searchTerm)
      );
      
      return {
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

  // Get analytics (for admins/managers)
  getAnalytics: async (params) => {
    try {
      const response = await api.get('/time-saver/analytics', { params });
      const actualData = response.data?.data || response.data;
      return {
        data: actualData?.analytics || actualData
      };
    } catch (error) {
      console.warn('Time Saver analytics API unavailable, using mock data');
      return {
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
      await api.post(`/time-saver/content/${id}/view`);
      return { data: { success: true } };
    } catch (error) {
      console.warn('Time Saver view tracking unavailable');
      return { data: { success: true } };
    }
  },

  // Track content interaction
  trackInteraction: async (id, interactionType) => {
    try {
      await api.post(`/time-saver/content/${id}/interaction`, { interactionType });
      return { data: { success: true } };
    } catch (error) {
      console.warn('Time Saver interaction tracking unavailable');
      return { data: { success: true } };
    }
  },

  // Create time saver content (Admin only)
  createContent: async (data) => {
    try {
      const response = await api.post('/time-saver/content', data);
      const actualData = response.data?.data || response.data;
      return {
        data: actualData?.content || actualData
      };
    } catch (error) {
      console.warn('Create Time Saver content API unavailable');
      return {
        data: {
          id: Date.now().toString(),
          ...data,
          viewCount: 0,
          publishedAt: new Date().toISOString()
        }
      };
    }
  },

  // Get category groups for UI
  getCategoryGroups: () => {
    return categoryGroups;
  },

  // Get breaking news
  getBreakingNews: async (params) => {
    try {
      const response = await api.get('/time-saver/breaking-news', { params });
      const actualData = response.data?.data || response.data;
      return {
        data: {
          news: actualData?.news || actualData || []
        }
      };
    } catch (error) {
      console.warn('Breaking news API unavailable, using mock data');
      const breakingNews = mockTimeSaverContent.filter(item => 
        item.isPriority || item.contentGroup === 'breaking_critical'
      );
      return {
        data: {
          news: breakingNews
        }
      };
    }
  },

  // Get trending updates
  getTrendingUpdates: async (params) => {
    try {
      const response = await api.get('/time-saver/trending-updates', { params });
      const actualData = response.data?.data || response.data;
      return {
        data: {
          updates: actualData?.updates || actualData || []
        }
      };
    } catch (error) {
      console.warn('Trending updates API unavailable, using mock data');
      const trendingUpdates = mockTimeSaverContent
        .filter(item => item.contentGroup === 'viral_buzz')
        .sort((a, b) => b.viewCount - a.viewCount);
      return {
        data: {
          updates: trendingUpdates
        }
      };
    }
  }
};: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Market Update: Stocks Reach New Heights',
    summary: 'Major indices hit record levels amid economic optimism and strong earnings reports',
    category: 'BUSINESS',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop',
    iconName: 'TrendingUp',
    bgColor: 'bg-green-500',
    keyPoints: ['Stock markets', 'Record highs', 'Economic growth'],
    sourceUrl: 'https://example.com/market-news',
    readTimeSeconds: 45,
    viewCount: 1800,
    isPriority: false,
    contentType: 'QUICK_UPDATE',
    contentGroup: 'today_new',
    tags: ['business', 'stocks', 'market', 'today'],
    publishedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Viral Video Takes Internet by Storm',
    summary: 'Unexpected clip garners millions of views in hours, sparking global conversation',
    category: 'ENTERTAINMENT',
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop',
    iconName: 'Video',
    bgColor: 'bg-purple-500',
    keyPoints: ['Viral content', 'Social media', 'Internet sensation'],
    sourceUrl: 'https://example.com/viral-news',
    readTimeSeconds: 30,
    viewCount: 5200,
    isPriority: false,
    contentType: 'VIRAL',
    contentGroup: 'viral_buzz',
    tags: ['viral', 'trending', 'social', 'entertainment'],
    publishedAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Society Shifts: New Cultural Paradigm Emerges',
    summary: 'Generational changes reshape societal norms and values across multiple demographics',
    category: 'SOCIETY',
    imageUrl: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&h=400&fit=crop',
    iconName: 'Users',
    bgColor: 'bg-orange-500',
    keyPoints: ['Cultural shift', 'Generational change', 'New norms'],
    sourceUrl: 'https://example.com/society-news',
    readTimeSeconds: 150,
    viewCount: 1200,
    isPriority: false,
    contentType: 'SOCIAL',
    contentGroup: 'changing_norms',
    tags: ['society', 'culture', 'change', 'norms', 'social'],
    publishedAt