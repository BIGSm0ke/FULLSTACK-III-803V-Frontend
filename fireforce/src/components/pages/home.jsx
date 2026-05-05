import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { useReports } from '../../context/ReportContext';
import 'leaflet/dist/leaflet.css';
import '../../styles/home.css';

const deleteDefaultIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const Home = () => {
    const navigate = useNavigate();
    const { reports } = useReports();

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
                        center={[-33.4489, -70.6693]}
                        zoom={13}
                        scrollWheelZoom={false}
                        dragging={true}
                        zoomControl={true}
                        attributionControl={true}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {reports.map(report => (
                            <Marker key={report.id} position={[report.lat, report.lng]} icon={deleteDefaultIcon}>
                                <Popup>
                                    <strong>Incendio {report.fireType}</strong><br />
                                    Gravedad: {report.severity}<br />
                                    Se observa: {report.visible}<br />
                                    Dirección: {report.address}<br />
                                    <em>Reportado por: {report.name}</em>
                                </Popup>
                            </Marker>
                        ))}
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
