import React from 'react';
import { useReports } from '../../context/ReportContext';
import '../../styles/alertas.css';

const severityOrder = { critica: 4, alta: 3, media: 2, baja: 1 };

const Alertas = () => {
    const { reports } = useReports();

    const sortedReports = [...reports].sort((a, b) => (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0));

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString('es-CL', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    return (
        <div className="alerts-container">
            <h1>Alertas Activas ({sortedReports.length})</h1>

            {sortedReports.length === 0 ? (
                <div className="alerts-empty">
                    <p>No hay alertas activas.</p>
                </div>
            ) : (
                <div className="alerts-grid">
                    {sortedReports.map(report => (
                        <div key={report.id} className={`alert-card alert-${report.severity}`}>
                            <div className="alert-header">
                                <span className={`alert-badge alert-badge-${report.severity}`}>
                                    {report.severity?.toUpperCase()}
                                </span>
                                <span className="alert-date">{formatDate(report.timestamp)}</span>
                            </div>
                            <p className="alert-address">📍 {report.address}</p>
                            <p className="alert-visible">⚠️ {report.visible?.replace('_', ' ')}</p>
                            <p className="alert-type">Tipo: {report.fireType}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Alertas;
