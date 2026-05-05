import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import '../../styles/monitoreo.css';

const MonitoringPage = () => {
    const [focos, setFocos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('api/gateway/monitoreo/focos')
            .then(res => res.json())
            .then(data => {
                setFocos(data);
                setLoading(false);
            })
            .catch(err => console.error("Error cargando monitoreo:", err));
    }, []);

    return (
        <div className="monitoring-container">
            {loading ? (
                <div className="loading-overlay">
                    <p>Cargando mapa y focos activos...</p>
                </div>
            ) : (
                <div className="map-wrapper">
                    <MapContainer center={[-33.4489, -70.6693]} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {focos.map(foco => (
                            <Marker key={foco.id} position={[foco.lat, foco.lng]}>
                                <Popup>
                                    <strong>Incendio: {foco.descripcion}</strong><br />
                                    Estado: {foco.estado}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            )}
        </div>
    );
};

export default MonitoringPage;