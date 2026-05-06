import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../../components/pages/home';
import { ReportProvider } from '../../context/ReportContext';
import { ThemeProvider } from '../../context/ThemeContext';

jest.mock('react-leaflet', () => ({
    MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
    TileLayer: () => null,
    Marker: ({ children }) => <div data-testid="marker">{children}</div>,
    Popup: ({ children }) => <div data-testid="popup">{children}</div>,
}));

const renderWithProviders = (ui) => {
    return render(
        <BrowserRouter>
            <ReportProvider>
                <ThemeProvider>{ui}</ThemeProvider>
            </ReportProvider>
        </BrowserRouter>
    );
};

describe('Home Component', () => {
    test('renders welcome heading', () => {
        renderWithProviders(<Home />);
        expect(screen.getByText('Bienvenido a Municipalidad Valle del Sol')).toBeInTheDocument();
    });

    test('renders description text', () => {
        renderWithProviders(<Home />);
        expect(screen.getByText(/Somos una organización comprometida/)).toBeInTheDocument();
    });

    test('renders map button', () => {
        renderWithProviders(<Home />);
        expect(screen.getByRole('button', { name: /reportar un incendio/ })).toBeInTheDocument();
    });

    test('renders news section', () => {
        renderWithProviders(<Home />);
        expect(screen.getByText('Noticias Destacadas')).toBeInTheDocument();
    });

    test('renders news cards', () => {
        renderWithProviders(<Home />);
        const newsCards = screen.getAllByRole('link');
        expect(newsCards.length).toBeGreaterThanOrEqual(5);
    });

    test('news cards have external links', () => {
        renderWithProviders(<Home />);
        const newsLinks = screen.getAllByRole('link');
        newsLinks.forEach(link => {
            expect(link.getAttribute('target')).toBe('_blank');
            expect(link.getAttribute('rel')).toContain('noopener');
        });
    });

    test('renders hero image', () => {
        renderWithProviders(<Home />);
        const heroImg = screen.getByAltText('');
        expect(heroImg).toBeInTheDocument();
        expect(heroImg.tagName).toBe('IMG');
    });
});
