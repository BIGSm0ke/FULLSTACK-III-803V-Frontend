import React from 'react';
import '../../styles/about.css';

const About = () => {
    return (
        <div className="about-container">
            <div className="about-content">
                <h1>Sobre Nosotros</h1>
                <div className="about-text">
                    <p>
                        La <strong>Municipalidad Valle del Sol</strong> se dedica incansablemente al bienestar y la seguridad de nuestra comunidad. 
                        Nacimos con la misión de integrar tecnología de vanguardia y un fuerte compromiso humano para proteger a nuestras familias y nuestro entorno.
                    </p>
                    <p>
                        A través de nuestro sistema <strong>FireForce</strong>, implementamos soluciones de monitoreo geográfico en tiempo real que permiten 
                        una respuesta rápida y eficiente ante emergencias de incendios forestales y urbanos.
                    </p>
                    <p>
                        Nuestro equipo de profesionales trabaja en estrecha colaboración con bomberos, defensa civil y otros organismos de seguridad 
                        para garantizar un entorno más seguro para todos.
                    </p>
                </div>
                
                <div className="about-values">
                    <div className="value-card">
                        <h3>Misión</h3>
                        <p>Proteger a la comunidad mediante tecnología innovadora y gestión de riesgos eficiente.</p>
                    </div>
                    <div className="value-card">
                        <h3>Visión</h3>
                        <p>Ser referentes nacionales en seguridad y respuesta ante emergencias municipales.</p>
                    </div>
                    <div className="value-card">
                        <h3>Valores</h3>
                        <p>Compromiso, Seguridad, Innovación y Servicio al Ciudadano.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
