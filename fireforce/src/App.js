import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import MonitoringPage from './components/pages/monitoreo';
import Home from './components/pages/home';
import Footer from './components/footer';
import Reportes from './components/pages/reportes';
import Alertas from './components/pages/alertas';
import Login from './components/pages/login';
import MiCuenta from './components/pages/micuenta';
import About from './components/pages/about';
import { ReportProvider } from './context/ReportContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import CustomLogo from './assets/fflogo.png';
import './App.css';
import './styles/sidebar.css';

const AdminRoute = ({ children }) => {
    const { isAdmin, isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!isAdmin) return <Navigate to="/" replace />;
    return children;
};

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
        </button>
    );
};

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated, logout, isAdmin } = useAuth();

    const handleNav = (path) => {
        navigate(path);
        setSidebarOpen(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        setSidebarOpen(false);
    };

    const handleProfileClick = () => {
        navigate('/micuenta');
        setSidebarOpen(false);
    };

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="App-container">
            <nav className="navbar">
                <div className="navbar-left">
                    <button className="navbar-logo-btn" onClick={() => setSidebarOpen(true)}>
                        <img src={CustomLogo} alt="Logo" className="navbar-logo" />
                    </button>
                </div>
            </nav>

            <div className={`sidebar-overlay ${sidebarOpen ? 'sidebar-overlay-open' : ''}`} onClick={closeSidebar}></div>
            
            <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <button className="sidebar-close" onClick={closeSidebar}>×</button>
                {isAuthenticated && user ? (
                    <div className="sidebar-profile" onClick={handleProfileClick}>
                        <div className="sidebar-photo">
                            {user.photo ? (
                                <img src={user.photo} alt={user.name} />
                            ) : (
                                <span>{user.name?.charAt(0).toUpperCase()}</span>
                            )}
                            {isAdmin && <span className="admin-badge">ADMIN</span>}
                        </div>
                        <span className="sidebar-username">{user.name}</span>
                    </div>
                ) : (
                    <div className="sidebar-profile sidebar-profile-guest">
                        <div className="sidebar-photo">
                            <span>?</span>
                        </div>
                        <span className="sidebar-username">Invitado</span>
                    </div>
                )}
                <ul className="sidebar-menu">
                    <li>
                        <button
                            className={`sidebar-item ${location.pathname === '/' ? 'active' : ''}`}
                            onClick={() => handleNav('/')}
                        >
                            Inicio
                        </button>
                    </li>
                    {isAdmin && (
                        <li>
                            <button
                                className={`sidebar-item ${location.pathname === '/monitoreo' ? 'active' : ''}`}
                                onClick={() => handleNav('/monitoreo')}
                            >
                                Monitoreo
                            </button>
                        </li>
                    )}
                    <li>
                        <button
                            className={`sidebar-item ${location.pathname === '/alertas' ? 'active' : ''}`}
                            onClick={() => handleNav('/alertas')}
                        >
                            Alertas
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
                    <li className="sidebar-divider"></li>
                    <li>
                        {isAuthenticated ? (
                            <button className="sidebar-item sidebar-logout" onClick={handleLogout}>
                                Cerrar Sesión
                            </button>
                        ) : (
                            <button
                                className={`sidebar-item ${location.pathname === '/login' ? 'active' : ''}`}
                                onClick={() => handleNav('/login')}
                            >
                                Iniciar Sesión
                            </button>
                        )}
                    </li>
                </ul>
                <div className="sidebar-footer">
                    <ThemeToggle />
                </div>
            </div>

            <div className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/monitoreo" element={<AdminRoute><MonitoringPage /></AdminRoute>} />
                    <Route path="/alertas" element={<Alertas />} />
                    <Route path="/reportes" element={<Reportes />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/micuenta" element={<MiCuenta />} />
                    <Route path="/about" element={<About />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <ReportProvider>
                    <ThemeProvider>
                        <Layout />
                    </ThemeProvider>
                </ReportProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
