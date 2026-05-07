import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { useAuth } from '../../context/AuthContext';
import { weatherService } from '../../services/weatherService';
import { monitorService } from '../../services/monitorService';
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

const riskConfig = {
    baja: { label: 'Riesgo Bajo', color: '#4caf50', icon: '🟢', desc: 'Condiciones seguras.' },
    media: { label: 'Precaución', color: '#ff9800', icon: '🟡', desc: 'Mantener vigilancia.' },
    alta: { label: 'Peligro Alto', color: '#f44336', icon: '🔴', desc: 'Alta probabilidad de incendios.' },
    extrema: { label: 'Peligro Extremo', color: '#9c27b0', icon: '🟣', desc: 'Emergencia inminente.' },
};

const calculateRiskLevel = (temp, humidity, wind) => {
    let score = 0;
    if (temp > 35) score += 3; else if (temp > 30) score += 2; else if (temp > 25) score += 1;
    if (humidity < 20) score += 3; else if (humidity < 35) score += 2; else if (humidity < 50) score += 1;
    if (wind > 40) score += 3; else if (wind > 25) score += 2; else if (wind > 15) score += 1;
    if (score >= 7) return 'extrema';
    if (score >= 5) return 'alta';
    if (score >= 3) return 'media';
    return 'baja';
};

const featuredNews = [
    {
        id: 1,
        title: 'Incendio en sector urbano-forestal genera gran columna de humo en Valparaíso',
        image: 'https://media.biobiochile.cl/wp-content/uploads/2026/03/incendio-en-sector-forestal-urbano-genera-gran-columna-de-humo-en-valparaiso-750x400.png',
        url: 'https://www.biobiochile.cl/noticias/nacional/region-de-valparaiso/2026/03/21/incendio-en-sector-urbano-forestal-genera-gran-columna-de-humo-en-valparaiso.shtml',
    },
    {
        id: 2,
        title: 'Incendio afecta un taller de buses en Estación Central',
        image: 'https://s.t13.cl/sites/default/files/styles/large_body/public/inline-images/2026-05/s%20%2823%29.jpg.jpeg?itok=f7rR1nll',
        url: 'https://www.t13.cl/noticia/nacional/incendio-estacion-central-afectaria-casas-buses-3-5-2026',
    },
    {
        id: 3,
        title: 'Incendio consumió departamento en edificio de San Miguel',
        image: 'https://pbs.twimg.com/media/HHa7BkKXkAAXruM?format=jpg&name=small',
        url: 'https://www.chilevision.cl//noticias/nacional/ahora-reportan-incendio-al-interior-de-edificio-en-san-miguel/',
    },
    {
        id: 4,
        title: 'Controlan incendio que afectó a viviendas y buses en Estación Central: hay 20 damnificados',
        image: 'https://www.latercera.com/resizer/v2/T7XVS5JO2ZGMFNELXK7ZCLCZCA.png?auth=59b02017196a94d96a1ccb32bdb0dd6a3dd6f7819f8170bd1398dd329a718a5a&smart=true&width=990&height=557&quality=70',
        url: 'https://www.latercera.com/servicios/noticia/incendio-afecta-viviendas-y-buses-en-estacion-central-bomberos-trabaja-con-12-companias/',
    },
    {
        id: 5,
        title: 'Una trabajadore muerta en un incendio provocado en un casino de Culiacán',
        image: 'https://imagenes.elpais.com/resizer/v2/BFRH7J6FQZBIPL5T7CDDEYEBRQ.jpg?auth=81e68fc8e3a0743edd0792287f39c4c7e33886680448be201113b1f028f3f383&width=828&height=466&smart=true',
        url: 'https://elpais.com/noticias/incendios/',
    },
];

