// src/pages/ai-ml/AiMlCategories.js - COMPLETE WITH FULL CATEGORY MANAGEMENT
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowRight, TrendingUp, Flame, Edit3, Trash2, X, Plus } from 'lucide-react';
import { aiMlService } from '../../services/aiMlService';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const AiMlCategories = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    isHot: false
  });

  const canManage = ['EDITOR', 'AD_MANAGER'].includes(user?.role);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await aiMlService.getCategories();
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Fetch categories error:', error);
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      displayName: '',
      description: '',
      isHot: false
    });
    setIsEditing(false);
    setEditingCategory(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (category) => {
    setFormData({
      name: category.name,
      displayName: category.displayName || category.name.replace(/_/g, ' '),
      description: category.description || '',
      isHot: !!category.isHot
    });
    setIsEditing(true);
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      const submitData = {
        name: formData.name.trim(),
        displayName: formData.displayName.trim() || undefined,
        description: formData.description.trim() || undefined,
        isHot: formData.isHot
      };

      if (isEditing) {
        await aiMlService.updateCategory(editingCategory.id, submitData);
        toast.success('Category updated successfully!');
      } else {
        await aiMlService.createCategory(submitData);
        toast.success('Category created successfully!');
      }

      handleCloseModal();
      await fetchCategories();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!window.confirm(`Are you sure you want to delete "${category?.displayName || 'this category'}?" This cannot be undone.`)) {
      return;
    }

    try {
      await aiMlService.deleteCategory(categoryId);
      toast.success('Category deleted successfully!');
      await fetchCategories();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/ai-ml?category=${categoryName}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Brain className="w-8 h-8 mr-3 text-blue-600" />
            AI/ML Categories
          </h1>
          <p className="text-gray-600 mt-1">Explore and manage AI/ML content by category</p>
        </div>
        {canManage && (
          <button
            onClick={handleOpenCreate}
            className="btn-primary flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Category
          </button>
        )}
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading categories..." />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Categories Found</h2>
          <p className="text-gray-600 mb-6">
            {canManage 
              ? 'Create your first category to get started.' 
              : 'Check back later for AI/ML categories.'
            }
          </p>
          {canManage && (
            <button
              onClick={handleOpenCreate}
              className="btn-primary flex items-center mx-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Category
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id || category.name}
              onClick={() => handleCategoryClick(category.name)}
              className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                  {category.isHot && (
                    <Flame className="w-5 h-5 text-red-500 ml-2 animate-pulse" />
                  )}
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {category.displayName || category.name.replace(/_/g, ' ')}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {category.description || 'AI/ML content and articles'}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-blue-600">
                  {category.articleCount || 0} articles
                </span>
                {category.isHot && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Hot
                  </span>
                )}
              </div>

              {/* Management Actions */}
              {canManage && (
                <div className="flex justify-end pt-4 border-t border-gray-200 -mx-6 px-6 pb-4">
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEdit(category);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-105"
                      title="Edit category"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(category.id || category.name);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-105"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Category Management Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditing ? 'Edit Category' : 'Create Category'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmitCategory} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="form-input"
                  placeholder="e.g. LANGUAGE_MODELS"
                  required
                  disabled={isEditing} // Name typically immutable, but allow for flexibility
                />
              </div>

              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name
                </label>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={handleFormChange}
                  className="form-input"
                  placeholder="e.g. Language Models"
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
                  onChange={handleFormChange}
                  rows={3}
                  className="form-textarea"
                  placeholder="Brief description of this category..."
                />
              </div>

              <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <input
                  id="isHot"
                  name="isHot"
                  type="checkbox"
                  checked={formData.isHot}
                  onChange={handleFormChange}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isHot" className="ml-3 block text-sm font-medium text-gray-900">
                  Mark as <span className="text-red-600 font-semibold">Hot</span> (Featured in trending sections)
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t bg-gray-50 rounded-b-lg -mx-6 px-6 pb-4 mt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-outline px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-6 py-2"
                >
                  {isEditing ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiMlCategories;