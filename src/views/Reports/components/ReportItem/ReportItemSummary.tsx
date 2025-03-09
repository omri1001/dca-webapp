import React from 'react';
import { Box, Typography } from '@mui/material';

interface ReportItemSummaryProps {
    reportType: string;
    gdod: string;
    pluga?: string;
    date: string;
    hatmar?: string;
    hativa?: string;
    gzera?: string;
    mission?: string;
}

const ReportItemSummary: React.FC<ReportItemSummaryProps> = ({
                                                                 reportType,
                                                                 gdod,
                                                                 pluga,
                                                                 date,
                                                                 hatmar,
                                                                 hativa,
                                                                 gzera,
                                                                 mission,
                                                             }) => {
    const missingText = "מידע לא קיים";

    return (
        <Box sx={{ textAlign: 'right', width: '100%', direction: 'rtl' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                דוח: {reportType || missingText}
            </Typography>
            <Typography variant="body2">תאריך: {date || missingText}</Typography>
            <Typography variant="body2">חטמר: {hatmar || missingText}</Typography>
            <Typography variant="body2">חטיבה: {hativa || missingText}</Typography>
            <Typography variant="body2">גדוד: {gdod || missingText}</Typography>
            <Typography variant="body2">פלוגה: {pluga || missingText}</Typography>
            <Typography variant="body2">גזרה: {gzera || missingText}</Typography>
            <Typography variant="body2">משימה: {mission || missingText}</Typography>
        </Box>
    );
};

export default ReportItemSummary;
