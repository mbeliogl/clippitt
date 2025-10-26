import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, Plus, Eye, Users, DollarSign, Clock, Settings, LogOut, Briefcase, Heart, MessageCircle, Calendar, TrendingUp, AlertCircle, CheckCircle, Pause, ChevronRight, BarChart3, FileText, LayoutDashboard, Bell, X, Info, ExternalLink, Scale, Plug, BookOpen } from 'lucide-react';
import { useAuth } from './AuthContext';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  role: string;
  avatar?: string;
  rating?: number;
  totalEarnings?: number;
  totalJobs?: number;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  isLink?: boolean;
}

interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  difficulty: string;
  status: string;
  applicationCount: number;
  createdAt: string;
  videoMetrics?: {
    views: number;
    likes: number;
    comments: number;
    channelName: string;
    publishedAt: string;
    thumbnailUrl?: string;
  };
}

const sidebarItems: SidebarItem[] = [
  { id: 'overview', label: 'Dashboard Overview', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'recent-jobs', label: 'Recent Jobs', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'analytics-snapshot', label: 'Analytics Snapshot', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'notifications', label: 'Notifications', icon: <AlertCircle className="w-4 h-4" /> },
];

// All Updates Modal Component
const AllUpdatesModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const allUpdates = [
    {
      id: 1,
      type: 'application',
      title: 'New applications received',
      message: '5 new clippers applied to "Podcast Highlight Reel" - review applications',
      time: '2 minutes ago',
      priority: 'high',
      link: '/jobs/1'
    },
    {
      id: 2,
      type: 'deadline',
      title: 'Deadline approaching',
      message: '"Modern Wisdom Clips" deadline is in 2 days - check progress',
      time: '1 hour ago',
      priority: 'medium',
      link: '/jobs/2'
    },
    {
      id: 3,
      type: 'completion',
      title: 'Job completed successfully',
      message: '"Tech Talk Highlights" was completed by @clipmaster_pro - payout processed',
      time: '3 hours ago',
      priority: 'low',
      link: '/jobs/3'
    },
    {
      id: 4,
      type: 'application',
      title: 'New clipper joined',
      message: 'Expert clipper @viral_cuts just joined and applied to your "Gaming Highlights" job',
      time: '6 hours ago',
      priority: 'medium',
      link: '/jobs/4'
    },
    {
      id: 5,
      type: 'milestone',
      title: 'Milestone reached',
      message: 'Your "Startup Stories" job reached 20 applications milestone',
      time: '1 day ago',
      priority: 'low',
      link: '/jobs/5'
    },
    {
      id: 6,
      type: 'payout',
      title: 'Payout processed',
      message: 'Payment of $150 successfully sent to @creative_clips for "Podcast Moments"',
      time: '2 days ago',
      priority: 'low',
      link: '/payouts'
    },
    {
      id: 7,
      type: 'application',
      title: 'Application withdrawn',
      message: '@quick_editor withdrew their application from "Tech Reviews" job',
      time: '3 days ago',
      priority: 'low',
      link: '/jobs/6'
    },
    {
      id: 8,
      type: 'deadline',
      title: 'Deadline extension requested',
      message: '@pro_clipper requested 2-day extension for "Educational Content" job',
      time: '4 days ago',
      priority: 'medium',
      link: '/jobs/7'
    }
  ];

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'application': return <Users className="w-5 h-5 text-blue-400" />;
      case 'completion': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'deadline': return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'milestone': return <TrendingUp className="w-5 h-5 text-purple-400" />;
      case 'payout': return <DollarSign className="w-5 h-5 text-green-400" />;
      default: return <Info className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-400/30 bg-red-500/10';
      case 'medium': return 'border-yellow-400/30 bg-yellow-500/10';
      case 'low': return 'border-green-400/30 bg-green-500/10';
      default: return 'border-white/20 bg-white/5';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-orange-400" />
              All Updates
            </h3>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {allUpdates.map((update) => (
              <div
                key={update.id}
                className={`p-4 rounded-2xl border transition-all duration-300 ${getPriorityColor(update.priority)}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {getUpdateIcon(update.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white text-sm mb-1">
                      {update.title}
                    </h4>
                    <p className="text-white/70 text-sm mb-2">
                      {update.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/50 text-xs">
                        {update.time}
                      </span>
                      <Link 
                        to={update.link}
                        onClick={onClose}
                        className="text-blue-400 hover:text-blue-300 text-xs flex items-center transition-colors duration-300"
                      >
                        View <ExternalLink className="w-3 h-3 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Notification Modal Component
const NotificationsModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  notifications: any[]; 
}> = ({ isOpen, onClose, notifications }) => {
  if (!isOpen) return null;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application': return <Users className="w-5 h-5 text-blue-400" />;
      case 'completion': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'milestone': return <TrendingUp className="w-5 h-5 text-purple-400" />;
      default: return <Info className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notifications
            </h3>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-2xl border transition-all duration-300 ${
                  notification.read 
                    ? 'bg-white/5 border-white/10' 
                    : 'bg-blue-500/10 border-blue-400/30'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white text-sm mb-1">
                      {notification.title}
                    </h4>
                    <p className="text-white/70 text-sm mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/50 text-xs">
                        {notification.time}
                      </span>
                      {notification.jobId && (
                        <button className="text-blue-400 hover:text-blue-300 text-xs flex items-center">
                          View Job <ExternalLink className="w-3 h-3 ml-1" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all duration-300"
            >
              Mark All as Read
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar: React.FC<{ activeSection: string; onSectionClick: (item: SidebarItem) => void }> = ({ 
  activeSection, 
  onSectionClick 
}) => {
  return (
    <div className="hidden lg:block fixed left-8 top-1/2 transform -translate-y-1/2 z-40">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 space-y-2">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionClick(item)}
            className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all duration-300 text-left group border ${
              activeSection === item.id
                ? 'bg-blue-600/20 text-blue-300 border-blue-400/30'
                : 'text-white/70 hover:bg-white/10 hover:text-white border-transparent hover:border-white/10'
            }`}
          >
            <div className={`transition-colors duration-300 ${
              activeSection === item.id ? 'text-blue-400' : 'text-white/60 group-hover:text-white'
            }`}>
              {item.icon}
            </div>
            <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
            <ChevronRight className={`w-3 h-3 transition-all duration-300 ${
              activeSection === item.id ? 'opacity-100 translate-x-1' : 'opacity-0'
            }`} />
          </button>
        ))}
      </div>
    </div>
  );
};

