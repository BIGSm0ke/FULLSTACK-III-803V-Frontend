import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../../styles/home.css';

const Home = () => {
    return (
        <div className="home-container">
            <div className="home-hero">
                <div className="hero-content">
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
                <div className="hero-image">
                    <MapContainer
                        className="home-map"
                        center={[-12.0464, -77.0428]}
                        zoom={13}
                        scrollWheelZoom={false}
                        dragging={false}
                        zoomControl={false}
                        attributionControl={false}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    </MapContainer>
                    <p className="image-caption">Nuestro sistema de monitoreo en acción</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
