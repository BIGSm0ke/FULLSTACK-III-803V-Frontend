import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Alertas from '../../components/pages/alertas';

jest.mock('../../services/alertService', () => ({
    alertService: {
        getAlerts: jest.fn().mockResolvedValue([]),
    },
}));

describe('Alertas Component', () => {
    const mockAlerts = [
        { id: 1, severity: 'alta', fireType: 'forestal', visible: 'humo', address: 'Calle 1', timestamp: '2025-01-01T10:00:00Z' },
        { id: 2, severity: 'baja', fireType: 'casa', visible: 'llamas', address: 'Calle 2', timestamp: '2025-01-01T11:00:00Z' },
        { id: 3, severity: 'critica', fireType: 'vehiculo', visible: 'humo_denso', address: 'Calle 3', timestamp: '2025-01-02T12:00:00Z' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders alerts heading', async () => {
        const { alertService } = require('../../services/alertService');
        alertService.getAlerts.mockResolvedValue([]);
        await act(async () => {
            render(<Alertas />);
        });
        expect(screen.getByText(/Alertas Activas/)).toBeInTheDocument();
    });

    test('shows loading state initially', () => {
        const { alertService } = require('../../services/alertService');
        alertService.getAlerts.mockImplementation(() => new Promise(() => {}));
        render(<Alertas />);
        expect(screen.getByText('Cargando alertas...')).toBeInTheDocument();
    });

    test('displays empty message when no alerts', async () => {
        const { alertService } = require('../../services/alertService');
        alertService.getAlerts.mockResolvedValue([]);
        await act(async () => {
            render(<Alertas />);
        });
        await waitFor(() => {
            expect(screen.getByText('No hay alertas que coincidan con los filtros.')).toBeInTheDocument();
        });
    });

    test('renders alert count in heading', async () => {
        const { alertService } = require('../../services/alertService');
        alertService.getAlerts.mockResolvedValue(mockAlerts);
        await act(async () => {
            render(<Alertas />);
        });
        await waitFor(() => {
            expect(screen.getByText('Alertas Activas (3)')).toBeInTheDocument();
        });
    });

    test('has severity filter dropdown', async () => {
        const { alertService } = require('../../services/alertService');
        alertService.getAlerts.mockResolvedValue([]);
        await act(async () => {
            render(<Alertas />);
        });
        await waitFor(() => {
            const selects = screen.getAllByRole('combobox');
            expect(selects.length).toBeGreaterThanOrEqual(1);
        });
    });

    test('has type filter dropdown', async () => {
        const { alertService } = require('../../services/alertService');
        alertService.getAlerts.mockResolvedValue([]);
        await act(async () => {
            render(<Alertas />);
        });
        await waitFor(() => {
            const selects = screen.getAllByRole('combobox');
            expect(selects.length).toBeGreaterThanOrEqual(2);
        });
    });

    test('has date filter input', async () => {
        const { alertService } = require('../../services/alertService');
        alertService.getAlerts.mockResolvedValue([]);
        await act(async () => {
            render(<Alertas />);
        });
        await waitFor(() => {
            const dateInput = screen.getByDisplayValue('');
            expect(dateInput).toHaveAttribute('type', 'date');
        });
    });

    test('has clear filters button', async () => {
        const { alertService } = require('../../services/alertService');
        alertService.getAlerts.mockResolvedValue([]);
        await act(async () => {
            render(<Alertas />);
        });
        await waitFor(() => {
            expect(screen.getByText('Limpiar')).toBeInTheDocument();
        });
    });

    test('renders severity badges for alerts', async () => {
        const { alertService } = require('../../services/alertService');
        alertService.getAlerts.mockResolvedValue(mockAlerts);
        await act(async () => {
            render(<Alertas />);
        });
        await waitFor(() => {
            expect(screen.getByText('CRITICA')).toBeInTheDocument();
            expect(screen.getByText('ALTA')).toBeInTheDocument();
            expect(screen.getByText('BAJA')).toBeInTheDocument();
        });
    });
});
