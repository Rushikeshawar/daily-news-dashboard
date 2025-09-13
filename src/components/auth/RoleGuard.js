 
// src/components/auth/RoleGuard.js
import React from 'react';
import { useAuth } from '../../context/AuthContext';

const RoleGuard = ({ allowedRoles, children, fallback = null }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return fallback || (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to access this page.</p>
      </div>
    );
  }

  return children;
};

export default RoleGuard;

