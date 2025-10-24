// src/pages/ai-ml/CreateAiMlArticle.js - UPDATED WITH TIMESAVER FIELDS

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain } from 'lucide-react';
import { aiMlService } from '../../services/aiMlService';
import toast from 'react-hot-toast';

const CreateAiMlArticle = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    headline: '',
    briefContent: '',
    fullContent: '',
    category: '',
    featuredImage: '',
    tags: '',
    aiModel: '',
    aiApplication: '',
    companyMentioned: '',
    technologyType: '',
    relevanceScore: '',
    
    // ⭐ NEW: TimeSaver auto-creation fields
    createTimeSaver: true,
    timeSaverTitle: '',
    timeSaverSummary: '',
    timeSaverKeyPoints: '',
    timeSaverContentType: 'AI_ML',
    timeSaverIconName: 'Brain',
    timeSaverBgColor: '#8B5CF6',
    timeSaverIsPriority: false
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await aiMlService.getCategories();
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        toast.error('Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? (value === '' ? '' : parseFloat(value)) : value)
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
    
    if (!formData.category) {
      toast.error('Category is required');
      return;
    }

    try {
      setLoading(true);
      
      const processedData = {
        headline: formData.headline.trim(),
        briefContent: formData.briefContent.trim(),
        fullContent: formData.fullContent.trim(),
        category: formData.category,
        featuredImage: formData.featuredImage.trim(),
        tags: formData.tags.trim(),
        aiModel: formData.aiModel.trim(),
        aiApplication: formData.aiApplication.trim(),
        companyMentioned: formData.companyMentioned.trim(),
        technologyType: formData.technologyType.trim(),
        relevanceScore: formData.relevanceScore ? parseFloat(formData.relevanceScore) : null,
        
        // ⭐ NEW: TimeSaver fields
        createTimeSaver: formData.createTimeSaver,
        timeSaverTitle: formData.timeSaverTitle.trim(),
        timeSaverSummary: formData.timeSaverSummary.trim(),
        timeSaverKeyPoints: formData.timeSaverKeyPoints 
          ? formData.timeSaverKeyPoints.split(',').map(point => point.trim()).filter(Boolean)
          : [],
        timeSaverContentType: formData.timeSaverContentType,
        timeSaverIconName: formData.timeSaverIconName,
        timeSaverBgColor: formData.timeSaverBgColor,
        timeSaverIsPriority: formData.timeSaverIsPriority
      };

      console.log('Creating AI/ML article with data:', processedData);

      const response = await aiMlService.createArticle(processedData);
      
      // Check if TimeSaver was created
      if (response.data?.timeSaver) {
        toast.success('AI/ML article and TimeSaver created successfully! 🎉');
      } else {
        toast.success('AI/ML article created successfully!');
      }
      
      navigate('/ai-ml');
    } catch (error) {
      toast.error(error.message || 'Failed to create AI/ML article');
      console.error('Create AI/ML article error:', error);
    } finally {
      setLoading(false);
    }
  };

  const wordCount = formData.fullContent.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/ai-ml')}
          className="p-2 hover:bg-gray-100 rounded-md"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Brain className="w-8 h-8 mr-3 text-blue-600" />
            Create AI/ML Article
          </h1>
          <p className="text-gray-600">Add new AI/ML news and content</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Headline */}
          <div>
            <label htmlFor="headline" className="block text-sm font-medium text-gray-700 mb-2">
              Headline *
            </label>
            <input
              type="text"
              id="headline"
              name="headline"
              value={formData.headline}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter AI/ML article headline"
              required
            />
          </div>

          {/* Brief Content */}
          <div>
            <label htmlFor="briefContent" className="block text-sm font-medium text-gray-700 mb-2">
              Brief Content *
            </label>
            <textarea
              id="briefContent"
              name="briefContent"
              value={formData.briefContent}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical"
              placeholder="Enter brief description of the AI/ML development"
              required
            />
          </div>

          {/* Full Content */}
          <div>
            <label htmlFor="fullContent" className="block text-sm font-medium text-gray-700 mb-2">
              Full Content
            </label>
            <textarea
              id="fullContent"
              name="fullContent"
              value={formData.fullContent}
              onChange={handleChange}
              rows={12}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical"
              placeholder="Enter the full article content"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{wordCount} words</span>
              <span>~{Math.ceil(wordCount / 200)} min read</span>
            </div>
          </div>

          {/* Category and Relevance Score */}
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                required
                disabled={loadingCategories}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id || category.name} value={category.name}>
                    {category.displayName || category.name.replace(/_/g, ' ')} ({category.articleCount || 0} articles)
                  </option>
                ))}
              </select>
              {loadingCategories && (
                <p className="text-sm text-gray-500 mt-2 flex items-center">
                  <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mr-2" />
                  Loading categories...
                </p>
              )}
            </div>

            <div>
              <label htmlFor="relevanceScore" className="block text-sm font-medium text-gray-700 mb-2">
                Relevance Score (1-10)
              </label>
              <input
                type="number"
                id="relevanceScore"
                name="relevanceScore"
                value={formData.relevanceScore}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="1"
                max="10"
                step="0.1"
                placeholder="8.5"
              />
            </div>
          </div>

          {/* Featured Image */}
          <div>
            <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image URL
            </label>
            <input
              type="url"
              id="featuredImage"
              name="featuredImage"
              value={formData.featuredImage}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="https://example.com/ai-image.jpg"
            />
            {formData.featuredImage && (
              <div className="mt-2">
                <img
                  src={formData.featuredImage}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-md border"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* AI/ML Specific Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="aiModel" className="block text-sm font-medium text-gray-700 mb-2">
                AI Model
              </label>
              <input
                type="text"
                id="aiModel"
                name="aiModel"
                value={formData.aiModel}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="GPT-5, AlphaFold 3, etc."
              />
            </div>

            <div>
              <label htmlFor="aiApplication" className="block text-sm font-medium text-gray-700 mb-2">
                AI Application
              </label>
              <input
                type="text"
                id="aiApplication"
                name="aiApplication"
                value={formData.aiApplication}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Natural Language Processing, etc."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="companyMentioned" className="block text-sm font-medium text-gray-700 mb-2">
                Company Mentioned
              </label>
              <input
                type="text"
                id="companyMentioned"
                name="companyMentioned"
                value={formData.companyMentioned}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="OpenAI, Google DeepMind, Microsoft, etc."
              />
            </div>

            <div>
              <label htmlFor="technologyType" className="block text-sm font-medium text-gray-700 mb-2">
                Technology Type
              </label>
              <input
                type="text"
                id="technologyType"
                name="technologyType"
                value={formData.technologyType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Large Language Model, Deep Learning, etc."
              />
            </div>
          </div>

          {/* Tags */}
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="ai, gpt, machine-learning, openai"
            />
            <p className="text-sm text-gray-500 mt-1">e.g., ai, ml, nlp, transformer</p>
          </div>

          {/* ⭐ NEW: TimeSaver Auto-Creation Section */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  TimeSaver Auto-Creation
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Automatically create a TimeSaver card for this AI/ML article
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="createTimeSaver"
                  checked={formData.createTimeSaver}
                  onChange={handleChange}
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {formData.createTimeSaver ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>

            {formData.createTimeSaver && (
              <div className="space-y-4 pt-4 border-t border-purple-200">
                <p className="text-xs text-gray-600">
                  💡 Leave fields empty to auto-generate from article content
                </p>

                {/* TimeSaver Title */}
                <div>
                  <label htmlFor="timeSaverTitle" className="block text-sm font-medium text-gray-700 mb-2">
                    TimeSaver Title (Optional)
                  </label>
                  <input
                    type="text"
                    id="timeSaverTitle"
                    name="timeSaverTitle"
                    value={formData.timeSaverTitle}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Auto-generated from headline"
                    maxLength="300"
                  />
                </div>

                {/* TimeSaver Summary */}
                <div>
                  <label htmlFor="timeSaverSummary" className="block text-sm font-medium text-gray-700 mb-2">
                    TimeSaver Summary (Optional)
                  </label>
                  <textarea
                    id="timeSaverSummary"
                    name="timeSaverSummary"
                    value={formData.timeSaverSummary}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical"
                    placeholder="Auto-generated from brief content or AI details"
                    maxLength="300"
                  />
                </div>

                {/* TimeSaver Key Points */}
                <div>
                  <label htmlFor="timeSaverKeyPoints" className="block text-sm font-medium text-gray-700 mb-2">
                    Key Points (Optional)
                  </label>
                  <input
                    type="text"
                    id="timeSaverKeyPoints"
                    name="timeSaverKeyPoints"
                    value={formData.timeSaverKeyPoints}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="AI Model: GPT-4, Company: OpenAI, Application: Text Gen"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Comma-separated key points (auto-generated from AI details if empty)
                  </p>
                </div>

                {/* TimeSaver Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Content Type */}
                  <div>
                    <label htmlFor="timeSaverContentType" className="block text-sm font-medium text-gray-700 mb-2">
                      Content Type
                    </label>
                    <select
                      id="timeSaverContentType"
                      name="timeSaverContentType"
                      value={formData.timeSaverContentType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                    >
                      <option value="AI_ML">AI/ML</option>
                      <option value="DIGEST">Digest</option>
                      <option value="QUICK_UPDATE">Quick Update</option>
                      <option value="BRIEFING">Briefing</option>
                      <option value="SUMMARY">Summary</option>
                      <option value="HIGHLIGHTS">Highlights</option>
                    </select>
                  </div>

                  {/* Icon Name */}
                  <div>
                    <label htmlFor="timeSaverIconName" className="block text-sm font-medium text-gray-700 mb-2">
                      Icon
                    </label>
                    <select
                      id="timeSaverIconName"
                      name="timeSaverIconName"
                      value={formData.timeSaverIconName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                    >
                      <option value="Brain">🧠 Brain (AI)</option>
                      <option value="Cpu">🖥️ CPU</option>
                      <option value="Zap">⚡ Lightning</option>
                      <option value="Sparkles">✨ Sparkles</option>
                      <option value="Rocket">🚀 Rocket</option>
                      <option value="Bot">🤖 Robot</option>
                      <option value="Network">🔗 Network</option>
                      <option value="Code">💻 Code</option>
                    </select>
                  </div>

                  {/* Background Color */}
                  <div>
                    <label htmlFor="timeSaverBgColor" className="block text-sm font-medium text-gray-700 mb-2">
                      Background Color
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="color"
                        id="timeSaverBgColor"
                        name="timeSaverBgColor"
                        value={formData.timeSaverBgColor}
                        onChange={handleChange}
                        className="h-10 w-16 rounded cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.timeSaverBgColor}
                        onChange={(e) => setFormData(prev => ({ ...prev, timeSaverBgColor: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent flex-1"
                        placeholder="#8B5CF6"
                        pattern="^#[0-9A-Fa-f]{6}$"
                      />
                    </div>
                  </div>
                </div>

                {/* Priority Toggle */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="timeSaverIsPriority"
                    name="timeSaverIsPriority"
                    checked={formData.timeSaverIsPriority}
                    onChange={handleChange}
                    className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="timeSaverIsPriority" className="ml-2 text-sm text-gray-700">
                    Mark as Priority TimeSaver (appears at top)
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/ai-ml')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block" />
                  Creating...
                </>
              ) : (
                <>
                  {formData.createTimeSaver ? (
                    <>Create Article + TimeSaver</>
                  ) : (
                    <>Create Article</>
                  )}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAiMlArticle;