import { useState, useEffect } from 'react'
import './App.css'
import Setup from './components/Setup'
import Welcome from './components/Welcome'
import Dashboard from './components/Dashboard'
import AddExpense from './components/AddExpense'
import AddIncome from './components/AddIncome'
import TransactionList from './components/TransactionList'
import Analytics from './components/Analytics'
import BudgetSettings from './components/BudgetSettings'
import CategoryManager from './components/CategoryManager'
import ExportData from './components/ExportData'
import { getUserData, saveUserData } from './utils/localStorage'

function App() {
  const [currentPage, setCurrentPage] = useState('setup')
  const [userData, setUserData] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [income, setIncome] = useState([])
  const [categories, setCategories] = useState([])
  const [budgetSettings, setBudgetSettings] = useState(null)

  useEffect(() => {
    // Load user data from localStorage on app mount
    const storedUserData = getUserData()
    
    if (storedUserData && storedUserData.isSetupComplete) {
      setUserData(storedUserData)
      setExpenses(storedUserData.expenses || [])
      setIncome(storedUserData.income || [])
      setCategories(storedUserData.categories || getDefaultCategories())
      setBudgetSettings(storedUserData.budgetSettings || null)
      setCurrentPage('welcome')
    } else {
      setCurrentPage('setup')
    }
  }, [])

  const getDefaultCategories = () => {
    return ['Food', 'Transportation', 'Entertainment', 'Groceries', 'Miscellaneous']
  }

  const handleSetupComplete = (name, currency) => {
    const newUserData = {
      name,
      currency,
      isSetupComplete: true,
      expenses: [],
      income: [],
      categories: getDefaultCategories(),
      budgetSettings: null
    }
    
    setUserData(newUserData)
    setCategories(getDefaultCategories())
    saveUserData(newUserData)
    setCurrentPage('welcome')
  }

  const handleContinueFromWelcome = () => {
    setCurrentPage('dashboard')
  }

  const handleAddExpense = (expense) => {
    const newExpenses = [...expenses, { ...expense, id: Date.now(), type: 'expense' }]
    setExpenses(newExpenses)
    
    const updatedUserData = {
      ...userData,
      expenses: newExpenses
    }
    
    setUserData(updatedUserData)
    saveUserData(updatedUserData)
    setCurrentPage('dashboard')
  }

  const handleAddIncome = (incomeEntry) => {
    const newIncome = [...income, { ...incomeEntry, id: Date.now(), type: 'income' }]
    setIncome(newIncome)
    
    const updatedUserData = {
      ...userData,
      income: newIncome
    }
    
    setUserData(updatedUserData)
    saveUserData(updatedUserData)
    setCurrentPage('dashboard')
  }

  const handleDeleteTransaction = (id, type) => {
    if (type === 'expense') {
      const newExpenses = expenses.filter(exp => exp.id !== id)
      setExpenses(newExpenses)
      
      const updatedUserData = {
        ...userData,
        expenses: newExpenses
      }
      
      setUserData(updatedUserData)
      saveUserData(updatedUserData)
    } else {
      const newIncome = income.filter(inc => inc.id !== id)
      setIncome(newIncome)
      
      const updatedUserData = {
        ...userData,
        income: newIncome
      }
      
      setUserData(updatedUserData)
      saveUserData(updatedUserData)
    }
  }

  const handleAddCategory = (newCategory) => {
    if (!categories.includes(newCategory)) {
      const newCategories = [...categories, newCategory]
      setCategories(newCategories)
      
      const updatedUserData = {
        ...userData,
        categories: newCategories
      }
      
      setUserData(updatedUserData)
      saveUserData(updatedUserData)
    }
  }

  const handleDeleteCategory = (categoryToDelete) => {
    // Don't allow deleting default categories
    const defaultCategories = getDefaultCategories()
    if (defaultCategories.includes(categoryToDelete)) {
      return
    }
    
    const newCategories = categories.filter(cat => cat !== categoryToDelete)
    setCategories(newCategories)
    
    const updatedUserData = {
      ...userData,
      categories: newCategories
    }
    
    setUserData(updatedUserData)
    saveUserData(updatedUserData)
  }

  const handleSaveBudgetSettings = (settings) => {
    setBudgetSettings(settings)
    
    const updatedUserData = {
      ...userData,
      budgetSettings: settings
    }
    
    setUserData(updatedUserData)
    saveUserData(updatedUserData)
    setCurrentPage('dashboard')
  }

  const navigateTo = (page) => {
    setCurrentPage(page)
  }

  return (
    <div className="App">
      {currentPage === 'setup' && (
        <Setup onSetupComplete={handleSetupComplete} />
      )}
      
      {currentPage === 'welcome' && userData && (
        <Welcome 
          userName={userData.name} 
          onContinue={handleContinueFromWelcome} 
        />
      )}
      
      {currentPage === 'dashboard' && userData && (
        <Dashboard
          userName={userData.name}
          currency={userData.currency}
          expenses={expenses}
          income={income}
          budgetSettings={budgetSettings}
          onNavigate={navigateTo}
        />
      )}
      
      {currentPage === 'addExpense' && userData && (
        <AddExpense
          categories={categories}
          currency={userData.currency}
          onAddExpense={handleAddExpense}
          onCancel={() => setCurrentPage('dashboard')}
          onNavigate={navigateTo}
        />
      )}
      
      {currentPage === 'addIncome' && userData && (
        <AddIncome
          currency={userData.currency}
          onAddIncome={handleAddIncome}
          onCancel={() => setCurrentPage('dashboard')}
          onNavigate={navigateTo}
        />
      )}
      
      {currentPage === 'transactions' && userData && (
        <TransactionList
          expenses={expenses}
          income={income}
          currency={userData.currency}
          onDelete={handleDeleteTransaction}
          onNavigate={navigateTo}
        />
      )}
      
      {currentPage === 'analytics' && userData && (
        <Analytics
          expenses={expenses}
          income={income}
          currency={userData.currency}
          onNavigate={navigateTo}
        />
      )}
      
      {currentPage === 'budgetSettings' && userData && (
        <BudgetSettings
          currentSettings={budgetSettings}
          categories={categories}
          currency={userData.currency}
          onSave={handleSaveBudgetSettings}
          onCancel={() => setCurrentPage('dashboard')}
        />
      )}
      
      {currentPage === 'categoryManager' && userData && (
        <CategoryManager
          categories={categories}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          onNavigate={navigateTo}
        />
      )}
      
      {currentPage === 'export' && userData && (
        <ExportData
          expenses={expenses}
          income={income}
          currency={userData.currency}
          onNavigate={navigateTo}
        />
      )}
    </div>
  )
}

export default App