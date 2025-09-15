// src/pages/time-saver/TimeSaverDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, TrendingUp, Zap, Calendar, Plus, RefreshCw } from 'lucide-react';
import { timeSaverService } from '../../services/timeSaverService';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const TimeSaverDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentContent, setRecentContent] = useState([]);
  const [loading, setLoading] = useState(true);

  const canCreateContent = user?.role === 'ADMIN';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, contentResponse] = await Promise.all([
        timeSaverService.getStats(),
        timeSaverService.getContent({ limit: 6, sortBy: 'publishedAt', order: 'desc' })
      ]);
      
      setStats(statsResponse.data.stats);
      setRecentContent(contentResponse.data.content || []);
    } catch (error) {
      console.error('Fetch dashboard data error:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const categoryCards = [
    {
      title: "Today's New",
      description: "Fresh content from today",
      count: stats?.todayNewCount || 0,
      maxCount: 5,
      icon: Calendar,
      color: 'bg-blue-500',
      route: '/time-saver/category/today_new'
    },
    {
      title: "Breaking & Critical",
      description: "Urgent updates requiring attention",
      count: stats?.criticalCount || 0,
      maxCount: 7,
      icon: Zap,
      color: 'bg-red-500',
      route: '/time-saver/category/breaking_critical'
    },
    {
      title: "Weekly Highlights",
      description: "Important stories from this week",
      count: stats?.weeklyCount || 0,
      maxCount: 15,
      icon: TrendingUp,
      color: 'bg-green-500',
      route: '/time-saver/category/weekly_highlights'
    },
    {
      title: "Monthly Top",
      description: "Top content from this month",
      count: stats?.monthlyCount || 0,
      maxCount: 30,
      icon: Calendar,
      color: 'bg-purple-500',
      route: '/time-saver/category/monthly_top'
    },
    {
      title: "Viral Buzz",
      description: "Trending and viral content",
      count: stats?.viralBuzzCount || 0,
      maxCount: 10,
      icon: TrendingUp,
      color: 'bg-orange-500',
      route: '/time-saver/category/viral_buzz'
    },
    {
      title: "Changing Norms",
      description: "Societal shifts and cultural changes",
      count: stats?.changingNormsCount || 0,
      maxCount: 10,
      icon: RefreshCw,
      color: 'bg-indigo-500',
      route: '/time-saver/category/changing_norms'
    }
  ];

  const getProgressPercentage = (current, max) => {
    return Math.min((current / max) * 100, 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading Time Saver dashboard..." />
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
            Time Saver Dashboard
          </h1>
          <p className="text-gray-600">Quick access to time-saving content and updates</p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/time-saver/content')}
            className="btn-outline"
          >
            View All Content
          </button>
          {canCreateContent && (
            <button
              onClick={() => navigate('/time-saver/create')}
              className="btn-primary flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Content
            </button>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stories Today</p>
              <p className="text-3xl font-bold text-blue-600">{stats?.storiesCount || 0}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Quick Updates</p>
              <p className="text-3xl font-bold text-green-600">{stats?.updatesCount || 0}</p>
            </div>
            <Zap className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Breaking News</p>
              <p className="text-3xl font-bold text-red-600">{stats?.breakingCount || 0}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Last Updated</p>
              <p className="text-sm font-bold text-gray-900">
                {stats?.lastUpdated ? new Date(stats.lastUpdated).toLocaleTimeString() : 'N/A'}
              </p>
            </div>
            <RefreshCw className="w-8 h-8 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Category Cards */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Content Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryCards.map((category, index) => (
            <div
              key={index}
              onClick={() => navigate(category.route)}
              className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${category.color}`}>
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  {category.count}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {category.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4">
                {category.description}
              </p>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Content Available</span>
                  <span>{category.count}/{category.maxCount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${category.color.replace('bg-', 'bg-opacity-75 bg-')}`}
                    style={{ width: `${getProgressPercentage(category.count, category.maxCount)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Content */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Recent Content</h2>
          <button
            onClick={() => navigate('/time-saver/content')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All →
          </button>
        </div>
        
        {recentContent.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No recent content available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentContent.map((item) => (
              <div
                key={item.id}
                className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                onClick={() => {
                  timeSaverService.trackView(item.id);
                  // You can add navigation to detail page here if needed
                }}
              >
                {item.imageUrl && (
                  <div className="mb-4">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {item.category}
                  </span>
                  {item.isPriority && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                      Priority
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {item.summary}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{item.readTimeSeconds ? `${Math.ceil(item.readTimeSeconds / 60)}m read` : 'Quick read'}</span>
                  <span>{item.viewCount?.toLocaleString() || 0} views</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeSaverDashboard;

