// src/pages/ai-ml/AiMlTrending.js - Fixed version
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Brain, Flame, Clock } from 'lucide-react';
import { aiMlService } from '../../services/aiMlService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const AiMlTrending = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('7d');

  useEffect(() => {
    fetchTrendingArticles();
  }, [timeframe]);

  const fetchTrendingArticles = async () => {
    try {
      setLoading(true);
      const response = await aiMlService.getTrending({ timeframe, limit: 20 });
      setArticles(response.data.articles || []);
    } catch (error) {
      console.error('Fetch trending articles error:', error);
      toast.error('Failed to fetch trending articles');
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = (articleId) => {
    aiMlService.trackView(articleId);
    navigate(`/ai-ml/${articleId}`);
  };

  const getTimeframeName = (tf) => {
    const names = {
      '24h': 'Last 24 Hours',
      '7d': 'Last 7 Days',
      '30d': 'Last 30 Days'
    };
    return names[tf] || 'Last 7 Days';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/ai-ml')}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Flame className="w-8 h-8 mr-3 text-red-500" />
              Trending AI/ML News
            </h1>
            <p className="text-gray-600">Most popular AI/ML articles right now</p>
          </div>
        </div>

        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="form-select"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading trending articles..." />
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Trending Articles</h2>
          <p className="text-gray-600">No trending AI/ML articles found for {getTimeframeName(timeframe).toLowerCase()}.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((article, index) => (
            <div
              key={article.id}
              onClick={() => handleArticleClick(article.id)}
              className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            >
              <div className="flex items-start space-x-4">
                {/* Trending Rank */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">#{index + 1}</span>
                  </div>
                </div>

                {/* Article Image */}
                {article.featuredImage && (
                  <div className="flex-shrink-0">
                    <img
                      src={article.featuredImage}
                      alt={article.headline}
                      className="w-24 h-24 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Article Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {article.category?.replace('_', ' ') || 'AI/ML'}
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </span>
                    {article.relevanceScore && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {typeof article.relevanceScore === 'number' ? article.relevanceScore.toFixed(1) : article.relevanceScore}/10
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {article.headline}
                  </h3>

                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {article.briefContent}
                  </p>

                  {/* AI Details */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                    {article.aiModel && (
                      <div className="flex items-center">
                        <Brain className="w-4 h-4 mr-1" />
                        <span>{article.aiModel}</span>
                      </div>
                    )}
                    {article.companyMentioned && (
                      <div className="flex items-center">
                        <span className="font-medium">Company:</span>
                        <span className="ml-1">{article.companyMentioned}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span>{article.viewCount?.toLocaleString() || 0} views</span>
                    {article.shareCount && (
                      <span>{article.shareCount.toLocaleString()} shares</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AiMlTrending;