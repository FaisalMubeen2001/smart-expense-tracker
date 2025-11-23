/**
 * Calculate total expenses
 * @param {Array} expenses - Array of expense objects
 * @returns {number} Total expenses
 */
export const calculateTotalExpenses = (expenses) => {
  return expenses.reduce((total, expense) => total + parseFloat(expense.amount || 0), 0);
};

/**
 * Calculate total income
 * @param {Array} income - Array of income objects
 * @returns {number} Total income
 */
export const calculateTotalIncome = (income) => {
  return income.reduce((total, inc) => total + parseFloat(inc.amount || 0), 0);
};

/**
 * Calculate net balance (Income - Expenses)
 * @param {Array} income - Array of income objects
 * @param {Array} expenses - Array of expense objects
 * @returns {number} Net balance
 */
export const calculateNetBalance = (income, expenses) => {
  const totalIncome = calculateTotalIncome(income);
  const totalExpenses = calculateTotalExpenses(expenses);
  return totalIncome - totalExpenses;
};

/**
 * Calculate expenses by category
 * @param {Array} expenses - Array of expense objects
 * @returns {Object} Object with category names as keys and total amounts as values
 */
export const calculateExpensesByCategory = (expenses) => {
  const categoryTotals = {};
  
  expenses.forEach(expense => {
    const category = expense.category || 'Uncategorized';
    if (categoryTotals[category]) {
      categoryTotals[category] += parseFloat(expense.amount || 0);
    } else {
      categoryTotals[category] = parseFloat(expense.amount || 0);
    }
  });
  
  return categoryTotals;
};

/**
 * Calculate expenses by payment method
 * @param {Array} expenses - Array of expense objects
 * @returns {Object} Object with payment methods as keys and total amounts as values
 */
export const calculateExpensesByPaymentMethod = (expenses) => {
  const paymentTotals = {};
  
  expenses.forEach(expense => {
    const method = expense.paymentMethod || 'Unknown';
    if (paymentTotals[method]) {
      paymentTotals[method] += parseFloat(expense.amount || 0);
    } else {
      paymentTotals[method] = parseFloat(expense.amount || 0);
    }
  });
  
  return paymentTotals;
};

/**
 * Filter transactions by date range
 * @param {Array} transactions - Array of transaction objects
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Array} Filtered transactions
 */
export const filterByDateRange = (transactions, startDate, endDate) => {
  if (!startDate && !endDate) return transactions;
  
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const start = startDate ? new Date(startDate) : new Date('1900-01-01');
    const end = endDate ? new Date(endDate) : new Date('2100-12-31');
    
    return transactionDate >= start && transactionDate <= end;
  });
};

/**
 * Get weekly expenses (last 7 days)
 * @param {Array} expenses - Array of expense objects
 * @returns {number} Total weekly expenses
 */
export const getWeeklyExpenses = (expenses) => {
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const weeklyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= weekAgo && expenseDate <= today;
  });
  
  return calculateTotalExpenses(weeklyExpenses);
};

/**
 * Get monthly expenses (last 30 days)
 * @param {Array} expenses - Array of expense objects
 * @returns {number} Total monthly expenses
 */
export const getMonthlyExpenses = (expenses) => {
  const today = new Date();
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= monthAgo && expenseDate <= today;
  });
  
  return calculateTotalExpenses(monthlyExpenses);
};

/**
 * Check if budget is exceeded
 * @param {Object} budgetSettings - Budget settings object
 * @param {Array} expenses - Array of expense objects
 * @returns {Object} Object with exceeded status and remaining budget
 */
export const checkBudgetStatus = (budgetSettings, expenses) => {
  if (!budgetSettings) {
    return { exceeded: false, remaining: 0, message: 'No budget set' };
  }
  
  const { type, period, amount, categoryBudgets } = budgetSettings;
  
  if (type === 'overall') {
    let totalExpenses;
    
    if (period === 'weekly') {
      totalExpenses = getWeeklyExpenses(expenses);
    } else {
      totalExpenses = getMonthlyExpenses(expenses);
    }
    
    const remaining = amount - totalExpenses;
    const exceeded = remaining < 0;
    
    return {
      exceeded,
      remaining: Math.abs(remaining),
      message: exceeded 
        ? `Budget exceeded by ${Math.abs(remaining).toFixed(2)}!` 
        : `${remaining.toFixed(2)} remaining in your ${period} budget`
    };
  } else if (type === 'category' && categoryBudgets) {
    // Check each category budget
    const categoryExpenses = calculateExpensesByCategory(
      period === 'weekly' 
        ? expenses.filter(exp => {
            const expDate = new Date(exp.date);
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return expDate >= weekAgo;
          })
        : expenses.filter(exp => {
            const expDate = new Date(exp.date);
            const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            return expDate >= monthAgo;
          })
    );
    
    const exceededCategories = [];
    
    Object.keys(categoryBudgets).forEach(category => {
      const budgetAmount = categoryBudgets[category];
      const spent = categoryExpenses[category] || 0;
      
      if (spent > budgetAmount) {
        exceededCategories.push({
          category,
          exceeded: spent - budgetAmount,
          spent,
          budget: budgetAmount
        });
      }
    });
    
    return {
      exceeded: exceededCategories.length > 0,
      exceededCategories,
      message: exceededCategories.length > 0
        ? `Budget exceeded in ${exceededCategories.length} category(ies)!`
        : 'All category budgets are within limits'
    };
  }
  
  return { exceeded: false, remaining: 0, message: 'Invalid budget settings' };
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency symbol
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency) => {
  return `${currency} ${parseFloat(amount).toFixed(2)}`;
};

/**
 * Get recent transactions (last N transactions)
 * @param {Array} expenses - Array of expense objects
 * @param {Array} income - Array of income objects
 * @param {number} count - Number of recent transactions to get
 * @returns {Array} Recent transactions sorted by date
 */
export const getRecentTransactions = (expenses, income, count = 5) => {
  const allTransactions = [...expenses, ...income];
  
  // Sort by date (newest first)
  allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return allTransactions.slice(0, count);
};