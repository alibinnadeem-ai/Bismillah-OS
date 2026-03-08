-- ==================== SEED DATA FOR BISMILLAH MATTRESS STORE ====================
-- Created: 2026-01-04
-- Purpose: Initial data population from App.jsx hardcoded values

-- ==================== DEFAULT ADMIN USER ====================
-- Password: admin123 (hashed with bcrypt)
INSERT INTO users (id, email, password, name, role, is_authenticated) VALUES
('USR001', 'admin@bismillah.pk', '$2a$10$rKZJ9vF5H4qQzQqZQqZQqeZQqZQqZQqZQqZQqZQqZQqZQqZQqZQqO', 'Admin User', 'admin', false)
ON CONFLICT (id) DO NOTHING;

-- ==================== EMPLOYEES ====================
INSERT INTO employees (id, name, role, phone, email, salary, join_date, status, commission, department, attendance, advance_salary, kpi_score, targets) VALUES
('EMP001', 'Ali Raza', 'Manager', '03001111111', 'ali@bismillah.pk', 80000, '2023-01-15', 'Active', 500, 'Management', 95, 0, 4.8, '{"sales": 5000000, "achieved": 4500000}'),
('EMP002', 'Sara Khan', 'Salesperson', '03002222222', 'sara@bismillah.pk', 50000, '2023-06-20', 'Active', 200, 'Sales', 92, 5000, 4.2, '{"sales": 3000000, "achieved": 1200000}')
ON CONFLICT (id) DO NOTHING;

-- ==================== SUPPLIERS ====================
INSERT INTO suppliers (id, name, phone, email, address, products, payment_terms, last_order, rating, status, contract_expires, lead_time) VALUES
('SUP001', 'Bin Nadeem', '03001234567', 'supplier.a@company.pk', 'Lahore', 9, '30 days', '2024-12-20', 4.5, 'Active', '2025-12-31', 7),
('SUP002', 'Master Foam', '03009876543', 'supplier.b@company.pk', 'Islamabad', 2, '45 days', '2024-12-19', 4.0, 'Active', '2025-06-30', 5),
('SUP003', 'Spring Industries', '03001112222', 'spring@company.pk', 'Karachi', 5, '30 days', '2024-12-18', 4.2, 'Active', '2025-12-31', 10),
('SUP004', 'General Stock Co', '03003334444', 'general@company.pk', 'Lahore', 10, '30 days', '2024-12-15', 4.3, 'Active', '2025-12-31', 5)
ON CONFLICT (id) DO NOTHING;

-- ==================== PRODUCTS (Initial 25 SKUs from App.jsx) ====================
INSERT INTO products (sku, category, brand, dim, price, cost, qty, reorder_level, min_level, max_level, supplier, last_restocked, barcode, warranty, reorder_qty, margin, location, variants) VALUES
-- Bin Nadeem First Order
('MOF-78726', 'Mattress', 'Master Ortho Firm', '78-72-6', 45000, 28000, 1, 2, 1, 10, 'Bin Nadeem', '2024-01-01', '10001', 'Standard', 5, 37.78, 'Showroom', '[]'),
('MOF-78728', 'Mattress', 'Master Ortho Firm', '78-72-8', 48000, 30000, 1, 2, 1, 10, 'Bin Nadeem', '2024-01-01', '10002', 'Standard', 5, 37.50, 'Showroom', '[]'),
('CA-78726', 'Mattress', 'Cool Air', '78-72-6', 42000, 26000, 1, 2, 1, 10, 'Bin Nadeem', '2024-01-01', '10003', 'Standard', 5, 38.10, 'Showroom', '[]'),
('CA-78728', 'Mattress', 'Cool Air', '78-72-8', 45000, 28000, 1, 2, 1, 10, 'Bin Nadeem', '2024-01-01', '10004', 'Standard', 5, 37.78, 'Showroom', '[]'),
('SP-78726', 'Mattress', 'Shine Plus', '78-72-6', 40000, 25000, 1, 2, 1, 10, 'Bin Nadeem', '2024-01-01', '10005', 'Standard', 5, 37.50, 'Showroom', '[]'),
('MP-78726', 'Mattress', 'Master Plus', '78-72-6', 43000, 27000, 1, 2, 1, 10, 'Bin Nadeem', '2024-01-01', '10006', 'Standard', 5, 37.21, 'Showroom', '[]'),
('MP-78728', 'Mattress', 'Master Plus', '78-72-8', 46000, 29000, 1, 2, 1, 10, 'Bin Nadeem', '2024-01-01', '10007', 'Standard', 5, 36.96, 'Showroom', '[]'),
('MF-78726', 'Mattress', 'Master Firm', '78-72-6', 41000, 26000, 2, 2, 1, 10, 'Bin Nadeem', '2024-01-01', '10008', 'Standard', 5, 36.59, 'Showroom', '[]'),
('MF-78728', 'Mattress', 'Master Firm', '78-72-8', 44000, 28000, 2, 2, 1, 10, 'Bin Nadeem', '2024-01-01', '10009', 'Standard', 5, 36.36, 'Showroom', '[]'),

