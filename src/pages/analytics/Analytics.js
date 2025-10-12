// src/pages/analytics/Analytics.js - REAL DATA ONLY
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Users, FileText, DollarSign, Eye,
  Share2, Clock, XCircle
} from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [overview, setOverview] = useState(null);
  const [contentAnalytics, setContentAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching analytics with timeframe:', dateRange);

      const [overviewRes, contentRes] = await Promise.all([
        analyticsService.getOverview({ timeframe: dateRange }),
        analyticsService.getContentAnalytics({ timeframe: dateRange })
      ]);

      console.log('Overview response:', overviewRes);
      console.log('Content response:', contentRes);

      if (!overviewRes.data?.data?.overview) {
        throw new Error('Invalid data format received from overview API');
      }

      setOverview(overviewRes.data.data.overview);
      setContentAnalytics(contentRes.data?.data?.analytics);
      
      toast.success('Analytics loaded successfully');
      
    } catch (error) {
      console.error('Analytics error:', error);
      console.error('Error details:', error.response);
      setError(error.response?.data?.message || error.message || 'Failed to fetch analytics data');
      toast.error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading analytics..." />
      </div>
    );
  }

  if (error || !overview) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <XCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Analytics</h2>
        <p className="text-gray-600 mb-4">{error || 'No data available'}</p>
        <button onClick={fetchAnalytics} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your platform performance</p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
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
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">
                {overview.users?.total?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-green-600 mt-1">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                +{overview.users?.growth || 0}% growth
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Articles</p>
              <p className="text-3xl font-bold text-gray-900">
                {overview.content?.totalArticles?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-green-600 mt-1">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                +{overview.content?.growth || 0}% growth
              </p>
            </div>
            <FileText className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-3xl font-bold text-gray-900">
                {overview.engagement?.totalViews?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Avg: {overview.engagement?.averageViewsPerArticle || 0} per article
              </p>
            </div>
            <Eye className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ad Revenue</p>
              <p className="text-3xl font-bold text-gray-900">
                ₹{overview.advertising?.revenue?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                CTR: {overview.advertising?.clickThroughRate || 0}%
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {overview.users?.active?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {overview.users?.new?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Searches</p>
              <p className="text-2xl font-bold text-gray-900">
                {overview.engagement?.totalSearches?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published Articles</p>
              <p className="text-2xl font-bold text-gray-900">
                {overview.content?.publishedArticles?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Shares</p>
              <p className="text-2xl font-bold text-gray-900">
                {overview.engagement?.totalShares?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Share2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New Articles</p>
              <p className="text-2xl font-bold text-gray-900">
                {overview.content?.newArticles?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Advertising Stats */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Advertising Performance</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Ads</p>
            <p className="text-2xl font-bold text-gray-900">
              {overview.advertising?.activeAds?.toLocaleString() || '0'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Impressions</p>
            <p className="text-2xl font-bold text-gray-900">
              {overview.advertising?.totalImpressions?.toLocaleString() || '0'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Clicks</p>
            <p className="text-2xl font-bold text-gray-900">
              {overview.advertising?.totalClicks?.toLocaleString() || '0'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Revenue</p>
            <p className="text-2xl font-bold text-green-600">
              ₹{overview.advertising?.revenue?.toLocaleString() || '0'}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              CTR: {overview.advertising?.clickThroughRate?.toFixed(2) || '0.00'}%
            </p>
          </div>
        </div>
      </div>

      {/* Content Analytics Charts */}
      {contentAnalytics && (
        <>
          {/* Top Articles */}
          {contentAnalytics.topArticles && contentAnalytics.topArticles.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Top Performing Articles</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Headline</th>
                      <th>Author</th>
                      <th>Category</th>
                      <th>Views</th>
                      <th>Shares</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contentAnalytics.topArticles.map((article) => (
                      <tr key={article.id}>
                        <td className="font-medium">{article.headline}</td>
                        <td>{article.author?.fullName || 'Unknown'}</td>
                        <td>
                          <span className="badge badge-blue">{article.category}</span>
                        </td>
                        <td>{article.viewCount?.toLocaleString() || 0}</td>
                        <td>{article.shareCount?.toLocaleString() || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Category Performance */}
          {contentAnalytics.categoryPerformance && contentAnalytics.categoryPerformance.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">Category Distribution</h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={contentAnalytics.categoryPerformance}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, articleCount }) => `${category}: ${articleCount}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="articleCount"
                      >
                        {contentAnalytics.categoryPerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">Views by Category</h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={contentAnalytics.categoryPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="totalViews" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Content Trends */}
          {contentAnalytics.contentTrends && contentAnalytics.contentTrends.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Content Publishing Trends</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={contentAnalytics.contentTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="articles_published" 
                      stackId="1"
                      stroke="#3B82F6" 
                      fill="#3B82F6" 
                      name="Articles"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="total_views" 
                      stackId="2"
                      stroke="#10B981" 
                      fill="#10B981" 
                      name="Views"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Top Authors */}
          {contentAnalytics.topAuthors && contentAnalytics.topAuthors.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Top Authors</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Author</th>
                      <th>Articles</th>
                      <th>Total Views</th>
                      <th>Total Shares</th>
                      <th>Avg Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contentAnalytics.topAuthors.map((author, index) => (
                      <tr key={index}>
                        <td className="font-medium">
                          {author.author?.fullName || 'Unknown'}
                        </td>
                        <td>{author.articleCount}</td>
                        <td>{author.totalViews?.toLocaleString()}</td>
                        <td>{author.totalShares?.toLocaleString()}</td>
                        <td>{author.averageViews?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Category Performance Table */}
      {contentAnalytics?.categoryPerformance && contentAnalytics.categoryPerformance.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Detailed Category Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Articles</th>
                  <th>Total Views</th>
                  <th>Total Shares</th>
                  <th>Avg Views</th>
                </tr>
              </thead>
              <tbody>
                {contentAnalytics.categoryPerformance.map((category, index) => (
                  <tr key={index}>
                    <td className="font-medium">
                      <span className="badge badge-blue">{category.category}</span>
                    </td>
                    <td>{category.articleCount}</td>
                    <td>{category.totalViews?.toLocaleString()}</td>
                    <td>{category.totalShares?.toLocaleString()}</td>
                    <td>{category.averageViews?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;