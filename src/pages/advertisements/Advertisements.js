 
// src/pages/advertisements/Advertisements.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Target } from 'lucide-react';
import { adService } from '../../services/adService';
import AdCard from '../../components/advertisements/AdCard';
import SearchBox from '../../components/common/SearchBox';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Advertisements = () => {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    position: ''
  });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, adId: null });

  useEffect(() => {
    fetchAds();
  }, [filters, pagination.currentPage]);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: 12,
        ...filters
      };
      const response = await adService.getAds(params);
      setAds(response.data);
      // Mock pagination for demo
      setPagination({
        currentPage: 1,
        totalPages: Math.ceil(response.data.length / 12),
        totalItems: response.data.length
      });
    } catch (error) {
      toast.error('Failed to fetch advertisements');
      console.error('Fetch ads error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setFilters(prev => ({ ...prev, search: query }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleEdit = (adId) => {
    navigate(`/advertisements/${adId}/edit`);
  };

  const handleDelete = async () => {
    try {
      await adService.deleteAd(deleteDialog.adId);
      toast.success('Advertisement deleted successfully');
      setDeleteDialog({ open: false, adId: null });
      fetchAds();
    } catch (error) {
      toast.error('Failed to delete advertisement');
    }
  };

  const handleToggleStatus = async (adId, newStatus) => {
    try {
      await adService.updateAd(adId, { status: newStatus });
      toast.success(`Advertisement ${newStatus.toLowerCase()} successfully`);
      fetchAds();
    } catch (error) {
      toast.error('Failed to update advertisement status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advertisements</h1>
          <p className="text-gray-600">Manage your advertising campaigns</p>
        </div>
        <button
          onClick={() => navigate('/advertisements/create')}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Advertisement
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <SearchBox
              placeholder="Search advertisements..."
              onSearch={handleSearch}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="form-select"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PAUSED">Paused</option>
              <option value="COMPLETED">Completed</option>
            </select>
            
            <select
              value={filters.position}
              onChange={(e) => handleFilterChange('position', e.target.value)}
              className="form-select"
            >
              <option value="">All Positions</option>
              <option value="BANNER">Banner</option>
              <option value="SIDEBAR">Sidebar</option>
              <option value="INLINE">Inline</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ads Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading advertisements..." />
        </div>
      ) : ads.length === 0 ? (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Advertisements Found</h2>
          <p className="text-gray-600 mb-4">
            {filters.search || filters.status || filters.position
              ? 'Try adjusting your filters to see more results.'
              : 'Get started by creating your first advertisement campaign.'}
          </p>
          <button
            onClick={() => navigate('/advertisements/create')}
            className="btn-primary"
          >
            Create Advertisement
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ads.map((ad) => (
              <AdCard
                key={ad.id}
                ad={ad}
                onEdit={handleEdit}
                onDelete={(id) => setDeleteDialog({ open: true, adId: id })}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={12}
            onPageChange={(page) => setPagination(prev => ({ ...prev, currentPage: page }))}
          />
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, adId: null })}
        onConfirm={handleDelete}
        title="Delete Advertisement"
        message="Are you sure you want to delete this advertisement? This action cannot be undone."
        type="danger"
      />
    </div>
  );
};

export default Advertisements;

