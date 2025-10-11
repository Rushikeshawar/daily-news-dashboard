// src/pages/articles/PendingApprovals.js - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { Clock, Check, X, User, Calendar, Eye } from 'lucide-react';
import { articleService } from '../../services/articleService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import toast from 'react-hot-toast';

const PendingApprovals = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [approvalModal, setApprovalModal] = useState({ 
    open: false, 
    action: null 
  });
  const [approvalComment, setApprovalComment] = useState('');

  useEffect(() => {
    fetchPendingArticles();
  }, [pagination.currentPage]);

  const fetchPendingArticles = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: 10
      };
      
      console.log('PendingApprovals: Fetching with params:', params);
      
      const response = await articleService.getPendingArticles(params);
      console.log('PendingApprovals: Service response:', response);
      
      const articlesData = response.data?.articles || [];
      const paginationData = response.data?.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: articlesData.length
      };
      
      console.log('PendingApprovals: Found articles:', articlesData.length);
      
      setArticles(Array.isArray(articlesData) ? articlesData : []);
      setPagination(paginationData);
      
    } catch (error) {
      console.error('PendingApprovals: Fetch error:', error);
      toast.error('Failed to fetch pending articles');
      
      setArticles([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async () => {
    try {
      const { action } = approvalModal;
      const data = { comments: approvalComment };
      
      if (action === 'approve') {
        await articleService.approveArticle(selectedArticle.id, data);
        toast.success('Article approved and published successfully');
      } else {
        await articleService.rejectArticle(selectedArticle.id, data);
        toast.success('Article rejected');
      }
      
      setApprovalModal({ open: false, action: null });
      setSelectedArticle(null);
      setApprovalComment('');
      fetchPendingArticles();
    } catch (error) {
      console.error('Approval error:', error);
      toast.error(`Failed to ${approvalModal.action} article`);
    }
  };

  const openApprovalModal = (article, action) => {
    setSelectedArticle(article);
    setApprovalModal({ open: true, action });
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading pending articles..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pending Approvals</h1>
        <p className="text-gray-600">Review articles waiting for approval</p>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Pending Articles</h2>
          <p className="text-gray-600">All articles have been reviewed.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {articles.map((article) => {
              if (!article || !article.id) {
                console.warn('Invalid article data in pending:', article);
                return null;
              }

              return (
                <div key={article.id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {article.headline || 'Untitled Article'}
                        </h3>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                          {article.status || 'PENDING'}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {article.briefContent || article.summary || 'No summary available'}
                      </p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          <span>{article.author?.fullName || article.authorName || 'Unknown Author'}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>
                            {article.createdAt
                              ? new Date(article.createdAt).toLocaleDateString() 
                              : 'No date'}
                          </span>
                        </div>
                        {article.category && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {article.category}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => openApprovalModal(article, 'approve')}
                        className="btn-success flex items-center"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => openApprovalModal(article, 'reject')}
                        className="btn-danger flex items-center"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={10}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {/* Approval Modal */}
      <Modal
        isOpen={approvalModal.open}
        onClose={() => {
          setApprovalModal({ open: false, action: null });
          setSelectedArticle(null);
          setApprovalComment('');
        }}
        title={approvalModal.action === 'approve' ? 'Approve Article' : 'Reject Article'}
        size="lg"
      >
        {selectedArticle && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {selectedArticle.headline || 'Untitled Article'}
              </h3>
              <p className="text-gray-600">
                {selectedArticle.briefContent || selectedArticle.summary || 'No summary available'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {approvalModal.action === 'approve' 
                  ? 'Comments (optional):' 
                  : 'Reason for rejection (required):'}
              </label>
              <textarea
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                placeholder={approvalModal.action === 'approve' 
                  ? 'Great article! Ready for publication.' 
                  : 'Please explain what needs to be changed...'}
                className="form-textarea"
                rows={4}
                required={approvalModal.action === 'reject'}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setApprovalModal({ open: false, action: null });
                  setSelectedArticle(null);
                  setApprovalComment('');
                }}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleApproval}
                disabled={approvalModal.action === 'reject' && !approvalComment.trim()}
                className={approvalModal.action === 'approve' ? 'btn-success' : 'btn-danger'}
              >
                {approvalModal.action === 'approve' ? 'Approve & Publish' : 'Reject'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PendingApprovals;