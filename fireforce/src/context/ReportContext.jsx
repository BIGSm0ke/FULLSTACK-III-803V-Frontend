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

    const addReport = (report) => {
        setReports(prev => [...prev, { ...report, id: Date.now(), timestamp: new Date().toISOString(), fireType: report.fireType, severity: report.severity, visible: report.visible, address: report.address, lat: report.lat, lng: report.lng, name: report.name, phone: report.phone }]);
    };

    return (
        <ReportContext.Provider value={{ reports, addReport }}>
            {children}
        </ReportContext.Provider>
    );
};
