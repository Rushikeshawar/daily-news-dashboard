// src/pages/articles/CreateArticle.js - COMPLETE
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { articleService } from '../../services/articleService';
import ArticleForm from '../../components/articles/ArticleForm';
import toast from 'react-hot-toast';

const CreateArticle = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      console.log('CreateArticle: Submitting to API:', formData);
      
      const response = await articleService.createArticle(formData);
      
      console.log('CreateArticle: API Response:', response);
      
      if (response.success || response.data) {
        toast.success('Article created successfully! It will be reviewed before publication.');
        navigate('/articles');
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Create article error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create article';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/articles')}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          disabled={loading}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Article</h1>
            <p className="text-gray-600">Write and publish a new article</p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="text-blue-600 text-xl">ℹ️</div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-blue-900">Article Submission Guidelines</h4>
            <ul className="mt-2 text-sm text-blue-700 space-y-1">
              <li>• Articles must have a minimum of 100 words</li>
              <li>• Select an appropriate category for your article</li>
              <li>• Your article will be reviewed before publication</li>
              <li>• Use high-quality images and proper formatting</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="card">
        <ArticleForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
};

export default CreateArticle;