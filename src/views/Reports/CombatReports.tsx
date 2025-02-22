// src/views/Reports/CombatReports.tsx

import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import RightFilterSideBar from './components/RightFilterSideBar';
import ReportItem, { IReport } from './components/ReportItem';
import NewReportDialog from './components/NewReportDialog';

interface FilterState {
    freeText?: string;
    forceName?: string;
    date?: string;
}

const CombatReports: React.FC = () => {
    const [reports, setReports] = useState<IReport[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentFilters, setCurrentFilters] = useState<FilterState>({});
    const [openNewReportDialog, setOpenNewReportDialog] = useState(false);

    // Build query string
    const buildQueryString = (filters: FilterState): string => {
        const params = new URLSearchParams();
        if (filters.freeText) params.set('freeText', filters.freeText);
        if (filters.forceName) params.set('forceName', filters.forceName);
        if (filters.date) params.set('date', filters.date);
        return params.toString();
    };

    const fetchData = async (filters: FilterState = {}) => {
        try {
            setError(null);
            const qs = buildQueryString(filters);
            const url = qs
                ? `http://localhost:3001/api/reports/filter?${qs}`
                : `http://localhost:3001/api/reports`;

            const res = await fetch(url);
            const data = await res.json();

            if (data.success) {
                setReports(data.data);
            } else {
                setError('Failed to fetch reports.');
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchData({});
    }, []);

    const handleFilter = (filters: FilterState) => {
        setCurrentFilters(filters);
        fetchData(filters);
    };

    const describeFilters = () => {
        const parts: string[] = [];
        if (currentFilters.freeText)
            parts.push(`טקסט חופשי: "${currentFilters.freeText}"`);
        if (currentFilters.forceName)
            parts.push(`מסגרת: "${currentFilters.forceName}"`);
        if (currentFilters.date) parts.push(`תאריך: "${currentFilters.date}"`);
        return parts.join(', ');
    };

    const handleOpenNewReportDialog = () => setOpenNewReportDialog(true);
    const handleCloseNewReportDialog = () => setOpenNewReportDialog(false);

    // If you still want to handle final data from the new forms,
    // you can do so in onSubmit, but we've removed the "שלח" button in the dialog,
    // so you'd have to manually call onSubmit from inside ScoreCalcForm or TextTrainingForm if needed.
    const handleCreateNewReport = async (data: any) => {
        try {
            setError(null);
            const res = await fetch('http://localhost:3001/api/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const resData = await res.json();

            if (!res.ok || !resData.success) {
                setError(resData.message || 'Error creating new report');
                return;
            }

            handleCloseNewReportDialog();
            fetchData(currentFilters);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Mock Top Bar */}
            <Box
                sx={{
                    height: '64px',
                    backgroundColor: '#1976d2',
                    display: 'flex',
                    alignItems: 'center',
                    px: 2,
                    color: '#fff',
                }}
            >
                <Typography variant="h6">מערכת לניהול דוחות אימון</Typography>
            </Box>

            <Box sx={{ display: 'flex', flex: 1 }}>
                <Box sx={{ flex: 1, p: 2, marginRight: '320px' }}>
                    <Typography variant="h5" gutterBottom>
                        סינון לפי:
                    </Typography>
                    {Object.keys(currentFilters).length > 0 && (
                        <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
                            : {describeFilters() || '(none)'}
                        </Typography>
                    )}

                    {reports.length > 0 && !error && (
                        <Typography variant="body2" sx={{ mb: 2, fontWeight: 'bold' }}>
                            נמצאו {reports.length}
                            {reports.length > 1 ? ' דוחות' : ' דוח'}
                        </Typography>
                    )}

                    {error && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            שגיאה: {error}
                        </Typography>
                    )}

                    {reports.length === 0 && !error && (
                        <Typography>לא נמצאו דוחות</Typography>
                    )}

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenNewReportDialog}
                        sx={{ mb: 6 }}
                    >
                        הכנס דוח חדש
                    </Button>

                    {/* Display existing reports */}
                    {reports.map((report) => (
                        <ReportItem key={report._id} report={report} />
                    ))}
                </Box>

                {/* Right Filter Sidebar */}
                <RightFilterSideBar onFilter={handleFilter} currentFilters={currentFilters} />
            </Box>

            {/* The new splitted dialog */}
            <NewReportDialog
                open={openNewReportDialog}
                onClose={handleCloseNewReportDialog}
                onSubmit={handleCreateNewReport}
            />
        </Box>
    );
};

export default CombatReports;
