 

// src/components/articles/ArticleForm.js
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

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data.filter(cat => cat.isActive));
    } catch (error) {
      toast.error('Failed to fetch categories');
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

    onSubmit(formData);
  };

  if (loadingCategories) {
    return <LoadingSpinner text="Loading form..." />;
  }

  return (
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
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
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
