import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ScenarioInputWithAI from './ScenarioInputWithAI';

export interface TextTrainingFormData {
    scenarioText: string;
    scenarioUseAI: boolean;
}

interface TextTrainingFormProps {
    onDataChange: (data: TextTrainingFormData) => void;
}

const TextTrainingForm: React.FC<TextTrainingFormProps> = ({ onDataChange }) => {
    const [scenarioText, setScenarioText] = useState('');
    const [scenarioUseAI, setScenarioUseAI] = useState(false);

    // Update the parent only when the state values change.
    useEffect(() => {
        onDataChange({ scenarioText, scenarioUseAI });
    }, [scenarioText, scenarioUseAI, onDataChange]);

    return (
        <Box>
            <ScenarioInputWithAI
                label="תרחיש אימון"
                scenarioText={scenarioText}
                setScenarioText={setScenarioText}
                scenarioUseAI={scenarioUseAI}
                setScenarioUseAI={setScenarioUseAI}
            />
        </Box>
    );
};

export default TextTrainingForm;
