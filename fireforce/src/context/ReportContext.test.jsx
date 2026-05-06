import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ReportProvider, useReports } from './ReportContext';

jest.mock('../services/reportService', () => ({
    reportService: {
        getAll: jest.fn().mockResolvedValue([]),
        create: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue({}),
    },
}));

const TestConsumer = () => {
    const { reports, addReport, deleteReport, getUserReports, loadReports } = useReports();
    const [reportId, setReportId] = React.useState(null);

    const handleAdd = async () => {
        const newReport = { id: 'report_' + Date.now(), type: 'incendio', severity: 'alta', userId: 'user1' };
        await addReport({ type: 'incendio', severity: 'alta' }, 'user1');
        setReportId(newReport.id);
    };

    const handleDelete = async () => {
        const userReports = getUserReports('user1');
        if (userReports.length > 0) {
            await deleteReport(userReports[0].id);
        }
    };

    return (
        <div>
            <span data-testid="report-count">{reports.length}</span>
            <button onClick={handleAdd}>Add Report</button>
            <button onClick={() => loadReports()}>Load Reports</button>
            <button onClick={handleDelete}>Delete First</button>
            <div data-testid="user-reports">User reports: {getUserReports('user1').length}</div>
        </div>
    );
};

describe('ReportContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('starts with empty reports', () => {
        render(<ReportProvider><TestConsumer /></ReportProvider>);
        expect(screen.getByTestId('report-count')).toHaveTextContent('0');
    });

    test('getUserReports returns empty for no reports', () => {
        render(<ReportProvider><TestConsumer /></ReportProvider>);
        expect(screen.getByTestId('user-reports')).toHaveTextContent('User reports: 0');
    });

    test('loadReports calls the service', async () => {
        const { reportService } = require('../services/reportService');
        render(<ReportProvider><TestConsumer /></ReportProvider>);
        await act(async () => {
            screen.getByText('Load Reports').click();
        });
        expect(reportService.getAll).toHaveBeenCalled();
    });
});
