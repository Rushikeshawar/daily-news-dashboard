 
// src/pages/admin/SystemLogs.js
import React, { useState, useEffect } from 'react';
import { AlertCircle, Info, AlertTriangle, X, RefreshCw, Download } from 'lucide-react';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import toast from 'react-hot-toast';

const SystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    level: '',
    limit: 50
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await adminService.getLogs(filters);
      setLogs(response.data.logs || []);
      // Mock pagination for demo
      setPagination({
        currentPage: 1,
        totalPages: Math.ceil(response.data.logs?.length / 50) || 1,
        totalItems: response.data.logs?.length || 0
      });
    } catch (error) {
      toast.error('Failed to fetch system logs');
      console.error('Logs error:', error);
      // Mock data for demo
      setLogs([
        {
          timestamp: new Date().toISOString(),
          level: 'info',
          message: 'User logged in successfully',
          meta: { userId: 'user123', ip: '192.168.1.1' }
        },
        {
          timestamp: new Date(Date.now() - 300000).toISOString(),
          level: 'warn',
          message: 'High memory usage detected',
          meta: { usage: '85%' }
        },
        {
          timestamp: new Date(Date.now() - 600000).toISOString(),
          level: 'error',
          message: 'Database connection timeout',
          meta: { duration: '30s' }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getLogIcon = (level) => {
    switch (level) {
      case 'error':
        return <X className="w-4 h-4 text-red-500" />;
      case 'warn':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getLogBadge = (level) => {
    const badges = {
      error: 'bg-red-100 text-red-800',
      warn: 'bg-yellow-100 text-yellow-800',
      info: 'bg-blue-100 text-blue-800',
      debug: 'bg-gray-100 text-gray-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${badges[level] || badges.debug}`;
  };

  const exportLogs = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Timestamp,Level,Message,Metadata\n"
      + logs.map(log => 
          `"${log.timestamp}","${log.level}","${log.message}","${JSON.stringify(log.meta || {})}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `system-logs-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
          <p className="text-gray-600">Monitor system activities and errors</p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={fetchLogs}
            className="btn-outline flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={exportLogs}
            className="btn-primary flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <select
            value={filters.level}
            onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
            className="form-select"
          >
            <option value="">All Levels</option>
            <option value="error">Error</option>
            <option value="warn">Warning</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </select>
          
          <select
            value={filters.limit}
            onChange={(e) => setFilters(prev => ({ ...prev, limit: parseInt(e.target.value) }))}
            className="form-select"
          >
            <option value={50}>50 logs</option>
            <option value={100}>100 logs</option>
            <option value={200}>200 logs</option>
            <option value={500}>500 logs</option>
          </select>
        </div>
      </div>

      {/* Logs */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading logs..." />
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Logs Found</h2>
          <p className="text-gray-600">No system logs match the current filters.</p>
        </div>
      ) : (
        <div className="card">
          <div className="space-y-3">
            {logs.map((log, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  {getLogIcon(log.level)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={getLogBadge(log.level)}>
                      {log.level.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <p className="text-gray-900 mb-1">{log.message}</p>
                  
                  {log.meta && Object.keys(log.meta).length > 0 && (
                    <div className="text-xs text-gray-600 bg-white p-2 rounded border">
                      <pre>{JSON.stringify(log.meta, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={filters.limit}
              onPageChange={(page) => setPagination(prev => ({ ...prev, currentPage: page }))}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemLogs;
