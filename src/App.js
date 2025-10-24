// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleGuard from './components/auth/RoleGuard';
import Layout from './components/common/Layout';

// Auth
import Login from './pages/auth/Login';

// Dashboard
import Dashboard from './pages/dashboard/Dashboard';

// Articles
import Articles from './pages/articles/Articles';
import CreateArticle from './pages/articles/CreateArticle';
import EditArticle from './pages/articles/EditArticle';
import ArticleDetail from './pages/articles/ArticleDetail';
import PendingApprovals from './pages/articles/PendingApprovals';

// Users
import Users from './pages/users/Users';
import CreateUser from './pages/users/CreateUser';
import EditUser from './pages/users/EditUser';
import Profile from './pages/users/Profile';

// Advertisements
import Advertisements from './pages/advertisements/Advertisements';
import CreateAd from './pages/advertisements/CreateAd';
import EditAd from './pages/advertisements/EditAd';
import AdAnalytics from './pages/advertisements/AdAnalytics';

// Analytics
import Analytics from './pages/analytics/Analytics';

// Categories
import Categories from './pages/categories/Categories';
import CreateCategory from './pages/categories/CreateCategory';
import EditCategory from './pages/categories/EditCategory';

// Admin
import SystemSettings from './pages/admin/SystemSettings';
import SystemLogs from './pages/admin/SystemLogs';
import SystemHealth from './pages/admin/SystemHealth';

// Notifications
import Notifications from './pages/notifications/Notifications';

// AI/ML
import AiMlNews from './pages/ai-ml/AiMlNews';
import AiMlDetail from './pages/ai-ml/AiMlDetail';
import AiMlTrending from './pages/ai-ml/AiMlTrending';
import AiMlCategories from './pages/ai-ml/AiMlCategories';
import AiMlInsights from './pages/ai-ml/AiMlInsights';
import CreateAiMlArticle from './pages/ai-ml/CreateAiMlArticle';
import AiMlEdit from './pages/ai-ml/AiMlEdit';   // <-- NEW

