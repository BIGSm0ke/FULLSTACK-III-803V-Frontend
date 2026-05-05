import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import '../../styles/home.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <div className="home-grid">
                <div className="home-block home-info">
                    <h1>Bienvenido a Municipalidad Valle del Sol</h1>
                    <p>
                        Somos una organización comprometida con la seguridad y bienestar de nuestros ciudadanos.
                        Nuestro sistema de monitoreo geográfico FireForce permite la vigilancia en tiempo real
                        de focos de incendio, brindando información crucial para una respuesta rápida y efectiva.
                    </p>
                    <p>
                        Con tecnología de punta y un equipo dedicado, trabajamos incansablemente para proteger
                        nuestro territorio y a las familias que lo habitan.
                    </p>
                </div>
                <div className="home-block home-map-block">
                    <MapContainer
                        className="home-map"
                        center={[-12.0464, -77.0428]}
                        zoom={13}
                        scrollWheelZoom={false}
                        dragging={true}
                        zoomControl={true}
                        attributionControl={true}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    </MapContainer>
                    <button className="try-map-btn" onClick={() => navigate('/monitoreo')}>
                        ¿Quieres reportar un incendio?
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
