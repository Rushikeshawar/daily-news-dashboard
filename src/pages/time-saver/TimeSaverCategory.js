// src/pages/time-saver/TimeSaverCategory.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ExternalLink } from 'lucide-react';
import { timeSaverService } from '../../services/timeSaverService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const TimeSaverCategory = () => {
  const { group } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryInfo, setCategoryInfo] = useState(null);

  const categoryGroups = timeSaverService.getCategoryGroups();

  useEffect(() => {
    fetchCategoryContent();
  }, [group]);

  const fetchCategoryContent = async () => {
    try {
      setLoading(true);
      const response = await timeSaverService.getContentByCategory(group, { limit: 50 });
      setContent(response.data.content || []);
      setCategoryInfo({
        name: categoryGroups[group] || group,
        count: response.data.totalCount || 0
      });
    } catch (error) {
      console.error('Fetch category content error:', error);
      toast.error('Failed to fetch category content');
    } finally {
      setLoading(false);
    }
  };

  const handleContentClick = async (item) => {
    try {
      // Track the view
      await timeSaverService.trackView(item.id);
      
      // Get the article link information
      const linkInfo = timeSaverService.getArticleLink(item);
      
      if (linkInfo.url) {
        if (linkInfo.isExternal) {
          // Open external URL in new tab
          window.open(linkInfo.url, '_blank', 'noopener,noreferrer');
        } else if (linkInfo.requiresAuth && linkInfo.needsLogin) {
          // Navigate to login with redirect
          navigate(linkInfo.url);
          toast.info('Please log in to view this AI-generated article');
        } else {
          // Navigate to internal article
          navigate(linkInfo.url);
        }
      } else {
        // No linked article - show a message
        toast.info('No full article available for this content');
        console.log('Content details:', item);
      }
    } catch (error) {
      console.error('Handle content click error:', error);
      toast.error('Failed to open article');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/time-saver')}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {categoryInfo?.name || 'Category Content'}
          </h1>
          <p className="text-gray-600">
            {categoryInfo?.count || 0} items available
          </p>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading category content..." />
        </div>
      ) : content.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Content Available</h2>
          <p className="text-gray-600">No content found in this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {content.map((item, index) => (
            <div
              key={item.id}
              onClick={() => handleContentClick(item)}
              className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            >
              <div className="flex items-start space-x-4">
                {/* Index */}
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                </div>

                {/* Image */}
                {item.imageUrl && (
                  <div className="flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {item.category}
                    </span>
                    {item.isPriority && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                        Priority
                      </span>
                    )}
                    {/* Show external link icon if it's an external source */}
                    {item.sourceUrl && !item.linkedArticle && !item.linkedAiArticle && (
                      <ExternalLink className="w-4 h-4 text-gray-500" />
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {item.summary}
                  </p>

                  {/* Key Points */}
                  {item.keyPoints && item.keyPoints.length > 0 && (
                    <div className="mb-3">
                      <ul className="text-sm text-gray-600 space-y-1">
                        {(Array.isArray(item.keyPoints) ? item.keyPoints : item.keyPoints.split('|'))
                          .slice(0, 3)
                          .map((point, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-blue-500 mr-2">•</span>
                              <span>{point.trim()}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      {item.readTimeSeconds ? `${Math.ceil(item.readTimeSeconds / 60)}m read` : 'Quick read'}
                    </span>
                    <div className="flex items-center space-x-4">
                      {item.viewCount && (
                        <span>{item.viewCount.toLocaleString()} views</span>
                      )}
                      <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Linked Article Info */}
                  {(item.linkedArticle || item.linkedAiArticle) && (
                    <div className="mt-2 text-xs text-blue-600 font-medium">
                      Click to read full article →
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeSaverCategory;