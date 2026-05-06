import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/unete.css';

const Unete = () => {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        age: '',
        experience: '',
        availability: '',
        motivation: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="unete-success">
                <div className="success-card">
                    <div className="success-icon">🔥</div>
                    <h1>¡Genial!</h1>
                    <p>Nos pondremos en contacto contigo pronto.</p>
                    <p className="success-sub">Revisa tu correo electrónico para más información sobre los próximos pasos.</p>
                    <button className="btn-back" onClick={() => navigate('/')}>Volver al inicio</button>
                </div>
            </div>
        );
    }

    return (
        <div className="unete-container">
            <div className="unete-content">
                <h1>¿Quieres ser parte del equipo FireForce?</h1>
                <p className="unete-intro">
                    Buscamos personas comprometidas con la seguridad de nuestra comunidad.
                    Completa el formulario y nos pondremos en contacto contigo.
                </p>

                <form className="unete-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Nombre completo *</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Correo electrónico *</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Teléfono *</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Edad *</label>
                            <input type="number" name="age" value={formData.age} onChange={handleChange} min="18" max="65" required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Experiencia previa</label>
                        <select name="experience" value={formData.experience} onChange={handleChange}>
                            <option value="">Selecciona una opción</option>
                            <option value="ninguna">Sin experiencia</option>
                            <option value="voluntario">Voluntario</option>
                            <option value="bombero">Bombero profesional</option>
                            <option value="paramedico">Paramédico</option>
                            <option value="otra">Otra</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Disponibilidad *</label>
                        <select name="availability" value={formData.availability} onChange={handleChange} required>
                            <option value="">Selecciona una opción</option>
                            <option value="tiempo-completo">Tiempo completo</option>
                            <option value="medio-tiempo">Medio tiempo</option>
                            <option value="voluntario">Voluntario fines de semana</option>
                            <option value="emergencias">Solo emergencias</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>¿Por qué quieres unirte?</label>
                        <textarea name="motivation" value={formData.motivation} onChange={handleChange} rows="4" placeholder="Cuéntanos tu motivación..." />
                    </div>

                    <button type="submit" className="btn-submit">Enviar solicitud</button>
                </form>
            </div>
        </div>
    );
};

export default Unete;
