// src/views/Reports/components/ReportItem.tsx

import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReportItemSummary from './ReportItem/ReportItemSummary';
import Grades from './ReportItem/Grades';
import Scenarios from './ReportItem/Scenarios';

export interface IReport {
    _id: string;
    primaryKey: string;
    reportType: string; // 'פלוגה' or 'גדוד'
    battalionName: string;
    platoonSymbol?: string;
    date: string;
    mentorName: string;
    exerciseManagerName: string;
    mission: string;
    data: {
        grades: {
            grade1: any;
            grade2: any;
        };
        scenarios: {
            scenario1: {
                scenarioText: string;
                scenarioUseAI: boolean;
            };
            scenario2: {
                scenarioText: string;
                scenarioUseAI: boolean;
            };
        };
    } | null;
}

interface ReportItemProps {
    report: IReport;
}

const ReportItem: React.FC<ReportItemProps> = ({ report }) => {
    // Provide default data in case report.data is null.
    const defaultGrades = {
        grade1: { name: '', scoreData: { parts: [], finalGrade: 0 } },
        grade2: { name: '', scoreData: { parts: [], finalGrade: 0 } },
    };

    const defaultScenarios = {
        scenario1: { scenarioText: '', scenarioUseAI: false },
        scenario2: { scenarioText: '', scenarioUseAI: false },
    };

    const grades = report.data?.grades || defaultGrades;
    const scenarios = report.data?.scenarios || defaultScenarios;

    // Handlers for add/edit events.
    const handleEditGrade = (gradeType: 'grade1' | 'grade2') => {
        console.log('Edit grade', gradeType);
    };

    const handleAddGrade = (gradeType: 'grade1' | 'grade2') => {
        console.log('Add grade', gradeType);
    };

    const handleEditScenario = (scenarioType: 'scenario1' | 'scenario2') => {
        console.log('Edit scenario', scenarioType);
    };

    const handleAddScenario = (scenarioType: 'scenario1' | 'scenario2') => {
        console.log('Add scenario', scenarioType);
    };

    return (
        <Accordion sx={{ marginBottom: 2, border: '1px solid #ccc', textAlign: 'right' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <ReportItemSummary
                    reportType={report.reportType}
                    battalionName={report.battalionName}
                    platoonSymbol={report.platoonSymbol}
                    date={report.date}
                />
            </AccordionSummary>
            <AccordionDetails>
                <Box sx={{ textAlign: 'right' }}>
                    <Grades
                        grade1={grades.grade1}
                        grade2={grades.grade2}
                        onEditGrade={handleEditGrade}
                        onAddGrade={handleAddGrade}
                    />
                    <Scenarios
                        scenario1={scenarios.scenario1}
                        scenario2={scenarios.scenario2}
                        onEditScenario={handleEditScenario}
                        onAddScenario={handleAddScenario}
                    />
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};

export default ReportItem;
