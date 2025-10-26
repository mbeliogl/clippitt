import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Youtube, Twitch, Upload, Plus, X, DollarSign, Calendar, Zap, Link2 } from 'lucide-react';
import { useAuth } from './AuthContext';

interface JobFormData {
  title: string;
  description: string;
  payoutPer1000Views: number;
  deadline: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  requirements: string;
  tags: string[];
  contentSource: 'upload' | 'youtube' | 'twitch';
  contentUrl?: string;
  contentTitle?: string;
  contentDuration?: string;
  uploadedFile?: File;
  videoMetrics?: {
    views: number;
    likes: number;
    comments: number;
    channelName: string;
    publishedAt: string;
    thumbnailUrl?: string;
  };
}

const JobCreation: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'source' | 'details'>('source');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    payoutPer1000Views: 10,
    deadline: '',
    difficulty: 'intermediate',
    requirements: '',
    tags: [],
    contentSource: 'upload'
  });
  
  const [newTag, setNewTag] = useState('');

  const handleSourceSelect = (source: 'upload' | 'youtube' | 'twitch') => {
    setFormData(prev => ({ ...prev, contentSource: source }));
    setCurrentStep('details');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        uploadedFile: file,
        contentTitle: file.name,
        title: prev.title || `Clip job for ${file.name}`
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleContentUrlSubmit = async () => {
    if (!formData.contentUrl) return;
    
    setLoading(true);
    try {
      // Simulate fetching YouTube data (Modern Wisdom example)
      if (formData.contentSource === 'youtube') {
        const mockYouTubeData = {
          contentTitle: "How To Get The World's Best Morning Routine - Andrew Huberman",
          contentDuration: "2:04:17",
          videoMetrics: {
            views: 1247000,
            likes: 42300,
            comments: 8900,
            channelName: "Chris Williamson",
            publishedAt: "2024-03-15T10:00:00Z",
            thumbnailUrl: "https://i.ytimg.com/vi/example/maxresdefault.jpg"
          }
        };
        
        setFormData(prev => ({
          ...prev,
          contentTitle: mockYouTubeData.contentTitle,
          contentDuration: mockYouTubeData.contentDuration,
          title: prev.title || `Create clips from: ${mockYouTubeData.contentTitle}`,
          videoMetrics: mockYouTubeData.videoMetrics
        }));
      } else if (formData.contentSource === 'twitch') {
        const mockTwitchData = {
          contentTitle: "Twitch Stream Highlight",
          contentDuration: "45:30",
          videoMetrics: {
            views: 125000,
            likes: 3400,
            comments: 890,
            channelName: "SampleStreamer",
            publishedAt: "2024-03-10T18:00:00Z"
          }
        };
        
        setFormData(prev => ({
          ...prev,
          contentTitle: mockTwitchData.contentTitle,
          contentDuration: mockTwitchData.contentDuration,
          title: prev.title || `Create clips from: ${mockTwitchData.contentTitle}`,
          videoMetrics: mockTwitchData.videoMetrics
        }));
      }
    } catch (error) {
      setError('Failed to fetch video information');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.deadline) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      if (!token) {
        setError('Please login to create a job');
        return;
      }

      const response = await fetch('http://localhost:3001/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.join(','),
          videoMetrics: formData.videoMetrics ? JSON.stringify(formData.videoMetrics) : null
        })
      });

      if (response.ok) {
        navigate('/creator-dashboard');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to create job');
      }
    } catch (error) {
      setError('Failed to create job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 relative z-10">
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
              <Link
                to="/creator-dashboard"
                className="flex items-center text-white/80 hover:text-white transition-colors duration-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {error && (
          <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 text-red-200 px-6 py-4 rounded-2xl mb-8 shadow-xl">
            {error}
          </div>
        )}

        {currentStep === 'source' && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Choose Content Source</h2>
              <p className="text-white/70 text-lg">How would you like to create your clipping job?</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* File Upload */}
              <button
                onClick={() => handleSourceSelect('upload')}
                className="group p-8 bg-white/5 backdrop-blur-sm border-2 border-white/20 hover:border-blue-400/50 hover:bg-white/10 rounded-2xl transition-all duration-300 text-center transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 group-hover:from-blue-400/30 group-hover:to-purple-400/30 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300">
                  <Upload className="w-10 h-10 text-blue-400 group-hover:text-blue-300" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-200 transition-colors">From Scratch</h3>
                <p className="text-white/70 group-hover:text-white/90 transition-colors">Upload your content directly</p>
              </button>

              {/* YouTube Integration */}
              <button
                onClick={() => handleSourceSelect('youtube')}
                className="group p-8 bg-white/5 backdrop-blur-sm border-2 border-white/20 hover:border-red-400/50 hover:bg-white/10 rounded-2xl transition-all duration-300 text-center transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-red-400/20 to-red-600/20 group-hover:from-red-400/30 group-hover:to-red-600/30 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300">
                  <Youtube className="w-10 h-10 text-red-400 group-hover:text-red-300" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-red-200 transition-colors">YouTube </h3>
                <p className="text-white/70 group-hover:text-white/90 transition-colors">Integrate content from a YouTube </p>
              </button>

              {/* Twitch Integration */}
              <button
                onClick={() => handleSourceSelect('twitch')}
                className="group p-8 bg-white/5 backdrop-blur-sm border-2 border-white/20 hover:border-purple-400/50 hover:bg-white/10 rounded-2xl transition-all duration-300 text-center transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400/20 to-purple-600/20 group-hover:from-purple-400/30 group-hover:to-purple-600/30 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300">
                  <Twitch className="w-10 h-10 text-purple-400 group-hover:text-purple-300" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-200 transition-colors">Twitch </h3>
                <p className="text-white/70 group-hover:text-white/90 transition-colors">Integrate content from Twitch</p>
              </button>
            </div>
          </div>
        )}

        {currentStep === 'details' && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-12">
            {/* Back Button */}
            <button
              onClick={() => setCurrentStep('source')}
              className="flex items-center text-white/80 hover:text-white mb-8 transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Change Source
            </button>


            {/* File Upload Section */}
            {formData.contentSource === 'upload' && (
              <div className="mb-8">
                <label className="block text-lg font-medium text-white mb-3">
                  Upload Content File
                </label>
                {!formData.uploadedFile ? (
                  <div className="relative">
                    <input
                      type="file"
                      accept="video/*,audio/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="fileUpload"
                    />
                    <label
                      htmlFor="fileUpload"
                      className="flex flex-col items-center justify-center w-full h-32 bg-white/5 backdrop-blur-sm border-2 border-dashed border-white/30 rounded-2xl cursor-pointer hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                    >
                      <Upload className="w-8 h-8 text-white/60 mb-2" />
                      <p className="text-white/70 font-medium">Click to upload video or audio file</p>
                      <p className="text-white/50 text-sm">Supports MP4, MOV, MP3, WAV, etc.</p>
                    </label>
                  </div>
                ) : (
                  <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                    <div className="flex items-center">
                      <Upload className="w-5 h-5 text-blue-400 mr-3" />
                      <div className="flex-1">
                        <p className="text-white font-medium">{formData.uploadedFile.name}</p>
                        <p className="text-white/60 text-sm">{(formData.uploadedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, uploadedFile: undefined, contentTitle: '' }))}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Content URL Input (for integrations) */}
            {(formData.contentSource === 'youtube' || formData.contentSource === 'twitch') && (
              <div className="mb-8">
                <label className="block text-lg font-medium text-white mb-3">
                  {formData.contentSource === 'youtube' ? 'YouTube Video URL' : 'Twitch VOD URL'}
                </label>
                <div className="flex">
                  <input
                    type="url"
                    name="contentUrl"
                    value={formData.contentUrl || ''}
                    onChange={handleInputChange}
                    placeholder={`https://${formData.contentSource === 'youtube' ? 'youtube.com/watch?v=' : 'twitch.tv/videos/'}...`}
                    className="flex-1 bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-white/50 rounded-l-2xl px-4 py-3 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={handleContentUrlSubmit}
                    disabled={loading || !formData.contentUrl}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-r-2xl disabled:from-gray-500 disabled:to-gray-500 flex items-center transition-all duration-300 shadow-lg"
                  >
                    <Link2 className="w-5 h-5" />
                  </button>
                </div>
                {formData.contentTitle && (
                  <div className="mt-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-lg mb-2">{formData.contentTitle}</h4>
                        <p className="text-white/60 text-sm mb-3">Duration: {formData.contentDuration}</p>
                        {formData.videoMetrics && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-white/50">Views</p>
                              <p className="text-blue-400 font-semibold">{formData.videoMetrics.views.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-white/50">Likes</p>
                              <p className="text-green-400 font-semibold">{formData.videoMetrics.likes.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-white/50">Comments</p>
                              <p className="text-purple-400 font-semibold">{formData.videoMetrics.comments.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-white/50">Channel</p>
                              <p className="text-white font-semibold">{formData.videoMetrics.channelName}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Title */}
              <div>
                <label htmlFor="title" className="block text-lg font-medium text-white mb-3">
                  Job Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Create viral clips from my podcast episode"
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-white/50 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-lg font-medium text-white mb-3">
                  Job Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="Describe what type of clips you're looking for, style preferences, target audience, etc."
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-white/50 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 resize-none"
                />
              </div>

              {/* Payout and Deadline Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="payoutPer1000Views" className="block text-lg font-medium text-white mb-3">
                    Payout per 1,000 Views (USD) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-white/60" />
                    </div>
                    <input
                      type="number"
                      id="payoutPer1000Views"
                      name="payoutPer1000Views"
                      value={formData.payoutPer1000Views}
                      onChange={handleInputChange}
                      min="1"
                      step="0.1"
                      required
                      className="w-full pl-10 pr-24 bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-white/50 rounded-2xl py-3 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-white/60 text-sm font-medium">/1K views</span>
                    </div>
                  </div>
                  <p className="text-sm text-white/60 mt-2 bg-white/5 rounded-xl px-3 py-2">Standard rate: $10 per 1,000 views</p>
                </div>

                <div>
                  <label htmlFor="deadline" className="block text-lg font-medium text-white mb-3">
                    Deadline *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-white/60" />
                    </div>
                    <input
                      type="date"
                      id="deadline"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-2xl py-3 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label htmlFor="difficulty" className="block text-lg font-medium text-white mb-3">
                  Difficulty Level
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Zap className="h-5 w-5 text-white/60" />
                  </div>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full pl-10 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-2xl py-3 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 appearance-none"
                  >
                    <option value="beginner" className="bg-gray-800 text-white">Beginner - Simple cuts and basic editing</option>
                    <option value="intermediate" className="bg-gray-800 text-white">Intermediate - Creative editing with effects</option>
                    <option value="advanced" className="bg-gray-800 text-white">Advanced - Complex storytelling and animations</option>
                  </select>
                </div>
                <span className={`inline-block mt-3 px-3 py-2 rounded-full text-sm font-medium backdrop-blur-sm ${getDifficultyColor(formData.difficulty)} border border-white/20`}>
                  {formData.difficulty}
                </span>
              </div>

              {/* Requirements */}
              <div>
                <label htmlFor="requirements" className="block text-lg font-medium text-white mb-3">
                  Specific Requirements
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Any specific requirements, style preferences, or technical specifications..."
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-white/50 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-lg font-medium text-white mb-3">
                  Tags (Optional)
                </label>
                <div className="flex flex-wrap gap-3 mb-4">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gradient-to-r from-blue-400/20 to-purple-400/20 text-white border border-white/30 backdrop-blur-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 hover:text-red-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Add tags (gaming, comedy, educational, etc.)"
                    className="flex-1 bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-white/50 rounded-l-2xl px-4 py-3 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-r-2xl border border-l-0 border-white/30 transition-all duration-300"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-6 pt-8">
                <Link
                  to="/creator-dashboard"
                  className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-2xl hover:bg-white/20 transition-all duration-300 font-medium"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-500 text-white rounded-2xl font-medium flex items-center transition-all duration-300 shadow-xl transform hover:scale-105"
                >
                  {loading ? 'Creating...' : 'Create Job'}
                  {!loading && <Plus className="w-5 h-5 ml-2" />}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCreation;