 
// src/components/articles/ArticleCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Eye, Edit, Trash2, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ArticleCard = ({ article, onEdit, onDelete, onApprove, onReject, showActions = true }) => {
  const { user } = useAuth();
  
  const canEdit = user?.role === 'ADMIN' || user?.role === 'AD_MANAGER' || article.authorId === user?.id;
  const canApprove = (user?.role === 'AD_MANAGER' || user?.role === 'ADMIN') && article.status === 'PENDING';

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: 'status-badge status-pending',
      APPROVED: 'status-badge status-approved',
      REJECTED: 'status-badge status-rejected'
    };
    return badges[status] || 'status-badge';
  };

  return (
    <div className="article-card">
      {article.featuredImage && (
        <div className="article-card-image-container">
          <img
            src={article.featuredImage}
            alt={article.headline}
            className="article-card-image"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className={getStatusBadge(article.status)}>
            {article.status}
          </span>
          <span className="text-sm text-gray-500">{article.category}</span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          <Link to={`/articles/${article.id}`} className="hover:text-blue-600">
            {article.headline}
          </Link>
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.summary || article.briefContent}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              <span>{article.author?.fullName}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              <span>{article.viewCount || 0}</span>
            </div>
          </div>
        </div>
        
        {showActions && (
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {canEdit && (
                <button
                  onClick={() => onEdit(article.id)}
                  className="text-blue-600 hover:text-blue-800 p-1"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
              {(canEdit || user?.role === 'ADMIN') && (
                <button
                  onClick={() => onDelete(article.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {canApprove && (
              <div className="flex space-x-2">
                <button
                  onClick={() => onApprove(article.id)}
                  className="text-green-600 hover:text-green-800 p-1"
                  title="Approve"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onReject(article.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Reject"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleCard;
