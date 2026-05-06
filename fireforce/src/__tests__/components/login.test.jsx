import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../components/pages/login';
import { AuthProvider } from '../../context/AuthContext';
import { ReportProvider } from '../../context/ReportContext';
import { ThemeProvider } from '../../context/ThemeContext';

const renderWithProviders = (ui) => {
    return render(
        <BrowserRouter>
            <AuthProvider>
                <ReportProvider>
                    <ThemeProvider>{ui}</ThemeProvider>
                </ReportProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};

describe('Login Component', () => {
    test('renders login form by default', () => {
        renderWithProviders(<Login />);
        expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
        expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument();
        expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Ingresar' })).toBeInTheDocument();
    });

    test('toggles to registration form', () => {
        renderWithProviders(<Login />);
        fireEvent.click(screen.getByText('Regístrate aquí'));
        expect(screen.getByText('Crear Cuenta')).toBeInTheDocument();
        expect(screen.getByLabelText('Nombre completo')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirmar contraseña')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Registrarse' })).toBeInTheDocument();
    });

    test('toggles back to login form', () => {
        renderWithProviders(<Login />);
        fireEvent.click(screen.getByText('Regístrate aquí'));
        fireEvent.click(screen.getByText('Inicia sesión'));
        expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
        expect(screen.queryByLabelText('Nombre completo')).not.toBeInTheDocument();
    });

    test('shows admin hint on login form', () => {
        renderWithProviders(<Login />);
        expect(screen.getByText(/Admin:/)).toBeInTheDocument();
    });

    test('does not show admin hint on register form', () => {
        renderWithProviders(<Login />);
        fireEvent.click(screen.getByText('Regístrate aquí'));
        expect(screen.queryByText(/Admin:/)).not.toBeInTheDocument();
    });

    test('login form has required fields', () => {
        renderWithProviders(<Login />);
        const emailInput = screen.getByLabelText('Correo electrónico');
        const passwordInput = screen.getByLabelText('Contraseña');
        expect(emailInput).toHaveAttribute('type', 'email');
        expect(passwordInput).toHaveAttribute('type', 'password');
        expect(emailInput).toBeRequired();
        expect(passwordInput).toBeRequired();
    });

    test('register form has all required fields', () => {
        renderWithProviders(<Login />);
        fireEvent.click(screen.getByText('Regístrate aquí'));
        expect(screen.getByLabelText('Nombre completo')).toBeRequired();
        expect(screen.getByLabelText('Confirmar contraseña')).toBeRequired();
    });
});
