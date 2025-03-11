import React from 'react';
import {
    Card,
    CardHeader,
    CardContent,
    Typography,
    Box,
    useTheme,
} from '@mui/material';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';
import { IReport } from '../ReportItem';

interface GraphFinalGradesProps {
    reports: IReport[];
}

const GraphFinalGrades: React.FC<GraphFinalGradesProps> = ({ reports }) => {
    const theme = useTheme();

    // Helper to safely parse finalGrade values.
    const parseFinalGrade = (grade: any): number => {
        if (typeof grade === 'object' && grade.$numberDouble) {
            return parseFloat(grade.$numberDouble);
        }
        return parseFloat(grade);
    };

    // Create an array for the graph data.
    // For each report, calculate the average final grade from grade1 and grade2,
    // including only grades that exist.
    const data = reports.map(report => {
        let sum = 0;
        let count = 0;

        // Check grade1
        if (report.data?.grades?.grade1?.scoreData?.finalGrade) {
            const fg1 = parseFinalGrade(report.data.grades.grade1.scoreData.finalGrade);
            if (!isNaN(fg1)) {
                sum += fg1;
                count++;
            }
        }
        // Check grade2
        if (report.data?.grades?.grade2?.scoreData?.finalGrade) {
            const fg2 = parseFinalGrade(report.data.grades.grade2.scoreData.finalGrade);
            if (!isNaN(fg2)) {
                sum += fg2;
                count++;
            }
        }
        // If at least one grade exists, calculate average; otherwise use 0.
        const avg = count > 0 ? sum / count : 0;

        // Build the name using gdod and pluga (if pluga exists and is not empty)
        const gdod = report.gdod || '';
        const pluga = report.pluga?.trim();
        const name = gdod
            ? pluga ? `${gdod} ${pluga}` : gdod
            : (report.primaryKey || report._id);

        return {
            name,
            finalGrade: parseFloat(avg.toFixed(2)),
        };
    });

    return (
        <Card
            sx={{
                maxWidth: 800,
                mx: 'auto',
                mt: 3,
                boxShadow: 3,
                backgroundColor: '#333',
                color: '#fff',
            }}
        >
            <CardHeader
                title="ציון סופי ממוצע לכל דוח"
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
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#444" />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 14, fontWeight: 'bold', fill: '#fff' }}
                            interval={0}
                            axisLine={{ stroke: '#999' }}
                            tickLine={{ stroke: '#999' }}
                            dy={8}
                        />
                        <YAxis
                            domain={[0, 100]}
                            allowDecimals={false}
                            tick={{ fontSize: 14, fill: '#fff' }}
                            axisLine={{ stroke: '#999' }}
                            tickLine={{ stroke: '#999' }}
                        />
                        <Tooltip
                            formatter={(value: number) => value.toString()}
                            contentStyle={{
                                backgroundColor: '#444',
                                border: '1px solid #666',
                                color: '#fff',
                            }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Legend
                            wrapperStyle={{ fontSize: 14, color: '#fff' }}
                            align="center"
                            verticalAlign="top"
                            iconSize={14}
                        />
                        <Bar
                            dataKey="finalGrade"
                            name="ציון סופי ממוצע"
                            fill={theme.palette.info.light}
                            radius={[4, 4, 0, 0]}
                            barSize={40}
                        />
                    </BarChart>
                </ResponsiveContainer>
                <Box mt={2}>
                    <Typography variant="body2" align="center" sx={{ color: '#ccc' }}>
                        *הגרף מציג את הציון הסופי הממוצע של הדוחות (מתוך ציון 100)
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default GraphFinalGrades;
