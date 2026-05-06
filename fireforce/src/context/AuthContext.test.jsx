import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { userService } from '../services/userService';

jest.mock('../services/userService', () => ({
    userService: {
        login: jest.fn().mockRejectedValue(new Error('Backend not available')),
        register: jest.fn().mockRejectedValue(new Error('Backend not available')),
        logout: jest.fn(),
    },
}));

const TestConsumer = () => {
    const { user, login, register, logout, isAuthenticated, isAdmin, updateUser } = useAuth();
    return (
        <div>
            <span data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</span>
            <span data-testid="admin-status">{isAdmin ? 'admin' : 'not-admin'}</span>
            <span data-testid="user-name">{user?.name || 'none'}</span>
            <button onClick={() => login('test@example.com', 'pass123')}>Login</button>
            <button onClick={() => register('Test User', 'test@example.com', 'pass123')}>Register</button>
            <button onClick={() => login('admin@fireforce.com', 'admin123')}>Login Admin</button>
            <button onClick={logout}>Logout</button>
            <button onClick={() => updateUser({ name: 'Updated Name' })}>Update</button>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    test('starts with no authenticated user', () => {
        render(<AuthProvider><TestConsumer /></AuthProvider>);
        expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
        expect(screen.getByTestId('user-name')).toHaveTextContent('none');
    });

    test('starts with isAdmin false', () => {
        render(<AuthProvider><TestConsumer /></AuthProvider>);
        expect(screen.getByTestId('admin-status')).toHaveTextContent('not-admin');
    });

    test('login creates a regular user', async () => {
        render(<AuthProvider><TestConsumer /></AuthProvider>);
        await act(async () => {
            screen.getByText('Login').click();
        });
        expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
        expect(screen.getByTestId('user-name')).toHaveTextContent('test');
        expect(screen.getByTestId('admin-status')).toHaveTextContent('not-admin');
    });

    test('login with admin credentials creates admin user', async () => {
        render(<AuthProvider><TestConsumer /></AuthProvider>);
        await act(async () => {
            screen.getByText('Login Admin').click();
        });
        expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
        expect(screen.getByTestId('user-name')).toHaveTextContent('Administrador');
        expect(screen.getByTestId('admin-status')).toHaveTextContent('admin');
    });

    test('logout clears user state', async () => {
        render(<AuthProvider><TestConsumer /></AuthProvider>);
        await act(async () => {
            screen.getByText('Login').click();
        });
        expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
        await act(async () => {
            screen.getByText('Logout').click();
        });
        expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
        expect(screen.getByTestId('user-name')).toHaveTextContent('none');
    });

    test('updateUser modifies user data', async () => {
        render(<AuthProvider><TestConsumer /></AuthProvider>);
        await act(async () => {
            screen.getByText('Login').click();
        });
        expect(screen.getByTestId('user-name')).toHaveTextContent('test');
        await act(async () => {
            screen.getByText('Update').click();
        });
        expect(screen.getByTestId('user-name')).toHaveTextContent('Updated Name');
    });

    test('persists user in localStorage after login', async () => {
        render(<AuthProvider><TestConsumer /></AuthProvider>);
        await act(async () => {
            screen.getByText('Login').click();
        });
        expect(localStorage.getItem('currentUser')).not.toBeNull();
        const stored = JSON.parse(localStorage.getItem('currentUser'));
        expect(stored.name).toBe('test');
    });

    test('removes user from localStorage after logout', async () => {
        render(<AuthProvider><TestConsumer /></AuthProvider>);
        await act(async () => {
            screen.getByText('Login').click();
        });
        await act(async () => {
            screen.getByText('Logout').click();
        });
        expect(localStorage.getItem('currentUser')).toBeNull();
    });
});
