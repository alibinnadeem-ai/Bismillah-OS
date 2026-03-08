import express from 'express';
import { sql } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all special orders
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, customerId, startDate, endDate } = req.query;
    
    let query;
    if (status) {
      query = sql`SELECT * FROM special_orders WHERE status = ${status} ORDER BY date DESC`;
    } else if (customerId) {
      query = sql`SELECT * FROM special_orders WHERE customer_id = ${customerId} ORDER BY date DESC`;
    } else if (startDate && endDate) {
      query = sql`
        SELECT * FROM special_orders 
        WHERE date >= ${startDate} AND date <= ${endDate}
        ORDER BY date DESC
      `;
    } else {
      query = sql`SELECT * FROM special_orders ORDER BY date DESC`;
    }

    const orders = await query;
    res.json(orders);
  } catch (error) {
    console.error('Get special orders error:', error);
    res.status(500).json({ error: 'Failed to fetch special orders' });
  }
});

// Get special order by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const orders = await sql`SELECT * FROM special_orders WHERE id = ${req.params.id}`;
    if (orders.length === 0) {
      return res.status(404).json({ error: 'Special order not found' });
    }
    res.json(orders[0]);
  } catch (error) {
    console.error('Get special order error:', error);
    res.status(500).json({ error: 'Failed to fetch special order' });
  }
});

// Create special order
router.post('/', authenticate, async (req, res) => {
  try {
    const { id, customer_id, items, status, date } = req.body;

    // Validate items is a valid JSON object/array
    let itemsJson = items;
    if (typeof items === 'string') {
      try {
        itemsJson = JSON.parse(items);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid items format' });
      }
    }

    const result = await sql`
      INSERT INTO special_orders (id, customer_id, items, status, date)
      VALUES (
        ${id || `SO-${Date.now()}`}, 
        ${customer_id || null}, 
        ${JSON.stringify(itemsJson)}, 
        ${status || 'Pending'}, 
        ${date || new Date().toISOString().split('T')[0]}
      )
      RETURNING *
    `;

    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Create special order error:', error);
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Special order with this ID already exists' });
    }
    if (error.code === '23503') {
      return res.status(400).json({ error: 'Invalid customer ID' });
    }
    res.status(500).json({ error: 'Failed to create special order' });
  }
});

// Update special order
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { customer_id, items, status, date } = req.body;
    
    // Handle items JSON conversion if needed
    let itemsJson = items;
    if (items && typeof items === 'string') {
      try {
        itemsJson = JSON.parse(items);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid items format' });
      }
    }

    const result = await sql`
      UPDATE special_orders 
      SET customer_id = COALESCE(${customer_id}, customer_id),
          items = COALESCE(${itemsJson ? JSON.stringify(itemsJson) : null}, items),
          status = COALESCE(${status}, status),
          date = COALESCE(${date}, date),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${req.params.id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Special order not found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Update special order error:', error);
    if (error.code === '23503') {
      return res.status(400).json({ error: 'Invalid customer ID' });
    }
    res.status(500).json({ error: 'Failed to update special order' });
  }
});

// Delete special order
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const result = await sql`DELETE FROM special_orders WHERE id = ${req.params.id} RETURNING *`;
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Special order not found' });
    }

    res.json({ message: 'Special order deleted successfully' });
  } catch (error) {
    console.error('Delete special order error:', error);
    res.status(500).json({ error: 'Failed to delete special order' });
  }
});

export default router;
