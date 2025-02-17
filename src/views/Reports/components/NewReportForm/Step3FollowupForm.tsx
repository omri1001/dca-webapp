import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import GradeFormWithName from './GradeFormWithName';
import TextTrainingForm from './TextTrainingForm';

interface Step3FollowupFormProps {
    formType: 'grades' | 'scenario';
    slot: 1 | 2;
    onDataChange: (data: any) => void;
    onBack: () => void;
    onSave: () => void;
}

const Step3FollowupForm: React.FC<Step3FollowupFormProps> = ({
                                                                 formType,
                                                                 slot,
                                                                 onDataChange,
                                                                 onBack,
                                                                 onSave,
                                                             }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {formType === 'grades' ? (
                <GradeFormWithName label={`דוח ציונים ${slot}`} onDataChange={onDataChange} />
            ) : (
                <>
                    <Typography variant="h6">הכנסת תמליל</Typography>
                    <TextTrainingForm onDataChange={onDataChange} />
                </>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="outlined" onClick={onBack}>
                    חזור
                </Button>
                <Button variant="contained" onClick={onSave}>
                    שמור והמשך
                </Button>
            </Box>
        </Box>
    );
};

export default Step3FollowupForm;
