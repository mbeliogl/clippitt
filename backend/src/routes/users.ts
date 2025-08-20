import { Router, Response } from 'express';
import pool from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Get user profile
router.get('/:id', async (req, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT id, first_name, last_name, username, role, avatar, bio, 
       rating, total_earnings, total_jobs, created_at 
       FROM users WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      rating: user.rating,
      totalEarnings: user.total_earnings,
      totalJobs: user.total_jobs,
      createdAt: user.created_at
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName, username, bio, avatar } = req.body;
    const userId = req.user!.id;

    // Check if username is taken by another user
    if (username) {
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE username = $1 AND id != $2',
        [username, userId]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Username already taken' });
      }
    }

    // Update user
    const result = await pool.query(
      `UPDATE users 
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           username = COALESCE($3, username),
           bio = COALESCE($4, bio),
           avatar = COALESCE($5, avatar),
           updated_at = NOW()
       WHERE id = $6
       RETURNING id, first_name, last_name, username, bio, avatar`,
      [firstName, lastName, username, bio, avatar, userId]
    );

    const user = result.rows[0];
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        bio: user.bio,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user statistics
router.get('/:id/stats', async (req, res: Response) => {
  try {
    const { id } = req.params;
    
    // Get user basic info
    const userResult = await pool.query(
      'SELECT role FROM users WHERE id = $1',
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userRole = userResult.rows[0].role;

    if (userRole === 'creator') {
      // Creator stats
      const jobsResult = await pool.query(
        `SELECT 
           COUNT(*) as total_jobs,
           COUNT(CASE WHEN status = 'active' THEN 1 END) as active_jobs,
           COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_jobs,
           COALESCE(SUM(budget), 0) as total_budget
         FROM jobs WHERE creator_id = $1`,
        [id]
      );

      const clipsResult = await pool.query(
        `SELECT COUNT(*) as total_clips_received
         FROM clips c
         JOIN jobs j ON c.job_id = j.id
         WHERE j.creator_id = $1`,
        [id]
      );

      res.json({
        role: 'creator',
        totalJobs: parseInt(jobsResult.rows[0].total_jobs),
        activeJobs: parseInt(jobsResult.rows[0].active_jobs),
        completedJobs: parseInt(jobsResult.rows[0].completed_jobs),
        totalBudget: parseFloat(jobsResult.rows[0].total_budget),
        totalClipsReceived: parseInt(clipsResult.rows[0].total_clips_received)
      });
    } else {
      // Clipper stats
      const clipsResult = await pool.query(
        `SELECT 
           COUNT(*) as total_clips,
           COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_clips,
           COUNT(CASE WHEN status = 'live' THEN 1 END) as live_clips,
           COALESCE(SUM(earnings), 0) as total_earnings,
           COALESCE(SUM(views), 0) as total_views
         FROM clips WHERE clipper_id = $1`,
        [id]
      );

      const applicationsResult = await pool.query(
        `SELECT 
           COUNT(*) as total_applications,
           COUNT(CASE WHEN status = 'accepted' THEN 1 END) as accepted_applications
         FROM job_applications WHERE clipper_id = $1`,
        [id]
      );

      res.json({
        role: 'clipper',
        totalClips: parseInt(clipsResult.rows[0].total_clips),
        approvedClips: parseInt(clipsResult.rows[0].approved_clips),
        liveClips: parseInt(clipsResult.rows[0].live_clips),
        totalEarnings: parseFloat(clipsResult.rows[0].total_earnings),
        totalViews: parseInt(clipsResult.rows[0].total_views),
        totalApplications: parseInt(applicationsResult.rows[0].total_applications),
        acceptedApplications: parseInt(applicationsResult.rows[0].accepted_applications)
      });
    }
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;