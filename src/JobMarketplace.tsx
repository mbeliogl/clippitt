import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Clock, DollarSign, Users, Calendar, Eye, Heart, MessageCircle, User, LogOut, LayoutDashboard, Scale, Plug, BookOpen, Bell, Settings, Briefcase } from 'lucide-react';
import { useAuth } from './AuthContext';


interface Job {
  id: string;
  creatorId: string;
  creatorUsername: string;
  creatorAvatar: string | null;
  title: string;
  description: string;
  videoUrl: string;
  videoDuration: number;
  budget: number;
  deadline: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  status: string;
  requirements: string;
  maxClips: number;
  averageViews: number | null;
  applicationCount: number;
  createdAt: string;
  updatedAt: string;
  videoMetrics?: {
    views: number;
    likes: number;
    comments: number;
    channelName: string;
    publishedAt: string;
    thumbnailUrl?: string;
  };
}

const JobMarketplace: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [budgetFilter, setBudgetFilter] = useState('');
  const {isAuthenticated, user, logout} = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
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
    }
  ]);

  useEffect(() => {
    fetchJobs();
  }, [searchTerm, difficultyFilter, budgetFilter]);

  const fetchJobs = async () => {
    try {
      let url = 'http://localhost:3001/api/jobs?status=active';
      
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      if (difficultyFilter) {
        url += `&difficulty=${difficultyFilter}`;
      }
      if (budgetFilter) {
        const [min, max] = budgetFilter.split('-');
        if (min) url += `&minBudget=${min}`;
        if (max) url += `&maxBudget=${max}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      } else {
        setError('Failed to fetch jobs');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Fetch jobs error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatBudget = (budget: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(budget);
  };

  const formatDeadline = (deadline: string) => {
    return new Date(deadline).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleLogout = () => {
    logout();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading jobs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
              >
                <LogOut className="w-5 h-5 rotate-180" />
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-96">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      notification.read
                        ? 'bg-gray-50 border-gray-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {notification.time}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No notifications yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link 
                to="/" 
                className="text-gray-900 hover:text-blue-600 transition-colors duration-300"
                title="ClipIt Home"
              >
                <div className="text-xl font-bold">ClipIt</div>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Job Marketplace</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated && user ? (
                <>
                  {/* Notifications Button */}
                  <button
                    onClick={() => setShowNotifications(true)}
                    className="tooltip relative text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
                    data-tooltip="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                      </span>
                    )}
                  </button>
                  
                  {/* Dashboard button */}
                  <Link 
                    to={user.role === 'creator' ? '/creator-dashboard' : '/clipper-dashboard'}
                    className="tooltip text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
                    data-tooltip="Dashboard"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                  </Link>
                  
                  <button 
                    className="tooltip text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-all duration-300" 
                    data-tooltip="Settings"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  
                  {/* Logout button */}
                  <button
                    onClick={handleLogout}
                    className="tooltip text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
                    data-tooltip="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login"
                    className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-full transition-all duration-300"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={budgetFilter}
              onChange={(e) => setBudgetFilter(e.target.value)}
            >
              <option value="">All Budgets</option>
              <option value="0-50">$0 - $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100-250">$100 - $250</option>
              <option value="250-">$250+</option>
            </select>

            <div className="flex items-center text-sm text-gray-600">
              <Filter className="w-4 h-4 mr-2" />
              {jobs.length} jobs found
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    {job.creatorAvatar ? (
                      <img
                        src={job.creatorAvatar}
                        alt={job.creatorUsername}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {job.creatorUsername.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">@{job.creatorUsername}</p>
                      <p className="text-sm text-gray-500">Creator</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getDifficultyColor(job.difficulty)}`}>
                    {job.difficulty}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {job.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {job.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                    <span className="font-medium text-green-600">{formatBudget(job.budget)}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Video: {formatDuration(job.videoDuration)}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Due: {formatDeadline(job.deadline)}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{job.applicationCount} applications</span>
                  </div>
                </div>

                {/* Video Metrics */}
                {job.videoMetrics && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                      <span className="font-medium">Source: {job.videoMetrics.channelName}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="flex items-center">
                        <Eye className="w-3 h-3 mr-1 text-blue-500" />
                        <span className="font-medium text-blue-600">{job.videoMetrics.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Heart className="w-3 h-3 mr-1 text-red-500" />
                        <span className="font-medium text-red-600">{job.videoMetrics.likes.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-3 h-3 mr-1 text-green-500" />
                        <span className="font-medium text-green-600">{job.videoMetrics.comments.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                {job.tags && job.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {job.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {job.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{job.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <Link
                  to={`/jobs/${job.id}`}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-center block"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {jobs.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search filters.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 sm:px-8 border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start w-full">
            <div className="flex flex-col space-y-4">
              <div className="text-2xl font-bold text-gray-900">
                ClipIt
              </div>
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/Legal"
                  className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                  <Scale className="w-4 h-4 mr-2" />
                  Legal
                </Link>
                <Link 
                  to="/Integrations"
                  className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                  <Plug className="w-4 h-4 mr-2" />
                  Integrations
                </Link>
                <Link
                  to="/about"
                  className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                  <BookOpen className="w-4 h-4 mr-2" />
                  About Us
                </Link>
              </div>
            </div>
            <div className="text-gray-600 mt-4 sm:mt-0">
              © 2025 ClipIt. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default JobMarketplace;