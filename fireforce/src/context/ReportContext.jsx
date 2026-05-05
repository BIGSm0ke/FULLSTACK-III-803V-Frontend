import React, { createContext, useState, useContext, useEffect } from 'react';

const ReportContext = createContext();

export const useReports = () => useContext(ReportContext);

export const ReportProvider = ({ children }) => {
    const [reports, setReports] = useState(() => {
        const stored = localStorage.getItem('fireReports');
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem('fireReports', JSON.stringify(reports));
    }, [reports]);

    const addReport = (report, userId) => {
        const newReport = { 
            ...report, 
            id: Date.now(), 
            timestamp: new Date().toISOString(),
            userId: userId || null 
        };
        setReports(prev => [...prev, newReport]);
    };

    const deleteReport = (reportId) => {
        setReports(prev => prev.filter(r => r.id !== reportId));
    };

    const getUserReports = (userId) => {
        return reports.filter(r => r.userId === userId);
    };

    return (
        <ReportContext.Provider value={{ reports, addReport, deleteReport, getUserReports }}>
            {children}
        </ReportContext.Provider>
    );
};
