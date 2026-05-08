import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useReports } from '../../context/ReportContext';
import { useToast } from '../../context/ToastContext';
import { userService } from '../../services/userService';
import '../../styles/micuenta.css';

const MiCuenta = () => {
    const { user, updateUser, logout, isAuthenticated } = useAuth();
    const { getUserReports } = useReports();
    const navigate = useNavigate();

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });

    const { addToast } = useToast();

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                updateUser({ photo: reader.result });
                try {
                    await userService.updateProfile({ photo: reader.result });
                    addToast('Foto actualizada');
                } catch (e) {
                    addToast('Error al guardar la foto: ' + e.message, 'error');
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        updateUser(formData);
        setEditMode(false);
        try {
            await userService.updateProfile(formData);
            addToast('Perfil actualizado');
        } catch {
            addToast('Error al guardar el perfil', 'error');
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
        });
        setEditMode(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!isAuthenticated) {
        return (
            <div className="account-container">
                <div className="account-box">
                    <h2>No has iniciado sesión</h2>
                    <p>Inicia sesión para ver tu perfil y reportes.</p>
                    <button className="btn-primary" onClick={() => navigate('/login')}>Ir a Login</button>
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
                    <div className="profile-header">
                        <label htmlFor="photo-upload" className="photo-container">
                            {user.photo ? (
                                <img src={user.photo} alt={user.name} />
                            ) : (
                                <span>{user.name?.charAt(0).toUpperCase()}</span>
                            )}
                            <div className="photo-overlay">
                                <span>📷</span>
                            </div>
                        </label>
                        <input
                            type="file"
                            id="photo-upload"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            hidden
                        />
                    </div>

                    <div className="profile-body">
                        <div className="info-row">
                            <span className="info-label">Nombre:</span>
                            {editMode ? (
                                <input type="text" name="name" value={formData.name} onChange={handleChange} />
                            ) : (
                                <span className="info-value">{user.name}</span>
                            )}
                        </div>
                        <div className="info-row">
                            <span className="info-label">Email:</span>
                            {editMode ? (
                                <input type="email" name="email" value={formData.email} onChange={handleChange} />
                            ) : (
                                <span className="info-value">{user.email}</span>
                            )}
                        </div>
                        <div className="info-row">
                            <span className="info-label">Teléfono:</span>
                            {editMode ? (
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                            ) : (
                                <span className="info-value">{user.phone || 'No proporcionado'}</span>
                            )}
                        </div>
                    </div>

                    <div className="profile-actions">
                        {editMode ? (
                            <>
                                <button className="btn-save" onClick={handleSave}>Guardar</button>
                                <button className="btn-cancel" onClick={handleCancel}>Cancelar</button>
                            </>
                        ) : (
                            <button className="btn-edit" onClick={() => setEditMode(true)}>Editar Perfil</button>
                        )}
                    </div>
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
