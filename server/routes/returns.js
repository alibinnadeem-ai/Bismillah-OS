import express from 'express';
import { sql } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all returns
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    
    let query;
    if (status) {
      query = sql`SELECT * FROM returns WHERE status = ${status} ORDER BY date DESC`;
    } else if (startDate && endDate) {
      query = sql`
        SELECT * FROM returns 
        WHERE date >= ${startDate} AND date <= ${endDate}
        ORDER BY date DESC
      `;
    } else {
      query = sql`SELECT * FROM returns ORDER BY date DESC`;
    }

    const returns = await query;
    res.json(returns);
  } catch (error) {
    console.error('Get returns error:', error);
    res.status(500).json({ error: 'Failed to fetch returns' });
  }
});

// Get return by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const returns = await sql`SELECT * FROM returns WHERE id = ${req.params.id}`;
    if (returns.length === 0) {
      return res.status(404).json({ error: 'Return not found' });
    }
    res.json(returns[0]);
  } catch (error) {
    console.error('Get return error:', error);
    res.status(500).json({ error: 'Failed to fetch return' });
  }
});

// Create return
router.post('/', authenticate, async (req, res) => {
  try {
    const { id, invoice, reason, refund, status, date } = req.body;

    const result = await sql`
      INSERT INTO returns (id, invoice, reason, refund, status, date)
      VALUES (
        ${id || `RET-${Date.now()}`}, 
        ${invoice || null}, 
        ${reason || ''}, 
        ${refund || 0}, 
        ${status || 'Pending'}, 
        ${date || new Date().toISOString().split('T')[0]}
      )
      RETURNING *
    `;

    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Create return error:', error);
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Return with this ID already exists' });
    }
    res.status(500).json({ error: 'Failed to create return' });
  }
});

// Update return
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { invoice, reason, refund, status, date } = req.body;
    
    const result = await sql`
      UPDATE returns 
      SET invoice = COALESCE(${invoice}, invoice),
          reason = COALESCE(${reason}, reason),
          refund = COALESCE(${refund}, refund),
          status = COALESCE(${status}, status),
          date = COALESCE(${date}, date),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${req.params.id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Return not found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Update return error:', error);
    res.status(500).json({ error: 'Failed to update return' });
  }
});

// Delete return
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const result = await sql`DELETE FROM returns WHERE id = ${req.params.id} RETURNING *`;
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Return not found' });
    }

    res.json({ message: 'Return deleted successfully' });
  } catch (error) {
    console.error('Delete return error:', error);
    res.status(500).json({ error: 'Failed to delete return' });
  }
});

export default router;
