import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

const severityOrder = { critica: 4, alta: 3, media: 2, baja: 1 };

const MonitoringPage = () => {
    const { isAdmin } = useAuth();
    const [fires, setFires] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFires = async () => {
            try {
                // TODO: Conectar con tu MS Monitoreo
                const data = await monitorService.getActiveFires();
                setFires(Array.isArray(data) ? data : data.fires || []);
            } catch (err) {
                console.error('Error cargando monitoreo:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFires();
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
                                <Popup>
                                    <strong>Incendio {fire.fireType?.toUpperCase()}</strong><br />
                                    Gravedad: {fire.severity}<br />
                                    Se observa: {fire.visible}<br />
                                    Dirección: {fire.address}<br />
                                    <em>Reportado por: {fire.name}</em>
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
