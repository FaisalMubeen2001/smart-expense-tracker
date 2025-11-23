import { useState, useEffect } from 'react';
import '../styles/BudgetSettings.css';

function BudgetSettings({ currentSettings, categories, currency, onSave, onCancel }) {
  const [budgetType, setBudgetType] = useState('overall'); // overall or category
  const [period, setPeriod] = useState('monthly'); // weekly or monthly
  const [overallAmount, setOverallAmount] = useState('');
  const [categoryBudgets, setCategoryBudgets] = useState({});

  useEffect(() => {
    // Load current settings if they exist
    if (currentSettings) {
      setBudgetType(currentSettings.type || 'overall');
      setPeriod(currentSettings.period || 'monthly');
      
      if (currentSettings.type === 'overall') {
        setOverallAmount(currentSettings.amount || '');
      } else if (currentSettings.type === 'category') {
        setCategoryBudgets(currentSettings.categoryBudgets || {});
      }
    }
  }, [currentSettings]);

  const handleCategoryBudgetChange = (category, value) => {
    setCategoryBudgets(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (budgetType === 'overall') {
      if (!overallAmount || parseFloat(overallAmount) <= 0) {
        alert('Please enter a valid budget amount');
        return;
      }

      onSave({
        type: 'overall',
        period,
        amount: parseFloat(overallAmount)
      });
    } else {
      // Check if at least one category budget is set
      const hasValidBudget = Object.values(categoryBudgets).some(
        amount => amount && parseFloat(amount) > 0
      );

      if (!hasValidBudget) {
        alert('Please set at least one category budget');
        return;
      }

      // Convert string values to numbers and filter out empty/zero values
      const validCategoryBudgets = {};
      Object.entries(categoryBudgets).forEach(([category, amount]) => {
        if (amount && parseFloat(amount) > 0) {
          validCategoryBudgets[category] = parseFloat(amount);
        }
      });

      onSave({
        type: 'category',
        period,
        categoryBudgets: validCategoryBudgets
      });
    }
  };

  return (
    <div className="budget-settings-container">
      <div className="page-container">
        <div className="nav-bar">
          <h2>Budget Settings</h2>
          <div className="nav-buttons">
            <button className="nav-btn secondary" onClick={onCancel}>
              ← Cancel
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="budget-form">
          {/* Budget Type Selection */}
          <div className="form-section">
            <h3>Budget Type</h3>
            <div className="budget-type-options">
              <label className={`budget-type-card ${budgetType === 'overall' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="budgetType"
                  value="overall"
                  checked={budgetType === 'overall'}
                  onChange={(e) => setBudgetType(e.target.value)}
                />
                <div className="budget-type-content">
                  <div className="budget-type-icon">💰</div>
                  <h4>Overall Budget</h4>
                  <p>Set one budget for all expenses</p>
                </div>
              </label>

              <label className={`budget-type-card ${budgetType === 'category' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="budgetType"
                  value="category"
                  checked={budgetType === 'category'}
                  onChange={(e) => setBudgetType(e.target.value)}
                />
                <div className="budget-type-content">
                  <div className="budget-type-icon">📊</div>
                  <h4>Category Budgets</h4>
                  <p>Set separate budgets for each category</p>
                </div>
              </label>
            </div>
          </div>

          {/* Period Selection */}
          <div className="form-section">
            <h3>Budget Period</h3>
            <div className="period-options">
              <label className={`period-card ${period === 'weekly' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="period"
                  value="weekly"
                  checked={period === 'weekly'}
                  onChange={(e) => setPeriod(e.target.value)}
                />
                <div className="period-content">
                  <span className="period-icon">📅</span>
                  <span>Weekly</span>
                </div>
              </label>

              <label className={`period-card ${period === 'monthly' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="period"
                  value="monthly"
                  checked={period === 'monthly'}
                  onChange={(e) => setPeriod(e.target.value)}
                />
                <div className="period-content">
                  <span className="period-icon">📆</span>
                  <span>Monthly</span>
                </div>
              </label>
            </div>
          </div>

          {/* Budget Amount Input */}
          {budgetType === 'overall' ? (
            <div className="form-section">
              <h3>Budget Amount</h3>
              <div className="form-group">
                <label htmlFor="overallAmount">
                  Set your {period} budget limit ({currency})
                </label>
                <input
                  type="number"
                  id="overallAmount"
                  value={overallAmount}
                  onChange={(e) => setOverallAmount(e.target.value)}
                  placeholder="Enter amount"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          ) : (
            <div className="form-section">
              <h3>Category Budgets</h3>
              <p className="section-description">
                Set {period} budget limits for each category. Leave blank to skip a category.
              </p>
              <div className="category-budgets-grid">
                {categories.map((category) => (
                  <div key={category} className="category-budget-item">
                    <label htmlFor={`budget-${category}`}>
                      {category}
                    </label>
                    <div className="input-with-currency">
                      <span className="currency-symbol">{currency}</span>
                      <input
                        type="number"
                        id={`budget-${category}`}
                        value={categoryBudgets[category] || ''}
                        onChange={(e) => handleCategoryBudgetChange(category, e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="info-box">
            <div className="info-icon">ℹ️</div>
            <div className="info-content">
              <strong>Budget Alert:</strong> You will receive a visual alert on your dashboard when you exceed your budget limit.
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" className="secondary-btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              Save Budget Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BudgetSettings;