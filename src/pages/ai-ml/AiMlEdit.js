// src/pages/ai-ml/AiMlEdit.js - EDIT AI/ML ARTICLE
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader, Trash2 } from 'lucide-react';
import { aiMlService } from '../../services/aiMlService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const AiMlEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const [formData, setFormData] = useState({
    headline: '',
    briefContent: '',
    fullContent: '',
    category: '',
    tags: '',
    sourceUrl: '',
    featuredImage: '',
    aiModel: '',
    aiApplication: '',
    companyMentioned: '',
    technologyType: '',
    isTrending: false,
    relevanceScore: ''
  });

  const [categories, setCategories] = useState([]);

  // Check authorization
  useEffect(() => {
    if (!user || !['EDITOR', 'AD_MANAGER', 'ADMIN'].includes(user.role)) {
      toast.error('Unauthorized access');
      navigate('/ai-ml');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchArticle();
    fetchCategories();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await aiMlService.getArticle(id);
      const article = response.data;
      
      setFormData({
        headline: article.headline || '',
        briefContent: article.briefContent || '',
        fullContent: article.fullContent || '',
        category: article.category || '',
        tags: Array.isArray(article.tags) ? article.tags.join(', ') : (article.tags || ''),
        sourceUrl: article.sourceUrl || '',
        featuredImage: article.featuredImage || '',
        aiModel: article.aiModel || '',
        aiApplication: article.aiApplication || '',
        companyMentioned: article.companyMentioned || '',
        technologyType: article.technologyType || '',
        isTrending: article.isTrending || false,
        relevanceScore: article.relevanceScore || ''
      });
    } catch (error) {
      console.error('Fetch article error:', error);
      toast.error('Failed to fetch article');
      navigate('/ai-ml');
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.headline.trim()) {
      toast.error('Headline is required');
      return;
    }
    
    if (!formData.briefContent.trim()) {
      toast.error('Brief content is required');
      return;
    }

    try {
      setSaving(true);
      
      const updateData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        relevanceScore: formData.relevanceScore ? parseFloat(formData.relevanceScore) : null
      };
      
      await aiMlService.updateArticle(id, updateData);
      
      toast.success('Article updated successfully!');
      navigate(`/ai-ml/${id}`);
    } catch (error) {
      console.error('Update article error:', error);
      toast.error(error.response?.data?.message || 'Failed to update article');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      await aiMlService.deleteArticle(id);
      toast.success('Article deleted successfully!');
      navigate('/ai-ml');
    } catch (error) {
      console.error('Delete article error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete article');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading article..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/ai-ml/${id}`)}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit AI/ML Article</h1>
        </div>
        
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400"
        >
          {deleting ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Article
            </>
          )}
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Headline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Headline *
          </label>
          <input
            type="text"
            name="headline"
            value={formData.headline}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter article headline"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id || cat.name} value={cat.name}>
                {cat.displayName || cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Brief Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brief Content (Summary) *
          </label>
          <textarea
            name="briefContent"
            value={formData.briefContent}
            onChange={handleChange}
            rows={4}
            className="input-field"
            placeholder="Enter a brief summary of the article"
            required
          />
        </div>

        {/* Full Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Content
          </label>
          <textarea
            name="fullContent"
            value={formData.fullContent}
            onChange={handleChange}
            rows={12}
            className="input-field"
            placeholder="Enter the full article content"
          />
        </div>

        {/* AI/ML Specific Fields */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">AI/ML Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Model
              </label>
              <input
                type="text"
                name="aiModel"
                value={formData.aiModel}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., GPT-4, Claude, DALL-E"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Application
              </label>
              <input
                type="text"
                name="aiApplication"
                value={formData.aiApplication}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., NLP, Computer Vision"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Mentioned
              </label>
              <input
                type="text"
                name="companyMentioned"
                value={formData.companyMentioned}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., OpenAI, Google, Microsoft"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technology Type
              </label>
              <input
                type="text"
                name="technologyType"
                value={formData.technologyType}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Deep Learning, Reinforcement Learning"
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter tags separated by commas (e.g., AI, Machine Learning, NLP)"
          />
          <p className="text-sm text-gray-500 mt-1">Separate tags with commas</p>
        </div>

        {/* Source URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Source URL
          </label>
          <input
            type="url"
            name="sourceUrl"
            value={formData.sourceUrl}
            onChange={handleChange}
            className="input-field"
            placeholder="https://example.com/article"
          />
        </div>

        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image URL
          </label>
          <input
            type="url"
            name="featuredImage"
            value={formData.featuredImage}
            onChange={handleChange}
            className="input-field"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Relevance Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Relevance Score (0-10)
          </label>
          <input
            type="number"
            name="relevanceScore"
            value={formData.relevanceScore}
            onChange={handleChange}
            min="0"
            max="10"
            step="0.1"
            className="input-field"
            placeholder="8.5"
          />
        </div>

        {/* Trending Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isTrending"
            checked={formData.isTrending}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-sm font-medium text-gray-700">
            Mark as Trending
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => navigate(`/ai-ml/${id}`)}
            className="btn-secondary"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center"
          >
            {saving ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Update Article
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AiMlEdit;