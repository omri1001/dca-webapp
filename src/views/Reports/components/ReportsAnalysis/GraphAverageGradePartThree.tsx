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

interface GraphAverageGradePartThreeProps {
    reports: IReport[];
}

const GraphAverageGradePartThree: React.FC<GraphAverageGradePartThreeProps> = ({ reports }) => {
    const theme = useTheme();

    // Helper function to safely parse a grade value.
    const parseGrade = (grade: any): number => {
        if (typeof grade === 'object' && grade.$numberDouble) {
            return parseFloat(grade.$numberDouble);
        }
        return parseFloat(grade);
    };

    // Build data points for the average grade for part 3 from both grade1 and grade2.
    const data = reports.map(report => {
        let sum = 0;
        let count = 0;

        // Get part 3 from grade1 if available and non-zero.
        const parts1 = report.data?.grades?.grade1?.scoreData?.parts;
        if (Array.isArray(parts1) && parts1[2] && parts1[2].gradeOfPart !== undefined) {
            const gradeVal = parseGrade(parts1[2].gradeOfPart);
            if (!isNaN(gradeVal) && gradeVal !== 0) {
                sum += gradeVal;
                count++;
            }
        }

        // Get part 3 from grade2 if available and non-zero.
        const parts2 = report.data?.grades?.grade2?.scoreData?.parts;
        if (Array.isArray(parts2) && parts2[2] && parts2[2].gradeOfPart !== undefined) {
            const gradeVal = parseGrade(parts2[2].gradeOfPart);
            if (!isNaN(gradeVal) && gradeVal !== 0) {
                sum += gradeVal;
                count++;
            }
        }

        // Compute the average for part 3 using only valid (non-zero) grades.
        const avg = count > 0 ? parseFloat((sum / count).toFixed(2)) : 0;
        // Build the label using gdod and pluga (if available).
        const gdod = report.gdod || '';
        const pluga = report.pluga?.trim();
        const name = gdod ? (pluga ? `${gdod} ${pluga}` : gdod) : (report.primaryKey || report._id);
        return { name, value: avg };
    });

    // Compute the overall average using only non-zero averages.
    let overallSum = 0;
    let overallCount = 0;
    data.forEach(item => {
        if (item.value !== 0) {
            overallSum += item.value;
            overallCount++;
        }
    });
    const overallAvg = overallCount > 0 ? parseFloat((overallSum / overallCount).toFixed(2)) : 0;

    // Append an extra data point for the overall average.
    data.push({ name: 'ממוצע חלק 3', value: overallAvg });

    // (Optional) You can add a custom legend payload if needed:
    // const legendPayload = [
    //   { value: 'ממוצע חלק 3', type: 'square', color: theme.palette.warning.main },
    //   { value: 'ציון מתחת לממוצע', type: 'square', color: theme.palette.error.main },
    //   { value: 'ציון מעל לממוצע', type: 'square', color: theme.palette.success.main },
    // ];

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
                title="ציון מיצוי מכפילי כוח לכל דוח וממוצע"
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
                            domain={[0, 33.3]}
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
                            wrapperStyle={{ fontSize: 14, color: theme.palette.text.primary }}
                            align="center"
                            verticalAlign="top"
                            iconSize={14}
                        />
                        <Bar dataKey="value" name="ציון מיצוי מכפילי כוח" radius={[4, 4, 0, 0]} barSize={40}>
                            {data.map((entry, index) => {
                                let fillColor = theme.palette.info.light;
                                if (entry.name === 'ממוצע חלק 3') {
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
                        * הגרף מציג את ציון מיצוי מכפילי כוח (הממוצע של הציון עבור מיצוי מכפילי כוח בכל דוח, והעמודה האחרונה מציגה את הממוצע הכולל)
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default GraphAverageGradePartThree;
