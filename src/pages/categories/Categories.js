// src/pages/categories/Categories.js - UPDATED
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderOpen, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { categoryService } from '../../services/categoryService';
import SearchBox from '../../components/common/SearchBox';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, categoryId: null });
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [showInactive]);

  useEffect(() => {
    if (searchQuery) {
      setFilteredCategories(
        categories.filter(category =>
          category.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredCategories(categories);
    }
  }, [categories, searchQuery]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getCategories(showInactive);
      setCategories(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch categories');
      console.error('Fetch categories error:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleEdit = (categoryId) => {
    navigate(`/categories/${categoryId}/edit`);
  };

  const handleDelete = async () => {
    try {
      await categoryService.deleteCategory(deleteDialog.categoryId);
      toast.success('Category deleted successfully');
      setDeleteDialog({ open: false, categoryId: null });
      fetchCategories();
    } catch (error) {
      const errorMessage = error.message || 'Failed to delete category';
      toast.error(errorMessage);
    }
  };

  const handleToggleStatus = async (categoryId) => {
    try {
      await categoryService.toggleCategoryStatus(categoryId);
      toast.success('Category status updated');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to update category status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage article categories</p>
        </div>
        <button
          onClick={() => navigate('/categories/create')}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Category
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-md">
            <SearchBox
              placeholder="Search categories..."
              onSearch={handleSearch}
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowInactive(!showInactive)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                showInactive
                  ? 'bg-gray-200 text-gray-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {showInactive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span className="text-sm">
                {showInactive ? 'Showing All' : 'Active Only'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading categories..." />
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Categories Found</h2>
          <p className="text-gray-600 mb-4">
            {searchQuery
              ? 'Try adjusting your search to find categories.'
              : 'Get started by creating your first category.'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => navigate('/categories/create')}
              className="btn-primary"
            >
              Create Category
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div key={category.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3 flex-1">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ 
                      backgroundColor: `${category.color || '#3B82F6'}20`
                    }}
                  >
                    {category.iconUrl ? (
                      <img 
                        src={category.iconUrl} 
                        alt={category.displayName}
                        className="w-6 h-6"
                      />
                    ) : (
                      <FolderOpen 
                        className="w-5 h-5" 
                        style={{ color: category.color || '#3B82F6' }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {category.displayName || category.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span 
                        className={`text-xs px-2 py-1 rounded-full ${
                          category.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-xs text-gray-500">
                        #{category.sortOrder || 0}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-1 flex-shrink-0 ml-2">
                  <button
                    onClick={() => handleToggleStatus(category.id)}
                    className={`p-1.5 rounded hover:bg-gray-100 ${
                      category.isActive ? 'text-green-600' : 'text-gray-400'
                    }`}
                    title={category.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {category.isActive ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(category.id)}
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1.5 rounded"
                    title="Edit Category"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteDialog({ open: true, categoryId: category.id })}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1.5 rounded"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {category.description || 'No description available'}
              </p>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-900">
                    {category.articleCount || 0}
                  </span> articles
                </div>
                <div className="text-xs text-gray-400">
                  {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {!loading && filteredCategories.length > 0 && (
        <div className="card bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {categories.length}
              </div>
              <div className="text-sm text-gray-600">Total Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {categories.filter(c => c.isActive).length}
              </div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">
                {categories.filter(c => !c.isActive).length}
              </div>
              <div className="text-sm text-gray-600">Inactive</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-600">
                {categories.reduce((sum, cat) => sum + (cat.articleCount || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Articles</div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, categoryId: null })}
        onConfirm={handleDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone. Make sure there are no articles in this category."
        type="danger"
      />
    </div>
  );
};

export default Categories;