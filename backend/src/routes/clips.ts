import { Router, Response } from 'express';
import pool from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Get clips for a specific job
router.get('/job/:jobId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { jobId } = req.params;
    const userId = req.user!.id;

    // Check if user has access to this job's clips
    const jobResult = await pool.query(
      `SELECT creator_id FROM jobs WHERE id = $1`,
      [jobId]
    );

    if (jobResult.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const isJobCreator = jobResult.rows[0].creator_id === userId;

    // If not the job creator, only show user's own clips
    let query = `
      SELECT c.*, u.username as clipper_username, u.first_name, u.last_name, u.avatar
      FROM clips c
      JOIN users u ON c.clipper_id = u.id
      WHERE c.job_id = $1
    `;
    
    const queryParams = [jobId];

    if (!isJobCreator) {
      query += ` AND c.clipper_id = $2`;
      queryParams.push(userId);
    }

    query += ` ORDER BY c.created_at DESC`;

    const result = await pool.query(query, queryParams);

    const clips = result.rows.map(clip => ({
      id: clip.id,
      jobId: clip.job_id,
      clipperId: clip.clipper_id,
      clipper: {
        username: clip.clipper_username,
        firstName: clip.first_name,
        lastName: clip.last_name,
        avatar: clip.avatar
      },
      title: clip.title,
      description: clip.description,
      videoUrl: clip.video_url,
      thumbnailUrl: clip.thumbnail_url,
      duration: clip.duration,
      startTime: clip.start_time,
      endTime: clip.end_time,
      status: clip.status,
      platform: clip.platform,
      views: clip.views,
      engagement: clip.engagement,
      earnings: parseFloat(clip.earnings || 0),
      feedback: clip.feedback,
      createdAt: clip.created_at,
      updatedAt: clip.updated_at
    }));

    res.json(clips);
  } catch (error) {
    console.error('Get clips error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's clips
router.get('/my-clips', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { status, platform, page = 1, limit = 10 } = req.query;

    let query = `
      SELECT c.*, j.title as job_title, u.username as creator_username
      FROM clips c
      JOIN jobs j ON c.job_id = j.id
      JOIN users u ON j.creator_id = u.id
      WHERE c.clipper_id = $1
    `;
    
    const queryParams = [userId];
    let paramCount = 1;

    if (status) {
      paramCount++;
      query += ` AND c.status = $${paramCount}`;
      queryParams.push(status as string);
    }

    if (platform) {
      paramCount++;
      query += ` AND c.platform = $${paramCount}`;
      queryParams.push(platform as string);
    }

    const limitVal = parseInt(limit as string);
    const offsetVal = (parseInt(page as string) - 1) * limitVal;
    
    query += `
      ORDER BY c.created_at DESC
      LIMIT ${limitVal} OFFSET ${offsetVal}
    `;

    const result = await pool.query(query, queryParams);

    const clips = result.rows.map(clip => ({
      id: clip.id,
      jobId: clip.job_id,
      jobTitle: clip.job_title,
      creatorUsername: clip.creator_username,
      title: clip.title,
      description: clip.description,
      videoUrl: clip.video_url,
      thumbnailUrl: clip.thumbnail_url,
      duration: clip.duration,
      startTime: clip.start_time,
      endTime: clip.end_time,
      status: clip.status,
      platform: clip.platform,
      views: clip.views,
      engagement: clip.engagement,
      earnings: parseFloat(clip.earnings || 0),
      feedback: clip.feedback,
      createdAt: clip.created_at,
      updatedAt: clip.updated_at
    }));

    res.json(clips);
  } catch (error) {
    console.error('Get user clips error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit a clip
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const {
      jobId,
      title,
      description,
      videoUrl,
      thumbnailUrl,
      duration,
      startTime,
      endTime,
      platform
    } = req.body;

    const clipperId = req.user!.id;

    if (!jobId || !title || !videoUrl || !duration || startTime === undefined || endTime === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify the clipper has been accepted for this job
    const applicationResult = await pool.query(
      `SELECT status FROM job_applications 
       WHERE job_id = $1 AND clipper_id = $2 AND status = 'accepted'`,
      [jobId, clipperId]
    );

    if (applicationResult.rows.length === 0) {
      return res.status(403).json({ error: 'You must be accepted for this job to submit clips' });
    }

    // Verify job is still active or in progress
    const jobResult = await pool.query(
      'SELECT status FROM jobs WHERE id = $1',
      [jobId]
    );

    if (jobResult.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const jobStatus = jobResult.rows[0].status;
    if (!['active', 'in_progress'].includes(jobStatus)) {
      return res.status(400).json({ error: 'Job is no longer accepting clips' });
    }

    const result = await pool.query(
      `INSERT INTO clips (
        job_id, clipper_id, title, description, video_url, thumbnail_url,
        duration, start_time, end_time, platform
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [jobId, clipperId, title, description, videoUrl, thumbnailUrl, duration, startTime, endTime, platform]
    );

    const clip = result.rows[0];

    // Update job status to in_progress if it was active
    if (jobStatus === 'active') {
      await pool.query(
        'UPDATE jobs SET status = $1, updated_at = NOW() WHERE id = $2',
        ['in_progress', jobId]
      );
    }

    res.status(201).json({
      message: 'Clip submitted successfully',
      clip: {
        id: clip.id,
        jobId: clip.job_id,
        clipperId: clip.clipper_id,
        title: clip.title,
        description: clip.description,
        videoUrl: clip.video_url,
        thumbnailUrl: clip.thumbnail_url,
        duration: clip.duration,
        startTime: clip.start_time,
        endTime: clip.end_time,
        status: clip.status,
        platform: clip.platform,
        createdAt: clip.created_at
      }
    });
  } catch (error) {
    console.error('Submit clip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update clip status (job creator only)
router.put('/:id/status', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id: clipId } = req.params;
    const { status, feedback } = req.body;
    const userId = req.user!.id;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Valid status required (approved/rejected)' });
    }

    // Verify user owns the job this clip belongs to
    const clipResult = await pool.query(
      `SELECT c.*, j.creator_id 
       FROM clips c
       JOIN jobs j ON c.job_id = j.id
       WHERE c.id = $1`,
      [clipId]
    );

    if (clipResult.rows.length === 0) {
      return res.status(404).json({ error: 'Clip not found' });
    }

    const clip = clipResult.rows[0];
    if (clip.creator_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (clip.status !== 'submitted') {
      return res.status(400).json({ error: 'Can only approve/reject submitted clips' });
    }

    const result = await pool.query(
      `UPDATE clips 
       SET status = $1, feedback = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [status, feedback, clipId]
    );

    const updatedClip = result.rows[0];

    res.json({
      message: `Clip ${status} successfully`,
      clip: {
        id: updatedClip.id,
        status: updatedClip.status,
        feedback: updatedClip.feedback,
        updatedAt: updatedClip.updated_at
      }
    });
  } catch (error) {
    console.error('Update clip status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update clip performance data
router.put('/:id/performance', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id: clipId } = req.params;
    const { views, engagement, earnings } = req.body;
    const userId = req.user!.id;

    // Verify user owns this clip
    const clipResult = await pool.query(
      'SELECT clipper_id FROM clips WHERE id = $1',
      [clipId]
    );

    if (clipResult.rows.length === 0) {
      return res.status(404).json({ error: 'Clip not found' });
    }

    if (clipResult.rows[0].clipper_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(
      `UPDATE clips 
       SET views = COALESCE($1, views),
           engagement = COALESCE($2, engagement),
           earnings = COALESCE($3, earnings),
           updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [views, engagement, earnings, clipId]
    );

    const updatedClip = result.rows[0];

    res.json({
      message: 'Clip performance updated successfully',
      clip: {
        id: updatedClip.id,
        views: updatedClip.views,
        engagement: updatedClip.engagement,
        earnings: parseFloat(updatedClip.earnings || 0),
        updatedAt: updatedClip.updated_at
      }
    });
  } catch (error) {
    console.error('Update clip performance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;