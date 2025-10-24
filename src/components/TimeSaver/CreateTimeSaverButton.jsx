// src/components/TimeSaver/CreateTimeSaverButton.jsx
// ADD THIS TO YOUR ARTICLE PAGES TO CREATE TIME SAVER CONTENT

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

/**
 * Button component to create Time Saver content from an article
 * Usage: <CreateTimeSaverButton articleId={article.id} articleType="regular" />
 */
const CreateTimeSaverButton = ({ 
  articleId, 
  articleType = 'regular', // 'regular' or 'ai'
  className = '',
  variant = 'primary' // 'primary', 'secondary', 'outline'
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const canCreate = ['EDITOR', 'AD_MANAGER'].includes(user?.role);

  const handleCreateTimeSaver = () => {
    if (!canCreate) {
      toast.error('You do not have permission to create Time Saver content');
      return;
    }

    // Navigate to create Time Saver page with article ID
    const params = new URLSearchParams();
    
    if (articleType === 'ai') {
      params.append('aiArticleId', articleId);
    } else {
      params.append('articleId', articleId);
    }

    navigate(`/time-saver/create?${params.toString()}`);
  };

  // Don't show button if user doesn't have permission
  if (!canCreate) {
    return null;
  }

  // Button variants
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
  };

  return (
    <button
      onClick={handleCreateTimeSaver}
      className={`
        flex items-center px-4 py-2 rounded-lg font-medium transition-colors
        ${variants[variant]}
        ${className}
      `}
      title="Create Time Saver content from this article"
    >
      <Clock className="w-4 h-4 mr-2" />
      <span>Create Time Saver</span>
    </button>
  );
};

export default CreateTimeSaverButton;


// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * Example 1: Add to Regular Article Page
 */
// In your ArticleDetail.jsx or similar component:
/*
import CreateTimeSaverButton from '../../components/TimeSaver/CreateTimeSaverButton';

const ArticleDetail = () => {
  const { article } = useArticle(); // Your article hook

  return (
    <div>
      <h1>{article.headline}</h1>
      
      // Add the button
      <CreateTimeSaverButton 
        articleId={article.id}
        articleType="regular"
        variant="outline"
      />
      
      <div>{article.content}</div>
    </div>
  );
};
*/

/**
 * Example 2: Add to AI Article Page
 */
// In your AIArticleDetail.jsx or similar component:
/*
import CreateTimeSaverButton from '../../components/TimeSaver/CreateTimeSaverButton';

const AIArticleDetail = () => {
  const { article } = useAIArticle(); // Your AI article hook

  return (
    <div>
      <h1>{article.headline}</h1>
      
      // Add the button for AI article
      <CreateTimeSaverButton 
        articleId={article.id}
        articleType="ai"
        variant="primary"
      />
      
      <div>{article.content}</div>
    </div>
  );
};
*/

/**
 * Example 3: Add to Article List with Small Button
 */
// In your ArticleList.jsx or similar component:
/*
import CreateTimeSaverButton from '../../components/TimeSaver/CreateTimeSaverButton';

const ArticleList = ({ articles }) => {
  return (
    <div>
      {articles.map(article => (
        <div key={article.id} className="article-card">
          <h3>{article.headline}</h3>
          <p>{article.summary}</p>
          
          <div className="flex space-x-2">
            <button>Read More</button>
            
            // Small button in list
            <CreateTimeSaverButton 
              articleId={article.id}
              variant="outline"
              className="text-sm px-3 py-1"
            />
          </div>
        </div>
      ))}
    </div>
  );
};
*/

/**
 * Example 4: Add to Article Actions Menu
 */
// In your article component with action buttons:
/*
<div className="article-actions flex space-x-3">
  <button className="btn-primary">Share</button>
  <button className="btn-secondary">Bookmark</button>
  
  // Add Time Saver button to actions
  <CreateTimeSaverButton 
    articleId={article.id}
    articleType="regular"
    variant="secondary"
  />
</div>
*/