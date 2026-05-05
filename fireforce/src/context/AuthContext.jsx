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
            // TODO: Conectar con tu MS Usuario
            // Respuesta esperada: { token: '...', user: { id, name, email, phone, photo, isAdmin } }
            const data = await userService.login(email, password);
            localStorage.setItem('authToken', data.token);
            setUser(data.user);
            return data.user;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, email, password) => {
        setLoading(true);
        setError(null);
        try {
            // TODO: Conectar con tu MS Usuario
            const data = await userService.register(name, email, password);
            localStorage.setItem('authToken', data.token);
            setUser(data.user);
            return data.user;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateUser = (updates) => setUser(prev => ({ ...prev, ...updates }));

    const logout = () => {
        userService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, updateUser, logout, isAuthenticated: !!user, isAdmin: user?.isAdmin || false, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};
