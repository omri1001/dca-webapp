// src/views/Reports/components/ReportItem.tsx

import React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReportItemSummary from './ReportItem/ReportItemSummary';
import Grades from './ReportItem/Grades';
import Scenarios from './ReportItem/Scenarios';

export interface IReport {
    _id: string;
    primaryKey: string; // e.g., "931_2025-03-04"
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

    // -------------------------------------------------------------
    // 1) Download DOCX
    //    GET /api/reports/download-doc/:reportId
    // -------------------------------------------------------------
    const handleDownloadDoc = async (reportId: string, primaryKey: string) => {
        try {
            const response = await fetch(`http://localhost:3001/api/reports/download-doc/${reportId}`, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Convert response to a Blob
            const blob = await response.blob();

            // Create a download URL for the blob
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            // Name the file with `primaryKey` if available:
            link.download = primaryKey ? `${primaryKey}.docx` : `report_${reportId}.docx`;
            link.href = downloadUrl;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Error downloading the DOCX:', error);
        }
    };

    // -------------------------------------------------------------
    // 2) Download PDF
    //    GET /api/reports/download-pdf/:reportId
    // -------------------------------------------------------------
    const handleDownloadPdf = async (reportId: string, primaryKey: string) => {
        try {
            const response = await fetch(`http://localhost:3001/api/reports/download-pdf/${reportId}`, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            // Again, name the file with `primaryKey` if available:
            link.download = primaryKey ? `${primaryKey}.pdf` : `report_${reportId}.pdf`;
            link.href = downloadUrl;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Error downloading the PDF:', error);
        }
    };

    // Handlers for add/edit events (placeholders):
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

                    {/* TWO BUTTONS: One for DOCX, one for PDF */}
                    <Box sx={{ marginTop: 2, display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            onClick={() => handleDownloadDoc(report._id, report.primaryKey)}
                        >
                            הורד DOCX
                        </Button>

                        <Button
                            variant="contained"
                            onClick={() => handleDownloadPdf(report._id, report.primaryKey)}
                        >
                            הורד PDF
                        </Button>
                    </Box>
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};

export default ReportItem;
