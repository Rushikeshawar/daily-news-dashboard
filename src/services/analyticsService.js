// src/services/analyticsService.js
import api from './api';

const mockDashboardData = {
  overview: {
    totalArticles: 245,
    totalUsers: 1200,
    totalViews: 125000,
    totalRevenue: 15750
  },
  ads: {
    active: 12
  },
  articles: {
    pending: 8,
    published: 187,
    rejected: 5
  },
  chartData: {
    dailyViews: [1200, 1400, 1100, 1600, 1800, 2000, 1750],
    categories: {
      'Technology': 85,
      'Business': 60,
      'Sports': 50,
      'Politics': 35,
      'Entertainment': 15
    }
  },
  topArticles: [
    {
      id: '1',
      headline: 'Breaking: New Technology Breakthrough',
      author: 'John Smith',
      views: 15420
    },
    {
      id: '2',
      headline: 'Market Analysis: Q3 Results',
      author: 'Jane Doe',
      views: 12350
    },
    {
      id: '3',
      headline: 'Sports Update: Championship Finals',
      author: 'Mike Johnson',
      views: 10890
    },
    {
      id: '4',
      headline: 'Political News: Latest Updates',
      author: 'Sarah Wilson',
      views: 9876
    },
    {
      id: '5',
      headline: 'Entertainment: Movie Reviews',
      author: 'Tom Brown',
      views: 8765
    }
  ]
};

export const analyticsService = {
  getDashboard: async (params) => {
    try {
      return await api.get('/analytics/dashboard', { params });
    } catch (error) {
      console.warn('Analytics service unavailable, using mock data:', error.message);
      // Return mock data when API fails
      return {
        data: mockDashboardData
      };
    }
  },
  
  getArticleAnalytics: async (params) => {
    try {
      return await api.get('/analytics/articles', { params });
    } catch (error) {
      console.warn('Article analytics unavailable, using mock data');
      return {
        data: {
          overview: {
            totalArticles: 245,
            totalViews: 125000,
            avgViewsPerArticle: 510
          },
          chartData: {
            viewsOverTime: mockDashboardData.chartData.dailyViews.map((views, index) => ({
              date: `2025-01-${String(index + 7).padStart(2, '0')}`,
              views
            })),
            categoryPerformance: Object.entries(mockDashboardData.chartData.categories).map(([name, articles]) => ({
              category: name,
              articles,
              avgViews: Math.floor(Math.random() * 1000) + 500
            }))
          }
        }
      };
    }
  },
  
  getUserAnalytics: async (params) => {
    try {
      return await api.get('/analytics/users', { params });
    } catch (error) {
      console.warn('User analytics unavailable, using mock data');
      return {
        data: {
          overview: {
            totalUsers: 1200,
            activeUsers: 850,
            newUsers: 45
          },
          chartData: {
            userGrowth: [
              { month: 'Jan', users: 800 },
              { month: 'Feb', users: 950 },
              { month: 'Mar', users: 1100 },
              { month: 'Apr', users: 1200 }
            ],
            usersByRole: {
              'ADMIN': 5,
              'AD_MANAGER': 15,
              'EDITOR': 180,
              'USER': 1000
            }
          }
        }
      };
    }
  }
};