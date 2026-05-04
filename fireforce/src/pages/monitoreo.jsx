import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import '../styles/monitoreo.css'; 

const MonitoringPage = () => {
    const [focos, setFocos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Simulación de consumo del microservicio MS Monitoreo Geográfico
    useEffect(() => {
        fetch('api/gateway/monitoreo/focos') // Llamada a través del API Gateway
            .then(res => res.json())
            .then(data => {
                setFocos(data);
                setLoading(false);
            })
            .catch(err => console.error("Error cargando monitoreo:", err));
    }, []);

    return (
        <div className="monitoring-container">
            <h2>Panel de Monitoreo Geográfico - Valle del Sol</h2>
            {loading ? (
                <p>Cargando mapa y focos activos...</p>
            ) : (
                <div style={{ height: '500px', width: '100%' }}>
                    <MapContainer center={[-33.4489, -70.6693]} zoom={13} style={{ height: '100%' }}>
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