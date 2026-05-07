import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import '../../styles/login.css';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { login, register, isAuthenticated } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
                addToast('Inicio de sesión exitoso');
            } else {
                if (formData.password !== formData.confirmPassword) {
                    addToast('Las contraseñas no coinciden', 'error');
                    return;
                }
                await register(formData.name, formData.email, formData.password);
                addToast('Registro exitoso');
            }
            navigate('/');
        } catch (err) {
            addToast(err.message || 'Error al procesar la solicitud', 'error');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h1>
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label>Nombre completo</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Correo electrónico</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    {!isLogin && (
                        <div className="form-group">
                            <label>Confirmar contraseña</label>
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                        </div>
                    )}
                    <button type="submit" className="btn-auth">
                        {isLogin ? 'Ingresar' : 'Registrarse'}
                    </button>
                </form>
                <div className="auth-toggle">
                    {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                    <button onClick={() => setIsLogin(!isLogin)} className="btn-link">
                        {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
