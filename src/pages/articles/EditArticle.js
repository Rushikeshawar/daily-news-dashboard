// src/pages/articles/EditArticle.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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
      const response = await articleService.getArticle(id);
      console.log('Edit article response:', response.data);
      setArticle(response.data);
    } catch (error) {
      toast.error('Failed to fetch article');
      navigate('/articles');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      await articleService.updateArticle(id, formData);
      toast.success('Article updated successfully!');
      navigate('/articles');
    } catch (error) {
      toast.error('Failed to update article');
      console.error('Update article error:', error);
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

  // Convert article data to the format expected by ArticleForm
  const getFormInitialData = () => {
    if (!article) return {};

    // Handle tags conversion: backend string -> frontend string
    let tagsString = '';
    if (article.tags) {
      if (Array.isArray(article.tags)) {
        tagsString = article.tags.join(', ');
      } else if (typeof article.tags === 'string') {
        tagsString = article.tags;
      }
    }

    return {
      headline: article.headline || '',
      briefContent: article.briefContent || '',
      fullContent: article.fullContent || '',
      category: article.category || '',
      tags: tagsString,
      featuredImage: article.featuredImage || '',
      priorityLevel: article.priorityLevel || 1
    };
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Article</h1>
          <p className="text-gray-600">Update your article</p>
        </div>
      </div>

      <div className="card">
        <ArticleForm 
          initialData={getFormInitialData()}
          onSubmit={handleSubmit} 
          loading={saving} 
        />
      </div>
    </div>
  );
};

export default EditArticle;