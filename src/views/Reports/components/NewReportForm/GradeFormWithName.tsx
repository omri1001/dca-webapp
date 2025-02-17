import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import ScoreCalcForm, { ScoreCalcFormData } from './ScoreCalcForm';

export interface GradeFormWithNameData {
    name: string;
    scoreData: ScoreCalcFormData;
}

interface GradeFormWithNameProps {
    label: string;
    onDataChange: (data: GradeFormWithNameData) => void;
}

const GradeFormWithName: React.FC<GradeFormWithNameProps> = ({ label, onDataChange }) => {
    const [name, setName] = useState('');
    // Initialize scoreData with default values.
    const [scoreData, setScoreData] = useState<ScoreCalcFormData>({ parts: [], finalGrade: 0 });

    // Notify the parent whenever either "name" or "scoreData" changes.
    useEffect(() => {
        onDataChange({ name, scoreData });
    }, [name, scoreData, onDataChange]);

    return (
        <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>

            </Typography>
            <TextField
                label="הערות"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
            />
            {/*
          Pass the state setter directly as onDataChange for ScoreCalcForm.
          Ensure that ScoreCalcForm calls its onDataChange inside a useEffect
          or on controlled changes so it does not trigger extra renders.
      */}
            <ScoreCalcForm onDataChange={setScoreData} />
        </Box>
    );
};

export default GradeFormWithName;
