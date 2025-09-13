 
// src/pages/users/Users.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users as UsersIcon } from 'lucide-react';
import { userService } from '../../services/userService';
import UserCard from '../../components/users/UserCard';
import SearchBox from '../../components/common/SearchBox';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    role: ''
  });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null });

  useEffect(() => {
    fetchUsers();
  }, [filters, pagination.currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: 12,
        ...filters
      };
      const response = await userService.getUsers(params);
      setUsers(response.data.users || []);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error('Fetch users error:', error);
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

  const handleEdit = (userId) => {
    navigate(`/users/${userId}/edit`);
  };

  const handleDelete = async () => {
    try {
      await userService.deleteUser(deleteDialog.userId);
      toast.success('User deleted successfully');
      setDeleteDialog({ open: false, userId: null });
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleToggleStatus = async (userId, isActive) => {
    try {
      await userService.updateUser(userId, { isActive });
      toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">Manage system users and permissions</p>
        </div>
        <button
          onClick={() => navigate('/users/create')}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create User
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <SearchBox
              placeholder="Search users by name or email..."
              onSearch={handleSearch}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="form-select"
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="AD_MANAGER">AD Manager</option>
              <option value="EDITOR">Editor</option>
              <option value="USER">User</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading users..." />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12">
          <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Users Found</h2>
          <p className="text-gray-600 mb-4">
            {filters.search || filters.role
              ? 'Try adjusting your filters to see more results.'
              : 'Get started by creating your first user.'}
          </p>
          <button
            onClick={() => navigate('/users/create')}
            className="btn-primary"
          >
            Create User
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onEdit={handleEdit}
                onDelete={(id) => setDeleteDialog({ open: true, userId: id })}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={12}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, userId: null })}
        onConfirm={handleDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        type="danger"
      />
    </div>
  );
};

export default Users;

