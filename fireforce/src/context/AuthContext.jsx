import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('currentUser');
        return stored ? JSON.parse(stored) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('currentUser');
        }
    }, [user]);

    const login = (email, password) => {
        const mockUser = { id: 'user_1', name: 'Usuario Demo', email, phone: '+56 9 1234 5678', photo: null };
        setUser(mockUser);
        return mockUser;
    };

    const register = (name, email, password) => {
        const newUser = { id: 'user_' + Date.now(), name, email, phone: '', photo: null };
        setUser(newUser);
        return newUser;
    };

    const updateUser = (updates) => {
        setUser(prev => ({ ...prev, ...updates }));
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, updateUser, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};
