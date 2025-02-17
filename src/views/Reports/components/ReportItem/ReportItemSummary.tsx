// src/components/item-report/ReportItemSummary.tsx

import React from 'react';
import { Box, Typography } from '@mui/material';

interface ReportItemSummaryProps {
    reportType: string;
    battalionName: string;
    platoonSymbol?: string;
    date: string;
}

const ReportItemSummary: React.FC<ReportItemSummaryProps> = ({
                                                                 reportType,
                                                                 battalionName,
                                                                 platoonSymbol,
                                                                 date,
                                                             }) => {
    return (
        <Box sx={{ textAlign: 'right', width: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {reportType === 'פלוגה'
                    ? `פלוגה: ${platoonSymbol ? platoonSymbol : ''}`
                    : `גדודי: ${battalionName}`}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
                {date}
            </Typography>
        </Box>
    );
};

export default ReportItemSummary;
