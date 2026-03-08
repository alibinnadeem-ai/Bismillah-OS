# 🏪 Bismillah Mattress Store - Complete POS & Inventory System

A full-stack enterprise management system for mattress retail with **NeonDB (PostgreSQL)** backend, **Express.js** REST API, and **React** frontend.

## ✨ Features

- 🛒 **Point of Sale (POS)** - Fast checkout with barcode scanning
- 📦 **Inventory Management** - 25+ SKUs with stock tracking
- 👥 **CRM** - Customer loyalty tiers, Udhaar (credit) tracking
- 💰 **Accounting** - AR/AP ledgers, P&L statements, GST
- 🚚 **Logistics** - Delivery tracking and driver management
- 📋 **Purchasing** - Purchase orders with supplier management
- 👔 **HR** - Employee KPIs, commissions, attendance
- 🔧 **Service** - Warranty and service ticket management
- 📊 **Reports** - Sales, inventory valuation, customer insights (PDF export)
- 💳 **Payment Integrations** - Stripe, EasyPaisa, JazzCash ready
- 🔐 **JWT Authentication** - Secure role-based access
- 📱 **Responsive UI** - Works on desktop and tablets

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js v18+ and pnpm
- NeonDB account (free tier: https://neon.tech)

### Setup
```bash
# 1. Install dependencies
pnpm install

# 2. Configure NeonDB
copy .env.example .env
# Edit .env and add your DATABASE_URL from NeonDB

# 3. Run migrations (creates 20 tables + seed data)
cd server
node migrate.js

# 4. Start backend (Terminal 1)
node index.js

# 5. Start frontend (Terminal 2)
cd ..
pnpm run dev

# 6. Login at http://localhost:5173
# Email: admin@bismillah.pk
# Password: admin123
```

## 📁 Project Structure

```
bismillah_matress_store/
├── server/                    # Backend (Express.js + NeonDB)
│   ├── config/database.js     # NeonDB connection
│   ├── middleware/auth.js     # JWT authentication
│   ├── migrations/            # Database schema & seeds
│   ├── routes/                # 13 API route modules
│   ├── index.js               # Server entry point
│   └── migrate.js             # Migration runner
├── src/                       # Frontend (React + Vite)
│   ├── services/api.js        # API client with JWT
│   ├── App.jsx                # Main application
│   └── main.jsx
├── scripts/                   # Utilities
├── .env                       # Environment variables
├── package.json
└── Documentation/
    ├── SETUP_GUIDE.md         # Detailed setup
    ├── QUICK_START.md         # API reference
    └── IMPLEMENTATION_SUMMARY.md
```

## 🗄️ Database (20 Tables)

`users` `products` `customers` `employees` `suppliers` `transactions` `quotes` `expenses` `purchase_orders` `deliveries` `returns` `service_tickets` `ar_entries` `ap_entries` `warehouses` `special_orders` `audit_log` `notifications` `system_settings` `integrations`

## 🔌 API Endpoints

Base: `http://localhost:5000/api`

- Authentication: `/auth/login`, `/auth/logout`, `/auth/verify`
- Products: Full CRUD + stock management
- Customers: CRUD + balance updates
- Transactions: POS sales with auto-inventory
- Similar routes for: employees, suppliers, quotes, expenses, etc.

See [QUICK_START.md](QUICK_START.md) for complete API docs.

## 💻 Development

```bash
# Backend (with auto-reload)
cd server && node --watch index.js

# Frontend
pnpm run dev

# Migrations
pnpm run migrate
```

## 🔐 Security

✅ bcrypt password hashing  
✅ JWT authentication  
✅ SQL injection protection  
✅ CORS whitelisting  
✅ Role-based access  
✅ Complete audit trail

## 📚 Documentation

- 📖 [SETUP_GUIDE.md](SETUP_GUIDE.md) - Complete setup
- 📖 [QUICK_START.md](QUICK_START.md) - API reference
- 📖 [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Commands
- 📖 [TODO.md](TODO.md) - Frontend refactoring
- 📖 [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Architecture

## 🛠️ Tech Stack

**Frontend:** React 19, Vite 7, TailwindCSS, Recharts, jsPDF  
**Backend:** Node.js, Express.js 5, NeonDB (PostgreSQL), JWT  
**DevOps:** pnpm, ESLint, Git

## ⚠️ Current Status

**Backend:** ✅ 100% Complete (all endpoints ready)  
**Frontend:** ⏳ 95% Complete (needs API integration - see TODO.md)

## 📝 License

MIT License

---

**Made with ❤️ for Bismillah Mattress Store**  
**Version:** 1.0.0 | **Updated:** Jan 4, 2026
