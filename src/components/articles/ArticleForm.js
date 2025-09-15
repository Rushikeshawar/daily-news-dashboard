// src/components/articles/ArticleForm.js - UPDATED WITH FIXED CATEGORIES
import React, { useState, useEffect } from 'react';
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
    ...initialData
  });
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Default categories that match your backend
  const defaultCategories = [
    { id: '1', name: 'Technology', isActive: true },
    { id: '2', name: 'Business', isActive: true },
    { id: '3', name: 'Sports', isActive: true },
    { id: '4', name: 'Politics', isActive: true },
    { id: '5', name: 'Entertainment', isActive: true },
    { id: '6', name: 'Science', isActive: true },
    { id: '7', name: 'Health', isActive: true },
    { id: '8', name: 'Travel', isActive: true },
    { id: '9', name: 'Education', isActive: true }
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      console.log('ArticleForm: Fetching categories...');
      const response = await categoryService.getCategories();
      console.log('ArticleForm: Categories response:', response.data);
      
      const categoriesData = response.data;
      if (categoriesData && Array.isArray(categoriesData) && categoriesData.length > 0) {
        const activeCategories = categoriesData.filter(cat => cat.isActive !== false);
        setCategories(activeCategories);
        console.log('ArticleForm: Using API categories:', activeCategories);
      } else {
        console.log('ArticleForm: API returned empty/invalid data, using defaults');
        setCategories(defaultCategories);
      }
    } catch (error) {
      console.error('ArticleForm: Failed to fetch categories:', error);
      toast.error('Failed to fetch categories - using defaults');
      setCategories(defaultCategories);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.headline.trim()) {
      toast.error('Headline is required');
      return;
    }
    
    if (!formData.briefContent.trim()) {
      toast.error('Brief content is required');
      return;
    }
    
    if (!formData.fullContent.trim()) {
      toast.error('Full content is required');
      return;
    }
    
    if (!formData.category) {
      toast.error('Category is required');
      return;
    }

    // Process tags - split by comma and clean up
    const processedData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
    };

    console.log('ArticleForm: Submitting data:', processedData);
    onSubmit(processedData);
  };

  if (loadingCategories) {
    return <LoadingSpinner text="Loading form..." />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Debug Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
        <strong>Form Debug:</strong> Categories loaded: {categories.length}, Selected category: "{formData.category}"
        <div className="mt-1">
          Available categories: {categories.map(cat => cat.name).join(', ')}
        </div>
      </div>

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
          placeholder="Enter brief description of the article"
          required
        />
      </div>

      <div>
        <label htmlFor="fullContent" className="block text-sm font-medium text-gray-700 mb-2">
          Full Content *
        </label>
        <textarea
          id="fullContent"
          name="fullContent"
          value={formData.fullContent}
          onChange={handleChange}
          rows={12}
          className="form-textarea"
          placeholder="Enter the full article content"
          required
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
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id || category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          {categories.length === 0 && (
            <p className="text-sm text-red-500 mt-1">
              No categories available. Please contact admin.
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
            <option value={1}>Low</option>
            <option value={3}>Medium</option>
            <option value={5}>High</option>
          </select>
        </div>
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
          placeholder="Enter tags separated by commas"
        />
        <p className="text-sm text-gray-500 mt-1">Separate multiple tags with commas</p>
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
          placeholder="https://example.com/image.jpg"
        />
        {formData.featuredImage && (
          <div className="mt-2">
            <img
              src={formData.featuredImage}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-md"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Saving...' : 'Save Article'}
        </button>
      </div>
    </form>
  );
};

export default ArticleForm;