import { api } from './api';

export const userService = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (name, email, password) => api.post('/auth/register', { name, email, password }),
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
    getAllUsers: () => api.get('/auth/usuarios'),
    createUser: (data) => api.post('/auth/register', data),
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
    },
};