const CreatorDashboard: React.FC = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAllUpdates, setShowAllUpdates] = useState(false);
  const [isManualScroll, setIsManualScroll] = useState(false);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    completedJobs: 0,
    inProgressJobs: 0,
    pausedJobs: 0,
    totalApplications: 0,
    totalSpent: 0
  });
  const [notifications] = useState([
    {
      id: 1,
      type: 'application',
      title: 'New Application Received',
      message: 'Sarah C. applied to your "Podcast Highlights" job',
      time: '2 minutes ago',
      read: false,
      jobId: 'job-123'
    },
    {
      id: 2,
      type: 'completion',
      title: 'Clips Submitted',
      message: 'Mike D. submitted 3 clips for your "Tech Talk" job',
      time: '1 hour ago',
      read: false,
      jobId: 'job-456'
    },
    {
      id: 3,
      type: 'milestone',
      title: 'Job Milestone Reached',
      message: 'Your "Gaming Highlights" job reached 10 applications!',
      time: '3 hours ago',
      read: true,
      jobId: 'job-789'
    }
  ]);

  useEffect(() => {
    loadJobs();
  }, [token]);

  const scrollToSection = (sectionId: string) => {
    setIsManualScroll(true);
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Reset manual scroll flag after smooth scrolling completes
      setTimeout(() => {
        setIsManualScroll(false);
      }, 1000); // Smooth scroll typically takes ~800ms
    }
  };

  const handleSidebarClick = (item: SidebarItem) => {
    scrollToSection(item.id);
  }

  useEffect(() => {
    const observerOptions = {
      threshold: 0.6,
      rootMargin: '-100px 0px -50% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      // Don't update active section during manual scrolling to prevent glitching
      if (isManualScroll) return;
      
      // Sort entries by their intersection ratio to prioritize the most visible section
      const visibleEntries = entries.filter(entry => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        // Find the entry with the highest intersection ratio
        const mostVisible = visibleEntries.reduce((prev, current) => 
          current.intersectionRatio > prev.intersectionRatio ? current : prev
        );
        setActiveSection(mostVisible.target.id);
      }
    }, observerOptions);

    // Small delay to ensure elements are rendered
    const timer = setTimeout(() => {
      sidebarItems.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) {
          observer.observe(element);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [isManualScroll]);

  const loadJobs = async () => {
    try {
      if (!token) {
        setError('Please login to view dashboard');
        return;
      }

      // Get user's jobs (we'll need to add this endpoint to backend)
      const response = await fetch('http://localhost:3001/api/jobs?creator=me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setJobs(data);
        
        // Calculate stats
        const totalJobs = data.length;
        const activeJobs = data.filter((job: Job) => job.status === 'active').length;
        const completedJobs = data.filter((job: Job) => job.status === 'completed').length;
        const inProgressJobs = data.filter((job: Job) => job.status === 'active').length; // Active jobs are "in progress"
        const pausedJobs = data.filter((job: Job) => job.status === 'cancelled' || job.status === 'draft').length;
        const totalApplications = data.reduce((sum: number, job: Job) => sum + job.applicationCount, 0);
        const totalSpent = data.reduce((sum: number, job: Job) => sum + job.budget, 0);
        
        setStats({ 
          totalJobs, 
          activeJobs, 
          completedJobs, 
          inProgressJobs, 
          pausedJobs, 
          totalApplications, 
          totalSpent 
        });
      } else {
        // If endpoint doesn't exist, we'll show empty state
        console.log('Jobs endpoint not available for user filtering');
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border border-green-400/30';
      case 'in_progress': return 'bg-blue-500/20 text-blue-400 border border-blue-400/30';
      case 'completed': return 'bg-gray-500/20 text-gray-400 border border-gray-400/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border border-red-400/30';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-400/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-xl text-white">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Notifications Modal */}
      <NotificationsModal 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
      />
      
      {/* All Updates Modal */}
      <AllUpdatesModal 
        isOpen={showAllUpdates}
        onClose={() => setShowAllUpdates(false)}
      />
      {/*Handles the Analytics click */}
      <Sidebar activeSection={activeSection} onSectionClick={handleSidebarClick} />
      
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Link 
                to="/" 
                className="text-white hover:text-blue-300 transition-colors duration-300"
                title="ClipIt Home"
              >
                <div className="text-xl font-bold">ClipIt</div>
              </Link>
              <div className="h-6 w-px bg-white/30"></div>
              <h1 className="text-2xl font-bold text-white">Creator Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notifications Button */}
              <button
                onClick={() => setShowNotifications(true)}
                className="tooltip relative text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                data-tooltip="Notifications"
              >
                <Bell className="w-5 h-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                  </span>
                )}
              </button>
              
              <Link 
                to="/creator-dashboard" 
                className="tooltip text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                data-tooltip="Dashboard"
              >
                <LayoutDashboard className="w-5 h-5" />
              </Link>
              <Link to="/jobs" className="tooltip text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-300" data-tooltip="Browse Jobs">
                <Briefcase className="w-5 h-5" />
              </Link>
              <button className="tooltip text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-300" data-tooltip="Settings">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="tooltip text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                data-tooltip="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div id="overview" className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Welcome back, {user?.firstName}!
                </h2>
                <p className="text-white/70">
                  Manage your jobs and find talented clippers for your content.
                </p>
              </div>
              
              {/* Quick Actions */}
              <div className="flex space-x-3">
                <Link
                  to="/LeaderboardPage"
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  {user?.role === 'creator' ? 'Creator Leaderboard' : 'Clipper Leaderboard'}
                </Link>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 backdrop-blur-sm border border-red-400/30 text-red-300 px-4 py-3 rounded-2xl mb-6">
              {error}
            </div>
          )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-500/20">
                <Briefcase className="w-6 h-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white/70">Total Jobs</p>
                <p className="text-2xl font-bold text-white">{stats.totalJobs}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-500/20">
                <Clock className="w-6 h-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white/70">Active Jobs</p>
                <p className="text-2xl font-bold text-white">{stats.activeJobs}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-500/20">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white/70">Applications</p>
                <p className="text-2xl font-bold text-white">{stats.totalApplications}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-500/20">
                <DollarSign className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white/70">Total Payout</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalSpent)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/create-job"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium flex items-center transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Post New Job
            </Link>
            <Link
              to="/jobs"
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-3 rounded-xl font-medium flex items-center transition-all duration-300"
            >
              <Eye className="w-5 h-5 mr-2" />
              Browse Marketplace
            </Link>
          </div>
        </div>

        {/* Recent Jobs */}
        <div id="recent-jobs" className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Your Recent Jobs</h3>
            <Link to="/jobs" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-300">
              View All Jobs →
            </Link>
          </div>
          
          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.slice(0, 6).map((job) => (
                <div key={job.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/15 hover:border-white/30 transition-all duration-300 transform hover:scale-105">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(job.status)} backdrop-blur-sm`}>
                        {job.status.replace('_', ' ')}
                      </span>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-400">{formatCurrency(job.budget)}</p>
                        <p className="text-xs text-green-400/70">Total Payout</p>
                      </div>
                    </div>

                    <h4 className="text-lg font-semibold text-white mb-2 line-clamp-2">{job.title}</h4>
                    <p className="text-sm text-white/70 mb-4 line-clamp-2">{job.description}</p>
                    
                    {/* Video Metrics */}
                    {job.videoMetrics && (
                      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 mb-4">
                        <div className="text-xs text-white/60 mb-2">
                          <span className="font-medium">Source: {job.videoMetrics.channelName}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="flex items-center">
                            <Eye className="w-3 h-3 mr-1 text-blue-400" />
                            <span className="font-medium text-blue-400">{job.videoMetrics.views.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Heart className="w-3 h-3 mr-1 text-red-400" />
                            <span className="font-medium text-red-400">{job.videoMetrics.likes.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="w-3 h-3 mr-1 text-green-400" />
                            <span className="font-medium text-green-400">{job.videoMetrics.comments.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-white/60">
                        <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                        <span>Due: {formatDate(job.deadline)}</span>
                      </div>
                      <div className="flex items-center text-sm text-white/60">
                        <Users className="w-4 h-4 mr-2 text-purple-400" />
                        <span>{job.applicationCount} applications</span>
                      </div>
                    </div>

                    <Link
                      to={`/jobs/${job.id}`}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-xl transition-all duration-300 text-center block transform hover:scale-105"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-12 text-center">
              <Briefcase className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No jobs yet</h3>
              <p className="text-white/70 mb-6">
                Get started by posting your first job to find talented clippers.
              </p>
              <Link
                to="/create-job"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium inline-flex items-center transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" />
                Post Your First Job
              </Link>
            </div>
          )}
        </div>

        {/* Analytics Snapshot */}
        <div id="analytics-snapshot" className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Analytics Snapshot</h3>
            <Link to="/creator-analytics" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-300">
              View Full Analytics →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Total Views */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-500/20">
                  <Eye className="w-6 h-6 text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/70">Total Views</p>
                  <p className="text-2xl font-bold text-white">2.4M</p>
                  <p className="text-xs text-green-400 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12.5% this month
                  </p>
                </div>
              </div>
            </div>

            {/* Engagement Rate */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-500/20">
                  <Heart className="w-6 h-6 text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/70">Engagement Rate</p>
                  <p className="text-2xl font-bold text-white">8.3%</p>
                  <p className="text-xs text-green-400 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +2.1% this month
                  </p>
                </div>
              </div>
            </div>

            {/* Average Views/Clip */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-500/20">
                  <BarChart3 className="w-6 h-6 text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/70">Avg Views/Clip</p>
                  <p className="text-2xl font-bold text-white">45.2K</p>
                  <p className="text-xs text-green-400 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +8.7% this month
                  </p>
                </div>
              </div>
            </div>

            {/* Top Performer */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-500/20">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/70">Top Performer</p>
                  <p className="text-lg font-bold text-white">@viral_clips</p>
                  <p className="text-xs text-yellow-400 flex items-center mt-1">
                    1.2M views this month
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Insights */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Quick Insights</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Most Popular Content Type</span>
                  <span className="text-blue-400 font-medium">Podcast Highlights</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Peak Performance Day</span>
                  <span className="text-green-400 font-medium">Tuesday</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Average Response Time</span>
                  <span className="text-purple-400 font-medium">2.3 hours</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Active Clippers</span>
                  <span className="text-orange-400 font-medium">23 this month</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Completion Rate</span>
                  <span className="text-green-400 font-medium">94.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Avg. Payout per 1K Views</span>
                  <span className="text-yellow-400 font-medium">$12.50</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payout Tracking Section */}
        <div id="payouts" className="mb-8">
          {/* This section can be expanded with payout details in the future */}
        </div>

        {/* Alerts & Notifications */}
        <div id="notifications" className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-orange-400" />
              Important Updates
            </h3>
            <button
              onClick={() => setShowAllUpdates(true)}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-300 flex items-center"
            >
              See all updates
              <ExternalLink className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-start p-3 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-xl">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-blue-300">New applications received</p>
                <p className="text-xs text-blue-400/80">5 new clippers applied to "Podcast Highlight Reel" - review applications</p>
                <Link to="/jobs/1" className="text-xs text-blue-400 hover:text-blue-300 transition-colors duration-300">Review now →</Link>
              </div>
            </div>
            
            <div className="flex items-start p-3 bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-xl">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-yellow-300">Deadline approaching</p>
                <p className="text-xs text-yellow-400/80">"Modern Wisdom Clips" deadline is in 2 days - check progress</p>
                <Link to="/jobs/2" className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors duration-300">Check status →</Link>
              </div>
            </div>
            
            <div className="flex items-start p-3 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-green-300">Job completed successfully</p>
                <p className="text-xs text-green-400/80">"Tech Talk Highlights" was completed by @clipmaster_pro - payout processed</p>
                <Link to="/jobs/3" className="text-xs text-green-400 hover:text-green-300 transition-colors duration-300">View results →</Link>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 sm:px-8 border-t border-white/20 bg-gradient-to-r from-gray-900/50 to-blue-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start w-full">
            <div className="flex flex-col space-y-4">
              <div className="text-2xl font-bold text-white">
                ClipIt
              </div>
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/Legal"
                  className="flex items-center text-gray-300 hover:text-white transition-colors">
                  <Scale className="w-4 h-4 mr-2" />
                  Legal
                </Link>
                <Link 
                  to="/Integrations"
                  className="flex items-center text-gray-300 hover:text-white transition-colors">
                  <Plug className="w-4 h-4 mr-2" />
                  Integrations
                </Link>
                <Link
                  to="/about"
                  className="flex items-center text-gray-300 hover:text-white transition-colors">
                  <BookOpen className="w-4 h-4 mr-2" />
                  About Us
                </Link>
              </div>
            </div>
            <div className="text-gray-300 mt-4 sm:mt-0">
              © 2025 ClipIt. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CreatorDashboard;