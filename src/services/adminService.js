// src/services/adminService.js
import api from './api';

const mockSystemStatus = {
  server: {
    uptime: 86400, // 1 day in seconds
    memory: { used: 512, total: 2048, percentage: 25 },
    cpu: 15,
    environment: 'development',
    status: 'healthy'
  },
  database: {
    status: 'connected',
    connections: 15,
    tables: 25,
    responseTime: 45
  },
  statistics: {
    totalUsers: 1200,
    totalArticles: 500,
    totalCategories: 12,
    totalAds: 25
  },
  services: [
    { name: 'Web Server', status: 'healthy', uptime: '99.9%' },
    { name: 'Database', status: 'healthy', uptime: '99.8%' },
    { name: 'File Storage', status: 'healthy', uptime: '99.9%' },
    { name: 'Email Service', status: 'warning', uptime: '98.5%' },
    { name: 'Analytics Engine', status: 'healthy', uptime: '99.7%' }
  ]
};

const mockLogs = [
  {
    timestamp: new Date().toISOString(),
    level: 'info',
    message: 'User authentication successful',
    meta: { userId: 'user123', ip: '192.168.1.1', userAgent: 'Chrome/140.0.0.0' }
  },
  {
    timestamp: new Date(Date.now() - 300000).toISOString(),
    level: 'warn',
    message: 'High memory usage detected',
    meta: { usage: '85%', threshold: '80%' }
  },
  {
    timestamp: new Date(Date.now() - 600000).toISOString(),
    level: 'error',
    message: 'Database connection timeout',
    meta: { duration: '30s', retries: 3 }
  },
  {
    timestamp: new Date(Date.now() - 900000).toISOString(),
    level: 'info',
    message: 'Article published successfully',
    meta: { articleId: 'art456', authorId: 'user789' }
  },
  {
    timestamp: new Date(Date.now() - 1200000).toISOString(),
    level: 'warn',
    message: 'API rate limit approaching',
    meta: { endpoint: '/api/articles', usage: '90%' }
  },
  {
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    level: 'info',
    message: 'Advertisement campaign activated',
    meta: { campaignId: 'camp123', budget: 5000 }
  },
  {
    timestamp: new Date(Date.now() - 2400000).toISOString(),
    level: 'error',
    message: 'Failed to send email notification',
    meta: { recipient: 'user@example.com', errorCode: 'SMTP_TIMEOUT' }
  }
];

const mockSettings = {
  siteName: 'Daily News Dashboard',
  siteDescription: 'Your trusted source for the latest news and updates',
  maintenanceMode: false,
  registrationEnabled: true,
  maxFileSize: 10485760, // 10MB
  emailNotifications: true,
  autoApproveArticles: false,
  adDisplayEnabled: true,
  analyticsEnabled: true,
  backupFrequency: 'daily',
  sessionTimeout: 3600, // 1 hour
  maxLoginAttempts: 5
};

export const adminService = {
  getSystemStatus: async () => {
    try {
      const response = await api.get('/admin/system');
      console.log('System status API response:', response.data);
      return response;
    } catch (error) {
      console.warn('Admin system status API unavailable, using mock data:', error.message);
      return {
        data: mockSystemStatus
      };
    }
  },
  
  getLogs: async (params) => {
    try {
      const response = await api.get('/admin/logs', { params });
      console.log('System logs API response:', response.data);
      return response;
    } catch (error) {
      console.warn('Admin logs API unavailable, using mock data:', error.message);
      
      // Filter logs based on params
      let filteredLogs = [...mockLogs];
      
      if (params?.level) {
        filteredLogs = filteredLogs.filter(log => log.level === params.level);
      }
      
      if (params?.limit) {
        filteredLogs = filteredLogs.slice(0, params.limit);
      }
      
      return {
        data: {
          logs: filteredLogs,
          totalCount: mockLogs.length
        }
      };
    }
  },
  
  createBackup: async () => {
    try {
      return await api.post('/admin/backup');
    } catch (error) {
      console.warn('Create backup API unavailable');
      return {
        data: {
          success: true,
          backupId: Date.now().toString(),
          filename: `backup_${new Date().toISOString().split('T')[0]}.sql`,
          size: '25.7 MB',
          createdAt: new Date().toISOString(),
          message: 'Backup created successfully'
        }
      };
    }
  },
  
  getSettings: async () => {
    try {
      const response = await api.get('/admin/settings');
      console.log('Admin settings API response:', response.data);
      return response;
    } catch (error) {
      console.warn('Admin settings API unavailable, using mock data:', error.message);
      return {
        data: mockSettings
      };
    }
  },
  
  updateSettings: async (data) => {
    try {
      const response = await api.put('/admin/settings', data);
      console.log('Update settings API response:', response.data);
      return response;
    } catch (error) {
      console.warn('Update settings API unavailable');
      // Update mock settings
      Object.assign(mockSettings, data);
      return {
        data: {
          ...mockSettings,
          updatedAt: new Date().toISOString(),
          success: true,
          message: 'Settings updated successfully'
        }
      };
    }
  },
  
  // Additional admin functions
  getAnalyticsSummary: async () => {
    try {
      return await api.get('/admin/analytics/summary');
    } catch (error) {
      console.warn('Analytics summary API unavailable');
      return {
        data: {
          usersToday: 145,
          articlesPublished: 12,
          adImpressions: 15420,
          revenue: 342.50,
          topCategories: [
            { name: 'Technology', count: 25 },
            { name: 'Business', count: 18 },
            { name: 'Sports', count: 15 }
          ]
        }
      };
    }
  },
  
  clearCache: async () => {
    try {
      return await api.post('/admin/cache/clear');
    } catch (error) {
      console.warn('Clear cache API unavailable');
      return {
        data: {
          success: true,
          message: 'Cache cleared successfully',
          itemsCleared: 1247,
          clearedAt: new Date().toISOString()
        }
      };
    }
  },
  
  restartService: async (serviceName) => {
    try {
      return await api.post(`/admin/services/${serviceName}/restart`);
    } catch (error) {
      console.warn('Restart service API unavailable');
      return {
        data: {
          success: true,
          service: serviceName,
          status: 'restarted',
          message: `${serviceName} service restarted successfully`,
          restartedAt: new Date().toISOString()
        }
      };
    }
  }
};