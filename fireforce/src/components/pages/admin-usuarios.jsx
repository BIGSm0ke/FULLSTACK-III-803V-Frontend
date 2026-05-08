import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReports } from '../../context/ReportContext';
import { userService } from '../../services/userService';
import '../../styles/admin-usuarios.css';

const AdminUsuarios = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const { getUserReports } = useReports();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await userService.getAllUsers();
                setUsers(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Error cargando usuarios:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const selectedUser = users.find(u => u.id === Number(userId));

    const filteredUsers = users.filter(u =>
        (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (dateStr) => new Date(dateStr).toLocaleString('es-CL', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });

    const exportToPDF = (user, reports) => {
        const printWindow = window.open('', '_blank');
        const printContent = `
<!DOCTYPE html>
<html>
<head><title>Perfil FireForce - ${user.name}</title>
<style>
    body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
    .header { text-align: center; border-bottom: 3px solid #fa0000; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #0b1e33; margin: 0; }
    .header p { color: #666; margin: 5px 0 0 0; }
    .profile-info { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; background: #f8f9fa; padding: 20px; border-radius: 8px; }
    .info-item { padding: 8px 0; }
    .info-label { font-weight: bold; color: #0b1e33; display: block; font-size: 0.85rem; }
    .info-value { color: #555; }
    .reports-section { margin-top: 30px; }
    .reports-section h2 { color: #fa0000; border-bottom: 2px solid #fa0000; padding-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 0.9rem; }
    th { background: #0b1e33; color: white; padding: 10px; text-align: left; }
    td { padding: 8px 10px; border-bottom: 1px solid #e0e0e0; }
    tr:nth-child(even) { background: #f8f9fa; }
    .severity-critica { color: #9c27b0; font-weight: bold; }
    .severity-alta { color: #f44336; font-weight: bold; }
    .severity-media { color: #ff9800; font-weight: bold; }
    .severity-baja { color: #4caf50; font-weight: bold; }
    .footer { margin-top: 40px; text-align: center; color: #999; font-size: 0.8rem; border-top: 1px solid #e0e0e0; padding-top: 15px; }
</style></head>
<body>
    <div class="header"><h1>🔥 FireForce</h1><p>Perfil y Historial de Reportes</p><p>Generado: ${new Date().toLocaleString('es-CL')}</p></div>
    <div class="profile-info">
        <div class="info-item"><span class="info-label">Nombre</span><span class="info-value">${user.name}</span></div>
        <div class="info-item"><span class="info-label">Email</span><span class="info-value">${user.email}</span></div>
        <div class="info-item"><span class="info-label">Teléfono</span><span class="info-value">${user.phone || 'No proporcionado'}</span></div>
        <div class="info-item"><span class="info-label">Total Reportes</span><span class="info-value">${reports.length}</span></div>
    </div>
    <div class="reports-section">
        <h2>Historial de Reportes (${reports.length})</h2>
        ${reports.length > 0 ? `<table>
            <thead><tr><th>#</th><th>Tipo</th><th>Gravedad</th><th>Dirección</th><th>Se Observa</th><th>Fecha</th></tr></thead>
            <tbody>${reports.map((r, i) => `<tr><td>${i + 1}</td><td>${r.fireType?.charAt(0).toUpperCase() + r.fireType?.slice(1)}</td><td class="severity-${r.severity}">${r.severity?.toUpperCase()}</td><td>${r.address}</td><td>${r.visible?.replace('_', ' ')}</td><td>${formatDate(r.timestamp)}</td></tr>`).join('')}</tbody></table>` : '<p style="color: #999; text-align: center; padding: 20px;">No hay reportes registrados.</p>'}
    </div>
    <div class="footer"><p>Generado por FireForce - Sistema de Monitoreo de Incendios</p></div>
    <script>window.onload = function() { window.print(); }</script></body></html>`;
        printWindow.document.write(printContent);
        printWindow.document.close();
    };

    if (userId && selectedUser) {
        const userReports = getUserReports(selectedUser.id);

        return (
            <div className="admin-user-detail">
                <div className="detail-header">
                    <button className="btn-back-list" onClick={() => navigate('/admin-usuarios')}>← Volver a Usuarios</button>
                    <h1>Perfil del Usuario</h1>
                </div>

                <div className="detail-grid">
                    <div className="detail-card detail-info">
                        <div className="detail-profile-header">
                            <div className="detail-photo">
                                {selectedUser.photo ? (
                                    <img src={selectedUser.photo} alt={selectedUser.name} />
                                ) : (
                                    <span>{selectedUser.name?.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                            <h2>{selectedUser.name}</h2>
                            {selectedUser.isAdmin && <span className="detail-admin-badge">ADMINISTRADOR</span>}
                        </div>

                        <div className="detail-body">
                            <div className="detail-row">
                                <span className="detail-label">Email:</span>
                                <span className="detail-value">{selectedUser.email}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Teléfono:</span>
                                <span className="detail-value">{selectedUser.phone || 'No proporcionado'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Rol:</span>
                                <span className="detail-value">{selectedUser.isAdmin ? 'Administrador' : 'Usuario'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="detail-card detail-reports">
                        <div className="detail-reports-header">
                            <h2>Reportes ({userReports.length})</h2>
                            <button className="btn-download-pdf" onClick={() => exportToPDF(selectedUser, userReports)}>
                                Descargar Reporte PDF
                            </button>
                        </div>

                        {userReports.length === 0 ? (
                            <p className="no-reports-detail">No hay reportes registrados.</p>
                        ) : (
                            <div className="detail-reports-list">
                                {userReports.map(report => (
                                    <div key={report.id} className="detail-report-item">
                                        <div className="detail-report-header">
                                            <span className={`detail-severity-badge severity-${report.severity}`}>{report.severity?.toUpperCase()}</span>
                                            <span className="detail-report-date">{formatDate(report.timestamp)}</span>
                                        </div>
                                        <p className="detail-report-address">{report.address}</p>
                                        <p className="detail-report-details">
                                            Tipo: <strong>{report.fireType}</strong> | Se observa: <strong>{report.visible?.replace('_', ' ')}</strong>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-users-container">
            <div className="admin-users-header">
                <h1>Gestión de Usuarios</h1>
                <button className="btn-crear-usuario" onClick={() => navigate('/admin/crear-usuario')}>Crear Usuario</button>
            </div>

            <div className="admin-users-search">
                <input
                    type="text"
                    placeholder="Buscar por nombre o email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {filteredUsers.length === 0 ? (
                <p className="no-users">No se encontraron usuarios.</p>
            ) : (
                <div className="admin-users-grid">
                    {filteredUsers.map(user => {
                        const userReportCount = getUserReports(user.id).length;
                        return (
                            <div
                                key={user.id}
                                className="admin-user-card"
                                onClick={() => navigate(`/admin-usuarios/${user.id}`)}
                            >
                                <div className="admin-user-photo">
                                    {user.photo ? (
                                        <img src={user.photo} alt={user.name} />
                                    ) : (
                                        <span>{user.name?.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <h3>{user.name}</h3>
                                <p className="admin-user-email">{user.email}</p>
                                {user.isAdmin && <span className="admin-badge-small">ADMIN</span>}
                                <p className="admin-user-reports">📄 {userReportCount} reportes</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AdminUsuarios;
