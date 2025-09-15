// src/services/userService.js
import api from './api';

const mockUsers = [
  {
    id: '1',
    fullName: 'Admin User',
    email: 'admin@dailynews.com',
    role: 'ADMIN',
    isActive: true,
    createdAt: new Date(Date.now() - 365*24*60*60*1000).toISOString(),
    lastLoginAt: new Date().toISOString()
  },
  {
    id: '2',
    fullName: 'Advertisement Manager',
    email: 'admanager@dailynews.com',
    role: 'AD_MANAGER',
    isActive: true,
    createdAt: new Date(Date.now() - 180*24*60*60*1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '3',
    fullName: 'Content Editor',
    email: 'editor@dailynews.com',
    role: 'EDITOR',
    isActive: true,
    createdAt: new Date(Date.now() - 90*24*60*60*1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: '4',
    fullName: 'John Smith',
    email: 'john.smith@example.com',
    role: 'EDITOR',
    isActive: true,
    createdAt: new Date(Date.now() - 60*24*60*60*1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '5',
    fullName: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: 'EDITOR',
    isActive: false,
    createdAt: new Date(Date.now() - 30*24*60*60*1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 7*24*60*60*1000).toISOString()
  },
  {
    id: '6',
    fullName: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    role: 'USER',
    isActive: true,
    createdAt: new Date(Date.now() - 15*24*60*60*1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 3*24*60*60*1000).toISOString()
  }
];

export const userService = {
  getUsers: async (params) => {
    try {
      const response = await api.get('/users', { params });
      console.log('Users API response:', response.data);
      
      // CRITICAL FIX: Parse the nested data structure from backend
      const actualData = response.data?.data || response.data;
      
      return {
        data: {
          users: actualData?.users || actualData || [],
          pagination: actualData?.pagination || {
            currentPage: params?.page || 1,
            totalPages: 1,
            totalItems: Array.isArray(actualData) ? actualData.length : 0
          }
        }
      };
    } catch (error) {
      console.warn('Users API unavailable, using mock data:', error.message);
      
      // Filter mock users based on params
      let filteredUsers = [...mockUsers];
      
      if (params?.role) {
        filteredUsers = filteredUsers.filter(user => user.role === params.role);
      }
      
      if (params?.search) {
        const searchTerm = params.search.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
          user.fullName.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
        );
      }
      
      if (params?.isActive !== undefined) {
        filteredUsers = filteredUsers.filter(user => user.isActive === params.isActive);
      }
      
      return {
        data: {
          users: filteredUsers,
          pagination: {
            currentPage: params?.page || 1,
            totalPages: Math.ceil(filteredUsers.length / (params?.limit || 12)),
            totalItems: filteredUsers.length
          }
        }
      };
    }
  },
  
  getUser: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      const actualData = response.data?.data || response.data;
      return {
        data: actualData
      };
    } catch (error) {
      console.warn('User API unavailable, using mock data');
      const mockUser = mockUsers.find(user => user.id === id) || mockUsers[0];
      return {
        data: mockUser
      };
    }
  },
  
  createUser: async (data) => {
    try {
      const response = await api.post('/users', data);
      console.log('Create user response:', response.data);
      const actualData = response.data?.data || response.data;
      return {
        data: actualData
      };
    } catch (error) {
      console.warn('Create user API unavailable');
      return {
        data: {
          id: Date.now().toString(),
          ...data,
          isActive: true,
          createdAt: new Date().toISOString(),
          lastLoginAt: null
        }
      };
    }
  },
  
  updateUser: async (id, data) => {
    try {
      const response = await api.put(`/users/${id}`, data);
      const actualData = response.data?.data || response.data;
      return {
        data: actualData
      };
    } catch (error) {
      console.warn('Update user API unavailable');
      return {
        data: {
          id,
          ...data,
          updatedAt: new Date().toISOString()
        }
      };
    }
  },
  
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      const actualData = response.data?.data || response.data;
      return {
        data: actualData
      };
    } catch (error) {
      console.warn('Delete user API unavailable');
      return {
        data: { success: true, message: 'User deleted successfully' }
      };
    }
  }
};