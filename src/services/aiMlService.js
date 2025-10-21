// src/services/aiMlService.js - COMPLETE CORRECTED VERSION WITH CATEGORY MANAGEMENT
import api from './api';

let mockAiMlNews = [
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

let mockCategoriesData = [
  {
    id: '1',
    name: 'LANGUAGE_MODELS',
    displayName: 'Language Models',
    articleCount: 45,
    isHot: true,
    description: 'Large Language Models and NLP'
  },
  {
    id: '2',
    name: 'COMPUTER_VISION',
    displayName: 'Computer Vision',
    articleCount: 32,
    isHot: true,
    description: 'Image recognition and visual AI'
  },
  {
    id: '3',
    name: 'AUTOMATION',
    displayName: 'Automation',
    articleCount: 28,
    isHot: false,
    description: 'AI-powered automation tools'
  },
  {
    id: '4',
    name: 'ROBOTICS',
    displayName: 'Robotics',
    articleCount: 23,
    isHot: false,
    description: 'AI in robotics and hardware'
  },
  {
    id: '5',
    name: 'HEALTHCARE',
    displayName: 'Healthcare',
    articleCount: 19,
    isHot: true,
    description: 'AI applications in healthcare'
  },
  {
    id: '6',
    name: 'RESEARCH',
    displayName: 'Research',
    articleCount: 15,
    isHot: false,
    description: 'Academic AI research'
  }
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
      console.warn('AI/ML article API unavailable, using mock data. Error:', error.message);
      console.warn('Requested ID:', id);
      
      const mockArticle = mockAiMlNews.find(article => article.id === id) || {
        ...mockAiMlNews[0],
        id: id,
        headline: 'Sample AI/ML Article',
        briefContent: 'This is a sample AI/ML article for demonstration purposes.'
      };
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

  // Get AI/ML categories - UPDATED FOR MOCK WITH ID AND DISPLAYNAME
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
          categories: mockCategoriesData
        }
      };
    }
  },

  // NEW: Create AI/ML category (EDITOR and AD_MANAGER only)
  createCategory: async (data) => {
    try {
      console.log('AI/ML Service: Creating category with data:', data);
      
      const response = await api.post('/ai-ml/categories', data);
      console.log('AI/ML Service: Create category response:', response.data);
      
      const actualData = response.data?.data || response.data;
      return {
        data: actualData?.category || actualData
      };
    } catch (error) {
      console.warn('Categories create API unavailable, simulating with mock data:', error.message);
      
      const newCategory = {
        id: `mock_cat_${Date.now()}`,
        name: data.name,
        displayName: data.displayName || data.name.replace(/_/g, ' ').trim(),
        description: data.description || '',
        isHot: !!data.isHot,
        articleCount: 0
      };
      
      mockCategoriesData.push(newCategory);
      
      return {
        data: newCategory
      };
    }
  },

  // NEW: Update AI/ML category (EDITOR and AD_MANAGER only)
  updateCategory: async (id, data) => {
    try {
      console.log('AI/ML Service: Updating category ID:', id, 'with data:', data);
      
      const response = await api.put(`/ai-ml/categories/${id}`, data);
      console.log('AI/ML Service: Update category response:', response.data);
      
      const actualData = response.data?.data || response.data;
      return {
        data: actualData?.category || actualData
      };
    } catch (error) {
      console.warn('Categories update API unavailable, simulating with mock data:', error.message);
      
      const index = mockCategoriesData.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error('Category not found');
      }
      
      const updatedCategory = {
        ...mockCategoriesData[index],
        name: data.name || mockCategoriesData[index].name,
        displayName: data.displayName !== undefined ? data.displayName : mockCategoriesData[index].displayName,
        description: data.description !== undefined ? data.description : mockCategoriesData[index].description,
        isHot: data.isHot !== undefined ? !!data.isHot : mockCategoriesData[index].isHot,
        articleCount: mockCategoriesData[index].articleCount
      };
      
      mockCategoriesData[index] = updatedCategory;
      
      return {
        data: updatedCategory
      };
    }
  },

  // NEW: Delete AI/ML category (EDITOR and AD_MANAGER only)
  deleteCategory: async (id) => {
    try {
      console.log('AI/ML Service: Deleting category ID:', id);
      
      const response = await api.delete(`/ai-ml/categories/${id}`);
      console.log('AI/ML Service: Delete category response:', response.data);
      
      return { 
        success: true, 
        data: response.data 
      };
    } catch (error) {
      console.warn('Categories delete API unavailable, simulating with mock data:', error.message);
      
      const index = mockCategoriesData.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error('Category not found');
      }
      
      mockCategoriesData.splice(index, 1);
      
      return { 
        success: true 
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
      console.log('AI/ML Service: Tracking view for article ID:', id);
      
      const response = await api.post(`/ai-ml/news/${id}/view`, {
        timestamp: new Date().toISOString()
      });
      
      console.log('AI/ML Service: View tracking response:', response.data);
      return { 
        success: true, 
        data: response.data 
      };
    } catch (error) {
      console.warn('AI/ML view tracking failed (non-critical):', error.message);
      return { 
        success: false, 
        error: error.message 
      };
    }
  },

  // Track article interaction
  trackInteraction: async (id, interactionType) => {
    try {
      console.log('AI/ML Service: Tracking interaction for ID:', id, 'Type:', interactionType);
      
      const response = await api.post(`/ai-ml/news/${id}/interaction`, { 
        interactionType,
        timestamp: new Date().toISOString()
      });
      
      console.log('AI/ML Service: Interaction tracking response:', response.data);
      return { 
        success: true, 
        data: response.data 
      };
    } catch (error) {
      console.warn('AI/ML interaction tracking failed (non-critical):', error.message);
      return { 
        success: false, 
        error: error.message 
      };
    }
  },

  // Create AI/ML article (EDITOR and AD_MANAGER only)
  createArticle: async (data) => {
    try {
      console.log('AI/ML Service: Creating article with data:', data);
      
      const response = await api.post('/ai-ml/news', data);
      console.log('AI/ML Service: Create response:', response.data);
      
      const actualData = response.data?.data || response.data;
      return {
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
      } else if (error.request) {
        throw new Error('Network error: Unable to reach the server');
      } else {
        throw new Error('Failed to create AI/ML article');
      }
    }
  },

  // Update AI/ML article (EDITOR and AD_MANAGER only)
  updateArticle: async (id, data) => {
    try {
      console.log('AI/ML Service: Updating article ID:', id, 'with data:', data);
      
      const response = await api.put(`/ai-ml/news/${id}`, data);
      console.log('AI/ML Service: Update response:', response.data);
      
      const actualData = response.data?.data || response.data;
      return {
        data: actualData?.article || actualData
      };
    } catch (error) {
      console.error('AI/ML Service: Update article error:', error);
      
      if (error.response?.status === 403) {
        throw new Error('Access denied: You do not have permission to update this article');
      } else if (error.response?.status === 404) {
        throw new Error('Article not found');
      } else {
        throw new Error(error.response?.data?.message || 'Failed to update article');
      }
    }
  },

  // Delete AI/ML article (EDITOR and AD_MANAGER only)
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
      } else {
        throw new Error(error.response?.data?.message || 'Failed to delete article');
      }
    }
  }
};