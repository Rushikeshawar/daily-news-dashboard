// src/services/aiMlService.js
import api from './api';

const mockAiMlNews = [
  {
    id: '1',
    headline: 'OpenAI Releases GPT-5 with Revolutionary Capabilities',
    briefContent: 'The latest language model from OpenAI demonstrates unprecedented reasoning abilities and multimodal understanding.',
    fullContent: 'OpenAI has announced the release of GPT-5, marking a significant leap forward in artificial intelligence capabilities. The new model demonstrates enhanced reasoning, improved factual accuracy, and advanced multimodal understanding that can process text, images, and audio simultaneously.',
    category: 'LANGUAGE_MODELS',
    featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    tags: ['gpt-5', 'openai', 'language-model', 'ai'],
    aiModel: 'GPT-5',
    aiApplication: 'Natural Language Processing',
    companyMentioned: 'OpenAI',
    technologyType: 'Large Language Model',
    viewCount: 15420,
    shareCount: 892,
    relevanceScore: 9.5,
    isTrending: true,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    headline: 'Google DeepMind Breakthrough in Protein Folding',
    briefContent: 'AlphaFold 3 achieves unprecedented accuracy in predicting protein structures, opening new possibilities for drug discovery.',
    fullContent: 'Google DeepMind has unveiled AlphaFold 3, the latest iteration of their protein structure prediction system. This breakthrough represents a significant advancement in computational biology.',
    category: 'COMPUTER_VISION',
    featuredImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
    tags: ['alphafold', 'deepmind', 'protein-folding', 'biology'],
    aiModel: 'AlphaFold 3',
    aiApplication: 'Protein Structure Prediction',
    companyMentioned: 'Google DeepMind',
    technologyType: 'Deep Learning',
    viewCount: 12350,
    shareCount: 567,
    relevanceScore: 9.2,
    isTrending: true,
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '3',
    headline: 'Microsoft Copilot Integration Across Office Suite',
    briefContent: 'Microsoft announces comprehensive AI integration across all Office applications, transforming workplace productivity.',
    fullContent: 'Microsoft has announced a major expansion of its Copilot AI assistant across the entire Office suite, promising to revolutionize how users interact with documents, spreadsheets, and presentations.',
    category: 'AUTOMATION',
    featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    tags: ['microsoft', 'copilot', 'office', 'productivity'],
    aiModel: 'Microsoft Copilot',
    aiApplication: 'Productivity Assistant',
    companyMentioned: 'Microsoft',
    technologyType: 'AI Assistant',
    viewCount: 8790,
    shareCount: 423,
    relevanceScore: 8.7,
    isTrending: false,
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

const mockCategories = [
  { name: 'LANGUAGE_MODELS', articleCount: 45, isHot: true, description: 'Large Language Models and NLP' },
  { name: 'COMPUTER_VISION', articleCount: 32, isHot: true, description: 'Image recognition and visual AI' },
  { name: 'AUTOMATION', articleCount: 28, isHot: false, description: 'AI-powered automation tools' },
  { name: 'ROBOTICS', articleCount: 23, isHot: false, description: 'AI in robotics and hardware' },
  { name: 'HEALTHCARE', articleCount: 19, isHot: true, description: 'AI applications in healthcare' },
  { name: 'RESEARCH', articleCount: 15, isHot: false, description: 'Academic AI research' }
];

export const aiMlService = {
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
      console.warn('AI/ML news API unavailable, using mock data:', error.message);
      
      let filteredArticles = [...mockAiMlNews];
      
      if (params?.category) {
        filteredArticles = filteredArticles.filter(article => article.category === params.category);
      }
      
      if (params?.search) {
        const searchTerm = params.search.toLowerCase();
        filteredArticles = filteredArticles.filter(article => 
          article.headline.toLowerCase().includes(searchTerm) ||
          article.briefContent.toLowerCase().includes(searchTerm) ||
          article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }
      
      return {
        data: {
          articles: filteredArticles,
          pagination: {
            page: params?.page || 1,
            limit: params?.limit || 10,
            totalPages: Math.ceil(filteredArticles.length / (params?.limit || 10)),
            totalCount: filteredArticles.length,
            hasNext: false,
            hasPrev: false
          }
        }
      };
    }
  },

  // Get single AI/ML article
  getArticle: async (id) => {
    try {
      const response = await api.get(`/ai-ml/news/${id}`);
      const actualData = response.data?.data || response.data;
      return {
        data: actualData?.article || actualData
      };
    } catch (error) {
      console.warn('AI/ML article API unavailable, using mock data');
      const mockArticle = mockAiMlNews.find(article => article.id === id) || mockAiMlNews[0];
      return {
        data: mockArticle
      };
    }
  },

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
      console.warn('AI/ML trending API unavailable, using mock data');
      const trendingArticles = mockAiMlNews.filter(article => article.isTrending);
      return {
        data: {
          articles: trendingArticles
        }
      };
    }
  },

  // Search AI/ML content
  search: async (params) => {
    try {
      const response = await api.get('/ai-ml/search', { params });
      const actualData = response.data?.data || response.data;
      return {
        data: {
          articles: actualData?.articles || actualData || [],
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
      console.warn('AI/ML search API unavailable, using mock data');
      const searchTerm = params.q?.toLowerCase() || '';
      const filteredArticles = mockAiMlNews.filter(article => 
        article.headline.toLowerCase().includes(searchTerm) ||
        article.briefContent.toLowerCase().includes(searchTerm)
      );
      
      return {
        data: {
          articles: filteredArticles,
          searchQuery: params.q,
          pagination: {
            page: 1,
            limit: 10,
            totalPages: 1,
            totalCount: filteredArticles.length,
            hasNext: false,
            hasPrev: false
          }
        }
      };
    }
  },

  // Get AI/ML categories
  getCategories: async () => {
    try {
      const response = await api.get('/ai-ml/categories');
      const actualData = response.data?.data || response.data;
      return {
        data: {
          categories: actualData?.categories || actualData || []
        }
      };
    } catch (error) {
      console.warn('AI/ML categories API unavailable, using mock data');
      return {
        data: {
          categories: mockCategories
        }
      };
    }
  },

  // Get articles by category
  getArticlesByCategory: async (category, params) => {
    try {
      const response = await api.get(`/ai-ml/categories/${category}/articles`, { params });
      const actualData = response.data?.data || response.data;
      return {
        data: {
          category: actualData?.category || category,
          articles: actualData?.articles || actualData || [],
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
      console.warn('AI/ML category articles API unavailable, using mock data');
      const filteredArticles = mockAiMlNews.filter(article => article.category === category);
      return {
        data: {
          category,
          articles: filteredArticles,
          pagination: {
            page: 1,
            limit: 10,
            totalPages: 1,
            totalCount: filteredArticles.length,
            hasNext: false,
            hasPrev: false
          }
        }
      };
    }
  },

  // Get popular topics
  getPopularTopics: async (params) => {
    try {
      const response = await api.get('/ai-ml/popular-topics', { params });
      const actualData = response.data?.data || response.data;
      return {
        data: {
          topics: actualData?.topics || []
        }
      };
    } catch (error) {
      console.warn('AI/ML popular topics API unavailable, using mock data');
      const mockTopics = [
        { topic: 'gpt-5', score: 1500 },
        { topic: 'deepmind', score: 1200 },
        { topic: 'computer-vision', score: 980 },
        { topic: 'robotics', score: 750 },
        { topic: 'healthcare-ai', score: 650 }
      ];
      return {
        data: {
          topics: mockTopics
        }
      };
    }
  },

  // Get AI insights (for admins/managers)
  getInsights: async (params) => {
    try {
      const response = await api.get('/ai-ml/insights', { params });
      const actualData = response.data?.data || response.data;
      return {
        data: actualData?.insights || actualData
      };
    } catch (error) {
      console.warn('AI/ML insights API unavailable, using mock data');
      return {
        data: {
          overview: {
            totalArticles: 234,
            totalViews: 45670,
            totalShares: 2890,
            averageViews: 195
          },
          trendingArticles: mockAiMlNews.filter(a => a.isTrending),
          topCategories: [
            { category: 'LANGUAGE_MODELS', articleCount: 45, totalViews: 15420 },
            { category: 'COMPUTER_VISION', articleCount: 32, totalViews: 12350 },
            { category: 'AUTOMATION', articleCount: 28, totalViews: 8790 }
          ],
          topAiModels: [
            { aiModel: 'GPT-5', articleCount: 8, totalViews: 3420 },
            { aiModel: 'AlphaFold 3', articleCount: 5, totalViews: 2350 },
            { aiModel: 'Microsoft Copilot', articleCount: 6, totalViews: 1790 }
          ],
          engagementMetrics: [
            { type: 'SHARE', count: 892 },
            { type: 'BOOKMARK', count: 567 },
            { type: 'LIKE', count: 1234 }
          ]
        }
      };
    }
  },

  // Track article view
  trackView: async (id) => {
    try {
      await api.post(`/ai-ml/articles/${id}/view`);
      return { data: { success: true } };
    } catch (error) {
      console.warn('AI/ML view tracking unavailable');
      return { data: { success: true } };
    }
  },

  // Track article interaction
  trackInteraction: async (id, interactionType) => {
    try {
      await api.post(`/ai-ml/articles/${id}/interaction`, { interactionType });
      return { data: { success: true } };
    } catch (error) {
      console.warn('AI/ML interaction tracking unavailable');
      return { data: { success: true } };
    }
  },

  // Create AI/ML article (Admin only)
  createArticle: async (data) => {
    try {
      const response = await api.post('/ai-ml/news', data);
      const actualData = response.data?.data || response.data;
      return {
        data: actualData?.article || actualData
      };
    } catch (error) {
      console.warn('Create AI/ML article API unavailable');
      return {
        data: {
          id: Date.now().toString(),
          ...data,
          viewCount: 0,
          shareCount: 0,
          isTrending: false,
          publishedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        }
      };
    }
  }
};