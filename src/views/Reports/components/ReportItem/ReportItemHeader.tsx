// src/components/ReportItemHeader.tsx

import React from 'react';
import { Box, Typography } from '@mui/material';

interface ReportItemHeaderProps {
    primaryKey: string;
    reportType: string;
    battalionName: string;
    platoonSymbol?: string;
    date: string;
    mentorName: string;
    exerciseManagerName: string;
    mission: string;
}

const ReportItemHeader: React.FC<ReportItemHeaderProps> = ({
                                                               primaryKey,
                                                               reportType,
                                                               battalionName,
                                                               platoonSymbol,
                                                               date,
                                                               mentorName,
                                                               exerciseManagerName,
                                                               mission,
                                                           }) => {
    return (
        <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {reportType === 'פלוגה'
                    ? `פלוגה: ${platoonSymbol}`
                    : `גדודי: ${battalionName}`}
            </Typography>
            <Typography variant="body2">מפתח: {primaryKey}</Typography>
            <Typography variant="body2">תאריך: {date}</Typography>
            <Typography variant="body2">מנהל התרגיל: {exerciseManagerName}</Typography>
            <Typography variant="body2">שם חונך: {mentorName}</Typography>
            <Typography variant="body2">משימה: {mission}</Typography>
        </Box>
    );
};

export default ReportItemHeader;
