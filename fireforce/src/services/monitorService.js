import { api } from './api';

export const monitorService = {
    getActiveFires: () => api.get('/monitoring/active'),
    getFireById: (id) => api.get(`/monitoring/fires/${id}`),
    getStats: () => api.get('/monitoring/stats'),
    deleteFire: (id) => api.delete(`/monitoring/fires/${id}`),
};
