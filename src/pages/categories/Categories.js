 
// src/pages/categories/Categories.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderOpen, Edit, Trash2 } from 'lucide-react';
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

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredCategories(
        categories.filter(category =>
          category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      const response = await categoryService.getCategories();
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
      console.error('Fetch categories error:', error);
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
      toast.error('Failed to delete category');
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

      {/* Search */}
      <div className="card">
        <div className="max-w-md">
          <SearchBox
            placeholder="Search categories..."
            onSearch={handleSearch}
          />
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
          <button
            onClick={() => navigate('/categories/create')}
            className="btn-primary"
          >
            Create Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div key={category.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FolderOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {category.name}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      category.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(category.id)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Edit Category"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteDialog({ open: true, categoryId: category.id })}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">
                {category.description || 'No description available'}
              </p>
              
              <div className="text-sm text-gray-500">
                <span className="font-medium">{category.articleCount || 0}</span> articles
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, categoryId: null })}
        onConfirm={handleDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        type="danger"
      />
    </div>
  );
};

export default Categories;