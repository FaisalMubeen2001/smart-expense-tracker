import { useState } from 'react';
import '../styles/AddIncome.css';

function AddIncome({ currency, onAddIncome, onCancel, onNavigate }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (!formData.description.trim()) {
      alert('Please enter a description');
      return;
    }
    
    onAddIncome(formData);
  };

  return (
    <div className="add-income-container">
      <div className="page-container">
        <div className="nav-bar">
          <h2>Add Income</h2>
          <div className="nav-buttons">
            <button className="nav-btn secondary" onClick={onCancel}>
              ← Back to Dashboard
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="income-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount ({currency}) *</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Source of income (e.g., Salary, Freelance, Investment)"
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="secondary-btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              Add Income
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddIncome;