// src/pages/ai-ml/CreateAiMlArticle.js - UPDATED WITH DYNAMIC CATEGORIES
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
    relevanceScore: ''
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
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value
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
        relevanceScore: formData.relevanceScore ? parseFloat(formData.relevanceScore) : null
      };

      console.log('Creating AI/ML article with data:', processedData);

      await aiMlService.createArticle(processedData);
      toast.success('AI/ML article created successfully!');
      navigate('/ai-ml');
    } catch (error) {
      toast.error(error.message || 'Failed to create AI/ML article');
      console.error('Create AI/ML article error:', error);
    } finally {
      setLoading(false);
    }
  };

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
              className="form-input"
              placeholder="Enter AI/ML article headline"
              required
            />
          </div>

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
              className="form-textarea"
              placeholder="Enter brief description of the AI/ML development"
              required
            />
          </div>

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
              className="form-textarea"
              placeholder="Enter the full article content"
            />
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
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2" />
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
                className="form-input"
                min="1"
                max="10"
                step="0.1"
                placeholder="8.5"
              />
            </div>
          </div>

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
              className="form-input"
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
                className="form-input"
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
                className="form-input"
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
                className="form-input"
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
                className="form-input"
                placeholder="Large Language Model, Deep Learning, etc."
              />
            </div>
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
              placeholder="ai, gpt, machine-learning, openai"
            />
            <p className="text-sm text-gray-500 mt-1">e.g., ai, ml, nlp, transformer</p>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/ai-ml')}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block" />
                  Creating...
                </>
              ) : (
                'Create Article'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAiMlArticle;