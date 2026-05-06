import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Contacto</h3>
                    <p>📞 Teléfono: +51 987-654-321</p>
                    <p>📧 Email: contacto@municipalidadvalledelsol.gob.pe</p>
                    <p>📍 Dirección: Av. Los Libertadores 456, Valle del Sol</p>
                    <p>🕐 Horario: Lunes a Viernes 8:00 AM - 6:00 PM</p>
                </div>
                <div className="footer-section">
                    <h3>Enlaces</h3>
                    <p><Link to="/about" className="footer-link">Sobre Nosotros</Link></p>
                    <p>🔥 Línea de emergencias: 116</p>
                    <p>🚒 Bomberos: +51 912-345-678</p>
                </div>
                <div className="footer-section">
                    <h3>Síguenos</h3>
                    <p>🌐 www.municipalidadvalledelsol.gob.pe</p>
                    <p>📘 Facebook: /MuniValleDelSol</p>
                    <p>🐦 Twitter: @MuniValleSol</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>🔥 Diseñado por FireForce</p>
            </div>
        </footer>
    );
};

export default Footer;

