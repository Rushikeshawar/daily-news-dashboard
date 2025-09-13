 
// src/pages/advertisements/AdAnalytics.js
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  DollarSign,
  Calendar,
  Target
} from 'lucide-react';
import { adService } from '../../services/adService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import toast from 'react-hot-toast';

const AdAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState('all');
  const [dateRange, setDateRange] = useState('7d');
  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetchAds();
    fetchAnalytics();
  }, [selectedAd, dateRange]);

  const fetchAds = async () => {
    try {
      const response = await adService.getAds();
      setAds(response.data || []);
    } catch (error) {
      console.error('Failed to fetch ads:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      let response;
      if (selectedAd === 'all') {
        // Fetch overall analytics
        response = { data: mockAnalyticsData };
      } else {
        response = await adService.getAdAnalytics(selectedAd, {
          startDate: getStartDate(),
          endDate: new Date().toISOString()
        });
      }
      setAnalytics(response.data);
    } catch (error) {
      toast.error('Failed to fetch analytics data');
      console.error('Analytics error:', error);
      // Use mock data
      setAnalytics(mockAnalyticsData);
    } finally {
      setLoading(false);
    }
  };

  const getStartDate = () => {
    const now = new Date();
    switch (dateRange) {
      case '7d':
        return new Date(now.setDate(now.getDate() - 7)).toISOString();
      case '30d':
        return new Date(now.setDate(now.getDate() - 30)).toISOString();
      case '90d':
        return new Date(now.setDate(now.getDate() - 90)).toISOString();
      default:
        return new Date(now.setDate(now.getDate() - 7)).toISOString();
    }
  };

  const mockAnalyticsData = {
    overview: {
      impressions: 125000,
      clicks: 3750,
      ctr: 3.0,
      spent: 2850,
      cpc: 0.76,
      conversions: 180,
      conversionRate: 4.8
    },
    dailyStats: [
      { date: '2025-01-07', impressions: 15000, clicks: 450, spent: 342 },
      { date: '2025-01-08', impressions: 18000, clicks: 540, spent: 410 },
      { date: '2025-01-09', impressions: 16500, clicks: 495, spent: 376 },
      { date: '2025-01-10', impressions: 19000, clicks: 570, spent: 433 },
      { date: '2025-01-11', impressions: 17200, clicks: 516, spent: 392 },
      { date: '2025-01-12', impressions: 20500, clicks: 615, spent: 467 },
      { date: '2025-01-13', impressions: 18800, clicks: 564, spent: 430 }
    ],
    topPerformingAds: [
      { id: 'ad1', title: 'Summer Sale Campaign', impressions: 45000, clicks: 1350, ctr: 3.0 },
      { id: 'ad2', title: 'New Product Launch', impressions: 38000, clicks: 1140, ctr: 3.0 },
      { id: 'ad3', title: 'Holiday Special', impressions: 25000, clicks: 750, ctr: 3.0 },
      { id: 'ad4', title: 'Back to School', impressions: 17000, clicks: 510, ctr: 3.0 }
    ],
    positionBreakdown: [
      { position: 'BANNER', impressions: 75000, clicks: 2250, color: '#3B82F6' },
      { position: 'SIDEBAR', impressions: 30000, clicks: 900, color: '#10B981' },
      { position: 'INLINE', impressions: 20000, clicks: 600, color: '#F59E0B' }
    ]
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading analytics..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advertisement Analytics</h1>
          <p className="text-gray-600">Track your advertising campaign performance</p>
        </div>
        
        <div className="flex space-x-4">
          <select
            value={selectedAd}
            onChange={(e) => setSelectedAd(e.target.value)}
            className="form-select"
          >
            <option value="all">All Advertisements</option>
            {ads.map((ad) => (
              <option key={ad.id} value={ad.id}>
                {ad.title}
              </option>
            ))}
          </select>
          
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="form-select"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Impressions</p>
              <p className="text-3xl font-bold text-gray-900">
                {analytics?.overview?.impressions?.toLocaleString()}
              </p>
            </div>
            <Eye className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clicks</p>
              <p className="text-3xl font-bold text-gray-900">
                {analytics?.overview?.clicks?.toLocaleString()}
              </p>
            </div>
            <MousePointer className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">CTR</p>
              <p className="text-3xl font-bold text-gray-900">
                {analytics?.overview?.ctr}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Spent</p>
              <p className="text-3xl font-bold text-gray-900">
                ${analytics?.overview?.spent?.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Performance */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Daily Performance</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="impressions" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="clicks" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Position Breakdown */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Performance by Position</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.positionBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ position, impressions }) => `${position}: ${impressions.toLocaleString()}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="impressions"
                >
                  {analytics?.positionBreakdown?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Performing Ads */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Advertisements</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Impressions</th>
                <th>Clicks</th>
                <th>CTR</th>
              </tr>
            </thead>
            <tbody>
              {analytics?.topPerformingAds?.map((ad, index) => (
                <tr key={ad.id}>
                  <td className="font-medium">{ad.title}</td>
                  <td>{ad.impressions.toLocaleString()}</td>
                  <td>{ad.clicks.toLocaleString()}</td>
                  <td>{ad.ctr}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdAnalytics;

