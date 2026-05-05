import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MonitoringPage from './components/pages/monitoreo';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="App-container">
        <nav className="navbar">
          <div className="navbar-left">
            <img src="/logo192.png" alt="Logo" className="navbar-logo" />
          </div>
          <div className="navbar-center">
            <Link to="/" className="nav-button">Inicio</Link>
            <button className="nav-button" onClick={() => setSidebarOpen(!sidebarOpen)}>
              Secciones
            </button>
          </div>
        </nav>

        {sidebarOpen && (
          <div className="sidebar">
            <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>×</button>
            <ul className="sidebar-menu">
              <li><Link to="/monitoreo" className="sidebar-item" onClick={() => setSidebarOpen(false)}>Monitoreo</Link></li>
              <li><Link to="/" className="sidebar-item" onClick={() => setSidebarOpen(false)}>Inicio</Link></li>
            </ul>
          </div>
        )}

        <div className="main-content">
          <Routes>
            <Route path="/" element={<h1 className="welcome-page">Bienvenido a Municipalidad Valle del Sol</h1>} />
            <Route path="/monitoreo" element={<MonitoringPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;