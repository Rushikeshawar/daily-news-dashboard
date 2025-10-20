// src/components/common/Sidebar.js - Updated with LINES Logo
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
  TrendingUp,
  Brain,
  Zap,
  Calendar,
  Activity,
  Eye,
  Edit
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LinesLogo from './LinesLogo';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['ADMIN', 'AD_MANAGER', 'EDITOR'] },
    { name: 'Articles', href: '/articles', icon: FileText, roles: ['ADMIN', 'AD_MANAGER', 'EDITOR'] },
    { name: 'Pending Approvals', href: '/articles/pending', icon: Clock, roles: ['ADMIN', 'AD_MANAGER'] },
    
    // AI/ML Section - EDITOR & AD_MANAGER can create, ADMIN view-only
    { name: 'AI/ML News', href: '/ai-ml', icon: Brain, roles: ['ADMIN', 'AD_MANAGER', 'EDITOR'] },
    
    // Time Saver Section - EDITOR & AD_MANAGER can create, ADMIN view-only
    { name: 'Time Saver', href: '/time-saver', icon: Clock, roles: ['ADMIN', 'AD_MANAGER', 'EDITOR'] },
    
    { name: 'Users', href: '/users', icon: Users, roles: ['ADMIN'] },
    { name: 'Advertisements', href: '/advertisements', icon: Target, roles: ['ADMIN', 'AD_MANAGER'] },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['ADMIN', 'AD_MANAGER'] },
    { name: 'Categories', href: '/categories', icon: FolderOpen, roles: ['ADMIN'] },
  ];

  // AI/ML Sub-navigation with updated permissions
  const aiMlSubNavigation = [
    { name: 'All AI/ML News', href: '/ai-ml', icon: Brain, roles: ['ADMIN', 'AD_MANAGER', 'EDITOR'] },
    { name: 'Trending', href: '/ai-ml/trending', icon: TrendingUp, roles: ['ADMIN', 'AD_MANAGER', 'EDITOR'] },
    { name: 'Categories', href: '/ai-ml/categories', icon: FolderOpen, roles: ['ADMIN', 'AD_MANAGER', 'EDITOR'] },
    { name: 'Insights', href: '/ai-ml/insights', icon: BarChart3, roles: ['ADMIN', 'AD_MANAGER'] },
    // Create access for EDITOR and AD_MANAGER only
    { name: 'Create Article', href: '/ai-ml/create', icon: Edit, roles: ['EDITOR', 'AD_MANAGER'] }
  ];

  // Time Saver Sub-navigation with updated permissions
  const timeSaverSubNavigation = [
    { name: 'Dashboard', href: '/time-saver', icon: Home, roles: ['ADMIN', 'AD_MANAGER', 'EDITOR'] },
    { name: 'All Content', href: '/time-saver/content', icon: FileText, roles: ['ADMIN', 'AD_MANAGER', 'EDITOR'] },
    { name: 'Analytics', href: '/time-saver/analytics', icon: BarChart3, roles: ['ADMIN', 'AD_MANAGER'] },
    // Create access for EDITOR and AD_MANAGER only
    { name: 'Create Content', href: '/time-saver/create', icon: Edit, roles: ['EDITOR', 'AD_MANAGER'] }
  ];

  const adminNavigation = [
    { name: 'System Settings', href: '/admin/settings', icon: Settings },
    { name: 'System Health', href: '/admin/health', icon: Shield },
    // { name: 'System Logs', href: '/admin/logs', icon: Activity },
  ];

  const isActive = (href) => location.pathname === href || location.pathname.startsWith(href + '/');
  const isAiMlSection = () => location.pathname.startsWith('/ai-ml');
  const isTimeSaverSection = () => location.pathname.startsWith('/time-saver');

  const canAccess = (roles) => roles.includes(user?.role);

  // Helper function to get role-based badge info
  const getRoleBadgeInfo = () => {
    switch (user?.role) {
      case 'ADMIN':
        return { color: 'red', text: 'View Only', icon: Eye };
      case 'EDITOR':
        return { color: 'green', text: 'Editor', icon: Edit };
      case 'AD_MANAGER':
        return { color: 'blue', text: 'Manager', icon: Edit };
      default:
        return null;
    }
  };

  const badgeInfo = getRoleBadgeInfo();

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
            {/* Replace Daily News text with LINES Logo */}
            <LinesLogo height={28} showTagline={false} />
          </div>

          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation
                .filter(item => canAccess(item.roles))
                .map((item) => (
                  <div key={item.name}>
                    <Link
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
                      {/* Role indicator for restricted sections */}
                      {(item.href === '/ai-ml' || item.href === '/time-saver') && user?.role === 'ADMIN' && (
                        <span className="ml-auto">
                          <Eye className="h-4 w-4 text-gray-400" title="View Only" />
                        </span>
                      )}
                      {(item.href === '/ai-ml' || item.href === '/time-saver') && ['EDITOR', 'AD_MANAGER'].includes(user?.role) && (
                        <span className="ml-auto">
                          <Edit className="h-4 w-4 text-green-500" title="Can Edit" />
                        </span>
                      )}
                    </Link>

                    {/* AI/ML Sub-navigation */}
                    {item.href === '/ai-ml' && isAiMlSection() && (
                      <div className="ml-6 mt-1 space-y-1">
                        {aiMlSubNavigation
                          .filter(subItem => canAccess(subItem.roles))
                          .map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className={`
                                group flex items-center px-2 py-1 text-xs font-medium rounded-md transition-colors
                                ${location.pathname === subItem.href
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                }
                              `}
                              onClick={() => setIsOpen(false)}
                            >
                              <subItem.icon className="mr-2 h-4 w-4" />
                              {subItem.name}
                            </Link>
                          ))
                        }
                      </div>
                    )}

                    {/* Time Saver Sub-navigation */}
                    {item.href === '/time-saver' && isTimeSaverSection() && (
                      <div className="ml-6 mt-1 space-y-1">
                        {timeSaverSubNavigation
                          .filter(subItem => canAccess(subItem.roles))
                          .map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className={`
                                group flex items-center px-2 py-1 text-xs font-medium rounded-md transition-colors
                                ${location.pathname === subItem.href
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                }
                              `}
                              onClick={() => setIsOpen(false)}
                            >
                              <subItem.icon className="mr-2 h-4 w-4" />
                              {subItem.name}
                            </Link>
                          ))
                        }
                      </div>
                    )}
                  </div>
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
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.fullName}
                </p>
                <p className="text-xs text-blue-600 truncate">
                  {user?.role}
                </p>
                
                {/* Enhanced role badges for new features access */}
                {['EDITOR', 'AD_MANAGER', 'ADMIN'].includes(user?.role) && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {/* AI/ML Access Badge */}
                    <span className={`
                      inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium
                      ${user?.role === 'ADMIN' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                      }
                    `}>
                      <Brain className="w-3 h-3 mr-0.5" />
                      AI/ML
                      {user?.role === 'ADMIN' && <Eye className="w-3 h-3 ml-0.5" />}
                      {['EDITOR', 'AD_MANAGER'].includes(user?.role) && <Edit className="w-3 h-3 ml-0.5" />}
                    </span>
                    
                    {/* Time Saver Access Badge */}
                    <span className={`
                      inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium
                      ${user?.role === 'ADMIN' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                      }
                    `}>
                      <Clock className="w-3 h-3 mr-0.5" />
                      TS
                      {user?.role === 'ADMIN' && <Eye className="w-3 h-3 ml-0.5" />}
                      {['EDITOR', 'AD_MANAGER'].includes(user?.role) && <Edit className="w-3 h-3 ml-0.5" />}
                    </span>
                  </div>
                )}

                {/* Role-specific permission indicator */}
                {badgeInfo && (
                  <div className="mt-1">
                    <span className={`
                      inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                      ${badgeInfo.color === 'red' ? 'bg-red-100 text-red-800' : ''}
                      ${badgeInfo.color === 'green' ? 'bg-green-100 text-green-800' : ''}
                      ${badgeInfo.color === 'blue' ? 'bg-blue-100 text-blue-800' : ''}
                    `}>
                      <badgeInfo.icon className="w-3 h-3 mr-1" />
                      {badgeInfo.text}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Permission Legend */}
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="text-xs text-gray-500 space-y-1">
                {user?.role === 'ADMIN' && (
                  <div className="flex items-center">
                    <Eye className="w-3 h-3 mr-1 text-red-500" />
                    <span>AI/ML & Time Saver: View Only</span>
                  </div>
                )}
                {['EDITOR', 'AD_MANAGER'].includes(user?.role) && (
                  <div className="flex items-center">
                    <Edit className="w-3 h-3 mr-1 text-green-500" />
                    <span>AI/ML & Time Saver: Full Access</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;