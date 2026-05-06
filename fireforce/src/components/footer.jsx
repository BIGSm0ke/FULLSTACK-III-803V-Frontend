import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>¿Quieres unirte?</h3>
                    <p>¿Tienes vocación de servicio y quieres proteger a tu comunidad?</p>
                    <Link to="/unete" className="btn-join">¡Únete al equipo FireForce!</Link>
                </div>
                <div className="footer-section">
                    <h3>Contacto</h3>
                    <p>📞 Teléfono: +56 9 4582 3756</p>
                    <p>📧 Email: contacto@municipalidadvalledelsol.cl</p>
                    <p>📍 Dirección: Av. Los Libertadores 456, Valle del Sol</p>
                    <p>🕐 Horario: Lunes a Viernes 8:00 AM - 6:00 PM</p>
                </div>
                <div className="footer-section">
                    <h3>Enlaces</h3>
                    <p><Link to="/about" className="footer-link">Sobre Nosotros</Link></p>
                    <p>🔥 Línea de emergencias: 911</p>
                    <p>🚒 Bomberos: +56 9 3865 1470</p>
                </div>
                <div className="footer-section">
                    <h3>Síguenos</h3>
                    <p>🌐 www.municipalidadvalledelsol.cl</p>
                    <p>📘 Facebook: /MuniValleDelSol</p>
                    <p>🐦 Twitter: @MuniValleSol</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>🔥 Diseñado por FireForce 🔥</p>
            </div>
        </footer>
    );
};

export default Footer;

