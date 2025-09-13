 
// src/components/common/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  FileText,
  Users,
  Target,
  BarChart3,
  FolderOpen,
  Settings,
  Heart,
  Shield,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['ADMIN', 'AD_MANAGER', 'EDITOR'] },
    { name: 'Articles', href: '/articles', icon: FileText, roles: ['ADMIN', 'AD_MANAGER', 'EDITOR'] },
    { name: 'Pending Approvals', href: '/articles/pending', icon: Clock, roles: ['ADMIN', 'AD_MANAGER'] },
    { name: 'Users', href: '/users', icon: Users, roles: ['ADMIN'] },
    { name: 'Advertisements', href: '/advertisements', icon: Target, roles: ['ADMIN', 'AD_MANAGER'] },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['ADMIN', 'AD_MANAGER'] },
    { name: 'Categories', href: '/categories', icon: FolderOpen, roles: ['ADMIN'] },
  ];

  const adminNavigation = [
    { name: 'System Settings', href: '/admin/settings', icon: Settings },
    { name: 'System Health', href: '/admin/health', icon: Shield },
    { name: 'System Logs', href: '/admin/logs', icon: TrendingUp },
  ];

  const isActive = (href) => location.pathname === href || location.pathname.startsWith(href + '/');

  const canAccess = (roles) => roles.includes(user?.role);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          </div>

          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation
                .filter(item => canAccess(item.roles))
                .map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                      ${isActive(item.href)
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon
                      className={`
                        mr-3 flex-shrink-0 h-6 w-6
                        ${isActive(item.href) ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
                      `}
                    />
                    {item.name}
                  </Link>
                ))
              }

              {user?.role === 'ADMIN' && (
                <>
                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Administration
                    </h3>
                  </div>
                  {adminNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`
                        group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                        ${isActive(item.href)
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon
                        className={`
                          mr-3 flex-shrink-0 h-6 w-6
                          ${isActive(item.href) ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
                        `}
                      />
                      {item.name}
                    </Link>
                  ))}
                </>
              )}
            </nav>
          </div>

          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-900">
                    {user?.fullName?.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.fullName}
                </p>
                <p className="text-xs text-blue-600 truncate">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

