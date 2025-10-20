// src/components/articles/ArticleForm.js - FIXED
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // ADD THIS IMPORT
import { categoryService } from '../../services/categoryService';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const ArticleForm = ({ initialData = {}, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    headline: '',
    briefContent: '',
    fullContent: '',
    category: '',
    tags: '',
    featuredImage: '',
    priorityLevel: 1,
    metaTitle: '',
    metaDescription: '',
    ...initialData
  });
  
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [imagePreview, setImagePreview] = useState(initialData?.featuredImage || '');
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Calculate word count
    const words = formData.fullContent.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
  }, [formData.fullContent]);

  useEffect(() => {
    // Auto-generate meta title if not set
    if (formData.headline && !formData.metaTitle) {
      setFormData(prev => ({
        ...prev,
        metaTitle: formData.headline.substring(0, 60)
      }));
    }
  }, [formData.headline]);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await categoryService.getCategories();
      console.log('Fetched categories:', response.data);
      
      const categoriesData = response.data || [];
      
      if (Array.isArray(categoriesData) && categoriesData.length > 0) {
        // Filter only active categories
        const activeCategories = categoriesData.filter(cat => cat.isActive !== false);
        setCategories(activeCategories);
      } else {
        console.warn('No categories found, you may need to create categories first');
        setCategories([]);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Failed to load categories. Please try again.');
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? (value === '' ? '' : parseInt(value, 10)) : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
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
    if (!formData.headline.trim()) {
      toast.error('Headline is required');
      return;
    }
    
    if (formData.headline.length < 10) {
      toast.error('Headline must be at least 10 characters');
      return;
    }
    
    if (!formData.briefContent.trim()) {
      toast.error('Brief content is required');
      return;
    }
    
    if (formData.briefContent.length < 50) {
      toast.error('Brief content must be at least 50 characters');
      return;
    }
    
    if (!formData.fullContent.trim()) {
      toast.error('Full content is required');
      return;
    }
    
    if (formData.fullContent.length < 100) {
      toast.error('Full content must be at least 100 characters');
      return;
    }
    
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }

    // Process data for submission
    const processedData = {
      headline: formData.headline.trim(),
      briefContent: formData.briefContent.trim(),
      fullContent: formData.fullContent.trim(),
      category: formData.category.toUpperCase(), // Backend expects uppercase
      tags: formData.tags.trim(),
      featuredImage: formData.featuredImage.trim(),
      priorityLevel: parseInt(formData.priorityLevel, 10),
      metaTitle: formData.metaTitle.trim() || formData.headline.trim(),
      metaDescription: formData.metaDescription.trim() || formData.briefContent.trim().substring(0, 160)
    };

    console.log('ArticleForm: Submitting data:', processedData);
    onSubmit(processedData);
  };

  if (loadingCategories) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner text="Loading form..." />
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">
          No Categories Available
        </h3>
        <p className="text-yellow-700 mb-4">
          You need to create at least one category before creating articles.
        </p>
        {/* FIXED: Changed from <a> to <Link> */}
        <Link
          to="/categories/create"
          className="btn-primary inline-block"
        >
          Create Category
        </Link>
      </div>
    );
  }

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
          className="form-input"
          placeholder="Enter article headline"
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
          Brief Content *
        </label>
        <textarea
          id="briefContent"
          name="briefContent"
          value={formData.briefContent}
          onChange={handleChange}
          rows={3}
          className="form-textarea"
          placeholder="Enter a brief description (50-300 characters)"
          maxLength="300"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.briefContent.length}/300 characters (minimum 50)
        </p>
      </div>

      {/* Full Content */}
      <div>
        <label htmlFor="fullContent" className="block text-sm font-medium text-gray-700 mb-2">
          Full Content *
        </label>
        <textarea
          id="fullContent"
          name="fullContent"
          value={formData.fullContent}
          onChange={handleChange}
          rows={15}
          className="form-textarea"
          placeholder="Enter the complete article content"
          required
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{wordCount} words</span>
          <span>~{Math.ceil(wordCount / 200)} min read</span>
        </div>
      </div>

      {/* Category and Priority Grid */}
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
              <option key={category.id} value={category.name}>
                {category.displayName || category.name}
              </option>
            ))}
          </select>
          {categories.length === 0 && (
            <p className="text-xs text-red-500 mt-1">
              No categories available. Please create one first.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="priorityLevel" className="block text-sm font-medium text-gray-700 mb-2">
            Priority Level
          </label>
          <select
            id="priorityLevel"
            name="priorityLevel"
            value={formData.priorityLevel}
            onChange={handleChange}
            className="form-select"
          >
            <option value={1}>Low Priority</option>
            <option value={3}>Medium Priority</option>
            <option value={5}>High Priority (Featured)</option>
            <option value={8}>Very High Priority</option>
            <option value={10}>Critical (Breaking News)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Higher priority articles appear first
          </p>
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
          className="form-input"
          placeholder="technology, innovation, AI, news"
        />
        <p className="text-sm text-gray-500 mt-1">
          Comma-separated tags (e.g., tech, news, ai)
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
          className="form-input"
          placeholder="https://example.com/image.jpg"
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

      {/* SEO Section */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">SEO Settings (Optional)</h3>
        
        <div>
          <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-2">
            Meta Title
          </label>
          <input
            type="text"
            id="metaTitle"
            name="metaTitle"
            value={formData.metaTitle}
            onChange={handleChange}
            className="form-input"
            placeholder="SEO-friendly title (auto-generated from headline)"
            maxLength="60"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.metaTitle.length}/60 characters
          </p>
        </div>

        <div>
          <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Meta Description
          </label>
          <textarea
            id="metaDescription"
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
            rows={2}
            className="form-textarea"
            placeholder="SEO description (auto-generated from brief content)"
            maxLength="160"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.metaDescription.length}/160 characters
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => window.history.back()}
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
          {loading ? (
            <span className="flex items-center">
              <LoadingSpinner size="sm" />
              <span className="ml-2">Saving...</span>
            </span>
          ) : (
            'Save Article'
          )}
        </button>
      </div>
    </form>
  );
};

export default ArticleForm;