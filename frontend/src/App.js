import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ReportGenerator from './components/ReportGenerator';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="App d-flex flex-column min-vh-100">
          <Navbar user={user} onLogout={logout} />
          <main className="flex-grow-1">
            <div className="container-fluid">
              <Routes>
                <Route 
                  path="/login" 
                  element={user ? <Navigate to="/dashboard" /> : <Login onLogin={login} />} 
                />
                <Route 
                  path="/register" 
                  element={user ? <Navigate to="/dashboard" /> : <Register onLogin={login} />} 
                />
                <Route 
                  path="/dashboard" 
                  element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
                />
                <Route 
                  path="/reports" 
                  element={user ? <ReportGenerator user={user} /> : <Navigate to="/login" />} 
                />
                <Route 
                  path="/" 
                  element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
                />
              </Routes>
            </div>
          </main>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;