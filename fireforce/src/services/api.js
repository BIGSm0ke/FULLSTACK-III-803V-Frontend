const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://44.215.241.158:8080/api';

const apiRequest = async (endpoint, method = 'GET', body = null) => {
    const token = localStorage.getItem('authToken');
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const config = { method, headers };
    if (body) config.body = JSON.stringify(body);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    if (response.status === 204 || response.headers.get('content-length') === '0') return null;
    return response.json();
};

export const api = {
    get: (endpoint) => apiRequest(endpoint, 'GET'),
    post: (endpoint, body) => apiRequest(endpoint, 'POST', body),
    put: (endpoint, body) => apiRequest(endpoint, 'PUT', body),
    delete: (endpoint) => apiRequest(endpoint, 'DELETE'),
};
