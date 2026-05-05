import React, { createContext, useState, useContext } from 'react';
import { reportService } from '../services/reportService';

const ReportContext = createContext();

export const useReports = () => useContext(ReportContext);

export const ReportProvider = ({ children }) => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadReports = async (filters = {}) => {
        setLoading(true);
        try {
            const data = await reportService.getAll(filters);
            // TODO: Asegúrate que el backend devuelva un array: [{ id, lat, lng, severity, fireType, visible, address, name, phone, timestamp }]
            setReports(Array.isArray(data) ? data : data.reports || []);
        } catch (err) {
            setError(err.message);
            console.error('Error cargando reportes:', err);
        } finally {
            setLoading(false);
        }
    };

    const addReport = async (reportData, userId) => {
        try {
            await reportService.create({ ...reportData, userId });
            await loadReports();
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const deleteReport = async (id) => {
        try {
            await reportService.delete(id);
            setReports(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const getUserReports = (userId) => reports.filter(r => r.userId === userId);

    return (
        <ReportContext.Provider value={{ reports, loading, error, addReport, deleteReport, getUserReports, loadReports }}>
            {children}
        </ReportContext.Provider>
    );
};
