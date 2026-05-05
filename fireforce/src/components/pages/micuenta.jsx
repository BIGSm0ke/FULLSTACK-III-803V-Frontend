import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useReports } from '../../context/ReportContext';
import '../../styles/micuenta.css';

const MiCuenta = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { getUserReports } = useReports();

    if (!isAuthenticated) {
        return (
            <div className="account-container">
                <div className="account-box">
                    <h2>No has iniciado sesión</h2>
                    <p>Inicia sesión para ver tu perfil y reportes.</p>
                </div>
            </div>
        );
    }

    const userReports = getUserReports(user.id);

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString('es-CL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="account-container">
            <div className="account-grid">
                <div className="account-card account-info">
                    <h2>Mi Perfil</h2>
                    <div className="info-row">
                        <span className="info-label">Nombre:</span>
                        <span className="info-value">{user.name}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Email:</span>
                        <span className="info-value">{user.email}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Teléfono:</span>
                        <span className="info-value">{user.phone || 'No proporcionado'}</span>
                    </div>
                    <button className="btn-logout" onClick={logout}>
                        Cerrar Sesión
                    </button>
                </div>

                <div className="account-card account-reports">
                    <h2>Mis Reportes ({userReports.length})</h2>
                    {userReports.length === 0 ? (
                        <p className="no-reports">No has realizado ningún reporte aún.</p>
                    ) : (
                        <div className="reports-list">
                            {userReports.map(report => (
                                <div key={report.id} className="report-item">
                                    <div className="report-header">
                                        <span className="report-type">{report.fireType?.toUpperCase()}</span>
                                        <span className="report-date">{formatDate(report.timestamp)}</span>
                                    </div>
                                    <p className="report-address">{report.address}</p>
                                    <p className="report-details">
                                        Gravedad: <strong>{report.severity}</strong> | Se observa: <strong>{report.visible}</strong>
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MiCuenta;
