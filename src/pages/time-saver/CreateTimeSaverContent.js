// src/pages/time-saver/CreateTimeSaverContent.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Clock, Link as LinkIcon } from 'lucide-react';
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
    linkedAiArticleId: searchParams.get('aiArticleId') || '',
    linkType: searchParams.get('linkType') || 'none'
  });

  const canCreate = ['EDITOR', 'AD_MANAGER'].includes(user?.role);

  useEffect(() => {
    if (!canCreate) {
      toast.error('You do not have permission to create Time Saver content');
      navigate('/time-saver');
    }
  }, [canCreate, navigate]);

  useEffect(() => {
    const fetchLinkedArticle = async () => {
      try {
        if (formData.linkedArticleId && formData.linkType === 'news') {
          const response = await articleService.getArticle(formData.linkedArticleId);
          const article = response.data;
          setFormData(prev => ({
            ...prev,
            title: `Quick Summary: ${article.headline}`,
            summary: article.briefContent || '',
            category: article.category || prev.category,
            imageUrl: article.featuredImage || prev.imageUrl
          }));
        } else if (formData.linkedAiArticleId && formData.linkType === 'ai') {
          const response = await aiMlService.getArticle(formData.linkedAiArticleId);
          const article = response.data;
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

  // Backend-compatible categories ONLY
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
        linkedArticleId: formData.linkType === 'news' ? (formData.linkedArticleId || null) : null,
        linkedAiArticleId: formData.linkType === 'ai' ? (formData.linkedAiArticleId || null) : null
      };

      console.log('Submitting Time Saver content:', processedData);

      await timeSaverService.createContent(processedData);
      toast.success('Time Saver content created successfully!');
      
      if (formData.linkedArticleId) {
        navigate(`/articles/${formData.linkedArticleId}`);
      } else if (formData.linkedAiArticleId) {
        navigate(`/ai-ml/${formData.linkedAiArticleId}`);
      } else {
        navigate('/time-saver');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create content';
      toast.error(errorMessage);
      console.error('Create Time Saver content error:', error);
      console.error('Error response:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  if (!canCreate) {
    return null;
  }

  return (
    <div className="space-y-6">
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

      {(formData.linkedArticleId || formData.linkedAiArticleId) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
          <LinkIcon className="w-5 h-5 text-blue-600 mr-3" />
          <div>
            <p className="font-medium text-blue-900">Linked to Article</p>
            <p className="text-sm text-blue-700">
              This Time Saver content will be linked to the selected article
            </p>
          </div>
        </div>
      )}

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
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
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
                {contentTypes.map((type) => (
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
                <option value="">Select group</option>
                {contentGroups.map((group) => (
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
                min="10"
                step="5"
                placeholder="120"
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
            {formData.imageUrl && (
              <div className="mt-2">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-md"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="keyPoints" className="block text-sm font-medium text-gray-700 mb-2">
              Key Points
            </label>
            <textarea
              id="keyPoints"
              name="keyPoints"
              value={formData.keyPoints}
              onChange={handleChange}
              rows={4}
              className="form-textarea"
              placeholder="Enter key points (one per line)"
            />
            <p className="text-sm text-gray-500 mt-1">Enter each key point on a new line (will be stored as pipe-separated)</p>
          </div>

          <div>
            <label htmlFor="sourceUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Source URL
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
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="form-input"
              placeholder="urgent, breaking, tech, business"
            />
            <p className="text-sm text-gray-500 mt-1">Comma-separated tags (e.g., urgent, tech, breaking)</p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPriority"
              name="isPriority"
              checked={formData.isPriority}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPriority" className="ml-2 block text-sm text-gray-900">
              Mark as priority content
            </label>
          </div>

          <input type="hidden" name="linkedArticleId" value={formData.linkedArticleId} />
          <input type="hidden" name="linkedAiArticleId" value={formData.linkedAiArticleId} />
          <input type="hidden" name="linkType" value={formData.linkType} />

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-outline"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Creating...' : 'Create Content'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTimeSaverContent;