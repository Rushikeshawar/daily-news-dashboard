// src/components/articles/ArticleCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Eye, Edit, Trash2, Check, X, Tag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ArticleCard = ({ 
  article, 
  onEdit, 
  onDelete, 
  onApprove, 
  onReject 
}) => {
  const { user } = useAuth();

  if (!article) {
    return null;
  }

  const canEdit = user?.role === 'ADMIN' || user?.role === 'AD_MANAGER' || article?.authorId === user?.id;
  const canApprove = (user?.role === 'AD_MANAGER' || user?.role === 'ADMIN') && article?.status === 'PENDING';
  const canDelete = canEdit || user?.role === 'ADMIN';

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      PUBLISHED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      DRAFT: 'bg-gray-100 text-gray-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const truncateText = (text, maxLength = 120) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="card group hover:shadow-lg transition-shadow duration-200">
      {/* Featured Image */}
      {article.featuredImage && (
        <div className="mb-4">
          <img
            src={article.featuredImage}
            alt={article.headline}
            className="w-full h-48 object-cover rounded-lg"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Header with Status */}
      <div className="flex items-start justify-between mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(article.status)}`}>
          {article.status || 'DRAFT'}
        </span>
        {article.category && (
          <div className="flex items-center text-xs text-gray-500">
            <Tag className="w-3 h-3 mr-1" />
            {article.category}
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
        <Link 
          to={`/articles/${article.id}`}
          className="hover:text-blue-600 transition-colors"
        >
          {article.headline || 'Untitled Article'}
        </Link>
      </h3>

      {/* Brief Content */}
      <p className="text-gray-600 mb-4 line-clamp-3">
        {truncateText(article.briefContent || article.summary || 'No summary available')}
      </p>

      {/* Meta Information */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            <span>{article.author?.fullName || article.authorName || 'Unknown'}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formatDate(article.publishedAt || article.createdAt)}</span>
          </div>
        </div>
        <div className="flex items-center">
          <Eye className="w-4 h-4 mr-1" />
          <span>{article.viewCount || 0}</span>
        </div>
      </div>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {(Array.isArray(article.tags) ? article.tags : [article.tags])
            .slice(0, 3)
            .map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
          {article.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
              +{article.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <Link
          to={`/articles/${article.id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Read More
        </Link>

        <div className="flex items-center space-x-2">
          {/* Approval Actions */}
          {canApprove && (
            <>
              <button
                onClick={() => onApprove(article.id)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                title="Approve Article"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => onReject(article.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="Reject Article"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Edit Action */}
          {canEdit && (
            <button
              onClick={() => onEdit(article.id)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Edit Article"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}

          {/* Delete Action */}
          {canDelete && (
            <button
              onClick={() => onDelete(article.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete Article"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;