// Migration Script: LocalStorage to NeonDB
// Run this in browser console to export localStorage data and send to API

export const migrateLocalStorageToDatabase = async () => {
  const API_URL = 'http://localhost:5000/api';
  const token = localStorage.getItem('authToken');

  if (!token) {
    console.error('❌ Please login first to get authentication token');
    return;
  }

  console.log('🔄 Starting migration from localStorage to NeonDB...\n');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  try {
    // Migrate Products
    const productsData = localStorage.getItem('products');
    if (productsData) {
      const products = JSON.parse(productsData);
      console.log(`📦 Migrating ${products.length} products...`);
      
      for (const product of products) {
        try {
          await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers,
            body: JSON.stringify(product)
          });
        } catch (err) {
          console.warn(`Warning: Product ${product.sku} might already exist`);
        }
      }
      console.log('✅ Products migrated\n');
    }

    // Migrate Customers
    const customersData = localStorage.getItem('customers');
    if (customersData) {
      const customers = JSON.parse(customersData);
      console.log(`👥 Migrating ${customers.length} customers...`);
      
      for (const customer of customers) {
        try {
          await fetch(`${API_URL}/customers`, {
            method: 'POST',
            headers,
            body: JSON.stringify(customer)
          });
        } catch (err) {
          console.warn(`Warning: Customer ${customer.id} might already exist`);
        }
      }
      console.log('✅ Customers migrated\n');
    }

    // Migrate Employees
    const employeesData = localStorage.getItem('employees');
    if (employeesData) {
      const employees = JSON.parse(employeesData);
      console.log(`👔 Migrating ${employees.length} employees...`);
      
      for (const employee of employees) {
        try {
          await fetch(`${API_URL}/employees`, {
            method: 'POST',
            headers,
            body: JSON.stringify(employee)
          });
        } catch (err) {
          console.warn(`Warning: Employee ${employee.id} might already exist`);
        }
      }
      console.log('✅ Employees migrated\n');
    }

    // Migrate Suppliers
    const suppliersData = localStorage.getItem('suppliers');
    if (suppliersData) {
      const suppliers = JSON.parse(suppliersData);
      console.log(`🏢 Migrating ${suppliers.length} suppliers...`);
      
      for (const supplier of suppliers) {
        try {
          await fetch(`${API_URL}/suppliers`, {
            method: 'POST',
            headers,
            body: JSON.stringify(supplier)
          });
        } catch (err) {
          console.warn(`Warning: Supplier ${supplier.id} might already exist`);
        }
      }
      console.log('✅ Suppliers migrated\n');
    }

    // Migrate Transactions
    const transactionsData = localStorage.getItem('transactions');
    if (transactionsData) {
      const transactions = JSON.parse(transactionsData);
      console.log(`💰 Migrating ${transactions.length} transactions...`);
      
      for (const transaction of transactions) {
        try {
          await fetch(`${API_URL}/transactions`, {
            method: 'POST',
            headers,
            body: JSON.stringify(transaction)
          });
        } catch (err) {
          console.warn(`Warning: Transaction ${transaction.invoiceNumber} might already exist`);
        }
      }
      console.log('✅ Transactions migrated\n');
    }

    // Migrate Quotes
    const quotesData = localStorage.getItem('quotes');
    if (quotesData) {
      const quotes = JSON.parse(quotesData);
      console.log(`📋 Migrating ${quotes.length} quotes...`);
      
      for (const quote of quotes) {
        try {
          await fetch(`${API_URL}/quotes`, {
            method: 'POST',
            headers,
            body: JSON.stringify(quote)
          });
        } catch (err) {
          console.warn(`Warning: Quote ${quote.id} might already exist`);
        }
      }
      console.log('✅ Quotes migrated\n');
    }

    // Migrate Expenses
    const expensesData = localStorage.getItem('expenses');
    if (expensesData) {
      const expenses = JSON.parse(expensesData);
      console.log(`💸 Migrating ${expenses.length} expenses...`);
      
      for (const expense of expenses) {
        try {
          await fetch(`${API_URL}/expenses`, {
            method: 'POST',
            headers,
            body: JSON.stringify(expense)
          });
        } catch (err) {
          console.warn(`Warning: Expense ${expense.id} might already exist`);
        }
      }
      console.log('✅ Expenses migrated\n');
    }

    console.log('🎉 Migration completed successfully!');
    console.log('\n⚠️  IMPORTANT: After verifying data in database, you can clear localStorage:');
    console.log('   localStorage.clear()');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
};

// Auto-run if in browser
if (typeof window !== 'undefined') {
  window.migrateLocalStorageToDatabase = migrateLocalStorageToDatabase;
  console.log('Migration function loaded. Run: migrateLocalStorageToDatabase()');
}
