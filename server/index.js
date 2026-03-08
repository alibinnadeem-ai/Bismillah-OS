import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';

// Import routes
import authRoutes from './routes/auth.js';
import productsRoutes from './routes/products.js';
import customersRoutes from './routes/customers.js';
import employeesRoutes from './routes/employees.js';
import suppliersRoutes from './routes/suppliers.js';
import transactionsRoutes from './routes/transactions.js';
import quotesRoutes from './routes/quotes.js';
import expensesRoutes from './routes/expenses.js';
import purchaseOrdersRoutes from './routes/purchaseOrders.js';
import deliveriesRoutes from './routes/deliveries.js';
import serviceTicketsRoutes from './routes/serviceTickets.js';
import settingsRoutes from './routes/settings.js';
import returnsRoutes from './routes/returns.js';
import specialOrdersRoutes from './routes/specialOrders.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Bismillah Mattress Store API is running' });
});

// Routes
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler - must be last route
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('❌ Failed to connect to database. Exiting...');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API: http://localhost:${PORT}`);
      console.log(`🔗 Health: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
