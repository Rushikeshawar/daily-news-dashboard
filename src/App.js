// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleGuard from './components/auth/RoleGuard';
import Layout from './components/common/Layout';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Articles from './pages/articles/Articles';
import CreateArticle from './pages/articles/CreateArticle';
import EditArticle from './pages/articles/EditArticle';
import ArticleDetail from './pages/articles/ArticleDetail';
import PendingApprovals from './pages/articles/PendingApprovals';
import Users from './pages/users/Users';
import CreateUser from './pages/users/CreateUser';
import EditUser from './pages/users/EditUser';
import Profile from './pages/users/Profile';
import Advertisements from './pages/advertisements/Advertisements';
import CreateAd from './pages/advertisements/CreateAd';
import EditAd from './pages/advertisements/EditAd';
import AdAnalytics from './pages/advertisements/AdAnalytics';
import Analytics from './pages/analytics/Analytics';
import Categories from './pages/categories/Categories';
import CreateCategory from './pages/categories/CreateCategory';
import EditCategory from './pages/categories/EditCategory';
import SystemSettings from './pages/admin/SystemSettings';
import SystemLogs from './pages/admin/SystemLogs';
import SystemHealth from './pages/admin/SystemHealth';
import Notifications from './pages/notifications/Notifications';
import './App.css';

function App() {
  // Add debug logging
  console.log('App component loaded');
  
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        
                        {/* Article Routes */}
                        <Route path="/articles" element={<Articles />} />
                        <Route path="/articles/create" element={
                          <RoleGuard allowedRoles={['EDITOR', 'AD_MANAGER', 'ADMIN']}>
                            <CreateArticle />
                          </RoleGuard>
                        } />
                        <Route path="/articles/:id/edit" element={
                          <RoleGuard allowedRoles={['EDITOR', 'AD_MANAGER', 'ADMIN']}>
                            <EditArticle />
                          </RoleGuard>
                        } />
                        <Route path="/articles/:id" element={<ArticleDetail />} />
                        <Route path="/articles/pending" element={
                          <RoleGuard allowedRoles={['AD_MANAGER', 'ADMIN']}>
                            <PendingApprovals />
                          </RoleGuard>
                        } />

                        {/* User Routes */}
                        <Route path="/users" element={
                          <RoleGuard allowedRoles={['ADMIN']}>
                            <Users />
                          </RoleGuard>
                        } />
                        <Route path="/users/create" element={
                          <RoleGuard allowedRoles={['ADMIN']}>
                            <CreateUser />
                          </RoleGuard>
                        } />
                        <Route path="/users/:id/edit" element={
                          <RoleGuard allowedRoles={['ADMIN']}>
                            <EditUser />
                          </RoleGuard>
                        } />
                        <Route path="/profile" element={<Profile />} />

                        {/* Advertisement Routes */}
                        <Route path="/advertisements" element={
                          <RoleGuard allowedRoles={['AD_MANAGER', 'ADMIN']}>
                            <Advertisements />
                          </RoleGuard>
                        } />
                        <Route path="/advertisements/create" element={
                          <RoleGuard allowedRoles={['AD_MANAGER', 'ADMIN']}>
                            <CreateAd />
                          </RoleGuard>
                        } />
                        <Route path="/advertisements/:id/edit" element={
                          <RoleGuard allowedRoles={['AD_MANAGER', 'ADMIN']}>
                            <EditAd />
                          </RoleGuard>
                        } />
                        <Route path="/advertisements/analytics" element={
                          <RoleGuard allowedRoles={['AD_MANAGER', 'ADMIN']}>
                            <AdAnalytics />
                          </RoleGuard>
                        } />

                        {/* Analytics Routes */}
                        <Route path="/analytics" element={
                          <RoleGuard allowedRoles={['AD_MANAGER', 'ADMIN']}>
                            <Analytics />
                          </RoleGuard>
                        } />

                        {/* Category Routes */}
                        <Route path="/categories" element={
                          <RoleGuard allowedRoles={['ADMIN']}>
                            <Categories />
                          </RoleGuard>
                        } />
                        <Route path="/categories/create" element={
                          <RoleGuard allowedRoles={['ADMIN']}>
                            <CreateCategory />
                          </RoleGuard>
                        } />
                        <Route path="/categories/:id/edit" element={
                          <RoleGuard allowedRoles={['ADMIN']}>
                            <EditCategory />
                          </RoleGuard>
                        } />

                        {/* Admin Routes */}
                        <Route path="/admin/settings" element={
                          <RoleGuard allowedRoles={['ADMIN']}>
                            <SystemSettings />
                          </RoleGuard>
                        } />
                        <Route path="/admin/logs" element={
                          <RoleGuard allowedRoles={['ADMIN']}>
                            <SystemLogs />
                          </RoleGuard>
                        } />
                        <Route path="/admin/health" element={
                          <RoleGuard allowedRoles={['ADMIN']}>
                            <SystemHealth />
                          </RoleGuard>
                        } />

                        {/* Notification Routes */}
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