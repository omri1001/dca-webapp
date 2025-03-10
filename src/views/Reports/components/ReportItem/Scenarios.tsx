import React from 'react';
import { Box, Typography } from '@mui/material';

interface Scenario {
    scenarioText: string;
    scenarioUseAI: boolean;
}

interface ScenariosProps {
    scenario1: Scenario | null;
    scenario2: Scenario | null;
    onEditScenario: (scenarioType: 'scenario1' | 'scenario2') => void;
    onAddScenario: (scenarioType: 'scenario1' | 'scenario2') => void;
}

const Scenarios: React.FC<ScenariosProps> = ({
                                                 scenario1,
                                                 scenario2,
                                                 onEditScenario,
                                                 onAddScenario,
                                             }) => {
    // A helper to check if a scenario is valid (non-null and non-empty)
    const isValidScenario = (scenario: Scenario | null) =>
        scenario && scenario.scenarioText.trim() !== '';

    // If neither scenario is valid, render nothing
    if (!isValidScenario(scenario1) && !isValidScenario(scenario2)) {
        return null;
    }

    return (
        <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Typography
                variant="h6"
                sx={{
                    mb: 2,
                    fontWeight: 'bold',
                    fontFamily: 'Roboto, sans-serif',
                    color: '#fffafa',
                }}
            >
                תרחישי אימון
            </Typography>
            {isValidScenario(scenario1) && (
                <Box
                    sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: '#5d5c5c',
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 'bold',
                            fontFamily: 'Roboto, sans-serif',
                            color: '#f8f7f7',
                        }}
                    >
                        תרחיש 1:
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            ml: 2,
                            fontFamily: 'Roboto, sans-serif',
                            color: '#fffdfd',
                        }}
                    >
                        {scenario1!.scenarioText}
                    </Typography>
                </Box>
            )}
            {isValidScenario(scenario2) && (
                <Box
                    sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: '#5d5c5c',
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 'bold',
                            fontFamily: 'Roboto, sans-serif',
                            color: '#c9c9c9',
                        }}
                    >
                        תרחיש 2:
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            ml: 2,
                            fontFamily: 'Roboto, sans-serif',
                            color: '#ffffff',
                        }}
                    >
                        {scenario2!.scenarioText}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default Scenarios;
