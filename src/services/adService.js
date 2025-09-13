 
// src/services/adService.js
import api from './api';

export const adService = {
  getAds: (params) => api.get('/advertisements', { params }),
  getAd: (id) => api.get(`/advertisements/${id}`),
  createAd: (data) => api.post('/advertisements', data),
  updateAd: (id, data) => api.put(`/advertisements/${id}`, data),
  deleteAd: (id) => api.delete(`/advertisements/${id}`),
  getAdAnalytics: (id, params) => api.get(`/advertisements/${id}/analytics`, { params })
};

