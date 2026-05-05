import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import MonitoringPage from './components/pages/monitoreo';
import Home from './components/pages/home';
import Footer from './components/footer';
import Reportes from './components/pages/reportes';
import { ReportProvider } from './context/ReportContext';
import CustomLogo from './assets/ff.jpg';
import './App.css';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleNav = (path) => {
        navigate(path);
        setSidebarOpen(false);
    };

    return (
        <div className="App-container">
            <nav className="navbar">
                <div className="navbar-left">
                    <button className="navbar-logo-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <img src={CustomLogo} alt="Logo" className="navbar-logo" />
                    </button>
                </div>
            </nav>

            {sidebarOpen && (
                <div className="sidebar">
                    <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>×</button>
                    <ul className="sidebar-menu">
                        <li>
                            <button
                                className={`sidebar-item ${location.pathname === '/' ? 'active' : ''}`}
                                onClick={() => handleNav('/')}
                            >
                                Inicio
                            </button>
                        </li>
                        <li>
                            <button
                                className={`sidebar-item ${location.pathname === '/monitoreo' ? 'active' : ''}`}
                                onClick={() => handleNav('/monitoreo')}
                            >
                                Monitoreo
                            </button>
                        </li>
                        <li>
                            <button
                                className={`sidebar-item ${location.pathname === '/reportes' ? 'active' : ''}`}
                                onClick={() => handleNav('/reportes')}
                            >
                                Reportes
                            </button>
                        </li>
                    </ul>
                </div>
            )}

            <div className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/monitoreo" element={<MonitoringPage />} />
                    <Route path="/reportes" element={<Reportes />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
};

function App() {
    return (
        <Router>
            <ReportProvider>
                <Layout />
            </ReportProvider>
        </Router>
    );
}

export default App;
