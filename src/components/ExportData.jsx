import '../styles/ExportData.css';

function ExportData({ expenses, income, currency, onNavigate }) {
  const exportToCSV = () => {
    if (expenses.length === 0 && income.length === 0) {
      alert('No data to export. Add some transactions first!');
      return;
    }

    // Prepare CSV content
    let csvContent = 'Type,Date,Amount,Description,Category,Payment Method,Notes\n';

    // Add expenses
    expenses.forEach(expense => {
      const row = [
        'Expense',
        expense.date,
        expense.amount,
        `"${expense.description.replace(/"/g, '""')}"`, // Escape quotes in description
        expense.category,
        expense.paymentMethod,
        expense.notes ? `"${expense.notes.replace(/"/g, '""')}"` : ''
      ].join(',');
      csvContent += row + '\n';
    });

    // Add income
    income.forEach(inc => {
      const row = [
        'Income',
        inc.date,
        inc.amount,
        `"${inc.description.replace(/"/g, '""')}"`,
        '',
        '',
        ''
      ].join(',');
      csvContent += row + '\n';
    });

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `expense-tracker-data-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const totalIncome = income.reduce((sum, inc) => sum + parseFloat(inc.amount), 0);
  const totalTransactions = expenses.length + income.length;

  return (
    <div className="export-data-container">
      <div className="page-container">
        <div className="nav-bar">
          <h2>Export Data</h2>
          <div className="nav-buttons">
            <button className="nav-btn secondary" onClick={() => onNavigate('dashboard')}>
              ← Back to Dashboard
            </button>
          </div>
        </div>

        <div className="export-content">
          <div className="export-header">
            <div className="export-icon">📊</div>
            <h3>Export Your Financial Data</h3>
            <p>Download all your transactions as a CSV file for backup or analysis</p>
          </div>

          {/* Data Summary */}
          <div className="data-summary">
            <h4>Data Summary</h4>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Total Transactions:</span>
                <span className="summary-value">{totalTransactions}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Total Expenses:</span>
                <span className="summary-value expense">{expenses.length}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Total Income:</span>
                <span className="summary-value income">{income.length}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Expense Amount:</span>
                <span className="summary-value expense">{currency} {totalExpenses.toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Income Amount:</span>
                <span className="summary-value income">{currency} {totalIncome.toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Net Balance:</span>
                <span className={`summary-value ${totalIncome - totalExpenses >= 0 ? 'positive' : 'negative'}`}>
                  {currency} {(totalIncome - totalExpenses).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Export Format Info */}
          <div className="export-info">
            <h4>Export Format</h4>
            <p>The CSV file will contain the following columns:</p>
            <ul className="format-list">
              <li><strong>Type:</strong> Expense or Income</li>
              <li><strong>Date:</strong> Transaction date</li>
              <li><strong>Amount:</strong> Transaction amount</li>
              <li><strong>Description:</strong> Transaction description</li>
              <li><strong>Category:</strong> Expense category (if applicable)</li>
              <li><strong>Payment Method:</strong> Cash, Card, or UPI (for expenses)</li>
              <li><strong>Notes:</strong> Additional notes (if any)</li>
            </ul>
          </div>

          {/* Export Button */}
          <div className="export-action">
            <button 
              className="export-btn primary-btn" 
              onClick={exportToCSV}
              disabled={totalTransactions === 0}
            >
              <span className="export-btn-icon">⬇️</span>
              Export to CSV
            </button>
            {totalTransactions === 0 && (
              <p className="no-data-message">No transactions available to export</p>
            )}
          </div>

          {/* Info Box */}
          <div className="info-box">
            <div className="info-icon">💡</div>
            <div className="info-content">
              <strong>Tip:</strong> You can open the CSV file in Excel, Google Sheets, or any spreadsheet application for further analysis and reporting.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExportData;