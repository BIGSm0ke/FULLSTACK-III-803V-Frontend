import React, { useState, useEffect } from 'react';
import { alertService } from '../../services/alertService';
import '../../styles/alertas.css';

const severityOrder = { critica: 4, alta: 3, media: 2, baja: 1 };

const Alertas = () => {
    const [alerts, setAlerts] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        severity: 'all',
        type: 'all',
        date: '',
    });

    const fireTypes = ['forestal', 'casa', 'terreno', 'vehiculo', 'comercio', 'otro'];

    useEffect(() => {
        const fetchAlerts = async () => {
            setLoading(true);
            try {
                const data = await alertService.getAlerts(filters);
                // TODO: Ajustar formato de respuesta del MS Alertas
                setAlerts(Array.isArray(data) ? data : data.alerts || []);
            } catch (err) {
                console.error('Error cargando alertas:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();
    }, [filters]);

    const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

    const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

    const sortedAlerts = [...alerts].sort((a, b) => (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0));

    const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });

    return (
        <div className="alerts-container">
            <h1>Alertas Activas ({sortedAlerts.length})</h1>

            <div className="alerts-filters">
                <div className="filter-group">
                    <label>Gravedad:</label>
                    <select name="severity" value={filters.severity} onChange={handleFilterChange}>
                        <option value="all">Todas</option>
                        <option value="critica">Crítica</option>
                        <option value="alta">Alta</option>
                        <option value="media">Media</option>
                        <option value="baja">Baja</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label>Tipo:</label>
                    <select name="type" value={filters.type} onChange={handleFilterChange}>
                        <option value="all">Todos</option>
                        {fireTypes.map(type => <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>)}
                    </select>
                </div>
                <div className="filter-group">
                    <label>Fecha:</label>
                    <input type="date" name="date" value={filters.date} onChange={handleFilterChange} />
                </div>
                <button className="btn-clear-filters" onClick={() => setFilters({ severity: 'all', type: 'all', date: '' })}>Limpiar</button>
            </div>

            {loading ? (
                <p className="alerts-empty">Cargando alertas...</p>
            ) : sortedAlerts.length === 0 ? (
                <div className="alerts-empty">
                    <p>No hay alertas que coincidan con los filtros.</p>
                </div>
            ) : (
                <div className="alerts-grid">
                    {sortedAlerts.map(alert => (
                        <div key={alert.id} className={`alert-card alert-${alert.severity} ${expandedId === alert.id ? 'alert-expanded' : ''}`} onClick={() => toggleExpand(alert.id)}>
                            <div className="alert-header">
                                <span className={`alert-badge alert-badge-${alert.severity}`}>{alert.severity?.toUpperCase()}</span>
                                <span className="alert-time">🕐 {formatTime(alert.timestamp)}</span>
                            </div>

                            {expandedId === alert.id && (
                                <div className="alert-details">
                                    <p className="alert-address">📍 {alert.address}</p>
                                    <p className="alert-type">🔥 Tipo: <span>{alert.fireType}</span></p>
                                    <p className="alert-visible">⚠️ Se observa: <span>{alert.visible?.replace('_', ' ')}</span></p>
                                    <p className="alert-date-full">📅 {formatDate(alert.timestamp)}</p>
                                </div>
                            )}

                            <div className="expand-arrow">{expandedId === alert.id ? '▼' : '▲'}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Alertas;
