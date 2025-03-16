// File: ReportItem.tsx (or wherever your ReportItem component is defined)
import React, { useState } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid,
    Button,
    CircularProgress,
    Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReportItemSummary from './ReportItem/ReportItemSummary';
import Grades from './ReportItem/Grades';
import Scenarios from './ReportItem/Scenarios';
import FinalGrade from './ReportItem/FinalGrade';
import SummarizeScenarios from './ReportItem/SummarizeScenarios'; // <-- Import here

export interface IReport {
    _id: string;
    primaryKey: string;
    reportType: string;
    gdod: string;
    pluga?: string;
    date: string;
    mentorName: string;
    exerciseManagerName: string;
    gzera?: string;
    mission?: string;
    hativa?: string;
    hatmar?: string;
    mefakedHakoah: string;
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
            summary?: string; // <-- Here is our summary
        };
    } | null;
}

interface ReportItemProps {
    report: IReport;
}

const ReportItem: React.FC<ReportItemProps> = ({ report }) => {
    // States for download loading indicators
    const [downloadingDoc, setDownloadingDoc] = useState(false);
    const [downloadingPdf, setDownloadingPdf] = useState(false);

    // Default fallback values
    const defaultGrades = {
        grade1: { name: '', scoreData: { parts: [], finalGrade: 0 } },
        grade2: { name: '', scoreData: { parts: [], finalGrade: 0 } },
    };
    const defaultScenarios = {
        scenario1: { scenarioText: '', scenarioUseAI: false },
        scenario2: { scenarioText: '', scenarioUseAI: false },
        summary: '', // fallback if missing
    };

    // Safely extract scenarios and summary
    const scenarios = report.data?.scenarios || defaultScenarios;
    const summary = scenarios.summary || '';

    // Safely extract grades
    const grades = report.data?.grades || defaultGrades;

    // ... Download handlers, scenario handlers, etc.

    return (
        <Accordion sx={{ marginBottom: 2, border: '1px solid #ccc' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <ReportItemSummary
                    date={report.date}
                    gzera={report.gzera}
                    reportType={report.reportType}
                    gdod={report.gdod}
                    pluga={report.pluga}
                    hatmar={report.hatmar}
                    hativa={report.hativa}
                    mission={report.mission}
                    mefakedHakoah={report.mefakedHakoah}
                    mentorName={report.mentorName}
                    exerciseManagerName={report.exerciseManagerName}
                />
            </AccordionSummary>

            <AccordionDetails>
                <Grid container spacing={2} direction="column">
                    {/* Summarized Scenarios */}
                    <Grid item>
                        <SummarizeScenarios summary={summary} />
                    </Grid>

                    {/* Scenario 1 */}
                    <Grid item>
                        <Scenarios
                            scenario1={scenarios.scenario1}
                            scenario2={null}
                            onEditScenario={() => {}}
                            onAddScenario={() => {}}
                        />
                    </Grid>

                    {/* Grade 1 */}
                    <Grid item>
                        <Grades
                            grade1={grades.grade1}
                            grade2={null}
                            onEditGrade={() => {}}
                            onAddGrade={() => {}}
                        />
                    </Grid>

                    {/* Scenario 2 */}
                    <Grid item>
                        <Scenarios
                            scenario1={null}
                            scenario2={scenarios.scenario2}
                            onEditScenario={() => {}}
                            onAddScenario={() => {}}
                        />
                    </Grid>

                    {/* Grade 2 */}
                    <Grid item>
                        <Grades
                            grade1={null}
                            grade2={grades.grade2}
                            onEditGrade={() => {}}
                            onAddGrade={() => {}}
                        />
                    </Grid>

                    {/* Final Grade Graph */}
                    <Grid item>
                        <FinalGrade grade1={grades.grade1} grade2={grades.grade2} />
                    </Grid>

                    <Grid item>
                        <Divider />
                    </Grid>

                    {/* Download Buttons */}
                    <Grid item container spacing={2} justifyContent="flex-end">
                        <Grid item>
                            <Button
                                variant="contained"
                                onClick={() => {}}
                                disabled={downloadingDoc}
                            >
                                {downloadingDoc ? <CircularProgress size={20} /> : 'הורד DOCX'}
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                onClick={() => {}}
                                disabled={downloadingPdf}
                            >
                                {downloadingPdf ? <CircularProgress size={20} /> : 'הורד PDF'}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>
    );
};

export default ReportItem;
