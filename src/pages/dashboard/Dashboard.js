 
// src/pages/dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  Target, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { analyticsService } from '../../services/analyticsService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

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
      const response = await analyticsService.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatsCards = () => {
    if (!dashboardData) return [];

    const baseCards = [
      {
        title: 'Total Articles',
        value: dashboardData.overview?.totalArticles || 0,
        icon: FileText,
        color: 'bg-blue-500',
        link: '/articles'
      },
      {
        title: 'Total Views',
        value: dashboardData.overview?.totalViews?.toLocaleString() || '0',
        icon: Eye,
        color: 'bg-green-500',
        link: '/analytics'
      }
    ];

    // Add role-specific cards
    if (user?.role === 'ADMIN') {
      baseCards.push(
        {
          title: 'Total Users',
          value: dashboardData.overview?.totalUsers || 0,
          icon: Users,
          color: 'bg-purple-500',
          link: '/users'
        },
        {
          title: 'Total Revenue',
          value: `$${dashboardData.overview?.totalRevenue?.toLocaleString() || '0'}`,
          icon: TrendingUp,
          color: 'bg-yellow-500',
          link: '/analytics'
        }
      );
    }

    if (user?.role === 'AD_MANAGER' || user?.role === 'ADMIN') {
      baseCards.push({
        title: 'Active Ads',
        value: dashboardData.ads?.active || 0,
        icon: Target,
        color: 'bg-red-500',
        link: '/advertisements'
      });
    }

    if (user?.role === 'AD_MANAGER' || user?.role === 'ADMIN') {
      baseCards.push({
        title: 'Pending Approvals',
        value: dashboardData.articles?.pending || 0,
        icon: Clock,
        color: 'bg-orange-500',
        link: '/articles/pending'
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
        roles: ['AD_MANAGER', 'ADMIN']
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

    return actions.filter(action => action.roles.includes(user?.role));
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button onClick={fetchDashboardData} className="btn-primary">
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.fullName}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your news platform today.
        </p>
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
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className={`p-2 rounded-lg ${action.color}`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3 flex-1">
                <p className="font-medium text-gray-900">{action.title}</p>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </Link>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Chart */}
        {dashboardData?.chartData?.dailyViews && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Daily Views</h3>
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
        {dashboardData?.chartData?.categories && (
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
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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

      {/* Recent Activity */}
      {dashboardData?.topArticles && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Articles</h3>
          </div>
          <div className="space-y-4">
            {dashboardData.topArticles.slice(0, 5).map((article, index) => (
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
                    <p className="font-medium text-gray-900">{article.views.toLocaleString()}</p>
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
      {(user?.role === 'AD_MANAGER' || user?.role === 'ADMIN') && dashboardData?.articles && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-3xl font-bold text-green-600">
                  {dashboardData.articles.published || 0}
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
                  {dashboardData.articles.pending || 0}
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
                  {dashboardData.articles.rejected || 0}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;