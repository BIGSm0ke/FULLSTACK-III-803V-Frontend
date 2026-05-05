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
        const isAdmin = email === 'admin@fireforce.com' && password === 'admin123';
        const mockUser = { 
            id: isAdmin ? 'admin_1' : 'user_1', 
            name: isAdmin ? 'Administrador' : 'Usuario Demo', 
            email, 
            phone: '+56 9 1234 5678', 
            photo: null,
            isAdmin 
        };
        setUser(mockUser);
        return mockUser;
    };

    const register = (name, email, password) => {
        const newUser = { id: 'user_' + Date.now(), name, email, phone: '', photo: null, isAdmin: false };
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
        <AuthContext.Provider value={{ user, login, register, updateUser, logout, isAuthenticated: !!user, isAdmin: user?.isAdmin || false }}>
            {children}
        </AuthContext.Provider>
    );
};
