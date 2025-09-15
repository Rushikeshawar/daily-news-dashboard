// src/pages/ai-ml/AiMlInsights.js - For AD_MANAGER and ADMIN only
import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Eye, Share2, BarChart3 } from 'lucide-react';
import { aiMlService } from '../../services/aiMlService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

const AiMlInsights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('30d');

  useEffect(() => {
    fetchInsights();
  }, [timeframe]);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const response = await aiMlService.getInsights({ timeframe });
      setInsights(response.data);
    } catch (error) {
      console.error('Fetch insights error:', error);
      toast.error('Failed to fetch insights');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading insights..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Brain className="w-8 h-8 mr-3 text-blue-600" />
            AI/ML Insights
          </h1>
          <p className="text-gray-600">Analytics and insights for AI/ML content</p>
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
              <p className="text-sm font-medium text-gray-600">Total Articles</p>
              <p className="text-3xl font-bold text-gray-900">
                {insights?.overview?.totalArticles || 0}
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
                {insights?.overview?.totalViews?.toLocaleString() || '0'}
              </p>
            </div>
            <Eye className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Shares</p>
              <p className="text-3xl font-bold text-gray-900">
                {insights?.overview?.totalShares?.toLocaleString() || '0'}
              </p>
            </div>
            <Share2 className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Views</p>
              <p className="text-3xl font-bold text-gray-900">
                {insights?.overview?.averageViews || 0}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Top Categories</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={insights?.topCategories || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalViews" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top AI Models */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Top AI Models</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={insights?.topAiModels || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ aiModel, articleCount }) => `${aiModel}: ${articleCount}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="articleCount"
                >
                  {(insights?.topAiModels || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Trending Articles */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Trending Articles</h3>
        </div>
        <div className="space-y-4">
          {insights?.trendingArticles?.slice(0, 5).map((article, index) => (
            <div key={article.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{article.headline}</h4>
                <p className="text-sm text-gray-600">
                  {new Date(article.publishedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{article.viewCount?.toLocaleString()} views</p>
                <p className="text-sm text-gray-600">{article.shareCount?.toLocaleString()} shares</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AiMlInsights;

