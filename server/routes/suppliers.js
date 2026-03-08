import express from 'express';
import { sql } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all suppliers
router.get('/', authenticate, async (req, res) => {
  try {
    const suppliers = await sql`SELECT * FROM suppliers ORDER BY created_at DESC`;
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});

// Get supplier by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const suppliers = await sql`SELECT * FROM suppliers WHERE id = ${req.params.id}`;
    if (suppliers.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json(suppliers[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch supplier' });
  }
});

// Create supplier
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, phone, email, address, paymentTerms, contractExpires } = req.body;

    // Generate supplier ID
    const count = await sql`SELECT COUNT(*) as count FROM suppliers`;
    const supplierId = `SUP${String(parseInt(count[0].count) + 1).padStart(3, '0')}`;

    const result = await sql`
      INSERT INTO suppliers (
        id, name, phone, email, address, products, payment_terms, 
        last_order, rating, status, contract_expires, lead_time
      ) VALUES (
        ${supplierId}, ${name}, ${phone || ''}, ${email || ''}, ${address || ''}, 
        0, ${paymentTerms || '30 days'}, NULL, 0, 'Active', 
        ${contractExpires || null}, 7
      )
      RETURNING *
    `;

    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Create supplier error:', error);
    res.status(500).json({ error: 'Failed to create supplier' });
  }
});

// Update supplier
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { name, phone, email, address, paymentTerms, contractExpires, rating, status } = req.body;
    
    const result = await sql`
      UPDATE suppliers 
      SET name = COALESCE(${name}, name),
          phone = COALESCE(${phone}, phone),
          email = COALESCE(${email}, email),
          address = COALESCE(${address}, address),
          payment_terms = COALESCE(${paymentTerms}, payment_terms),
          contract_expires = COALESCE(${contractExpires}, contract_expires),
          rating = COALESCE(${rating}, rating),
          status = COALESCE(${status}, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${req.params.id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update supplier' });
  }
});

// Delete supplier
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const result = await sql`DELETE FROM suppliers WHERE id = ${req.params.id} RETURNING *`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete supplier' });
  }
});

export default router;
