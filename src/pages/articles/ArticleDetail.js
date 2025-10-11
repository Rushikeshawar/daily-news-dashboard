// src/pages/articles/ArticleDetail.js - WITH TIME SAVER INTEGRATION
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Eye, 
  Edit, 
  Trash2,
  Check,
  X,
  Tag,
  Clock,
  Plus
} from 'lucide-react';
import { articleService } from '../../services/articleService';
import { timeSaverService } from '../../services/timeSaverService';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [timeSavers, setTimeSavers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTimeSavers, setLoadingTimeSavers] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [approvalModal, setApprovalModal] = useState({ 
    open: false, 
    action: null 
  });
  const [approvalComment, setApprovalComment] = useState('');

  const canEdit = user?.role === 'ADMIN' || user?.role === 'AD_MANAGER' || article?.authorId === user?.id;
  const canApprove = (user?.role === 'AD_MANAGER' || user?.role === 'ADMIN') && article?.status === 'PENDING';
  const canCreateTimeSaver = ['EDITOR', 'AD_MANAGER'].includes(user?.role);

  useEffect(() => {
    fetchArticle();
    fetchTimeSavers();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await articleService.getArticle(id);
      console.log('Article detail response:', response.data);
      
      let articleData;
      if (response.data && response.data.success && response.data.data) {
        if (response.data.data.article) {
          articleData = response.data.data.article;
        } else {
          articleData = response.data.data;
        }
      } else if (response.data && response.data.article) {
        articleData = response.data.article;
      } else {
        articleData = response.data;
      }
      
      console.log('Processed article data:', articleData);
      setArticle(articleData);
    } catch (error) {
      console.error('Fetch article error:', error);
      toast.error('Failed to fetch article');
      navigate('/articles');
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeSavers = async () => {
    try {
      setLoadingTimeSavers(true);
      const response = await timeSaverService.getContentByArticle(id, 'news');
      console.log('Time Savers response:', response.data);
      setTimeSavers(response.data.content || []);
    } catch (error) {
      console.error('Fetch Time Savers error:', error);
      // Don't show error toast - it's optional content
    } finally {
      setLoadingTimeSavers(false);
    }
  };

  const handleDelete = async () => {
    try {
      await articleService.deleteArticle(id);
      toast.success('Article deleted successfully');
      navigate('/articles');
    } catch (error) {
      toast.error('Failed to delete article');
    }
  };

  const handleApproval = async () => {
    try {
      const { action } = approvalModal;
      const data = { comments: approvalComment };
      
      if (action === 'approve') {
        await articleService.approveArticle(id, data);
        toast.success('Article approved successfully');
      } else {
        await articleService.rejectArticle(id, data);
        toast.success('Article rejected');
      }
      
      setApprovalModal({ open: false, action: null });
      setApprovalComment('');
      fetchArticle();
    } catch (error) {
      toast.error(`Failed to ${approvalModal.action} article`);
    }
  };

  const handleCreateTimeSaver = () => {
    navigate(`/time-saver/create?articleId=${id}&linkType=news`);
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: 'status-badge status-pending',
      APPROVED: 'status-badge status-approved',
      PUBLISHED: 'status-badge status-approved',
      REJECTED: 'status-badge status-rejected'
    };
    return badges[status] || 'status-badge';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatReadTime = (seconds) => {
    if (!seconds) return 'Quick read';
    const minutes = Math.ceil(seconds / 60);
    return `${minutes}m read`;
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
        <h2 className="text-2xl font-bold text-gray-900">Article Not Found</h2>
        <p className="text-gray-600 mt-2">The article you're looking for doesn't exist.</p>
        <Link to="/articles" className="btn-primary mt-4">
          Back to Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/articles')}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Article Details</h1>
            <p className="text-gray-600">View and manage article</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={getStatusBadge(article.status)}>
            {article.status || 'UNKNOWN'}
          </span>
          
          {canEdit && (
            <Link to={`/articles/${id}/edit`} className="btn-outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Link>
          )}
          
          {canApprove && (
            <>
              <button
                onClick={() => setApprovalModal({ open: true, action: 'approve' })}
                className="btn-success"
              >
                <Check className="w-4 h-4 mr-2" />
                Approve
              </button>
              <button
                onClick={() => setApprovalModal({ open: true, action: 'reject' })}
                className="btn-danger"
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </button>
            </>
          )}
          
          {(canEdit || user?.role === 'ADMIN') && (
            <button
              onClick={() => setDeleteDialog(true)}
              className="btn-danger"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Article Content */}
      <div className="card">
        {article.featuredImage && (
          <div className="mb-6">
            <img
              src={article.featuredImage}
              alt={article.headline}
              className="w-full h-64 object-cover rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {article.headline || 'Untitled Article'}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6 pb-6 border-b">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            <span>{article.author?.fullName || article.authorName || 'Unknown Author'}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formatDate(article.publishedAt || article.createdAt)}</span>
          </div>
          <div className="flex items-center">
            <Eye className="w-4 h-4 mr-2" />
            <span>{article.viewCount || article.views || 0} views</span>
          </div>
          {article.category && (
            <div className="flex items-center">
              <Tag className="w-4 h-4 mr-2" />
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {article.category}
              </span>
            </div>
          )}
        </div>

        {article.briefContent && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Summary</h2>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-lg text-gray-700 leading-relaxed">
                {article.briefContent}
              </p>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Full Article</h2>
          <div className="prose max-w-none">
            {article.fullContent ? (
              article.fullContent.split('\n').map((paragraph, index) => (
                paragraph.trim() ? (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ) : (
                  <br key={index} />
                )
              ))
            ) : (
              <p className="text-gray-500 italic">No full content available.</p>
            )}
          </div>
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(article.tags) ? article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  #{tag}
                </span>
              )) : (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  #{article.tags}
                </span>
              )}
            </div>
          </div>
        )}

        {article.status === 'REJECTED' && article.rejectionComments && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-red-900 mb-2">Rejection Reason</h3>
            <p className="text-red-700">{article.rejectionComments}</p>
          </div>
        )}
      </div>

      {/* Time Saver Content Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Clock className="w-6 h-6 text-blue-600 mr-2" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Time Saver Content</h2>
              <p className="text-sm text-gray-600">Quick summaries linked to this article</p>
            </div>
          </div>
          {canCreateTimeSaver && (
            <button
              onClick={handleCreateTimeSaver}
              className="btn-primary flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Time Saver
            </button>
          )}
        </div>

        {loadingTimeSavers ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner text="Loading Time Savers..." />
          </div>
        ) : timeSavers.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">No Time Saver content linked to this article yet</p>
            {canCreateTimeSaver && (
              <button
                onClick={handleCreateTimeSaver}
                className="btn-outline"
              >
                Create First Time Saver
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {timeSavers.map((ts) => (
              <div
                key={ts.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {ts.contentType?.replace('_', ' ')}
                      </span>
                      {ts.isPriority && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          Priority
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{ts.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{ts.summary}</p>
                    <div className="flex items-center text-xs text-gray-500 space-x-4">
                      <span>{formatReadTime(ts.readTimeSeconds)}</span>
                      <span>{ts.viewCount || 0} views</span>
                      <span>{formatDate(ts.publishedAt)}</span>
                    </div>
                  </div>
                  <Link
                    to={`/time-saver/content/${ts.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-4"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Article"
        message="Are you sure you want to delete this article? This action cannot be undone."
        type="danger"
      />

      {/* Approval Modal */}
      <Modal
        isOpen={approvalModal.open}
        onClose={() => {
          setApprovalModal({ open: false, action: null });
          setApprovalComment('');
        }}
        title={approvalModal.action === 'approve' ? 'Approve Article' : 'Reject Article'}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            {approvalModal.action === 'approve' 
              ? 'Add any comments about the approval:' 
              : 'Please provide a reason for rejection:'}
          </p>
          <textarea
            value={approvalComment}
            onChange={(e) => setApprovalComment(e.target.value)}
            placeholder={approvalModal.action === 'approve' 
              ? 'Great article! (optional)' 
              : 'Please explain what needs to be changed...'}
            className="form-textarea"
            rows={4}
          />
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setApprovalModal({ open: false, action: null });
                setApprovalComment('');
              }}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={handleApproval}
              className={approvalModal.action === 'approve' ? 'btn-success' : 'btn-danger'}
            >
              {approvalModal.action === 'approve' ? 'Approve' : 'Reject'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ArticleDetail;