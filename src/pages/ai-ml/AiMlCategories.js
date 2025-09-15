
// src/pages/ai-ml/AiMlCategories.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowRight, TrendingUp, Flame } from 'lucide-react';
import { aiMlService } from '../../services/aiMlService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const AiMlCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleCategoryClick = (categoryName) => {
    navigate(`/ai-ml?category=${categoryName}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Brain className="w-8 h-8 mr-3 text-blue-600" />
          AI/ML Categories
        </h1>
        <p className="text-gray-600">Explore AI/ML content by category</p>
      </div>

      {/* Categories */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading categories..." />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Categories Found</h2>
          <p className="text-gray-600">Check back later for AI/ML categories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
              className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                  {category.isHot && (
                    <Flame className="w-5 h-5 text-red-500 ml-2" />
                  )}
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {category.name.replace('_', ' ')}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4">
                {category.description || 'AI/ML content and articles'}
              </p>
              
              <div className="flex items-center justify-between">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AiMlCategories;

