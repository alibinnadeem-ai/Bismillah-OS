# 📝 TODO: Complete Frontend Refactoring

This document tracks the remaining work to fully integrate the frontend with the NeonDB backend.

## ✅ Completed
- [x] Backend infrastructure created
- [x] 20 database tables with schema
- [x] Seed data with initial products, employees, suppliers, customers
- [x] Express.js server with JWT authentication
- [x] All REST API routes implemented
- [x] Frontend API service layer created
- [x] Vite proxy configured
- [x] Environment variables setup
- [x] Migration scripts created
- [x] Documentation (SETUP_GUIDE.md, QUICK_START.md)

## 🔄 In Progress
- [ ] Refactor App.jsx to use API calls

## ⏳ Remaining Work

### 1. Update App.jsx Authentication (Priority: HIGH)
**File**: `src/App.jsx`
**Lines**: ~267-277

Replace the hardcoded login check with API call:

```javascript
// BEFORE (Hardcoded)
if (loginEmail === 'admin@bismillah.pk' && loginPassword === 'admin123') {
  setIsAuthenticated(true);
  logAudit('Login', 'User logged in successfully');
}

// AFTER (API-based)
import { auth } from './services/api';

const handleLogin = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    const data = await auth.login(loginEmail, loginPassword);
    setIsAuthenticated(true);
    setCurrentUser(data.user);
    logAudit('Login', 'User logged in successfully');
  } catch (error) {
    setLoginError(error.message);
  } finally {
    setIsLoading(false);
  }
};
```

### 2. Replace usePersistedState with API Calls (Priority: HIGH)
**File**: `src/App.jsx`

For each data entity, replace localStorage persistence with API fetching:

#### Products
```javascript
// BEFORE
const [products, setProducts] = usePersistedState('products', initialProducts);

// AFTER
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const data = await api.products.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (isAuthenticated) {
    fetchProducts();
  }
}, [isAuthenticated]);
```

#### Similar pattern for:
- [x] Customers
- [x] Employees  
- [x] Suppliers
- [x] Transactions
- [x] Quotes
- [x] Expenses
- [x] Purchase Orders
- [x] Deliveries
- [x] Service Tickets
- [x] AR/AP Entries
- [x] Warehouses
- [x] Notifications
- [x] System Settings
- [x] Integrations

### 3. Update CRUD Operations (Priority: HIGH)
Replace all setState calls with API calls:

#### Example: Add Product
```javascript
// BEFORE
const handleAddProduct = () => {
  const product = { id: products.length + 1, ...newProduct };
  setProducts([...products, product]);
  logAudit('Inventory', `Added new product: ${product.brand}`);
};

// AFTER
const handleAddProduct = async () => {
  try {
    const product = await api.products.create(newProduct);
    setProducts([...products, product]);
    setShowAddProductModal(false);
    logAudit('Inventory', `Added new product: ${product.brand}`);
  } catch (error) {
    alert(`Failed to add product: ${error.message}`);
  }
};
```

### 4. Update POS Checkout (Priority: CRITICAL)
**File**: `src/App.jsx`
**Lines**: ~1019-1057

The POS checkout needs to:
1. Call `api.transactions.create()`
2. Update product quantities via API
3. Update customer balance if credit
4. Handle optimistic UI updates

```javascript
const processSale = async () => {
  try {
    const transactionData = {
      customerId: currentCustomer?.id || null,
      customerName: currentCustomer?.name || 'Walk-in',
      items: cart,
      subtotal,
      gst: gstAmount,
      discount: posDiscount,
      finalTotal,
      paymentMethod,
      deliveryDate,
      type: paymentMethod === 'deposit' ? 'layaway' : 'sale',
      deposit: paymentMethod === 'deposit' ? paymentAmount : null,
      balance: paymentMethod === 'deposit' ? finalTotal - paymentAmount : null
    };

    const transaction = await api.transactions.create(transactionData);
    
    // Update local state
    setTransactions([transaction, ...transactions]);
    
    // Refresh products to get updated quantities
    const updatedProducts = await api.products.getAll();
    setProducts(updatedProducts);
    
    // Clear cart
    setCart([]);
    setPosDiscount(0);
    
    // Auto-print if enabled
    if (systemSettings.autoPrint) {
      printInvoice(transaction);
    }
    
    alert(`Sale completed! Invoice #${transaction.invoice_number}`);
  } catch (error) {
    alert(`Checkout failed: ${error.message}`);
  }
};
```

### 5. Add Loading States (Priority: MEDIUM)
Add loading indicators for better UX:

```javascript
const [loading, setLoading] = useState(false);

// In components
{loading ? (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
) : (
  // Actual content
)}
```

### 6. Add Error Handling (Priority: MEDIUM)
Create error boundary and toast notifications:

```javascript
const [error, setError] = useState(null);

// Show errors to user
{error && (
  <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
    {error}
  </div>
)}
```

### 7. Implement Optimistic Updates (Priority: LOW)
For better UX, update UI immediately then sync with server:

```javascript
const handleUpdateProduct = async (id, updates) => {
  // Optimistic update
  setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
  
  try {
    const updated = await api.products.update(id, updates);
    // Confirm with server response
    setProducts(products.map(p => p.id === id ? updated : p));
  } catch (error) {
    // Rollback on error
    alert('Update failed: ' + error.message);
    // Refresh from server
    const fresh = await api.products.getAll();
    setProducts(fresh);
  }
};
```

### 8. Remove usePersistedState Hook (Priority: LOW)
Once all data is from API, remove the custom hook:
- Delete or comment out `usePersistedState` function
- Replace all instances with regular `useState`

### 9. Update Audit Logging (Priority: MEDIUM)
Audit logs should be created on server, but can also update local state:

```javascript
const logAudit = async (action, details, change = '') => {
  // Server already logs this in API endpoints
  // Just fetch latest logs for display
  try {
    const logs = await api.settings.getAuditLog();
    setAuditLog(logs);
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
  }
};
```

### 10. Test All Features (Priority: CRITICAL)
Test each page thoroughly:
- [ ] Dashboard - Analytics display correctly
- [ ] POS - Checkout process works
- [ ] Customers - CRUD operations
- [ ] Products - Inventory management
- [ ] Employees - HR management
- [ ] Suppliers - Supplier management
- [ ] Transactions - Sales history
- [ ] Quotes - Quote management
- [ ] Expenses - Expense tracking
- [ ] Purchase Orders - PO workflow
- [ ] Deliveries - Logistics
- [ ] Service - Ticket management
- [ ] Settings - Configuration updates
- [ ] Reports - PDF generation

## 🎯 Recommended Refactoring Order

1. **Authentication** (1 hour)
   - Update login/logout
   - Add token management
   - Handle 401 responses

2. **Data Fetching** (2-3 hours)
   - Replace all usePersistedState with API calls
   - Add loading states
   - Add error handling

3. **CRUD Operations** (3-4 hours)
   - Update all create/update/delete functions
   - Add optimistic updates
   - Handle API errors gracefully

4. **POS Critical Path** (2 hours)
   - Refactor checkout process
   - Test with real transactions
   - Verify stock updates

5. **Polish & Testing** (2-3 hours)
   - Add loading spinners
   - Improve error messages
   - Test all workflows
   - Fix edge cases

**Total Estimated Time**: 10-13 hours

## 🚨 Breaking Changes to Watch For

1. **ID Generation**: Server auto-generates IDs, don't send them in POST requests
2. **Date Formats**: Server uses ISO timestamps, frontend may need formatting
3. **JSONB Fields**: `items`, `targets`, `variants`, `config` are stored as JSONB
4. **Snake Case**: Database uses snake_case, may need transformation
5. **Pagination**: Large datasets may need pagination (not yet implemented)

## 📞 Quick Wins

Start with these for immediate progress:
1. ✅ Update login (30 min)
2. ✅ Fetch products on mount (30 min)
3. ✅ Update add product (30 min)
4. ✅ Test POS with 1 item (1 hour)

## 🎉 When Complete

After all refactoring:
1. Remove all `usePersistedState` references
2. Clear localStorage: `localStorage.clear()`
3. Test fresh user experience
4. Deploy to production
5. Monitor error logs

---

**Status**: Backend ✅ Ready | Frontend ⏳ In Progress
**Next Step**: Update authentication in App.jsx
