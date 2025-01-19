// src/components/NewReportForm/NewReportForm.tsx
import React, { useState, useImperativeHandle, useEffect } from 'react';
import { Box, TextField } from '@mui/material';

import { NewReportData } from '../../models/ReportInterface';
import {
    LocalGradesState,
    computeAverage,
    convertGradesToDbFormat
} from '../../models/gradesUtils';

import ScenarioInputWithAI from './ScenarioInputWithAI';
import GradesSection from './GradesSection';
import { IReport } from '../ReportItem'; // or the correct import path

interface NewReportFormProps {
    onSubmit: (data: NewReportData) => void;
    initialData?: IReport; // optional prop to pre-fill form
}

const NewReportForm = React.forwardRef<unknown, NewReportFormProps>(
    ({ onSubmit, initialData }, ref) => {
        // Basic metadata
        const [date, setDate] = useState('');
        const [time, setTime] = useState('');
        const [forceName, setForceName] = useState('');
        const [manager, setManager] = useState('');
        const [location, setLocation] = useState('');

        // Scenario fields
        const [scenario1, setScenario1] = useState('');
        const [scenario1UseAI, setScenario1UseAI] = useState(false);
        const [scenario2, setScenario2] = useState('');
        const [scenario2UseAI, setScenario2UseAI] = useState(false);

        // Grades
        const [grades, setGrades] = useState<LocalGradesState>({
            'פיקוד ושליטה': {
                items: {
                    '1.1 גיבוש תמונת מצב': 0,
                    '1.2 ניהול הכוח': 0,
                    '1.3 מיקום המפקד': 0
                },
                comment: '',
                average: 0
            },
            'עבודת קשר': {
                items: {
                    "2.1 נדב'ר בסיסי": 0,
                    '2.2 אסרטיביות': 0,
                    '2.3 דיווחים': 0
                },
                comment: '',
                average: 0
            }
        });

        // If we have initialData (editing mode), populate the fields
        useEffect(() => {
            if (initialData) {
                setDate(initialData.date || '');
                setTime(initialData.time || '');
                setForceName(initialData.force_name || '');
                setManager(initialData.manager || '');
                setLocation(initialData.location || '');

                // Scenario
                setScenario1(initialData.scenarios?.scenario_1 || '');
                setScenario1UseAI(false); // you might need logic if you stored the AI usage
                setScenario2(initialData.scenarios?.scenario_2 || '');
                setScenario2UseAI(false);

                // Grades
                if (initialData.grades) {
                    // You may need to convert back from DB format to LocalGradesState.
                    // This example assumes the format is similar enough:
                    const localGrades: LocalGradesState = {};
                    Object.keys(initialData.grades).forEach((catKey) => {
                        const category = initialData.grades[catKey];
                        if (category) {
                            // Convert items from DB format
                            const itemEntries = Object.entries(category.items).reduce(
                                (acc, [k, v]) => {
                                    // v could be a number or { $numberInt / $numberDouble } object
                                    // use parseNumber if you already have it
                                    acc[k] = typeof v === 'number' ? v : 0;
                                    return acc;
                                },
                                {} as Record<string, number>
                            );
                            localGrades[catKey] = {
                                items: itemEntries,
                                comment: category.comment || '',
                                average: category.average || 0
                            };
                        }
                    });
                    setGrades(localGrades);
                }
            }
        }, [initialData]);

        // The function to finalize and submit the form data
        const handleSubmit = () => {
            const primaryKey = date && forceName ? `${date}_${forceName}` : '';

            // Compute averages for each category
            const updatedGrades = { ...grades };
            for (const category in updatedGrades) {
                updatedGrades[category].average = computeAverage(
                    updatedGrades[category].items
                );
            }
            const finalGrades = convertGradesToDbFormat(updatedGrades);

            // Build final object
            const data: NewReportData = {
                primary_key: primaryKey,
                date,
                time,
                force_name: forceName,
                manager,
                location,
                scenarios: {
                    scenario_1: scenario1,
                    scenario_1_AI_used: scenario1UseAI,
                    scenario_2: scenario2,
                    scenario_2_AI_used: scenario2UseAI
                },
                grades: finalGrades
            };

            onSubmit(data);
        };

        // Expose handleSubmit() to the parent
        React.useImperativeHandle(ref, () => ({
            handleSubmit
        }));

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
                    label="שעה"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
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

                {/* Grades */}
                <GradesSection grades={grades} setGrades={setGrades} />
            </Box>
        );
    }
);

export default NewReportForm;
