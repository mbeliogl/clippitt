import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Eye, Users, DollarSign, Clock, Settings, LogOut, Briefcase, Heart, MessageCircle, Calendar, TrendingUp, AlertCircle, CheckCircle, Pause, ChevronRight, BarChart3, FileText, Home } from 'lucide-react';
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
  { id: 'performance', label: 'Job Performance', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'payouts', label: 'Payout Tracking', icon: <DollarSign className="w-4 h-4" /> },
  { id: 'notifications', label: 'Notifications', icon: <AlertCircle className="w-4 h-4" /> },
  { id: 'recent-jobs', label: 'Recent Jobs', icon: <Briefcase className="w-4 h-4" /> },
];

const Sidebar: React.FC<{ activeSection: string; onSectionClick: (id: string) => void }> = ({ 
  activeSection, 
  onSectionClick 
}) => {
  return (
    <div className="hidden lg:block fixed left-8 top-1/2 transform -translate-y-1/2 z-40">
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 space-y-2 shadow-lg">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionClick(item.id)}
            className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all duration-300 text-left group ${
              activeSection === item.id
                ? 'bg-indigo-600/10 text-indigo-600 border border-indigo-200'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className={`transition-colors duration-300 ${
              activeSection === item.id ? 'text-indigo-600' : 'text-gray-500 group-hover:text-gray-700'
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
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    totalSpent: 0
  });

  useEffect(() => {
    loadJobs();
  }, [token]);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const observerOptions = {
      threshold: 0.6,
      rootMargin: '-100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sidebarItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

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
        const totalApplications = data.reduce((sum: number, job: Job) => sum + job.applicationCount, 0);
        const totalSpent = data.reduce((sum: number, job: Job) => sum + job.budget, 0);
        
        setStats({ totalJobs, activeJobs, totalApplications, totalSpent });
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
      <Sidebar activeSection={activeSection} onSectionClick={scrollToSection} />
      
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">Creator Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                title="Home"
              >
                <Home className="w-5 h-5" />
              </Link>
              <Link to="/jobs" className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-300">
                <Briefcase className="w-5 h-5" />
              </Link>
              <button className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-300">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:ml-80 py-8">
        {/* Welcome Section */}
        <div id="overview" className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.firstName}!
          </h2>
          <p className="text-white/70">
            Manage your jobs and find talented clippers for your content.
          </p>
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

        {/* Performance Analytics */}
        <div id="performance" className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Job Performance Overview */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                Job Performance
              </h3>
              <select className="text-sm bg-white/10 border border-white/30 rounded-xl px-3 py-2 text-white">
                <option className="bg-gray-800 text-white">Last 30 days</option>
                <option className="bg-gray-800 text-white">Last 7 days</option>
                <option className="bg-gray-800 text-white">All time</option>
              </select>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-green-400 mr-3" />
                  <div>
                    <p className="font-medium text-green-300">Completed Jobs</p>
                    <p className="text-sm text-green-400/80">Successfully finished</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">3</p>
                  <p className="text-xs text-green-400/80">+1 this week</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-xl">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-blue-400 mr-3" />
                  <div>
                    <p className="font-medium text-blue-300">In Progress</p>
                    <p className="text-sm text-blue-400/80">Currently active</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-400">{stats.activeJobs}</p>
                  <p className="text-xs text-blue-400/80">Active now</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-xl">
                <div className="flex items-center">
                  <Pause className="w-8 h-8 text-yellow-400 mr-3" />
                  <div>
                    <p className="font-medium text-yellow-300">Paused/Draft</p>
                    <p className="text-sm text-yellow-400/80">Inactive jobs</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-yellow-400">2</p>
                  <p className="text-xs text-yellow-400/80">Ready to activate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payout Tracking */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                Payout Tracking
              </h3>
              <span className="text-sm text-white/60">Current month</span>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-green-400 pl-4 py-2">
                <p className="text-sm font-medium text-white/70">Total Paid Out</p>
                <p className="text-2xl font-bold text-green-400">{formatCurrency(1247.50)}</p>
                <p className="text-xs text-green-400/70">Across 3 completed jobs</p>
              </div>
              
              <div className="border-l-4 border-yellow-400 pl-4 py-2">
                <p className="text-sm font-medium text-white/70">Pending Payouts</p>
                <p className="text-2xl font-bold text-yellow-400">{formatCurrency(320.00)}</p>
                <p className="text-xs text-yellow-400/70">2 jobs awaiting completion</p>
              </div>
              
              <div className="border-l-4 border-blue-400 pl-4 py-2">
                <p className="text-sm font-medium text-white/70">Budget Allocated</p>
                <p className="text-2xl font-bold text-blue-400">{formatCurrency(stats.totalSpent)}</p>
                <p className="text-xs text-blue-400/70">For active jobs</p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/20">
                <Link 
                  to="/payouts" 
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-300"
                >
                  View detailed payout history →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div id="notifications" className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-orange-400" />
            Important Updates
          </h3>
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
      </div>
    </div>
  );
};

export default CreatorDashboard;