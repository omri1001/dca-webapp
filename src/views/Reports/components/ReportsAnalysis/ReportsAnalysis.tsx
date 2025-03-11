import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { IReport } from '../ReportItem';
import GraphForAnalysis from './GraphAverageFinalGrade.tsx';
import GraphAverageGradeOne from './GraphAverageGradeOne';
import GraphAverageGradeTwo from './GraphAverageGradeTwo';
import GraphAverageGradePartOne from './GraphAverageGradePartOne.tsx';
import GraphAverageGradePartTwo from './GraphAverageGradePartTwo';
import GraphAverageGradePartThree from './GraphAverageGradePartThree';
interface ReportsAnalysisProps {
    reports: IReport[];
}

const ReportsAnalysis: React.FC<ReportsAnalysisProps> = ({ reports }) => {
    // Calculate average final grade for grade1 and grade2.
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
        <Box sx={{ textAlign: 'right', p: 2 }}>
            <Typography variant="h6" gutterBottom>
                ניתוח דוחות
            </Typography>
            <Typography variant="body1">
                מספר דוחות: {reports.length}
            </Typography>
            <Typography variant="body1">
                ציון ממוצע למדד 1: {avgGrade1}
            </Typography>
            <Typography variant="body1">
                ציון ממוצע למדד 2: {avgGrade2}
            </Typography>
            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">
                    סיווג לפי סוג דוח:
                </Typography>
                <List>
                    {Object.entries(reportTypeCount).map(([type, count]) => (
                        <ListItem key={type} disablePadding>
                            <ListItemText primary={`${type}: ${count}`} />
                        </ListItem>
                    ))}
                </List>
            </Box>
            {/* Render the new GraphForAnalysis component */}
            <Box sx={{ mt: 4 }}>
                <GraphForAnalysis reports={reports} />
            </Box>
            {/* Render the GraphAverageGradeOne component */}
            <Box sx={{ mt: 4 }}>
                <GraphAverageGradeOne reports={reports} />
            </Box>
            <Box sx={{ mt: 4 }}>
                <GraphAverageGradeTwo reports={reports} />
            </Box>
            <Box sx={{ mt: 4 }}>
                <GraphAverageGradePartOne reports={reports} />
            </Box>
            <Box sx={{ mt: 4 }}>
                <GraphAverageGradePartTwo reports={reports} />
            </Box>
            <Box sx={{ mt: 4 }}>
                <GraphAverageGradePartThree reports={reports} />
            </Box>
        </Box>
    );
};

export default ReportsAnalysis;
