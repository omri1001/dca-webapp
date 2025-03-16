import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RightFilterSideBar from './components/RightFilterSideBar';
import ReportItem, { IReport } from './components/ReportItem';
import NewReportDialog from './components/NewReportDialog';
import ReportsAnalysis from './components/ReportsAnalysis/ReportsAnalysis';

interface FilterState {
    freeText?: string;
    gdod?: string;
    pluga?: string;
    gzera?: string;
    mission?: string;
    mentorName?: string;
    date?: string;
    hativa?: string;
    hatmar?: string;
    reportType?: string;
    mefakedHakoah?: string;
}

const CombatReports: React.FC = () => {
    const [reports, setReports] = useState<IReport[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentFilters, setCurrentFilters] = useState<FilterState>({});
    const [openNewReportDialog, setOpenNewReportDialog] = useState(false);

    const buildQueryString = (filters: FilterState): string => {
        const params = new URLSearchParams();
        if (filters.freeText) params.set('freeText', filters.freeText);
        if (filters.gdod) params.set('gdod', filters.gdod);
        if (filters.pluga) params.set('pluga', filters.pluga);
        if (filters.gzera) params.set('gzera', filters.gzera);
        if (filters.mission) params.set('mission', filters.mission);
        if (filters.mentorName) params.set('mentorName', filters.mentorName);
        if (filters.date) params.set('date', filters.date);
        if (filters.hativa) params.set('hativa', filters.hativa);
        if (filters.hatmar) params.set('hatmar', filters.hatmar);
        if (filters.reportType) params.set('reportType', filters.reportType);
        if (filters.mefakedHakoah) params.set('mefakedHakoah', filters.mefakedHakoah);
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
        if (currentFilters.freeText) parts.push(`טקסט חופשי: "${currentFilters.freeText}"`);
        if (currentFilters.gdod) parts.push(`גדוד: "${currentFilters.gdod}"`);
        if (currentFilters.pluga) parts.push(`פלוגה: "${currentFilters.pluga}"`);
        if (currentFilters.gzera) parts.push(`גזרה: "${currentFilters.gzera}"`);
        if (currentFilters.mission) parts.push(`משימה: "${currentFilters.mission}"`);
        if (currentFilters.mentorName) parts.push(`חונך: "${currentFilters.mentorName}"`);
        if (currentFilters.date) parts.push(`תאריך: "${currentFilters.date}"`);
        if (currentFilters.hativa) parts.push(`חטיבה: "${currentFilters.hativa}"`);
        if (currentFilters.hatmar) parts.push(`חטיבה מרחבית: "${currentFilters.hatmar}"`);
        if (currentFilters.reportType) parts.push(`סוג דוח: "${currentFilters.reportType}"`);
        if (currentFilters.mefakedHakoah) parts.push(`מפקד הכוח: "${currentFilters.mefakedHakoah}"`);
        return parts.join(', ');
    };

    const handleOpenNewReportDialog = () => setOpenNewReportDialog(true);
    const handleCloseNewReportDialog = () => setOpenNewReportDialog(false);

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
            {/* Top Bar */}
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
                            {describeFilters() || '(none)'}
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

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenNewReportDialog}
                        sx={{ mb: 6 }}
                    >
                        הכנס דוח חדש
                    </Button>

                    {/* Accordion for Reports */}
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="reports-content"
                            id="reports-header"
                        >
                            <Typography>הצג דוחות</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {reports.length > 0 ? (
                                reports.map((report) => (
                                    <ReportItem key={report._id} report={report} />
                                ))
                            ) : (
                                <Typography>לא נמצאו דוחות</Typography>
                            )}
                        </AccordionDetails>
                    </Accordion>

                    {/* New Accordion for Report Analysis */}
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="analysis-content"
                            id="analysis-header"
                        >
                            <Typography>הצג ניתוח אימונים</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <ReportsAnalysis reports={reports} />
                        </AccordionDetails>
                    </Accordion>
                </Box>

                {/* Right Filter Sidebar */}
                <RightFilterSideBar onFilter={handleFilter} currentFilters={currentFilters} />
            </Box>

            {/* New Report Dialog */}
            <NewReportDialog
                open={openNewReportDialog}
                onClose={handleCloseNewReportDialog}
                onSubmit={handleCreateNewReport}
            />
        </Box>
    );
};

export default CombatReports;
