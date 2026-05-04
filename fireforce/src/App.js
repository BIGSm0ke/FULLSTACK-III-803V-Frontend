import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MonitoringPage from './pages/monitoreo'; 
import './App.css'; // Importamos los estilos

function App() {
  return (
    <Router>
      <div className="App-container">
        {/* Barra de navegación */}
        <nav className="navbar">
          <ul className="nav-list">
            <li>
              <Link to="/" className="nav-button">Inicio</Link>
            </li>
            <li>
              <Link to="/monitoreo" className="nav-button">Mapa de Monitoreo</Link>
            </li>
          </ul>
        </nav>

        {/* Configuración de las rutas */}
        <div className="container" style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<h1>Bienvenido a Municipalidad Valle del Sol</h1>} />
            
            {/* RUTA SOLICITADA PARA MONITOREO */}
            <Route path="/monitoreo" element={<MonitoringPage />} />
            
            {/* Espacio para MS Reportes o MS Alertas */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;