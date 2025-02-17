// ScoreCalcForm.tsx
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


    // Recalculate final grade on any change.
    useEffect(() => {
        const finalGrade = parts.reduce(
            (acc, part) => acc + computePartScore(part),
            0
        );
        onDataChange({ parts, finalGrade });
    }, [parts, onDataChange]);

    // Handler for chronologic items (trafficLight/binary).
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

    // Handler for static items (extra answers).
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
            let extraAnswers: Record<string, any> = {};
            if (item.value && typeof item.value === 'object') {
                extraAnswers = { ...item.value };
            }
            extraAnswers[extraKey] = answer;
            itemsCopy[itemIndex] = {
                ...item,
                active: true,
                value: extraAnswers,
            };
            newParts[partIndex] = { ...newParts[partIndex], items: itemsCopy };
            return newParts;
        });
    };

    // Handler to “edit” an answered item.


    // Compute final grade.
    const finalGrade = parts.reduce(
        (acc, part) => acc + computePartScore(part),
        0
    );

    // Build answeredItems list (only include items that are active and belong to the "chronologic" category).
    const answeredItems: { partIndex: number; itemIndex: number; item: any }[] = [];
    parts.forEach((part, partIndex) => {
        part.items.forEach((item, itemIndex) => {
            if (item.active && item.category === 'chronologic') {
                answeredItems.push({ partIndex, itemIndex, item });
            }
        });
    });

    return (
        <Box sx={{ width: '100%', height: '100%', p: 2, boxSizing: 'border-box' }}>
            <Typography variant="h5" gutterBottom>

            </Typography>

            {/* Render the Questions section */}
            <ScoreCalcQuestions
                parts={parts}
                handleItemChoice={handleItemChoice}
                handleExtraAnswer={handleExtraAnswer}
            />

            <Typography variant="h6" sx={{ mt: 2 }}>
                ציון סופי: {finalGrade.toFixed(2)} / 100
            </Typography>

            {/* Render the Answered Items List (only chronologic questions) */}

        </Box>
    );
};

export default ScoreCalcForm;
