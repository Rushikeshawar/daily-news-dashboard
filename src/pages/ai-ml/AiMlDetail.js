// src/pages/ai-ml/AiMlDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Calendar, Eye, Share2, Bookmark, TrendingUp, ExternalLink } from 'lucide-react';
import { aiMlService } from '../../services/aiMlService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const AiMlDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
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
                {article.relevanceScore.toFixed(1)}/10
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
    </div>
  );
};

export default AiMlDetail;

