import { api } from './api';

export const reportService = {
    create: (reportData) => api.post('/reports', reportData),
    getAll: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.severity && filters.severity !== 'all') params.append('severity', filters.severity);
        if (filters.type && filters.type !== 'all') params.append('type', filters.type);
        if (filters.date) params.append('date', filters.date);
        return api.get(`/reports?${params.toString()}`);
    },
    getById: (id) => api.get(`/reports/${id}`),
    delete: (id) => api.delete(`/reports/${id}`),
};
