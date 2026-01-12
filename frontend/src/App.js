// ========== src/App.js (COMPLETE WORKING VERSION) ==========
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './components/Dashboard/Dashboard';
import ProjectList from './components/Projects/ProjectList';
import ProjectDetail from './components/Projects/ProjectDetail';
import SprintBoard from './components/Sprints/SprintBoard';
import SprintList from './components/Sprints/SprintList';
import PerformanceChart from './components/Analytics/PerformanceChart';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '20px'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      {!isAuthenticated ? (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <div style={{ display: 'flex', height: '100vh' }}>
          <Sidebar />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Navbar user={user} onLogout={handleLogout} />
            <div style={{ 
              flex: 1, 
              overflow: 'auto', 
              padding: '20px', 
              backgroundColor: '#f5f5f5' 
            }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/projects" element={<ProjectList />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/sprints" element={<SprintList />} />
                <Route path="/sprints/:id" element={<SprintBoard />} />
                <Route path="/analytics" element={<PerformanceChart />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;