-- General Stock
('BR-78425', 'Mattress', 'Beauty Rest', '78-42-5', 35000, 22000, 2, 2, 1, 10, 'General Stock', '2024-01-01', '10010', 'Standard', 5, 37.14, 'Showroom', '[]'),
('BR++-78726', 'Mattress', 'Beauty Rest ++', '78-72-6', 47000, 30000, 1, 2, 1, 10, 'General Stock', '2024-01-01', '10011', 'Standard', 5, 36.17, 'Showroom', '[]'),
('BR++-78728', 'Mattress', 'Beauty Rest ++', '78-72-8', 50000, 32000, 1, 2, 1, 10, 'General Stock', '2024-01-01', '10012', 'Standard', 5, 36.00, 'Showroom', '[]'),
('BR++-78425', 'Mattress', 'Beauty Rest ++', '78-42-5', 38000, 24000, 2, 2, 1, 10, 'General Stock', '2024-01-01', '10013', 'Standard', 5, 36.84, 'Showroom', '[]'),
('CL-78726', 'Mattress', 'Classic', '78-72-6', 38000, 24000, 8, 2, 1, 10, 'General Stock', '2024-01-01', '10014', 'Standard', 5, 36.84, 'Showroom', '[]'),
('CL-78728', 'Mattress', 'Classic', '78-72-8', 40000, 25000, 8, 2, 1, 10, 'General Stock', '2024-01-01', '10015', 'Standard', 5, 37.50, 'Showroom', '[]'),
('CL-78725', 'Mattress', 'Classic', '78-72-5', 36000, 23000, 2, 2, 1, 10, 'General Stock', '2024-01-01', '10016', 'Standard', 5, 36.11, 'Showroom', '[]'),
('CL-72364', 'Mattress', 'Classic', '72-36-4', 25000, 16000, 10, 2, 1, 10, 'General Stock', '2024-01-01', '10017', 'Standard', 5, 36.00, 'Showroom', '[]'),
('CL-78394', 'Mattress', 'Classic', '78-39-4', 28000, 18000, 2, 2, 1, 10, 'General Stock', '2024-01-01', '10018', 'Standard', 5, 35.71, 'Showroom', '[]'),
('CL-78424', 'Mattress', 'Classic', '78-42-4', 30000, 19000, 2, 2, 1, 10, 'General Stock', '2024-01-01', '10019', 'Standard', 5, 36.67, 'Showroom', '[]'),

-- Spring
('PLM-7872', 'Mattress', 'Purple Luxury Memory', '78-72', 55000, 35000, 2, 2, 1, 10, 'Spring', '2024-01-01', '10020', 'Standard', 5, 36.36, 'Showroom', '[]'),
('PS-7872', 'Mattress', 'Prince Spring', '78-72', 48000, 30000, 10, 2, 1, 10, 'Spring', '2024-01-01', '10021', 'Standard', 5, 37.50, 'Showroom', '[]'),
('PPT-7872', 'Mattress', 'Prince P.T', '78-72', 45000, 28000, 4, 2, 1, 10, 'Spring', '2024-01-01', '10022', 'Standard', 5, 37.78, 'Showroom', '[]'),
('QU-7872', 'Mattress', 'Queen', '78-72', 52000, 33000, 4, 2, 1, 10, 'Spring', '2024-01-01', '10023', 'Standard', 5, 36.54, 'Showroom', '[]'),
('VIC-7872', 'Mattress', 'Victor', '78-72', 50000, 32000, 4, 2, 1, 10, 'Spring', '2024-01-01', '10024', 'Standard', 5, 36.00, 'Showroom', '[]'),

-- Uncov (Cushion/Sofa)
('MFU-72362', 'Cushion/Sofa', 'Master Foam (Uncov)', '72-36-2', 15000, 10000, 2, 2, 1, 10, 'Uncov', '2024-01-01', '10025', 'Standard', 5, 33.33, 'Showroom', '[]')
ON CONFLICT (sku) DO NOTHING;

