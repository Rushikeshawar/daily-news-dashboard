// src/pages/time-saver/TimeSaverAnalytics.js - For AD_MANAGER and ADMIN only
import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, Eye, BarChart3, Zap } from 'lucide-react';
import { timeSaverService } from '../../services/timeSaverService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import toast from 'react-hot-toast';

const TimeSaverAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await timeSaverService.getAnalytics({ timeframe });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Fetch analytics error:', error);
      toast.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading analytics..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Clock className="w-8 h-8 mr-3 text-blue-600" />
            Time Saver Analytics
          </h1>
          <p className="text-gray-600">Performance metrics for time-saving content</p>
        </div>
        
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="form-select"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Content</p>
              <p className="text-3xl font-bold text-gray-900">
                {analytics?.overview?.totalContent || 0}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-3xl font-bold text-gray-900">
                {analytics?.overview?.totalViews?.toLocaleString() || '0'}
              </p>
            </div>
            <Eye className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Interactions</p>
              <p className="text-3xl font-bold text-gray-900">
                {analytics?.overview?.totalInteractions?.toLocaleString() || '0'}
              </p>
            </div>
            <Zap className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Read Time</p>
              <p className="text-3xl font-bold text-gray-900">
                {analytics?.overview?.averageReadTime || 0}s
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Content by Type Chart */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Content by Type</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics?.contentByType || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
              <Bar dataKey="views" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performing Content */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Content</h3>
        </div>
        <div className="space-y-4">
          {analytics?.topPerforming?.slice(0, 5).map((item, index) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.category}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{item.viewCount?.toLocaleString()} views</p>
                <p className="text-sm text-gray-600">
                  {item.readTimeSeconds ? `${Math.ceil(item.readTimeSeconds / 60)}m read` : 'Quick read'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeSaverAnalytics;