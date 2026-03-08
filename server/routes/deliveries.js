import express from 'express';
import { sql } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all deliveries
router.get('/', authenticate, async (req, res) => {
  try {
    const { status } = req.query;
    
    let query;
    if (status) {
      query = sql`SELECT * FROM deliveries WHERE status = ${status} ORDER BY date DESC`;
    } else {
      query = sql`SELECT * FROM deliveries ORDER BY date DESC`;
    }

    const deliveries = await query;
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deliveries' });
  }
});

// Create delivery
router.post('/', authenticate, async (req, res) => {
  try {
    const { invoice, customer, address, date, driver, vehicle, items } = req.body;
    
    // Generate delivery ID
    const count = await sql`SELECT COUNT(*) as count FROM deliveries`;
    const deliveryId = `DEL${String(parseInt(count[0].count) + 1).padStart(3, '0')}`;

    const result = await sql`
      INSERT INTO deliveries (
        id, invoice, customer, address, status, date, driver, vehicle, items
      ) VALUES (
        ${deliveryId}, ${invoice || ''}, ${customer}, ${address}, 
        'Scheduled', ${date}, ${driver || ''}, ${vehicle || ''}, ${items || ''}
      )
      RETURNING *
    `;

    res.status(201).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create delivery' });
  }
});

// Update delivery status
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { status, driver, vehicle } = req.body;
    
    const result = await sql`
      UPDATE deliveries 
      SET status = COALESCE(${status}, status),
          driver = COALESCE(${driver}, driver),
          vehicle = COALESCE(${vehicle}, vehicle),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${req.params.id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update delivery' });
  }
});

// Delete delivery
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const result = await sql`DELETE FROM deliveries WHERE id = ${req.params.id} RETURNING *`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Delivery not found' });
    }
    res.json({ message: 'Delivery deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete delivery' });
  }
});

export default router;
