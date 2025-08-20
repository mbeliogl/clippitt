export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  role: 'creator' | 'clipper';
  avatar?: string;
  bio?: string;
  rating?: number;
  totalEarnings?: number;
  totalJobs?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Job {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  videoUrl: string;
  videoDuration: number;
  budget: number;
  deadline: Date;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  status: 'active' | 'in_progress' | 'completed' | 'cancelled';
  requirements?: string;
  maxClips?: number;
  averageViews?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobApplication {
  id: string;
  jobId: string;
  clipperId: string;
  message: string;
  proposedTimeline: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface Clip {
  id: string;
  jobId: string;
  clipperId: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  startTime: number;
  endTime: number;
  status: 'submitted' | 'approved' | 'rejected' | 'live';
  platform?: string;
  views?: number;
  engagement?: number;
  earnings?: number;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  jobId: string;
  clipId?: string;
  creatorId: string;
  clipperId: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  paymentMethod?: string;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  reviewerId: string;
  revieweeId: string;
  jobId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}