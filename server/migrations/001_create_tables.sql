-- ==================== BISMILLAH MATTRESS STORE DATABASE SCHEMA ====================
-- Created: 2026-01-04
-- Database: NeonDB (PostgreSQL)
-- Purpose: Complete schema for inventory, sales, CRM, accounting, and operations

-- ==================== USERS & AUTHENTICATION ====================
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'salesperson',
  is_authenticated BOOLEAN DEFAULT false,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ==================== EMPLOYEES & HR ====================
CREATE TABLE IF NOT EXISTS employees (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(255) UNIQUE,
  salary DECIMAL(12, 2) DEFAULT 0,
  join_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'Active',
  commission DECIMAL(12, 2) DEFAULT 0,
  department VARCHAR(100),
  attendance INTEGER DEFAULT 100,
  advance_salary DECIMAL(12, 2) DEFAULT 0,
  kpi_score DECIMAL(3, 1) DEFAULT 5.0,
  targets JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_employees_department ON employees(department);

-- ==================== SUPPLIERS ====================
CREATE TABLE IF NOT EXISTS suppliers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  products INTEGER DEFAULT 0,
  payment_terms VARCHAR(100),
  last_order DATE,
  rating DECIMAL(2, 1) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'Active',
  contract_expires DATE,
  lead_time INTEGER DEFAULT 7,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_suppliers_status ON suppliers(status);

-- ==================== PRODUCTS & INVENTORY ====================
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(100) NOT NULL,
  brand VARCHAR(255) NOT NULL,
  dim VARCHAR(100),
  price DECIMAL(12, 2) DEFAULT 0,
  cost DECIMAL(12, 2) DEFAULT 0,
  qty INTEGER DEFAULT 0,
  reorder_level INTEGER DEFAULT 5,
  min_level INTEGER DEFAULT 1,
  max_level INTEGER DEFAULT 100,
  supplier VARCHAR(255),
  last_restocked DATE,
  barcode VARCHAR(100),
  warranty VARCHAR(100),
  reorder_qty INTEGER DEFAULT 10,
  margin DECIMAL(5, 2) DEFAULT 0,
  location VARCHAR(255),
  variants JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_products_qty ON products(qty);

-- ==================== CUSTOMERS & CRM ====================
CREATE TABLE IF NOT EXISTS customers (
  id VARCHAR(50) PRIMARY KEY,
  cnic VARCHAR(50),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  address TEXT,
  join_date DATE NOT NULL,
  kyc_verified BOOLEAN DEFAULT false,
  total_purchases INTEGER DEFAULT 0,
  total_spent DECIMAL(12, 2) DEFAULT 0,
  loyalty_points INTEGER DEFAULT 0,
  loyalty_tier VARCHAR(50) DEFAULT 'Bronze',
  birth_date DATE,
  referred_by VARCHAR(50),
  balance DECIMAL(12, 2) DEFAULT 0,
  preferences TEXT,
  budget VARCHAR(100),
  next_follow_up DATE,
  portal_access BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_loyalty_tier ON customers(loyalty_tier);
CREATE INDEX idx_customers_cnic ON customers(cnic);

-- ==================== TRANSACTIONS & SALES ====================
CREATE TABLE IF NOT EXISTS transactions (
  invoice_number SERIAL PRIMARY KEY,
  date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  customer_id VARCHAR(50),
  customer_name VARCHAR(255) NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  gst DECIMAL(12, 2) DEFAULT 0,
  discount DECIMAL(12, 2) DEFAULT 0,
  final_total DECIMAL(12, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  delivery_status VARCHAR(50),
  delivery_date DATE,
  type VARCHAR(50) DEFAULT 'sale',
  deposit DECIMAL(12, 2),
  balance DECIMAL(12, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_customer_id ON transactions(customer_id);
CREATE INDEX idx_transactions_payment_method ON transactions(payment_method);
CREATE INDEX idx_transactions_type ON transactions(type);

-- ==================== QUOTES & ESTIMATES ====================
CREATE TABLE IF NOT EXISTS quotes (
  id VARCHAR(50) PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  items JSONB NOT NULL,
  total DECIMAL(12, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_date ON quotes(date);

-- ==================== EXPENSES ====================
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  date DATE NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_date ON expenses(date);

-- ==================== PURCHASE ORDERS ====================
CREATE TABLE IF NOT EXISTS purchase_orders (
  id VARCHAR(50) PRIMARY KEY,
  supplier VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  due_date DATE,
  items JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  total_amount DECIMAL(12, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier) REFERENCES suppliers(id) ON DELETE CASCADE
);

CREATE INDEX idx_po_status ON purchase_orders(status);
CREATE INDEX idx_po_supplier ON purchase_orders(supplier);
CREATE INDEX idx_po_date ON purchase_orders(date);

-- ==================== DELIVERIES ====================
CREATE TABLE IF NOT EXISTS deliveries (
  id VARCHAR(50) PRIMARY KEY,
  invoice VARCHAR(50),
  customer VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'Scheduled',
  date DATE NOT NULL,
  driver VARCHAR(255),
  vehicle VARCHAR(100),
  items TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_deliveries_status ON deliveries(status);
CREATE INDEX idx_deliveries_date ON deliveries(date);

-- ==================== RETURNS ====================
CREATE TABLE IF NOT EXISTS returns (
  id VARCHAR(50) PRIMARY KEY,
  invoice VARCHAR(50),
  reason TEXT,
  refund DECIMAL(12, 2),
  status VARCHAR(50),
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_returns_status ON returns(status);
CREATE INDEX idx_returns_date ON returns(date);

-- ==================== SERVICE TICKETS ====================
CREATE TABLE IF NOT EXISTS service_tickets (
  id VARCHAR(50) PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  issue TEXT NOT NULL,
  priority VARCHAR(50) DEFAULT 'Normal',
  status VARCHAR(50) DEFAULT 'Open',
  invoice_ref VARCHAR(50),
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tickets_status ON service_tickets(status);
CREATE INDEX idx_tickets_priority ON service_tickets(priority);

-- ==================== ACCOUNTS RECEIVABLE ====================
CREATE TABLE IF NOT EXISTS ar_entries (
  id VARCHAR(50) PRIMARY KEY,
  customer VARCHAR(50) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'Unpaid',
  type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE INDEX idx_ar_status ON ar_entries(status);
CREATE INDEX idx_ar_customer ON ar_entries(customer);

-- ==================== ACCOUNTS PAYABLE ====================
CREATE TABLE IF NOT EXISTS ap_entries (
  id VARCHAR(50) PRIMARY KEY,
  vendor VARCHAR(50) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'Unpaid',
  type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vendor) REFERENCES suppliers(id) ON DELETE CASCADE
);

CREATE INDEX idx_ap_status ON ap_entries(status);
CREATE INDEX idx_ap_vendor ON ap_entries(vendor);

-- ==================== WAREHOUSES ====================
CREATE TABLE IF NOT EXISTS warehouses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(100),
  type VARCHAR(50),
  capacity INTEGER DEFAULT 0,
  current INTEGER DEFAULT 0,
  address TEXT,
  manager VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_warehouses_type ON warehouses(type);

-- ==================== SPECIAL ORDERS ====================
CREATE TABLE IF NOT EXISTS special_orders (
  id VARCHAR(50) PRIMARY KEY,
  customer_id VARCHAR(50),
  items JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending',
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

CREATE INDEX idx_special_orders_status ON special_orders(status);

-- ==================== AUDIT LOG ====================
CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  action VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  details TEXT,
  change TEXT
);

CREATE INDEX idx_audit_timestamp ON audit_log(timestamp);
CREATE INDEX idx_audit_action ON audit_log(action);
CREATE INDEX idx_audit_user_name ON audit_log(user_name);

-- ==================== NOTIFICATIONS ====================
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  type VARCHAR(50),
  date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_type ON notifications(type);

-- ==================== SYSTEM SETTINGS ====================
CREATE TABLE IF NOT EXISTS system_settings (
  id SERIAL PRIMARY KEY,
  store_name VARCHAR(255),
  store_address TEXT,
  store_phone VARCHAR(50),
  printer_type VARCHAR(50) DEFAULT 'a4',
  auto_print BOOLEAN DEFAULT true,
  currency VARCHAR(10) DEFAULT 'PKR',
  tax_rate DECIMAL(5, 2) DEFAULT 17,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== INTEGRATIONS ====================
CREATE TABLE IF NOT EXISTS integrations (
  id VARCHAR(50) PRIMARY KEY,
  provider VARCHAR(100) NOT NULL,
  enabled BOOLEAN DEFAULT false,
  config JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_integrations_provider ON integrations(provider);
CREATE INDEX idx_integrations_enabled ON integrations(enabled);

-- ==================== COMPLETION MESSAGE ====================
DO $$
BEGIN
  RAISE NOTICE '✅ All tables created successfully!';
  RAISE NOTICE '📊 Total tables: 20';
  RAISE NOTICE '🔐 Indexes created for optimal performance';
END $$;
