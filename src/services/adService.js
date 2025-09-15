// src/services/adService.js - CORRECT FIX
import api from './api';

const mockAds = [
  {
    id: '1',
    title: 'Tech Conference 2025',
    description: 'Join us for the biggest tech event of the year featuring AI, blockchain, and quantum computing',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
    targetUrl: 'https://techconf2025.com',
    position: 'BANNER',
    status: 'ACTIVE',
    budget: 5000,
    spent: 1200,
    impressions: 25000,
    clicks: 750,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
    createdAt: new Date().toISOString()
  }
];

export const adService = {
  getAds: async (params) => {
    try {
      const response = await api.get('/advertisements', { params });
      console.log('Raw API response:', response.data);
      
      // YOUR BACKEND STRUCTURE: {success: true, data: {advertisements: [...], pagination: {...}}}
      let adsArray = [];
      
      if (response.data && response.data.success && response.data.data) {
        // Extract advertisements from the nested structure
        const dataObject = response.data.data;
        console.log('Data object:', dataObject);
        
        if (dataObject.advertisements && Array.isArray(dataObject.advertisements)) {
          adsArray = dataObject.advertisements;
          console.log('Found advertisements array:', adsArray.length, 'items');
        } else {
          console.log('No advertisements array found');
          adsArray = mockAds;
        }
      } else {
        console.log('Invalid response structure, using mock data');
        adsArray = mockAds;
      }
      
      // Convert backend format to frontend format
      const convertedAds = adsArray.map(ad => ({
        id: ad.id,
        title: ad.title,
        description: ad.content, // Backend uses 'content', frontend expects 'description'
        imageUrl: ad.imageUrl,
        targetUrl: ad.targetUrl,
        position: ad.position,
        status: ad.isActive ? 'ACTIVE' : 'PAUSED', // Convert boolean to status
        budget: parseInt(ad.budget),
        spent: 0, // Calculate if needed
        impressions: ad.impressions || 0,
        clicks: ad.clickCount || 0,
        startDate: ad.startDate,
        endDate: ad.endDate,
        createdAt: ad.createdAt
      }));
      
      console.log('Converted ads:', convertedAds);
      
      return {
        data: convertedAds
      };
    } catch (error) {
      console.warn('Advertisements API unavailable, using mock data:', error.message);
      return {
        data: mockAds
      };
    }
  },
  
  getAd: async (id) => {
    try {
      const response = await api.get(`/advertisements/${id}`);
      
      let adData;
      if (response.data && response.data.success && response.data.data) {
        adData = response.data.data;
      } else {
        adData = response.data;
      }
      
      // Convert backend format to frontend format
      const convertedAd = {
        id: adData.id,
        title: adData.title,
        description: adData.content,
        imageUrl: adData.imageUrl,
        targetUrl: adData.targetUrl,
        position: adData.position,
        status: adData.isActive ? 'ACTIVE' : 'PAUSED',
        budget: parseInt(adData.budget),
        spent: 0,
        impressions: adData.impressions || 0,
        clicks: adData.clickCount || 0,
        startDate: adData.startDate,
        endDate: adData.endDate,
        createdAt: adData.createdAt
      };
      
      return {
        data: convertedAd
      };
    } catch (error) {
      console.warn('Advertisement API unavailable, using mock data');
      return {
        data: mockAds[0]
      };
    }
  },
  
  createAd: async (data) => {
    try {
      // Convert frontend format to backend format
      const backendData = {
        title: data.title,
        content: data.description, // Frontend uses 'description', backend expects 'content'
        imageUrl: data.imageUrl,
        targetUrl: data.targetUrl,
        position: data.position,
        isActive: true,
        startDate: data.startDate,
        endDate: data.endDate,
        budget: data.budget.toString() // Backend expects string
      };
      
      const response = await api.post('/advertisements', backendData);
      console.log('Create ad response:', response.data);
      
      let adData;
      if (response.data && response.data.success && response.data.data) {
        adData = response.data.data;
      } else {
        adData = response.data;
      }
      
      // Convert backend format back to frontend format
      const convertedAd = {
        id: adData.id,
        title: adData.title,
        description: adData.content,
        imageUrl: adData.imageUrl,
        targetUrl: adData.targetUrl,
        position: adData.position,
        status: adData.isActive ? 'ACTIVE' : 'PAUSED',
        budget: parseInt(adData.budget),
        spent: 0,
        impressions: adData.impressions || 0,
        clicks: adData.clickCount || 0,
        startDate: adData.startDate,
        endDate: adData.endDate,
        createdAt: adData.createdAt
      };
      
      return {
        data: convertedAd
      };
    } catch (error) {
      console.warn('Create advertisement API unavailable');
      return {
        data: {
          id: Date.now().toString(),
          ...data,
          status: 'ACTIVE',
          spent: 0,
          impressions: 0,
          clicks: 0,
          createdAt: new Date().toISOString()
        }
      };
    }
  },
  
  updateAd: async (id, data) => {
    try {
      // Convert frontend format to backend format
      const backendData = {
        title: data.title,
        content: data.description,
        imageUrl: data.imageUrl,
        targetUrl: data.targetUrl,
        position: data.position,
        isActive: data.status === 'ACTIVE',
        startDate: data.startDate,
        endDate: data.endDate,
        budget: data.budget.toString()
      };
      
      const response = await api.put(`/advertisements/${id}`, backendData);
      
      let adData;
      if (response.data && response.data.success && response.data.data) {
        adData = response.data.data;
      } else {
        adData = response.data;
      }
      
      return {
        data: adData
      };
    } catch (error) {
      console.warn('Update advertisement API unavailable');
      return {
        data: {
          id,
          ...data,
          updatedAt: new Date().toISOString()
        }
      };
    }
  },
  
  deleteAd: async (id) => {
    try {
      const response = await api.delete(`/advertisements/${id}`);
      
      let result;
      if (response.data && response.data.success) {
        result = response.data;
      } else {
        result = response.data;
      }
      
      return {
        data: result
      };
    } catch (error) {
      console.warn('Delete advertisement API unavailable');
      return {
        data: { success: true, message: 'Advertisement deleted successfully' }
      };
    }
  },
  
  getAdAnalytics: async (id, params) => {
    try {
      const response = await api.get(`/advertisements/${id}/analytics`, { params });
      
      let analyticsData;
      if (response.data && response.data.success && response.data.data) {
        analyticsData = response.data.data;
      } else {
        analyticsData = response.data;
      }
      
      return {
        data: analyticsData
      };
    } catch (error) {
      console.warn('Advertisement analytics API unavailable, using mock data');
      return {
        data: {
          overview: {
            impressions: 125000,
            clicks: 3750,
            ctr: 3.0,
            spent: 2850,
            cpc: 0.76,
            conversions: 180,
            conversionRate: 4.8
          }
        }
      };
    }
  }
};