import React, { useState, useEffect } from 'react';
import { alertService } from '../../services/alertService';
import '../../styles/alertas.css';

const severityOrder = { critica: 4, alta: 3, media: 2, baja: 1 };

const MOCK_ALERTS = [
    { id: 1, severity: 'critica', fireType: 'forestal', visible: 'humo_denso', address: 'Sector Norte, Parque Industrial', timestamp: '2026-05-06T10:30:00' },
    { id: 2, severity: 'alta', fireType: 'comercio', visible: 'llamas_visibles', address: 'Av. Los Libertadores 789', timestamp: '2026-05-06T11:15:00' },
    { id: 3, severity: 'media', fireType: 'terreno', visible: 'fuego_controlado', address: 'Lote 45, Zona Residencial Sur', timestamp: '2026-05-06T09:45:00' },
    { id: 4, severity: 'baja', fireType: 'vehiculo', visible: 'humo_leve', address: 'Estacionamiento Municipal, Calle 3', timestamp: '2026-05-06T12:00:00' },
    { id: 5, severity: 'alta', fireType: 'casa', visible: 'techo_afectado', address: 'Pasaje Los Olivos 123, Sector Este', timestamp: '2026-05-06T10:00:00' },
];

const Alertas = () => {
    const [alerts, setAlerts] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState(null);
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
                const alertsData = Array.isArray(data) ? data : data.alerts || [];
                setAlerts(alertsData.length > 0 ? alertsData : MOCK_ALERTS);
            } catch (err) {
                setAlerts(MOCK_ALERTS);
                console.warn('Backend no disponible. Usando alertas de ejemplo.');
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();
    }, [filters]);

    const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

    const handleShare = async (e, alert) => {
        e.stopPropagation();
        const shareUrl = `${window.location.origin}/alertas?id=${alert.id}`;
        const shareData = {
            title: `Alerta ${alert.severity} - FireForce`,
            text: `🔥 Incendio ${alert.fireType} en ${alert.address}. Gravedad: ${alert.severity}.`,
            url: shareUrl,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                if (err.name !== 'AbortError') copyToClipboard(shareUrl, alert.id);
            }
        } else {
            copyToClipboard(shareUrl, alert.id);
        }
    };

    const copyToClipboard = async (url, alertId) => {
        try {
            await navigator.clipboard.writeText(url);
            setCopiedId(alertId);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Error al copiar:', err);
        }
    };

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
                <div className="alerts-grid skeleton-grid">
                    {[1, 2, 3, 4, 5, 6].map(n => (
                        <div key={n} className="alert-skeleton-card">
                            <div className="skeleton-header">
                                <div className="skeleton-badge"></div>
                                <div className="skeleton-time"></div>
                            </div>
                            <div className="skeleton-line skeleton-short"></div>
                            <div className="skeleton-line skeleton-long"></div>
                        </div>
                    ))}
                </div>
            ) : sortedAlerts.length === 0 ? (
                <div className="alerts-empty">
                    <p>No hay alertas que coincidan con los filtros.</p>
                </div>
            ) : (
                <div className="alerts-grid">
                    {sortedAlerts.map(alert => (
                        <div key={alert.id} className={`alert-card alert-${alert.severity} ${expandedId === alert.id ? 'alert-expanded' : ''}`} onClick={() => toggleExpand(alert.id)}>
                            <div className="alert-header">
                                <div className="alert-header-left">
                                    <span className={`alert-badge alert-badge-${alert.severity}`}>{alert.severity?.toUpperCase()}</span>
                                    <span className="alert-time">🕐 {formatTime(alert.timestamp)}</span>
                                </div>
                                <button className="btn-share-alert" onClick={(e) => handleShare(e, alert)} title="Compartir alerta">
                                    {copiedId === alert.id ? '✅' : '📤'}
                                </button>
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
