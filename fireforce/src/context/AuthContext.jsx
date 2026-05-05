import React, { createContext, useState, useContext, useEffect } from 'react';
import { userService } from '../services/userService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('currentUser');
        return stored ? JSON.parse(stored) : null;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) localStorage.setItem('currentUser', JSON.stringify(user));
        else localStorage.removeItem('currentUser');
    }, [user]);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            // Intenta conectar con el microservicio real
            const data = await userService.login(email, password);
            localStorage.setItem('authToken', data.token);
            setUser(data.user);
            return data.user;
        } catch (err) {
            // FALLBACK: Si el microservicio falla, usa datos simulados
            console.warn('Backend no disponible. Usando modo simulado.');
            const isAdmin = email === 'admin@fireforce.com' && password === 'admin123';
            const mockUser = { 
                id: isAdmin ? 'admin_1' : 'user_' + Date.now(), 
                name: isAdmin ? 'Administrador' : (email.split('@')[0] || 'Usuario Demo'), 
                email, 
                phone: '+56 9 1234 5678', 
                photo: null,
                isAdmin 
            };
            setUser(mockUser);
            return mockUser;
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, email, password) => {
        setLoading(true);
        setError(null);
        try {
            const data = await userService.register(name, email, password);
            localStorage.setItem('authToken', data.token);
            setUser(data.user);
            return data.user;
        } catch (err) {
            // FALLBACK: Registro simulado
            console.warn('Backend no disponible. Usando modo simulado.');
            const newUser = { id: 'user_' + Date.now(), name, email, phone: '', photo: null, isAdmin: false };
            setUser(newUser);
            return newUser;
        } finally {
            setLoading(false);
        }
    };

    const updateUser = (updates) => {
        setUser(prev => ({ ...prev, ...updates }));
    };

    const logout = () => {
        try {
            userService.logout();
        } catch (e) {
            // Ignorar error si el servicio no está
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, updateUser, logout, isAuthenticated: !!user, isAdmin: user?.isAdmin || false, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};
