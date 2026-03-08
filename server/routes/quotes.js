import express from 'express';
import { sql } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all quotes
router.get('/', authenticate, async (req, res) => {
  try {
    const quotes = await sql`SELECT * FROM quotes ORDER BY date DESC`;
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

// Create quote
router.post('/', authenticate, async (req, res) => {
  try {
    const { customerName, items, total } = req.body;
    const quoteId = `Q-${Date.now().toString().slice(-4)}`;

    const result = await sql`
      INSERT INTO quotes (id, customer_name, date, items, total, status)
      VALUES (${quoteId}, ${customerName}, CURRENT_DATE, ${JSON.stringify(items)}, ${total}, 'Pending')
      RETURNING *
    `;

    res.status(201).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create quote' });
  }
});

// Update quote status
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    
    const result = await sql`
      UPDATE quotes 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${req.params.id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update quote' });
  }
});

// Delete quote
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const result = await sql`DELETE FROM quotes WHERE id = ${req.params.id} RETURNING *`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    res.json({ message: 'Quote deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete quote' });
  }
});

export default router;
