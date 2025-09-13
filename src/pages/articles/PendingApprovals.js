 
// src/pages/articles/PendingApprovals.js
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
        limit: 10,
        status: 'PENDING'
      };
      const response = await articleService.getPendingArticles(params);
      setArticles(response.data.articles);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch pending articles');
      console.error('Fetch pending articles error:', error);
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
        toast.success('Article approved successfully');
      } else {
        await articleService.rejectArticle(selectedArticle.id, data);
        toast.success('Article rejected');
      }
      
      setApprovalModal({ open: false, action: null });
      setSelectedArticle(null);
      setApprovalComment('');
      fetchPendingArticles();
    } catch (error) {
      toast.error(`Failed to ${approvalModal.action} article`);
    }
  };

  const openApprovalModal = (article, action) => {
    setSelectedArticle(article);
    setApprovalModal({ open: true, action });
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
          <p className="text-gray-600">All articles have been reviewed!</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {articles.map((article) => (
              <div key={article.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {article.headline}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {article.summary || article.briefContent}
                    </p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <span>{article.author?.fullName}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span className="text-blue-600">{article.category}</span>
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
            ))}
          </div>

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={10}
            onPageChange={(page) => setPagination(prev => ({ ...prev, currentPage: page }))}
          />
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
                {selectedArticle.headline}
              </h3>
              <p className="text-gray-600">
                {selectedArticle.summary || selectedArticle.briefContent}
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
                {approvalModal.action === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PendingApprovals;

