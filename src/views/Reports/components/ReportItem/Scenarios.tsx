// src/components/Scenarios.tsx

import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface Scenario {
    scenarioText: string;
    scenarioUseAI: boolean;
}

interface ScenariosProps {
    scenario1: Scenario;
    scenario2: Scenario;
    onEditScenario: (scenarioType: 'scenario1' | 'scenario2') => void;
    onAddScenario: (scenarioType: 'scenario1' | 'scenario2') => void;
}

const Scenarios: React.FC<ScenariosProps> = ({
                                                 scenario1,
                                                 scenario2,
                                                 onEditScenario,
                                                 onAddScenario,
                                             }) => {
    const isEmpty = (text: string) => !text || text.trim() === '';

    return (
        <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
                תרחישי אימון
            </Typography>
            {/* Scenario 1 */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="body1">תרחיש 1:</Typography>
                <Typography variant="body2" sx={{ ml: 2 }}>
                    {isEmpty(scenario1.scenarioText) ? 'אין תרחיש' : scenario1.scenarioText}
                </Typography>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                        isEmpty(scenario1.scenarioText)
                            ? onAddScenario('scenario1')
                            : onEditScenario('scenario1')
                    }
                    sx={{ mt: 1 }}
                >
                    {isEmpty(scenario1.scenarioText) ? 'הוסף תמליל' : 'ערוך תמליל'}
                </Button>
            </Box>
            {/* Scenario 2 */}
            <Box>
                <Typography variant="body1">תרחיש 2:</Typography>
                <Typography variant="body2" sx={{ ml: 2 }}>
                    {isEmpty(scenario2.scenarioText) ? 'אין תרחיש' : scenario2.scenarioText}
                </Typography>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                        isEmpty(scenario2.scenarioText)
                            ? onAddScenario('scenario2')
                            : onEditScenario('scenario2')
                    }
                    sx={{ mt: 1 }}
                >
                    {isEmpty(scenario2.scenarioText) ? 'הוסף תמליל' : 'ערוך תמליל'}
                </Button>
            </Box>
        </Box>
    );
};

export default Scenarios;
