// src/pages/admin/SystemSettings.js
import React, { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, Shield, Database, Mail, Clock } from 'lucide-react';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Daily News Dashboard',
    siteDescription: 'Your trusted source for the latest news and updates',
    maintenanceMode: false,
    registrationEnabled: true,
    maxFileSize: 10485760, // 10MB
    emailNotifications: true,
    autoApproveArticles: false,
    adDisplayEnabled: true,
    analyticsEnabled: true,
    backupFrequency: 'daily',
    sessionTimeout: 3600,
    maxLoginAttempts: 5
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await adminService.getSettings();
      console.log('Settings response:', response.data);
      setSettings({ ...settings, ...response.data });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast.error('Failed to fetch settings - using defaults');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      await adminService.updateSettings(settings);
      toast.success('Settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update settings');
      console.error('Update settings error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = async () => {
    try {
      const response = await adminService.createBackup();
      toast.success(`Backup created: ${response.data.filename}`);
    } catch (error) {
      toast.error('Failed to create backup');
    }
  };

  const handleClearCache = async () => {
    try {
      const response = await adminService.clearCache();
      toast.success(`Cache cleared: ${response.data.itemsCleared} items`);
    } catch (error) {
      toast.error('Failed to clear cache');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading settings..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure system-wide settings and preferences</p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleClearCache}
            className="btn-outline flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Clear Cache
          </button>
          <button
            onClick={handleBackup}
            className="btn-outline flex items-center"
          >
            <Database className="w-4 h-4 mr-2" />
            Create Backup
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Settings */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">General Settings</h2>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-2">
                Site Name
              </label>
              <input
                type="text"
                id="siteName"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter site name"
              />
            </div>

            <div>
              <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Site Description
              </label>
              <textarea
                id="siteDescription"
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleChange}
                rows={3}
                className="form-textarea"
                placeholder="Enter site description"
              />
            </div>

            <div>
              <label htmlFor="maxFileSize" className="block text-sm font-medium text-gray-700 mb-2">
                Max File Size (bytes)
              </label>
              <input
                type="number"
                id="maxFileSize"
                name="maxFileSize"
                value={settings.maxFileSize}
                onChange={handleChange}
                className="form-input"
                min="1048576"
                step="1048576"
              />
              <p className="text-sm text-gray-500 mt-1">
                Current: {(settings.maxFileSize / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (seconds)
              </label>
              <input
                type="number"
                id="sessionTimeout"
                name="sessionTimeout"
                value={settings.sessionTimeout}
                onChange={handleChange}
                className="form-input"
                min="300"
                step="300"
              />
              <p className="text-sm text-gray-500 mt-1">
                Current: {Math.floor(settings.sessionTimeout / 60)} minutes
              </p>
            </div>

            <div>
              <label htmlFor="maxLoginAttempts" className="block text-sm font-medium text-gray-700 mb-2">
                Max Login Attempts
              </label>
              <input
                type="number"
                id="maxLoginAttempts"
                name="maxLoginAttempts"
                value={settings.maxLoginAttempts}
                onChange={handleChange}
                className="form-input"
                min="3"
                max="10"
              />
            </div>
          </div>
        </div>

        {/* Feature Settings */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">Feature Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="maintenanceMode" className="text-sm font-medium text-gray-900">
                  Maintenance Mode
                </label>
                <p className="text-sm text-gray-500">Temporarily disable public access</p>
              </div>
              <input
                type="checkbox"
                id="maintenanceMode"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="registrationEnabled" className="text-sm font-medium text-gray-900">
                  User Registration
                </label>
                <p className="text-sm text-gray-500">Allow new users to register</p>
              </div>
              <input
                type="checkbox"
                id="registrationEnabled"
                name="registrationEnabled"
                checked={settings.registrationEnabled}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="emailNotifications" className="text-sm font-medium text-gray-900">
                  Email Notifications
                </label>
                <p className="text-sm text-gray-500">Send system notifications via email</p>
              </div>
              <input
                type="checkbox"
                id="emailNotifications"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="autoApproveArticles" className="text-sm font-medium text-gray-900">
                  Auto-approve Articles
                </label>
                <p className="text-sm text-gray-500">Automatically approve new articles</p>
              </div>
              <input
                type="checkbox"
                id="autoApproveArticles"
                name="autoApproveArticles"
                checked={settings.autoApproveArticles}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="adDisplayEnabled" className="text-sm font-medium text-gray-900">
                  Advertisement Display
                </label>
                <p className="text-sm text-gray-500">Show advertisements on the site</p>
              </div>
              <input
                type="checkbox"
                id="adDisplayEnabled"
                name="adDisplayEnabled"
                checked={settings.adDisplayEnabled}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="analyticsEnabled" className="text-sm font-medium text-gray-900">
                  Analytics Tracking
                </label>
                <p className="text-sm text-gray-500">Enable user behavior tracking</p>
              </div>
              <input
                type="checkbox"
                id="analyticsEnabled"
                name="analyticsEnabled"
                checked={settings.analyticsEnabled}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Backup Settings */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Backup Settings</h2>
            </div>
          </div>
          
          <div>
            <label htmlFor="backupFrequency" className="block text-sm font-medium text-gray-700 mb-2">
              Backup Frequency
            </label>
            <select
              id="backupFrequency"
              name="backupFrequency"
              value={settings.backupFrequency}
              onChange={handleChange}
              className="form-select"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SystemSettings;