// TrafficMethod.tsx
import React from 'react';
import { Button, Box } from '@mui/material';
import { ItemValue } from './questionsModel';

interface AnswerText {
    full: string;
    half?: string;
    none: string;
}

interface TrafficMethodProps {
    selectedValue: ItemValue | null;
    onSelectAnswer: (value: ItemValue) => void;
    answerText: AnswerText;
}

/**
 * Renders three large, full–width buttons side-by-side:
 * - 'Full'  (green)
 * - 'Half'  (orange) [only if half text exists]
 * - 'None'  (red)
 * Each button is 1/3 of the parent container’s width.
 */
const TrafficMethod: React.FC<TrafficMethodProps> = ({
                                                         selectedValue,
                                                         onSelectAnswer,
                                                         answerText,
                                                     }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                width: '100%',
                gap: 2,
                mb: 2,
                alignItems: 'stretch', // Ensures all buttons have the same height
            }}
        >
            {/* FULL Button */}
            <Button
                size="large"
                variant="contained"
                onClick={() => onSelectAnswer('full')}
                sx={{
                    flex: 1, // each button takes equal space
                    fontSize: {
                        xs: '1rem',
                        sm: '1.2rem',
                        md: '1.3rem',
                        lg: '1.4rem',
                    },
                    py: 2,
                    backgroundColor: 'green',
                    color: '#fff',
                    border: selectedValue === 'full' ? '3px solid #007bff' : 'none',
                    textTransform: 'none',
                }}
            >
                {answerText.full}
            </Button>

            {/* HALF Button (only if there's half text) */}
            {answerText.half && (
                <Button
                    size="large"
                    variant="contained"
                    onClick={() => onSelectAnswer('half')}
                    sx={{
                        flex: 1,
                        fontSize: {
                            xs: '1rem',
                            sm: '1.2rem',
                            md: '1.3rem',
                            lg: '1.4rem',
                        },
                        py: 2,
                        backgroundColor: 'orange',
                        color: '#fff',
                        border: selectedValue === 'half' ? '3px solid #007bff' : 'none',
                        textTransform: 'none',
                    }}
                >
                    {answerText.half}
                </Button>
            )}

            {/* NONE Button */}
            <Button
                size="large"
                variant="contained"
                onClick={() => onSelectAnswer('none')}
                sx={{
                    flex: 1,
                    fontSize: {
                        xs: '1rem',
                        sm: '1.2rem',
                        md: '1.3rem',
                        lg: '1.4rem',
                    },
                    py: 2,
                    backgroundColor: 'red',
                    color: '#fff',
                    border: selectedValue === 'none' ? '3px solid #007bff' : 'none',
                    textTransform: 'none',
                }}
            >
                {answerText.none}
            </Button>
        </Box>
    );
};

export default TrafficMethod;
