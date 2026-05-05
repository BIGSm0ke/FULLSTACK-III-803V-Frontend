import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useReports } from '../../context/ReportContext';
import { useAuth } from '../../context/AuthContext';
import '../../styles/monitoreo.css';

const severityIcons = {
    critica: new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
    }),
    alta: new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
    }),
    media: new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
    }),
    baja: new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
    }),
};

const severityOrder = { critica: 4, alta: 3, media: 2, baja: 1 };

const MonitoringPage = () => {
    const { reports, deleteReport } = useReports();
    const { isAdmin } = useAuth();

    const sortedReports = [...reports].sort((a, b) => (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0));

    const handleDelete = (reportId) => {
        if (window.confirm('¿Estás seguro de eliminar este reporte?')) {
            deleteReport(reportId);
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString('es-CL', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    return (
        <div className="monitoring-page">
            <div className="map-section">
                <div className="map-wrapper">
                    <MapContainer center={[-33.4489, -70.6693]} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {sortedReports.map(report => (
                            <Marker key={report.id} position={[report.lat, report.lng]} icon={severityIcons[report.severity] || severityIcons.baja}>
                                <Popup>
                                    <strong>Incendio {report.fireType?.toUpperCase()}</strong><br />
                                    Gravedad: {report.severity}<br />
                                    Se observa: {report.visible}<br />
                                    Dirección: {report.address}<br />
                                    <em>Reportado por: {report.name}</em>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>

            <div className="reports-section">
                <h2>Reportes Activos ({sortedReports.length})</h2>
                {sortedReports.length === 0 ? (
                    <p className="no-reports">No hay reportes activos.</p>
                ) : (
                    <div className="reports-list">
                        {sortedReports.map(report => (
                            <div key={report.id} className={`report-card report-${report.severity}`}>
                                <div className="report-card-header">
                                    <span className={`severity-badge severity-${report.severity}`}>{report.severity?.toUpperCase()}</span>
                                    <span className="report-card-date">{formatDate(report.timestamp)}</span>
                                </div>
                                <p className="report-card-address">{report.address}</p>
                                <p className="report-card-details">
                                    Tipo: <strong>{report.fireType}</strong> | Se observa: <strong>{report.visible}</strong>
                                </p>
                                <p className="report-card-author">Reportado por: {report.name}</p>
                                {isAdmin && (
                                    <button className="btn-delete-report" onClick={() => handleDelete(report.id)}>
                                        Eliminar
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MonitoringPage;
