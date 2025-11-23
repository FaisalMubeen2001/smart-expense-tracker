import { useState } from 'react';
import '../styles/AddExpense.css';

function AddExpense({ categories, currency, onAddExpense, onCancel, onNavigate }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    description: '',
    category: categories[0] || 'Miscellaneous',
    paymentMethod: 'Cash',
    notes: ''
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
    
    onAddExpense(formData);
  };

  return (
    <div className="add-expense-container">
      <div className="page-container">
        <div className="nav-bar">
          <h2>Add Expense</h2>
          <div className="nav-buttons">
            <button className="nav-btn secondary" onClick={onCancel}>
              ← Back to Dashboard
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="expense-form">
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
              placeholder="What did you spend on?"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="link-btn"
                onClick={() => onNavigate('categoryManager')}
              >
                + Add new category
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="paymentMethod">Payment Method *</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                required
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes..."
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="secondary-btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddExpense;