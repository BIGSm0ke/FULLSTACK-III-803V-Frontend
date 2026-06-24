# FireForce - Frontend

Aplicación web React para la gestión y monitoreo de incendios forestales. Sistema con roles (admin/usuario), mapas interactivos con Leaflet, alertas en tiempo real y reportes.

## Tecnologías

- React 19, react-router-dom v7, react-leaflet, CSS3
- Open-Meteo API (clima), OpenStreetMap
- Despliegue: AWS

## Estructura

- `fireforce/` — Aplicación React principal
- `FireForce-Postman.json` — Colección Postman

## Inicio rápido

```bash
cd fireforce
npm install
npm start
```

Abre `http://localhost:3000`. La API apunta a `http://44.215.241.158:8080/api` (configurable en `src/services/api.js` mediante `REACT_APP_API_URL`).

## Módulos

| Ruta | Descripción | Acceso |
|------|-------------|--------|
| `/` | Home con mapa, clima, noticias | Público |
| `/login` | Inicio de sesión | Público |
| `/unete` | Reclutamiento | Público |
| `/alertas` | Alertas de incendios | Usuario+ |
| `/reportes` | Crear reporte en 3 pasos | Usuario+ |
| `/micuenta` | Perfil de usuario | Usuario+ |
| `/admin/usuarios` | Gestión de usuarios | Admin |
| `/monitoreo` | Mapa de monitoreo | Admin |

## Capturas

<img width="1865" height="918" alt="image" src="https://github.com/user-attachments/assets/83f59b8f-eae8-4b79-a255-e2cb9aea5b9b" />
