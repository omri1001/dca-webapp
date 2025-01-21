// src/components/NewReportForm/NewReportForm.tsx
import React, { useState, useImperativeHandle, useEffect } from 'react';
import { Box, TextField } from '@mui/material';
import ScenarioInputWithAI from './ScenarioInputWithAI';
// Interface for the final data you want to submit:
export interface NewReportData {
    date: string;
    force_name: string;
    manager: string;
    location: string;
    scenarios: {
        scenario_1: string;
        scenario_2: string;
    };
}

// If editing, you may have a similar interface for your "report" (read from DB)
interface IReport {
    _id: string;
    date: string;
    force_name: string;
    manager: string;
    location: string;
    scenarios: {
        scenario_1: string;
        scenario_2: string;
    };
}

interface NewReportFormProps {
    onSubmit: (data: NewReportData) => void;
    initialData?: IReport; // optional prop to pre-fill form if editing
}

const NewReportForm = React.forwardRef<unknown, NewReportFormProps>(
    ({ onSubmit, initialData }, ref) => {
        // State for the fields you want to display
        const [date, setDate] = useState('');
        const [forceName, setForceName] = useState('');
        const [manager, setManager] = useState('');
        const [location, setLocation] = useState('');

        // State for the two scenarios
        // Scenario fields
        const [scenario1, setScenario1] = useState('');
        const [scenario1UseAI, setScenario1UseAI] = useState(false);
        const [scenario2, setScenario2] = useState('');
        const [scenario2UseAI, setScenario2UseAI] = useState(false);

        // If "initialData" is provided (edit mode), populate the fields
        useEffect(() => {
            if (initialData) {
                setDate(initialData.date || '');
                setForceName(initialData.force_name || '');
                setManager(initialData.manager || '');
                setLocation(initialData.location || '');

                setScenario1(initialData.scenarios?.scenario_1 || '');
                setScenario2(initialData.scenarios?.scenario_2 || '');
            }
        }, [initialData]);

        // The function to finalize and submit the form data
        const handleSubmit = () => {
            const data: NewReportData = {
                date,
                force_name: forceName,
                manager,
                location,
                scenarios: {
                    scenario_1: scenario1,
                    scenario_2: scenario2
                }
            };

            onSubmit(data);
        };

        // Expose handleSubmit() to the parent (if using forwardRef)
        useImperativeHandle(ref, () => ({ handleSubmit }));

        return (
            <Box
                component="form"
                sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                {/* Basic fields */}
                <TextField
                    label="תאריך"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="שם הכוח"
                    value={forceName}
                    onChange={(e) => setForceName(e.target.value)}
                />
                <TextField
                    label="מנהל התרגיל"
                    value={manager}
                    onChange={(e) => setManager(e.target.value)}
                />
                <TextField
                    label="מיקום"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />

                {/* Scenario 1 */}
                <ScenarioInputWithAI
                    label="תרחיש ראשון"
                    scenarioText={scenario1}
                    setScenarioText={setScenario1}
                    scenarioUseAI={scenario1UseAI}
                    setScenarioUseAI={setScenario1UseAI}
                />

                {/* Scenario 2 */}
                <ScenarioInputWithAI
                    label="תרחיש שני (אופציונלי)"
                    scenarioText={scenario2}
                    setScenarioText={setScenario2}
                    scenarioUseAI={scenario2UseAI}
                    setScenarioUseAI={setScenario2UseAI}
                />
            </Box>
        );
    }
);

export default NewReportForm;
