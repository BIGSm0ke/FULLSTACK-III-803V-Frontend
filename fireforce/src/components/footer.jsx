import React from 'react';
import '../styles/footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Contacto</h3>
                    <p>📞 Teléfono: +56 9 1111 1111</p>
                    <p>📧 Email: contacto@municipalidadvalledelsol.gob.pe</p>
                    <p>📍 Dirección: Av. Los Libertadores 456, Valle del Sol</p>
                </div>
                <div className="footer-section">
                    <h3>Emergencias</h3>
                    <p>🔥 Línea de emergencias: 116</p>
                    <p>🚒 Bomberos: +51 912-345-678</p>
                    <p>🏥 Defensa Civil: +51 923-456-789</p>
                </div>
                <div className="footer-section">
                    <h3>Síguenos</h3>
                    <p>🌐 www.municipalidadvalledelsol.gob.pe</p>
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
