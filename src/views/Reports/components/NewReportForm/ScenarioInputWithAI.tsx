// src/views/Reports/components/NewReportForm/ScenarioInputWithAI.tsx

import React, { useState, useEffect } from 'react';
import {
    TextField,
    Checkbox,
    FormControlLabel,
    CircularProgress,
    Box,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { improveText } from '../../controllers/aiController'; // <-- Your AI helper

interface ScenarioInputWithAIProps {
    label: string;                   // e.g. "תרחיש אימון"
    scenarioText: string;            // Current text for this scenario
    setScenarioText: (txt: string) => void;  // Callback to update the text in the parent
    scenarioUseAI: boolean;          // Whether the AI checkbox is checked
    setScenarioUseAI: (useAI: boolean) => void; // Callback to update AI usage in the parent
}

const ScenarioInputWithAI: React.FC<ScenarioInputWithAIProps> = ({
                                                                     label,
                                                                     scenarioText,
                                                                     setScenarioText,
                                                                     scenarioUseAI,
                                                                     setScenarioUseAI,
                                                                 }) => {
    const [loading, setLoading] = useState(false);
    const [aiSuccess, setAiSuccess] = useState(false);

    // If user toggles AI off, clear the success indicator
    useEffect(() => {
        if (!scenarioUseAI) {
            setAiSuccess(false);
        }
    }, [scenarioUseAI]);

    // When the AI checkbox is toggled, call GPT to “improve” the text if applicable
    const handleAIChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setScenarioUseAI(checked);

        if (checked && scenarioText.trim()) {
            try {
                setLoading(true);
                const improved = await improveText(scenarioText);
                setScenarioText(improved);
                setAiSuccess(true);
            } catch (error) {
                console.error('Error improving text via AI:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setScenarioText(e.target.value);
        setAiSuccess(false);
    };

    return (
        <Box sx={{ mb: 3 }}>
            <Box sx={{ position: 'relative' }}>
                <TextField
                    label={label}
                    value={scenarioText}
                    onChange={handleTextChange}
                    multiline
                    rows={4}
                    fullWidth
                    disabled={loading}
                />

                {loading && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}
                    >
                        <CircularProgress />
                    </Box>
                )}

                {!loading && aiSuccess && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                        }}
                    >
                        <CheckCircleIcon color="success" />
                    </Box>
                )}
            </Box>

            <FormControlLabel
                control={
                    <Checkbox
                        checked={scenarioUseAI}
                        onChange={handleAIChange}
                        color="primary"
                    />
                }
                label="שימוש בבינה מלאכותית"
            />
        </Box>
    );
};

export default ScenarioInputWithAI;
