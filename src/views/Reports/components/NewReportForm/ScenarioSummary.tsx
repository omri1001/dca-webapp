import React, { useState } from 'react';
import { Box, Button, TextField, CircularProgress } from '@mui/material';
import { summarizeText } from '../../controllers/aiController';

interface ScenarioSummaryProps {
    scenario1: string;
    scenario2: string;
    onSummaryGenerated: (summary: string) => void;
}

const ScenarioSummary: React.FC<ScenarioSummaryProps> = ({
                                                             scenario1,
                                                             scenario2,
                                                             onSummaryGenerated,
                                                         }) => {
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState('');

    const handleSummarize = async () => {
        // Only require scenario1 to have text
        if (!scenario1.trim()) return;
        setLoading(true);
        try {
            // Combine the scenario texts conditionally
            let combinedText = `תרחיש 1: ${scenario1}`;
            if (scenario2.trim()) {
                combinedText += `\nתרחיש 2: ${scenario2}`;
            }
            // Call your AI helper to generate a summary
            const generatedSummary = await summarizeText(combinedText);
            setSummary(generatedSummary);
            onSummaryGenerated(generatedSummary);
        } catch (error) {
            console.error('Error generating summary:', error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={handleSummarize} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'סכם תרחישים'}
            </Button>
            {summary && (
                <TextField
                    label="תקציר תרחישים"
                    value={summary}
                    multiline
                    minRows={6} // Increase the number of visible rows
                    fullWidth
                    margin="normal"
                    InputProps={{
                        readOnly: true,
                        sx: { fontSize: '1.2rem' } // Increase font size if desired
                    }}
                />
            )}
        </Box>
    );
};

export default ScenarioSummary;
