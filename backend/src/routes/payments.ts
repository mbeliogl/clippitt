import { Router, Response } from 'express';
import pool from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Get user's payment history
router.get('/history', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { page = 1, limit = 10, status } = req.query;

    let query = `
      SELECT p.*, j.title as job_title, 
             CASE 
               WHEN p.creator_id = $1 THEN u2.username 
               ELSE u1.username 
             END as other_party_username,
             CASE 
               WHEN p.creator_id = $1 THEN 'outgoing'
               ELSE 'incoming'
             END as payment_type
      FROM payments p
      JOIN jobs j ON p.job_id = j.id
      JOIN users u1 ON p.creator_id = u1.id
      JOIN users u2 ON p.clipper_id = u2.id
      WHERE p.creator_id = $1 OR p.clipper_id = $1
    `;
    
    const queryParams = [userId];
    let paramCount = 1;

    if (status) {
      paramCount++;
      query += ` AND p.status = $${paramCount}`;
      queryParams.push(status as string);
    }

    const limitVal = parseInt(limit as string);
    const offsetVal = (parseInt(page as string) - 1) * limitVal;
    
    query += `
      ORDER BY p.created_at DESC
      LIMIT ${limitVal} OFFSET ${offsetVal}
    `;

    const result = await pool.query(query, queryParams);

    const payments = result.rows.map(payment => ({
      id: payment.id,
      jobId: payment.job_id,
      jobTitle: payment.job_title,
      clipId: payment.clip_id,
      amount: parseFloat(payment.amount),
      status: payment.status,
      paymentType: payment.payment_type,
      otherParty: payment.other_party_username,
      paymentMethod: payment.payment_method,
      transactionId: payment.transaction_id,
      createdAt: payment.created_at,
      updatedAt: payment.updated_at
    }));

    res.json(payments);
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create payment for approved clip (job creator only)
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { clipId, amount, paymentMethod } = req.body;
    const userId = req.user!.id;

    if (!clipId || !amount) {
      return res.status(400).json({ error: 'Clip ID and amount are required' });
    }

    // Verify user owns the job and clip is approved
    const clipResult = await pool.query(
      `SELECT c.*, j.creator_id, j.id as job_id
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

    if (clip.status !== 'approved') {
      return res.status(400).json({ error: 'Can only create payments for approved clips' });
    }

    // Check if payment already exists for this clip
    const existingPayment = await pool.query(
      'SELECT id FROM payments WHERE clip_id = $1',
      [clipId]
    );

    if (existingPayment.rows.length > 0) {
      return res.status(400).json({ error: 'Payment already exists for this clip' });
    }

    const result = await pool.query(
      `INSERT INTO payments (job_id, clip_id, creator_id, clipper_id, amount, payment_method)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [clip.job_id, clipId, userId, clip.clipper_id, amount, paymentMethod]
    );

    const payment = result.rows[0];

    res.status(201).json({
      message: 'Payment created successfully',
      payment: {
        id: payment.id,
        jobId: payment.job_id,
        clipId: payment.clip_id,
        creatorId: payment.creator_id,
        clipperId: payment.clipper_id,
        amount: parseFloat(payment.amount),
        status: payment.status,
        paymentMethod: payment.payment_method,
        createdAt: payment.created_at
      }
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update payment status
router.put('/:id/status', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id: paymentId } = req.params;
    const { status, transactionId } = req.body;
    const userId = req.user!.id;

    if (!status || !['paid', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Valid status required (paid/cancelled)' });
    }

    // Verify user is involved in this payment
    const paymentResult = await pool.query(
      'SELECT * FROM payments WHERE id = $1 AND (creator_id = $2 OR clipper_id = $2)',
      [paymentId, userId]
    );

    if (paymentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found or access denied' });
    }

    const payment = paymentResult.rows[0];

    // Only creator can mark as paid, both can cancel
    if (status === 'paid' && payment.creator_id !== userId) {
      return res.status(403).json({ error: 'Only the job creator can mark payment as paid' });
    }

    if (payment.status !== 'pending') {
      return res.status(400).json({ error: 'Can only update pending payments' });
    }

    const result = await pool.query(
      `UPDATE payments 
       SET status = $1, transaction_id = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [status, transactionId, paymentId]
    );

    const updatedPayment = result.rows[0];

    // If payment is marked as paid, update clipper's total earnings
    if (status === 'paid') {
      await pool.query(
        `UPDATE users 
         SET total_earnings = total_earnings + $1, updated_at = NOW()
         WHERE id = $2`,
        [payment.amount, payment.clipper_id]
      );

      // Update clip earnings
      await pool.query(
        `UPDATE clips 
         SET earnings = $1, updated_at = NOW()
         WHERE id = $2`,
        [payment.amount, payment.clip_id]
      );
    }

    res.json({
      message: `Payment ${status} successfully`,
      payment: {
        id: updatedPayment.id,
        status: updatedPayment.status,
        transactionId: updatedPayment.transaction_id,
        updatedAt: updatedPayment.updated_at
      }
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get payment statistics
router.get('/stats', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    if (userRole === 'creator') {
      // Creator payment stats
      const result = await pool.query(
        `SELECT 
           COUNT(*) as total_payments,
           COALESCE(SUM(CASE WHEN status = 'paid' THEN amount END), 0) as total_paid,
           COALESCE(SUM(CASE WHEN status = 'pending' THEN amount END), 0) as pending_amount,
           COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_count,
           COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count
         FROM payments 
         WHERE creator_id = $1`,
        [userId]
      );

      const stats = result.rows[0];
      res.json({
        role: 'creator',
        totalPayments: parseInt(stats.total_payments),
        totalPaid: parseFloat(stats.total_paid),
        pendingAmount: parseFloat(stats.pending_amount),
        paidCount: parseInt(stats.paid_count),
        pendingCount: parseInt(stats.pending_count)
      });
    } else {
      // Clipper payment stats
      const result = await pool.query(
        `SELECT 
           COUNT(*) as total_payments,
           COALESCE(SUM(CASE WHEN status = 'paid' THEN amount END), 0) as total_earned,
           COALESCE(SUM(CASE WHEN status = 'pending' THEN amount END), 0) as pending_earnings,
           COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_count,
           COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count
         FROM payments 
         WHERE clipper_id = $1`,
        [userId]
      );

      const stats = result.rows[0];
      res.json({
        role: 'clipper',
        totalPayments: parseInt(stats.total_payments),
        totalEarned: parseFloat(stats.total_earned),
        pendingEarnings: parseFloat(stats.pending_earnings),
        paidCount: parseInt(stats.paid_count),
        pendingCount: parseInt(stats.pending_count)
      });
    }
  } catch (error) {
    console.error('Get payment stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;