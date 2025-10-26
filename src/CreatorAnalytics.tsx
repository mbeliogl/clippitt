import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, LayoutDashboard, TrendingUp, DollarSign, CheckCircle, Clock, Pause, Settings, LogOut, Briefcase, Scale, Plug, BookOpen } from 'lucide-react';
import { useAuth } from './AuthContext';

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

const CreatorAnalytics: React.FC = () => {
  const { logout, token } = useAuth();
  const [, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    completedJobs: 0,
    inProgressJobs: 0,
    pausedJobs: 0,
    totalApplications: 0,
    totalSpent: 0
  });

  useEffect(() => {
    loadJobs();
  }, [token]);

  const loadJobs = async () => {
    try {
      if (!token) {
        return;
      }

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
        const inProgressJobs = data.filter((job: Job) => job.status === 'active').length;
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
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-xl text-white">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Link 
                to="/" 
                className="text-white hover:text-blue-300 transition-colors duration-300"
                data-tooltip="ClipIt Home"
              >
                <div className="text-xl font-bold">ClipIt</div>
              </Link>
              <div className="h-6 w-px bg-white/30"></div>
              <h1 className="text-2xl font-bold text-white">Creator Analytics</h1>
            </div>
            <div className="flex items-center space-x-4">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
            <BarChart3 className='w-8 h-8 mr-3 text-blue-400'/>
            Analytics Dashboard
          </h2>
          <p className="text-white/70">
            Track your job performance, payouts, and creator metrics.
          </p>
        </div>

        {/* Performance Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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
                  <p className="text-2xl font-bold text-green-400">{stats.completedJobs}</p>
                  <p className="text-xs text-green-400/80">Successfully finished</p>
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
                  <p className="text-2xl font-bold text-blue-400">{stats.inProgressJobs}</p>
                  <p className="text-xs text-blue-400/80">Currently active</p>
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
                  <p className="text-2xl font-bold text-yellow-400">{stats.pausedJobs}</p>
                  <p className="text-xs text-yellow-400/80">Paused or cancelled</p>
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

export default CreatorAnalytics;