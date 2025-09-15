// src/pages/ai-ml/AiMlNews.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Brain, TrendingUp } from 'lucide-react';
import { aiMlService } from '../../services/aiMlService';
import { useAuth } from '../../context/AuthContext';
import SearchBox from '../../components/common/SearchBox';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const AiMlNews = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
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
    sortBy: 'publishedAt',
    order: 'desc'
  });
  const [categories, setCategories] = useState([]);

  const canCreateArticle = user?.role === 'ADMIN';

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, [filters, pagination.page]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };
      
      const response = await aiMlService.getNews(params);
      setArticles(response.data.articles || []);
      setPagination(prev => ({
        ...prev,
        ...response.data.pagination
      }));
    } catch (error) {
      console.error('Fetch AI/ML articles error:', error);
      toast.error('Failed to fetch AI/ML articles');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await aiMlService.getCategories();
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Fetch categories error:', error);
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

  const handleArticleClick = (articleId) => {
    // Track view
    aiMlService.trackView(articleId);
    navigate(`/ai-ml/${articleId}`);
  };

  const getStatusBadge = (relevanceScore) => {
    if (relevanceScore >= 9) return 'bg-red-100 text-red-800';
    if (relevanceScore >= 8) return 'bg-orange-100 text-orange-800';
    if (relevanceScore >= 7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatRelevanceScore = (score) => {
    return score ? `${score.toFixed(1)}/10` : 'N/A';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Brain className="w-8 h-8 mr-3 text-blue-600" />
            AI/ML News
          </h1>
          <p className="text-gray-600">Latest artificial intelligence and machine learning updates</p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/ai-ml/trending')}
            className="btn-outline flex items-center"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Trending
          </button>
          {canCreateArticle && (
            <button
              onClick={() => navigate('/ai-ml/create')}
              className="btn-primary flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Article
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <SearchBox
              placeholder="Search AI/ML articles..."
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
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name.replace('_', ' ')} ({category.articleCount})
                </option>
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
              <option value="relevanceScore-desc">Most Relevant</option>
              <option value="viewCount-desc">Most Viewed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading AI/ML articles..." />
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No AI/ML Articles Found</h2>
          <p className="text-gray-600 mb-4">
            {filters.search || filters.category
              ? 'Try adjusting your filters to see more results.'
              : 'Check back later for the latest AI/ML news and updates.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <div
                key={article.id}
                onClick={() => handleArticleClick(article.id)}
                className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              >
                {/* Featured Image */}
                {article.featuredImage && (
                  <div className="mb-4">
                    <img
                      src={article.featuredImage}
                      alt={article.headline}
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Header with badges */}
                <div className="flex items-start justify-between mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {article.category?.replace('_', ' ') || 'AI/ML'}
                  </span>
                  {article.isTrending && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {article.headline}
                </h3>

                {/* Brief Content */}
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.briefContent}
                </p>

                {/* AI Details */}
                <div className="space-y-2 mb-4">
                  {article.aiModel && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">Model:</span>
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
                        {article.aiModel}
                      </span>
                    </div>
                  )}
                  {article.companyMentioned && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">Company:</span>
                      <span>{article.companyMentioned}</span>
                    </div>
                  )}
                </div>

                {/* Meta Information */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div>
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span>{article.viewCount?.toLocaleString() || 0} views</span>
                    {article.relevanceScore && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(article.relevanceScore)}`}>
                        {formatRelevanceScore(article.relevanceScore)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {(Array.isArray(article.tags) ? article.tags : article.tags.split(','))
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

export default AiMlNews;

