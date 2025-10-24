// src/pages/time-saver/CreateTimeSaverContent.js - WITH ARTICLE SEARCH & LINKING
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Clock, Link as LinkIcon, Search, X, ExternalLink } from 'lucide-react';
import { timeSaverService } from '../../services/timeSaverService';
import { articleService } from '../../services/articleService';
import { aiMlService } from '../../services/aiMlService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CreateTimeSaverContent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    category: '',
    imageUrl: '',
    keyPoints: '',
    sourceUrl: '',
    readTimeSeconds: '',
    isPriority: false,
    contentType: 'DIGEST',
    contentGroup: '',
    tags: '',
    linkedArticleId: searchParams.get('articleId') || '',
    linkedAiArticleId: searchParams.get('aiArticleId') || ''
  });

  // Article search state
  const [showArticleSearch, setShowArticleSearch] = useState(false);
  const [articleSearchQuery, setArticleSearchQuery] = useState('');
  const [articleSearchResults, setArticleSearchResults] = useState([]);
  const [articleSearchLoading, setArticleSearchLoading] = useState(false);
  const [searchType, setSearchType] = useState('regular'); // 'regular' or 'ai'
  const [initialArticlesLoaded, setInitialArticlesLoaded] = useState(false);
  
  // Linked article details
  const [linkedArticleDetails, setLinkedArticleDetails] = useState(null);
  const [linkedAiArticleDetails, setLinkedAiArticleDetails] = useState(null);

  const canCreate = ['EDITOR', 'AD_MANAGER'].includes(user?.role);

  // Check permissions
  useEffect(() => {
    if (!canCreate) {
      toast.error('You do not have permission to create Time Saver content');
      navigate('/time-saver');
    }
  }, [canCreate, navigate]);

  // Fetch linked article details if IDs are provided in URL
  useEffect(() => {
    const fetchLinkedArticle = async () => {
      try {
        if (formData.linkedArticleId) {
          const response = await articleService.getArticle(formData.linkedArticleId);
          const article = response.data;
          setLinkedArticleDetails(article);
          
          // Auto-fill form with article data
          setFormData(prev => ({
            ...prev,
            title: `Quick Summary: ${article.headline}`,
            summary: article.briefContent || '',
            category: article.category || prev.category,
            imageUrl: article.featuredImage || prev.imageUrl
          }));
        } else if (formData.linkedAiArticleId) {
          const response = await aiMlService.getArticle(formData.linkedAiArticleId);
          const article = response.data;
          setLinkedAiArticleDetails(article);
          
          // Auto-fill form with AI article data
          setFormData(prev => ({
            ...prev,
            title: `AI Brief: ${article.headline}`,
            summary: article.briefContent || '',
            category: 'TECHNOLOGY',
            imageUrl: article.featuredImage || prev.imageUrl
          }));
        }
      } catch (error) {
        console.error('Failed to fetch linked article:', error);
      }
    };

    fetchLinkedArticle();
  }, []);

  // Load latest 10 articles when search modal opens
  useEffect(() => {
    const loadLatestArticles = async () => {
      if (showArticleSearch && !initialArticlesLoaded) {
        try {
          setArticleSearchLoading(true);
          
          let response;
          if (searchType === 'regular') {
            // Get latest 10 regular articles
            response = await articleService.getArticles({
              page: 1,
              limit: 10,
              sortBy: 'publishedAt',
              order: 'desc'
            });
          } else {
            // Get latest 10 AI articles
            response = await aiMlService.getNews({
              page: 1,
              limit: 10,
              sortBy: 'publishedAt',
              order: 'desc'
            });
          }

          const articles = response.data?.articles || [];
          setArticleSearchResults(articles);
          setInitialArticlesLoaded(true);
        } catch (error) {
          console.error('Load latest articles error:', error);
        } finally {
          setArticleSearchLoading(false);
        }
      }
    };

    loadLatestArticles();
  }, [showArticleSearch, searchType, initialArticlesLoaded]);

  // Backend-compatible categories
  const categories = [
    { value: 'TECHNOLOGY', label: 'Technology' },
    { value: 'BUSINESS', label: 'Business' },
    { value: 'SPORTS', label: 'Sports' },
    { value: 'POLITICS', label: 'Politics' },
    { value: 'ENTERTAINMENT', label: 'Entertainment' },
    { value: 'SCIENCE', label: 'Science' },
    { value: 'HEALTH', label: 'Health' },
    { value: 'EDUCATION', label: 'Education' },
    { value: 'GENERAL', label: 'General' }
  ];

  // Backend-compatible content types
  const contentTypes = [
    { value: 'DIGEST', label: 'News Digest' },
    { value: 'QUICK_UPDATE', label: 'Quick Update' },
    { value: 'BRIEFING', label: 'Briefing' },
    { value: 'SUMMARY', label: 'Summary' },
    { value: 'HIGHLIGHTS', label: 'Highlights' },
    { value: 'VIRAL', label: 'Viral Content' },
    { value: 'SOCIAL', label: 'Social Buzz' },
    { value: 'BREAKING', label: 'Breaking News' }
  ];

  // Backend-compatible content groups
  const contentGroups = [
    { value: 'today_new', label: 'Today\'s New' },
    { value: 'breaking_critical', label: 'Breaking & Critical' },
    { value: 'weekly_highlights', label: 'Weekly Highlights' },
    { value: 'monthly_top', label: 'Monthly Top' },
    { value: 'brief_updates', label: 'Brief Updates' },
    { value: 'viral_buzz', label: 'Viral Buzz' },
    { value: 'changing_norms', label: 'Changing Norms' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? (value === '' ? '' : parseInt(value, 10)) : 
              value
    }));
  };

  // Search for articles
  const handleSearchArticles = async () => {
    if (!articleSearchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    try {
      setArticleSearchLoading(true);
      
      let response;
      if (searchType === 'regular') {
        // Search regular articles
        response = await articleService.searchArticles({
          q: articleSearchQuery,
          limit: 20,
          status: 'PUBLISHED'
        });
      } else {
        // Search AI articles
        response = await aiMlService.searchArticles({
          q: articleSearchQuery,
          limit: 20,
          status: 'PUBLISHED'
        });
      }

      const articles = response.data?.articles || response.data || [];
      setArticleSearchResults(articles);
      
      if (articles.length === 0) {
        toast.info('No articles found matching your search');
      } else {
        toast.success(`Found ${articles.length} article${articles.length > 1 ? 's' : ''}`);
      }
    } catch (error) {
      console.error('Search articles error:', error);
      toast.error('Failed to search articles');
    } finally {
      setArticleSearchLoading(false);
    }
  };

  // Link an article
  const handleLinkArticle = async (article) => {
    try {
      if (searchType === 'regular') {
        setFormData(prev => ({
          ...prev,
          linkedArticleId: article.id,
          linkedAiArticleId: '', // Clear AI article if linking regular article
          title: `Quick Summary: ${article.headline}`,
          summary: article.briefContent || prev.summary,
          category: article.category || prev.category,
          imageUrl: article.featuredImage || prev.imageUrl
        }));
        setLinkedArticleDetails(article);
        setLinkedAiArticleDetails(null);
        toast.success('Regular article linked!');
      } else {
        setFormData(prev => ({
          ...prev,
          linkedAiArticleId: article.id,
          linkedArticleId: '', // Clear regular article if linking AI article
          title: `AI Brief: ${article.headline}`,
          summary: article.briefContent || prev.summary,
          category: 'TECHNOLOGY',
          imageUrl: article.featuredImage || prev.imageUrl
        }));
        setLinkedAiArticleDetails(article);
        setLinkedArticleDetails(null);
        toast.success('AI article linked!');
      }

      // Close search modal
      setShowArticleSearch(false);
      setArticleSearchQuery('');
      setArticleSearchResults([]);
    } catch (error) {
      console.error('Link article error:', error);
      toast.error('Failed to link article');
    }
  };

  // Remove linked article
  const handleRemoveLink = () => {
    setFormData(prev => ({
      ...prev,
      linkedArticleId: '',
      linkedAiArticleId: ''
    }));
    setLinkedArticleDetails(null);
    setLinkedAiArticleDetails(null);
    toast.success('Article link removed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    if (!formData.summary.trim()) {
      toast.error('Summary is required');
      return;
    }
    
    if (formData.summary.trim().length < 10) {
      toast.error('Summary must be at least 10 characters');
      return;
    }
    
    if (!formData.category) {
      toast.error('Category is required');
      return;
    }

    try {
      setLoading(true);
      
      const processedData = {
        title: formData.title.trim(),
        summary: formData.summary.trim(),
        category: formData.category,
        imageUrl: formData.imageUrl?.trim() || '',
        keyPoints: formData.keyPoints ? 
          formData.keyPoints.split('\n').map(point => point.trim()).filter(point => point).join('|') : 
          '',
        sourceUrl: formData.sourceUrl?.trim() || '',
        readTimeSeconds: formData.readTimeSeconds ? parseInt(formData.readTimeSeconds, 10) : null,
        isPriority: Boolean(formData.isPriority),
        contentType: formData.contentType || 'DIGEST',
        contentGroup: formData.contentGroup || '',
        tags: formData.tags.trim(),
        linkedArticleId: formData.linkedArticleId || null,
        linkedAiArticleId: formData.linkedAiArticleId || null
      };

      console.log('Submitting Time Saver content:', processedData);

      const result = await timeSaverService.createContent(processedData);
      toast.success('Time Saver content created successfully!');
      
      // Navigate based on linked article
      if (formData.linkedArticleId) {
        navigate(`/articles/${linkedArticleDetails?.slug || formData.linkedArticleId}`);
      } else if (formData.linkedAiArticleId) {
        navigate(`/ai-ml/${linkedAiArticleDetails?.slug || formData.linkedAiArticleId}`);
      } else {
        navigate('/time-saver');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create content';
      toast.error(errorMessage);
      console.error('Create Time Saver content error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!canCreate) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-md"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Clock className="w-8 h-8 mr-3 text-blue-600" />
            Create Time Saver Content
          </h1>
          <p className="text-gray-600">Add new time-saving content and quick updates</p>
        </div>
      </div>

      {/* Linked Article Info */}
      {(linkedArticleDetails || linkedAiArticleDetails) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <LinkIcon className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <p className="font-medium text-blue-900">
                  {linkedAiArticleDetails ? '🤖 Linked to AI Article' : '📄 Linked to Article'}
                </p>
                <p className="text-sm text-blue-700">
                  {(linkedArticleDetails || linkedAiArticleDetails)?.headline}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  This Time Saver content will link to the article above
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveLink}
              className="text-red-600 hover:text-red-800"
              title="Remove link"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Link Article Button */}
      {!linkedArticleDetails && !linkedAiArticleDetails && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">Link to Article (Optional)</h2>
            <p className="text-sm text-gray-600">Search and link this Time Saver to an existing article</p>
          </div>
          <button
            type="button"
            onClick={() => setShowArticleSearch(true)}
            className="btn-secondary flex items-center"
          >
            <Search className="w-5 h-5 mr-2" />
            Search Articles to Link
          </button>
        </div>
      )}

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter content title"
              required
            />
          </div>

          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
              Summary * (minimum 10 characters)
            </label>
            <textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              rows={4}
              className="form-textarea"
              placeholder="Enter a concise summary of the content (at least 10 characters)"
              required
              minLength={10}
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.summary.length}/10 minimum characters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="contentType" className="block text-sm font-medium text-gray-700 mb-2">
                Content Type
              </label>
              <select
                id="contentType"
                name="contentType"
                value={formData.contentType}
                onChange={handleChange}
                className="form-select"
              >
                {contentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="contentGroup" className="block text-sm font-medium text-gray-700 mb-2">
                Content Group
              </label>
              <select
                id="contentGroup"
                name="contentGroup"
                value={formData.contentGroup}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select a group</option>
                {contentGroups.map(group => (
                  <option key={group.value} value={group.value}>
                    {group.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="readTimeSeconds" className="block text-sm font-medium text-gray-700 mb-2">
                Read Time (seconds)
              </label>
              <input
                type="number"
                id="readTimeSeconds"
                name="readTimeSeconds"
                value={formData.readTimeSeconds}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., 120"
                min="1"
              />
            </div>
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="form-input"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label htmlFor="keyPoints" className="block text-sm font-medium text-gray-700 mb-2">
              Key Points (one per line)
            </label>
            <textarea
              id="keyPoints"
              name="keyPoints"
              value={formData.keyPoints}
              onChange={handleChange}
              rows={5}
              className="form-textarea"
              placeholder="• First key point&#10;• Second key point&#10;• Third key point"
            />
          </div>

          <div>
            <label htmlFor="sourceUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Source URL (External Link)
            </label>
            <input
              type="url"
              id="sourceUrl"
              name="sourceUrl"
              value={formData.sourceUrl}
              onChange={handleChange}
              className="form-input"
              placeholder="https://example.com/source"
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="form-input"
              placeholder="tag1, tag2, tag3"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPriority"
              name="isPriority"
              checked={formData.isPriority}
              onChange={handleChange}
              className="form-checkbox"
            />
            <label htmlFor="isPriority" className="ml-2 text-sm text-gray-700">
              Mark as Priority Content
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Content'}
            </button>
          </div>
        </form>
      </div>

      {/* Article Search Modal */}
      {showArticleSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Search Articles</h2>
                <button
                  onClick={() => setShowArticleSearch(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Search Type Tabs */}
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => {
                    setSearchType('regular');
                    setInitialArticlesLoaded(false); // Reload articles for new tab
                    setArticleSearchQuery(''); // Clear search
                    setArticleSearchResults([]); // Clear results
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    searchType === 'regular'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📄 Regular Articles
                </button>
                <button
                  onClick={() => {
                    setSearchType('ai');
                    setInitialArticlesLoaded(false); // Reload articles for new tab
                    setArticleSearchQuery(''); // Clear search
                    setArticleSearchResults([]); // Clear results
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    searchType === 'ai'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🤖 AI Articles
                </button>
              </div>

              {/* Search Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={articleSearchQuery}
                  onChange={(e) => setArticleSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchArticles()}
                  placeholder="Search by title, content, or tags..."
                  className="flex-1 form-input"
                />
                <button
                  onClick={handleSearchArticles}
                  disabled={articleSearchLoading}
                  className="btn-primary flex items-center"
                >
                  <Search className="w-5 h-5 mr-2" />
                  {articleSearchLoading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto p-6">
              {articleSearchLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">
                    {articleSearchQuery ? 'Searching...' : 'Loading latest articles...'}
                  </p>
                </div>
              ) : articleSearchResults.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {articleSearchQuery ? 'No articles found' : 'Latest Articles'}
                  </h3>
                  <p className="text-gray-600">
                    {articleSearchQuery 
                      ? 'Try searching with different keywords or check another tab.'
                      : 'Loading the 10 most recent articles...'}
                  </p>
                </div>
              ) : (
                <>
                  {/* Results Header */}
                  <div className="mb-4 pb-3 border-b border-gray-200">
                    <p className="text-sm text-gray-600">
                      {articleSearchQuery ? (
                        <>
                          <span className="font-semibold text-gray-900">{articleSearchResults.length}</span> 
                          {' '}result{articleSearchResults.length !== 1 ? 's' : ''} found for "{articleSearchQuery}"
                        </>
                      ) : (
                        <>
                          Showing <span className="font-semibold text-gray-900">{articleSearchResults.length}</span> 
                          {' '}latest {searchType === 'ai' ? 'AI ' : ''}article{articleSearchResults.length !== 1 ? 's' : ''}
                        </>
                      )}
                    </p>
                  </div>

                  {/* Articles List */}
                  <div className="space-y-3">
                  {articleSearchResults.map((article) => (
                    <div
                      key={article.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => handleLinkArticle(article)}
                    >
                      <div className="flex items-start space-x-4">
                        {article.featuredImage && (
                          <img
                            src={article.featuredImage}
                            alt={article.headline}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              {article.category}
                            </span>
                            {searchType === 'ai' && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                AI Article
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                            {article.headline}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {article.briefContent || 'No description available'}
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <span>{new Date(article.publishedDate || article.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800">
                          <ExternalLink className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTimeSaverContent;