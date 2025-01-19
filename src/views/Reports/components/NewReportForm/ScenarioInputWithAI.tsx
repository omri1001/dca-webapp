import React, { useState, useEffect } from 'react';
import {
    TextField,
    Checkbox,
    FormControlLabel,
    CircularProgress,
    Box
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { improveText } from '../../controllers/aiController'; // <-- Import your AI helper here

interface ScenarioInputWithAIProps {
    label: string;                   // e.g. "תרחיש ראשון" or "תרחיש שני (אופציונלי)"
    scenarioText: string;            // Current text for this scenario
    setScenarioText: (txt: string) => void;  // Callback to update scenario text in the parent
    scenarioUseAI: boolean;          // Whether the AI checkbox is checked
    setScenarioUseAI: (useAI: boolean) => void; // Update the parent's AI usage state
}

/**
 * Renders:
 *  - A TextField for the scenario
 *  - A "Use AI" checkbox
 *  - A loading indicator (circular) over the text field when calling GPT
 *  - A green check validation once the text is improved
 */
const ScenarioInputWithAI: React.FC<ScenarioInputWithAIProps> = ({
                                                                     label,
                                                                     scenarioText,
                                                                     setScenarioText,
                                                                     scenarioUseAI,
                                                                     setScenarioUseAI
                                                                 }) => {
    const [loading, setLoading] = useState(false);
    const [aiSuccess, setAiSuccess] = useState(false);

    // If user toggles AI OFF, remove any "success" check mark
    useEffect(() => {
        if (!scenarioUseAI) {
            setAiSuccess(false);
        }
    }, [scenarioUseAI]);

    // Handle toggling the AI usage checkbox
    const handleAIChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setScenarioUseAI(checked);

        // If turning AI on AND scenario text is non-empty, call GPT
        if (checked && scenarioText.trim()) {
            try {
                setLoading(true);
                const improved = await improveText(scenarioText);
                setScenarioText(improved);
                setAiSuccess(true); // Mark AI improvement as successful
            } catch (error) {
                console.error('Error improving text via AI:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    // If the user edits the scenario text after AI improvement,
    // consider resetting the success check mark
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setScenarioText(e.target.value);
        setAiSuccess(false); // remove success check once user changes text
    };

    return (
        <Box sx={{ mb: 3 }}>
            <Box sx={{ position: 'relative' }}>
                {/* Text field is disabled while loading to prevent edits */}
                <TextField
                    label={label}
                    value={scenarioText}
                    onChange={handleTextChange}
                    multiline
                    rows={4}
                    fullWidth
                    disabled={loading}
                />

                {/* Show circular spinner over the text field if loading */}
                {loading && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        <CircularProgress />
                    </Box>
                )}

                {/* Show a green check icon if the AI improvement was successful */}
                {!loading && aiSuccess && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8
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
