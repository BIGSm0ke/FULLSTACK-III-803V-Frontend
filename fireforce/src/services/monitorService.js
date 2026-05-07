import { api } from './api';

export const monitorService = {
    getActiveFires: () => api.get('/monitoreo/active'),
    getFireById: (id) => api.get(`/monitoreo/fires/${id}`),
    getStats: () => api.get('/monitoreo/stats'),
    deleteFire: (id) => api.delete(`/monitoreo/fires/${id}`),
};
