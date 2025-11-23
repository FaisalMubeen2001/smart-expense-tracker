// Key for storing user data in localStorage
const USER_DATA_KEY = 'smartExpenseTrackerData';

/**
 * Get user data from localStorage
 * @returns {Object|null} User data object or null if not found
 */
export const getUserData = () => {
  try {
    const data = localStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

/**
 * Save user data to localStorage
 * @param {Object} userData - User data object to save
 * @returns {boolean} True if successful, false otherwise
 */
export const saveUserData = (userData) => {
  try {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

/**
 * Clear all user data from localStorage
 * @returns {boolean} True if successful, false otherwise
 */
export const clearUserData = () => {
  try {
    localStorage.removeItem(USER_DATA_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Check if user has completed setup
 * @returns {boolean} True if setup is complete, false otherwise
 */
export const isSetupComplete = () => {
  const userData = getUserData();
  return userData && userData.isSetupComplete === true;
};