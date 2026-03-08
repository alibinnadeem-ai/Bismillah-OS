import express from 'express';
import { sql } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all customers
router.get('/', authenticate, async (req, res) => {
  try {
    const customers = await sql`SELECT * FROM customers ORDER BY created_at DESC`;
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Get customer by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const customers = await sql`SELECT * FROM customers WHERE id = ${req.params.id}`;
    if (customers.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customers[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// Create customer
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, phone, cnic, email, address, preferences, budget, nextFollowUp, loyaltyTier } = req.body;

    // Generate customer ID
    const count = await sql`SELECT COUNT(*) as count FROM customers`;
    const customerId = `CUST${String(parseInt(count[0].count) + 1).padStart(3, '0')}`;

    const result = await sql`
      INSERT INTO customers (
        id, name, phone, cnic, email, address, join_date, 
        kyc_verified, total_purchases, total_spent, loyalty_points, 
        loyalty_tier, balance, preferences, budget, next_follow_up, portal_access
      ) VALUES (
        ${customerId}, ${name}, ${phone}, ${cnic || ''}, ${email || ''}, ${address || ''}, 
        CURRENT_DATE, false, 0, 0, 0, ${loyaltyTier || 'Bronze'}, 0, 
        ${preferences || ''}, ${budget || ''}, ${nextFollowUp || null}, false
      )
      RETURNING *
    `;

    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// Update customer
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { name, phone, email, address, preferences, budget, nextFollowUp, loyaltyTier } = req.body;
    
    const result = await sql`
      UPDATE customers 
      SET name = COALESCE(${name}, name),
          phone = COALESCE(${phone}, phone),
          email = COALESCE(${email}, email),
          address = COALESCE(${address}, address),
          preferences = COALESCE(${preferences}, preferences),
          budget = COALESCE(${budget}, budget),
          next_follow_up = COALESCE(${nextFollowUp}, next_follow_up),
          loyalty_tier = COALESCE(${loyaltyTier}, loyalty_tier),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${req.params.id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// Update customer balance (for receivables)
router.patch('/:id/balance', authenticate, async (req, res) => {
  try {
    const { amount, operation } = req.body; // operation: 'add' or 'subtract'
    
    let result;
    if (operation === 'add') {
      result = await sql`
        UPDATE customers 
        SET balance = balance + ${amount}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${req.params.id}
        RETURNING *
      `;
    } else if (operation === 'subtract') {
      result = await sql`
        UPDATE customers 
        SET balance = GREATEST(0, balance - ${amount}), updated_at = CURRENT_TIMESTAMP
        WHERE id = ${req.params.id}
        RETURNING *
      `;
    } else {
      return res.status(400).json({ error: 'Invalid operation' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update balance' });
  }
});

// Delete customer
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const result = await sql`DELETE FROM customers WHERE id = ${req.params.id} RETURNING *`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

export default router;
