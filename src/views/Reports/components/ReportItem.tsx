import React, { useState } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Button,
    Grid,
    Typography,
    CircularProgress,
    Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReportItemSummary from './ReportItem/ReportItemSummary';
import Grades from './ReportItem/Grades';
import Scenarios from './ReportItem/Scenarios';
import FinalGrade from './ReportItem/FinalGrade';

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
        };
    } | null;
}

interface ReportItemProps {
    report: IReport;
}

const ReportItem: React.FC<ReportItemProps> = ({ report }) => {
    // State for download loading indicators
    const [downloadingDoc, setDownloadingDoc] = useState(false);
    const [downloadingPdf, setDownloadingPdf] = useState(false);

    // Default values if report.data is missing
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

    // Download DOCX handler with loading state
    const handleDownloadDoc = async (reportId: string, primaryKey: string) => {
        setDownloadingDoc(true);
        try {
            const response = await fetch(
                `http://localhost:3001/api/reports/download-doc/${reportId}`,
                {
                    method: 'GET',
                }
            );
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = primaryKey
                ? `${primaryKey}.docx`
                : `report_${reportId}.docx`;
            link.href = downloadUrl;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Error downloading the DOCX:', error);
        } finally {
            setDownloadingDoc(false);
        }
    };

    // Download PDF handler with loading state
    const handleDownloadPdf = async (reportId: string, primaryKey: string) => {
        setDownloadingPdf(true);
        try {
            const response = await fetch(
                `http://localhost:3001/api/reports/download-pdf/${reportId}`,
                {
                    method: 'GET',
                }
            );
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = primaryKey
                ? `${primaryKey}.pdf`
                : `report_${reportId}.pdf`;
            link.href = downloadUrl;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Error downloading the PDF:', error);
        } finally {
            setDownloadingPdf(false);
        }
    };

    // Handlers for grade and scenario actions
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
                    mentorName = {report.mentorName}
                    exerciseManagerName={report.exerciseManagerName}
                />
            </AccordionSummary>

            <AccordionDetails>
                <Grid container spacing={2} direction="column">
                    {/* SCENARIO 1 */}
                    <Grid item>
                        <Scenarios
                            scenario1={scenarios.scenario1}
                            scenario2={null}
                            onEditScenario={() => {}}
                            onAddScenario={() => {}}
                        />
                    </Grid>

                    {/* GRADE 1 */}
                    <Grid item>
                        <Grades
                            grade1={grades.grade1}
                            grade2={null}
                            onEditGrade={() => {}}
                            onAddGrade={() => {}}
                        />
                    </Grid>

                    {/* SCENARIO 2 */}
                    <Grid item>
                        <Scenarios
                            scenario1={null}
                            scenario2={scenarios.scenario2}
                            onEditScenario={() => {}}
                            onAddScenario={() => {}}
                        />
                    </Grid>

                    {/* GRADE 2 */}
                    <Grid item>
                        <Grades
                            grade1={null}
                            grade2={grades.grade2}
                            onEditGrade={() => {}}
                            onAddGrade={() => {}}
                        />
                    </Grid>

                    {/* FINAL GRADE GRAPH (inserted after Grade 2) */}
                    <Grid item>
                        <FinalGrade
                            grade1={grades.grade1}
                            grade2={grades.grade2}
                        />
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
