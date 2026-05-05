import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useReports } from '../../context/ReportContext';
import '../../styles/reportes.css';

const deleteDefaultIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const FireMap = ({ position, address, onLocationFound, onAddressResolved }) => {
    const map = useMap();

    useMapEvents({
        click(e) {
            reverseGeocode(e.latlng.lat, e.latlng.lng);
            onLocationFound(e.latlng);
        },
    });

    const reverseGeocode = async (lat, lng) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            if (data.display_name) {
                onAddressResolved(data.display_name);
            }
        } catch (error) {
            console.error('Error obteniendo dirección:', error);
        }
    };

    useEffect(() => {
        if (!address || address.length < 5) return;

        const controller = new AbortController();
        const timer = setTimeout(async () => {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`, { signal: controller.signal });
                const data = await response.json();
                if (data.length > 0) {
                    const lat = parseFloat(data[0].lat);
                    const lon = parseFloat(data[0].lon);
                    map.flyTo([lat, lon], 16);
                    onLocationFound({ lat, lng: lon });
                }
            } catch (error) {
                if (error.name !== 'AbortError') console.error('Error geocodificando:', error);
            }
        }, 800);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [address]);

    return (
        <>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {position && (
                <Marker position={position} icon={deleteDefaultIcon}>
                    <Popup>Ubicación del incendio</Popup>
                </Marker>
            )}
        </>
    );
};

const Reportes = () => {
    const { addReport } = useReports();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fireType: '',
        severity: '',
        visible: '',
        address: '',
        name: '',
        phone: '',
    });
    const [location, setLocation] = useState(null);

    const fireTypes = [
        { value: 'forestal', label: 'Forestal', icon: '🌲' },
        { value: 'casa', label: 'Casa / Vivienda', icon: '🏠' },
        { value: 'terreno', label: 'Terreno / Pastizal', icon: '🌾' },
        { value: 'vehiculo', label: 'Vehículo', icon: '🚗' },
        { value: 'comercio', label: 'Local / Comercio', icon: '🏢' },
        { value: 'otro', label: 'Otro', icon: '📦' },
    ];

    const severities = [
        { value: 'baja', label: 'Baja', color: '#4caf50', desc: 'Fuego controlable' },
        { value: 'media', label: 'Media', color: '#ff9800', desc: 'Requiere atención' },
        { value: 'alta', label: 'Alta', color: '#f44336', desc: 'Peligro inmediato' },
        { value: 'critica', label: 'Crítica', color: '#9c27b0', desc: 'Emergencia máxima' },
    ];

    const visibleTypes = [
        { value: 'humo', label: 'Solo humo', icon: '💨' },
        { value: 'llamas_pequenas', label: 'Llamas pequeñas', icon: '🔥' },
        { value: 'llamas_grandes', label: 'Llamas grandes', icon: '🔥🔥' },
        { value: 'columna_fuego', label: 'Columna de fuego', icon: '🔥🔥🔥' },
        { value: 'explosion', label: 'Explosión / Riesgo', icon: '💥' },
    ];

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleAddressResolved = (resolvedAddress) => {
        setFormData(prev => ({ ...prev, address: resolvedAddress }));
    };

    const validateStep = () => {
        if (step === 1) return formData.fireType && formData.severity && formData.visible;
        if (step === 2) return location !== null;
        if (step === 3) return formData.name.trim() && formData.phone.trim();
        return true;
    };

    const nextStep = () => {
        if (validateStep()) setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    const handleSubmit = () => {
        addReport({
            ...formData,
            lat: location.lat,
            lng: location.lng,
        });
        setFormData({ fireType: '', severity: '', visible: '', address: '', name: '', phone: '' });
        setLocation(null);
        setStep(1);
        alert('Reporte enviado exitosamente.');
    };

    return (
        <div className="report-container">
            <h1>Reportar Incendio</h1>

            <div className="stepper">
                <div className={`step ${step >= 1 ? 'active' : ''}`}>
                    <span className="step-number">1</span>
                    <span className="step-label">Datos del Incendio</span>
                </div>
                <div className={`step ${step >= 2 ? 'active' : ''}`}>
                    <span className="step-number">2</span>
                    <span className="step-label">Ubicación</span>
                </div>
                <div className={`step ${step >= 3 ? 'active' : ''}`}>
                    <span className="step-number">3</span>
                    <span className="step-label">Datos del Reportante</span>
                </div>
            </div>

            <div className="report-form">
                {step === 1 && (
                    <div className="form-step">
                        <h2>Paso 1: Datos del Incendio</h2>

                        <label className="section-label">Tipo de incendio</label>
                        <div className="card-grid">
                            {fireTypes.map(type => (
                                <button
                                    key={type.value}
                                    className={`selection-card ${formData.fireType === type.value ? 'selected' : ''}`}
                                    onClick={() => handleChange('fireType', type.value)}
                                >
                                    <span className="card-icon">{type.icon}</span>
                                    <span className="card-label">{type.label}</span>
                                </button>
                            ))}
                        </div>

                        <label className="section-label">Gravedad</label>
                        <div className="card-grid severity-grid">
                            {severities.map(sev => (
                                <button
                                    key={sev.value}
                                    className={`severity-card ${formData.severity === sev.value ? 'selected' : ''}`}
                                    style={formData.severity === sev.value ? { borderColor: sev.color, backgroundColor: `${sev.color}20` } : {}}
                                    onClick={() => handleChange('severity', sev.value)}
                                >
                                    <span className="severity-dot" style={{ backgroundColor: sev.color }}></span>
                                    <span className="card-label">{sev.label}</span>
                                    <span className="card-sub">{sev.desc}</span>
                                </button>
                            ))}
                        </div>

                        <label className="section-label">¿Qué se observa?</label>
                        <div className="card-grid">
                            {visibleTypes.map(v => (
                                <button
                                    key={v.value}
                                    className={`selection-card ${formData.visible === v.value ? 'selected' : ''}`}
                                    onClick={() => handleChange('visible', v.value)}
                                >
                                    <span className="card-icon">{v.icon}</span>
                                    <span className="card-label">{v.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="btn-group-right">
                            <button className="btn-next" onClick={nextStep} disabled={!validateStep()}>Siguiente</button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="form-step">
                        <h2>Paso 2: Ubicación del Incendio</h2>
                        <div className="form-group">
                            <label>Dirección exacta *</label>
                            <input type="text" name="address" value={formData.address} onChange={(e) => handleChange('address', e.target.value)} placeholder="Escribe una dirección o haz clic en el mapa" />
                        </div>
                        <p className="hint">Escribe la dirección o haz clic en el mapa para obtenerla automáticamente.</p>
                        <MapContainer
                            className="report-map"
                            center={[-33.4489, -70.6693]}
                            zoom={13}
                            scrollWheelZoom={true}
                        >
                            <FireMap
                                position={location}
                                address={formData.address}
                                onLocationFound={(latlng) => setLocation(latlng)}
                                onAddressResolved={handleAddressResolved}
                            />
                        </MapContainer>
                        <div className="btn-group">
                            <button className="btn-prev" onClick={prevStep}>Anterior</button>
                            <button className="btn-next" onClick={nextStep} disabled={!validateStep()}>Siguiente</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="form-step">
                        <h2>Paso 3: Datos del Reportante</h2>
                        <div className="form-group">
                            <label>Nombre completo *</label>
                            <input type="text" name="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Juan Pérez" />
                        </div>
                        <div className="form-group">
                            <label>Teléfono de contacto *</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="+56 9 1234 5678" />
                        </div>

                        <div className="review">
                            <h3>Resumen del Reporte</h3>
                            <p><strong>Tipo:</strong> {fireTypes.find(t => t.value === formData.fireType)?.label}</p>
                            <p><strong>Gravedad:</strong> {severities.find(s => s.value === formData.severity)?.label}</p>
                            <p><strong>Se observa:</strong> {visibleTypes.find(v => v.value === formData.visible)?.label}</p>
                            <p><strong>Dirección:</strong> {formData.address}</p>
                            <p><strong>Coordenadas:</strong> {location?.lat.toFixed(5)}, {location?.lng.toFixed(5)}</p>
                        </div>

                        <div className="btn-group">
                            <button className="btn-prev" onClick={prevStep}>Anterior</button>
                            <button className="btn-submit" onClick={handleSubmit}>Enviar Reporte</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reportes;
