// src/pages/articles/CreateArticle.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { articleService } from '../../services/articleService';
import ArticleForm from '../../components/articles/ArticleForm';
import toast from 'react-hot-toast';

const CreateArticle = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await articleService.createArticle(formData);
      toast.success('Article created successfully! It will be reviewed before publication.');
      navigate('/articles');
    } catch (error) {
      toast.error(error.message || 'Failed to create article');
      console.error('Create article error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/articles')}
          className="p-2 hover:bg-gray-100 rounded-md"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Article</h1>
          <p className="text-gray-600">Write a new article for publication</p>
        </div>
      </div>

      <div className="card">
        <ArticleForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
};

export default CreateArticle;