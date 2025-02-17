// BinaryMethod.tsx
import React from 'react';
import { Button, Box } from '@mui/material';
import { ItemValue } from './questionsModel';

interface AnswerText {
    full: string;
    none: string;
}

interface BinaryMethodProps {
    selectedValue: ItemValue | null;
    onSelectAnswer: (value: ItemValue) => void;
    answerText: AnswerText;
}

const BinaryMethod: React.FC<BinaryMethodProps> = ({
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
                alignItems: 'stretch', // Make both buttons the same height
            }}
        >
            {/* FULL Button */}
            <Button
                size="large"
                variant="contained"
                onClick={() => onSelectAnswer('full')}
                sx={{
                    flex: 1, // each button takes half the width
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

export default BinaryMethod;
