 
// src/services/adminService.js
import api from './api';

export const adminService = {
  getSystemStatus: () => api.get('/admin/system'),
  getLogs: (params) => api.get('/admin/logs', { params }),
  createBackup: () => api.post('/admin/backup'),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.put('/admin/settings', data)
};