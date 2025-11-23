import { useState } from 'react';
import '../styles/TransactionList.css';
import { formatCurrency, filterByDateRange } from '../utils/calculations';

function TransactionList({ expenses, income, currency, onDelete, onNavigate }) {
  const [filters, setFilters] = useState({
    type: 'all', // all, expense, income
    category: 'all',
    paymentMethod: 'all',
    startDate: '',
    endDate: '',
    searchTerm: ''
  });

  // Combine expenses and income
  const allTransactions = [...expenses, ...income];

  // Get unique categories from expenses
  const categories = [...new Set(expenses.map(exp => exp.category))];

  // Apply filters
  const filteredTransactions = allTransactions.filter(transaction => {
    // Type filter
    if (filters.type !== 'all' && transaction.type !== filters.type) {
      return false;
    }

    // Category filter (only for expenses)
    if (filters.category !== 'all' && transaction.category !== filters.category) {
      return false;
    }

    // Payment method filter (only for expenses)
    if (filters.paymentMethod !== 'all' && transaction.paymentMethod !== filters.paymentMethod) {
      return false;
    }

    // Search term filter
    if (filters.searchTerm && !transaction.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Apply date range filter
  const dateFilteredTransactions = filterByDateRange(
    filteredTransactions,
    filters.startDate,
    filters.endDate
  );

  // Sort by date (newest first)
  const sortedTransactions = [...dateFilteredTransactions].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDelete = (id, type) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      onDelete(id, type);
    }
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      category: 'all',
      paymentMethod: 'all',
      startDate: '',
      endDate: '',
      searchTerm: ''
    });
  };

  return (
    <div className="transaction-list-container">
      <div className="page-container">
        <div className="nav-bar">
          <h2>All Transactions</h2>
          <div className="nav-buttons">
            <button className="nav-btn secondary" onClick={() => onNavigate('dashboard')}>
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <h3>Filter Transactions</h3>
          
          <div className="filters-grid">
            <div className="form-group">
              <label htmlFor="searchTerm">Search</label>
              <input
                type="text"
                id="searchTerm"
                name="searchTerm"
                value={filters.searchTerm}
                onChange={handleFilterChange}
                placeholder="Search by description..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">Type</label>
              <select
                id="type"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="all">All</option>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                disabled={filters.type === 'income'}
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="paymentMethod">Payment Method</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={filters.paymentMethod}
                onChange={handleFilterChange}
                disabled={filters.type === 'income'}
              >
                <option value="all">All Methods</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>

        {/* Transaction Count */}
        <div className="transaction-count">
          Showing {sortedTransactions.length} transaction(s)
        </div>

        {/* Transactions List */}
        {sortedTransactions.length === 0 ? (
          <div className="empty-state">
            <p>No transactions found matching your filters.</p>
          </div>
        ) : (
          <div className="transactions-grid">
            {sortedTransactions.map((transaction) => (
              <div key={transaction.id} className={`transaction-card ${transaction.type}`}>
                <div className="transaction-header">
                  <div className="transaction-type-badge">
                    {transaction.type === 'expense' ? '📤 Expense' : '📥 Income'}
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(transaction.id, transaction.type)}
                    title="Delete transaction"
                  >
                    🗑️
                  </button>
                </div>

                <div className="transaction-details">
                  <div className="detail-row">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Amount:</span>
                    <span className={`detail-value amount ${transaction.type}`}>
                      {transaction.type === 'expense' ? '-' : '+'}
                      {formatCurrency(transaction.amount, currency)}
                    </span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Description:</span>
                    <span className="detail-value">{transaction.description}</span>
                  </div>

                  {transaction.type === 'expense' && (
                    <>
                      <div className="detail-row">
                        <span className="detail-label">Category:</span>
                        <span className="detail-value category-badge">
                          {transaction.category}
                        </span>
                      </div>

                      <div className="detail-row">
                        <span className="detail-label">Payment:</span>
                        <span className="detail-value payment-badge">
                          {transaction.paymentMethod}
                        </span>
                      </div>

                      {transaction.notes && (
                        <div className="detail-row notes-row">
                          <span className="detail-label">Notes:</span>
                          <span className="detail-value notes">{transaction.notes}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionList;