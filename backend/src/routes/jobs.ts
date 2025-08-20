import { Router, Response } from 'express';
import pool from '../config/database';
import { authenticateToken, AuthRequest, requireRole } from '../middleware/auth';

const router = Router();

// Get all jobs (with filtering and pagination)
router.get('/', async (req, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status = 'active',
      difficulty,
      minBudget,
      maxBudget,
      tags,
      search 
    } = req.query;

    let query = `
      SELECT j.*, u.username as creator_username, u.avatar as creator_avatar,
             COUNT(ja.id) as application_count
      FROM jobs j
      JOIN users u ON j.creator_id = u.id
      LEFT JOIN job_applications ja ON j.id = ja.job_id
      WHERE j.status = $1
    `;
    
    const queryParams: any[] = [status];
    let paramCount = 1;

    if (difficulty) {
      paramCount++;
      query += ` AND j.difficulty = $${paramCount}`;
      queryParams.push(difficulty);
    }

    if (minBudget) {
      paramCount++;
      query += ` AND j.budget >= $${paramCount}`;
      queryParams.push(parseFloat(minBudget as string));
    }

    if (maxBudget) {
      paramCount++;
      query += ` AND j.budget <= $${paramCount}`;
      queryParams.push(parseFloat(maxBudget as string));
    }

    if (tags) {
      paramCount++;
      query += ` AND j.tags && $${paramCount}`;
      queryParams.push(Array.isArray(tags) ? tags : [tags]);
    }

    if (search) {
      paramCount++;
      query += ` AND (j.title ILIKE $${paramCount} OR j.description ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    const limitVal = parseInt(limit as string);
    const offsetVal = (parseInt(page as string) - 1) * limitVal;
    
    query += `
      GROUP BY j.id, u.username, u.avatar
      ORDER BY j.created_at DESC
      LIMIT ${limitVal} OFFSET ${offsetVal}
    `;

    const result = await pool.query(query, queryParams);

    const jobs = result.rows.map(job => ({
      id: job.id,
      creatorId: job.creator_id,
      creatorUsername: job.creator_username,
      creatorAvatar: job.creator_avatar,
      title: job.title,
      description: job.description,
      videoUrl: job.video_url,
      videoDuration: job.video_duration,
      budget: parseFloat(job.budget),
      deadline: job.deadline,
      difficulty: job.difficulty,
      tags: job.tags,
      status: job.status,
      requirements: job.requirements,
      maxClips: job.max_clips,
      averageViews: job.average_views,
      applicationCount: parseInt(job.application_count),
      createdAt: job.created_at,
      updatedAt: job.updated_at
    }));

    res.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific job
router.get('/:id', async (req, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT j.*, u.username as creator_username, u.avatar as creator_avatar,
              u.first_name, u.last_name, u.rating as creator_rating
       FROM jobs j
       JOIN users u ON j.creator_id = u.id
       WHERE j.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const job = result.rows[0];

    // Get application count
    const applicationResult = await pool.query(
      'SELECT COUNT(*) as count FROM job_applications WHERE job_id = $1',
      [id]
    );

    res.json({
      id: job.id,
      creatorId: job.creator_id,
      creator: {
        username: job.creator_username,
        firstName: job.first_name,
        lastName: job.last_name,
        avatar: job.creator_avatar,
        rating: job.creator_rating
      },
      title: job.title,
      description: job.description,
      videoUrl: job.video_url,
      videoDuration: job.video_duration,
      budget: parseFloat(job.budget),
      deadline: job.deadline,
      difficulty: job.difficulty,
      tags: job.tags,
      status: job.status,
      requirements: job.requirements,
      maxClips: job.max_clips,
      averageViews: job.average_views,
      applicationCount: parseInt(applicationResult.rows[0].count),
      createdAt: job.created_at,
      updatedAt: job.updated_at
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new job (creators only)
router.post('/', authenticateToken, requireRole('creator'), async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      videoUrl,
      videoDuration,
      budget,
      deadline,
      difficulty,
      tags = [],
      requirements,
      maxClips = 5,
      averageViews
    } = req.body;

    if (!title || !description || !videoUrl || !videoDuration || !budget || !deadline || !difficulty) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return res.status(400).json({ error: 'Invalid difficulty level' });
    }

    const result = await pool.query(
      `INSERT INTO jobs (
        creator_id, title, description, video_url, video_duration, 
        budget, deadline, difficulty, tags, requirements, max_clips, average_views
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        req.user!.id, title, description, videoUrl, videoDuration,
        budget, deadline, difficulty, tags, requirements, maxClips, averageViews
      ]
    );

    const job = result.rows[0];

    res.status(201).json({
      message: 'Job created successfully',
      job: {
        id: job.id,
        creatorId: job.creator_id,
        title: job.title,
        description: job.description,
        videoUrl: job.video_url,
        videoDuration: job.video_duration,
        budget: parseFloat(job.budget),
        deadline: job.deadline,
        difficulty: job.difficulty,
        tags: job.tags,
        status: job.status,
        requirements: job.requirements,
        maxClips: job.max_clips,
        averageViews: job.average_views,
        createdAt: job.created_at
      }
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Apply to job (clippers only)
router.post('/:id/apply', authenticateToken, requireRole('clipper'), async (req: AuthRequest, res: Response) => {
  try {
    const { id: jobId } = req.params;
    const { message, proposedTimeline } = req.body;
    const clipperId = req.user!.id;

    if (!message) {
      return res.status(400).json({ error: 'Application message is required' });
    }

    // Check if job exists and is active
    const jobResult = await pool.query(
      'SELECT status FROM jobs WHERE id = $1',
      [jobId]
    );

    if (jobResult.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (jobResult.rows[0].status !== 'active') {
      return res.status(400).json({ error: 'Job is not accepting applications' });
    }

    // Check if user already applied
    const existingApplication = await pool.query(
      'SELECT id FROM job_applications WHERE job_id = $1 AND clipper_id = $2',
      [jobId, clipperId]
    );

    if (existingApplication.rows.length > 0) {
      return res.status(400).json({ error: 'You have already applied to this job' });
    }

    const result = await pool.query(
      `INSERT INTO job_applications (job_id, clipper_id, message, proposed_timeline)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [jobId, clipperId, message, proposedTimeline]
    );

    const application = result.rows[0];

    res.status(201).json({
      message: 'Application submitted successfully',
      application: {
        id: application.id,
        jobId: application.job_id,
        clipperId: application.clipper_id,
        message: application.message,
        proposedTimeline: application.proposed_timeline,
        status: application.status,
        createdAt: application.created_at
      }
    });
  } catch (error) {
    console.error('Job application error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get job applications (job creator only)
router.get('/:id/applications', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id: jobId } = req.params;
    const userId = req.user!.id;

    // Verify user owns this job
    const jobResult = await pool.query(
      'SELECT creator_id FROM jobs WHERE id = $1',
      [jobId]
    );

    if (jobResult.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (jobResult.rows[0].creator_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(
      `SELECT ja.*, u.username, u.first_name, u.last_name, u.avatar, u.rating
       FROM job_applications ja
       JOIN users u ON ja.clipper_id = u.id
       WHERE ja.job_id = $1
       ORDER BY ja.created_at DESC`,
      [jobId]
    );

    const applications = result.rows.map(app => ({
      id: app.id,
      jobId: app.job_id,
      clipper: {
        id: app.clipper_id,
        username: app.username,
        firstName: app.first_name,
        lastName: app.last_name,
        avatar: app.avatar,
        rating: app.rating
      },
      message: app.message,
      proposedTimeline: app.proposed_timeline,
      status: app.status,
      createdAt: app.created_at,
      updatedAt: app.updated_at
    }));

    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;