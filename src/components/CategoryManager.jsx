import { useState } from 'react';
import '../styles/CategoryManager.css';

function CategoryManager({ categories, onAddCategory, onDeleteCategory, onNavigate }) {
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');

  const defaultCategories = ['Food', 'Transportation', 'Entertainment', 'Groceries', 'Miscellaneous'];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedCategory = newCategory.trim();

    if (!trimmedCategory) {
      setError('Please enter a category name');
      return;
    }

    if (categories.includes(trimmedCategory)) {
      setError('This category already exists');
      return;
    }

    if (trimmedCategory.length > 30) {
      setError('Category name must be 30 characters or less');
      return;
    }

    onAddCategory(trimmedCategory);
    setNewCategory('');
    setError('');
  };

  const handleDelete = (category) => {
    if (defaultCategories.includes(category)) {
      alert('Cannot delete default categories');
      return;
    }

    if (window.confirm(`Are you sure you want to delete the category "${category}"?`)) {
      onDeleteCategory(category);
    }
  };

  return (
    <div className="category-manager-container">
      <div className="page-container">
        <div className="nav-bar">
          <h2>Manage Categories</h2>
          <div className="nav-buttons">
            <button className="nav-btn secondary" onClick={() => onNavigate('dashboard')}>
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Add New Category */}
        <div className="add-category-section">
          <h3>Add New Category</h3>
          <form onSubmit={handleSubmit} className="add-category-form">
            <div className="form-row">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
                className="category-input"
                maxLength="30"
              />
              <button type="submit" className="primary-btn add-btn">
                Add Category
              </button>
            </div>
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>

        {/* Categories List */}
        <div className="categories-list-section">
          <h3>Your Categories</h3>
          <p className="section-description">
            Default categories cannot be deleted. Custom categories can be removed.
          </p>

          <div className="categories-grid">
            {categories.map((category) => {
              const isDefault = defaultCategories.includes(category);
              return (
                <div key={category} className={`category-item ${isDefault ? 'default' : 'custom'}`}>
                  <div className="category-info">
                    <span className="category-icon">
                      {category === 'Food' && '🍔'}
                      {category === 'Transportation' && '🚗'}
                      {category === 'Entertainment' && '🎬'}
                      {category === 'Groceries' && '🛒'}
                      {category === 'Miscellaneous' && '📦'}
                      {!defaultCategories.includes(category) && '📁'}
                    </span>
                    <span className="category-name">{category}</span>
                  </div>
                  <div className="category-actions">
                    {isDefault ? (
                      <span className="default-badge">Default</span>
                    ) : (
                      <button
                        className="delete-category-btn"
                        onClick={() => handleDelete(category)}
                        title="Delete category"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {categories.length === 0 && (
            <div className="empty-state">
              <p>No categories available. Add your first category above!</p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="info-box">
          <div className="info-icon">💡</div>
          <div className="info-content">
            <strong>Tip:</strong> Organize your expenses better by creating custom categories that match your spending habits. You can always add more categories later!
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryManager;