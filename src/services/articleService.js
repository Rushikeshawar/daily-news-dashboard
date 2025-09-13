 
// src/services/articleService.js
import api from './api';

export const articleService = {
  getArticles: (params) => api.get('/articles', { params }),
  getArticle: (id) => api.get(`/articles/${id}`),
  createArticle: (data) => api.post('/articles', data),
  updateArticle: (id, data) => api.put(`/articles/${id}`, data),
  deleteArticle: (id) => api.delete(`/articles/${id}`),
  approveArticle: (id, data) => api.post(`/articles/${id}/approve`, data),
  rejectArticle: (id, data) => api.post(`/articles/${id}/reject`, data),
  getPendingArticles: (params) => api.get('/articles', { 
    params: { ...params, status: 'PENDING' } 
  })
};

