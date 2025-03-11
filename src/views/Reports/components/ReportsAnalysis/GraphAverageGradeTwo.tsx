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

interface GraphAverageGradeTwoProps {
    reports: IReport[];
}

const GraphAverageGradeTwo: React.FC<GraphAverageGradeTwoProps> = ({ reports }) => {
    const theme = useTheme();

    // Helper function to safely parse the grade value.
    const parseGrade = (grade: any): number => {
        if (typeof grade === 'object' && grade.$numberDouble) {
            return parseFloat(grade.$numberDouble);
        }
        return parseFloat(grade);
    };

    // Build an array of data points where each data point represents a report's grade two.
    const data = reports.map(report => {
        let gradeTwo = 0;
        if (report.data?.grades?.grade2?.scoreData?.finalGrade) {
            const parsedGrade = parseGrade(report.data.grades.grade2.scoreData.finalGrade);
            gradeTwo = !isNaN(parsedGrade) ? parsedGrade : 0;
        }
        // Construct the label using gdod and pluga (if exists)
        const gdod = report.gdod || '';
        const pluga = report.pluga?.trim();
        const name = gdod ? (pluga ? `${gdod} ${pluga}` : gdod) : (report.primaryKey || report._id);
        return {
            name,
            value: gradeTwo,
        };
    });

    // Calculate the overall average of grade two for all reports.
    let sum = 0;
    let count = 0;
    reports.forEach(report => {
        if (report.data?.grades?.grade2?.scoreData?.finalGrade) {
            const grade = parseGrade(report.data.grades.grade2.scoreData.finalGrade);
            if (!isNaN(grade)) {
                sum += grade;
                count++;
            }
        }
    });
    const average = count > 0 ? parseFloat((sum / count).toFixed(2)) : 0;

    // Append an extra data point for the overall average.
    data.push({ name: 'ממוצע מדד 2', value: average });

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
                title="התפלגות ציונים עבור התרגיל השני"
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
                            dataKey="value"
                            name="ציון מדד 2"
                            fill={theme.palette.info.light}
                            radius={[4, 4, 0, 0]}
                            barSize={40}
                        />
                    </BarChart>
                </ResponsiveContainer>
                <Box mt={2}>
                    <Typography variant="body2" align="center" sx={{ color: '#ccc' }}>
                        *הגרף מציג את ציון מדד 2 של כל דוח והעמודה האחרונה מציגה את הממוצע
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default GraphAverageGradeTwo;
