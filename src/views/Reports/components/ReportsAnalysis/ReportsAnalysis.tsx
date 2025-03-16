import React, { useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useLocation } from 'react-router-dom';
import GraphForAnalysis from './GraphAverageFinalGrade';
import GraphAverageGradeOne from './GraphAverageGradeOne';
import GraphAverageGradeTwo from './GraphAverageGradeTwo';
import GraphAverageGradePartOne from './GraphAverageGradePartOne';
import GraphAverageGradePartTwo from './GraphAverageGradePartTwo';
import GraphAverageGradePartThree from './GraphAverageGradePartThree';
import DetailedPartsAnalysis from './DetailedPartsAnalysis';
import { IReport } from '../ReportItem';

interface ReportsAnalysisProps {
    reports: IReport[];
}

const ReportsAnalysis: React.FC<ReportsAnalysisProps> = ({ reports }) => {
    const location = useLocation();
    const detailedRef = useRef<HTMLDivElement>(null);

    // Scroll when the URL hash is '#detailedParts'
    useEffect(() => {
        if (location.hash === '#detailedParts' && detailedRef.current) {
            detailedRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [location.hash]);

    // Also listen for a custom event so that repeated clicks trigger scrolling.
    useEffect(() => {
        const handleScrollToDetailed = () => {
            if (detailedRef.current) {
                detailedRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        };
        window.addEventListener('scrollToDetailed', handleScrollToDetailed);
        return () => window.removeEventListener('scrollToDetailed', handleScrollToDetailed);
    }, []);

    // Calculate average final grades for grade1 and grade2.
    let totalGrade1 = 0;
    let countGrade1 = 0;
    let totalGrade2 = 0;
    let countGrade2 = 0;

    reports.forEach(report => {
        if (report.data?.grades) {
            const grade1Value = parseFloat(report.data.grades.grade1?.scoreData?.finalGrade as any);
            const grade2Value = parseFloat(report.data.grades.grade2?.scoreData?.finalGrade as any);
            if (!isNaN(grade1Value)) {
                totalGrade1 += grade1Value;
                countGrade1++;
            }
            if (!isNaN(grade2Value)) {
                totalGrade2 += grade2Value;
                countGrade2++;
            }
        }
    });

    const avgGrade1 = countGrade1 > 0 ? (totalGrade1 / countGrade1).toFixed(2) : 'N/A';
    const avgGrade2 = countGrade2 > 0 ? (totalGrade2 / countGrade2).toFixed(2) : 'N/A';

    // Count reports by reportType.
    const reportTypeCount: { [key: string]: number } = {};
    reports.forEach(report => {
        const type = report.reportType || 'Unknown';
        reportTypeCount[type] = (reportTypeCount[type] || 0) + 1;
    });

    return (
        <Box dir="rtl" sx={{ textAlign: 'right', p: 2 }}>
            <Typography variant="h6" gutterBottom>
                ניתוח אימונים
            </Typography>

            {/* Summary Accordion */}
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>סיכום אימונים</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body1">
                        מספר אימונים: {reports.length}
                    </Typography>
                    <Typography variant="body1">
                        ציון ממוצע לתרחיש 1: {avgGrade1}
                    </Typography>
                    <Typography variant="body1">
                        ציון ממוצע לתרחיש 2: {avgGrade2}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">
                            סיווג לפי סוג אימון:
                        </Typography>
                        <List>
                            {Object.entries(reportTypeCount).map(([type, count]) => (
                                <ListItem key={type} disablePadding>
                                    <ListItemText
                                        primary={`${type}: ${count}`}
                                        primaryTypographyProps={{ align: 'right' }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </AccordionDetails>
            </Accordion>

            {/* Parent Accordion for All Graphs */}
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>גרפים</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {/* GraphForAnalysis Accordion */}
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>גרף ציון סופי עבור כל מסגרת וממוצע</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box>
                                <GraphForAnalysis reports={reports} />
                            </Box>
                        </AccordionDetails>
                    </Accordion>

                    {/* GraphAverageGradeOne Accordion */}
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>גרף ציון תרחיש 2 עבור כל מסגרת וממוצע (GraphAverageGradeOne)</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box>
                                <GraphAverageGradeOne reports={reports} />
                            </Box>
                        </AccordionDetails>
                    </Accordion>

                    {/* GraphAverageGradeTwo Accordion */}
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>גרף ציון תרחיש 2 עבור כל מסגרת וממוצע (GraphAverageGradeTwo)</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box>
                                <GraphAverageGradeTwo reports={reports} />
                            </Box>
                        </AccordionDetails>
                    </Accordion>

                    {/* GraphAverageGradePartOne Accordion */}
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>גרף עבור הישג נדרש - גיבוש תמונת מצב באירוע (GraphAverageGradePartOne)</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box>
                                <GraphAverageGradePartOne reports={reports} />
                            </Box>
                        </AccordionDetails>
                    </Accordion>

                    {/* GraphAverageGradePartTwo Accordion */}
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>גרף עבור הישג נדרש - הפעלת כוחות ומשימות (GraphAverageGradePartTwo)</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box>
                                <GraphAverageGradePartTwo reports={reports} />
                            </Box>
                        </AccordionDetails>
                    </Accordion>

                    {/* GraphAverageGradePartThree Accordion */}
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>גרף ממוצע ציון חלק 3 (GraphAverageGradePartThree)</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box>
                                <GraphAverageGradePartThree reports={reports} />
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </AccordionDetails>
            </Accordion>

            {/* Detailed Parts Analysis Accordion */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>ניתוח חלקים מפורט</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box ref={detailedRef}>
                        <DetailedPartsAnalysis reports={reports} />
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default ReportsAnalysis;
