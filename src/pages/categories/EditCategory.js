// src/pages/categories/EditCategory.js - UPDATED
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ToggleLeft, ToggleRight } from 'lucide-react';
import { categoryService } from '../../services/categoryService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const EditCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    description: '',
    color: '#3B82F6',
    iconUrl: '',
    sortOrder: 0,
    isActive: true
  });

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      const response = await categoryService.getCategory(id);
      const categoryData = response.data;
      
      if (!categoryData) {
        toast.error('Category not found');
        navigate('/categories');
        return;
      }
      
      setCategory(categoryData);
      setFormData({
        displayName: categoryData.displayName || '',
        description: categoryData.description || '',
        color: categoryData.color || '#3B82F6',
        iconUrl: categoryData.iconUrl || '',
        sortOrder: categoryData.sortOrder || 0,
        isActive: categoryData.isActive !== undefined ? categoryData.isActive : true
      });
    } catch (error) {
      toast.error('Failed to fetch category');
      navigate('/categories');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleToggleStatus = async () => {
    try {
      await categoryService.toggleCategoryStatus(id);
      toast.success(`Category ${formData.isActive ? 'deactivated' : 'activated'} successfully!`);
      setFormData(prev => ({ ...prev, isActive: !prev.isActive }));
    } catch (error) {
      toast.error('Failed to toggle category status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.displayName.trim()) {
      toast.error('Display name is required');
      return;
    }

    try {
      setSaving(true);
      const result = await categoryService.updateCategory(id, formData);
      
      if (result.success) {
        toast.success('Category updated successfully!');
        navigate('/categories');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update category';
      toast.error(errorMessage);
      console.error('Update category error:', error);
    } finally {
      setSaving(false);
    }
  };

  const colorPresets = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Yellow', value: '#F59E0B' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Indigo', value: '#6366F1' },
    { name: 'Cyan', value: '#06B6D4' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading category..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/categories')}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
            <p className="text-gray-600">Update category information</p>
          </div>
        </div>
        
        <button
          onClick={handleToggleStatus}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
            formData.isActive
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {formData.isActive ? (
            <>
              <ToggleRight className="w-5 h-5" />
              <span>Active</span>
            </>
          ) : (
            <>
              <ToggleLeft className="w-5 h-5" />
              <span>Inactive</span>
            </>
          )}
        </button>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="text-blue-600">ℹ️</div>
              <div>
                <h4 className="text-sm font-medium text-blue-900">Category System Name</h4>
                <p className="text-sm text-blue-700 mt-1">
                  <strong>{category?.name}</strong> - This cannot be changed after creation
                </p>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
              Display Name *
            </label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Technology"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="form-textarea"
              placeholder="Enter category description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="h-10 w-20 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="form-input flex-1"
                  placeholder="#3B82F6"
                />
              </div>
              
              <div className="mt-3 flex flex-wrap gap-2">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color: preset.value }))}
                    className="w-8 h-8 rounded border-2 hover:scale-110 transition-transform"
                    style={{ 
                      backgroundColor: preset.value,
                      borderColor: formData.color === preset.value ? '#000' : 'transparent'
                    }}
                    title={preset.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-2">
                Sort Order
              </label>
              <input
                type="number"
                id="sortOrder"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleChange}
                className="form-input"
                min="0"
              />
              <p className="mt-1 text-xs text-gray-500">
                Lower numbers appear first
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="iconUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Icon URL (Optional)
            </label>
            <input
              type="url"
              id="iconUrl"
              name="iconUrl"
              value={formData.iconUrl}
              onChange={handleChange}
              className="form-input"
              placeholder="https://example.com/icon.png"
            />
          </div>

          {/* Preview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Preview</h3>
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${formData.color}20` }}
              >
                <span style={{ color: formData.color }}>●</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  {formData.displayName}
                </div>
                <div className="text-sm text-gray-600">
                  {formData.description || 'No description'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Category Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <strong>Created:</strong> {category?.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}
              </div>
              <div>
                <strong>Articles:</strong> {category?.articleCount || 0}
              </div>
              <div>
                <strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  formData.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {formData.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/categories')}
              className="btn-outline"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Updating...' : 'Update Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategory;