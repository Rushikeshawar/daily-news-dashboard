// src/pages/time-saver/TimeSaverDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Zap, TrendingUp, BarChart3, Plus, ArrowRight } from 'lucide-react';
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

  const canCreateContent = ['EDITOR', 'AD_MANAGER'].includes(user?.role);

  const categoryGroups = timeSaverService.getCategoryGroups();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats and recent content
      const [statsResponse, contentResponse] = await Promise.all([
        timeSaverService.getStats(),
        timeSaverService.getContent({ limit: 5, sortBy: 'publishedAt', order: 'desc' })
      ]);

      setStats(statsResponse.data.stats);
      setRecentContent(contentResponse.data.content || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (groupKey) => {
    navigate(`/time-saver/category/${groupKey}`);
  };

  const handleContentClick = (contentId) => {
    timeSaverService.trackView(contentId);
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
            Time Saver
          </h1>
          <p className="text-gray-600">Quick access to bite-sized news and updates</p>
        </div>
        
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

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Stories</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.storiesCount || 0}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's New</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.todayNewCount || 0}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Breaking & Critical</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.criticalCount || 0}
                </p>
              </div>
              <Zap className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Viral Buzz</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.viralBuzzCount || 0}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>
      )}

      {/* Category Groups */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">Browse by Category</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(categoryGroups).map(([key, label]) => (
            <div
              key={key}
              onClick={() => handleCategoryClick(key)}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{label}</p>
                  <p className="text-sm text-gray-600">Quick updates</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Content */}
      {recentContent.length > 0 && (
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Updates</h2>
              <button
                onClick={() => navigate('/time-saver/content')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {recentContent.map((item, index) => (
              <div
                key={item.id}
                onClick={() => handleContentClick(item.id)}
                className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                </div>

                {item.imageUrl && (
                  <div className="flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {item.category}
                    </span>
                    {item.isPriority && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                        Priority
                      </span>
                    )}
                  </div>

                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {item.summary}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {item.readTimeSeconds ? `${Math.ceil(item.readTimeSeconds / 60)}m read` : 'Quick read'}
                    </span>
                    <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/time-saver/content')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <BarChart3 className="w-8 h-8 text-blue-500 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Browse All Content</p>
              <p className="text-sm text-gray-600">View all time-saving content</p>
            </div>
          </button>

          {canCreateContent && (
            <button
              onClick={() => navigate('/time-saver/create')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Plus className="w-8 h-8 text-green-500 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Create Content</p>
                <p className="text-sm text-gray-600">Add new time-saving content</p>
              </div>
            </button>
          )}

          {(user?.role === 'AD_MANAGER' || user?.role === 'ADMIN') && (
            <button
              onClick={() => navigate('/time-saver/analytics')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <TrendingUp className="w-8 h-8 text-purple-500 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">View Analytics</p>
                <p className="text-sm text-gray-600">Performance metrics</p>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeSaverDashboard;