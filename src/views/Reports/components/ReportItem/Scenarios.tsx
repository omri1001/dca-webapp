import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';

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
    const theme = useTheme();

    // A helper to check if a scenario is valid (non-null and non-empty)
    const isValidScenario = (scenario: Scenario | null) =>
        scenario && scenario.scenarioText.trim() !== '';

    // If neither scenario is valid, render nothing
    if (!isValidScenario(scenario1) && !isValidScenario(scenario2)) {
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
                תרחישי אימון
            </Typography>

            {isValidScenario(scenario1) && (
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
                        variant="subtitle1"
                        sx={{
                            fontWeight: 'bold',
                            fontFamily: 'Roboto, sans-serif',
                            color: theme.palette.text.primary,
                            mb: 1,
                        }}
                    >
                        תרחיש 1:
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            fontFamily: 'Roboto, sans-serif',
                            color: theme.palette.text.primary,
                            whiteSpace: 'pre-wrap',
                            lineHeight: 1.6,
                        }}
                    >
                        {scenario1!.scenarioText}
                    </Typography>
                </Paper>
            )}

            {isValidScenario(scenario2) && (
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
                        variant="subtitle1"
                        sx={{
                            fontWeight: 'bold',
                            fontFamily: 'Roboto, sans-serif',
                            color: theme.palette.text.secondary,
                            mb: 1,
                        }}
                    >
                        תרחיש 2:
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            fontFamily: 'Roboto, sans-serif',
                            color: theme.palette.text.primary,
                            whiteSpace: 'pre-wrap',
                            lineHeight: 1.6,
                        }}
                    >
                        {scenario2!.scenarioText}
                    </Typography>
                </Paper>
            )}
        </Box>
    );
};

export default Scenarios;
