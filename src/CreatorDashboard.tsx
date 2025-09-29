import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Users, DollarSign, Clock, Settings, LogOut, Briefcase } from 'lucide-react';

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
}

const CreatorDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    totalSpent: 0
  });

  useEffect(() => {
    loadUserData();
    loadJobs();
  }, []);

  const loadUserData = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  const loadJobs = async () => {
    try {
      const token = localStorage.getItem('token');
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
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
      case 'active': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
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
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Creator Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/jobs" className="text-gray-600 hover:text-gray-900">
                <Briefcase className="w-5 h-5" />
              </Link>
              <button className="text-gray-600 hover:text-gray-900">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
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
            Manage your jobs and find talented clippers for your content.
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
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Users className="w-6 h-6 text-purple-600" />
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
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSpent)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Post New Job
            </button>
            <Link
              to="/jobs"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-md font-medium flex items-center"
            >
              <Eye className="w-5 h-5 mr-2" />
              Browse Marketplace
            </Link>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Your Recent Jobs</h3>
          </div>
          
          {jobs.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {jobs.slice(0, 5).map((job) => (
                <div key={job.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{job.title}</h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{job.description}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <span>Budget: {formatCurrency(job.budget)}</span>
                        <span className="mx-2">•</span>
                        <span>Due: {formatDate(job.deadline)}</span>
                        <span className="mx-2">•</span>
                        <span>{job.applicationCount} applications</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(job.status)}`}>
                        {job.status.replace('_', ' ')}
                      </span>
                      <Link
                        to={`/jobs/${job.id}`}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs yet</h3>
              <p className="text-gray-600 mb-6">
                Get started by posting your first job to find talented clippers.
              </p>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium flex items-center mx-auto">
                <Plus className="w-5 h-5 mr-2" />
                Post Your First Job
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;