const Home = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [fires, setFires] = useState([]);
    const [weather, setWeather] = useState(null);
    const [weatherLoading, setWeatherLoading] = useState(true);
    const [weatherError, setWeatherError] = useState(false);

    useEffect(() => {
        monitorService.getActiveFires().then(data => {
            setFires(Array.isArray(data) ? data : []);
        }).catch(() => {});
    }, []);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const data = await weatherService.fetchWeather();
                const riskLevel = calculateRiskLevel(data.temp, data.humidity, data.wind);
                setWeather({ ...data, riskLevel });
            } catch (err) {
                console.error('Weather API unavailable:', err);
                setWeatherError(true);
            } finally {
                setWeatherLoading(false);
            }
        };
        fetchWeather();
    }, []);

    if (weatherLoading) {
        return (
            <div className="home-wrapper">
                <div className="home-hero-bg">
                    <img src="https://www.firefighternation.com/wp-content/uploads/2024/08/hero-header-example.jpg" alt="Firefighter" />
                    <div className="hero-overlay"></div>
                </div>
                <div className="home-container">
                    <div className="loading-skeleton">
                        <div className="skeleton-block skeleton-wide"></div>
                        <div className="skeleton-block skeleton-map"></div>
                        <div className="skeleton-block skeleton-risk"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!weather) {
        return (
            <div className="home-wrapper">
                <div className="home-hero-bg">
                    <img src="https://www.firefighternation.com/wp-content/uploads/2024/08/hero-header-example.jpg" alt="Firefighter" />
                    <div className="hero-overlay"></div>
                </div>
                <div className="home-container">
                    <div className="home-block home-info">
                        <h1>Bienvenido a Municipalidad Valle del Sol</h1>
                        <p>Servicio climático no disponible en este momento.</p>
                    </div>
                </div>
            </div>
        );
    }

    const currentRisk = riskConfig[weather.riskLevel];

    return (
        <div className="home-wrapper">
                <div className="home-hero-bg">
                    <img src="https://www.firefighternation.com/wp-content/uploads/2024/08/hero-header-example.jpg" alt="Firefighter background" />
                    <div className="hero-overlay"></div>
                </div>
            
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
                            {fires.map(fire => (
                                <Marker key={fire.id} position={[fire.lat, fire.lng]} icon={deleteDefaultIcon}>
                                    <Popup>
                                        <strong>Incendio {fire.fireType}</strong><br />
                                        Gravedad: {fire.severity}<br />
                                        Se observa: {fire.visible}<br />
                                        Dirección: {fire.address}<br />
                                        <em>Reportado por: {fire.name}</em>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                        <button className="try-map-btn" onClick={() => navigate('/reportes')}>
                            ¿Quieres reportar un incendio?
                        </button>
                    </div>

                    <div className="home-block home-risk-block">
                        <div className="risk-header">
                            <h2>Índice de Riesgo de Incendio</h2>
                            <span className="risk-badge" style={{ backgroundColor: currentRisk.color }}>{currentRisk.icon} {currentRisk.label}</span>
                        </div>
                        <p className="risk-desc">{currentRisk.desc}</p>
                        {weatherError && <p className="risk-fallback-note">⚠️ Mostrando datos de referencia (servicio climático no disponible)</p>}
                        <div className="risk-metrics">
                            <div className="metric">
                                <span className="metric-icon">🌡️</span>
                                <span className="metric-label">Temperatura</span>
                                <span className="metric-value">{weather.temp}°C</span>
                            </div>
                            <div className="metric">
                                <span className="metric-icon">💧</span>
                                <span className="metric-label">Humedad</span>
                                <span className="metric-value">{weather.humidity}%</span>
                            </div>
                            <div className="metric">
                                <span className="metric-icon">💨</span>
                                <span className="metric-label">Viento</span>
                                <span className="metric-value">{weather.wind} km/h</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="alerts-cta">
                    <button className="btn-alerts-cta" onClick={() => navigate(isAuthenticated ? '/alertas' : '/login')}>
                        {isAuthenticated ? '🚨 ¡Revisa las alertas actuales! 🚨' : '🚨 ¡Inicia sesión para recibir las alertas! 🚨'}
                    </button>
                </div>

                <div className="news-section">
                    <h2>Noticias Destacadas</h2>
                    <div className="news-grid">
                        {featuredNews.map(news => (
                            <a key={news.id} href={news.url} target="_blank" rel="noopener noreferrer" className="news-card">
                                <img src={news.image} alt={news.title} className="news-image" />
                                <p className="news-title">{news.title}</p>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
