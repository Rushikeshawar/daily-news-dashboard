// src/pages/ai-ml/AiMlDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Calendar, Eye, Share2, Bookmark, TrendingUp, ExternalLink, Plus, Clock } from 'lucide-react';
import { aiMlService } from '../../services/aiMlService';
import { timeSaverService } from '../../services/timeSaverService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const AiMlDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeSavers, setTimeSavers] = useState([]);
  const [loadingTimeSavers, setLoadingTimeSavers] = useState(false);

  const canCreateTimeSaver = ['EDITOR', 'AD_MANAGER'].includes(user?.role);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchTimeSavers();
    }
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await aiMlService.getArticle(id);
      setArticle(response.data);
      
      // Track view automatically
      await aiMlService.trackView(id);
    } catch (error) {
      console.error('Fetch AI/ML article error:', error);
      toast.error('Failed to fetch article');
      navigate('/ai-ml');
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeSavers = async () => {
    try {
      setLoadingTimeSavers(true);
      const response = await timeSaverService.getContentByArticle(id, 'ai');
      console.log('Time Savers response:', response.data);
      setTimeSavers(response.data.content || []);
    } catch (error) {
      console.error('Fetch Time Savers error:', error);
    } finally {
      setLoadingTimeSavers(false);
    }
  };

  const handleShare = async () => {
    try {
      await aiMlService.trackInteraction(id, 'SHARE');
      
      if (navigator.share) {
        await navigator.share({
          title: article.headline,
          text: article.briefContent,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Article link copied to clipboard!');
      }
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Failed to share article');
    }
  };

  const handleBookmark = async () => {
    try {
      await aiMlService.trackInteraction(id, 'BOOKMARK');
      toast.success('Article bookmarked!');
    } catch (error) {
      console.error('Bookmark error:', error);
      toast.error('Failed to bookmark article');
    }
  };

  const handleCreateTimeSaver = () => {
    navigate(`/time-saver/create?aiArticleId=${id}&linkType=ai`);
  };

  const handleTimeSaverClick = (timeSaverId) => {
    navigate(`/time-saver/${timeSaverId}`);
  };

  // Helper function to format relevance score safely
  const formatRelevanceScore = (score) => {
    if (!score) return 'N/A';
    if (typeof score === 'number') {
      return `${score.toFixed(1)}/10`;
    }
    return typeof score === 'string' ? score : 'N/A';
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading article..." />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Article Not Found</h2>
        <p className="text-gray-600 mt-2">The AI/ML article you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/ai-ml')} className="btn-primary mt-4">
          Back to AI/ML News
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/ai-ml')}
          className="p-2 hover:bg-gray-100 rounded-md"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center">
          <Brain className="w-6 h-6 mr-2 text-blue-600" />
          <span className="text-sm text-gray-600">AI/ML News</span>
        </div>
      </div>

      {/* Article Content */}
      <div className="card">
        {/* Featured Image */}
        {article.featuredImage && (
          <div className="mb-6">
            <img
              src={article.featuredImage}
              alt={article.headline}
              className="w-full h-64 object-cover rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Category and Trending Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {article.category?.replace('_', ' ') || 'AI/ML'}
            </span>
            {article.isTrending && (
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                Trending
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleBookmark}
              className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-md"
              title="Bookmark"
            >
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {article.headline}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6 pb-6 border-b">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{new Date(article.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          <div className="flex items-center">
            <Eye className="w-4 h-4 mr-2" />
            <span>{article.viewCount?.toLocaleString() || 0} views</span>
          </div>
          {article.shareCount && (
            <div className="flex items-center">
              <Share2 className="w-4 h-4 mr-2" />
              <span>{article.shareCount.toLocaleString()} shares</span>
            </div>
          )}
          {article.relevanceScore && (
            <div className="flex items-center">
              <span className="font-medium mr-1">Relevance:</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                {formatRelevanceScore(article.relevanceScore)}
              </span>
            </div>
          )}
        </div>

        {/* AI/ML Specific Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">AI/ML Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {article.aiModel && (
              <div>
                <span className="font-medium text-blue-800">AI Model:</span>
                <p className="text-blue-700">{article.aiModel}</p>
              </div>
            )}
            {article.aiApplication && (
              <div>
                <span className="font-medium text-blue-800">Application:</span>
                <p className="text-blue-700">{article.aiApplication}</p>
              </div>
            )}
            {article.companyMentioned && (
              <div>
                <span className="font-medium text-blue-800">Company:</span>
                <p className="text-blue-700">{article.companyMentioned}</p>
              </div>
            )}
            {article.technologyType && (
              <div>
                <span className="font-medium text-blue-800">Technology Type:</span>
                <p className="text-blue-700">{article.technologyType}</p>
              </div>
            )}
          </div>
        </div>

        {/* Brief Content */}
        {article.briefContent && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Summary</h2>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-lg text-gray-700 leading-relaxed">
                {article.briefContent}
              </p>
            </div>
          </div>
        )}

        {/* Full Content */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Full Article</h2>
          <div className="prose max-w-none">
            {article.fullContent ? (
              article.fullContent.split('\n').map((paragraph, index) => (
                paragraph.trim() ? (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ) : (
                  <br key={index} />
                )
              ))
            ) : (
              <p className="text-gray-500 italic">Full content not available.</p>
            )}
          </div>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(article.tags) ? article.tags : article.tags.split(','))
                .map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Source Link */}
        {article.sourceUrl && (
          <div className="pt-6 border-t">
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Original Source
            </a>
          </div>
        )}
      </div>

      {/* Time Saver Content Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Time Saver Summaries</h2>
          </div>
          {canCreateTimeSaver && (
            <button
              onClick={handleCreateTimeSaver}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Time Saver
            </button>
          )}
        </div>

        {loadingTimeSavers ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="md" text="Loading Time Savers..." />
          </div>
        ) : timeSavers.length > 0 ? (
          <div className="space-y-4">
            {timeSavers.map((timeSaver) => (
              <div
                key={timeSaver.id}
                onClick={() => handleTimeSaverClick(timeSaver.id)}
                className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{timeSaver.title}</h3>
                    <p className="text-gray-700 text-sm mb-3">{timeSaver.summary}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <span className="px-2 py-1 bg-purple-200 text-purple-800 rounded">
                        {timeSaver.contentType?.replace('_', ' ')}
                      </span>
                      {timeSaver.readTimeSeconds && (
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {Math.ceil(timeSaver.readTimeSeconds / 60)} min read
                        </span>
                      )}
                      {timeSaver.isPriority && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded font-medium">
                          Priority
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No Time Saver summaries available for this article yet.</p>
            {canCreateTimeSaver && (
              <button
                onClick={handleCreateTimeSaver}
                className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
              >
                Create the first one
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AiMlDetail;