import express from 'express';
import { sql } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all purchase orders
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, supplier } = req.query;
    
    let query;
    if (status) {
      query = sql`SELECT * FROM purchase_orders WHERE status = ${status} ORDER BY date DESC`;
    } else if (supplier) {
      query = sql`SELECT * FROM purchase_orders WHERE supplier = ${supplier} ORDER BY date DESC`;
    } else {
      query = sql`SELECT * FROM purchase_orders ORDER BY date DESC`;
    }

    const pos = await query;
    res.json(pos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch purchase orders' });
  }
});

// Create purchase order
router.post('/', authenticate, async (req, res) => {
  try {
    const { supplierId, items, notes, dueDate } = req.body;
    
    // Generate PO ID
    const count = await sql`SELECT COUNT(*) as count FROM purchase_orders`;
    const poId = `PO${String(parseInt(count[0].count) + 1).padStart(3, '0')}`;

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const result = await sql`
      INSERT INTO purchase_orders (
        id, supplier, date, due_date, items, status, total_amount, notes
      ) VALUES (
        ${poId}, ${supplierId}, CURRENT_DATE, ${dueDate || null}, 
        ${JSON.stringify(items)}, 'pending', ${totalAmount}, ${notes || ''}
      )
      RETURNING *
    `;

    // Update supplier last_order
    await sql`
      UPDATE suppliers 
      SET last_order = CURRENT_DATE, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${supplierId}
    `;

    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Create PO error:', error);
    res.status(500).json({ error: 'Failed to create purchase order' });
  }
});

// Update purchase order status
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    
    const result = await sql`
      UPDATE purchase_orders 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${req.params.id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }

    // If status is 'received', update product quantities
    if (status === 'received') {
      const po = result[0];
      const items = JSON.parse(po.items);
      
      for (const item of items) {
        await sql`
          UPDATE products 
          SET qty = qty + ${item.qty}, 
              last_restocked = CURRENT_DATE,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ${item.productId}
        `;
      }
    }

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update purchase order' });
  }
});

// Delete purchase order
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const result = await sql`DELETE FROM purchase_orders WHERE id = ${req.params.id} RETURNING *`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }
    res.json({ message: 'Purchase order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete purchase order' });
  }
});

export default router;
