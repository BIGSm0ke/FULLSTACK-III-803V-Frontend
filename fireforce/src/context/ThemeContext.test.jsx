import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';

const TestConsumer = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <div>
            <span data-testid="theme">{theme}</span>
            <button onClick={toggleTheme}>Toggle Theme</button>
        </div>
    );
};

describe('ThemeContext', () => {
    beforeEach(() => {
        localStorage.clear();
        document.body.removeAttribute('data-theme');
    });

    test('starts with light theme', () => {
        render(<ThemeProvider><TestConsumer /></ThemeProvider>);
        expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });

    test('toggles to dark theme', () => {
        render(<ThemeProvider><TestConsumer /></ThemeProvider>);
        act(() => {
            screen.getByText('Toggle Theme').click();
        });
        expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });

    test('toggles back to light theme', () => {
        render(<ThemeProvider><TestConsumer /></ThemeProvider>);
        act(() => {
            screen.getByText('Toggle Theme').click();
            screen.getByText('Toggle Theme').click();
        });
        expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });

    test('sets data-theme attribute on body', () => {
        render(<ThemeProvider><TestConsumer /></ThemeProvider>);
        expect(document.body.getAttribute('data-theme')).toBe('light');
        act(() => {
            screen.getByText('Toggle Theme').click();
        });
        expect(document.body.getAttribute('data-theme')).toBe('dark');
    });

    test('persists theme in localStorage', () => {
        render(<ThemeProvider><TestConsumer /></ThemeProvider>);
        act(() => {
            screen.getByText('Toggle Theme').click();
        });
        expect(localStorage.getItem('theme')).toBe('dark');
    });

    test('loads stored theme from localStorage', () => {
        localStorage.setItem('theme', 'dark');
        render(<ThemeProvider><TestConsumer /></ThemeProvider>);
        expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });
});
