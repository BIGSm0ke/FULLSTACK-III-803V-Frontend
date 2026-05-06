const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1';

const fetchWeather = async (lat = -33.4489, lon = -70.6693) => {
    const url = `${OPEN_METEO_BASE}/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch weather data');
    const data = await response.json();
    const current = data.current_weather;
    return {
        temp: current.temperature,
        wind: current.windspeed,
        humidity: data.hourly?.relativehumidity_2m?.[0] ?? 50,
        timestamp: current.time,
    };
};

export const weatherService = { fetchWeather };
