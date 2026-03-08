import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  TrendingDown, TrendingUp, AlertCircle, Package, BarChart3, Filter, Download, Plus, Edit2, Trash2, 
  Eye, EyeOff, Search, ShoppingCart, X, DollarSign, Banknote, Smartphone, CreditCard, Home, Settings, 
  LogOut, Users, Gift, Zap, Heart, Star, Phone, Mail, MapPin, FileText, User, Calendar, Truck, 
  Wrench, BarChart4, PieChart as PieChartIcon, Lock, Unlock, AlertTriangle, CheckCircle, Clock,
  ArrowUp, ArrowDown, Activity, MoreVertical, Printer, Share2, Copy, Code, Menu, X as XIcon,
  ChevronDown, ChevronUp, Save, RefreshCw, Minus, Plus as PlusIcon, Archive, RotateCcw, ShieldCheck,
  Wallet, QrCode, ToggleLeft, ToggleRight, HardDrive, Wifi, Bell, Briefcase, Award, Percent
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area 
} from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import api from './services/api';

const BismillahCompleteOS = () => {
  // ==================== AUTHENTICATION STATE ====================
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  // ==================== INITIAL SYSTEM DATA ====================
  const initialProducts = [
    // Bin Nadeem First Order
    { id: 1, sku: 'MOF-78726', category: 'Mattress', brand: 'Master Ortho Firm', dim: '78-72-6', price: 0, cost: 0, qty: 1, reorderLevel: 2, minLevel: 1, maxLevel: 10, supplier: 'Bin Nadeem', lastRestocked: '2024-01-01', barcode: '10001', warranty: 'Standard', reorderQty: 5, margin: 0, location: 'Showroom', variants: [] },
    { id: 2, sku: 'MOF-78728', category: 'Mattress', brand: 'Master Ortho Firm', dim: '78-72-8', price: 0, cost: 0, qty: 1, reorderLevel: 2, minLevel: 1, maxLevel: 10, supplier: 'Bin Nadeem', lastRestocked: '2024-01-01', barcode: '10002', warranty: 'Standard', reorderQty: 5, margin: 0, location: 'Showroom', variants: [] },
    { id: 3, sku: 'CA-78726', category: 'Mattress', brand: 'Cool Air', dim: '78-72-6', price: 0, cost: 0, qty: 1, reorderLevel: 2, minLevel: 1, maxLevel: 10, supplier: 'Bin Nadeem', lastRestocked: '2024-01-01', barcode: '10003', warranty: 'Standard', reorderQty: 5, margin: 0, location: 'Showroom', variants: [] },
    { id: 4, sku: 'CA-78728', category: 'Mattress', brand: 'Cool Air', dim: '78-72-8', price: 0, cost: 0, qty: 1, reorderLevel: 2, minLevel: 1, maxLevel: 10, supplier: 'Bin Nadeem', lastRestocked: '2024-01-01', barcode: '10004', warranty: 'Standard', reorderQty: 5, margin: 0, location: 'Showroom', variants: [] },
    { id: 5, sku: 'SP-78726', category: 'Mattress', brand: 'Shine Plus', dim: '78-72-6', price: 0, cost: 0, qty: 1, reorderLevel: 2, minLevel: 1, maxLevel: 10, supplier: 'Bin Nadeem', lastRestocked: '2024-01-01', barcode: '10005', warranty: 'Standard', reorderQty: 5, margin: 0, location: 'Showroom', variants: [] },
    { id: 6, sku: 'MP-78726', category: 'Mattress', brand: 'Master Plus', dim: '78-72-6', price: 0, cost: 0, qty: 1, reorderLevel: 2, minLevel: 1, maxLevel: 10, supplier: 'Bin Nadeem', lastRestocked: '2024-01-01', barcode: '10006', warranty: 'Standard', reorderQty: 5, margin: 0, location: 'Showroom', variants: [] },
    { id: 7, sku: 'MP-78728', category: 'Mattress', brand: 'Master Plus', dim: '78-72-8', price: 0, cost: 0, qty: 1, reorderLevel: 2, minLevel: 1, maxLevel: 10, supplier: 'Bin Nadeem', lastRestocked: '2024-01-01', barcode: '10007', warranty: 'Standard', reorderQty: 5, margin: 0, location: 'Showroom', variants: [] },
    { id: 8, sku: 'MF-78726', category: 'Mattress', brand: 'Master Firm', dim: '78-72-6', price: 0, cost: 0, qty: 2, reorderLevel: 2, minLevel: 1, maxLevel: 10, supplier: 'Bin Nadeem', lastRestocked: '2024-01-01', barcode: '10008', warranty: 'Standard', reorderQty: 5, margin: 0, location: 'Showroom', variants: [] },
    { id: 9, sku: 'MF-78728', category: 'Mattress', brand: 'Master Firm', dim: '78-72-8', price: 0, cost: 0, qty: 2, reorderLevel: 2, minLevel: 1, maxLevel: 10, supplier: 'Bin Nadeem', lastRestocked: '2024-01-01', barcode: '10009', warranty: 'Standard', reorderQty: 5, margin: 0, location: 'Showroom', variants: [] },

    // General Stock
    { id: 10, sku: 'BR-78425', category: 'Mattress', brand: 'Beauty Rest', dim: '78-42-5', price: 0, cost: 0, qty: 2, reorderLevel: 2, minLevel: 1, maxLevel: 10, supplier: 'General Stock', lastRestocked: '2024-01-01', barcode: '10010', warranty: 'Standard', reorderQty: 5, margin: 0, location: 'Showroom', variants: [] },
    { id: 11, sku: 'BR++-78726', category: 'Mattress', brand: 'Beauty Rest ++', dim: '78-72-6', price: 0, cost: 0, qty: 1, reorderLevel: 2, minLevel: 1, maxLevel: 10, supplier: 'General Stock', lastRestocked: '2024-01-01', barcode: '10011', warranty: 'Standard', reorderQty: 5, margin: 0, location: 'Showroom', variants: [] },
    { id: 12, sku: 'BR++-78728', category: 'Mattress', brand: 'Beauty Rest ++', dim: '78-72-8', price: 0, cost: 0, qty: 1, reorderLevel: 2, minLevel: 1, maxLevel: 10, supplier: 'General Stock', lastRestocked: '2024-01-01', barcode: '10012', warranty: 'Standard', reorderQty: 5, margin: 0, location: 'Showroom', variants: [] },
    { id: 13, sku: 'BR++-78425', category: 'Mattress', brand: 'Beauty Rest ++', dim: '78-42-5', price: 0, cost: 0, qty: 2, reorderLevel: 2, minLevel: 1, maxLevel: 10, supplier: 'General Stock', lastRestocked: '2024-01-01', barcode: '10013', warranty: 'Standard', reorderQty: 5, margin: 0, location: 'Showroom', variants: [] },
    { id: 14, sku: 'CL-78726', category: 'Mattress', brand: 'Classic', dim: '78-72-6', price: 0, cost: 0, qty: 8, reorderLevel: 2, minLevel: 1, maxLevel: 10, supplier: 'General Stock', lastRestocked: '2024-01-01', barcode: '10014', warranty: 'Standard', reorderQty: 5, margin: 0, location: 'Showroom', variants: [] },
    { id: 15, sku: 'CL-78728', category: 'Mattress', brand: 'Classic', dim: '78-72-8', price: 0, cost: 0, qty: 8, reorderLevel: 2, minLevel: 1, maxLevel: 10, supplier: 'General Stock', lastRestocked: '2024-01-01', barcode: '10015', warranty: 'Standard', reorderQty: 5, margin: 0, location: 'Showroom', variants: [] },
    { id: 16, sku: 'CL-78725', category: 'Mattress', brand: 'Classic', dim: '78-72-5', price: 0, cost: 0, qty: 2, reorderLevel: 2, minLevel: 1, maxLevel: 10, supplier: 'General Stock', lastRestocked: '2024-01-01', barcode: '10016', warranty: 'Standard', reorderQty: 5, margin: 0, location: 'Showroom', variants: [] },
    { id: 17, sku: 'CL-72364', category: 'Mattress', brand: 'Classic', dim: '72-36-4', price: 0, cost: 0, qty: 10, reorderLevel: 2, minLevel: 1, maxLevel: 10, supplier: 'General Stock', lastRestocked: '2024-01-01', barcode: '10017', warranty: 'Standard', reorderQty: 5, margin: 0, location: 'Showroom', variants: [] },
    { id: 18, sku: 'CL-78394', category: 'Mattress', brand: 'Classic', dim: '78-39-4', price: 0, cost: 0, qty: 2, reorderLevel: 2, minLevel: 1, maxLevel: 10, supplier: 'General Stock', lastRestocked: '2024-01-01', barcode: '10018', warranty: 'Standard', reorderQty: 5, margin: 0, location: 'Showroom', variants: [] },
    { id: 19, sku: 'CL-78424', category: 'Mattress', brand: 'Classic', dim: '78-42-4', price: 0, cost: 0, qty: 2, reorderLevel: 2, minLevel: 1, maxLevel: 10, supplier: 'General Stock', lastRestocked: '2024-01-01', barcode: '10019', warranty: 'Standard', reorderQty: 5, margin: 0, location: 'Showroom', variants: [] },

    // Spring
    { id: 20, sku: 'PLM-7872', category: 'Mattress', brand: 'Purple Luxury Memory', dim: '78-72', price: 0, cost: 0, qty: 2, reorderLevel: 2, minLevel: 1, maxLevel: 10, supplier: 'Spring', lastRestocked: '2024-01-01', barcode: '10020', warranty: 'Standard', reorderQty: 5, margin: 0, location: 'Showroom', variants: [] },
    { id: 21, sku: 'PS-7872', category: 'Mattress', brand: 'Prince Spring', dim: '78-72', price: 0, cost: 0, qty: 10, reorderLevel: 2, minLevel: 1, maxLevel: 10, supplier: 'Spring', lastRestocked: '2024-01-01', barcode: '10021', warranty: 'Standard', reorderQty: 5, margin: 0, location: 'Showroom', variants: [] },
    { id: 22, sku: 'PPT-7872', category: 'Mattress', brand: 'Prince P.T', dim: '78-72', price: 0, cost: 0, qty: 4, reorderLevel: 2, minLevel: 1, maxLevel: 10, supplier: 'Spring', lastRestocked: '2024-01-01', barcode: '10022', warranty: 'Standard', reorderQty: 5, margin: 0, location: 'Showroom', variants: [] },
    { id: 23, sku: 'QU-7872', category: 'Mattress', brand: 'Queen', dim: '78-72', price: 0, cost: 0, qty: 4, reorderLevel: 2, minLevel: 1, maxLevel: 10, supplier: 'Spring', lastRestocked: '2024-01-01', barcode: '10023', warranty: 'Standard', reorderQty: 5, margin: 0, location: 'Showroom', variants: [] },
    { id: 24, sku: 'VIC-7872', category: 'Mattress', brand: 'Victor', dim: '78-72', price: 0, cost: 0, qty: 4, reorderLevel: 2, minLevel: 1, maxLevel: 10, supplier: 'Spring', lastRestocked: '2024-01-01', barcode: '10024', warranty: 'Standard', reorderQty: 5, margin: 0, location: 'Showroom', variants: [] },

    // Uncov
    { id: 25, sku: 'MFU-72362', category: 'Cushion/Sofa', brand: 'Master Foam (Uncov)', dim: '72-36-2', price: 0, cost: 0, qty: 2, reorderLevel: 2, minLevel: 1, maxLevel: 10, supplier: 'Uncov', lastRestocked: '2024-01-01', barcode: '10025', warranty: 'Standard', reorderQty: 5, margin: 0, location: 'Showroom', variants: [] },
  ];

  const initialEmployees = [
    { id: 'EMP001', name: 'Ali Raza', role: 'Manager', phone: '03001111111', email: 'ali@bismillah.pk', salary: 80000, joinDate: '2023-01-15', status: 'Active', commission: 500, department: 'Management', attendance: 95, advanceSalary: 0, kpiScore: 4.8, targets: { sales: 5000000, achieved: 4500000 } },
    { id: 'EMP002', name: 'Sara Khan', role: 'Salesperson', phone: '03002222222', email: 'sara@bismillah.pk', salary: 50000, joinDate: '2023-06-20', status: 'Active', commission: 200, department: 'Sales', attendance: 92, advanceSalary: 5000, kpiScore: 4.2, targets: { sales: 3000000, achieved: 1200000 } },
  ];

  const initialSuppliers = [
    { id: 'SUP001', name: 'Bin Nadeem', phone: '03001234567', email: 'supplier.a@company.pk', address: 'Lahore', products: 2, paymentTerms: '30 days', lastOrder: '2024-12-20', rating: 4.5, status: 'Active', contractExpires: '2025-12-31', leadTime: 7 },
    { id: 'SUP002', name: 'Master Foam', phone: '03009876543', email: 'supplier.b@company.pk', address: 'Islamabad', products: 2, paymentTerms: '45 days', lastOrder: '2024-12-19', rating: 4.0, status: 'Active', contractExpires: '2025-06-30', leadTime: 5 },
  ];

  const initialCustomers = [
    { id: 'CUST001', cnic: '12345-6789012-3', name: 'Ahmed Ali Khan', phone: '03001234567', email: 'ahmed@example.com', address: '123 Mall Road, Lahore', joinDate: '2024-01-15', kycVerified: true, totalPurchases: 5, totalSpent: 285000, loyaltyPoints: 2850, loyaltyTier: 'Gold', birthDate: '1985-06-15', referredBy: null, balance: 0, preferences: 'Firm Mattress', budget: '50k-100k', nextFollowUp: '2024-12-30', portalAccess: true },
  ];

  const initialExpenses = [
    { id: 1, category: 'Rent', amount: 50000, date: '2024-12-01', note: 'Shop Rent Dec' },
  ];

  // ==================== STATE MANAGEMENT (DATABASE-BACKED) ====================
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState({ name: 'User', role: 'admin', id: 'EMP001' });

  // Core Data (from Database)
  const [products, setProducts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [specialOrders, setSpecialOrders] = useState([]);
  const [serviceTickets, setServiceTickets] = useState([]);
  const [arEntries, setArEntries] = useState([]); // Accounts Receivable
  const [apEntries, setApEntries] = useState([]); // Accounts Payable
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [returns, setReturns] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Settings & Integrations State
  const [systemSettings, setSystemSettings] = useState({
    storeName: 'Bismillah Mattress Store',
    storeAddress: 'Mall Road, Lahore',
    storePhone: '0300-1234567',
    printerType: 'a4',
    autoPrint: true,
    currency: 'PKR',
    taxRate: 17
  });

  const [integrations, setIntegrations] = useState({
    stripe: { enabled: true, apiKey: 'pk_test_...' },
    easypaisa: { enabled: false, merchantId: '', storeId: '' },
    jazzcash: { enabled: false, merchantId: '', password: '' },
    cashDrawer: { enabled: false, triggerCode: '27,112,0,50,250' }
  });

  // ==================== LOCAL STATE (UI ONLY) ====================
  const [cart, setCart] = useState([]);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [invoiceNumber, setInvoiceNumber] = useState(1003);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [posDiscount, setPosDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  
  // Modals
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [showMobileWalletModal, setShowMobileWalletModal] = useState(false);
  const [mobileWalletProvider, setMobileWalletProvider] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCreatePOModal, setShowCreatePOModal] = useState(false);
  const [showProcessReturnModal, setShowProcessReturnModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);
  const [showSupplierContractModal, setShowSupplierContractModal] = useState(false);
  const [showSupplierHistoryModal, setShowSupplierHistoryModal] = useState(false);

  const [selectedCustomerForPayment, setSelectedCustomerForPayment] = useState(null);
  const [selectedSupplierForModal, setSelectedSupplierForModal] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [returnDeduction, setReturnDeduction] = useState(0);
  const [returnRefundAmount, setReturnRefundAmount] = useState(0);
  
  // Forms
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', cnic: '', email: '', address: '', preferences: '', budget: '', nextFollowUp: '', loyaltyTier: 'Bronze' });
  const [newEmployee, setNewEmployee] = useState({ name: '', role: 'Salesperson', phone: '', email: '', salary: 0, department: 'Sales' });
  const [newSupplier, setNewSupplier] = useState({ name: '', phone: '', email: '', address: '', paymentTerms: '30 days', contractExpires: '' });
  const [newExpense, setNewExpense] = useState({ category: '', amount: 0, date: '', note: '' });
  const [newPO, setNewPO] = useState({ supplierId: '', items: [], notes: '', dueDate: '' });
  const [newProduct, setNewProduct] = useState({ sku: '', brand: '', category: '', price: 0, cost: 0, qty: 0 });
  const [newTicket, setNewTicket] = useState({ customerName: '', phone: '', issue: '', priority: 'Normal', status: 'Open', invoiceRef: '' });

  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [warrantySearch, setWarrantySearch] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [activeTab, setActiveTab] = useState('pnl'); // pnl, ar, ap

  // ==================== UTILITY FUNCTIONS ====================
  const logAudit = useCallback((action, details, change = '') => {
    const newLog = {
      id: auditLog.length + 1,
      timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' }),
      action,
      user: currentUser.name,
      details,
      change
    };
    setAuditLog([newLog, ...auditLog]);
  }, [auditLog, currentUser, setAuditLog]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    
    try {
      const response = await api.auth.login(loginEmail, loginPassword);
      setIsAuthenticated(true);
      setCurrentUser({
        name: response.user.name,
        role: response.user.role,
        id: response.user.id
      });
      logAudit('Login', 'User logged in successfully');
    } catch (error) {
      setLoginError(error.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== DATA LOADING FROM DATABASE ====================
  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated) {
        setDataLoading(false);
        return;
      }

      try {
        setDataLoading(true);
        
        // Load all data in parallel
        const [
          productsData,
          customersData,
          employeesData,
          suppliersData,
          transactionsData,
          quotesData,
          expensesData,
          purchaseOrdersData,
          deliveriesData,
          serviceTicketsData,
          returnsData,
          specialOrdersData,
          warehousesData,
          systemSettingsData,
          integrationsData,
          notificationsData,
          arEntriesData,
          apEntriesData
        ] = await Promise.all([
          api.products.getAll(),
          api.customers.getAll(),
          api.employees.getAll(),
          api.suppliers.getAll(),
          api.transactions.getAll(),
          api.quotes.getAll(),
          api.expenses.getAll(),
          api.purchaseOrders.getAll(),
          api.deliveries.getAll(),
          api.serviceTickets.getAll(),
          api.returns.getAll(),
          api.specialOrders.getAll(),
          api.settings.getWarehouses(),
          api.settings.getSystem(),
          api.settings.getIntegrations(),
          api.settings.getNotifications(),
          api.settings.getAREntries(),
          api.settings.getAPEntries()
        ]);

        setProducts(productsData);
        setCustomers(customersData);
        setEmployees(employeesData);
        setSuppliers(suppliersData);
        setTransactions(transactionsData);
        setQuotes(quotesData);
        setExpenses(expensesData);
        setPurchaseOrders(purchaseOrdersData);
        setDeliveries(deliveriesData);
        setServiceTickets(serviceTicketsData);
        setReturns(returnsData);
        setSpecialOrders(specialOrdersData);
        setWarehouses(warehousesData);
        setSystemSettings(systemSettingsData);
        setIntegrations(integrationsData);
        setNotifications(notificationsData);
        setArEntries(arEntriesData);
        setApEntries(apEntriesData);
        
      } catch (error) {
        console.error('Failed to load data:', error);
        setLoginError('Failed to load data from database');
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated]);

  const handleAddProduct = async () => {
    try {
      const productData = {
        sku: newProduct.sku,
        category: newProduct.category,
        brand: newProduct.brand,
        dim: newProduct.dim || '',
        price: newProduct.price || 0,
        cost: newProduct.cost || 0,
        qty: newProduct.qty || 0,
        supplier: newProduct.supplier || 'General Stock',
        barcode: newProduct.barcode || '',
        location: newProduct.location || 'Showroom'
      };

      const createdProduct = await api.products.create(productData);
      setProducts([...products, createdProduct]);
      setShowAddProductModal(false);
      setNewProduct({ sku: '', brand: '', category: '', price: 0, cost: 0, qty: 0 });
      logAudit('Inventory', `Added new product: ${createdProduct.brand}`);
    } catch (error) {
      console.error('Failed to add product:', error);
      alert('Failed to add product: ' + error.message);
    }
  };

  const handleAddSupplier = async () => {
    try {
      const supplierData = {
        id: `SUP${String(suppliers.length + 1).padStart(3, '0')}`,
        name: newSupplier.name,
        phone: newSupplier.phone,
        email: newSupplier.email || '',
        address: newSupplier.address || '',
        paymentTerms: newSupplier.paymentTerms || '30 days',
        contractExpires: newSupplier.contractExpires || ''
      };

      const createdSupplier = await api.suppliers.create(supplierData);
      setSuppliers([...suppliers, createdSupplier]);
      setShowAddSupplierModal(false);
      setNewSupplier({ name: '', phone: '', email: '', address: '', paymentTerms: '30 days', contractExpires: '' });
      logAudit('Supplier', `Added new supplier: ${createdSupplier.name}`);
    } catch (error) {
      console.error('Failed to add supplier:', error);
      alert('Failed to add supplier: ' + error.message);
    }
  };

  const handleCreatePO = async () => {
    try {
      const poData = {
        id: `PO${String(purchaseOrders.length + 1).padStart(3, '0')}`,
        supplier: newPO.supplierId,
        date: new Date().toISOString().split('T')[0],
        due_date: newPO.dueDate,
        items: JSON.stringify(newPO.items),
        status: 'pending',
        total_amount: newPO.items.reduce((sum, item) => sum + (item.price * item.qty), 0),
        notes: newPO.notes
      };

      const createdPO = await api.purchaseOrders.create(poData);
      setPurchaseOrders([...purchaseOrders, createdPO]);
      setShowCreatePOModal(false);
      setNewPO({ supplierId: '', items: [], notes: '', dueDate: '' });
      logAudit('Purchasing', `Created PO ${createdPO.id}`);
    } catch (error) {
      console.error('Failed to create PO:', error);
      alert('Failed to create purchase order: ' + error.message);
    }
  };

  const printInvoice = (transaction) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('Please allow popups to print invoices');
        return;
    }
    const width = systemSettings.printerType === 'thermal58' ? '58mm' : systemSettings.printerType === 'thermal80' ? '80mm' : '210mm'; // A4 width
    const fontSize = systemSettings.printerType.includes('thermal') ? '10px' : '12px';
    const padding = systemSettings.printerType.includes('thermal') ? '5px' : '20px';

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice #${transaction.invoiceNumber}</title>
          <style>
            @page { margin: 0; }
            body { font-family: 'Courier New', monospace; padding: ${padding}; width: ${width}; font-size: ${fontSize}; margin: 0 auto; box-sizing: border-box; }
            .header { text-align: center; margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 5px; }
            .item { display: flex; justify-content: space-between; margin-bottom: 2px; }
            .total { border-top: 1px dashed #000; margin-top: 5px; padding-top: 5px; font-weight: bold; }
            .footer { margin-top: 10px; text-align: center; font-size: ${fontSize}; }
            @media print {
                body { width: 100%; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>${systemSettings.storeName}</h2>
            <p>${systemSettings.storeAddress}</p>
            <p>${systemSettings.storePhone}</p>
            <p>Invoice #${transaction.invoiceNumber}</p>
            <p>${transaction.date}</p>
            <p>Customer: ${transaction.customerName}</p>
          </div>
          <div>
            ${transaction.items.map(item => `
              <div class="item">
                <span>${item.brand.substring(0, 15)} x${item.cartQty}</span>
                <span>${(item.price * item.cartQty).toLocaleString()}</span>
              </div>
            `).join('')}
          </div>
          <div class="total">
            <div class="item"><span>Subtotal:</span><span>${transaction.subtotal.toLocaleString()}</span></div>
            <div class="item"><span>GST:</span><span>${transaction.gst.toLocaleString()}</span></div>
            <div class="item"><span>Discount:</span><span>-${transaction.discount.toLocaleString()}</span></div>
            <div class="item"><span>TOTAL:</span><span>${transaction.finalTotal.toLocaleString()}</span></div>
          </div>
          <div class="footer">
            <p>Payment: ${transaction.paymentMethod.toUpperCase()}</p>
            <p>Thank you for your purchase!</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    // Allow time for styles to load before printing
    setTimeout(() => {
        printWindow.print();
    }, 500);
  };

  const printQuote = (quote) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('Please allow popups to print quotes');
        return;
    }
    const width = systemSettings.printerType === 'thermal58' ? '58mm' : systemSettings.printerType === 'thermal80' ? '80mm' : '210mm';
    const fontSize = systemSettings.printerType.includes('thermal') ? '10px' : '12px';
    const padding = systemSettings.printerType.includes('thermal') ? '5px' : '20px';

    printWindow.document.write(`
      <html>
        <head>
          <title>Quote #${quote.id}</title>
          <style>
            @page { margin: 0; }
            body { font-family: 'Courier New', monospace; padding: ${padding}; width: ${width}; font-size: ${fontSize}; margin: 0 auto; box-sizing: border-box; }
            .header { text-align: center; margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 5px; }
            .item { display: flex; justify-content: space-between; margin-bottom: 2px; }
            .total { border-top: 1px dashed #000; margin-top: 5px; padding-top: 5px; font-weight: bold; }
            .footer { margin-top: 10px; text-align: center; font-size: ${fontSize}; }
            @media print {
                body { width: 100%; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>${systemSettings.storeName}</h2>
            <p>${systemSettings.storeAddress}</p>
            <p>${systemSettings.storePhone}</p>
            <p><strong>QUOTATION / ESTIMATE</strong></p>
            <p>Quote #${quote.id}</p>
            <p>${quote.date}</p>
            <p>Customer: ${quote.customerName}</p>
          </div>
          <div>
            ${quote.items.map(item => `
              <div class="item">
                <span>${item.brand.substring(0, 15)} x${item.cartQty}</span>
                <span>${(item.price * item.cartQty).toLocaleString()}</span>
              </div>
            `).join('')}
          </div>
          <div class="total">
            <div class="item"><span>Total Estimate:</span><span>Rs.${quote.total.toLocaleString()}</span></div>
          </div>
          <div class="footer">
            <p>This is not a valid invoice.</p>
            <p>Quote valid for 7 days.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
        printWindow.print();
    }, 500);
  };

  const generateReport = (type) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    
    doc.setFontSize(20);
    doc.text(systemSettings.storeName, 14, 22);
    doc.setFontSize(12);
    doc.text(type.toUpperCase(), 14, 32);
    doc.text(`Generated: ${date}`, 14, 38);

    let head = [];
    let body = [];

    switch(type) {
      case 'Sales Performance':
        head = [['Invoice', 'Date', 'Customer', 'Items', 'Total', 'Payment']];
        body = transactions.map(t => [
          t.invoiceNumber,
          t.date,
          t.customerName,
          t.items.length,
          `Rs.${t.finalTotal.toLocaleString()}`,
          t.paymentMethod.toUpperCase()
        ]);
        break;

      case 'Inventory Valuation':
        head = [['SKU', 'Brand', 'Category', 'Stock', 'Cost', 'Price', 'Total Value']];
        body = products.map(p => [
          p.sku,
          p.brand,
          p.category,
          p.qty,
          `Rs.${p.cost}`,
          `Rs.${p.price}`,
          `Rs.${(p.qty * p.price).toLocaleString()}`
        ]);
        break;

      case 'Dead Stock':
        head = [['SKU', 'Product', 'Last Restocked', 'Stock', 'Value']];
        body = products.filter(p => p.qty > 0).map(p => [
          p.sku,
          p.brand,
          p.lastRestocked || 'N/A',
          p.qty,
          `Rs.${(p.qty * p.price).toLocaleString()}`
        ]);
        break;

      case 'Customer Insights':
        head = [['Name', 'Phone', 'Tier', 'Total Spent', 'Balance']];
        body = customers.map(c => [
          c.name,
          c.phone,
          c.loyaltyTier,
          `Rs.${(c.totalSpent || 0).toLocaleString()}`,
          `Rs.${(c.balance || 0).toLocaleString()}`
        ]);
        break;

      case 'Delivery Efficiency':
        head = [['ID', 'Customer', 'Address', 'Driver', 'Status']];
        body = deliveries.map(d => [
          d.id,
          d.customer,
          d.address,
          d.driver,
          d.status
        ]);
        break;
      
      case 'Tax Audit':
         head = [['Date', 'Action', 'User', 'Details']];
         body = auditLog.map(l => [
             l.timestamp,
             l.action,
             l.user,
             l.details
         ]);
         break;

      default:
        break;
    }

    doc.autoTable({
      startY: 45,
      head: head,
      body: body,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 163, 74] } // Emerald color
    });

    doc.save(`${type.replace(/ /g, '_')}_${date}.pdf`);
  };

  // ==================== ANALYTICS ====================
  const analytics = useMemo(() => {
    const totalInventoryValue = products.reduce((sum, p) => sum + (p.qty * p.price), 0);
    const totalCost = products.reduce((sum, p) => sum + (p.qty * p.cost), 0);
    const grossMargin = totalInventoryValue - totalCost;
    const lowStockItems = products.filter(p => p.qty <= (p.reorder_level || p.reorderLevel || 5)).length;
    
    // Handle both camelCase and snake_case from database
    const totalRevenue = transactions.reduce((sum, t) => sum + (t.final_total || t.finalTotal || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const totalReceivables = customers.reduce((sum, c) => sum + (c.balance || 0), 0);
    const netProfit = totalRevenue - totalCost - totalExpenses;
    
    // Chart Data - handle both formats
    const salesData = transactions.map(t => ({
      name: `Inv #${t.invoice_number || t.invoiceNumber || ''}`,
      amount: t.final_total || t.finalTotal || 0,
      date: (t.date || '').toString().split(',')[0].split('T')[0]
    }));

    const categoryData = products.reduce((acc, curr) => {
      const existing = acc.find(item => item.name === curr.category);
      if (existing) {
        existing.value += curr.qty;
      } else {
        acc.push({ name: curr.category, value: curr.qty });
      }
      return acc;
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return {
      inventory: { totalValue: totalInventoryValue, totalCost, grossMargin, lowStockItems, totalSKUs: products.length },
      sales: { totalRevenue, transactions: transactions.length },
      financial: { totalReceivables, totalExpenses, netProfit },
      charts: { salesData, categoryData, COLORS }
    };
  }, [products, transactions, customers, expenses]);

  // ==================== SHARED COMPONENTS ====================
  const PaymentModal = () => (
    showPaymentModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-slate-800 p-6 rounded-xl w-96 border border-slate-700">
          <h2 className="text-xl font-bold mb-4">Receive Payment</h2>
          <p className="mb-4 text-slate-300">Customer: <span className="font-bold text-white">{selectedCustomerForPayment?.name}</span></p>
          <p className="mb-6 text-red-400 font-bold bg-red-400/10 p-2 rounded">Current Balance: Rs.{selectedCustomerForPayment?.balance?.toLocaleString()}</p>
          
          <div className="mb-6">
            <label className="block text-xs text-slate-400 mb-1">Amount Received (Rs)</label>
            <input 
              type="number" 
              className="w-full bg-slate-700 p-3 rounded-lg text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              value={paymentAmount} 
              onChange={e => setPaymentAmount(Number(e.target.value))}
              placeholder="0"
            />
          </div>
          
          <div className="flex gap-3">
            <button onClick={() => {
              if (paymentAmount <= 0) return alert("Please enter valid amount");
              
              const updatedCustomers = customers.map(c => 
                c.id === selectedCustomerForPayment.id 
                ? { ...c, balance: (c.balance || 0) - paymentAmount } 
                : c
              );
              setCustomers(updatedCustomers);
              
              setArEntries([...arEntries, {
                id: `PAY-${Date.now()}`,
                customer: selectedCustomerForPayment.name,
                amount: paymentAmount,
                date: new Date().toLocaleDateString(),
                status: 'Paid',
                type: 'Payment In'
              }]);

              logAudit('Finance', `Received payment of Rs.${paymentAmount} from ${selectedCustomerForPayment.name}`);
              setShowPaymentModal(false);
              setPaymentAmount(0);
              alert("Payment Recorded Successfully!");
            }} className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-3 rounded-lg font-bold shadow-lg shadow-emerald-600/20">Confirm Payment</button>
            <button onClick={() => setShowPaymentModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg font-medium">Cancel</button>
          </div>
        </div>
      </div>
    )
  );

  const AddEmployeeModal = () => (
    showAddEmployeeModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-slate-800 p-6 rounded-xl w-[500px] border border-slate-700">
          <h2 className="text-xl font-bold mb-4">{selectedEmployee ? 'Edit Team Member' : 'Add New Team Member'}</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div><label className="text-xs text-slate-400 block mb-1">Full Name</label><input className="w-full bg-slate-700 p-2 rounded text-white" value={newEmployee.name} onChange={e => setNewEmployee({...newEmployee, name: e.target.value})} /></div>
            <div><label className="text-xs text-slate-400 block mb-1">Role/Designation</label><input className="w-full bg-slate-700 p-2 rounded text-white" value={newEmployee.role} onChange={e => setNewEmployee({...newEmployee, role: e.target.value})} /></div>
            <div><label className="text-xs text-slate-400 block mb-1">Phone</label><input className="w-full bg-slate-700 p-2 rounded text-white" value={newEmployee.phone} onChange={e => setNewEmployee({...newEmployee, phone: e.target.value})} /></div>
            <div><label className="text-xs text-slate-400 block mb-1">Email</label><input className="w-full bg-slate-700 p-2 rounded text-white" value={newEmployee.email} onChange={e => setNewEmployee({...newEmployee, email: e.target.value})} /></div>
            <div><label className="text-xs text-slate-400 block mb-1">Base Salary</label><input type="number" className="w-full bg-slate-700 p-2 rounded text-white" value={newEmployee.salary} onChange={e => setNewEmployee({...newEmployee, salary: Number(e.target.value)})} /></div>
            <div>
                <label className="text-xs text-slate-400 block mb-1">Department</label>
                <select className="w-full bg-slate-700 p-2 rounded text-white" value={newEmployee.department} onChange={e => setNewEmployee({...newEmployee, department: e.target.value})}>
                    <option>Sales</option>
                    <option>Management</option>
                    <option>Logistics</option>
                    <option>Support</option>
                </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={async () => {
              if(!newEmployee.name) return alert('Name is required');
              
              try {
                if (selectedEmployee) {
                  // Update existing employee
                  const employeeData = {
                    name: newEmployee.name,
                    role: newEmployee.role,
                    phone: newEmployee.phone,
                    email: newEmployee.email || '',
                    salary: newEmployee.salary,
                    department: newEmployee.department
                  };
                  
                  const updatedEmployee = await api.employees.update(selectedEmployee.id, employeeData);
                  setEmployees(employees.map(e => e.id === selectedEmployee.id ? updatedEmployee : e));
                  logAudit('HR', `Updated employee profile: ${newEmployee.name}`);
                } else {
                  // Create new employee
                  const employeeData = {
                    id: `EMP${String(employees.length + 1).padStart(3, '0')}`,
                    name: newEmployee.name,
                    role: newEmployee.role,
                    phone: newEmployee.phone,
                    email: newEmployee.email || '',
                    salary: newEmployee.salary,
                    department: newEmployee.department,
                    join_date: new Date().toISOString().split('T')[0],
                    status: 'Active'
                  };
                  
                  const createdEmployee = await api.employees.create(employeeData);
                  setEmployees([...employees, createdEmployee]);
                  logAudit('HR', `Added new employee: ${createdEmployee.name}`);
                }
                
                setShowAddEmployeeModal(false);
                setNewEmployee({ name: '', role: 'Salesperson', phone: '', email: '', salary: 0, department: 'Sales' });
                setSelectedEmployee(null);
              } catch (error) {
                console.error('Failed to save employee:', error);
                alert('Failed to save employee: ' + error.message);
              }
            }} className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold">{selectedEmployee ? 'Update Profile' : 'Add Employee'}</button>
            <button onClick={() => {
                setShowAddEmployeeModal(false);
                setSelectedEmployee(null);
                setNewEmployee({ name: '', role: 'Salesperson', phone: '', email: '', salary: 0, department: 'Sales' });
            }} className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg">Cancel</button>
          </div>
        </div>
      </div>
    )
  );

  const AddExpenseModal = () => (
    showAddExpenseModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-slate-800 p-6 rounded-xl w-96 border border-slate-700">
          <h2 className="text-xl font-bold mb-4">Record New Expense</h2>
          <div className="space-y-4 mb-6">
            <div><label className="text-xs text-slate-400 block mb-1">Category</label>
                <select className="w-full bg-slate-700 p-2 rounded text-white" value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})}>
                    <option value="">Select Category</option>
                    <option value="Rent">Rent</option>
                    <option value="Utilities">Utilities (Electricity/Internet)</option>
                    <option value="Salaries">Salaries</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div><label className="text-xs text-slate-400 block mb-1">Amount</label><input type="number" className="w-full bg-slate-700 p-2 rounded text-white" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: Number(e.target.value)})} /></div>
            <div><label className="text-xs text-slate-400 block mb-1">Date</label><input type="date" className="w-full bg-slate-700 p-2 rounded text-white" value={newExpense.date} onChange={e => setNewExpense({...newExpense, date: e.target.value})} /></div>
            <div><label className="text-xs text-slate-400 block mb-1">Note / Description</label><textarea className="w-full bg-slate-700 p-2 rounded text-white h-20" value={newExpense.note} onChange={e => setNewExpense({...newExpense, note: e.target.value})}></textarea></div>
          </div>
          <div className="flex gap-3">
            <button onClick={async () => {
                if(!newExpense.amount || !newExpense.category) return alert('Details required');
                
                try {
                  const expenseData = {
                    id: `EXP${String(expenses.length + 1).padStart(3, '0')}`,
                    category: newExpense.category,
                    amount: newExpense.amount,
                    date: newExpense.date || new Date().toISOString().split('T')[0],
                    note: newExpense.note || ''
                  };
                  
                  const createdExpense = await api.expenses.create(expenseData);
                  setExpenses([...expenses, createdExpense]);
                  setShowAddExpenseModal(false);
                  setNewExpense({ category: '', amount: 0, date: '', note: '' });
                  logAudit('Finance', `Recorded expense: ${createdExpense.category} - Rs.${createdExpense.amount}`);
                } catch (error) {
                  console.error('Failed to add expense:', error);
                  alert('Failed to add expense: ' + error.message);
                }
            }} className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold">Save Expense</button>
            <button onClick={() => setShowAddExpenseModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg">Cancel</button>
          </div>
        </div>
      </div>
    )
  );

  const Sidebar = () => (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} border-r border-slate-700 bg-slate-900/50 backdrop-blur-xl transition-all duration-300 overflow-y-auto sticky top-0 h-screen flex flex-col z-50`}>
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        {sidebarOpen && <span className="text-white font-bold truncate">Bismillah OS</span>}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white p-1 hover:bg-slate-800 rounded">
          {sidebarOpen ? <XIcon size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="p-4 space-y-6 flex-1">
        {[
            {
                title: 'Retail & Sales',
                items: [
                    { id: 'dashboard', label: 'Dashboard', icon: Home },
                    { id: 'pos', label: 'Point of Sale', icon: ShoppingCart },
                    { id: 'quotes', label: 'Quotes & Orders', icon: FileText },
                    { id: 'customers', label: 'CRM & Customers', icon: Users },
                ]
            },
            {
                title: 'Operations',
                items: [
                    { id: 'inventory', label: 'Inventory & Stock', icon: Package },
                    { id: 'purchases', label: 'Purchasing (PO)', icon: ShoppingCart },
                    { id: 'deliveries', label: 'Delivery Logistics', icon: Truck },
                    { id: 'service', label: 'Service & Warranty', icon: Wrench },
                ]
            },
            {
                title: 'Finance & HR',
                items: [
                    { id: 'financial', label: 'Accounting (AR/AP)', icon: BarChart3 },
                    { id: 'expenses', label: 'Expenses', icon: Banknote },
                    { id: 'employees', label: 'HR & Commissions', icon: User },
                ]
            },
            {
                title: 'Admin',
                items: [
                    { id: 'suppliers', label: 'Suppliers', icon: MapPin },
                    { id: 'reports', label: 'Reports', icon: Activity },
                    { id: 'settings', label: 'Settings', icon: Settings },
                ]
            }
        ].map((group, idx) => (
            <div key={idx}>
                {sidebarOpen && <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-4">{group.title}</h3>}
                <div className="space-y-1">
                    {group.items.map(item => {
                        const Icon = item.icon;
                        return (
                            <button
                            key={item.id}
                            onClick={() => setCurrentPage(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                                currentPage === item.id
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                            }`}
                            >
                            <Icon size={18} />
                            {sidebarOpen && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
                            </button>
                        );
                    })}
                </div>
            </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button onClick={async () => {
          try {
            await api.auth.logout();
          } catch (error) {
            console.error('Logout error:', error);
          } finally {
            setIsAuthenticated(false);
            setCurrentUser({ name: 'User', role: 'admin', id: 'EMP001' });
          }
        }} className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
          <LogOut size={20} />
          {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );

  // ==================== AUTH SCREEN ====================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Bismillah Mattress</h1>
            <p className="text-slate-400">Enterprise Operating System</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div><label className="text-slate-300 text-sm font-bold mb-2 block">Email</label><input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full bg-slate-700 text-white p-3 rounded-lg" placeholder="admin@bismillah.pk"/></div>
            <div><label className="text-slate-300 text-sm font-bold mb-2 block">Password</label><input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full bg-slate-700 text-white p-3 rounded-lg" placeholder="admin123"/></div>
            {loginError && <div className="text-red-400 text-sm">{loginError}</div>}
            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg">{isLoading ? 'Authenticating...' : 'Login'}</button>
          </form>
        </div>
      </div>
    );
  }

  // ==================== DATA LOADING SCREEN ====================
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-bold mb-2">Loading Data...</h2>
          <p className="text-slate-400">Fetching data from database</p>
        </div>
      </div>
    );
  }

  // ==================== PAGE RENDERERS ====================

  // --- DASHBOARD ---
  if (currentPage === 'dashboard') {
    return (
      <div className="flex h-screen bg-slate-900 text-white">
        <Sidebar />
        <div className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Business Snapshot</h1>
              <p className="text-slate-400">Real-time Overview</p>
            </div>
            <div className="flex gap-4">
                <button onClick={() => setCurrentPage('notifications')} className="relative p-2 bg-slate-800 rounded-full hover:bg-slate-700">
                    <Bell size={24}/>
                    {notifications.filter(n => n.status === 'unread').length > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>}
                </button>
                <button onClick={() => setCurrentPage('pos')} className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                    <ShoppingCart size={18} /> POS
                </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="flex justify-between items-start">
                <div className="overflow-hidden">
                  <p className="text-slate-400 text-sm">Total Revenue</p>
                  <h3 className="text-2xl font-bold mt-1 truncate" title={analytics.sales.totalRevenue}>Rs.{analytics.sales.totalRevenue.toLocaleString()}</h3>
                </div>
                <div className="p-2 bg-emerald-500/20 rounded-lg"><DollarSign className="text-emerald-500" size={24} /></div>
              </div>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="flex justify-between items-start">
                <div className="overflow-hidden">
                  <p className="text-slate-400 text-sm">Net Profit</p>
                  <h3 className={`text-2xl font-bold mt-1 truncate ${analytics.financial.netProfit >= 0 ? 'text-blue-400' : 'text-red-400'}`} title={analytics.financial.netProfit}>Rs.{analytics.financial.netProfit.toLocaleString()}</h3>
                </div>
                <div className="p-2 bg-blue-500/20 rounded-lg"><TrendingUp className="text-blue-500" size={24} /></div>
              </div>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="flex justify-between items-start">
                <div className="overflow-hidden">
                  <p className="text-slate-400 text-sm">Receivables</p>
                  <h3 className="text-2xl font-bold mt-1 text-yellow-400 truncate" title={analytics.financial.totalReceivables}>Rs.{analytics.financial.totalReceivables.toLocaleString()}</h3>
                </div>
                <div className="p-2 bg-yellow-500/20 rounded-lg"><Wallet className="text-yellow-500" size={24} /></div>
              </div>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="flex justify-between items-start">
                <div className="overflow-hidden">
                  <p className="text-slate-400 text-sm">Expenses</p>
                  <h3 className="text-2xl font-bold mt-1 text-red-400 truncate" title={analytics.financial.totalExpenses}>Rs.{analytics.financial.totalExpenses.toLocaleString()}</h3>
                </div>
                <div className="p-2 bg-red-500/20 rounded-lg"><TrendingDown className="text-red-500" size={24} /></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-bold mb-4">Sales Trends</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.charts.salesData}>
                    <defs>
                      <linearGradient id="colorSale" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                    <Area type="monotone" dataKey="amount" stroke="#10B981" fillOpacity={1} fill="url(#colorSale)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="text-lg font-bold mb-4">Inventory Value Distribution</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={analytics.charts.categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                                {analytics.charts.categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={analytics.charts.COLORS[index % analytics.charts.COLORS.length]} />
                                ))}
                            </Pie>
                            <RechartsTooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- POS ---
  if (currentPage === 'pos') {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.cartQty), 0);
    const taxRate = systemSettings?.tax_rate || systemSettings?.taxRate || 17;
    const gstAmount = subtotal * (taxRate / 100);
    const finalTotal = Math.max(0, subtotal + gstAmount - posDiscount);

    return (
      <div className="flex h-screen bg-slate-900 text-white">
        <Sidebar />
        <div className="flex-1 overflow-auto p-6 flex gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-6">Point of Sale</h1>
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="w-full bg-slate-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {products.filter(p => p.brand.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
                <div key={product.id} onClick={() => {
                  const exist = cart.find(c => c.id === product.id);
                  if (exist) setCart(cart.map(c => c.id === product.id ? {...c, cartQty: c.cartQty + 1} : c));
                  else setCart([...cart, {...product, cartQty: 1}]);
                }} className="bg-slate-800 p-4 rounded-xl border border-slate-700 cursor-pointer hover:border-blue-500 transition-all">
                  <h3 className="font-bold">{product.brand}</h3>
                  <p className="text-sm text-slate-400">{product.dim}</p>
                  <div className="flex justify-between mt-2">
                    <span className="text-emerald-400 font-bold">Rs.{product.price.toLocaleString()}</span>
                    <span className="text-xs bg-slate-700 px-2 py-1 rounded">Qty: {product.qty}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-96 bg-slate-800 rounded-xl border border-slate-700 p-6 flex flex-col h-full">
            <h2 className="text-xl font-bold mb-4">Current Order</h2>
            
            <select 
              className="w-full bg-slate-700 p-2 rounded mb-4"
              value={currentCustomer ? currentCustomer.id : ''}
              onChange={(e) => {
                const cust = customers.find(c => c.id === e.target.value);
                setCurrentCustomer(cust);
              }}
            >
              <option value="">Select Customer (Walk-in)</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
              ))}
            </select>

            <div className="flex-1 overflow-auto space-y-4 mb-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-slate-700/50 p-2 rounded-lg">
                  <div className="truncate w-32">
                    <p className="font-medium truncate">{item.brand}</p>
                    <p className="text-xs text-slate-400">Rs.{item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setCart(cart.map(c => c.id === item.id ? {...c, cartQty: Math.max(0, c.cartQty - 1)} : c).filter(c => c.cartQty > 0))} className="p-1 hover:bg-slate-600 rounded">-</button>
                    <span>{item.cartQty}</span>
                    <button onClick={() => setCart(cart.map(c => c.id === item.id ? {...c, cartQty: c.cartQty + 1} : c))} className="p-1 hover:bg-slate-600 rounded">+</button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-slate-700 pt-4 space-y-2">
               <div className="flex gap-2 mb-2">
                   <input type="text" placeholder="Promo Code" className="bg-slate-700 rounded p-2 text-xs flex-1" value={promoCode} onChange={e => setPromoCode(e.target.value)} />
                   <input type="number" placeholder="Discount Rs" className="bg-slate-700 rounded p-2 text-xs w-24" value={posDiscount} onChange={e => setPosDiscount(Number(e.target.value))} />
               </div>
               
               <div className="flex justify-between text-sm"><span>Subtotal</span><span>Rs.{subtotal.toLocaleString()}</span></div>
               <div className="flex justify-between text-sm"><span>GST ({taxRate}%)</span><span>Rs.{gstAmount.toLocaleString()}</span></div>
               <div className="flex justify-between text-sm text-green-400"><span>Discount</span><span>-Rs.{posDiscount.toLocaleString()}</span></div>
               <div className="flex justify-between text-xl font-bold text-emerald-400 border-t border-slate-700 pt-2"><span>Total</span><span>Rs.{finalTotal.toLocaleString()}</span></div>
               
               <div className="grid grid-cols-3 gap-2 my-4">
                 <button onClick={() => setPaymentMethod('cash')} className={`p-2 rounded text-xs ${paymentMethod === 'cash' ? 'bg-blue-600' : 'bg-slate-700'}`}>Cash</button>
                 <button onClick={() => setPaymentMethod('credit')} className={`p-2 rounded text-xs ${paymentMethod === 'credit' ? 'bg-blue-600' : 'bg-slate-700'}`}>Udhaar</button>
                 {integrations?.stripe?.enabled && <button onClick={() => setPaymentMethod('card')} className={`p-2 rounded text-xs ${paymentMethod === 'card' ? 'bg-blue-600' : 'bg-slate-700'}`}>Card</button>}
                 <button onClick={() => setPaymentMethod('financing')} className={`p-2 rounded text-xs ${paymentMethod === 'financing' ? 'bg-blue-600' : 'bg-slate-700'}`}>Financing</button>
                 <button onClick={() => setPaymentMethod('deposit')} className={`p-2 rounded text-xs ${paymentMethod === 'deposit' ? 'bg-blue-600' : 'bg-slate-700'}`}>Layaway</button>
               </div>
               
               {paymentMethod === 'deposit' && (
                   <div className="mb-2">
                       <label className="text-xs text-slate-400">Initial Deposit</label>
                       <input type="number" className="w-full bg-slate-900 p-2 rounded text-sm" placeholder="Enter Amount" onChange={e => setPaymentAmount(Number(e.target.value))} />
                   </div>
               )}

               <div className="flex gap-2">
                   <button className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg font-bold text-sm" onClick={async () => {
                        if(cart.length === 0) return;
                        
                        try {
                          const quoteData = {
                            id: `Q-${Date.now().toString().slice(-4)}`,
                            customer_name: currentCustomer ? currentCustomer.name : 'Walk-in',
                            date: new Date().toISOString().split('T')[0],
                            items: JSON.stringify(cart),
                            total: finalTotal,
                            status: 'Pending'
                          };
                          
                          const createdQuote = await api.quotes.create(quoteData);
                          setQuotes([...quotes, createdQuote]);
                          setCart([]);
                          setPosDiscount(0);
                          alert('Quote Created Successfully!');
                        } catch (error) {
                          console.error('Failed to create quote:', error);
                          alert('Failed to create quote: ' + error.message);
                        }
                   }}>Save Quote</button>
                   
                   <button className="flex-[2] bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold" onClick={() => {
                    if(cart.length === 0) return;
                    
                    const processSale = async () => {
                      try {
                        const transactionData = { 
                          invoice_number: invoiceNumber, 
                          date: new Date().toISOString(), 
                          customer_id: currentCustomer ? currentCustomer.id : null, 
                          customer_name: currentCustomer ? currentCustomer.name : 'Walk-in',
                          items: JSON.stringify(cart), 
                          subtotal, 
                          gst: gstAmount, 
                          discount: posDiscount, 
                          final_total: finalTotal, 
                          payment_method: paymentMethod, 
                          delivery_date: deliveryDate || null, 
                          delivery_status: deliveryDate ? 'Pending' : 'Delivered',
                          type: paymentMethod === 'deposit' ? 'layaway' : 'sale',
                          deposit: paymentMethod === 'deposit' ? paymentAmount : 0,
                          balance: paymentMethod === 'deposit' ? finalTotal - paymentAmount : 0
                        };

                        // Handle credit payment - update customer balance
                        if (paymentMethod === 'credit' && currentCustomer) {
                          await api.customers.updateBalance(currentCustomer.id, finalTotal, 'add');
                          const arData = { 
                            id: `AR-${Date.now()}`, 
                            customer: currentCustomer.id, 
                            amount: finalTotal, 
                            date: new Date().toISOString().split('T')[0], 
                            status: 'Unpaid',
                            type: 'sale'
                          };
                          const createdAR = await api.settings.createAREntry(arData);
                          setArEntries([...arEntries, createdAR]);
                          
                          // Refresh customers list
                          const updatedCustomers = await api.customers.getAll();
                          setCustomers(updatedCustomers);
                        }

                        if (paymentMethod === 'financing') {
                          if(!confirm('Start Consumer Financing Application?')) return;
                          alert('Financing Application Submitted to Provider. Approval Code: SIM-APPROVED-123');
                        }

                        // Create transaction in database
                        const createdTransaction = await api.transactions.create(transactionData);
                        setTransactions([...transactions, createdTransaction]);
                        
                        // Update product stock
                        for (const item of cart) {
                          await api.products.updateStock(item.id, item.cartQty, 'subtract');
                        }
                        
                        // Refresh products to get updated stock
                        const updatedProducts = await api.products.getAll();
                        setProducts(updatedProducts);

                        setInvoiceNumber(prev => prev + 1);
                        setCart([]);
                        setDeliveryDate('');
                        setPosDiscount(0);
                        setPromoCode('');
                        setCurrentCustomer(null);
                        setPaymentMethod('cash');
                        printInvoice(createdTransaction);
                      } catch (error) {
                        console.error('Failed to process sale:', error);
                        alert('Failed to process sale: ' + error.message);
                      }
                    };

                    if (paymentMethod === 'card') {
                      setShowStripeModal(true);
                      setProcessingPayment(true);
                      setTimeout(() => {
                        setProcessingPayment(false);
                        setShowStripeModal(false);
                        processSale();
                      }, 2000);
                    } else {
                      processSale();
                    }

                  }}>Checkout</button>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- CRM ---
  if (currentPage === 'customers') {
    return (
      <div className="flex h-screen bg-slate-900 text-white">
        <Sidebar />
        <div className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">CRM & Relationship Management</h1>
            <button onClick={() => setShowAddCustomerModal(true)} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2">
              <Plus size={18} /> Add Customer
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {customers.map(c => (
                <div key={c.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-bold text-lg">{c.name}</h3>
                            <p className="text-sm text-slate-400">{c.phone}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${c.loyaltyTier === 'Gold' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-slate-600 text-white'}`}>{c.loyaltyTier}</span>
                    </div>
                    <div className="space-y-2 text-sm text-slate-300 mb-4">
                        <div className="flex justify-between"><span>Next Call:</span><span className="text-red-300">{c.nextFollowUp || 'N/A'}</span></div>
                        <div className="flex justify-between"><span>Budget:</span><span>{c.budget || 'N/A'}</span></div>
                        <div className="flex justify-between border-t border-slate-700 pt-2"><span>Udhaar:</span><span className="text-red-400 font-bold">Rs.{c.balance}</span></div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => alert(`Calling ${c.phone}...`)} className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded text-xs" title="Log a Call">Call</button>
                        {c.balance > 0 && <button onClick={() => { setSelectedCustomerForPayment(c); setShowPaymentModal(true); }} className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-2 rounded text-xs">Receive</button>}
                    </div>
                </div>
            ))}
          </div>
          
          {showAddCustomerModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-slate-800 p-6 rounded-xl w-[500px] border border-slate-700">
                <h2 className="text-xl font-bold mb-4">Add Customer Profile</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input placeholder="Name" className="bg-slate-700 p-2 rounded" value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} />
                  <input placeholder="Phone" className="bg-slate-700 p-2 rounded" value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} />
                  <input placeholder="CNIC" className="bg-slate-700 p-2 rounded" value={newCustomer.cnic} onChange={e => setNewCustomer({...newCustomer, cnic: e.target.value})} />
                  <select className="bg-slate-700 p-2 rounded text-white" value={newCustomer.loyaltyTier} onChange={e => setNewCustomer({...newCustomer, loyaltyTier: e.target.value})}>
                      <option value="Bronze">Bronze Tier</option>
                      <option value="Silver">Silver Tier</option>
                      <option value="Gold">Gold Tier</option>
                  </select>
                  <input placeholder="Budget Range" className="bg-slate-700 p-2 rounded" value={newCustomer.budget} onChange={e => setNewCustomer({...newCustomer, budget: e.target.value})} />
                  <input type="date" className="bg-slate-700 p-2 rounded" value={newCustomer.nextFollowUp} onChange={e => setNewCustomer({...newCustomer, nextFollowUp: e.target.value})} />
                </div>
                <div className="flex gap-2">
                    <button onClick={async () => {
                      try {
                        const customerData = { 
                          id: `CUST${String(customers.length + 1).padStart(3, '0')}`, 
                          cnic: newCustomer.cnic || '',
                          name: newCustomer.name,
                          phone: newCustomer.phone,
                          email: newCustomer.email || '',
                          address: newCustomer.address || '',
                          join_date: new Date().toISOString().split('T')[0],
                          loyalty_tier: newCustomer.loyaltyTier || 'Bronze',
                          budget: newCustomer.budget || '',
                          next_follow_up: newCustomer.nextFollowUp || null,
                          preferences: newCustomer.preferences || ''
                        };
                        
                        const createdCustomer = await api.customers.create(customerData);
                        setCustomers([...customers, createdCustomer]);
                        setShowAddCustomerModal(false);
                        setNewCustomer({ name: '', phone: '', cnic: '', email: '', address: '', preferences: '', budget: '', nextFollowUp: '', loyaltyTier: 'Bronze' });
                      } catch (error) {
                        console.error('Failed to add customer:', error);
                        alert('Failed to add customer: ' + error.message);
                      }
                    }} className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold">Save</button>
                    <button onClick={() => setShowAddCustomerModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded">Cancel</button>
                </div>
              </div>
            </div>
          )}
          <PaymentModal />
        </div>
      </div>
    );
  }

  // --- SUPPLIERS ---
  if (currentPage === 'suppliers') {
      return (
        <div className="flex h-screen bg-slate-900 text-white">
            <Sidebar />
            <div className="flex-1 overflow-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Supplier Management</h1>
                    <button onClick={() => setShowAddSupplierModal(true)} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={18}/> Add Supplier</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {suppliers.map(s => (
                        <div key={s.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                            <div className="flex justify-between mb-4">
                                <h3 className="font-bold text-lg">{s.name}</h3>
                                <div className="text-yellow-400 flex items-center gap-1"><Star size={16}/> {s.rating}</div>
                            </div>
                            <div className="text-sm text-slate-400 space-y-1 mb-4">
                                <p>Phone: {s.phone}</p>
                                <p>Contract: {s.contractExpires || 'None'}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => { setSelectedSupplierForModal(s); setShowSupplierContractModal(true); }} className="flex-1 bg-slate-700 py-2 rounded text-xs hover:bg-slate-600">Contract</button>
                                <button onClick={() => { setSelectedSupplierForModal(s); setShowSupplierHistoryModal(true); }} className="flex-1 bg-slate-700 py-2 rounded text-xs hover:bg-slate-600">History</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                    <div className="p-4 border-b border-slate-700 font-bold">All Vendors List</div>
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50 text-slate-400">
                            <tr><th className="p-4">Name</th><th className="p-4">Phone</th><th className="p-4">Address</th><th className="p-4">Status</th></tr>
                        </thead>
                        <tbody>
                            {suppliers.map(s => (
                                <tr key={s.id} className="border-t border-slate-700 hover:bg-slate-700/50">
                                    <td className="p-4">{s.name}</td>
                                    <td className="p-4">{s.phone}</td>
                                    <td className="p-4">{s.address}</td>
                                    <td className="p-4"><span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">{s.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* DUMMY MODALS FOR SUPPLIERS */}
                {showSupplierContractModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-slate-800 p-6 rounded-xl w-96 border border-slate-700">
                            <h2 className="text-xl font-bold mb-4">Contract Details</h2>
                            <p className="mb-4">Contract for {selectedSupplierForModal?.name}</p>
                            <p className="text-slate-400 text-sm mb-4">Valid until: {selectedSupplierForModal?.contractExpires || 'No active contract'}</p>
                            <button onClick={() => setShowSupplierContractModal(false)} className="w-full bg-slate-700 py-2 rounded">Close</button>
                        </div>
                    </div>
                )}

                {showSupplierHistoryModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-slate-800 p-6 rounded-xl w-[600px] border border-slate-700 max-h-[80vh] overflow-y-auto">
                            <h2 className="text-xl font-bold mb-4">Order History - {selectedSupplierForModal?.name}</h2>
                            <table className="w-full text-left mb-4">
                                <thead className="bg-slate-900/50 text-slate-400">
                                    <tr><th>PO #</th><th>Date</th><th>Amount</th><th>Status</th></tr>
                                </thead>
                                <tbody>
                                    {purchaseOrders.filter(po => po.supplier === selectedSupplierForModal?.id).length === 0 ? (
                                        <tr><td colSpan="4" className="p-4 text-center text-slate-500">No history found.</td></tr>
                                    ) : (
                                        purchaseOrders.filter(po => po.supplier === selectedSupplierForModal?.id).map(po => (
                                            <tr key={po.id} className="border-t border-slate-700">
                                                <td className="p-2">{po.id}</td>
                                                <td className="p-2">{po.date}</td>
                                                <td className="p-2">Rs.{po.totalAmount.toLocaleString()}</td>
                                                <td className="p-2">{po.status}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                            <button onClick={() => setShowSupplierHistoryModal(false)} className="w-full bg-slate-700 py-2 rounded">Close</button>
                        </div>
                    </div>
                )}
                
                {showAddSupplierModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-slate-800 p-6 rounded-xl w-96 border border-slate-700">
                            <h2 className="text-xl font-bold mb-4">Add New Supplier</h2>
                            <div className="space-y-3">
                                <input placeholder="Supplier Name" className="w-full bg-slate-700 p-2 rounded" value={newSupplier.name} onChange={e => setNewSupplier({...newSupplier, name: e.target.value})} />
                                <input placeholder="Phone" className="w-full bg-slate-700 p-2 rounded" value={newSupplier.phone} onChange={e => setNewSupplier({...newSupplier, phone: e.target.value})} />
                                <input placeholder="Address" className="w-full bg-slate-700 p-2 rounded" value={newSupplier.address} onChange={e => setNewSupplier({...newSupplier, address: e.target.value})} />
                                <input placeholder="Contract Expiry (YYYY-MM-DD)" type="date" className="w-full bg-slate-700 p-2 rounded text-white" value={newSupplier.contractExpires} onChange={e => setNewSupplier({...newSupplier, contractExpires: e.target.value})} />
                                <div className="flex gap-2 mt-4">
                                    <button onClick={handleAddSupplier} className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold">Save</button>
                                    <button onClick={() => setShowAddSupplierModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      );
  }

  // --- RETURNS ---
  if (currentPage === 'returns') {
      return (
        <div className="flex h-screen bg-slate-900 text-white">
            <Sidebar />
            <div className="flex-1 overflow-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Returns Management</h1>
                    <button onClick={() => setShowProcessReturnModal(true)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2"><RotateCcw size={18}/> Process Return</button>
                </div>
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50"><tr><th className="p-4">ID</th><th className="p-4">Invoice</th><th className="p-4">Reason</th><th className="p-4">Refund Amount</th><th className="p-4">Status</th></tr></thead>
                        <tbody>
                            {returns.map(r => (
                                <tr key={r.id} className="border-t border-slate-700">
                                    <td className="p-4">{r.id}</td>
                                    <td className="p-4">#{r.invoice}</td>
                                    <td className="p-4">{r.reason}</td>
                                    <td className="p-4">Rs.{r.refund}</td>
                                    <td className="p-4">{r.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showProcessReturnModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-slate-800 p-6 rounded-xl w-96 border border-slate-700">
                            <h2 className="text-xl font-bold mb-4">Process Return</h2>
                            <input placeholder="Invoice Number" className="w-full bg-slate-700 p-2 rounded mb-3" />
                            <select className="w-full bg-slate-700 p-2 rounded mb-3 text-white">
                                <option>Reason: Defect</option>
                                <option>Reason: Changed Mind</option>
                                <option>Reason: Wrong Item</option>
                            </select>
                            <div className="flex gap-2 mb-3">
                                <div className="flex-1">
                                    <label className="text-xs text-slate-400">Total Value</label>
                                    <input placeholder="0" type="number" className="w-full bg-slate-700 p-2 rounded" onChange={e => setReturnRefundAmount(e.target.value)} />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs text-slate-400">Deduction %</label>
                                    <input placeholder="0%" type="number" className="w-full bg-slate-700 p-2 rounded" onChange={e => setReturnDeduction(e.target.value)} />
                                </div>
                            </div>
                            <div className="mb-4 text-right">
                                <span className="text-slate-400 text-sm">Net Refund: </span>
                                <span className="text-xl font-bold text-red-400">Rs.{Math.floor(returnRefundAmount * (1 - returnDeduction/100))}</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => {
                                    setReturns([...returns, { id: `RET${returns.length+1}`, invoice: '100X', reason: 'Manual Entry', refund: Math.floor(returnRefundAmount * (1 - returnDeduction/100)), status: 'Approved' }]);
                                    setShowProcessReturnModal(false);
                                }} className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded font-bold">Process</button>
                                <button onClick={() => setShowProcessReturnModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
                <PaymentModal />
            </div>
        </div>
      )
  }

  // --- FINANCIAL REPORTS ---
  if (currentPage === 'financial') {
      return (
        <div className="flex h-screen bg-slate-900 text-white">
            <Sidebar />
            <div className="flex-1 overflow-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Financial Center</h1>
                    <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
                        <button onClick={() => setActiveTab('pnl')} className={`px-4 py-2 rounded-md text-sm font-bold ${activeTab === 'pnl' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>P&L Statement</button>
                        <button onClick={() => setActiveTab('ar')} className={`px-4 py-2 rounded-md text-sm font-bold ${activeTab === 'ar' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Accounts Receivable</button>
                        <button onClick={() => setActiveTab('ap')} className={`px-4 py-2 rounded-md text-sm font-bold ${activeTab === 'ap' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Accounts Payable</button>
                    </div>
                </div>

                {activeTab === 'pnl' && (
                    <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-600">
                            <h2 className="text-2xl font-bold">Profit & Loss Statement</h2>
                            <button onClick={() => window.print()} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded flex items-center gap-2"><Download size={16}/> Download PDF</button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-emerald-400 font-bold text-lg">
                                <span>Total Revenue (Sales)</span>
                                <span>Rs.{analytics.sales.totalRevenue.toLocaleString()}</span>
                            </div>
                            <div className="pl-4 space-y-2 text-slate-400">
                                <div className="flex justify-between"><span>Sales Revenue</span><span>{analytics.sales.totalRevenue.toLocaleString()}</span></div>
                                <div className="flex justify-between"><span>Returns/Refunds</span><span>-0</span></div>
                            </div>

                            <div className="border-t border-slate-700 my-4"></div>

                            <div className="flex justify-between items-center text-red-400 font-bold text-lg">
                                <span>Cost of Goods Sold (COGS)</span>
                                <span>Rs.{analytics.inventory.totalCost.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between items-center font-bold text-xl py-2">
                                <span>Gross Profit</span>
                                <span>Rs.{analytics.inventory.grossMargin.toLocaleString()}</span>
                            </div>

                            <div className="border-t border-slate-700 my-4"></div>

                            <div className="flex justify-between items-center text-red-300 font-bold text-lg">
                                <span>Operating Expenses</span>
                                <span>Rs.{analytics.financial.totalExpenses.toLocaleString()}</span>
                            </div>
                            <div className="pl-4 space-y-2 text-slate-400">
                                {expenses.map(e => (
                                    <div key={e.id} className="flex justify-between"><span>{e.category}</span><span>{e.amount.toLocaleString()}</span></div>
                                ))}
                                <div className="flex justify-between border-t border-slate-700 pt-2 mt-2"><span>Total Expenses</span><span>{analytics.financial.totalExpenses.toLocaleString()}</span></div>
                            </div>

                            <div className="border-t border-slate-500 my-6 pt-4"></div>

                            <div className={`flex justify-between items-center font-bold text-3xl ${analytics.financial.netProfit >= 0 ? 'text-blue-400' : 'text-red-500'}`}>
                                <span>Net Profit / (Loss)</span>
                                <span>Rs.{analytics.financial.netProfit.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'ar' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-6">
                            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                <h3 className="text-sm text-slate-400">Total Receivables (Udhaar)</h3>
                                <div className="text-3xl font-bold text-blue-400">Rs.{analytics.financial.totalReceivables.toLocaleString()}</div>
                            </div>
                            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                <h3 className="text-sm text-slate-400">Overdue (&gt;30 Days)</h3>
                                <div className="text-3xl font-bold text-red-400">Rs.0</div>
                            </div>
                        </div>

                        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                            <div className="p-4 border-b border-slate-700 font-bold">Customer Ledger</div>
                            <table className="w-full text-left">
                                <thead className="bg-slate-900/50 text-slate-400">
                                    <tr>
                                        <th className="p-4">Customer</th>
                                        <th className="p-4">Phone</th>
                                        <th className="p-4">Total Balance</th>
                                        <th className="p-4">Last Payment</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.filter(c => c.balance > 0).length === 0 ? (
                                        <tr><td colSpan="6" className="p-8 text-center text-slate-500">No outstanding balances.</td></tr>
                                    ) : (
                                        customers.filter(c => c.balance > 0).map(c => (
                                            <tr key={c.id} className="border-t border-slate-700 hover:bg-slate-700/50">
                                                <td className="p-4 font-bold">{c.name}</td>
                                                <td className="p-4 text-sm text-slate-400">{c.phone}</td>
                                                <td className="p-4 font-bold text-red-400">Rs.{c.balance.toLocaleString()}</td>
                                                <td className="p-4 text-sm">-</td>
                                                <td className="p-4"><span className="bg-red-500/20 text-red-300 px-2 py-1 rounded text-xs">Overdue</span></td>
                                                <td className="p-4">
                                                    <button onClick={() => { setSelectedCustomerForPayment(c); setShowPaymentModal(true); }} className="bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded text-xs font-bold">Receive</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'ap' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-6">
                            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                <h3 className="text-sm text-slate-400">Total Payables</h3>
                                <div className="text-3xl font-bold text-orange-400">Rs.280,000</div>
                            </div>
                        </div>

                        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                            <div className="p-4 border-b border-slate-700 font-bold">Vendor Bills</div>
                            <table className="w-full text-left">
                                <thead className="bg-slate-900/50 text-slate-400">
                                    <tr>
                                        <th className="p-4">Vendor</th>
                                        <th className="p-4">Ref #</th>
                                        <th className="p-4">Due Date</th>
                                        <th className="p-4">Amount</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {purchaseOrders.map(po => (
                                        <tr key={po.id} className="border-t border-slate-700 hover:bg-slate-700/50">
                                            <td className="p-4 font-bold">{suppliers.find(s => s.id === po.supplier)?.name || po.supplier}</td>
                                            <td className="p-4 text-sm">{po.id}</td>
                                            <td className="p-4 text-sm text-red-300">{po.due_date || po.dueDate || '-'}</td>
                                            <td className="p-4 font-bold">Rs.{(po.total_amount || po.totalAmount || 0).toLocaleString()}</td>
                                            <td className="p-4"><span className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded text-xs">{po.status}</span></td>
                                            <td className="p-4">
                                                <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs font-bold">Pay Bill</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )
  }

  // --- EXPENSES ---
  if (currentPage === 'expenses') {
    return (
      <div className="flex h-screen bg-slate-900 text-white">
        <Sidebar />
        <div className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Expense Tracking</h1>
            <button onClick={() => setShowAddExpenseModal(true)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2">
              <Plus size={18} /> Record Expense
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="text-slate-400 text-sm">Total Expenses (This Month)</h3>
                <p className="text-3xl font-bold text-red-400">Rs.{analytics.financial.totalExpenses.toLocaleString()}</p>
             </div>
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-900/50 text-slate-400">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Note</th>
                  <th className="p-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(e => (
                  <tr key={e.id} className="border-t border-slate-700 hover:bg-slate-700/50">
                    <td className="p-4">{e.date}</td>
                    <td className="p-4"><span className="bg-slate-700 px-2 py-1 rounded text-xs">{e.category}</span></td>
                    <td className="p-4 text-slate-300">{e.note}</td>
                    <td className="p-4 text-right font-bold text-red-400">Rs.{e.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AddExpenseModal />
        </div>
      </div>
    );
  }

  // --- DELIVERIES ---
  if (currentPage === 'deliveries') {
      return (
        <div className="flex h-screen bg-slate-900 text-white">
            <Sidebar />
            <div className="flex-1 overflow-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Delivery Logistics</h1>
                        <p className="text-slate-400">Route Planning & Driver Manifests</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => alert('Calendar View Coming Soon')} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg flex items-center gap-2"><Calendar size={18}/> Schedule View</button>
                        <button onClick={() => setCurrentPage('pos')} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={18}/> New Delivery</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <h3 className="font-bold text-lg mb-2">Scheduled</h3>
                        <div className="text-3xl font-bold text-blue-400">{deliveries.filter(d => d.status === 'Scheduled').length}</div>
                        <p className="text-sm text-slate-400">Pending dispatch</p>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <h3 className="font-bold text-lg mb-2">In Transit</h3>
                        <div className="text-3xl font-bold text-yellow-400">{deliveries.filter(d => d.status === 'In Transit').length}</div>
                        <p className="text-sm text-slate-400">On the road</p>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <h3 className="font-bold text-lg mb-2">Completed Today</h3>
                        <div className="text-3xl font-bold text-emerald-400">{deliveries.filter(d => d.status === 'Delivered').length}</div>
                        <p className="text-sm text-slate-400">Successfully delivered</p>
                    </div>
                </div>

                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                    <div className="p-4 border-b border-slate-700 font-bold flex justify-between items-center">
                        <span>Active Routes</span>
                        <button onClick={() => generateReport('Delivery Efficiency')} className="text-sm text-blue-400 hover:underline">Print Manifests</button>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50 text-slate-400">
                            <tr>
                                <th className="p-4">ID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Address</th>
                                <th className="p-4">Items</th>
                                <th className="p-4">Driver/Vehicle</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveries.map(d => (
                                <tr key={d.id} className="border-t border-slate-700 hover:bg-slate-700/50">
                                    <td className="p-4 text-sm">{d.id}</td>
                                    <td className="p-4 font-bold">{d.customer}</td>
                                    <td className="p-4 text-sm text-slate-300">{d.address}</td>
                                    <td className="p-4 text-sm">{d.items}</td>
                                    <td className="p-4">
                                        <div className="text-sm font-bold">{d.driver}</div>
                                        <div className="text-xs text-slate-400">{d.vehicle}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            d.status === 'Delivered' ? 'bg-green-500/20 text-green-300' :
                                            d.status === 'In Transit' ? 'bg-yellow-500/20 text-yellow-300' :
                                            'bg-blue-500/20 text-blue-300'
                                        }`}>{d.status}</span>
                                    </td>
                                    <td className="p-4">
                                        <select 
                                            className="bg-slate-700 rounded p-1 text-xs"
                                            value={d.status}
                                            onChange={(e) => {
                                                setDeliveries(deliveries.map(del => del.id === d.id ? {...del, status: e.target.value} : del));
                                            }}
                                        >
                                            <option value="Scheduled">Scheduled</option>
                                            <option value="In Transit">In Transit</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Failed">Failed</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      );
  }

  // --- QUOTES & ORDERS ---
  if (currentPage === 'quotes') {
      return (
        <div className="flex h-screen bg-slate-900 text-white">
            <Sidebar />
            <div className="flex-1 overflow-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Quotes & Special Orders</h1>
                    <button onClick={() => setCurrentPage('pos')} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={18}/> New Quote</button>
                </div>

                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50 text-slate-400">
                            <tr>
                                <th className="p-4">Quote #</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Items</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quotes.length === 0 ? (
                                <tr><td colSpan="7" className="p-8 text-center text-slate-500">No active quotes found. Create one from POS.</td></tr>
                            ) : (
                                quotes.map(q => (
                                    <tr key={q.id} className="border-t border-slate-700">
                                        <td className="p-4">{q.id}</td>
                                        <td className="p-4">{q.customerName}</td>
                                        <td className="p-4">{q.date}</td>
                                        <td className="p-4">{q.items.length} items</td>
                                        <td className="p-4">Rs.{q.total.toLocaleString()}</td>
                                        <td className="p-4"><span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-xs">{q.status}</span></td>
                                        <td className="p-4 flex gap-2">
                                            <button onClick={() => printQuote(q)} className="text-slate-400 hover:text-white" title="Print Quote"><Printer size={18}/></button>
                                            <button onClick={() => {
                                                if(confirm('Load this quote into POS for checkout?')) {
                                                    setCart(q.items);
                                                    setCurrentPage('pos');
                                                    // Optional: Remove quote or mark as converted
                                                    // setQuotes(quotes.filter(item => item.id !== q.id));
                                                }
                                            }} className="text-blue-400 hover:underline text-sm">Convert to Order</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      )
  }

  // --- SERVICE & WARRANTY ---
  if (currentPage === 'service') {
      return (
        <div className="flex h-screen bg-slate-900 text-white">
            <Sidebar />
            <div className="flex-1 overflow-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Service & Warranty</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <h2 className="text-xl font-bold mb-4">Warranty Lookup</h2>
                        <div className="flex gap-2 mb-4">
                            <input className="flex-1 bg-slate-700 p-2 rounded" placeholder="Enter Invoice #, Phone, or Serial Number" />
                            <button className="bg-blue-600 px-4 rounded font-bold">Search</button>
                        </div>
                        <div className="p-4 bg-slate-900/50 rounded text-center text-slate-500">
                            Enter details to find warranty coverage
                        </div>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Active Service Tickets</h2>
                            <button onClick={() => document.getElementById('ticket-list').scrollIntoView({ behavior: 'smooth' })} className="text-sm text-blue-400">View All</button>
                        </div>
                        {serviceTickets.length === 0 ? (
                            <p className="text-slate-500">No active tickets</p>
                        ) : (
                            <div id="ticket-list" className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                {serviceTickets.map(ticket => (
                                    <div key={ticket.id} className="bg-slate-900/50 p-3 rounded border border-slate-700 flex justify-between items-center">
                                        <div>
                                            <div className="font-bold text-sm">{ticket.customerName}</div>
                                            <div className="text-xs text-slate-400">{ticket.issue}</div>
                                            <div className="text-xs text-slate-500">Ref: #{ticket.invoiceRef}</div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-2 py-1 rounded text-xs ${ticket.status === 'Open' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>{ticket.status}</span>
                                            <div className="mt-1">
                                                <button onClick={() => {
                                                    if(confirm('Mark ticket as Resolved?')) {
                                                        setServiceTickets(serviceTickets.map(t => t.id === ticket.id ? {...t, status: 'Resolved'} : t));
                                                    }
                                                }} className="text-blue-400 text-xs hover:underline">Resolve</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button onClick={() => setShowCreateTicketModal(true)} className="w-full mt-4 bg-slate-700 py-2 rounded hover:bg-slate-600">Create New Ticket</button>
                    </div>
                </div>

                {showCreateTicketModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-slate-800 p-6 rounded-xl w-96 border border-slate-700">
                            <h2 className="text-xl font-bold mb-4">New Service Ticket</h2>
                            <div className="space-y-3">
                                <input placeholder="Customer Name" className="w-full bg-slate-700 p-2 rounded" value={newTicket.customerName} onChange={e => setNewTicket({...newTicket, customerName: e.target.value})} />
                                <input placeholder="Phone" className="w-full bg-slate-700 p-2 rounded" value={newTicket.phone} onChange={e => setNewTicket({...newTicket, phone: e.target.value})} />
                                <input placeholder="Invoice Reference (Optional)" className="w-full bg-slate-700 p-2 rounded" value={newTicket.invoiceRef} onChange={e => setNewTicket({...newTicket, invoiceRef: e.target.value})} />
                                <textarea placeholder="Issue Description" className="w-full bg-slate-700 p-2 rounded h-24" value={newTicket.issue} onChange={e => setNewTicket({...newTicket, issue: e.target.value})}></textarea>
                                <div>
                                    <label className="text-xs text-slate-400">Priority</label>
                                    <select className="w-full bg-slate-700 p-2 rounded text-white" value={newTicket.priority} onChange={e => setNewTicket({...newTicket, priority: e.target.value})}>
                                        <option>Low</option>
                                        <option>Normal</option>
                                        <option>High</option>
                                        <option>Urgent</option>
                                    </select>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <button onClick={() => {
                                        setServiceTickets([...serviceTickets, { ...newTicket, id: `TKT-${Date.now()}`, date: new Date().toLocaleDateString() }]);
                                        setShowCreateTicketModal(false);
                                        setNewTicket({ customerName: '', phone: '', issue: '', priority: 'Normal', status: 'Open', invoiceRef: '' });
                                    }} className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold">Create Ticket</button>
                                    <button onClick={() => setShowCreateTicketModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )
  }
  
  // --- REPORTS ---
  if (currentPage === 'reports') {
      return (
        <div className="flex h-screen bg-slate-900 text-white">
            <Sidebar />
            <div className="flex-1 overflow-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Business Intelligence Reports</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500 cursor-pointer transition-all">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-blue-900/50 p-3 rounded-lg"><BarChart4 className="text-blue-400" size={24}/></div>
                            <div>
                                <h3 className="font-bold text-lg">Sales Performance</h3>
                                <p className="text-sm text-slate-400">Revenue by category, brand, and sales rep</p>
                            </div>
                        </div>
                        <button onClick={() => generateReport('Sales Performance')} className="w-full bg-slate-700 py-2 rounded text-sm hover:bg-blue-600 transition-colors">Generate PDF Report</button>
                    </div>

                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-emerald-500 cursor-pointer transition-all">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-emerald-900/50 p-3 rounded-lg"><Package className="text-emerald-400" size={24}/></div>
                            <div>
                                <h3 className="font-bold text-lg">Inventory Valuation</h3>
                                <p className="text-sm text-slate-400">Current stock value, COGS, and turnover</p>
                            </div>
                        </div>
                        <button onClick={() => generateReport('Inventory Valuation')} className="w-full bg-slate-700 py-2 rounded text-sm hover:bg-emerald-600 transition-colors">Generate PDF Report</button>
                    </div>

                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-red-500 cursor-pointer transition-all">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-red-900/50 p-3 rounded-lg"><AlertTriangle className="text-red-400" size={24}/></div>
                            <div>
                                <h3 className="font-bold text-lg">Dead Stock & Low Movers</h3>
                                <p className="text-sm text-slate-400">Items unsold for &gt;90 days</p>
                            </div>
                        </div>
                        <button onClick={() => generateReport('Dead Stock')} className="w-full bg-slate-700 py-2 rounded text-sm hover:bg-red-600 transition-colors">Generate PDF Report</button>
                    </div>

                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-purple-500 cursor-pointer transition-all">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-purple-900/50 p-3 rounded-lg"><Users className="text-purple-400" size={24}/></div>
                            <div>
                                <h3 className="font-bold text-lg">Customer Insights</h3>
                                <p className="text-sm text-slate-400">Top spenders, loyalty tiers, and churn risk</p>
                            </div>
                        </div>
                        <button onClick={() => generateReport('Customer Insights')} className="w-full bg-slate-700 py-2 rounded text-sm hover:bg-purple-600 transition-colors">Generate PDF Report</button>
                    </div>

                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-orange-500 cursor-pointer transition-all">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-orange-900/50 p-3 rounded-lg"><Truck className="text-orange-400" size={24}/></div>
                            <div>
                                <h3 className="font-bold text-lg">Delivery Efficiency</h3>
                                <p className="text-sm text-slate-400">On-time rates, fuel costs per route</p>
                            </div>
                        </div>
                        <button onClick={() => generateReport('Delivery Efficiency')} className="w-full bg-slate-700 py-2 rounded text-sm hover:bg-orange-600 transition-colors">Generate PDF Report</button>
                    </div>

                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-cyan-500 cursor-pointer transition-all">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-cyan-900/50 p-3 rounded-lg"><Activity className="text-cyan-400" size={24}/></div>
                            <div>
                                <h3 className="font-bold text-lg">Tax & Audit Log</h3>
                                <p className="text-sm text-slate-400">GST reports and system activity trail</p>
                            </div>
                        </div>
                        <button onClick={() => generateReport('Tax Audit')} className="w-full bg-slate-700 py-2 rounded text-sm hover:bg-cyan-600 transition-colors">Generate PDF Report</button>
                    </div>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h2 className="text-xl font-bold mb-4">Recent Generated Reports</h2>
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50 text-slate-400">
                            <tr>
                                <th className="p-4">Report Name</th>
                                <th className="p-4">Date Generated</th>
                                <th className="p-4">Generated By</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-slate-700">
                                <td className="p-4 font-bold">Monthly Sales - December</td>
                                <td className="p-4 text-sm">2024-12-31</td>
                                <td className="p-4 text-sm">Ali Raza</td>
                                <td className="p-4"><button onClick={() => generateReport('Sales Performance')} className="text-blue-400 hover:underline">Download</button></td>
                            </tr>
                            <tr className="border-t border-slate-700">
                                <td className="p-4 font-bold">Inventory Audit Q4</td>
                                <td className="p-4 text-sm">2024-12-30</td>
                                <td className="p-4 text-sm">System Auto</td>
                                <td className="p-4"><button onClick={() => generateReport('Inventory Valuation')} className="text-blue-400 hover:underline">Download</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      )
  }

  // --- SETTINGS ---
  if (currentPage === 'settings') {
      return (
        <div className="flex h-screen bg-slate-900 text-white">
            <Sidebar />
            <div className="flex-1 overflow-auto p-6">
                <h1 className="text-3xl font-bold mb-6">System Settings</h1>
                <div className="max-w-2xl space-y-6">
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <h2 className="text-xl font-bold mb-4">Store Profile</h2>
                        <div className="space-y-3">
                            <div><label className="block text-sm text-slate-400">Store Name</label><input className="w-full bg-slate-700 p-2 rounded mt-1" value={systemSettings.storeName} onChange={e => setSystemSettings({...systemSettings, storeName: e.target.value})} /></div>
                            <div><label className="block text-sm text-slate-400">Address</label><input className="w-full bg-slate-700 p-2 rounded mt-1" value={systemSettings.storeAddress} onChange={e => setSystemSettings({...systemSettings, storeAddress: e.target.value})} /></div>
                            <div><label className="block text-sm text-slate-400">Phone</label><input className="w-full bg-slate-700 p-2 rounded mt-1" value={systemSettings.storePhone} onChange={e => setSystemSettings({...systemSettings, storePhone: e.target.value})} /></div>
                        </div>
                    </div>

                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <h2 className="text-xl font-bold mb-4">Hardware & Printing</h2>
                        <div className="bg-blue-900/20 p-4 rounded-lg mb-4 text-sm text-blue-200 border border-blue-800">
                            <p><strong>Note:</strong> This setting formats the receipt CSS. Please use your browser's print dialog to select the actual physical printer.</p>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm text-slate-400">Receipt Format</label>
                                <select className="w-full bg-slate-700 p-2 rounded mt-1 text-white" value={systemSettings.printerType} onChange={e => setSystemSettings({...systemSettings, printerType: e.target.value})}>
                                    <option value="a4">Standard A4 / Letter</option>
                                    <option value="thermal80">Thermal 80mm</option>
                                    <option value="thermal58">Thermal 58mm</option>
                                </select>
                            </div>
                            <button onClick={() => printInvoice({ invoiceNumber: 'TEST', date: '2024-01-01', customerName: 'Test Print', items: [], subtotal: 0, gst: 0, discount: 0, finalTotal: 0, paymentMethod: 'test' })} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded">Test Print</button>
                        </div>
                    </div>

                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <h2 className="text-xl font-bold mb-4">Tax Configuration</h2>
                        <div className="flex items-center gap-4">
                            <label className="text-sm text-slate-400">GST Rate (%)</label>
                            <input type="number" className="bg-slate-700 p-2 rounded w-24" value={systemSettings.taxRate} onChange={e => setSystemSettings({...systemSettings, taxRate: Number(e.target.value)})} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )
  }

  // --- INVENTORY ---
  if (currentPage === 'inventory') {
      return (
        <div className="flex h-screen bg-slate-900 text-white">
            <Sidebar />
            <div className="flex-1 overflow-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Inventory Management</h1>
                    <div className="flex gap-2">
                        <button className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg border border-slate-700"><Filter size={20}/></button>
                        <button onClick={() => {
                            setNewProduct({ sku: '', brand: '', category: 'General', dim: '', price: 0, cost: 0, qty: 0, minLevel: 5, supplier: '', location: 'Showroom' });
                            setShowAddProductModal(true);
                        }} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={18}/> Add Product</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <p className="text-slate-400 text-sm">Total SKUs</p>
                        <h3 className="text-2xl font-bold">{analytics.inventory.totalSKUs}</h3>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <p className="text-slate-400 text-sm">Total Value</p>
                        <h3 className="text-2xl font-bold text-emerald-400">Rs.{analytics.inventory.totalValue.toLocaleString()}</h3>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <p className="text-slate-400 text-sm">Low Stock Items</p>
                        <h3 className="text-2xl font-bold text-red-400">{analytics.inventory.lowStockItems}</h3>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <p className="text-slate-400 text-sm">Categories</p>
                        <h3 className="text-2xl font-bold text-blue-400">{analytics.charts.categoryData.length}</h3>
                    </div>
                </div>

                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50 text-slate-400">
                            <tr>
                                <th className="p-4">SKU / Product</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Variants</th>
                                <th className="p-4">Location</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Stock</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id} className="border-t border-slate-700 hover:bg-slate-700/50">
                                    <td className="p-4">
                                        <div className="font-bold">{p.brand}</div>
                                        <div className="text-xs text-slate-400">{p.sku}</div>
                                    </td>
                                    <td className="p-4"><span className="bg-slate-700 px-2 py-1 rounded text-xs">{p.category}</span></td>
                                    <td className="p-4 text-sm">
                                        {p.variants && p.variants.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {p.variants.map((v, i) => (
                                                    <span key={i} className="bg-blue-900/30 text-blue-300 text-xs px-1 rounded border border-blue-800">{v.size}</span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-slate-500 text-xs">Single SKU</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-sm text-slate-300">{p.location || 'Showroom'}</td>
                                    <td className="p-4 font-bold text-emerald-400">Rs.{p.price.toLocaleString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${p.qty <= p.reorderLevel ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                                            {p.qty} Units
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => {
                                                setNewProduct({...p});
                                                setShowAddProductModal(true);
                                            }} className="p-2 bg-slate-700 hover:bg-blue-600 rounded text-slate-300 hover:text-white transition-colors" title="Edit">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => {
                                                if(confirm('Are you sure you want to delete this product?')) {
                                                    setProducts(products.filter(item => item.id !== p.id));
                                                }
                                            }} className="p-2 bg-slate-700 hover:bg-red-600 rounded text-slate-300 hover:text-white transition-colors" title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showAddProductModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-slate-800 p-6 rounded-xl w-[700px] border border-slate-700 max-h-[90vh] overflow-y-auto">
                            <h2 className="text-xl font-bold mb-4">{newProduct.id ? 'Edit Product Matrix' : 'Add New Product'}</h2>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div><label className="text-xs text-slate-400">Brand Name</label><input className="w-full bg-slate-700 p-2 rounded" value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})} /></div>
                                <div><label className="text-xs text-slate-400">SKU Code</label><input className="w-full bg-slate-700 p-2 rounded" value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})} /></div>
                                <div><label className="text-xs text-slate-400">Category</label><input className="w-full bg-slate-700 p-2 rounded" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} /></div>
                                <div><label className="text-xs text-slate-400">Dimensions</label><input className="w-full bg-slate-700 p-2 rounded" value={newProduct.dim} onChange={e => setNewProduct({...newProduct, dim: e.target.value})} /></div>
                                <div><label className="text-xs text-slate-400">Sale Price (Base)</label><input type="number" className="w-full bg-slate-700 p-2 rounded" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} /></div>
                                <div><label className="text-xs text-slate-400">Cost Price</label><input type="number" className="w-full bg-slate-700 p-2 rounded" value={newProduct.cost} onChange={e => setNewProduct({...newProduct, cost: Number(e.target.value)})} /></div>
                                <div><label className="text-xs text-slate-400">Stock Location</label>
                                    <select className="w-full bg-slate-700 p-2 rounded text-white" value={newProduct.location || 'Showroom'} onChange={e => setNewProduct({...newProduct, location: e.target.value})}>
                                        <option value="Showroom">Showroom (Floor)</option>
                                        <option value="Warehouse A">Warehouse A</option>
                                        <option value="Warehouse B">Warehouse B</option>
                                    </select>
                                </div>
                                <div><label className="text-xs text-slate-400">Min Stock Level</label><input type="number" className="w-full bg-slate-700 p-2 rounded" value={newProduct.minLevel || 0} onChange={e => setNewProduct({...newProduct, minLevel: Number(e.target.value)})} /></div>
                                <div><label className="text-xs text-slate-400">Supplier</label>
                                    <select className="w-full bg-slate-700 p-2 rounded text-white" value={newProduct.supplier || ''} onChange={e => setNewProduct({...newProduct, supplier: e.target.value})}>
                                        <option value="">Select Supplier</option>
                                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div><label className="text-xs text-slate-400">Warranty</label><input className="w-full bg-slate-700 p-2 rounded" value={newProduct.warranty || ''} onChange={e => setNewProduct({...newProduct, warranty: e.target.value})} /></div>
                            </div>
                            
                            {/* Variant Builder */}
                            <div className="mb-4 border-t border-slate-700 pt-4">
                                <h3 className="font-bold mb-2 text-sm">Product Variants (Matrix)</h3>
                                <div className="bg-slate-900/50 p-3 rounded">
                                    <div className="flex gap-2 mb-2">
                                        <input placeholder="Size (e.g. King)" className="bg-slate-700 p-1 rounded text-xs flex-1" id="varSize" />
                                        <input placeholder="Color" className="bg-slate-700 p-1 rounded text-xs flex-1" id="varColor" />
                                        <input placeholder="Price" type="number" className="bg-slate-700 p-1 rounded text-xs w-20" id="varPrice" />
                                        <button onClick={() => {
                                            const size = document.getElementById('varSize').value;
                                            const color = document.getElementById('varColor').value;
                                            const price = document.getElementById('varPrice').value;
                                            if(size && price) {
                                                const currentVariants = newProduct.variants || [];
                                                setNewProduct({...newProduct, variants: [...currentVariants, {size, color, price: Number(price)}]});
                                                document.getElementById('varSize').value = '';
                                            }
                                        }} className="bg-blue-600 px-3 rounded text-xs font-bold">Add</button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(newProduct.variants || []).map((v, i) => (
                                            <span key={i} className="bg-slate-700 px-2 py-1 rounded text-xs flex items-center gap-2">
                                                {v.size} - {v.color} (Rs.{v.price})
                                                <button onClick={() => setNewProduct({...newProduct, variants: newProduct.variants.filter((_, idx) => idx !== i)})} className="text-red-400 hover:text-white"><XIcon size={12}/></button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => {
                                    if (newProduct.id) {
                                        // Edit Mode
                                        setProducts(products.map(p => p.id === newProduct.id ? newProduct : p));
                                        logAudit('Inventory', `Updated product: ${newProduct.brand}`);
                                    } else {
                                        // Add Mode
                                        handleAddProduct();
                                    }
                                    setShowAddProductModal(false);
                                }} className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold">Save Product</button>
                                <button onClick={() => setShowAddProductModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      );
  }

  // --- PURCHASES (PO) ---
  if (currentPage === 'purchases') {
      return (
        <div className="flex h-screen bg-slate-900 text-white">
            <Sidebar />
            <div className="flex-1 overflow-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Purchase Orders</h1>
                    <button onClick={() => setShowCreatePOModal(true)} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={18}/> Create PO</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <h3 className="font-bold text-lg mb-2">Pending Receivals</h3>
                        <div className="text-3xl font-bold text-orange-400">{purchaseOrders.filter(p => p.status === 'pending').length}</div>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <h3 className="font-bold text-lg mb-2">Drafts</h3>
                        <div className="text-3xl font-bold text-slate-400">0</div>
                    </div>
                </div>

                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50 text-slate-400">
                            <tr>
                                <th className="p-4">PO #</th>
                                <th className="p-4">Supplier</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Total Amount</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchaseOrders.map(po => (
                                <tr key={po.id} className="border-t border-slate-700 hover:bg-slate-700/50">
                                    <td className="p-4">{po.id}</td>
                                    <td className="p-4 font-bold">{suppliers.find(s => s.id === po.supplier)?.name || po.supplier}</td>
                                    <td className="p-4 text-sm">{po.date}</td>
                                    <td className="p-4">Rs.{(po.total_amount || po.totalAmount || 0).toLocaleString()}</td>
                                    <td className="p-4"><span className={`px-2 py-1 rounded text-xs ${po.status === 'received' ? 'bg-green-500/20 text-green-300' : 'bg-orange-500/20 text-orange-300'}`}>{po.status}</span></td>
                                    <td className="p-4">
                                        {po.status === 'pending' && (
                                            <button onClick={() => {
                                                if(confirm('Receive all items into inventory?')) {
                                                    // 1. Update PO Status
                                                    setPurchaseOrders(purchaseOrders.map(p => p.id === po.id ? {...p, status: 'received'} : p));
                                                    
                                                    // 2. Update Inventory Stock
                                                    const updatedProducts = [...products];
                                                    po.items.forEach(poItem => {
                                                        const productIndex = updatedProducts.findIndex(p => p.id === poItem.productId);
                                                        if(productIndex > -1) {
                                                            updatedProducts[productIndex] = {
                                                                ...updatedProducts[productIndex],
                                                                qty: updatedProducts[productIndex].qty + poItem.qty,
                                                                lastRestocked: new Date().toISOString().split('T')[0]
                                                            };
                                                        }
                                                    });
                                                    setProducts(updatedProducts);

                                                    // 3. Log Audit
                                                    logAudit('Purchasing', `Received PO ${po.id} - Stock Updated`);
                                                    alert(`PO ${po.id} Received. Inventory updated successfully.`);
                                                }
                                            }} className="bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded text-xs font-bold">Receive</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showCreatePOModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-slate-800 p-6 rounded-xl w-[600px] border border-slate-700">
                            <h2 className="text-xl font-bold mb-4">Create Purchase Order</h2>
                            <div className="space-y-4">
                                <select className="w-full bg-slate-700 p-2 rounded text-white" onChange={e => setNewPO({...newPO, supplierId: e.target.value})}>
                                    <option value="">Select Supplier</option>
                                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                                <input type="date" className="w-full bg-slate-700 p-2 rounded text-white" onChange={e => setNewPO({...newPO, dueDate: e.target.value})} />
                                <div className="p-4 bg-slate-900/50 rounded border border-slate-700 max-h-60 overflow-y-auto">
                                    <h3 className="text-xs font-bold text-slate-400 mb-2">Select Items to Order</h3>
                                    {products.map(product => (
                                        <div key={product.id} className="flex justify-between items-center py-2 border-b border-slate-700 last:border-0">
                                            <div>
                                                <div className="font-bold text-sm">{product.brand}</div>
                                                <div className="text-xs text-slate-500">Stock: {product.qty}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="number" 
                                                    className="w-16 bg-slate-700 p-1 rounded text-xs text-center text-white" 
                                                    placeholder="Qty"
                                                    onChange={(e) => {
                                                        const qty = Number(e.target.value);
                                                        const existing = newPO.items.find(i => i.productId === product.id);
                                                        let newItems;
                                                        if (qty > 0) {
                                                            if (existing) {
                                                                newItems = newPO.items.map(i => i.productId === product.id ? { ...i, qty } : i);
                                                            } else {
                                                                newItems = [...newPO.items, { productId: product.id, qty, price: product.cost }];
                                                            }
                                                        } else {
                                                            newItems = newPO.items.filter(i => i.productId !== product.id);
                                                        }
                                                        setNewPO({ ...newPO, items: newItems });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="text-right text-sm text-slate-400">
                                    Total Items: <span className="text-white font-bold">{newPO.items.reduce((acc, i) => acc + i.qty, 0)}</span> | 
                                    Est. Cost: <span className="text-white font-bold">Rs.{newPO.items.reduce((acc, i) => acc + (i.qty * i.price), 0).toLocaleString()}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={handleCreatePO} className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold">Create PO</button>
                                    <button onClick={() => setShowCreatePOModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )
  }

  // --- EMPLOYEES & HR ---
  if (currentPage === 'employees') {
      return (
        <div className="flex h-screen bg-slate-900 text-white">
            <Sidebar />
            <div className="flex-1 overflow-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Team Performance</h1>
                    <button onClick={() => setShowAddEmployeeModal(true)} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={18}/> Add Employee</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {employees.map(emp => (
                        <div key={emp.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-slate-700 p-3 rounded-full"><User size={24} /></div>
                                    <div>
                                        <h3 className="font-bold text-lg">{emp.name}</h3>
                                        <p className="text-sm text-slate-400">{emp.role}</p>
                                    </div>
                                </div>
                                <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">Score: {emp.kpiScore}/5.0</span>
                            </div>
                            
                            <div className="space-y-3 mb-4">
                                <div>
                                    <div className="flex justify-between text-xs mb-1"><span>Sales Target</span><span>{Math.round((emp.targets.achieved / emp.targets.sales) * 100)}%</span></div>
                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500" style={{ width: `${(emp.targets.achieved / emp.targets.sales) * 100}%` }}></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="bg-slate-900/50 p-2 rounded">
                                        <p className="text-slate-400">Commission Due</p>
                                        <p className="font-bold text-emerald-400">Rs.{emp.commission}</p>
                                    </div>
                                    <div className="bg-slate-900/50 p-2 rounded">
                                        <p className="text-slate-400">Attendance</p>
                                        <p className="font-bold text-white">{emp.attendance}%</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-2">
                                <button onClick={() => {
                                    setNewEmployee(emp);
                                    setSelectedEmployee(emp);
                                    setShowAddEmployeeModal(true);
                                }} className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded text-xs">Edit Profile</button>
                                <button onClick={() => {
                                    if(confirm(`Pay commission of Rs.${emp.commission.toLocaleString()} to ${emp.name}?`)) {
                                        const expense = {
                                            id: expenses.length + 1,
                                            category: 'Salaries',
                                            amount: emp.commission,
                                            date: new Date().toISOString().split('T')[0],
                                            note: `Commission Payment to ${emp.name}`
                                        };
                                        setExpenses([...expenses, expense]);
                                        setEmployees(employees.map(e => e.id === emp.id ? { ...e, commission: 0 } : e));
                                        logAudit('Finance', `Paid commission to ${emp.name}: Rs.${emp.commission}`);
                                        alert('Commission Paid & Recorded as Expense');
                                    }
                                }} className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-2 rounded text-xs font-bold">Pay Commission</button>
                            </div>
                        </div>
                    ))}
                </div>
                <AddEmployeeModal />
            </div>
        </div>
      )
  }

  // --- NOTIFICATIONS ---
  if (currentPage === 'notifications') {
      return (
       <div className="flex h-screen bg-slate-900 text-white">
         <Sidebar />
         <div className="flex-1 overflow-auto p-6">
           <h1 className="text-3xl font-bold mb-6">Notifications</h1>
           <div className="max-w-2xl mx-auto space-y-4">
               {notifications.map(n => (
                   <div key={n.id} className={`p-4 rounded-lg border flex justify-between items-center ${n.status === 'unread' ? 'bg-slate-800 border-blue-500' : 'bg-slate-800/50 border-slate-700'}`}>
                       <div className="flex items-center gap-4">
                           <div className={`p-2 rounded-full ${n.type === 'inventory' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                               <Bell size={20} />
                           </div>
                           <div>
                               <p className={`font-medium ${n.status === 'unread' ? 'text-white' : 'text-slate-400'}`}>{n.text}</p>
                               <p className="text-xs text-slate-500">{n.date} • {n.type.toUpperCase()}</p>
                           </div>
                       </div>
                       <button onClick={() => setNotifications(notifications.filter(x => x.id !== n.id))} className="text-slate-400 hover:text-white"><XIcon size={16}/></button>
                   </div>
               ))}
               {notifications.length === 0 && <p className="text-center text-slate-500 py-12">All caught up! No new notifications.</p>}
           </div>
         </div>
       </div>
     )
  }

  return null;
};

export default BismillahCompleteOS;
