// src/components/aiml/AiMlArticleForm.jsx - CORRECTED FORM COMPONENT

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../common/LoadingSpinner';

const AiMlArticleForm = ({ initialData, onSubmit, loading }) => {
  const [imagePreview, setImagePreview] = useState(initialData?.featuredImage || '');
  
  const [formData, setFormData] = useState({
    headline: initialData?.headline || '',
    briefContent: initialData?.briefContent || '',
    fullContent: initialData?.fullContent || '',
    category: initialData?.category || '',
    featuredImage: initialData?.featuredImage || '',
    tags: initialData?.tags || '',
    aiModel: initialData?.aiModel || '',
    aiApplication: initialData?.aiApplication || '',
    companyMentioned: initialData?.companyMentioned || '',
    technologyType: initialData?.technologyType || '',
    relevanceScore: initialData?.relevanceScore || '',
    isTrending: initialData?.isTrending || false,
    
    // ⭐ NEW: TimeSaver auto-creation fields
    createTimeSaver: true, // Auto-create by default
    timeSaverTitle: '',
    timeSaverSummary: '',
    timeSaverKeyPoints: '',
    timeSaverContentType: 'AI_ML',
    timeSaverIconName: 'Brain',
    timeSaverBgColor: '#8B5CF6', // Purple for AI
    timeSaverIsPriority: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, featuredImage: url }));
    setImagePreview(url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.headline) {
      toast.error('Headline is required');
      return;
    }

    if (!formData.category) {
      toast.error('Category is required');
      return;
    }

    // Prepare data for submission
    const submitData = {
      ...formData,
      relevanceScore: formData.relevanceScore ? parseFloat(formData.relevanceScore) : null,
      // Convert timeSaverKeyPoints string to array if provided
      timeSaverKeyPoints: formData.timeSaverKeyPoints 
        ? formData.timeSaverKeyPoints.split(',').map(point => point.trim()).filter(Boolean)
        : []
    };

    console.log('Submitting AI/ML article with TimeSaver options:', submitData);
    onSubmit(submitData);
  };

  const wordCount = formData.fullContent.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
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
          maxLength="500"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.headline.length}/500 characters
        </p>
      </div>

      {/* Brief Content */}
      <div>
        <label htmlFor="briefContent" className="block text-sm font-medium text-gray-700 mb-2">
          Brief Content
        </label>
        <textarea
          id="briefContent"
          name="briefContent"
          value={formData.briefContent}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical"
          placeholder="Enter a brief description"
          maxLength="500"
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.briefContent.length}/500 characters
        </p>
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
          rows={15}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical"
          placeholder="Enter the complete article content"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{wordCount} words</span>
          <span>~{Math.ceil(wordCount / 200)} min read</span>
        </div>
      </div>

      {/* AI/ML Specific Fields Grid */}
      <div className="bg-purple-50 p-4 rounded-lg space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center">
          <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          AI/ML Specific Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category */}
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
            >
              <option value="">Select category</option>
              <option value="MACHINE_LEARNING">Machine Learning</option>
              <option value="DEEP_LEARNING">Deep Learning</option>
              <option value="NLP">Natural Language Processing</option>
              <option value="COMPUTER_VISION">Computer Vision</option>
              <option value="ROBOTICS">Robotics</option>
              <option value="GENERATIVE_AI">Generative AI</option>
              <option value="AI_ETHICS">AI Ethics</option>
              <option value="AI_RESEARCH">AI Research</option>
              <option value="AI_INDUSTRY">AI Industry</option>
            </select>
          </div>

          {/* AI Model */}
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
              placeholder="e.g., GPT-4, Claude, Llama"
            />
          </div>

          {/* AI Application */}
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
              placeholder="e.g., Text Generation, Image Recognition"
            />
          </div>

          {/* Company Mentioned */}
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
              placeholder="e.g., OpenAI, Google, Anthropic"
            />
          </div>

          {/* Technology Type */}
          <div>
            <label htmlFor="technologyType" className="block text-sm font-medium text-gray-700 mb-2">
              Technology Type
            </label>
            <select
              id="technologyType"
              name="technologyType"
              value={formData.technologyType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            >
              <option value="">Select type</option>
              <option value="LLM">Large Language Model</option>
              <option value="CNN">Convolutional Neural Network</option>
              <option value="RNN">Recurrent Neural Network</option>
              <option value="TRANSFORMER">Transformer</option>
              <option value="GAN">Generative Adversarial Network</option>
              <option value="DIFFUSION">Diffusion Model</option>
              <option value="REINFORCEMENT_LEARNING">Reinforcement Learning</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Relevance Score */}
          <div>
            <label htmlFor="relevanceScore" className="block text-sm font-medium text-gray-700 mb-2">
              Relevance Score (0-10)
            </label>
            <input
              type="number"
              id="relevanceScore"
              name="relevanceScore"
              value={formData.relevanceScore}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="8.5"
              min="0"
              max="10"
              step="0.1"
            />
          </div>
        </div>

        {/* Trending Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isTrending"
            name="isTrending"
            checked={formData.isTrending}
            onChange={handleChange}
            className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
          />
          <label htmlFor="isTrending" className="ml-2 text-sm text-gray-700">
            Mark as Trending 🔥
          </label>
        </div>
      </div>

      {/* Tags */}
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="AI, machine learning, GPT, neural networks"
        />
        <p className="text-sm text-gray-500 mt-1">
          Comma-separated tags
        </p>
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
          onChange={handleImageUrlChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="https://example.com/ai-image.jpg"
        />
        {imagePreview && (
          <div className="mt-3">
            <p className="text-xs text-gray-600 mb-2">Preview:</p>
            <img
              src={imagePreview}
              alt="Featured preview"
              className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200"
              onError={(e) => {
                e.target.style.display = 'none';
                toast.error('Invalid image URL');
              }}
              onLoad={() => {
                toast.success('Image loaded successfully');
              }}
            />
          </div>
        )}
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

      {/* Submit Button */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center">
              <LoadingSpinner size="sm" />
              <span className="ml-2">Saving...</span>
            </span>
          ) : (
            <>
              {formData.createTimeSaver ? (
                <>Save AI/ML Article + Create TimeSaver</>
              ) : (
                <>Save AI/ML Article</>
              )}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AiMlArticleForm;