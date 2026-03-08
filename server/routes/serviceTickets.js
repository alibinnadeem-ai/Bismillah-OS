import express from 'express';
import { sql } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all service tickets
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, priority } = req.query;
    
    let query;
    if (status) {
      query = sql`SELECT * FROM service_tickets WHERE status = ${status} ORDER BY date DESC`;
    } else if (priority) {
      query = sql`SELECT * FROM service_tickets WHERE priority = ${priority} ORDER BY date DESC`;
    } else {
      query = sql`SELECT * FROM service_tickets ORDER BY date DESC`;
    }

    const tickets = await query;
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service tickets' });
  }
});

// Create service ticket
router.post('/', authenticate, async (req, res) => {
  try {
    const { customerName, phone, issue, priority, invoiceRef } = req.body;
    
    const ticketId = `TKT-${Date.now()}`;

    const result = await sql`
      INSERT INTO service_tickets (
        id, customer_name, phone, issue, priority, status, invoice_ref, date
      ) VALUES (
        ${ticketId}, ${customerName}, ${phone}, ${issue}, 
        ${priority || 'Normal'}, 'Open', ${invoiceRef || null}, CURRENT_DATE
      )
      RETURNING *
    `;

    res.status(201).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service ticket' });
  }
});

// Update service ticket
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { status, priority } = req.body;
    
    const result = await sql`
      UPDATE service_tickets 
      SET status = COALESCE(${status}, status),
          priority = COALESCE(${priority}, priority),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${req.params.id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Service ticket not found' });
    }

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update service ticket' });
  }
});

// Delete service ticket
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const result = await sql`DELETE FROM service_tickets WHERE id = ${req.params.id} RETURNING *`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Service ticket not found' });
    }
    res.json({ message: 'Service ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service ticket' });
  }
});

export default router;
