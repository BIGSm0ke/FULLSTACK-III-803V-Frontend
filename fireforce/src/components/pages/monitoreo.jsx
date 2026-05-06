import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { monitorService } from '../../services/monitorService';
import { useAuth } from '../../context/AuthContext';
import '../../styles/monitoreo.css';

const severityIcons = {
    critica: new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] }),
    alta: new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] }),
    media: new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] }),
    baja: new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] }),
};

const MOCK_MONITOR_FIRES = [
    { id: 1, lat: -33.4489, lng: -70.6693, severity: 'alta', fireType: 'forestal', visible: 'humo', address: 'Sector Norte', name: 'Admin', timestamp: '2025-05-06T10:00:00', status: 'en_sitio', statusHistory: [{ status: 'recibido', time: '10:00' }, { status: 'en_camino', time: '10:05' }, { status: 'en_sitio', time: '10:15' }] },
    { id: 2, lat: -33.4589, lng: -70.6593, severity: 'media', fireType: 'basural', visible: 'fuego', address: 'Av. Central', name: 'User', timestamp: '2025-05-06T11:00:00', status: 'en_camino', statusHistory: [{ status: 'recibido', time: '11:00' }, { status: 'en_camino', time: '11:10' }] },
];

const statusOrder = ['recibido', 'en_camino', 'en_sitio', 'controlado'];
const statusLabels = { recibido: 'Recibido', en_camino: 'En Camino', en_sitio: 'En Sitio', controlado: 'Controlado' };
const statusIcons = { recibido: '📞', en_camino: '🚒', en_sitio: '📍', controlado: '✅' };

const severityColors = { critica: '#9c27b0', alta: '#f44336', media: '#ff9800', baja: '#4caf50' };

const severityOrder = { critica: 4, alta: 3, media: 2, baja: 1 };

const MonitoringPage = () => {
    const { isAdmin } = useAuth();
    const [fires, setFires] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFores = async () => {
            try {
                const data = await monitorService.getActiveFires();
                const firesData = Array.isArray(data) ? data : data.fires || [];
                setFires(firesData.length > 0 ? firesData : MOCK_MONITOR_FIRES);
            } catch (err) {
                setFires(MOCK_MONITOR_FIRES);
                console.warn('Backend no disponible. Usando monitoreo de ejemplo.');
            } finally {
                setLoading(false);
            }
        };
        fetchFores();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar este reporte del mapa?')) return;
        try {
            await monitorService.deleteFire(id);
            setFires(prev => prev.filter(f => f.id !== id));
        } catch (err) {
            console.error('Error eliminando incendio:', err);
        }
    };

    const sortedFires = [...fires].sort((a, b) => (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0));
    const formatDate = (d) => new Date(d).toLocaleString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    if (loading) return <div className="monitoring-container"><p>Cargando mapa...</p></div>;

    return (
        <div className="monitoring-page">
            <div className="map-section">
                <div className="map-wrapper">
                    <MapContainer center={[-33.4489, -70.6693]} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {sortedFires.map(fire => (
                            <Marker key={fire.id} position={[fire.lat, fire.lng]} icon={severityIcons[fire.severity] || severityIcons.baja}>
                                <Tooltip direction="top" offset={[0, -10]} opacity={1} className={`map-tooltip map-tooltip-${fire.severity}`}>
                                    <div className="tooltip-content">
                                        <strong>🔥 {fire.fireType?.toUpperCase()}</strong>
                                        <span className={`tooltip-badge badge-${fire.severity}`}>{fire.severity?.toUpperCase()}</span>
                                        <p className="tooltip-address">📍 {fire.address}</p>
                                    </div>
                                </Tooltip>
                                <Popup className="map-popup">
                                    <div className="popup-content">
                                        <h3 className="popup-title">🔥 Incendio {fire.fireType?.toUpperCase()}</h3>
                                        <div className="popup-row">
                                            <span className="popup-label">Gravedad:</span>
                                            <span className={`popup-badge badge-${fire.severity}`}>{fire.severity?.toUpperCase()}</span>
                                        </div>
                                        <div className="popup-row">
                                            <span className="popup-label">Se observa:</span>
                                            <span>{fire.visible?.replace('_', ' ')}</span>
                                        </div>
                                        
                                        {fire.statusHistory && fire.statusHistory.length > 0 && (
                                            <div className="popup-timeline">
                                                <h4 className="timeline-title">Estado de Respuesta</h4>
                                                <div className="timeline-steps">
                                                    {statusOrder.map((step, idx) => {
                                                        const isCompleted = fire.statusHistory.some(s => s.status === step);
                                                        const isCurrent = fire.status === step;
                                                        return (
                                                            <div key={step} className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                                                                <div className="timeline-dot">{statusIcons[step]}</div>
                                                                <div className="timeline-info">
                                                                    <span className="timeline-label">{statusLabels[step]}</span>
                                                                    {isCompleted && (
                                                                        <span className="timeline-time">
                                                                            {fire.statusHistory.find(s => s.status === step)?.time}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {idx < statusOrder.length - 1 && <div className="timeline-line"></div>}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        <div className="popup-row">
                                            <span className="popup-label">Dirección:</span>
                                            <span>{fire.address}</span>
                                        </div>
                                        <div className="popup-row">
                                            <span className="popup-label">Reportado por:</span>
                                            <span>{fire.name}</span>
                                        </div>
                                        {fire.phone && (
                                            <div className="popup-row">
                                                <span className="popup-label">Teléfono:</span>
                                                <span>{fire.phone}</span>
                                            </div>
                                        )}
                                        <div className="popup-footer">
                                            <span className="popup-date">📅 {formatDate(fire.timestamp)}</span>
                                            {isAdmin && (
                                                <button className="btn-popup-delete" onClick={() => handleDelete(fire.id)}>Eliminar</button>
                                            )}
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>

            <div className="reports-section">
                <h2>Reportes Activos ({sortedFires.length})</h2>
                {sortedFires.length === 0 ? (
                    <p className="no-reports">No hay reportes activos.</p>
                ) : (
                    <div className="reports-list">
                        {sortedFires.map(fire => (
                            <div key={fire.id} className={`report-card report-${fire.severity}`}>
                                <div className="report-card-header">
                                    <span className={`severity-badge severity-${fire.severity}`}>{fire.severity?.toUpperCase()}</span>
                                    <span className="report-card-date">{formatDate(fire.timestamp)}</span>
                                </div>
                                <p className="report-card-address">{fire.address}</p>
                                <p className="report-card-details">
                                    Tipo: <strong>{fire.fireType}</strong> | Se observa: <strong>{fire.visible}</strong>
                                </p>
                                <p className="report-card-author">Reportado por: {fire.name}</p>
                                {isAdmin && <button className="btn-delete-report" onClick={() => handleDelete(fire.id)}>Eliminar</button>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MonitoringPage;
