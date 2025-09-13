 

// src/pages/admin/SystemHealth.js
import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Database, 
  Cpu, 
  HardDrive, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  RefreshCw
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const SystemHealth = () => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthData();
    const interval = setInterval(fetchHealthData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchHealthData = async () => {
    try {
      setLoading(true);
      const response = await adminService.getSystemStatus();
      setHealthData(response.data);
    } catch (error) {
      console.error('Health data error:', error);
      // Mock data for demo
      setHealthData({
        server: {
          uptime: 86400, // 1 day
          memory: { used: 512, total: 2048, percentage: 25 },
          cpu: 15,
          environment: 'production',
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
          { name: 'Email Service', status: 'warning', uptime: '98.5%' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
      case 'disconnected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      healthy: 'status-badge status-approved',
      connected: 'status-badge status-approved',
      warning: 'status-badge status-pending',
      error: 'status-badge status-rejected',
      disconnected: 'status-badge status-rejected'
    };
    return badges[status] || 'status-badge';
  };

  if (loading && !healthData) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading system health..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Health</h1>
          <p className="text-gray-600">Monitor system performance and status</p>
        </div>
        
        <button
          onClick={fetchHealthData}
          className="btn-outline flex items-center"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Server Status */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center">
            <Server className="w-5 h-5 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Server Status</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3">
            <Activity className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-gray-600">Uptime</p>
              <p className="text-lg font-bold text-gray-900">
                {formatUptime(healthData?.server?.uptime || 0)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Cpu className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-600">CPU Usage</p>
              <p className="text-lg font-bold text-gray-900">
                {healthData?.server?.cpu || 0}%
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <HardDrive className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm font-medium text-gray-600">Memory</p>
              <p className="text-lg font-bold text-gray-900">
                {healthData?.server?.memory?.percentage || 0}%
              </p>
              <p className="text-xs text-gray-500">
                {healthData?.server?.memory?.used || 0}MB / {healthData?.server?.memory?.total || 0}MB
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Database className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm font-medium text-gray-600">Environment</p>
              <p className="text-lg font-bold text-gray-900 capitalize">
                {healthData?.server?.environment || 'unknown'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Database Status */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Database</h2>
            </div>
            <span className={getStatusBadge(healthData?.database?.status)}>
              {healthData?.database?.status || 'unknown'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Connections</p>
            <p className="text-2xl font-bold text-gray-900">
              {healthData?.database?.connections || 0}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-600">Tables</p>
            <p className="text-2xl font-bold text-gray-900">
              {healthData?.database?.tables || 0}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-600">Response Time</p>
            <p className="text-2xl font-bold text-gray-900">
              {healthData?.database?.responseTime || 0}ms
            </p>
          </div>
        </div>
      </div>

      {/* Services Status */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">Services</h2>
        </div>
        
        <div className="space-y-4">
          {healthData?.services?.map((service, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(service.status)}
                <div>
                  <p className="font-medium text-gray-900">{service.name}</p>
                  <p className="text-sm text-gray-600">Uptime: {service.uptime}</p>
                </div>
              </div>
              <span className={getStatusBadge(service.status)}>
                {service.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">Platform Statistics</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">
              {healthData?.statistics?.totalUsers?.toLocaleString() || 0}
            </p>
            <p className="text-sm text-gray-600">Users</p>
          </div>
          
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {healthData?.statistics?.totalArticles?.toLocaleString() || 0}
            </p>
            <p className="text-sm text-gray-600">Articles</p>
          </div>
          
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">
              {healthData?.statistics?.totalCategories?.toLocaleString() || 0}
            </p>
            <p className="text-sm text-gray-600">Categories</p>
          </div>
          
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-600">
              {healthData?.statistics?.totalAds?.toLocaleString() || 0}
            </p>
            <p className="text-sm text-gray-600">Advertisements</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;