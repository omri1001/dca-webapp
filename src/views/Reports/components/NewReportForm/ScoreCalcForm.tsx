import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

import { Part, createDefaultParts } from './questionsModel';
import { computePartScore } from './ScoreCalcUtils';
import ScoreCalcQuestions from './ScoreCalcQuestions';

export interface ScoreCalcFormData {
    parts: Part[];
    finalGrade: number;
}

interface ScoreCalcFormProps {
    onDataChange: (data: ScoreCalcFormData) => void;
}

const ScoreCalcForm: React.FC<ScoreCalcFormProps> = ({ onDataChange }) => {
    const [parts, setParts] = useState<Part[]>(() => createDefaultParts());
    const [duatz, setDuatz] = useState<number>(0);

    // Recalculate final grade on any change.
    useEffect(() => {
        const computedGrade = parts.reduce(
            (acc, part) => acc + computePartScore(part),
            0
        );
        // Subtract (duatz * 5) from the computed grade.
        const finalGrade = computedGrade - duatz * 5;
        onDataChange({ parts, finalGrade });
    }, [parts, duatz, onDataChange]);

    // Handler for chronologic items.
    const handleItemChoice = (
        partIndex: number,
        itemIndex: number,
        value: any
    ) => {
        setParts((prev) => {
            const newParts = [...prev];
            const itemsCopy = [...newParts[partIndex].items];
            itemsCopy[itemIndex] = {
                ...itemsCopy[itemIndex],
                active: true,
                value,
            };
            newParts[partIndex] = { ...newParts[partIndex], items: itemsCopy };
            return newParts;
        });
    };

    // Updated handler for static items.
    // If the item has an extra property, update as before.
    // If not, update the value directly (a string) so the button can detect it.
    const handleExtraAnswer = (
        partIndex: number,
        itemIndex: number,
        extraKey: string,
        answer: any
    ) => {
        setParts((prev) => {
            const newParts = [...prev];
            const itemsCopy = [...newParts[partIndex].items];
            const item = itemsCopy[itemIndex];
            if (item.extra) {
                let extraAnswers: Record<string, any> = {};
                if (item.value && typeof item.value === 'object') {
                    extraAnswers = { ...item.value };
                }
                extraAnswers[extraKey] = answer;
                itemsCopy[itemIndex] = { ...item, active: true, value: extraAnswers };
            } else {
                // No extra defined, so update the value directly.
                itemsCopy[itemIndex] = { ...item, active: true, value: answer };
            }
            newParts[partIndex] = { ...newParts[partIndex], items: itemsCopy };
            return newParts;
        });
    };

    // Compute final grade for display.
    const finalGrade =
        parts.reduce((acc, part) => acc + computePartScore(part), 0) - duatz * 5;

    return (
        <Box sx={{ width: '100%', height: '100%', p: 2, boxSizing: 'border-box' }}>
            <Typography variant="h5" gutterBottom></Typography>
            <ScoreCalcQuestions
                parts={parts}
                handleItemChoice={handleItemChoice}
                handleExtraAnswer={handleExtraAnswer}
                duatz={duatz}
                setDuatz={setDuatz}
            />
            <Typography variant="h6" sx={{ mt: 2 }}>
                ציון סופי: {finalGrade.toFixed(2)} / 100
            </Typography>
        </Box>
    );
};

export default ScoreCalcForm;
