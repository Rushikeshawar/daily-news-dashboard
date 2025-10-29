// src/pages/articles/Articles.js - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, FileText } from 'lucide-react';
import { articleService } from '../../services/articleService';
import { useAuth } from '../../context/AuthContext';
import ArticleCard from '../../components/articles/ArticleCard';
import SearchBox from '../../components/common/SearchBox';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Articles = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrevious: false
  });
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    sortBy: 'publishedAt',
    order: 'desc'
  });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, articleId: null });
  const [approvalDialog, setApprovalDialog] = useState({ 
    open: false, 
    articleId: null, 
    action: null 
  });

  const canCreateArticle = ['EDITOR', 'AD_MANAGER'].includes(user?.role);

  useEffect(() => {
    fetchArticles();
  }, [filters, pagination.currentPage]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: 12,
        ...filters
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      
      console.log('Articles: Fetching with params:', params);
      const response = await articleService.getArticles(params);
      console.log('Articles: Service response:', response);
      
      const articlesData = response.data?.articles || [];
      const paginationData = response.data?.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNext: false,
        hasPrevious: false
      };
      
      console.log('Articles: Final articles data:', articlesData);
      console.log('Articles: Final pagination data:', paginationData);
      
      setArticles(Array.isArray(articlesData) ? articlesData : []);
      setPagination(paginationData);
      
    } catch (error) {
      console.error('Articles: Fetch error:', error);
      toast.error('Failed to fetch articles');
      setArticles([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNext: false,
        hasPrevious: false
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setFilters(prev => ({ ...prev, search: query }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleEdit = (articleId) => {
    navigate(`/articles/${articleId}/edit`);
  };

  const handleDelete = async () => {
    try {
      await articleService.deleteArticle(deleteDialog.articleId);
      toast.success('Article deleted successfully');
      setDeleteDialog({ open: false, articleId: null });
      fetchArticles();
    } catch (error) {
      toast.error('Failed to delete article');
    }
  };

  const handleApproval = async () => {
    try {
      const { articleId, action } = approvalDialog;
      
      if (action === 'approve') {
        await articleService.approveArticle(articleId, {
          comments: 'Article approved'
        });
        toast.success('Article approved successfully');
      } else {
        await articleService.rejectArticle(articleId, {
          comments: 'Article needs revision'
        });
        toast.success('Article rejected');
      }
      
      setApprovalDialog({ open: false, articleId: null, action: null });
      fetchArticles();
    } catch (error) {
      toast.error(`Failed to ${approvalDialog.action} article`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
          <p className="text-gray-600">Manage your news articles</p>
        </div>
        {canCreateArticle && (
          <button
            onClick={() => navigate('/articles/create')}
            className="btn-primary flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Article
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <SearchBox
              placeholder="Search articles..."
              onSearch={handleSearch}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="form-select"
            >
              <option value="">All Categories</option>
              <option value="TECHNOLOGY">Technology</option>
              <option value="BUSINESS">Business</option>
              <option value="SPORTS">Sports</option>
              <option value="POLITICS">Politics</option>
              <option value="ENTERTAINMENT">Entertainment</option>
              <option value="SCIENCE">Science</option>
              <option value="HEALTH">Health</option>
              <option value="TRAVEL">Travel</option>
              <option value="EDUCATION">Education</option>
            </select>
            
            {(user?.role === 'AD_MANAGER' || user?.role === 'ADMIN') && (
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="form-select"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="PUBLISHED">Published</option>
                <option value="REJECTED">Rejected</option>
                <option value="DRAFT">Draft</option>
              </select>
            )}
            
            <select
              value={`${filters.sortBy}-${filters.order}`}
              onChange={(e) => {
                const [sortBy, order] = e.target.value.split('-');
                setFilters(prev => ({ ...prev, sortBy, order }));
              }}
              className="form-select"
            >
              <option value="publishedAt-desc">Newest First</option>
              <option value="publishedAt-asc">Oldest First</option>
              <option value="viewCount-desc">Most Viewed</option>
              <option value="headline-asc">Title A-Z</option>
              <option value="headline-desc">Title Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading articles..." />
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Articles Found</h2>
          <p className="text-gray-600 mb-4">
            {filters.search || filters.category || filters.status
              ? 'Try adjusting your filters to see more results.'
              : 'Get started by creating your first article.'}
          </p>
          {canCreateArticle && (
            <button
              onClick={() => navigate('/articles/create')}
              className="btn-primary mt-4"
            >
              Create Article
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => {
              if (!article || !article.id) {
                console.warn('Invalid article data:', article);
                return null;
              }
              
              return (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onEdit={handleEdit}
                  onDelete={(id) => setDeleteDialog({ open: true, articleId: id })}
                  onApprove={(id) => setApprovalDialog({ 
                    open: true, 
                    articleId: id, 
                    action: 'approve' 
                  })}
                  onReject={(id) => setApprovalDialog({ 
                    open: true, 
                    articleId: id, 
                    action: 'reject' 
                  })}
                />
              );
            })}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={12}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, articleId: null })}
        onConfirm={handleDelete}
        title="Delete Article"
        message="Are you sure you want to delete this article? This action cannot be undone."
        type="danger"
      />

      {/* Approval Confirmation Dialog */}
      <ConfirmDialog
        isOpen={approvalDialog.open}
        onClose={() => setApprovalDialog({ open: false, articleId: null, action: null })}
        onConfirm={handleApproval}
        title={approvalDialog.action === 'approve' ? 'Approve Article' : 'Reject Article'}
        message={`Are you sure you want to ${approvalDialog.action} this article?`}
        confirmText={approvalDialog.action === 'approve' ? 'Approve' : 'Reject'}
        type={approvalDialog.action === 'approve' ? 'success' : 'danger'}
      />
    </div>
  );
};

export default Articles;