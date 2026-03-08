import express from 'express';
import { sql } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all transactions
router.get('/', authenticate, async (req, res) => {
  try {
    const { startDate, endDate, customerId, paymentMethod } = req.query;
    
    let query = sql`SELECT * FROM transactions WHERE 1=1`;
    
    if (startDate) {
      query = sql`SELECT * FROM transactions WHERE date >= ${startDate}`;
    }
    if (endDate) {
      query = sql`SELECT * FROM transactions WHERE date <= ${endDate}`;
    }
    if (customerId) {
      query = sql`SELECT * FROM transactions WHERE customer_id = ${customerId}`;
    }
    if (paymentMethod) {
      query = sql`SELECT * FROM transactions WHERE payment_method = ${paymentMethod}`;
    }

    const transactions = await sql`SELECT * FROM transactions ORDER BY date DESC`;
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get transaction by invoice number
router.get('/:invoiceNumber', authenticate, async (req, res) => {
  try {
    const transactions = await sql`
      SELECT * FROM transactions WHERE invoice_number = ${req.params.invoiceNumber}
    `;
    if (transactions.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transactions[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

// Create transaction (POS checkout)
router.post('/', authenticate, async (req, res) => {
  try {
    const { 
      customerId, customerName, items, subtotal, gst, discount, 
      finalTotal, paymentMethod, deliveryDate, type, deposit, balance 
    } = req.body;

    const result = await sql`
      INSERT INTO transactions (
        date, customer_id, customer_name, items, subtotal, gst, discount, 
        final_total, payment_method, delivery_status, delivery_date, type, deposit, balance
      ) VALUES (
        CURRENT_TIMESTAMP, ${customerId || null}, ${customerName}, ${JSON.stringify(items)}, 
        ${subtotal}, ${gst}, ${discount}, ${finalTotal}, ${paymentMethod}, 
        'Pending', ${deliveryDate || null}, ${type || 'sale'}, 
        ${deposit || null}, ${balance || null}
      )
      RETURNING *
    `;

    // Update product quantities
    for (const item of items) {
      await sql`
        UPDATE products 
        SET qty = GREATEST(0, qty - ${item.cartQty}),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${item.id}
      `;
    }

    // Update customer stats if customer exists
    if (customerId) {
      await sql`
        UPDATE customers 
        SET total_purchases = total_purchases + 1,
            total_spent = total_spent + ${finalTotal},
            loyalty_points = loyalty_points + ${Math.floor(finalTotal / 100)},
            balance = CASE 
              WHEN ${paymentMethod} = 'credit' THEN balance + ${finalTotal}
              ELSE balance
            END,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${customerId}
      `;
    }

    // Create audit log
    await sql`
      INSERT INTO audit_log (timestamp, action, user, details)
      VALUES (CURRENT_TIMESTAMP, 'Transaction', ${req.user.name}, 
              'Created invoice #' || ${result[0].invoice_number} || ' - Rs.' || ${finalTotal})
    `;

    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Update transaction (delivery status, etc.)
router.put('/:invoiceNumber', authenticate, async (req, res) => {
  try {
    const { deliveryStatus, deliveryDate } = req.body;
    
    const result = await sql`
      UPDATE transactions 
      SET delivery_status = COALESCE(${deliveryStatus}, delivery_status),
          delivery_date = COALESCE(${deliveryDate}, delivery_date),
          updated_at = CURRENT_TIMESTAMP
      WHERE invoice_number = ${req.params.invoiceNumber}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

export default router;
