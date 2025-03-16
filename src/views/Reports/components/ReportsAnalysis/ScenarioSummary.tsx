import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

interface ScenarioSummaryProps {
    summary: string;
}

const ScenarioSummary: React.FC<ScenarioSummaryProps> = ({ summary }) => {
    return (
        <Box sx={{ mt: 4, textAlign: 'right' }}>
            <Divider sx={{ mb: 2, borderColor: '#555' }} />
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                סיכום
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {summary}
            </Typography>
        </Box>
    );
};

export default ScenarioSummary;
