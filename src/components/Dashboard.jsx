import { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import {
  calculateTotalExpenses,
  calculateTotalIncome,
  calculateNetBalance,
  getWeeklyExpenses,
  getMonthlyExpenses,
  checkBudgetStatus,
  formatCurrency,
  getRecentTransactions
} from '../utils/calculations';

function Dashboard({ userName, currency, expenses, income, budgetSettings, onNavigate }) {
  const [budgetAlert, setBudgetAlert] = useState(null);

  useEffect(() => {
    // Check budget status
    if (budgetSettings && expenses.length > 0) {
      const status = checkBudgetStatus(budgetSettings, expenses);
      if (status.exceeded) {
        setBudgetAlert(status);
      } else {
        setBudgetAlert(null);
      }
    }
  }, [budgetSettings, expenses]);

  const totalExpenses = calculateTotalExpenses(expenses);
  const totalIncome = calculateTotalIncome(income);
  const netBalance = calculateNetBalance(income, expenses);
  const weeklyExpenses = getWeeklyExpenses(expenses);
  const monthlyExpenses = getMonthlyExpenses(expenses);
  const recentTransactions = getRecentTransactions(expenses, income, 5);

  return (
    <div className="dashboard-container">
      <div className="page-container">
        <div className="nav-bar">
          <h2>Dashboard</h2>
          <div className="nav-buttons">
            <button className="nav-btn" onClick={() => onNavigate('transactions')}>
              Transactions
            </button>
            <button className="nav-btn" onClick={() => onNavigate('analytics')}>
              Analytics
            </button>
            <button className="nav-btn secondary" onClick={() => onNavigate('budgetSettings')}>
              Budget
            </button>
            <button className="nav-btn secondary" onClick={() => onNavigate('categoryManager')}>
              Categories
            </button>
            <button className="nav-btn secondary" onClick={() => onNavigate('export')}>
              Export
            </button>
          </div>
        </div>

        {/* Budget Alert */}
        {budgetAlert && budgetAlert.exceeded && (
          <div className="alert danger">
            <strong>⚠️ Budget Alert!</strong> {budgetAlert.message}
            {budgetAlert.exceededCategories && budgetAlert.exceededCategories.length > 0 && (
              <div className="exceeded-categories">
                {budgetAlert.exceededCategories.map((cat, index) => (
                  <div key={index}>
                    {cat.category}: Exceeded by {formatCurrency(cat.exceeded, currency)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="welcome-message">
          <h1>Welcome back, {userName}! 👋</h1>
          <p>Here's your financial overview</p>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card net-balance">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <h3>Net Balance</h3>
              <p className={netBalance >= 0 ? 'positive' : 'negative'}>
                {formatCurrency(netBalance, currency)}
              </p>
            </div>
          </div>

          <div className="summary-card income-card">
            <div className="card-icon">📈</div>
            <div className="card-content">
              <h3>Total Income</h3>
              <p>{formatCurrency(totalIncome, currency)}</p>
            </div>
          </div>

          <div className="summary-card expense-card">
            <div className="card-icon">📉</div>
            <div className="card-content">
              <h3>Total Expenses</h3>
              <p>{formatCurrency(totalExpenses, currency)}</p>
            </div>
          </div>
        </div>

        {/* Period Summary */}
        <div className="period-summary">
          <div className="period-card">
            <h3>Weekly Expenses</h3>
            <p className="period-amount">{formatCurrency(weeklyExpenses, currency)}</p>
            <span className="period-label">Last 7 days</span>
          </div>

          <div className="period-card">
            <h3>Monthly Expenses</h3>
            <p className="period-amount">{formatCurrency(monthlyExpenses, currency)}</p>
            <span className="period-label">Last 30 days</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button className="action-btn add-expense" onClick={() => onNavigate('addExpense')}>
              <span className="action-icon">➕</span>
              <span>Add Expense</span>
            </button>
            <button className="action-btn add-income" onClick={() => onNavigate('addIncome')}>
              <span className="action-icon">💵</span>
              <span>Add Income</span>
            </button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="recent-transactions">
          <div className="section-header">
            <h3>Recent Transactions</h3>
            <button className="view-all-btn" onClick={() => onNavigate('transactions')}>
              View All →
            </button>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="empty-state">
              <p>No transactions yet. Start by adding an expense or income!</p>
            </div>
          ) : (
            <div className="transaction-list">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-left">
                    <div className={`transaction-icon ${transaction.type}`}>
                      {transaction.type === 'expense' ? '📤' : '📥'}
                    </div>
                    <div className="transaction-info">
                      <h4>{transaction.description || (transaction.type === 'expense' ? transaction.category : 'Income')}</h4>
                      <p className="transaction-date">{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="transaction-right">
                    <p className={`transaction-amount ${transaction.type}`}>
                      {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount, currency)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;