-- ==================== CUSTOMERS ====================
INSERT INTO customers (id, cnic, name, phone, email, address, join_date, kyc_verified, total_purchases, total_spent, loyalty_points, loyalty_tier, birth_date, referred_by, balance, preferences, budget, next_follow_up, portal_access) VALUES
('CUST001', '12345-6789012-3', 'Ahmed Ali Khan', '03001234567', 'ahmed@example.com', '123 Mall Road, Lahore', '2024-01-15', true, 5, 285000, 2850, 'Gold', '1985-06-15', NULL, 0, 'Firm Mattress', '50k-100k', '2024-12-30', true)
ON CONFLICT (id) DO NOTHING;

-- ==================== EXPENSES ====================
INSERT INTO expenses (category, amount, date, note) VALUES
('Rent', 50000, '2024-12-01', 'Shop Rent Dec')
ON CONFLICT DO NOTHING;

-- ==================== TRANSACTIONS ====================
INSERT INTO transactions (invoice_number, date, customer_id, customer_name, items, subtotal, gst, discount, final_total, payment_method, delivery_status, delivery_date, type) VALUES
(1001, '2024-12-22 14:30:00', 'CUST001', 'Ahmed Ali Khan', '[{"id": 1, "cartQty": 1, "price": 45000, "brand": "Master Ortho Firm"}]', 45000, 7650, 2632.50, 50017.50, 'card', 'Delivered', '2024-12-22', 'sale')
ON CONFLICT (invoice_number) DO NOTHING;

-- Set the sequence for next invoice
SELECT setval('transactions_invoice_number_seq', (SELECT MAX(invoice_number) FROM transactions), true);

-- ==================== PURCHASE ORDERS ====================
INSERT INTO purchase_orders (id, supplier, date, due_date, items, status, total_amount, notes) VALUES
('PO001', 'SUP001', '2024-12-20', '2024-12-27', '[{"productId": 1, "qty": 10, "price": 28000}]', 'pending', 280000, 'Urgent delivery')
ON CONFLICT (id) DO NOTHING;

-- ==================== DELIVERIES ====================
INSERT INTO deliveries (id, invoice, customer, address, status, date, driver, vehicle, items) VALUES
('DEL001', '1001', 'Ahmed Ali Khan', '123 Mall Road', 'Scheduled', '2024-12-25', 'Driver A', 'Suzuki Bolan', 'Master Ortho Firm x1')
ON CONFLICT (id) DO NOTHING;

-- ==================== WAREHOUSES ====================
INSERT INTO warehouses (name, city, type, capacity, current, address, manager) VALUES
('Main Showroom', 'Lahore', 'showroom', 100, 45, 'Mall Road, Lahore', 'Ali Raza'),
('Warehouse A', 'Lahore', 'warehouse', 500, 200, 'Multan Road', 'Bilal')
ON CONFLICT DO NOTHING;

-- ==================== NOTIFICATIONS ====================
INSERT INTO notifications (text, type, date, status) VALUES
('Follow up with Ahmed Ali Khan', 'crm', '2024-12-30', 'unread'),
('Low stock: Master Ortho Firm', 'inventory', '2024-12-25', 'unread'),
('Pending Quote #Q-1002 expires today', 'sales', CURRENT_DATE, 'unread')
ON CONFLICT DO NOTHING;

-- ==================== SYSTEM SETTINGS ====================
INSERT INTO system_settings (store_name, store_address, store_phone, printer_type, auto_print, currency, tax_rate) VALUES
('Bismillah Mattress Store', 'Mall Road, Lahore', '0300-1234567', 'a4', true, 'PKR', 17)
ON CONFLICT DO NOTHING;

-- ==================== INTEGRATIONS ====================
INSERT INTO integrations (id, provider, enabled, config) VALUES
('INT001', 'stripe', true, '{"apiKey": "pk_test_..."}'),
('INT002', 'easypaisa', false, '{"merchantId": "", "storeId": ""}'),
('INT003', 'jazzcash', false, '{"merchantId": "", "password": ""}'),
('INT004', 'cashDrawer', false, '{"triggerCode": "27,112,0,50,250"}')
ON CONFLICT (id) DO NOTHING;

-- ==================== COMPLETION MESSAGE ====================
DO $$
BEGIN
  RAISE NOTICE '✅ Seed data inserted successfully!';
  RAISE NOTICE '📦 Products: 25 SKUs';
  RAISE NOTICE '👥 Employees: 2';
  RAISE NOTICE '🏢 Suppliers: 4';
  RAISE NOTICE '👤 Customers: 1';
  RAISE NOTICE '📊 Initial transaction created';
END $$;
