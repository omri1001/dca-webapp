import React from 'react';
import { Card, CardHeader, CardContent, Typography, Box, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LabelList,
} from 'recharts';
import { IReport } from '../ReportItem';

interface GraphFinalGradesProps {
    reports: IReport[];
}

const GraphFinalGrades: React.FC<GraphFinalGradesProps> = ({ reports }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    // Helper to safely parse finalGrade values.
    const parseFinalGrade = (grade: any): number => {
        if (typeof grade === 'object' && grade.$numberDouble) {
            return parseFloat(grade.$numberDouble);
        }
        return parseFloat(grade);
    };

    // Build the graph data.
    const data = reports.map(report => {
        let sum = 0;
        let count = 0;

        if (report.data?.grades?.grade1?.scoreData?.finalGrade) {
            const fg1 = parseFinalGrade(report.data.grades.grade1.scoreData.finalGrade);
            if (!isNaN(fg1)) {
                sum += fg1;
                count++;
            }
        }
        if (report.data?.grades?.grade2?.scoreData?.finalGrade) {
            const fg2 = parseFinalGrade(report.data.grades.grade2.scoreData.finalGrade);
            if (!isNaN(fg2)) {
                sum += fg2;
                count++;
            }
        }
        const avg = count > 0 ? sum / count : 0;
        const gdod = report.gdod || '';
        const pluga = report.pluga?.trim();
        const name = gdod
            ? (pluga ? `${gdod} ${pluga}` : gdod)
            : (report.primaryKey || report._id);
        return {
            id: report.primaryKey || report._id, // unique identifier for linking
            name,
            finalGrade: parseFloat(avg.toFixed(2)),
        };
    });

    // Calculate overall average and append it to the data.
    const overallSum = data.reduce((acc, item) => acc + item.finalGrade, 0);
    const overallAvg = data.length > 0 ? parseFloat((overallSum / data.length).toFixed(2)) : 0;
    data.push({ id: 'overall', name: 'ממוצע סופי', finalGrade: overallAvg });

    const legendPayload = [
        { value: 'ממוצע סופי', type: 'square', color: 'orange' },
        { value: 'ציון מתחת לממוצע', type: 'square', color: 'red' },
        { value: 'ציון מעל לממוצע', type: 'square', color: 'green' },
    ];

    return (
        <Card
            sx={{
                cursor: 'pointer',
                maxWidth: 800,
                mx: 'auto',
                mt: 3,
                boxShadow: 3,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
            }}
        >
            <CardHeader
                title="ציון סופי ממוצע לכל אימון"
                titleTypographyProps={{
                    variant: 'h6',
                    align: 'center',
                    fontWeight: 'bold',
                }}
                sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    py: 1.5,
                }}
            />
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                        barCategoryGap="20%"
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke={theme.palette.divider}
                        />
                        <XAxis
                            dataKey="name"
                            tick={{
                                fontSize: 14,
                                fontWeight: 'bold',
                                fill: theme.palette.text.primary,
                            }}
                            interval={0}
                            axisLine={{ stroke: theme.palette.divider }}
                            tickLine={{ stroke: theme.palette.divider }}
                            dy={8}
                        />
                        <YAxis
                            domain={[0, 100]}
                            allowDecimals={false}
                            tick={{
                                fontSize: 14,
                                fill: theme.palette.text.primary,
                            }}
                            axisLine={{ stroke: theme.palette.divider }}
                            tickLine={{ stroke: theme.palette.divider }}
                        />
                        <Tooltip
                            formatter={(value: number) => value.toString()}
                            contentStyle={{
                                backgroundColor: theme.palette.background.paper,
                                border: `1px solid ${theme.palette.divider}`,
                                color: theme.palette.text.primary,
                            }}
                            itemStyle={{ color: theme.palette.text.primary }}
                        />
                        <Legend
                            payload={legendPayload}
                            wrapperStyle={{
                                fontSize: 14,
                                color: theme.palette.text.primary,
                            }}
                            align="center"
                            verticalAlign="top"
                            iconSize={14}
                        />
                        <Bar
                            dataKey="finalGrade"
                            name="ציון סופי ממוצע"
                            radius={[4, 4, 0, 0]}
                            barSize={40}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={
                                        entry.name === 'ממוצע סופי'
                                            ? 'orange'
                                            : entry.finalGrade < overallAvg
                                                ? 'red'
                                                : entry.finalGrade > overallAvg
                                                    ? 'green'
                                                    : theme.palette.info.light
                                    }
                                    onClick={() => {
                                        // Navigate to the detailed analysis for this report.
                                        navigate(`${window.location.pathname}#${entry.id}`);
                                    }}
                                />
                            ))}
                            <LabelList dataKey="finalGrade" position="top" fill={theme.palette.text.primary} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                <Box mt={2}>
                    <Typography
                        variant="body2"
                        align="center"
                        sx={{ color: theme.palette.text.secondary }}
                    >
                        *הגרף מציג את הציון הסופי הממוצע של הדוחות (מתוך ציון 100)
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default GraphFinalGrades;
