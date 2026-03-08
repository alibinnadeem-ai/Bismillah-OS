import express from 'express';
import { sql } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all employees
router.get('/', authenticate, async (req, res) => {
  try {
    const employees = await sql`SELECT * FROM employees ORDER BY created_at DESC`;
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Get employee by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const employees = await sql`SELECT * FROM employees WHERE id = ${req.params.id}`;
    if (employees.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employees[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

// Create employee
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, role, phone, email, salary, department } = req.body;

    // Generate employee ID
    const count = await sql`SELECT COUNT(*) as count FROM employees`;
    const employeeId = `EMP${String(parseInt(count[0].count) + 1).padStart(3, '0')}`;

    const result = await sql`
      INSERT INTO employees (
        id, name, role, phone, email, salary, join_date, 
        status, commission, department, attendance, advance_salary, 
        kpi_score, targets
      ) VALUES (
        ${employeeId}, ${name}, ${role || 'Salesperson'}, ${phone || ''}, 
        ${email || ''}, ${salary || 0}, CURRENT_DATE, 'Active', 0, 
        ${department || 'Sales'}, 100, 0, 5.0, '{"sales": 1000000, "achieved": 0}'
      )
      RETURNING *
    `;

    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// Update employee
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { name, role, phone, email, salary, department, status, commission, kpi_score } = req.body;
    
    const result = await sql`
      UPDATE employees 
      SET name = COALESCE(${name}, name),
          role = COALESCE(${role}, role),
          phone = COALESCE(${phone}, phone),
          email = COALESCE(${email}, email),
          salary = COALESCE(${salary}, salary),
          department = COALESCE(${department}, department),
          status = COALESCE(${status}, status),
          commission = COALESCE(${commission}, commission),
          kpi_score = COALESCE(${kpi_score}, kpi_score),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${req.params.id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// Delete employee
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const result = await sql`DELETE FROM employees WHERE id = ${req.params.id} RETURNING *`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

export default router;
