import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { userService } from '../../services/userService';
import '../../styles/admin-crear-usuario.css';

const AdminCrearUsuario = () => {
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', rol: 'USER' });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await userService.createUser(form);
            addToast(`Usuario ${form.rol === 'ADMIN' ? 'administrador' : ''} creado exitosamente`);
            setForm({ name: '', email: '', password: '', rol: 'USER' });
        } catch (err) {
            addToast(err.message || 'Error al crear usuario', 'error');
        }
    };

    return (
        <div className="admin-crear-container">
            <h1>Crear Usuario</h1>
            <form onSubmit={handleSubmit} className="admin-crear-form">
                <div className="form-group">
                    <label>Nombre completo</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Correo electrónico</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Contraseña</label>
                    <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} />
                </div>
                <div className="form-group">
                    <label>Rol</label>
                    <select name="rol" value={form.rol} onChange={handleChange}>
                        <option value="USER">Usuario</option>
                        <option value="ADMIN">Administrador</option>
                    </select>
                </div>
                <div className="btn-group">
                    <button type="button" className="btn-cancel" onClick={() => navigate('/admin-usuarios')}>Cancelar</button>
                    <button type="submit" className="btn-submit">Crear Usuario</button>
                </div>
            </form>
        </div>
    );
};

export default AdminCrearUsuario;
