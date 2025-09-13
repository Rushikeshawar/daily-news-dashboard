 
// src/components/users/UserCard.js
import React from 'react';
import { User, Mail, Calendar, Edit, Trash2, Shield, ShieldOff } from 'lucide-react';

const UserCard = ({ user, onEdit, onDelete, onToggleStatus }) => {
  const getRoleBadge = (role) => {
    const badges = {
      ADMIN: 'bg-red-100 text-red-800',
      AD_MANAGER: 'bg-blue-100 text-blue-800',
      EDITOR: 'bg-green-100 text-green-800',
      USER: 'bg-gray-100 text-gray-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${badges[role] || badges.USER}`;
  };

  const getStatusBadge = (isActive) => {
    return isActive 
      ? 'status-badge status-active' 
      : 'status-badge status-inactive';
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold text-blue-600">
              {user.fullName?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {user.fullName}
            </h3>
            <div className="flex items-center space-x-2">
              <span className={getRoleBadge(user.role)}>
                {user.role}
              </span>
              <span className={getStatusBadge(user.isActive)}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-1">
          <button
            onClick={() => onEdit(user.id)}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="Edit User"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onToggleStatus(user.id, !user.isActive)}
            className={`p-1 ${user.isActive ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'}`}
            title={user.isActive ? 'Deactivate' : 'Activate'}
          >
            {user.isActive ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onDelete(user.id)}
            className="text-red-600 hover:text-red-800 p-1"
            title="Delete User"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <Mail className="w-4 h-4 mr-2" />
          <span>{user.email}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
        </div>
        {user.lastLoginAt && (
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            <span>Last login {new Date(user.lastLoginAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;

