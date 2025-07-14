// React import not needed in React 18+ with JSX transform
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard/Dashboard'
import CustomerList from './pages/Customers/CustomerList'
import Reports from './pages/Reports/Reports'
import TransactionImport from './pages/DataImport/TransactionImport'
import CustomerImport from './pages/DataImport/CustomerImport'
import Login from './pages/Auth/Login'
import ProtectedRoute from './components/Auth/ProtectedRoute'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes with layout */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="customers" element={<CustomerList />} />
            <Route path="reports" element={<Reports />} />
            <Route path="import/transactions" element={<TransactionImport />} />
            <Route path="import/customers" element={<CustomerImport />} />
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App 