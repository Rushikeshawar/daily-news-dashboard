 
// src/pages/advertisements/EditAd.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { adService } from '../../services/adService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const EditAd = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    targetUrl: '',
    position: 'BANNER',
    startDate: '',
    endDate: '',
    budget: ''
  });

  useEffect(() => {
    fetchAd();
  }, [id]);

  const fetchAd = async () => {
    try {
      const response = await adService.getAd(id);
      const adData = response.data;
      setAd(adData);
      setFormData({
        title: adData.title || '',
        description: adData.description || '',
        imageUrl: adData.imageUrl || '',
        targetUrl: adData.targetUrl || '',
        position: adData.position || 'BANNER',
        startDate: adData.startDate ? adData.startDate.split('T')[0] : '',
        endDate: adData.endDate ? adData.endDate.split('T')[0] : '',
        budget: adData.budget || ''
      });
    } catch (error) {
      toast.error('Failed to fetch advertisement');
      navigate('/advertisements');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      setSaving(true);
      await adService.updateAd(id, formData);
      toast.success('Advertisement updated successfully!');
      navigate('/advertisements');
    } catch (error) {
      toast.error('Failed to update advertisement');
      console.error('Update ad error:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading advertisement..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/advertisements')}
          className="p-2 hover:bg-gray-100 rounded-md"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Advertisement</h1>
          <p className="text-gray-600">Update your advertising campaign</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter campaign title"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="form-textarea"
              placeholder="Enter campaign description"
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Image URL *
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="form-input"
              placeholder="https://example.com/ad-image.jpg"
              required
            />
            {formData.imageUrl && (
              <div className="mt-2">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-48 h-32 object-cover rounded-md"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="targetUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Target URL *
            </label>
            <input
              type="url"
              id="targetUrl"
              name="targetUrl"
              value={formData.targetUrl}
              onChange={handleChange}
              className="form-input"
              placeholder="https://example.com/landing-page"
              required
            />
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
              Ad Position *
            </label>
            <select
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="BANNER">Banner (Top/Bottom)</option>
              <option value="SIDEBAR">Sidebar</option>
              <option value="INLINE">Inline Content</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
              Budget ($) *
            </label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="form-input"
              placeholder="1000"
              min="1"
              step="0.01"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/advertisements')}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Updating...' : 'Update Advertisement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAd;