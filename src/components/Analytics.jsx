import { useState } from 'react';
import '../styles/Analytics.css';
import {
  calculateTotalExpenses,
  calculateTotalIncome,
  calculateExpensesByCategory,
  calculateExpensesByPaymentMethod,
  getWeeklyExpenses,
  getMonthlyExpenses,
  formatCurrency
} from '../utils/calculations';

function Analytics({ expenses, income, currency, onNavigate }) {
  const [timePeriod, setTimePeriod] = useState('all'); // all, weekly, monthly

  // Filter expenses based on time period
  const getFilteredExpenses = () => {
    if (timePeriod === 'weekly') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return expenses.filter(exp => new Date(exp.date) >= weekAgo);
    } else if (timePeriod === 'monthly') {
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return expenses.filter(exp => new Date(exp.date) >= monthAgo);
    }
    return expenses;
  };

  const filteredExpenses = getFilteredExpenses();
  const totalExpenses = calculateTotalExpenses(filteredExpenses);
  const totalIncome = calculateTotalIncome(income);
  const expensesByCategory = calculateExpensesByCategory(filteredExpenses);
  const expensesByPayment = calculateExpensesByPaymentMethod(filteredExpenses);

  // Calculate percentages for categories
  const categoryPercentages = Object.entries(expensesByCategory).map(([category, amount]) => ({
    category,
    amount,
    percentage: totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) : 0
  })).sort((a, b) => b.amount - a.amount);

  // Calculate percentages for payment methods
  const paymentPercentages = Object.entries(expensesByPayment).map(([method, amount]) => ({
    method,
    amount,
    percentage: totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) : 0
  })).sort((a, b) => b.amount - a.amount);

  // Get spending trend (last 7 days)
  const getSpendingTrend = () => {
    const trend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayExpenses = expenses.filter(exp => exp.date === dateStr);
      const total = calculateTotalExpenses(dayExpenses);
      
      trend.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: total
      });
    }
    return trend;
  };

  const spendingTrend = getSpendingTrend();
  const maxTrendAmount = Math.max(...spendingTrend.map(day => day.amount), 1);

  return (
    <div className="analytics-container">
      <div className="page-container">
        <div className="nav-bar">
          <h2>Analytics & Insights</h2>
          <div className="nav-buttons">
            <button className="nav-btn secondary" onClick={() => onNavigate('dashboard')}>
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Time Period Filter */}
        <div className="period-filter">
          <button
            className={`period-btn ${timePeriod === 'all' ? 'active' : ''}`}
            onClick={() => setTimePeriod('all')}
          >
            All Time
          </button>
          <button
            className={`period-btn ${timePeriod === 'monthly' ? 'active' : ''}`}
            onClick={() => setTimePeriod('monthly')}
          >
            Last 30 Days
          </button>
          <button
            className={`period-btn ${timePeriod === 'weekly' ? 'active' : ''}`}
            onClick={() => setTimePeriod('weekly')}
          >
            Last 7 Days
          </button>
        </div>

        {/* Summary Stats */}
        <div className="analytics-summary">
          <div className="stat-card">
            <h3>Total Expenses</h3>
            <p className="stat-value expense">{formatCurrency(totalExpenses, currency)}</p>
          </div>
          <div className="stat-card">
            <h3>Total Income</h3>
            <p className="stat-value income">{formatCurrency(totalIncome, currency)}</p>
          </div>
          <div className="stat-card">
            <h3>Net Balance</h3>
            <p className={`stat-value ${totalIncome - totalExpenses >= 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(totalIncome - totalExpenses, currency)}
            </p>
          </div>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="empty-state">
            <p>No expense data available for the selected period.</p>
          </div>
        ) : (
          <>
            {/* Spending Trend */}
            <div className="analytics-section">
              <h3>Spending Trend (Last 7 Days)</h3>
              <div className="trend-chart">
                {spendingTrend.map((day, index) => (
                  <div key={index} className="trend-bar-container">
                    <div className="trend-bar-wrapper">
                      <div
                        className="trend-bar"
                        style={{
                          height: `${(day.amount / maxTrendAmount) * 100}%`,
                          minHeight: day.amount > 0 ? '10px' : '0'
                        }}
                      >
                        {day.amount > 0 && (
                          <span className="trend-amount">
                            {currency}{day.amount.toFixed(0)}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="trend-label">{day.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expenses by Category */}
            <div className="analytics-section">
              <h3>Expenses by Category</h3>
              <div className="chart-container">
                {categoryPercentages.map((item, index) => (
                  <div key={index} className="chart-item">
                    <div className="chart-label">
                      <span className="category-name">{item.category}</span>
                      <span className="category-amount">
                        {formatCurrency(item.amount, currency)} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expenses by Payment Method */}
            <div className="analytics-section">
              <h3>Expenses by Payment Method</h3>
              <div className="payment-grid">
                {paymentPercentages.map((item, index) => (
                  <div key={index} className="payment-card">
                    <div className="payment-icon">
                      {item.method === 'Cash' && '💵'}
                      {item.method === 'Card' && '💳'}
                      {item.method === 'UPI' && '📱'}
                    </div>
                    <div className="payment-details">
                      <h4>{item.method}</h4>
                      <p className="payment-amount">{formatCurrency(item.amount, currency)}</p>
                      <p className="payment-percentage">{item.percentage}% of total</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Spending Categories */}
            <div className="analytics-section">
              <h3>Top Spending Categories</h3>
              <div className="top-categories">
                {categoryPercentages.slice(0, 3).map((item, index) => (
                  <div key={index} className="top-category-card">
                    <div className="rank-badge">{index + 1}</div>
                    <div className="top-category-info">
                      <h4>{item.category}</h4>
                      <p className="top-category-amount">
                        {formatCurrency(item.amount, currency)}
                      </p>
                      <div className="top-category-bar">
                        <div
                          className="top-category-fill"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Analytics;