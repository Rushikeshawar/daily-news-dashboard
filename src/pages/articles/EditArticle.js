// src/pages/articles/EditArticle.js - COMPLETE
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { articleService } from '../../services/articleService';
import ArticleForm from '../../components/articles/ArticleForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const EditArticle = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await articleService.getArticle(id);
      const articleData = response.data?.article || response.data;
      
      if (!articleData) {
        toast.error('Article not found');
        navigate('/articles');
        return;
      }
      
      setArticle(articleData);
    } catch (error) {
      console.error('Fetch article error:', error);
      toast.error('Failed to load article');
      navigate('/articles');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      console.log('EditArticle: Updating article:', formData);
      
      const response = await articleService.updateArticle(id, formData);
      
      console.log('EditArticle: API Response:', response);
      
      if (response.success || response.data) {
        toast.success('Article updated successfully!');
        navigate(`/articles/${id}`);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Update article error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update article';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading article..." />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Article not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/articles')}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          disabled={saving}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Article</h1>
            <p className="text-gray-600">Update article information</p>
          </div>
        </div>
      </div>

      {/* Article Status Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Status:</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
              article.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
              article.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
              article.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
              article.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
              'bg-red-100 text-red-800'
            }`}>
              {article.status}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Views:</span>
            <span className="ml-2 font-semibold">{article.viewCount || 0}</span>
          </div>
          <div>
            <span className="text-gray-600">Created:</span>
            <span className="ml-2">{new Date(article.createdAt).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-gray-600">Author:</span>
            <span className="ml-2">{article.author?.fullName || 'Unknown'}</span>
          </div>
        </div>
      </div>

      {/* Warning for Published Articles */}
      {article.status === 'PUBLISHED' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="text-yellow-600 text-xl">⚠️</div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-yellow-900">Editing Published Article</h4>
              <p className="mt-1 text-sm text-yellow-700">
                This article is currently published. Changes will be visible immediately after saving.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form Card */}
      <div className="card">
        <ArticleForm 
          initialData={{
            headline: article.headline || '',
            briefContent: article.briefContent || '',
            fullContent: article.fullContent || '',
            category: article.category || '',
            tags: article.tags || '',
            featuredImage: article.featuredImage || '',
            priorityLevel: article.priorityLevel || 1,
            metaTitle: article.metaTitle || '',
            metaDescription: article.metaDescription || ''
          }}
          onSubmit={handleSubmit} 
          loading={saving} 
        />
      </div>
    </div>
  );
};

export default EditArticle;
