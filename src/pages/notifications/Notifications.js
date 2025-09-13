 
// src/pages/notifications/Notifications.js
import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Notifications = () => {
  const { notifications, loading, markAsRead, fetchNotifications } = useNotifications();
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationIds) => {
    await markAsRead(notificationIds);
    setSelectedNotifications([]);
  };

  const handleSelectNotification = (notificationId) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleSelectAll = () => {
    const unreadNotifications = notifications.filter(n => !n.isRead);
    if (selectedNotifications.length === unreadNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(unreadNotifications.map(n => n.id));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading notifications..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with your activity</p>
        </div>
        
        {selectedNotifications.length > 0 && (
          <div className="flex space-x-2">
            <button
              onClick={() => handleMarkAsRead(selectedNotifications)}
              className="btn-primary flex items-center"
            >
              <Check className="w-4 h-4 mr-2" />
              Mark as Read ({selectedNotifications.length})
            </button>
          </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Notifications</h2>
          <p className="text-gray-600">You're all caught up! Check back later for updates.</p>
        </div>
      ) : (
        <div className="card">
          <div className="border-b border-gray-200 pb-4 mb-4">
            <button
              onClick={handleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {selectedNotifications.length === notifications.filter(n => !n.isRead).length 
                ? 'Deselect All' 
                : 'Select All Unread'}
            </button>
          </div>
          
          <div className="space-y-1">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${!notification.isRead ? 'notification-unread' : ''}`}
              >
                <div className="flex items-start space-x-3">
                  {!notification.isRead && (
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={() => handleSelectNotification(notification.id)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                  </div>
                  
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;

