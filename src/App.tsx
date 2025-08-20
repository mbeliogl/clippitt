import React, { useState } from 'react';
import { Play, Upload, DollarSign, TrendingUp, Users, Star, Clock, Eye, Share2, Search, Filter, Bell, User } from 'lucide-react';

// Type definitions
interface Job {
  id: number;
  creator: string;
  title: string;
  description: string;
  duration: string;
  budget: string;
  deadline: string;
  difficulty: string;
  tags: string[];
  applications: number;
  views: string;
  avatar: string;
}

interface Clip {
  id: number;
  title: string;
  creator: string;
  views: string;
  earnings: string;
  platform: string;
  status: string;
  engagement: string;
}

interface JobCardProps {
  job: Job;
}

interface ClipCardProps {
  clip: Clip;
}

function App() {
  const [activeTab, setActiveTab] = useState('browse');
  const [userType, setUserType] = useState<'clipper' | 'creator'>('clipper');

  // Mock data
  const jobs: Job[] = [
    {
      id: 1,
      creator: 'PodcastMaster',
      title: 'Weekly Tech Talk #127',
      description: 'Looking for 3-5 viral clips from our latest 2-hour episode about AI trends. Focus on controversial takes and funny moments.',
      duration: '2:14:32',
      budget: '$150',
      deadline: '3 days',
      difficulty: 'Medium',
      tags: ['Tech', 'AI', 'Comedy'],
      applications: 12,
      views: '1.2M avg',
      avatar: '🎙️'
    },
    {
      id: 2,
      creator: 'StreamerPro',
      title: 'Gaming Highlights - Valorant Tournament',
      description: 'Need epic gaming moments clipped. Looking for clutch plays, funny reactions, and team coordination moments.',
      duration: '4:32:15',
      budget: '$200',
      deadline: '2 days',
      difficulty: 'Easy',
      tags: ['Gaming', 'Esports', 'Valorant'],
      applications: 8,
      views: '800K avg',
      avatar: '🎮'
    },
    {
      id: 3,
      creator: 'BusinessTalk',
      title: 'Entrepreneur Interview Series',
      description: 'Professional clips needed for LinkedIn and Twitter. Clean cuts, good pacing, focus on actionable advice.',
      duration: '1:45:20',
      budget: '$100',
      deadline: '5 days',
      difficulty: 'Hard',
      tags: ['Business', 'Interview', 'Professional'],
      applications: 15,
      views: '500K avg',
      avatar: '💼'
    }
  ];

  const myClips: Clip[] = [
    {
      id: 1,
      title: 'AI Will Replace Developers?!',
      creator: 'TechGuru',
      views: '156K',
      earnings: '$45',
      platform: 'TikTok',
      status: 'Live',
      engagement: '8.2%'
    },
    {
      id: 2,
      title: 'Insane Valorant Ace',
      creator: 'ProGamer',
      views: '89K',
      earnings: '$32',
      platform: 'YouTube Shorts',
      status: 'Live',
      engagement: '12.1%'
    },
    {
      id: 3,
      title: 'Startup Fails Compilation',
      creator: 'BusinessPod',
      views: '234K',
      earnings: '$78',
      platform: 'Instagram',
      status: 'Pending Review',
      engagement: '6.7%'
    }
  ];

  const NavBar = () => (
    <div className="bg-gradient-to-r from-green-700 to-green-600 text-white p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="text-2xl font-bold">🎬 ClipIt</div>
          <div className="text-sm bg-white/20 px-2 py-1 rounded">BETA</div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex bg-white/20 rounded-lg p-1">
            <button 
              className={`px-4 py-2 rounded ${userType === 'clipper' ? 'bg-white text-purple-600' : 'text-white'}`}
              onClick={() => setUserType('clipper')}
            >
              Clipper
            </button>
            <button 
              className={`px-4 py-2 rounded ${userType === 'creator' ? 'bg-white text-purple-600' : 'text-white'}`}
              onClick={() => setUserType('creator')}
            >
              Creator
            </button>
          </div>
          
          <Bell className="w-5 h-5 cursor-pointer hover:text-yellow-300" />
          <div className="flex items-center space-x-2 cursor-pointer">
            <User className="w-5 h-5" />
            <span>Profile</span>
          </div>
        </div>
      </div>
    </div>
  );

  const TabNavigation = () => (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto flex space-x-8">
        {userType === 'clipper' ? (
          <>
            <button
              className={`py-4 px-2 border-b-2 font-medium ${activeTab === 'browse' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'}`}
              onClick={() => setActiveTab('browse')}
            >
              Browse Jobs
            </button>
            <button
              className={`py-4 px-2 border-b-2 font-medium ${activeTab === 'my-clips' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'}`}
              onClick={() => setActiveTab('my-clips')}
            >
              My Clips
            </button>
            <button
              className={`py-4 px-2 border-b-2 font-medium ${activeTab === 'earnings' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'}`}
              onClick={() => setActiveTab('earnings')}
            >
              Earnings
            </button>
          </>
        ) : (
          <>
            <button
              className={`py-4 px-2 border-b-2 font-medium ${activeTab === 'post-job' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'}`}
              onClick={() => setActiveTab('post-job')}
            >
              Post Job
            </button>
            <button
              className={`py-4 px-2 border-b-2 font-medium ${activeTab === 'active-jobs' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'}`}
              onClick={() => setActiveTab('active-jobs')}
            >
              Active Jobs
            </button>
            <button
              className={`py-4 px-2 border-b-2 font-medium ${activeTab === 'analytics' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'}`}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </button>
          </>
        )}
      </div>
    </div>
  );

  const JobCard: React.FC<JobCardProps> = ({ job }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{job.avatar}</div>
          <div>
            <h3 className="font-semibold text-lg">{job.title}</h3>
            <p className="text-gray-600">by {job.creator}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">{job.budget}</div>
          <div className="text-sm text-gray-500">Total Budget</div>
        </div>
      </div>
      
      <p className="text-gray-700 mb-4">{job.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {job.tags.map((tag: string) => (
          <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
            {tag}
          </span>
        ))}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          {job.duration}
        </div>
        <div className="flex items-center">
          <Eye className="w-4 h-4 mr-1" />
          {job.views}
        </div>
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-1" />
          {job.applications} applied
        </div>
        <div className="flex items-center">
          <Star className="w-4 h-4 mr-1" />
          {job.difficulty}
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-red-600 font-medium">Due in {job.deadline}</span>
        <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
          Apply Now
        </button>
      </div>
    </div>
  );

  const ClipCard: React.FC<ClipCardProps> = ({ clip }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold">{clip.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs ${clip.status === 'Live' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {clip.status}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-3">Creator: {clip.creator}</p>
      
      <div className="grid grid-cols-3 gap-3 text-sm mb-3">
        <div>
          <div className="text-gray-500">Views</div>
          <div className="font-semibold">{clip.views}</div>
        </div>
        <div>
          <div className="text-gray-500">Earnings</div>
          <div className="font-semibold text-green-600">{clip.earnings}</div>
        </div>
        <div>
          <div className="text-gray-500">Engagement</div>
          <div className="font-semibold">{clip.engagement}</div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">{clip.platform}</span>
        <button className="text-purple-600 hover:text-purple-800 flex items-center text-sm">
          <Share2 className="w-4 h-4 mr-1" />
          Share
        </button>
      </div>
    </div>
  );

  const BrowseJobs = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Available Clipping Jobs</h2>
          <p className="text-gray-600">Find your next viral clip opportunity</p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>
      
      <div className="grid gap-6">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );

  const MyClips = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Clips</h2>
          <p className="text-gray-600">Track your clip performance</p>
        </div>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2">
          <Upload className="w-4 h-4" />
          <span>Upload Clip</span>
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myClips.map(clip => (
          <ClipCard key={clip.id} clip={clip} />
        ))}
      </div>
    </div>
  );

  const Earnings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Earnings Dashboard</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Earnings</p>
              <p className="text-3xl font-bold">$1,247</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">This Month</p>
              <p className="text-3xl font-bold">$385</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Active Clips</p>
              <p className="text-3xl font-bold">23</p>
            </div>
            <Play className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold mb-4">Recent Payouts</h3>
        <div className="space-y-3">
          {[
            { clip: 'AI Will Replace Developers?!', amount: '$45', date: '2 days ago', status: 'Paid' },
            { clip: 'Startup Fails Compilation', amount: '$78', date: '5 days ago', status: 'Paid' },
            { clip: 'Insane Valorant Ace', amount: '$32', date: '1 week ago', status: 'Paid' }
          ].map((payout, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
              <div>
                <p className="font-medium">{payout.clip}</p>
                <p className="text-sm text-gray-600">{payout.date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">{payout.amount}</p>
                <p className="text-sm text-green-600">{payout.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const PostJob = () => (
    <div className="max-w-4xl space-y-6">
      <h2 className="text-2xl font-bold">Post a Clipping Job</h2>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content Title</label>
            <input
              type="text"
              placeholder="e.g., Weekly Tech Talk #127"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={4}
              placeholder="Describe what kind of clips you're looking for..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            ></textarea>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
              <input
                type="number"
                placeholder="150"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>1 day</option>
                <option>3 days</option>
                <option>1 week</option>
                <option>2 weeks</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content Upload</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Drop your video file here or click to upload</p>
              <p className="text-sm text-gray-500 mt-2">Supports MP4, MOV, AVI (max 5GB)</p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Save Draft
            </button>
            <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Post Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (userType === 'clipper') {
      switch (activeTab) {
        case 'browse': return <BrowseJobs />;
        case 'my-clips': return <MyClips />;
        case 'earnings': return <Earnings />;
        default: return <BrowseJobs />;
      }
    } else {
      switch (activeTab) {
        case 'post-job': return <PostJob />;
        case 'active-jobs': return <div className="text-center py-12 text-gray-600">Active jobs management coming soon...</div>;
        case 'analytics': return <div className="text-center py-12 text-gray-600">Analytics dashboard coming soon...</div>;
        default: return <PostJob />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <TabNavigation />
      
      <div className="max-w-6xl mx-auto py-8 px-4">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;