import express from 'express';
import { sql } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all products
router.get('/', authenticate, async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let query;
    if (category && category !== 'all') {
      query = sql`SELECT * FROM products WHERE category = ${category} ORDER BY id`;
    } else if (search) {
      query = sql`
        SELECT * FROM products 
        WHERE brand ILIKE ${'%' + search + '%'} 
           OR sku ILIKE ${'%' + search + '%'}
        ORDER BY id
      `;
    } else {
      query = sql`SELECT * FROM products ORDER BY id`;
    }

    const products = await query;
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const products = await sql`SELECT * FROM products WHERE id = ${req.params.id}`;
    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(products[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product
router.post('/', authenticate, async (req, res) => {
  try {
    const { sku, category, brand, dim, price, cost, qty, supplier, barcode, location } = req.body;

    const result = await sql`
      INSERT INTO products (
        sku, category, brand, dim, price, cost, qty, 
        reorder_level, min_level, max_level, supplier, 
        last_restocked, barcode, warranty, reorder_qty, location, variants
      ) VALUES (
        ${sku}, ${category}, ${brand}, ${dim || ''}, ${price || 0}, ${cost || 0}, ${qty || 0},
        5, 2, 20, ${supplier || 'General Stock'}, CURRENT_DATE, 
        ${barcode || ''}, 'Standard', 5, ${location || 'Showroom'}, '[]'
      )
      RETURNING *
    `;

    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { price, cost, qty, reorder_level, supplier, location } = req.body;
    
    const result = await sql`
      UPDATE products 
      SET price = COALESCE(${price}, price),
          cost = COALESCE(${cost}, cost),
          qty = COALESCE(${qty}, qty),
          reorder_level = COALESCE(${reorder_level}, reorder_level),
          supplier = COALESCE(${supplier}, supplier),
          location = COALESCE(${location}, location),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${req.params.id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const result = await sql`DELETE FROM products WHERE id = ${req.params.id} RETURNING *`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Update stock quantity
router.patch('/:id/stock', authenticate, async (req, res) => {
  try {
    const { qty, operation } = req.body; // operation: 'add' or 'subtract'
    
    let result;
    if (operation === 'add') {
      result = await sql`
        UPDATE products 
        SET qty = qty + ${qty}, 
            last_restocked = CURRENT_DATE,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${req.params.id}
        RETURNING *
      `;
    } else if (operation === 'subtract') {
      result = await sql`
        UPDATE products 
        SET qty = GREATEST(0, qty - ${qty}),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${req.params.id}
        RETURNING *
      `;
    } else {
      return res.status(400).json({ error: 'Invalid operation' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update stock' });
  }
});

export default router;
