import express from 'express';
import { sql } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get system settings
router.get('/system', authenticate, async (req, res) => {
  try {
    const settings = await sql`SELECT * FROM system_settings LIMIT 1`;
    if (settings.length === 0) {
      return res.status(404).json({ error: 'Settings not found' });
    }
    res.json(settings[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update system settings
router.put('/system', authenticate, async (req, res) => {
  try {
    const { storeName, storeAddress, storePhone, printerType, autoPrint, currency, taxRate } = req.body;
    
    const result = await sql`
      UPDATE system_settings 
      SET store_name = COALESCE(${storeName}, store_name),
          store_address = COALESCE(${storeAddress}, store_address),
          store_phone = COALESCE(${storePhone}, store_phone),
          printer_type = COALESCE(${printerType}, printer_type),
          auto_print = COALESCE(${autoPrint}, auto_print),
          currency = COALESCE(${currency}, currency),
          tax_rate = COALESCE(${taxRate}, tax_rate),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
      RETURNING *
    `;

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Get integrations
router.get('/integrations', authenticate, async (req, res) => {
  try {
    const integrations = await sql`SELECT * FROM integrations`;
    res.json(integrations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch integrations' });
  }
});

// Update integration
router.put('/integrations/:id', authenticate, async (req, res) => {
  try {
    const { enabled, config } = req.body;
    
    const result = await sql`
      UPDATE integrations 
      SET enabled = COALESCE(${enabled}, enabled),
          config = COALESCE(${config ? JSON.stringify(config) : null}, config),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${req.params.id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Integration not found' });
    }

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update integration' });
  }
});

// Get notifications
router.get('/notifications', authenticate, async (req, res) => {
  try {
    const { status } = req.query;
    
    let query;
    if (status) {
      query = sql`SELECT * FROM notifications WHERE status = ${status} ORDER BY date DESC`;
    } else {
      query = sql`SELECT * FROM notifications ORDER BY date DESC LIMIT 50`;
    }

    const notifications = await query;
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.put('/notifications/:id', authenticate, async (req, res) => {
  try {
    const result = await sql`
      UPDATE notifications 
      SET status = 'read', updated_at = CURRENT_TIMESTAMP
      WHERE id = ${req.params.id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Get audit log
router.get('/audit-log', authenticate, async (req, res) => {
  try {
    const { action, user, startDate, endDate } = req.query;
    
    let query;
    if (action) {
      query = sql`SELECT * FROM audit_log WHERE action = ${action} ORDER BY timestamp DESC LIMIT 100`;
    } else if (user) {
      query = sql`SELECT * FROM audit_log WHERE user = ${user} ORDER BY timestamp DESC LIMIT 100`;
    } else {
      query = sql`SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT 100`;
    }

    const logs = await query;
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit log' });
  }
});

// Get warehouses
router.get('/warehouses', authenticate, async (req, res) => {
  try {
    const warehouses = await sql`SELECT * FROM warehouses ORDER BY id`;
    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch warehouses' });
  }
});

// Get AR entries
router.get('/ar-entries', authenticate, async (req, res) => {
  try {
    const { status } = req.query;
    
    let query;
    if (status) {
      query = sql`SELECT * FROM ar_entries WHERE status = ${status} ORDER BY date DESC`;
    } else {
      query = sql`SELECT * FROM ar_entries ORDER BY date DESC`;
    }

    const entries = await query;
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch AR entries' });
  }
});

// Create AR entry
router.post('/ar-entries', authenticate, async (req, res) => {
  try {
    const { customer, amount, type } = req.body;
    const arId = `AR-${Date.now()}`;

    const result = await sql`
      INSERT INTO ar_entries (id, customer, amount, date, status, type)
      VALUES (${arId}, ${customer}, ${amount}, CURRENT_DATE, 'Paid', ${type || 'Payment In'})
      RETURNING *
    `;

    res.status(201).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create AR entry' });
  }
});

// Get AP entries
router.get('/ap-entries', authenticate, async (req, res) => {
  try {
    const { status } = req.query;
    
    let query;
    if (status) {
      query = sql`SELECT * FROM ap_entries WHERE status = ${status} ORDER BY date DESC`;
    } else {
      query = sql`SELECT * FROM ap_entries ORDER BY date DESC`;
    }

    const entries = await query;
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch AP entries' });
  }
});

export default router;