// Time Saver
import TimeSaverDashboard from './pages/time-saver/TimeSaverDashboard';
import TimeSaverContent from './pages/time-saver/TimeSaverContent';
import TimeSaverCategory from './pages/time-saver/TimeSaverCategory';
import TimeSaverAnalytics from './pages/time-saver/TimeSaverAnalytics';
import CreateTimeSaverContent from './pages/time-saver/CreateTimeSaverContent';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public */}
              <Route path="/login" element={<Login />} />

              {/* Protected area */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        {/* Home */}
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />

                        {/* Articles */}
                        <Route path="/articles" element={<Articles />} />
                        <Route
                          path="/articles/create"
                          element={
                            <RoleGuard allowedRoles={['EDITOR', 'AD_MANAGER', 'ADMIN']}>
                              <CreateArticle />
                            </RoleGuard>
                          }
                        />
                        <Route
                          path="/articles/:id/edit"
                          element={
                            <RoleGuard allowedRoles={['EDITOR', 'AD_MANAGER', 'ADMIN']}>
                              <EditArticle />
                            </RoleGuard>
                          }
                        />
                        <Route path="/articles/:id" element={<ArticleDetail />} />
                        <Route
                          path="/articles/pending"
                          element={
                            <RoleGuard allowedRoles={['AD_MANAGER', 'ADMIN']}>
                              <PendingApprovals />
                            </RoleGuard>
                          }
                        />

                        {/* Categories */}
                        <Route
                          path="/categories"
                          element={
                            <RoleGuard allowedRoles={['EDITOR', 'AD_MANAGER', 'ADMIN']}>
                              <Categories />
                            </RoleGuard>
                          }
                        />
                        <Route
                          path="/categories/create"
                          element={
                            <RoleGuard allowedRoles={['EDITOR', 'AD_MANAGER', 'ADMIN']}>
                              <CreateCategory />
                            </RoleGuard>
                          }
                        />
                        <Route
                          path="/categories/:id/edit"
                          element={
                            <RoleGuard allowedRoles={['EDITOR', 'AD_MANAGER', 'ADMIN']}>
                              <EditCategory />
                            </RoleGuard>
                          }
                        />

                        {/* AI/ML */}
                        <Route
                          path="/ai-ml"
                          element={
                            <RoleGuard allowedRoles={['EDITOR', 'AD_MANAGER', 'ADMIN']}>
                              <AiMlNews />
                            </RoleGuard>
                          }
                        />
                        <Route
                          path="/ai-ml/trending"
                          element={
                            <RoleGuard allowedRoles={['EDITOR', 'AD_MANAGER', 'ADMIN']}>
                              <AiMlTrending />
                            </RoleGuard>
                          }
                        />
                        <Route
                          path="/ai-ml/categories"
                          element={
                            <RoleGuard allowedRoles={['EDITOR', 'AD_MANAGER', 'ADMIN']}>
                              <AiMlCategories />
                            </RoleGuard>
                          }
                        />
                        <Route
                          path="/ai-ml/insights"
                          element={
                            <RoleGuard allowedRoles={['AD_MANAGER', 'ADMIN']}>
                              <AiMlInsights />
                            </RoleGuard>
                          }
                        />
                        <Route
                          path="/ai-ml/create"
                          element={
                            <RoleGuard allowedRoles={['EDITOR', 'AD_MANAGER']}>
                              <CreateAiMlArticle />
                            </RoleGuard>
                          }
                        />
                        {/* EDIT – must be before :id */}
                        <Route
                          path="/ai-ml/edit/:id"
                          element={
                            <RoleGuard allowedRoles={['EDITOR', 'AD_MANAGER']}>
                              <AiMlEdit />
                            </RoleGuard>
                          }
                        />
                        <Route
                          path="/ai-ml/:id"
                          element={
                            <RoleGuard allowedRoles={['EDITOR', 'AD_MANAGER', 'ADMIN']}>
                              <AiMlDetail />
                            </RoleGuard>
                          }
                        />

                        {/* Time Saver */}
                        <Route
                          path="/time-saver"
                          element={
                            <RoleGuard allowedRoles={['EDITOR', 'AD_MANAGER', 'ADMIN']}>
                              <TimeSaverDashboard />
                            </RoleGuard>
                          }
                        />
                        <Route
                          path="/time-saver/content"
                          element={
                            <RoleGuard allowedRoles={['EDITOR', 'AD_MANAGER', 'ADMIN']}>
                              <TimeSaverContent />
                            </RoleGuard>
                          }
                        />
                        <Route
                          path="/time-saver/category/:group"
                          element={
                            <RoleGuard allowedRoles={['EDITOR', 'AD_MANAGER', 'ADMIN']}>
                              <TimeSaverCategory />
                            </RoleGuard>
                          }
                        />
                        <Route
                          path="/time-saver/analytics"
                          element={
                            <RoleGuard allowedRoles={['AD_MANAGER', 'ADMIN']}>
                              <TimeSaverAnalytics />
                            </RoleGuard>
                          }
                        />
                        <Route
                          path="/time-saver/create"
                          element={
                            <RoleGuard allowedRoles={['EDITOR', 'AD_MANAGER']}>
                              <CreateTimeSaverContent />
                            </RoleGuard>
                          }
                        />

                        {/* Users */}
                        <Route
                          path="/users"
                          element={
                            <RoleGuard allowedRoles={['ADMIN']}>
                              <Users />
                            </RoleGuard>
                          }
                        />
                        <Route
                          path="/users/create"
                          element={
                            <RoleGuard allowedRoles={['ADMIN']}>
                              <CreateUser />
                            </RoleGuard>
                          }
                        />
                        <Route
                          path="/users/:id/edit"
                          element={
                            <RoleGuard allowedRoles={['ADMIN']}>
                              <EditUser />
                            </RoleGuard>
                          }
                        />
                        <Route path="/profile" element={<Profile />} />

                        {/* Advertisements */}
                        <Route
                          path="/advertisements"
                          element={
                            <RoleGuard allowedRoles={['AD_MANAGER', 'ADMIN']}>
                              <Advertisements />
                            </RoleGuard>
                          }
                        />
                        <Route
                          path="/advertisements/create"
                          element={
                            <RoleGuard allowedRoles={['AD_MANAGER', 'ADMIN']}>
                              <CreateAd />
                            </RoleGuard>
                          }
                        />
                        <Route
                          path="/advertisements/:id/edit"
                          element={
                            <RoleGuard allowedRoles={['AD_MANAGER', 'ADMIN']}>
                              <EditAd />
                            </RoleGuard>
                          }
                        />
                        <Route
                          path="/advertisements/analytics"
                          element={
                            <RoleGuard allowedRoles={['AD_MANAGER', 'ADMIN']}>
                              <AdAnalytics />
                            </RoleGuard>
                          }
                        />

                        {/* Analytics */}
                        <Route
                          path="/analytics"
                          element={
                            <RoleGuard allowedRoles={['AD_MANAGER', 'ADMIN']}>
                              <Analytics />
                            </RoleGuard>
                          }
                        />

                        {/* Admin */}
                        <Route
                          path="/admin/settings"
                          element={
                            <RoleGuard allowedRoles={['ADMIN']}>
                              <SystemSettings />
                            </RoleGuard>
                          }
                        />
                        <Route
                          path="/admin/logs"
                          element={
                            <RoleGuard allowedRoles={['ADMIN']}>
                              <SystemLogs />
                            </RoleGuard>
                          }
                        />
                        <Route
                          path="/admin/health"
                          element={
                            <RoleGuard allowedRoles={['ADMIN']}>
                              <SystemHealth />
                            </RoleGuard>
                          }
                        />

                        {/* Notifications */}
                        <Route path="/notifications" element={<Notifications />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>

            <Toaster position="top-right" />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;