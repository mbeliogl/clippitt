import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Briefcase, Clock, DollarSign, Star, Settings, LogOut, TrendingUp, LayoutDashboard } from 'lucide-react';
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
  creatorUsername: string;
}

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  status: string;
  createdAt: string;
  message: string;
}

const ClipperDashboard: React.FC = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalApplications: 0,
    activeApplications: 0,
    completedJobs: 0,
    totalEarnings: 0
  });

  useEffect(() => {
    if (token) {
      loadRecentJobs();
      loadApplications();
    }
  }, [token]);

  const loadRecentJobs = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/jobs?status=active&limit=5');
      if (response.ok) {
        const data = await response.json();
        setRecentJobs(data);
      }
    } catch (error) {
      console.error('Error loading recent jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    try {
      if (!token) return;

      // This endpoint would need to be added to the backend
      // For now, we'll show placeholder data
      setApplications([]);
      
      // Calculate stats (placeholder for now)
      setStats({
        totalApplications: 0,
        activeApplications: 0,
        completedJobs: 0,
        totalEarnings: 0
      });
    } catch (error) {
      console.error('Error loading applications:', error);
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Link 
                to="/" 
                className="text-gray-900 hover:text-blue-600 transition-colors duration-300"
                title="ClipIt Home"
              >
                <div className="text-xl font-bold">ClipIt</div>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Clipper Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/clipper-dashboard" 
                className="tooltip text-gray-600 hover:text-gray-900"
                data-tooltip="Dashboard"
              >
                <LayoutDashboard className="w-5 h-5" />
              </Link>
              <Link to="/jobs" className="tooltip text-gray-600 hover:text-gray-900">
                <Search className="w-5 h-5" />
              </Link>
              <button className="tooltip text-gray-600 hover:text-gray-900">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="tooltip text-gray-600 hover:text-gray-900"
                data-tooltip="Logout"
              >
                <LogOut className="tooltip w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}!
          </h2>
          <p className="text-gray-600">
            Discover exciting video editing opportunities and grow your clipping career.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeApplications}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedJobs}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Earnings</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalEarnings)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/jobs"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium flex items-center"
            >
              <Search className="w-5 h-5 mr-2" />
              Browse Jobs
            </Link>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-md font-medium flex items-center">
              <Star className="w-5 h-5 mr-2" />
              View Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Job Opportunities */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Latest Job Opportunities</h3>
            </div>
            
            {recentJobs.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {recentJobs.map((job) => (
                  <div key={job.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-900">{job.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getDifficultyColor(job.difficulty)}`}>
                            {job.difficulty}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{job.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-gray-500">
                            <span className="font-medium text-green-600">{formatCurrency(job.budget)}</span>
                            <span className="mx-2">•</span>
                            <span>@{job.creatorUsername}</span>
                            <span className="mx-2">•</span>
                            <span>{job.applicationCount} applicants</span>
                          </div>
                          <Link
                            to={`/jobs/${job.id}`}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                          >
                            Apply
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-12 text-center">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No recent jobs</h3>
                <p className="text-gray-600 mb-6">
                  Check back later for new opportunities or browse the marketplace.
                </p>
                <Link
                  to="/jobs"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium inline-flex items-center"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Browse All Jobs
                </Link>
              </div>
            )}
          </div>

          {/* Your Applications */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Your Applications</h3>
            </div>
            
            {applications.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {applications.map((application) => (
                  <div key={application.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{application.jobTitle}</h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{application.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Applied on {formatDate(application.createdAt)}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getApplicationStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-12 text-center">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-600 mb-6">
                  Start applying to jobs to see your applications here.
                </p>
                <Link
                  to="/jobs"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium inline-flex items-center"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Find Jobs to Apply
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClipperDashboard;