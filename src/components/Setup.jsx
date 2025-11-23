import { useState } from 'react';
import '../styles/Setup.css';

function Setup({ onSetupComplete }) {
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('₹');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (name.trim() === '') {
      alert('Please enter your name');
      return;
    }
    
    onSetupComplete(name.trim(), currency);
  };

  return (
    <div className="setup-container">
      <div className="setup-card">
        <div className="setup-header">
          <h1>Welcome to Smart Expense Tracker</h1>
          <p>Let's set up your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="setup-form">
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="currency">Preferred Currency</label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="$">$ - US Dollar</option>
              <option value="€">€ - Euro</option>
              <option value="£">£ - British Pound</option>
              <option value="¥">¥ - Japanese Yen</option>
              <option value="₹">₹ - Indian Rupee</option>
              <option value="₽">₽ - Russian Ruble</option>
              <option value="R$">R$ - Brazilian Real</option>
              <option value="CA$">CA$ - Canadian Dollar</option>
              <option value="AU$">AU$ - Australian Dollar</option>
              <option value="CHF">CHF - Swiss Franc</option>
            </select>
          </div>
          
          <button type="submit" className="primary-btn setup-btn">
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
}

export default Setup;