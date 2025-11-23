import '../styles/Welcome.css';

function Welcome({ userName, onContinue }) {
  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <div className="welcome-icon">👋</div>
        <h1 className="welcome-title">Hi, {userName}!</h1>
        <p className="welcome-subtitle">Welcome to your Smart Expense Tracker</p>
        
        <button onClick={onContinue} className="primary-btn welcome-btn">
          Continue
        </button>
      </div>
    </div>
  );
}

export default Welcome;