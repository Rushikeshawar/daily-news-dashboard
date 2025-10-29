// src/pages/ai-ml/AiMlEdit.js - EDIT AI/ML ARTICLE WITH BEAUTIFUL CSS
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader, Trash2, Image, Tag, TrendingUp, Star, Sparkles, Link, BarChart3 } from 'lucide-react';
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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <LoadingSpinner size="lg" text="Loading article..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/ai-ml/${id}`)}
                className="p-2.5 hover:bg-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md border border-gray-200"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Sparkles className="w-8 h-8 mr-3 text-indigo-600" />
                  Edit AI/ML Article
                </h1>
                <p className="text-sm text-gray-500 mt-1">Update article details and content</p>
              </div>
            </div>
            
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:bg-red-400 disabled:cursor-not-allowed font-medium"
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
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Content Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Main Content</h3>
              <p className="text-sm text-gray-600 mt-0.5">Article headline and content</p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Headline */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Headline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="headline"
                  value={formData.headline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 font-medium"
                  placeholder="Enter article headline"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white font-medium"
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Brief Content (Summary) <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="briefContent"
                  value={formData.briefContent}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none"
                  placeholder="Enter a brief summary of the article"
                  required
                />
                <p className="text-xs text-gray-500 mt-1.5 flex items-center">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2"></span>
                  This will appear in article previews and search results
                </p>
              </div>

              {/* Full Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Content
                </label>
                <textarea
                  name="fullContent"
                  value={formData.fullContent}
                  onChange={handleChange}
                  rows={12}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none font-mono text-sm"
                  placeholder="Enter the full article content"
                />
              </div>
            </div>
          </div>

          {/* AI/ML Details Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg border-2 border-indigo-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <h3 className="text-lg font-bold text-white flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                AI/ML Specific Details
              </h3>
              <p className="text-indigo-100 text-sm mt-1">Add AI and machine learning related information</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    AI Model
                  </label>
                  <input
                    type="text"
                    name="aiModel"
                    value={formData.aiModel}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
                    placeholder="e.g., GPT-4, Claude, DALL-E"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    AI Application
                  </label>
                  <input
                    type="text"
                    name="aiApplication"
                    value={formData.aiApplication}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
                    placeholder="e.g., NLP, Computer Vision"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Mentioned
                  </label>
                  <input
                    type="text"
                    name="companyMentioned"
                    value={formData.companyMentioned}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
                    placeholder="e.g., OpenAI, Google, Microsoft"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Technology Type
                  </label>
                  <input
                    type="text"
                    name="technologyType"
                    value={formData.technologyType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
                    placeholder="e.g., Deep Learning, Reinforcement Learning"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Media & Metadata Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <Image className="w-5 h-5 mr-2 text-gray-600" />
                Media & Metadata
              </h3>
              <p className="text-sm text-gray-600 mt-0.5">Images, tags, and additional information</p>
            </div>
            
            <div className="p-6 space-y-5">
              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <Tag className="w-4 h-4 mr-1.5 text-gray-500" />
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="Enter tags separated by commas (e.g., AI, Machine Learning, NLP)"
                />
                <p className="text-xs text-gray-500 mt-1.5 flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                  Separate tags with commas for better organization
                </p>
              </div>

              {/* Source URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <Link className="w-4 h-4 mr-1.5 text-gray-500" />
                  Source URL
                </label>
                <input
                  type="url"
                  name="sourceUrl"
                  value={formData.sourceUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="https://example.com/article"
                />
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <Image className="w-4 h-4 mr-1.5 text-gray-500" />
                  Featured Image URL
                </label>
                <input
                  type="url"
                  name="featuredImage"
                  value={formData.featuredImage}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.featuredImage && (
                  <div className="mt-3 rounded-xl overflow-hidden border-2 border-gray-200">
                    <img 
                      src={formData.featuredImage} 
                      alt="Preview" 
                      className="w-full h-48 object-cover"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                )}
              </div>

              {/* Relevance Score */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-1.5 text-gray-500" />
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="8.5"
                />
              </div>

              {/* Trending Checkbox */}
              <div className="flex items-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border-2 border-orange-200">
                <input
                  type="checkbox"
                  name="isTrending"
                  checked={formData.isTrending}
                  onChange={handleChange}
                  className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <label className="ml-3 flex items-center text-sm font-semibold text-gray-700">
                  <TrendingUp className="w-4 h-4 mr-2 text-orange-600" />
                  Mark as Trending
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <button
              type="button"
              onClick={() => navigate(`/ai-ml/${id}`)}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold disabled:opacity-50"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {saving ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Update Article
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AiMlEdit;