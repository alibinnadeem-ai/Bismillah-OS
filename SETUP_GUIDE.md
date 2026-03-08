# 🚀 NeonDB Integration Setup Guide

This document provides complete instructions for setting up and running the Bismillah Mattress Store with NeonDB (PostgreSQL) backend.

## 📋 Prerequisites

- Node.js v18+ installed
- pnpm package manager
- NeonDB account (free tier available at https://neon.tech)
- Git (for version control)

## 🔧 Setup Instructions

### Step 1: Get Your NeonDB Connection String

1. Go to https://neon.tech and create a free account
2. Create a new project
3. Copy your connection string (it looks like):
   ```
   postgresql://username:password@ep-example.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### Step 2: Configure Environment Variables

1. Navigate to the project root directory
2. Copy the `.env.example` file:
   ```bash
   copy .env.example .env
   ```

3. Edit `.env` and add your NeonDB connection string:
   ```env
   DATABASE_URL=postgresql://YOUR_ACTUAL_CONNECTION_STRING_HERE
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:5173
   ```

### Step 3: Run Database Migrations

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Run the migration script:
   ```bash
   node migrate.js
   ```

   You should see output like:
   ```
   ✅ Database connected successfully
   📝 Creating tables...
   ✅ Tables created successfully
   📝 Seeding initial data...
   ✅ Seed data inserted successfully
   🎉 Migration completed successfully!
   ```

### Step 4: Start the Backend Server

```bash
# From the server directory
node index.js

# OR use watch mode for development
node --watch index.js
```

The server will start on http://localhost:5000

### Step 5: Start the Frontend

Open a new terminal and run:

```bash
# From the project root
pnpm run dev
```

The frontend will start on http://localhost:5173

### Step 6: Login

Use the default admin credentials:
- **Email**: admin@bismillah.pk
- **Password**: admin123

## 📊 What's Been Created

### Database Tables (20 total)
- ✅ users (authentication)
- ✅ products (inventory)
- ✅ customers (CRM)
- ✅ employees (HR)
- ✅ suppliers
- ✅ transactions (sales)
- ✅ quotes
- ✅ expenses
- ✅ purchase_orders
- ✅ deliveries
- ✅ returns
- ✅ service_tickets
- ✅ ar_entries (accounts receivable)
- ✅ ap_entries (accounts payable)
- ✅ warehouses
- ✅ special_orders
- ✅ audit_log
- ✅ notifications
- ✅ system_settings
- ✅ integrations

### Initial Seed Data
- 25 products (mattresses & cushions)
- 2 employees
- 4 suppliers
- 1 customer
- 1 sample transaction
- 1 purchase order
- 1 delivery
- 3 notifications
- System settings
- 4 integrations (Stripe, EasyPaisa, JazzCash, Cash Drawer)

## 🔄 Migrating Existing localStorage Data

If you have existing data in localStorage, you can migrate it:

1. Login to the application
2. Open browser DevTools console (F12)
3. Load the migration script in the console
4. Run the migration function

The migration script is available at: `scripts/migrate-localstorage.js`

## 🧪 Testing the API

### Health Check
```bash
curl http://localhost:5000/health
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bismillah.pk","password":"admin123"}'
```

### Get Products (requires authentication)
```bash
curl http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📁 Project Structure

```
bismillah_matress_store/
├── server/                    # Backend (Express.js)
│   ├── config/
│   │   └── database.js       # NeonDB connection
│   ├── middleware/
│   │   └── auth.js           # JWT authentication
│   ├── migrations/
│   │   ├── 001_create_tables.sql
│   │   └── 002_seed_data.sql
│   ├── routes/               # API endpoints
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── customers.js
│   │   ├── employees.js
│   │   ├── suppliers.js
│   │   ├── transactions.js
│   │   ├── quotes.js
│   │   ├── expenses.js
│   │   ├── purchaseOrders.js
│   │   ├── deliveries.js
│   │   ├── serviceTickets.js
│   │   └── settings.js
│   ├── index.js              # Server entry point
│   ├── migrate.js            # Database migration runner
│   └── package.json
├── src/                      # Frontend (React)
│   ├── services/
│   │   └── api.js            # API service layer
│   ├── App.jsx               # Main application
│   └── ...
├── scripts/
│   └── migrate-localstorage.js  # Migration helper
├── .env                      # Environment variables
├── .env.example              # Example env file
├── package.json
└── vite.config.js            # Vite with API proxy
```

## 🔐 Security Notes

1. **Change JWT Secret**: Update `JWT_SECRET` in `.env` with a strong random string
2. **Secure Database**: Never commit `.env` file to version control
3. **Production**: Set `NODE_ENV=production` in production
4. **CORS**: Update `FRONTEND_URL` for production deployment
5. **Password Hashing**: All passwords are hashed with bcrypt (10 rounds)

## 🚀 Deployment

### Backend (Railway/Heroku/Render)
1. Set environment variables in hosting platform
2. Deploy the `server` directory
3. Run `node migrate.js` once after deployment
4. Start with `node index.js`

### Frontend (Vercel/Netlify)
1. Set `VITE_API_URL` to your backend URL
2. Build: `pnpm run build`
3. Deploy `dist` folder

## 🐛 Troubleshooting

### Database Connection Failed
- Verify your NeonDB connection string
- Check if your IP is whitelisted in Neon (free tier allows all IPs)
- Ensure SSL mode is enabled

### Migration Errors
- Drop all tables and re-run: `node migrate.js`
- Check NeonDB dashboard for error logs

### CORS Errors
- Verify `FRONTEND_URL` in backend `.env`
- Check Vite proxy configuration

### Authentication Issues
- Clear localStorage: `localStorage.clear()`
- Verify JWT_SECRET is same between restarts
- Check token expiration

## 📞 Support

For issues or questions:
1. Check the migration output for errors
2. Review API logs in terminal
3. Check browser console for frontend errors
4. Verify all environment variables are set

## ✅ Next Steps

1. ✅ Customize system settings from Settings page
2. ✅ Add more products, customers, employees
3. ✅ Configure payment integrations (Stripe, etc.)
4. ✅ Set up automated backups in NeonDB
5. ✅ Deploy to production

---

**Last Updated**: January 4, 2026
**Version**: 1.0.0
