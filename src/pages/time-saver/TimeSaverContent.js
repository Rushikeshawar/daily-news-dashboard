// src/pages/time-saver/TimeSaverContent.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Clock, Zap } from 'lucide-react';
import { timeSaverService } from '../../services/timeSaverService';
import { useAuth } from '../../context/AuthContext';
import SearchBox from '../../components/common/SearchBox';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const TimeSaverContent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false
  });
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    contentGroup: '',
    sortBy: 'publishedAt',
    order: 'desc'
  });

  const canCreateContent = user?.role === 'ADMIN';

  const categoryGroups = timeSaverService.getCategoryGroups();

  useEffect(() => {
    fetchContent();
  }, [filters, pagination.page]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };
      
      const response = await timeSaverService.getContent(params);
      setContent(response.data.content || []);
      setPagination(prev => ({
        ...prev,
        ...response.data.pagination
      }));
    } catch (error) {
      console.error('Fetch Time Saver content error:', error);
      toast.error('Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setFilters(prev => ({ ...prev, search: query }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleContentClick = (contentId) => {
    timeSaverService.trackView(contentId);
    // You can add navigation to detail page here if needed
  };

  const getContentTypeColor = (type) => {
    const colors = {
      'DIGEST': 'bg-blue-100 text-blue-800',
      'QUICK_UPDATE': 'bg-green-100 text-green-800',
      'HIGHLIGHTS': 'bg-purple-100 text-purple-800',
      'VIRAL': 'bg-orange-100 text-orange-800',
      'SOCIAL': 'bg-indigo-100 text-indigo-800',
      'BREAKING': 'bg-red-100 text-red-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatReadTime = (seconds) => {
    if (!seconds) return 'Quick read';
    const minutes = Math.ceil(seconds / 60);
    return `${minutes}m read`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Clock className="w-8 h-8 mr-3 text-blue-600" />
            Time Saver Content
          </h1>
          <p className="text-gray-600">Browse all time-saving content and quick updates</p>
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

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <SearchBox
              placeholder="Search content..."
              onSearch={handleSearch}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="form-select"
            >
              <option value="">All Categories</option>
              <option value="TECHNOLOGY">Technology</option>
              <option value="BUSINESS">Business</option>
              <option value="SOCIETY">Society</option>
              <option value="ENTERTAINMENT">Entertainment</option>
              <option value="GENERAL">General</option>
            </select>

            <select
              value={filters.contentGroup}
              onChange={(e) => handleFilterChange('contentGroup', e.target.value)}
              className="form-select"
            >
              <option value="">All Groups</option>
              {Object.entries(categoryGroups).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            
            <select
              value={`${filters.sortBy}-${filters.order}`}
              onChange={(e) => {
                const [sortBy, order] = e.target.value.split('-');
                setFilters(prev => ({ ...prev, sortBy, order }));
              }}
              className="form-select"
            >
              <option value="publishedAt-desc">Latest First</option>
              <option value="publishedAt-asc">Oldest First</option>
              <option value="viewCount-desc">Most Viewed</option>
              <option value="readTimeSeconds-asc">Quick Read First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading content..." />
        </div>
      ) : content.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Content Found</h2>
          <p className="text-gray-600 mb-4">
            {filters.search || filters.category || filters.contentGroup
              ? 'Try adjusting your filters to see more results.'
              : 'Check back later for time-saving content.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map((item) => (
              <div
                key={item.id}
                onClick={() => handleContentClick(item.id)}
                className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              >
                {/* Image */}
                {item.imageUrl && (
                  <div className="mb-4">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Header with badges */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {item.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getContentTypeColor(item.contentType)}`}>
                      {item.contentType?.replace('_', ' ')}
                    </span>
                  </div>
                  {item.isPriority && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center">
                      <Zap className="w-3 h-3 mr-1" />
                      Priority
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {item.title}
                </h3>

                {/* Summary */}
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {item.summary}
                </p>

                {/* Key Points */}
                {item.keyPoints && Array.isArray(item.keyPoints) && item.keyPoints.length > 0 && (
                  <div className="mb-4">
                    <ul className="space-y-1">
                      {item.keyPoints.slice(0, 3).map((point, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Meta Information */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div>
                    <span>{formatReadTime(item.readTimeSeconds)}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span>{item.viewCount?.toLocaleString() || 0} views</span>
                    <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Tags */}
                {item.tags && (
                  <div className="flex flex-wrap gap-1">
                    {(typeof item.tags === 'string' ? item.tags.split(',') : item.tags)
                      .slice(0, 3)
                      .map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full"
                      >
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalCount}
              itemsPerPage={pagination.limit}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TimeSaverContent;