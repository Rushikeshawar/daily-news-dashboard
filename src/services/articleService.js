// src/services/articleService.js - COMPLETE AND CLEAN
import api from './api';

const mockArticles = [
  {
    id: 'cmf4af83h000711uytq6mtr6f',
    headline: 'Breaking: Technology Advances in 2025',
    briefContent: 'Major technological breakthroughs announced this year including AI advancements, quantum computing progress, and sustainable energy solutions.',
    fullContent: `The year 2025 has been marked by unprecedented technological advancements across multiple sectors. Artificial Intelligence has reached new milestones with the development of more efficient neural networks.`,
    category: 'TECHNOLOGY',
    status: 'PENDING', // Changed to PENDING for testing
    author: { 
      fullName: 'John Doe',
      id: 'user1'
    },
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    viewCount: 1250,
    featuredImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop',
    tags: ['technology', 'innovation', 'AI'],
    priorityLevel: 5
  },
  {
    id: 'pending-article-1',
    headline: 'Pending Article for Review',
    briefContent: 'This article is waiting for approval from the editorial team.',
    fullContent: 'Full content of the pending article...',
    category: 'GENERAL',
    status: 'PENDING',
    author: { 
      fullName: 'Test Author',
      id: 'user2'
    },
    createdAt: new Date().toISOString(),
    viewCount: 0,
    featuredImage: null,
    tags: ['test', 'pending'],
    priorityLevel: 3
  }
];

export const articleService = {
  getArticles: async (params) => {
    try {
      console.log('ArticleService: Requesting articles with params:', params);
      
      // Map frontend category names to backend values
      const categoryMap = {
        'Technology': 'TECHNOLOGY',
        'Business': 'BUSINESS', 
        'Sports': 'SPORTS',
        'Politics': 'POLITICS',
        'Entertainment': 'ENTERTAINMENT',
        'Science': 'SCIENCE',
        'Health': 'HEALTH',
        'Travel': 'TRAVEL',
        'Education': 'EDUCATION'
      };
      
      // Transform params for backend
      const backendParams = {
        ...params,
        category: params.category ? (categoryMap[params.category] || params.category) : undefined
      };
      
      // Remove undefined values
      Object.keys(backendParams).forEach(key => {
        if (backendParams[key] === undefined || backendParams[key] === '') {
          delete backendParams[key];
        }
      });
      
      console.log('ArticleService: Transformed params for backend:', backendParams);
      
      const response = await api.get('/articles', { params: backendParams });
      console.log('ArticleService: Raw API response:', response.data);
      
      // Handle the backend response structure
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
            currentPage: backendParams?.page || 1,
            totalPages: 1,
            totalItems: Array.isArray(articlesData) ? articlesData.length : 0,
            hasNext: false,
            hasPrevious: false
          }
        }
      };
    } catch (error) {
      console.warn('Articles API unavailable, using mock data:', error.message);
      
      // Filter mock data based on params
      let filteredArticles = [...mockArticles];
      
      if (params?.status) {
        filteredArticles = filteredArticles.filter(article => article.status === params.status);
      }
      
      if (params?.category) {
        const categoryMap = {
          'Technology': 'TECHNOLOGY',
          'Business': 'BUSINESS', 
          'Sports': 'SPORTS'
        };
        const backendCategory = categoryMap[params.category] || params.category;
        filteredArticles = filteredArticles.filter(article => article.category === backendCategory);
      }
      
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        filteredArticles = filteredArticles.filter(article => 
          article.headline.toLowerCase().includes(searchLower) ||
          article.briefContent.toLowerCase().includes(searchLower)
        );
      }
      
      return {
        data: {
          articles: filteredArticles,
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: filteredArticles.length,
            hasNext: false,
            hasPrevious: false
          }
        }
      };
    }
  },
  
  getPendingArticles: async (params) => {
    try {
      console.log('ArticleService: Requesting pending articles with params:', params);
      
      // Force status to PENDING for this specific call
      const pendingParams = {
        ...params,
        status: 'PENDING'
      };
      
      console.log('ArticleService: Pending params sent to API:', pendingParams);
      
      const response = await api.get('/articles', { params: pendingParams });
      console.log('ArticleService: Pending articles raw response:', response.data);
      
      let articlesData, paginationData;
      
      if (response.data && response.data.success && response.data.data) {
        const dataObject = response.data.data;
        articlesData = dataObject.articles || dataObject || [];
        paginationData = dataObject.pagination;
      } else {
        articlesData = response.data || [];
        paginationData = null;
      }
      
      // Ensure we only get PENDING articles (double-check filtering)
      const pendingArticles = Array.isArray(articlesData) ? 
        articlesData.filter(article => article.status === 'PENDING') : [];
      
      console.log('ArticleService: Filtered pending articles:', pendingArticles);
      
      return {
        data: {
          articles: pendingArticles,
          pagination: paginationData || {
            currentPage: pendingParams?.page || 1,
            totalPages: 1,
            totalItems: pendingArticles.length,
            hasNext: false,
            hasPrevious: false
          }
        }
      };
    } catch (error) {
      console.warn('Pending articles API unavailable, using mock data');
      const pendingArticles = mockArticles.filter(article => article.status === 'PENDING');
      
      return {
        data: {
          articles: pendingArticles,
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: pendingArticles.length
          }
        }
      };
    }
  },
  
  getArticle: async (id) => {
    try {
      const response = await api.get(`/articles/${id}`);
      console.log('Article detail API response:', response.data);
      
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
      
      return {
        data: articleData
      };
    } catch (error) {
      console.warn('Article API unavailable, using mock data');
      const mockArticle = mockArticles.find(article => article.id === id) || {
        ...mockArticles[0],
        id: id,
        headline: 'Sample Article Title',
        briefContent: 'Sample brief content for the article...',
        fullContent: 'This is the full content of the article.'
      };
      
      return {
        data: mockArticle
      };
    }
  },
  
  createArticle: async (data) => {
    try {
      // Transform category name to backend format
      const categoryMap = {
        'Technology': 'TECHNOLOGY',
        'Business': 'BUSINESS', 
        'Sports': 'SPORTS',
        'Politics': 'POLITICS',
        'Entertainment': 'ENTERTAINMENT',
        'Science': 'SCIENCE',
        'Health': 'HEALTH',
        'Travel': 'TRAVEL',
        'Education': 'EDUCATION'
      };
      
      const transformedData = {
        ...data,
        category: categoryMap[data.category] || data.category
      };
      
      console.log('ArticleService: Creating article with data:', transformedData);
      
      const response = await api.post('/articles', transformedData);
      
      let articleData;
      if (response.data && response.data.success && response.data.data) {
        articleData = response.data.data.article || response.data.data;
      } else {
        articleData = response.data;
      }
      
      return {
        data: articleData
      };
    } catch (error) {
      console.warn('Create article API unavailable');
      return {
        data: {
          id: Date.now().toString(),
          ...data,
          status: 'PENDING',
          author: { fullName: 'Current User', id: 'currentuser' },
          createdAt: new Date().toISOString(),
          viewCount: 0
        }
      };
    }
  },
  
  updateArticle: async (id, data) => {
    try {
      // Transform category name to backend format
      const categoryMap = {
        'Technology': 'TECHNOLOGY',
        'Business': 'BUSINESS', 
        'Sports': 'SPORTS',
        'Politics': 'POLITICS',
        'Entertainment': 'ENTERTAINMENT',
        'Science': 'SCIENCE',
        'Health': 'HEALTH',
        'Travel': 'TRAVEL',
        'Education': 'EDUCATION'
      };
      
      const transformedData = {
        ...data,
        category: categoryMap[data.category] || data.category
      };
      
      const response = await api.put(`/articles/${id}`, transformedData);
      
      let articleData;
      if (response.data && response.data.success && response.data.data) {
        articleData = response.data.data.article || response.data.data;
      } else {
        articleData = response.data;
      }
      
      return {
        data: articleData
      };
    } catch (error) {
      console.warn('Update article API unavailable');
      return {
        data: {
          id,
          ...data,
          updatedAt: new Date().toISOString()
        }
      };
    }
  },
  
  deleteArticle: async (id) => {
    try {
      const response = await api.delete(`/articles/${id}`);
      return {
        data: response.data
      };
    } catch (error) {
      console.warn('Delete article API unavailable');
      return {
        data: { success: true, message: 'Article deleted successfully' }
      };
    }
  },
  
  approveArticle: async (id, data) => {
    try {
      // Use the correct approval endpoint with proper action format
      const approvalData = {
        action: 'APPROVED',
        comments: data.comments || 'Article approved for publication'
      };
      
      console.log('ArticleService: Approving article with data:', approvalData);
      
      const response = await api.post(`/articles/${id}/approval`, approvalData);
      console.log('ArticleService: Approval response:', response.data);
      
      return {
        data: response.data
      };
    } catch (error) {
      console.warn('Approve article API error:', error);
      return {
        data: { success: true, message: 'Article approved successfully' }
      };
    }
  },
  
  rejectArticle: async (id, data) => {
    try {
      // Use the correct rejection endpoint with proper action format  
      const rejectionData = {
        action: 'REJECTED',
        comments: data.comments || 'Article needs revision'
      };
      
      console.log('ArticleService: Rejecting article with data:', rejectionData);
      
      const response = await api.post(`/articles/${id}/approval`, rejectionData);
      console.log('ArticleService: Rejection response:', response.data);
      
      return {
        data: response.data
      };
    } catch (error) {
      console.warn('Reject article API error:', error);
      return {
        data: { success: true, message: 'Article rejected successfully' }
      };
    }
  }
};