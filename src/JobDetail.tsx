import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, DollarSign, Users, Calendar, Star, Play, FileText, Target, Eye, Heart, MessageCircle, Tag, Home, Scale, Plug, BookOpen, LayoutDashboard, Bell, Settings, LogOut, Briefcase } from 'lucide-react';
import { useAuth } from './AuthContext';

interface JobDetail {
  id: string;
  creatorId: string;
  creator: {
    username: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    rating: number | null;
  };
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

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token, isAuthenticated, user, logout } = useAuth();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplication, setShowApplication] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    message: '',
    proposedTimeline: ''
  });
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [applicationError, setApplicationError] = useState('');
  const [applicationSuccess, setApplicationSuccess] = useState(false);
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
    if (id) {
      fetchJob();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/jobs/${id}`);
      if (response.ok) {
        const data = await response.json();
        setJob(data);
      } else {
        setError('Job not found');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Fetch job error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplicationLoading(true);
    setApplicationError('');

    try {
      if (!token) {
        setApplicationError('Please login to apply for jobs');
        setApplicationLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:3001/api/jobs/${id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(applicationForm)
      });

      const data = await response.json();

      if (response.ok) {
        setApplicationSuccess(true);
        setShowApplication(false);
        setApplicationForm({ message: '', proposedTimeline: '' });
        // Refresh job data to update application count
        fetchJob();
      } else {
        setApplicationError(data.error || 'Application failed');
      }
    } catch (error) {
      setApplicationError('Network error. Please try again.');
      console.error('Application error:', error);
    } finally {
      setApplicationLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading job details...</div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The requested job could not be found.'}</p>
          <Link to="/jobs" className="text-indigo-600 hover:text-indigo-800">
            ← Back to Jobs
          </Link>
        </div>
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
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="text-gray-900 hover:text-blue-600 transition-colors duration-300"
                title="ClipIt Home"
              >
                <div className="text-xl font-bold">ClipIt</div>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <Link to="/jobs" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Jobs
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated && user ? (
                <>
                  {/* Notifications Button */}
                  <button
                    onClick={() => setShowNotifications(true)}
                    className="relative text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                      </span>
                    )}
                  </button>
                  
                  <Link 
                    to={user.role === 'creator' ? '/creator-dashboard' : '/clipper-dashboard'}
                    className="text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
                    title="Dashboard"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                  </Link>
                  
                  <Link 
                    to="/jobs" 
                    className="text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-all duration-300" 
                    title="Browse Jobs"
                  >
                    <Briefcase className="w-5 h-5" />
                  </Link>
                  
                  <button 
                    className="text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-all duration-300" 
                    title="Settings"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
                    title="Logout"
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {applicationSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            Application submitted successfully! The creator will review your application.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getDifficultyColor(job.difficulty)}`}>
                  {job.difficulty}
                </span>
              </div>

              <div className="flex items-center mb-6">
                {job.creator.avatar ? (
                  <img
                    src={job.creator.avatar}
                    alt={job.creator.username}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {job.creator.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">
                    {job.creator.firstName} {job.creator.lastName} (@{job.creator.username})
                  </p>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Creator</span>
                    {job.creator.rating !== null && job.creator.rating !== undefined && typeof job.creator.rating === 'number' && (
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{job.creator.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
              </div>

              {job.requirements && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Requirements
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{job.requirements}</p>
                </div>
              )}

              {job.tags && job.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Tag className="w-5 h-5 mr-2" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Video Preview */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Play className="w-5 h-5 mr-2" />
                  Source Video
                </h3>
                <div className="bg-gray-100 rounded-lg overflow-hidden">
                  {/* Video Embed */}
                  <div className="aspect-video">
                    <iframe
                      src={job.videoUrl.replace('watch?v=', 'embed/')}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={job.title}
                    />
                  </div>
                  
                  {/* Video Metrics */}
                  {job.videoMetrics && (
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Source: {job.videoMetrics.channelName}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(job.videoMetrics.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-gray-500" />
                          <div>
                            <p className="font-semibold text-gray-600">{formatDuration(job.videoDuration)}</p>
                            <p className="text-gray-500 text-xs">Duration</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-2 text-blue-500" />
                          <div>
                            <p className="font-semibold text-blue-600">{job.videoMetrics.views.toLocaleString()}</p>
                            <p className="text-gray-500 text-xs">Views</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Heart className="w-4 h-4 mr-2 text-red-500" />
                          <div>
                            <p className="font-semibold text-red-600">{job.videoMetrics.likes.toLocaleString()}</p>
                            <p className="text-gray-500 text-xs">Likes</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
                          <div>
                            <p className="font-semibold text-green-600">{job.videoMetrics.comments.toLocaleString()}</p>
                            <p className="text-gray-500 text-xs">Comments</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Budget</p>
                    <p className="font-semibold text-green-600 text-lg">{formatBudget(job.budget)}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Deadline</p>
                    <p className="font-medium text-gray-900">{formatDeadline(job.deadline)}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Target className="w-5 h-5 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Max Clips</p>
                    <p className="font-medium text-gray-900">{job.maxClips} clips</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Applications</p>
                    <p className="font-medium text-gray-900">{job.applicationCount}</p>
                  </div>
                </div>

                {job.averageViews && (
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-orange-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Avg. Views</p>
                      <p className="font-medium text-gray-900">{job.averageViews.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Application Button/Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              {!showApplication ? (
                <button
                  onClick={() => setShowApplication(true)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
                >
                  Apply for this Job
                </button>
              ) : (
                <form onSubmit={handleApplicationSubmit}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Application</h3>
                  
                  {applicationError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4 text-sm">
                      {applicationError}
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Application Message *
                    </label>
                    <textarea
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={4}
                      placeholder="Tell the creator why you're the right person for this job..."
                      value={applicationForm.message}
                      onChange={(e) => setApplicationForm({...applicationForm, message: e.target.value})}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Proposed Timeline
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 2-3 days"
                      value={applicationForm.proposedTimeline}
                      onChange={(e) => setApplicationForm({...applicationForm, proposedTimeline: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={applicationLoading}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                    >
                      {applicationLoading ? 'Submitting...' : 'Submit Application'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowApplication(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
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

export default JobDetail;