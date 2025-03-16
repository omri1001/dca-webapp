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
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LabelList,
} from 'recharts';
import { IReport } from '../ReportItem';

interface GraphAverageGradeOneProps {
    reports: IReport[];
}

const GraphAverageGradeOne: React.FC<GraphAverageGradeOneProps> = ({ reports }) => {
    const theme = useTheme();

    // Helper function to safely parse the grade value.
    const parseGrade = (grade: any): number => {
        if (typeof grade === 'object' && grade.$numberDouble) {
            return parseFloat(grade.$numberDouble);
        }
        return parseFloat(grade);
    };

    // Build an array of data points where each point represents a report's grade one.
    const data = reports.map((report) => {
        let gradeOne = 0;
        if (report.data?.grades?.grade1?.scoreData?.finalGrade) {
            const parsedGrade = parseGrade(report.data.grades.grade1.scoreData.finalGrade);
            gradeOne = !isNaN(parsedGrade) ? parsedGrade : 0;
        }
        // Format the grade to two decimals.
        gradeOne = parseFloat(gradeOne.toFixed(2));

        // Construct the label using gdod and pluga (if available)
        const gdod = report.gdod || '';
        const pluga = report.pluga?.trim();
        const name = gdod ? (pluga ? `${gdod} ${pluga}` : gdod) : (report.primaryKey || report._id);
        return { name, value: gradeOne };
    });

    // Calculate the overall average for grade one.
    let sum = 0;
    let count = 0;
    reports.forEach((report) => {
        if (report.data?.grades?.grade1?.scoreData?.finalGrade) {
            const grade = parseGrade(report.data.grades.grade1.scoreData.finalGrade);
            if (!isNaN(grade)) {
                sum += grade;
                count++;
            }
        }
    });
    const overallAvg = count > 0 ? parseFloat((sum / count).toFixed(2)) : 0;

    // Append an extra data point for the overall average.
    data.push({ name: 'ממוצע מדד 1', value: overallAvg });

    // Define a custom legend payload to reflect theme colors.
    const legendPayload = [
        { value: 'ממוצע מדד 1', type: 'square', color: theme.palette.warning.main },
        { value: 'ציון מתחת לממוצע', type: 'square', color: theme.palette.error.main },
        { value: 'ציון מעל לממוצע', type: 'square', color: theme.palette.success.main },
    ];

    return (
        <Card
            sx={{
                maxWidth: 800,
                mx: 'auto',
                mt: 3,
                boxShadow: 3,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
            }}
        >
            <CardHeader
                title="התפלגות ציונים עבור התרגיל הראשון"
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
                            tick={{ fontSize: 14, fill: theme.palette.text.primary }}
                            axisLine={{ stroke: theme.palette.divider }}
                            tickLine={{ stroke: theme.palette.divider }}
                        />
                        <Tooltip
                            formatter={(value: number) => value.toFixed(2)}
                            contentStyle={{
                                backgroundColor: theme.palette.background.paper,
                                border: `1px solid ${theme.palette.divider}`,
                                color: theme.palette.text.primary,
                            }}
                            itemStyle={{ color: theme.palette.text.primary }}
                        />
                        <Legend
                            payload={legendPayload}
                            wrapperStyle={{ fontSize: 14, color: theme.palette.text.primary }}
                            align="center"
                            verticalAlign="top"
                            iconSize={14}
                        />
                        <Bar dataKey="value" name="ציון מדד 1" radius={[4, 4, 0, 0]} barSize={40}>
                            {data.map((entry, index) => {
                                let fillColor = theme.palette.info.light;
                                if (entry.name === 'ממוצע מדד 1') {
                                    fillColor = theme.palette.warning.main;
                                } else if (entry.value < overallAvg) {
                                    fillColor = theme.palette.error.main;
                                } else if (entry.value > overallAvg) {
                                    fillColor = theme.palette.success.main;
                                }
                                return <Cell key={`cell-${index}`} fill={fillColor} />;
                            })}
                            <LabelList
                                dataKey="value"
                                position="top"
                                fill={theme.palette.text.primary}
                                formatter={(value: number) => value.toFixed(2)}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                <Box mt={2}>
                    <Typography
                        variant="body2"
                        align="center"
                        sx={{ color: theme.palette.text.secondary }}
                    >
                        *הגרף מציג את ציון מדד 1 של כל דוח והעמודה האחרונה מציגה את הממוצע
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default GraphAverageGradeOne;
