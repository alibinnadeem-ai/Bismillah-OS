# 🎯 Quick Reference Card

## Setup (First Time)
```bash
# 1. Get NeonDB connection string from https://neon.tech
# 2. Copy .env.example to .env and add your DATABASE_URL
# 3. Run migrations
cd server && node migrate.js

# 4. Start backend (Terminal 1)
node index.js

# 5. Start frontend (Terminal 2)
cd .. && pnpm run dev
```

## Daily Development
```bash
# Backend (Terminal 1)
cd server && node --watch index.js

# Frontend (Terminal 2)
pnpm run dev
```

## Default Login
- **Email**: admin@bismillah.pk
- **Password**: admin123
- **URL**: http://localhost:5173

## API Base URL
```
http://localhost:5000/api
```

## Common Commands
```bash
# Reset database
cd server && node migrate.js

# Check backend health
curl http://localhost:5000/health

# Kill port 5000
npx kill-port 5000

# Clear localStorage
# In browser console:
localStorage.clear()
```

## File Locations
- **Backend**: `server/index.js`
- **Routes**: `server/routes/*.js`
- **Migrations**: `server/migrations/*.sql`
- **API Client**: `src/services/api.js`
- **Frontend**: `src/App.jsx`
- **Env**: `.env`

## Quick API Test
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bismillah.pk","password":"admin123"}'

# Save the token, then:
TOKEN="your_token_here"

# Get products
curl http://localhost:5000/api/products \
  -H "Authorization: Bearer $TOKEN"
```

## Environment Variables
```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
PORT=5000
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

## Troubleshooting
| Issue | Solution |
|-------|----------|
| Database connection failed | Check DATABASE_URL in .env |
| Port 5000 in use | `npx kill-port 5000` |
| Login not working | Clear localStorage, restart backend |
| CORS errors | Check FRONTEND_URL matches |
| Migration errors | Drop tables in Neon dashboard, re-run migrate.js |

## Documentation
- 📖 [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Complete overview
- 📖 [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup
- 📖 [QUICK_START.md](QUICK_START.md) - API reference
- 📖 [TODO.md](TODO.md) - Remaining work

## Database Tables (20)
`users` `products` `customers` `employees` `suppliers` `transactions` `quotes` `expenses` `purchase_orders` `deliveries` `returns` `service_tickets` `ar_entries` `ap_entries` `warehouses` `special_orders` `audit_log` `notifications` `system_settings` `integrations`

## Package Scripts
```bash
pnpm run dev          # Frontend only
pnpm run server       # Backend only
pnpm run server:dev   # Backend with watch mode
pnpm run migrate      # Run database migrations
pnpm run build        # Build for production
```

---
**Status**: Backend ✅ | Frontend ⏳
**Support**: See SETUP_GUIDE.md
