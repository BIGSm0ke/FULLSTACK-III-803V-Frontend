import { api } from './api';

export const alertService = {
    getAlerts: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.severity && filters.severity !== 'all') params.append('severity', filters.severity);
        if (filters.type && filters.type !== 'all') params.append('fireType', filters.type);
        if (filters.date) params.append('date', filters.date);
        return api.get(`/alerts?${params.toString()}`);
    },
    getById: (id) => api.get(`/alerts/${id}`),
};
