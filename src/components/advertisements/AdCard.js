 
// src/components/advertisements/AdCard.js
import React from 'react';
import { Calendar, Target, BarChart3, Edit, Trash2, Pause, Play } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdCard = ({ ad, onEdit, onDelete, onToggleStatus }) => {
  const { user } = useAuth();
  
  const getStatusBadge = (status) => {
    const badges = {
      ACTIVE: 'status-badge status-active',
      PAUSED: 'status-badge status-pending',
      COMPLETED: 'status-badge status-inactive'
    };
    return badges[status] || 'status-badge';
  };

  const getPositionColor = (position) => {
    const colors = {
      BANNER: 'bg-blue-100 text-blue-800',
      SIDEBAR: 'bg-green-100 text-green-800',
      INLINE: 'bg-purple-100 text-purple-800'
    };
    return colors[position] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="ad-card">
      {ad.imageUrl && (
        <div className="ad-card-image-container">
          <img
            src={ad.imageUrl}
            alt={ad.title}
            className="ad-card-image"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className={getStatusBadge(ad.status)}>
            {ad.status}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(ad.position)}`}>
            {ad.position}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {ad.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {ad.description}
        </p>
        
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
          <div>
            <span className="font-medium">Budget:</span>
            <div className="text-lg font-bold text-green-600">
              ${ad.budget?.toLocaleString()}
            </div>
          </div>
          <div>
            <span className="font-medium">Spent:</span>
            <div className="text-lg font-bold text-red-600">
              ${ad.spent?.toLocaleString() || 0}
            </div>
          </div>
          <div>
            <span className="font-medium">Impressions:</span>
            <div className="text-lg font-bold">
              {ad.impressions?.toLocaleString() || 0}
            </div>
          </div>
          <div>
            <span className="font-medium">Clicks:</span>
            <div className="text-lg font-bold">
              {ad.clicks?.toLocaleString() || 0}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{new Date(ad.startDate).toLocaleDateString()}</span>
            <span className="mx-1">-</span>
            <span>{new Date(ad.endDate).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(ad.id)}
              className="text-blue-600 hover:text-blue-800 p-1"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(ad.id)}
              className="text-red-600 hover:text-red-800 p-1"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onToggleStatus(ad.id, ad.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE')}
              className={`p-1 ${ad.status === 'ACTIVE' ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'}`}
              title={ad.status === 'ACTIVE' ? 'Pause' : 'Resume'}
            >
              {ad.status === 'ACTIVE' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdCard;