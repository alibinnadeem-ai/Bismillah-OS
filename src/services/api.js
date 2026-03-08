// API Service Layer for Bismillah Mattress Store
// Centralized API calls to backend

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('authToken');

// Set token in localStorage
export const setAuthToken = (token) => localStorage.setItem('authToken', token);

// Remove token from localStorage
export const removeAuthToken = () => localStorage.removeItem('authToken');

// Generic fetch wrapper with authentication
const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
};

// ==================== AUTHENTICATION ====================
export const auth = {
  login: async (email, password) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(data.token);
    return data;
  },
  
  logout: async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } finally {
      removeAuthToken();
    }
  },
  
  verify: async () => {
    return apiFetch('/auth/verify');
  },
};

// ==================== PRODUCTS ====================
export const products = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/products${query ? `?${query}` : ''}`);
  },
  
  getById: (id) => apiFetch(`/products/${id}`),
  
  create: (productData) => apiFetch('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),
  
  update: (id, productData) => apiFetch(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  }),
  
  updateStock: (id, qty, operation) => apiFetch(`/products/${id}/stock`, {
    method: 'PATCH',
    body: JSON.stringify({ qty, operation }),
  }),
  
  delete: (id) => apiFetch(`/products/${id}`, { method: 'DELETE' }),
};

// ==================== CUSTOMERS ====================
export const customers = {
  getAll: () => apiFetch('/customers'),
  
  getById: (id) => apiFetch(`/customers/${id}`),
  
  create: (customerData) => apiFetch('/customers', {
    method: 'POST',
    body: JSON.stringify(customerData),
  }),
  
  update: (id, customerData) => apiFetch(`/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(customerData),
  }),
  
  updateBalance: (id, amount, operation) => apiFetch(`/customers/${id}/balance`, {
    method: 'PATCH',
    body: JSON.stringify({ amount, operation }),
  }),
  
  delete: (id) => apiFetch(`/customers/${id}`, { method: 'DELETE' }),
};

// ==================== EMPLOYEES ====================
export const employees = {
  getAll: () => apiFetch('/employees'),
  
  getById: (id) => apiFetch(`/employees/${id}`),
  
  create: (employeeData) => apiFetch('/employees', {
    method: 'POST',
    body: JSON.stringify(employeeData),
  }),
  
  update: (id, employeeData) => apiFetch(`/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(employeeData),
  }),
  
  delete: (id) => apiFetch(`/employees/${id}`, { method: 'DELETE' }),
};

// ==================== SUPPLIERS ====================
export const suppliers = {
  getAll: () => apiFetch('/suppliers'),
  
  getById: (id) => apiFetch(`/suppliers/${id}`),
  
  create: (supplierData) => apiFetch('/suppliers', {
    method: 'POST',
    body: JSON.stringify(supplierData),
  }),
  
  update: (id, supplierData) => apiFetch(`/suppliers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(supplierData),
  }),
  
  delete: (id) => apiFetch(`/suppliers/${id}`, { method: 'DELETE' }),
};

// ==================== TRANSACTIONS ====================
export const transactions = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/transactions${query ? `?${query}` : ''}`);
  },
  
  getById: (invoiceNumber) => apiFetch(`/transactions/${invoiceNumber}`),
  
  create: (transactionData) => apiFetch('/transactions', {
    method: 'POST',
    body: JSON.stringify(transactionData),
  }),
  
  update: (invoiceNumber, transactionData) => apiFetch(`/transactions/${invoiceNumber}`, {
    method: 'PUT',
    body: JSON.stringify(transactionData),
  }),
};

// ==================== QUOTES ====================
export const quotes = {
  getAll: () => apiFetch('/quotes'),
  
  create: (quoteData) => apiFetch('/quotes', {
    method: 'POST',
    body: JSON.stringify(quoteData),
  }),
  
  update: (id, quoteData) => apiFetch(`/quotes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(quoteData),
  }),
  
  delete: (id) => apiFetch(`/quotes/${id}`, { method: 'DELETE' }),
};

// ==================== EXPENSES ====================
export const expenses = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/expenses${query ? `?${query}` : ''}`);
  },
  
  create: (expenseData) => apiFetch('/expenses', {
    method: 'POST',
    body: JSON.stringify(expenseData),
  }),
  
  update: (id, expenseData) => apiFetch(`/expenses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(expenseData),
  }),
  
  delete: (id) => apiFetch(`/expenses/${id}`, { method: 'DELETE' }),
};

// ==================== PURCHASE ORDERS ====================
export const purchaseOrders = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/purchase-orders${query ? `?${query}` : ''}`);
  },
  
  create: (poData) => apiFetch('/purchase-orders', {
    method: 'POST',
    body: JSON.stringify(poData),
  }),
  
  update: (id, poData) => apiFetch(`/purchase-orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(poData),
  }),
  
  delete: (id) => apiFetch(`/purchase-orders/${id}`, { method: 'DELETE' }),
};

// ==================== DELIVERIES ====================
export const deliveries = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/deliveries${query ? `?${query}` : ''}`);
  },
  
  create: (deliveryData) => apiFetch('/deliveries', {
    method: 'POST',
    body: JSON.stringify(deliveryData),
  }),
  
  update: (id, deliveryData) => apiFetch(`/deliveries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(deliveryData),
  }),
  
  delete: (id) => apiFetch(`/deliveries/${id}`, { method: 'DELETE' }),
};

// ==================== SERVICE TICKETS ====================
export const serviceTickets = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/service-tickets${query ? `?${query}` : ''}`);
  },
  
  create: (ticketData) => apiFetch('/service-tickets', {
    method: 'POST',
    body: JSON.stringify(ticketData),
  }),
  
  update: (id, ticketData) => apiFetch(`/service-tickets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(ticketData),
  }),
  
  delete: (id) => apiFetch(`/service-tickets/${id}`, { method: 'DELETE' }),
};

// ==================== SETTINGS ====================
export const settings = {
  getSystem: () => apiFetch('/settings/system'),
  
  updateSystem: (settingsData) => apiFetch('/settings/system', {
    method: 'PUT',
    body: JSON.stringify(settingsData),
  }),
  
  getIntegrations: () => apiFetch('/settings/integrations'),
  
  updateIntegration: (id, integrationData) => apiFetch(`/settings/integrations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(integrationData),
  }),
  
  getNotifications: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/settings/notifications${query ? `?${query}` : ''}`);
  },
  
  markNotificationRead: (id) => apiFetch(`/settings/notifications/${id}`, {
    method: 'PUT',
  }),
  
  getAuditLog: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/settings/audit-log${query ? `?${query}` : ''}`);
  },
  
  getWarehouses: () => apiFetch('/settings/warehouses'),
  
  getAREntries: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/settings/ar-entries${query ? `?${query}` : ''}`);
  },
  
  createAREntry: (arData) => apiFetch('/settings/ar-entries', {
    method: 'POST',
    body: JSON.stringify(arData),
  }),
  
  getAPEntries: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/settings/ap-entries${query ? `?${query}` : ''}`);
  },
};

// ==================== RETURNS ====================
export const returns = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/returns${query ? `?${query}` : ''}`);
  },
  
  getById: (id) => apiFetch(`/returns/${id}`),
  
  create: (returnData) => apiFetch('/returns', {
    method: 'POST',
    body: JSON.stringify(returnData),
  }),
  
  update: (id, returnData) => apiFetch(`/returns/${id}`, {
    method: 'PUT',
    body: JSON.stringify(returnData),
  }),
  
  delete: (id) => apiFetch(`/returns/${id}`, { method: 'DELETE' }),
};

// ==================== SPECIAL ORDERS ====================
export const specialOrders = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/special-orders${query ? `?${query}` : ''}`);
  },
  
  getById: (id) => apiFetch(`/special-orders/${id}`),
  
  create: (orderData) => apiFetch('/special-orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  
  update: (id, orderData) => apiFetch(`/special-orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(orderData),
  }),
  
  delete: (id) => apiFetch(`/special-orders/${id}`, { method: 'DELETE' }),
};

export default {
  auth,
  products,
  customers,
  employees,
  suppliers,
  transactions,
  quotes,
  expenses,
  purchaseOrders,
  deliveries,
  serviceTickets,
  settings,
  returns,
  specialOrders,
};
