import express from 'express';
import { sql } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all expenses
router.get('/', authenticate, async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;
    
    let query;
    if (category) {
      query = sql`SELECT * FROM expenses WHERE category = ${category} ORDER BY date DESC`;
    } else if (startDate && endDate) {
      query = sql`SELECT * FROM expenses WHERE date BETWEEN ${startDate} AND ${endDate} ORDER BY date DESC`;
    } else {
      query = sql`SELECT * FROM expenses ORDER BY date DESC`;
    }

    const expenses = await query;
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Create expense
router.post('/', authenticate, async (req, res) => {
  try {
    const { category, amount, date, note } = req.body;

    const result = await sql`
      INSERT INTO expenses (category, amount, date, note)
      VALUES (${category}, ${amount}, ${date}, ${note || ''})
      RETURNING *
    `;

    // Create audit log
    await sql`
      INSERT INTO audit_log (timestamp, action, user, details)
      VALUES (CURRENT_TIMESTAMP, 'Expense', ${req.user.name}, 
              'Recorded expense: ' || ${category} || ' - Rs.' || ${amount})
    `;

    res.status(201).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// Update expense
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { category, amount, date, note } = req.body;
    
    const result = await sql`
      UPDATE expenses 
      SET category = COALESCE(${category}, category),
          amount = COALESCE(${amount}, amount),
          date = COALESCE(${date}, date),
          note = COALESCE(${note}, note),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${req.params.id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// Delete expense
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const result = await sql`DELETE FROM expenses WHERE id = ${req.params.id} RETURNING *`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

export default router;
