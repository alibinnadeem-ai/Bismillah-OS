import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from '../server/routes/auth.js';
import productsRoutes from '../server/routes/products.js';
import customersRoutes from '../server/routes/customers.js';
import employeesRoutes from '../server/routes/employees.js';
import suppliersRoutes from '../server/routes/suppliers.js';
import transactionsRoutes from '../server/routes/transactions.js';
import quotesRoutes from '../server/routes/quotes.js';
import expensesRoutes from '../server/routes/expenses.js';
import purchaseOrdersRoutes from '../server/routes/purchaseOrders.js';
import deliveriesRoutes from '../server/routes/deliveries.js';
import serviceTicketsRoutes from '../server/routes/serviceTickets.js';
import settingsRoutes from '../server/routes/settings.js';
import returnsRoutes from '../server/routes/returns.js';
import specialOrdersRoutes from '../server/routes/specialOrders.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Bismillah Mattress Store API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/quotes', quotesRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/purchase-orders', purchaseOrdersRoutes);
app.use('/api/deliveries', deliveriesRoutes);
app.use('/api/service-tickets', serviceTicketsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/returns', returnsRoutes);
app.use('/api/special-orders', specialOrdersRoutes);

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;
