import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';

interface SummarizeScenariosProps {
    summary: string; // The summary text from your JSON
}

const SummarizeScenarios: React.FC<SummarizeScenariosProps> = ({ summary }) => {
    const theme = useTheme();

    // If the summary string is empty, render nothing
    if (!summary || !summary.trim()) {
        return null;
    }

    return (
        <Box
            dir="rtl"
            sx={{
                mt: 2,
                textAlign: 'right',
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    mb: 2,
                    fontWeight: 'bold',
                    fontFamily: 'Roboto, sans-serif',
                    color: theme.palette.text.primary,
                }}
            >
                סיכום תרחישים
            </Typography>

            <Paper
                elevation={3}
                sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper,
                }}
            >
                <Typography
                    variant="body1"
                    sx={{
                        fontFamily: 'Roboto, sans-serif',
                        color: theme.palette.text.primary,
                        whiteSpace: 'pre-wrap', // Preserves line breaks in the summary text
                        lineHeight: 1.6,
                    }}
                >
                    {summary}
                </Typography>
            </Paper>
        </Box>
    );
};

export default SummarizeScenarios;
