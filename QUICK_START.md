# Quick Start Commands

## 🚀 Development

### Start Backend Only
```bash
pnpm run server:dev
```

### Start Frontend Only
```bash
pnpm run dev
```

### Start Both (Frontend + Backend)
```bash
# Install concurrently first
pnpm add -D concurrently

# Then run both
pnpm run dev:all
```

## 🗄️ Database

### Run Migrations
```bash
pnpm run migrate
```

### Reset Database
```bash
# Drop all tables in NeonDB dashboard, then:
pnpm run migrate
```

## 📝 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/verify` - Verify token

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `PATCH /api/products/:id/stock` - Update stock
- `DELETE /api/products/:id` - Delete product

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `PATCH /api/customers/:id/balance` - Update balance
- `DELETE /api/customers/:id` - Delete customer

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `GET /api/suppliers/:id` - Get supplier by ID
- `POST /api/suppliers` - Create supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier

### Transactions (Sales)
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:invoiceNumber` - Get by invoice
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:invoiceNumber` - Update transaction

### Quotes
- `GET /api/quotes` - Get all quotes
- `POST /api/quotes` - Create quote
- `PUT /api/quotes/:id` - Update quote
- `DELETE /api/quotes/:id` - Delete quote

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Purchase Orders
- `GET /api/purchase-orders` - Get all POs
- `POST /api/purchase-orders` - Create PO
- `PUT /api/purchase-orders/:id` - Update PO
- `DELETE /api/purchase-orders/:id` - Delete PO

### Deliveries
- `GET /api/deliveries` - Get all deliveries
- `POST /api/deliveries` - Create delivery
- `PUT /api/deliveries/:id` - Update delivery
- `DELETE /api/deliveries/:id` - Delete delivery

### Service Tickets
- `GET /api/service-tickets` - Get all tickets
- `POST /api/service-tickets` - Create ticket
- `PUT /api/service-tickets/:id` - Update ticket
- `DELETE /api/service-tickets/:id` - Delete ticket

### Settings
- `GET /api/settings/system` - Get system settings
- `PUT /api/settings/system` - Update system settings
- `GET /api/settings/integrations` - Get integrations
- `PUT /api/settings/integrations/:id` - Update integration
- `GET /api/settings/notifications` - Get notifications
- `PUT /api/settings/notifications/:id` - Mark as read
- `GET /api/settings/audit-log` - Get audit log
- `GET /api/settings/warehouses` - Get warehouses
- `GET /api/settings/ar-entries` - Get AR entries
- `POST /api/settings/ar-entries` - Create AR entry
- `GET /api/settings/ap-entries` - Get AP entries

## 🔐 Authentication Headers

All protected endpoints require:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 💡 Example API Calls

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bismillah.pk","password":"admin123"}'
```

### Get Products
```bash
curl http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Customer
```bash
curl -X POST http://localhost:5000/api/customers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "03001234567",
    "cnic": "12345-1234567-1",
    "email": "john@example.com",
    "address": "123 Street, City",
    "loyaltyTier": "Bronze"
  }'
```

### Create Transaction (POS Sale)
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUST001",
    "customerName": "Ahmed Ali Khan",
    "items": [{"id": 1, "cartQty": 1, "price": 45000, "brand": "Master Ortho Firm"}],
    "subtotal": 45000,
    "gst": 7650,
    "discount": 0,
    "finalTotal": 52650,
    "paymentMethod": "cash",
    "type": "sale"
  }'
```

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000

# Or use different port
PORT=5001 pnpm run server
```

### Database Connection Error
1. Check your .env file
2. Verify NeonDB connection string
3. Test with: `psql YOUR_CONNECTION_STRING`

### Clear All Data
```bash
# In browser console
localStorage.clear()
```

---

**Quick Links:**
- 📖 [Full Setup Guide](./SETUP_GUIDE.md)
- 🗄️ [Database Schema](./server/migrations/001_create_tables.sql)
- 🌱 [Seed Data](./server/migrations/002_seed_data.sql)
