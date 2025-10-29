// src/pages/dashboard/Dashboard.js - REAL DATA ONLY
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Users, Target, TrendingUp, Clock, CheckCircle, 
  XCircle, Eye, Plus, ArrowRight, RefreshCw, IndianRupee
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { analyticsService } from '../../services/analyticsService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await analyticsService.getDashboard();
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      setDashboardData(response.data);
      
    } catch (error) {
      console.error('Dashboard error:', error);
      setError(error.response?.data?.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatsCards = () => {
    if (!dashboardData?.overview) return [];

    const baseCards = [
      {
        title: 'Total Articles',
        value: dashboardData.overview.totalArticles?.toLocaleString() || '0',
        icon: FileText,
        color: 'bg-blue-500',
        link: '/articles'
      },
      {
        title: 'Total Views',
        value: dashboardData.overview.totalViews?.toLocaleString() || '0',
        icon: Eye,
        color: 'bg-green-500',
        link: '/analytics'
      },
      {
        title: 'Total Shares',
        value: dashboardData.overview.totalShares?.toLocaleString() || '0',
        icon: TrendingUp,
        color: 'bg-purple-500',
        link: '/analytics'
      }
    ];

    if (user?.role === 'ADMIN') {
      baseCards.push(
        {
          title: 'Total Users',
          value: dashboardData.overview.totalUsers?.toLocaleString() || '0',
          icon: Users,
          color: 'bg-indigo-500',
          link: '/users'
        },
        {
          title: 'Revenue',
          value: `₹${dashboardData.overview.totalRevenue?.toLocaleString() || '0'}`,
          icon: IndianRupee,
          color: 'bg-yellow-500',
          link: '/analytics'
        }
      );
    }

    if (user?.role === 'AD_MANAGER' || user?.role === 'ADMIN') {
      baseCards.push({
        title: 'Active Ads',
        value: dashboardData.ads?.active?.toLocaleString() || '0',
        icon: Target,
        color: 'bg-red-500',
        link: '/advertisements'
      });
    }

    return baseCards;
  };

  const getQuickActions = () => {
    const actions = [
      {
        title: 'Create Article',
        description: 'Write a new article',
        icon: Plus,
        link: '/articles/create',
        color: 'bg-blue-500',
        roles: ['EDITOR', 'AD_MANAGER', 'ADMIN']
      },
      {
        title: 'Review Articles',
        description: 'Review pending articles',
        icon: CheckCircle,
        link: '/articles/pending',
        color: 'bg-green-500',
        roles: ['AD_MANAGER', 'ADMIN'],
        badge: dashboardData?.articles?.pending || null
      },
      {
        title: 'Create Advertisement',
        description: 'Create new ad campaign',
        icon: Target,
        link: '/advertisements/create',
        color: 'bg-red-500',
        roles: ['AD_MANAGER', 'ADMIN']
      },
      {
        title: 'View Analytics',
        description: 'Check performance metrics',
        icon: TrendingUp,
        link: '/analytics',
        color: 'bg-purple-500',
        roles: ['AD_MANAGER', 'ADMIN']
      },
      {
        title: 'Manage Users',
        description: 'User management',
        icon: Users,
        link: '/users',
        color: 'bg-yellow-500',
        roles: ['ADMIN']
      }
    ];

    return actions.filter(action => action.roles.includes(user?.role || ''));
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <XCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Dashboard</h2>
        <p className="text-gray-600 mb-4">{error || 'No data available'}</p>
        <button onClick={fetchDashboardData} className="btn-primary">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  const statsCards = getStatsCards();
  const quickActions = getQuickActions();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your news platform today.
          </p>
        </div>
        
        <button
          onClick={fetchDashboardData}
          className="btn-outline flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className="card hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 relative"
            >
              <div className={`p-2 rounded-lg ${action.color}`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3 flex-1">
                <p className="font-medium text-gray-900">{action.title}</p>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
              {action.badge && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {action.badge > 9 ? '9+' : action.badge}
                </span>
              )}
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </Link>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      {dashboardData.chartData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Views Chart */}
          {dashboardData.chartData.dailyViews && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Daily Views (Last 7 Days)</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardData.chartData.dailyViews.map((views, index) => ({
                    day: `Day ${index + 1}`,
                    views
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Categories Chart */}
          {dashboardData.chartData.categories && Object.keys(dashboardData.chartData.categories).length > 0 && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Articles by Category</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(dashboardData.chartData.categories).map(([name, value]) => ({
                        name,
                        value
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.entries(dashboardData.chartData.categories).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Top Articles */}
      {dashboardData.topArticles && dashboardData.topArticles.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Articles</h3>
          </div>
          <div className="space-y-4">
            {dashboardData.topArticles.map((article, index) => (
              <div key={article.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <Link
                    to={`/articles/${article.id}`}
                    className="font-medium text-gray-900 hover:text-blue-600"
                  >
                    {article.headline}
                  </Link>
                  <p className="text-sm text-gray-600">by {article.author}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{article.views?.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">views</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Article Status Summary */}
      {(user?.role === 'AD_MANAGER' || user?.role === 'ADMIN') && dashboardData.articles && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-3xl font-bold text-green-600">
                  {dashboardData.articles.published?.toLocaleString() || '0'}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {dashboardData.articles.pending?.toLocaleString() || '0'}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-red-600">
                  {dashboardData.articles.rejected?.toLocaleString() || '0'}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Draft</p>
                <p className="text-3xl font-bold text-gray-600">
                  {dashboardData.articles.draft?.toLocaleString() || '0'}
                </p>
              </div>
              <FileText className="w-8 h-8 text-gray-500" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;